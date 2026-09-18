package com.supplyguard;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.supplyguard.controller.CallWebhookController;
import com.supplyguard.document.CallResult;
import com.supplyguard.document.PendingCall;
import com.supplyguard.document.Product;
import com.supplyguard.dto.CallDto;
import com.supplyguard.entity.AuditLog;
import com.supplyguard.entity.Supplier;
import com.supplyguard.repository.jpa.AuditLogRepository;
import com.supplyguard.repository.jpa.BusinessProfileRepository;
import com.supplyguard.repository.jpa.SupplierRepository;
import com.supplyguard.repository.mongo.CallResultRepository;
import com.supplyguard.repository.mongo.PendingCallRepository;
import com.supplyguard.repository.mongo.ProductRepository;
import com.supplyguard.service.AIReasoningService;
import com.supplyguard.service.SupplierCallService;
import com.supplyguard.service.SupplierComparisonService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class SupplierCallAndComparisonServiceTest {

    private PendingCallRepository pendingCallRepository;
    private CallResultRepository callResultRepository;
    private SupplierRepository supplierRepository;
    private ProductRepository productRepository;
    private BusinessProfileRepository businessProfileRepository;
    private AIReasoningService aiReasoningService;
    private AuditLogRepository auditLogRepository;

    private SupplierCallService supplierCallService;
    private SupplierComparisonService supplierComparisonService;
    private CallWebhookController callWebhookController;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        pendingCallRepository = mock(PendingCallRepository.class);
        callResultRepository = mock(CallResultRepository.class);
        supplierRepository = mock(SupplierRepository.class);
        productRepository = mock(ProductRepository.class);
        businessProfileRepository = mock(BusinessProfileRepository.class);
        aiReasoningService = mock(AIReasoningService.class);
        auditLogRepository = mock(AuditLogRepository.class);
        objectMapper = new ObjectMapper();

        RestTemplateBuilder restTemplateBuilder = mock(RestTemplateBuilder.class, RETURNS_DEEP_STUBS);

        supplierCallService = new SupplierCallService(pendingCallRepository, restTemplateBuilder);
        ReflectionTestUtils.setField(supplierCallService, "vapiApiKey", "your_private_key_here");
        ReflectionTestUtils.setField(supplierCallService, "vapiAssistantId", "your_assistant_id_here");
        ReflectionTestUtils.setField(supplierCallService, "vapiPhoneNumberId", "c8e6322c-c5b4-44b2-a887-289bddea37fa");

        supplierComparisonService = new SupplierComparisonService(
                productRepository,
                supplierRepository,
                businessProfileRepository,
                supplierCallService,
                pendingCallRepository,
                callResultRepository,
                aiReasoningService,
                auditLogRepository
        );

        callWebhookController = new CallWebhookController(
                pendingCallRepository,
                callResultRepository,
                supplierRepository,
                objectMapper
        );
    }

    @Test
    void testInitiateCall_MissingPhone_FailsGracefully() {
        when(pendingCallRepository.save(any(PendingCall.class))).thenAnswer(i -> i.getArgument(0));

        PendingCall call = supplierCallService.initiateCall(
                "", "Merchant Corp", "AI Co-Processor", 500, "1", "PROD-01"
        );

        assertNotNull(call);
        assertEquals("FAILED", call.getStatus());
        assertTrue(call.getErrorMessage().contains("missing or empty"));
    }

    @Test
    void testInitiateCall_PlaceholderCredentials_GracefullySimulates() {
        when(pendingCallRepository.save(any(PendingCall.class))).thenAnswer(i -> i.getArgument(0));

        PendingCall call = supplierCallService.initiateCall(
                "+1-555-0100", "Merchant Corp", "AI Co-Processor", 500, "1", "PROD-01"
        );

        assertNotNull(call);
        assertEquals("INITIATED", call.getStatus());
        assertTrue(call.getVapiCallId().startsWith("vapi-mock-"));
    }

    @Test
    void testCallWebhook_ParsesEndOfCallReport_SavesCallResult() {
        PendingCall pending = PendingCall.builder()
                .vapiCallId("vapi-call-test-99")
                .supplierId("1")
                .productId("PROD-01")
                .productName("Neural Chip X9")
                .status("INITIATED")
                .build();

        when(pendingCallRepository.findByVapiCallId("vapi-call-test-99")).thenReturn(Optional.of(pending));
        when(callResultRepository.save(any(CallResult.class))).thenAnswer(i -> {
            CallResult cr = i.getArgument(0);
            cr.setId("mongo-cr-123");
            return cr;
        });

        Supplier supplier = Supplier.builder().id(1L).name("Apex Micro Corp").build();
        when(supplierRepository.findById(1L)).thenReturn(Optional.of(supplier));

        // Create Vapi end-of-call payload
        ObjectNode root = objectMapper.createObjectNode();
        ObjectNode messageNode = root.putObject("message");
        messageNode.put("type", "end-of-call-report");
        messageNode.putObject("call").put("id", "vapi-call-test-99");
        messageNode.put("transcript", "Hello, we can deliver 500 units in 2 days at $42.50 per unit.");

        ObjectNode structuredData = messageNode.putObject("analysis").putObject("structuredData");
        structuredData.put("availability", true);
        structuredData.put("stockQuantity", 500);
        structuredData.put("deliveryDays", 2);
        structuredData.put("pricePerUnit", 42.5);
        structuredData.put("interested", true);

        ResponseEntity<Map<String, Object>> response = callWebhookController.handleVapiWebhook(root);

        assertEquals(200, response.getStatusCode().value());
        assertEquals("success", response.getBody().get("status"));
        assertEquals("mongo-cr-123", response.getBody().get("callResultId"));

        ArgumentCaptor<CallResult> captor = ArgumentCaptor.forClass(CallResult.class);
        verify(callResultRepository).save(captor.capture());
        CallResult saved = captor.getValue();

        assertEquals(Boolean.TRUE, saved.getAvailability());
        assertEquals(500, saved.getStockQuantity());
        assertEquals(2, saved.getDeliveryDays());
        assertEquals(42.5, saved.getPricePerUnit());
        assertEquals("Apex Micro Corp", saved.getSupplierName());
        assertEquals("COMPLETED", pending.getStatus());
    }

    @Test
    void testComparisonResults_MultiTierRanking_SufficientStockFirst_ThenFastestDelivery_ThenPrice() {
        String productId = "PROD-01";
        Product product = Product.builder()
                .id(productId)
                .name("AI Neural Co-Processor X9")
                .reorderThreshold(200)
                .build();
        when(productRepository.findById(productId)).thenReturn(Optional.of(product));

        // Vendor A: has 100 stock (< 200 required), 1 day delivery, $10/unit
        CallResult crA = CallResult.builder()
                .vapiCallId("c-1")
                .supplierId("1")
                .supplierName("Vendor A (Low Stock)")
                .productId(productId)
                .availability(true)
                .stockQuantity(100) // Insufficient
                .deliveryDays(1)
                .pricePerUnit(10.0)
                .timestamp(LocalDateTime.now().minusMinutes(10))
                .build();

        // Vendor B: has 300 stock (>= 200 required), 4 days delivery, $45/unit
        CallResult crB = CallResult.builder()
                .vapiCallId("c-2")
                .supplierId("2")
                .supplierName("Vendor B (Sufficient Stock)")
                .productId(productId)
                .availability(true)
                .stockQuantity(300) // Sufficient!
                .deliveryDays(4)
                .pricePerUnit(45.0)
                .timestamp(LocalDateTime.now().minusMinutes(5))
                .build();

        // Vendor C: has 500 stock (>= 200 required), 2 days delivery, $48/unit
        CallResult crC = CallResult.builder()
                .vapiCallId("c-3")
                .supplierId("3")
                .supplierName("Vendor C (Sufficient & Fast)")
                .productId(productId)
                .availability(true)
                .stockQuantity(500) // Sufficient!
                .deliveryDays(2) // Faster than B!
                .pricePerUnit(48.0)
                .timestamp(LocalDateTime.now().minusMinutes(2))
                .build();

        when(callResultRepository.findByProductIdOrderByTimestampDesc(productId))
                .thenReturn(Arrays.asList(crC, crB, crA));
        when(pendingCallRepository.findByProductIdOrderByCreatedAtDesc(productId))
                .thenReturn(Collections.emptyList());

        when(aiReasoningService.answerRAGQuery(anyString(), anyString()))
                .thenReturn("Vendor C is the optimal choice due to 500 units on-hand and 2-day delivery runway.");

        CallDto.SupplierComparisonResponse response = supplierComparisonService.getComparisonResults(productId);

        assertNotNull(response);
        assertTrue(response.isComparisonReady());
        assertEquals(3, response.getRankedSuppliers().size());

        // Vendor C should be Rank 1 (sufficient stock >= 200 AND lowest delivery days 2)
        assertEquals("Vendor C (Sufficient & Fast)", response.getRankedSuppliers().get(0).getSupplierName());
        assertEquals(1, response.getRankedSuppliers().get(0).getRank());
        assertTrue(response.getRankedSuppliers().get(0).getIsRecommended());

        // Vendor B should be Rank 2 (sufficient stock >= 200, delivery days 4)
        assertEquals("Vendor B (Sufficient Stock)", response.getRankedSuppliers().get(1).getSupplierName());
        assertEquals(2, response.getRankedSuppliers().get(1).getRank());

        // Vendor A should be Rank 3 (insufficient stock < 200)
        assertEquals("Vendor A (Low Stock)", response.getRankedSuppliers().get(2).getSupplierName());
        assertEquals(3, response.getRankedSuppliers().get(2).getRank());
        assertFalse(response.getRankedSuppliers().get(2).getMeetsQuantityDemand());
    }

    @Test
    void testApproveSupplier_SavesAuditLog() {
        String productId = "PROD-01";
        Product product = Product.builder().id(productId).name("AI Chip").build();
        when(productRepository.findById(productId)).thenReturn(Optional.of(product));

        Supplier supplier = Supplier.builder().id(2L).name("Shenzhen Opto").build();
        when(supplierRepository.findById(2L)).thenReturn(Optional.of(supplier));

        supplierComparisonService.approveSupplier(productId, 2L, "Dhanush", "Verified fastest 2-day delivery");

        ArgumentCaptor<AuditLog> logCaptor = ArgumentCaptor.forClass(AuditLog.class);
        verify(auditLogRepository).save(logCaptor.capture());
        AuditLog log = logCaptor.getValue();

        assertEquals("SUPPLIER_VOICE_CALL_APPROVAL", log.getEventType());
        assertEquals("PRODUCT", log.getEntityType());
        assertEquals(productId, log.getEntityId());
        assertEquals("Dhanush", log.getApprovedBy());
        assertTrue(log.getUserApproved());
        assertTrue(log.getReasoningDetails().contains("Verified fastest 2-day delivery"));
    }
}
