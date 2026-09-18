package com.supplyguard;

import com.supplyguard.document.Product;
import com.supplyguard.document.SupplierConversation;
import com.supplyguard.entity.RiskEvent;
import com.supplyguard.entity.Supplier;
import com.supplyguard.repository.jpa.AuditLogRepository;
import com.supplyguard.repository.jpa.RiskEventRepository;
import com.supplyguard.repository.jpa.SupplierRepository;
import com.supplyguard.repository.mongo.ProductRepository;
import com.supplyguard.repository.mongo.SupplierConversationRepository;
import com.supplyguard.service.AIReasoningService;
import com.supplyguard.service.CommunicationService;
import com.supplyguard.service.EmailService;
import com.supplyguard.service.impl.SendGridEmailServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class SendGridEmailServiceTest {

    private SendGridEmailServiceImpl sendGridEmailService;
    private SupplierConversationRepository conversationRepository;
    private SupplierRepository supplierRepository;
    private ProductRepository productRepository;
    private RiskEventRepository riskEventRepository;
    private AuditLogRepository auditLogRepository;
    private AIReasoningService aiReasoningService;
    private EmailService emailServiceMock;
    private CommunicationService communicationService;

    @BeforeEach
    void setUp() {
        sendGridEmailService = new SendGridEmailServiceImpl();
        ReflectionTestUtils.setField(sendGridEmailService, "apiKey", "SG.placeholder_api_key");
        ReflectionTestUtils.setField(sendGridEmailService, "fromEmail", "alerts@supplyguard.ai");
        ReflectionTestUtils.setField(sendGridEmailService, "fromName", "SupplyGuard Procurement");

        conversationRepository = mock(SupplierConversationRepository.class);
        supplierRepository = mock(SupplierRepository.class);
        productRepository = mock(ProductRepository.class);
        riskEventRepository = mock(RiskEventRepository.class);
        auditLogRepository = mock(AuditLogRepository.class);
        aiReasoningService = mock(AIReasoningService.class);
        emailServiceMock = mock(EmailService.class);

        communicationService = new CommunicationService(
                conversationRepository,
                supplierRepository,
                productRepository,
                riskEventRepository,
                auditLogRepository,
                aiReasoningService,
                emailServiceMock
        );
    }

    @Test
    void testSendSupplierEmail_EmptyRecipient_FailsGracefully() {
        EmailService.EmailSendResult result = sendGridEmailService.sendSupplierEmail("", "Subject", "Body");

        assertNotNull(result);
        assertFalse(result.isSuccess(), "Should fail when recipient is empty");
        assertEquals(400, result.getStatusCode());
        assertTrue(result.getMessage().contains("Recipient email address cannot be null or empty"));
    }

    @Test
    void testSendSupplierEmail_PlaceholderKey_ReturnsSafeFailureWithoutCrashing() {
        EmailService.EmailSendResult result = sendGridEmailService.sendSupplierEmail("supplier@vendor.com", "Subject", "Body");

        assertNotNull(result);
        assertFalse(result.isSuccess(), "Should not report success with placeholder key");
        assertEquals(401, result.getStatusCode());
        assertTrue(result.getMessage().contains("SendGrid API key is not configured"));
        assertEquals("supplier@vendor.com", result.getToEmail());
    }

    @Test
    void testCommunicationService_CreateDraftAndSend_SuccessFlow() {
        // Setup mocks
        Long riskId = 100L;
        RiskEvent mockEvent = new RiskEvent();
        mockEvent.setId(riskId);
        mockEvent.setProductId("SKU-99");
        mockEvent.setProductName("High Voltage Inverter");
        mockEvent.setSupplierId(5L);
        mockEvent.setSupplierName("Apex Logistics");
        mockEvent.setDaysUntilStockout(4.0);
        mockEvent.setAverageDailyUsage(25.0);
        mockEvent.setSupplierLeadTimeDays(14);

        Supplier mockSupplier = Supplier.builder()
                .id(5L)
                .name("Apex Logistics")
                .contactEmail("apex@supplier.com")
                .status("ACTIVE")
                .build();

        Product mockProduct = Product.builder()
                .id("SKU-99")
                .name("High Voltage Inverter")
                .currentStock(100)
                .build();

        when(riskEventRepository.findById(riskId)).thenReturn(Optional.of(mockEvent));
        when(supplierRepository.findById(5L)).thenReturn(Optional.of(mockSupplier));
        when(productRepository.findById("SKU-99")).thenReturn(Optional.of(mockProduct));
        when(aiReasoningService.generateEmailDraft(any())).thenReturn("Urgent PO Request: expedite 500 units.");

        // Mock successful SendGrid send
        LocalDateTime now = LocalDateTime.now();
        EmailService.EmailSendResult mockSendResult = EmailService.EmailSendResult.builder()
                .success(true)
                .statusCode(202)
                .message("Successfully queued for delivery by SendGrid (HTTP 202 Accepted)")
                .messageId("msg-sg-12345")
                .toEmail("apex@supplier.com")
                .sentAt(now)
                .build();

        when(emailServiceMock.sendSupplierEmail(eq("apex@supplier.com"), anyString(), anyString()))
                .thenReturn(mockSendResult);

        when(conversationRepository.findByRiskEventId(riskId)).thenReturn(Optional.empty());
        when(conversationRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        // Execute
        SupplierConversation savedConvo = communicationService.createEmailDraftForRisk(riskId);

        // Verify
        assertNotNull(savedConvo);
        assertEquals("sent", savedConvo.getLastDeliveryStatus());
        assertEquals(1, savedConvo.getMessages().size());

        SupplierConversation.ConversationMessage msg = savedConvo.getMessages().get(0);
        assertEquals("SENT", msg.getDeliveryStatus());
        assertEquals("sent", msg.getStatus(), "Status field must be 'sent' as required");
        assertEquals("apex@supplier.com", msg.getRecipientEmail());
        assertNotNull(msg.getSentAt());
        assertTrue(msg.getDeliveryDetails().contains("202 Accepted"));

        // Verify MongoDB repository called
        verify(conversationRepository).save(any(SupplierConversation.class));
        verify(auditLogRepository).save(any());
    }

    @Test
    void testCommunicationService_CreateDraftAndSend_WithEmailOverrideForLiveDemo() {
        Long riskId = 101L;
        RiskEvent mockEvent = new RiskEvent();
        mockEvent.setId(riskId);
        mockEvent.setProductId("SKU-01");
        mockEvent.setProductName("Sensor Module");
        mockEvent.setSupplierId(1L);
        mockEvent.setSupplierName("Test Supplier");

        Supplier mockSupplier = Supplier.builder()
                .id(1L)
                .name("Test Supplier")
                .contactEmail("supplier@realdomain.com")
                .build();

        when(riskEventRepository.findById(riskId)).thenReturn(Optional.of(mockEvent));
        when(supplierRepository.findById(1L)).thenReturn(Optional.of(mockSupplier));
        when(productRepository.findById(any())).thenReturn(Optional.empty());
        when(aiReasoningService.generateEmailDraft(any())).thenReturn("AI draft body");

        LocalDateTime now = LocalDateTime.now();
        EmailService.EmailSendResult mockSendResult = EmailService.EmailSendResult.builder()
                .success(true)
                .statusCode(202)
                .message("Queued by SendGrid")
                .toEmail("operator_personal@gmail.com")
                .sentAt(now)
                .build();

        when(emailServiceMock.sendSupplierEmail(eq("operator_personal@gmail.com"), anyString(), anyString()))
                .thenReturn(mockSendResult);
        when(conversationRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        // Call with personal override test email
        SupplierConversation savedConvo = communicationService.createEmailDraftForRisk(riskId, "operator_personal@gmail.com");

        assertNotNull(savedConvo);
        SupplierConversation.ConversationMessage msg = savedConvo.getMessages().get(0);
        assertEquals("operator_personal@gmail.com", msg.getRecipientEmail(), "Must dispatch to personal test override");
        assertEquals("sent", msg.getStatus());
        assertEquals("SENT", msg.getDeliveryStatus());
    }

    @Test
    void testCommunicationService_HandleFailureGracefullyWithoutCrashing() {
        Long riskId = 102L;
        RiskEvent mockEvent = new RiskEvent();
        mockEvent.setId(riskId);
        mockEvent.setProductId("SKU-02");
        mockEvent.setProductName("Relay Switch");
        mockEvent.setSupplierId(2L);

        Supplier mockSupplier = Supplier.builder()
                .id(2L)
                .name("Relay Supplier")
                .contactEmail("relay@supplier.com")
                .build();

        when(riskEventRepository.findById(riskId)).thenReturn(Optional.of(mockEvent));
        when(supplierRepository.findById(2L)).thenReturn(Optional.of(mockSupplier));
        when(aiReasoningService.generateEmailDraft(any())).thenReturn("Draft body");

        // Mock SendGrid rejection (e.g. HTTP 403 Sender unverified)
        EmailService.EmailSendResult failResult = EmailService.EmailSendResult.builder()
                .success(false)
                .statusCode(403)
                .message("SendGrid rejected message with HTTP 403: The from address does not match a verified Sender Identity.")
                .toEmail("relay@supplier.com")
                .build();

        when(emailServiceMock.sendSupplierEmail(anyString(), anyString(), anyString()))
                .thenReturn(failResult);
        when(conversationRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        SupplierConversation savedConvo = communicationService.createEmailDraftForRisk(riskId);

        assertNotNull(savedConvo);
        assertEquals("failed", savedConvo.getLastDeliveryStatus());
        SupplierConversation.ConversationMessage msg = savedConvo.getMessages().get(0);
        assertEquals("failed", msg.getStatus(), "Status must be 'failed' on delivery rejection");
        assertEquals("FAILED", msg.getDeliveryStatus());
        assertTrue(msg.getDeliveryDetails().contains("403"));

        // Saved to Mongo log without throwing exception
        verify(conversationRepository).save(any(SupplierConversation.class));
    }

    @Test
    void testConfigureGmailAndGetStatus() {
        sendGridEmailService.configureGmail("dhanush.procurement@gmail.com", "abcd efgh ijkl mnop");
        java.util.Map<String, Object> status = sendGridEmailService.getEmailConfigStatus();

        assertEquals("GMAIL_SMTP", status.get("activeProvider"));
        assertEquals(true, status.get("gmailConfigured"));
        assertEquals("dhanush.procurement@gmail.com", status.get("gmailUsername"));
    }
}
