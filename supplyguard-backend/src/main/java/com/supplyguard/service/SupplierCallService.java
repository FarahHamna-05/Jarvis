package com.supplyguard.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.supplyguard.document.PendingCall;
import com.supplyguard.repository.mongo.PendingCallRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class SupplierCallService {

    private static final Logger logger = LoggerFactory.getLogger(SupplierCallService.class);

    @Value("${vapi.api.key:your_private_key_here}")
    private String vapiApiKey;

    @Value("${vapi.assistant.id:your_assistant_id_here}")
    private String vapiAssistantId;

    @Value("${vapi.phone.number.id:c8e6322c-c5b4-44b2-a887-289bddea37fa}")
    private String vapiPhoneNumberId;

    @Value("${vapi.base-url:https://api.vapi.ai}")
    private String vapiBaseUrl;

    private final PendingCallRepository pendingCallRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public SupplierCallService(PendingCallRepository pendingCallRepository, RestTemplateBuilder restTemplateBuilder) {
        this.pendingCallRepository = pendingCallRepository;
        this.restTemplate = restTemplateBuilder
                .setConnectTimeout(Duration.ofSeconds(10))
                .setReadTimeout(Duration.ofSeconds(15))
                .build();
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Initiates an outbound voice call to a supplier using Vapi's API.
     * Stores the call record in MongoDB PendingCall collection.
     */
    public PendingCall initiateCall(String supplierPhoneNumber, String merchantName,
                                   String productName, int requiredQuantity,
                                   String supplierId, String productId) {
        LocalDateTime now = LocalDateTime.now();
        String cleanPhone = normalizePhoneNumber(supplierPhoneNumber);
        String safeMerchant = (merchantName != null && !merchantName.trim().isEmpty()) ? merchantName : "SupplyGuard Merchant";
        String safeProduct = (productName != null && !productName.trim().isEmpty()) ? productName : "Critical Component";

        // Validate basic inputs
        if (cleanPhone.isEmpty()) {
            logger.warn("Cannot initiate Vapi call: Supplier ID {} has empty phone number", supplierId);
            PendingCall failedCall = PendingCall.builder()
                    .vapiCallId("uncalled-" + UUID.randomUUID())
                    .supplierId(supplierId)
                    .productId(productId)
                    .productName(safeProduct)
                    .requiredQuantity(requiredQuantity)
                    .status("FAILED")
                    .errorMessage("Supplier phone number is missing or empty")
                    .createdAt(now)
                    .build();
            return pendingCallRepository.save(failedCall);
        }

        // Check for placeholder credentials
        boolean hasValidKey = vapiApiKey != null && !vapiApiKey.trim().isEmpty() && !vapiApiKey.contains("your_private_key_here");
        boolean hasValidAssistant = vapiAssistantId != null && !vapiAssistantId.trim().isEmpty() && !vapiAssistantId.contains("your_assistant_id_here");

        if (!hasValidKey || !hasValidAssistant) {
            String warning = "Vapi credentials not configured. Please set vapi.api.key and vapi.assistant.id in application.properties.";
            logger.warn("Simulation fallback active: {}", warning);

            // Save simulated pending call so downstream flows continue gracefully
            String mockCallId = "vapi-mock-" + UUID.randomUUID().toString().substring(0, 8);
            PendingCall simulatedCall = PendingCall.builder()
                    .vapiCallId(mockCallId)
                    .supplierId(supplierId)
                    .supplierPhone(cleanPhone)
                    .productId(productId)
                    .productName(safeProduct)
                    .requiredQuantity(requiredQuantity)
                    .status("INITIATED")
                    .errorMessage("Simulated initiation (credentials pending in application.properties)")
                    .createdAt(now)
                    .build();
            return pendingCallRepository.save(simulatedCall);
        }

        try {
            String endpoint = vapiBaseUrl + "/call";

            // Build request payload according to Vapi specification
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("assistantId", vapiAssistantId.trim());
            requestBody.put("phoneNumberId", vapiPhoneNumberId != null ? vapiPhoneNumberId.trim() : null);

            Map<String, Object> customer = new HashMap<>();
            customer.put("number", cleanPhone);
            requestBody.put("customer", customer);

            Map<String, Object> variableValues = new HashMap<>();
            variableValues.put("merchantName", safeMerchant);
            variableValues.put("productName", safeProduct);
            variableValues.put("requiredQuantity", requiredQuantity);

            Map<String, Object> assistantOverrides = new HashMap<>();
            assistantOverrides.put("variableValues", variableValues);
            requestBody.put("assistantOverrides", assistantOverrides);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(vapiApiKey.trim());

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            logger.info("Dispatching Vapi outbound call to phone: {} (Supplier: {}, Product: {}, Quantity: {})",
                    cleanPhone, supplierId, safeProduct, requiredQuantity);

            ResponseEntity<String> response = restTemplate.exchange(endpoint, HttpMethod.POST, entity, String.class);

            String vapiCallId = null;
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                if (root.has("id")) {
                    vapiCallId = root.get("id").asText();
                } else if (root.has("callId")) {
                    vapiCallId = root.get("callId").asText();
                }
            }

            if (vapiCallId == null) {
                vapiCallId = "vapi-call-" + UUID.randomUUID().toString().substring(0, 8);
            }

            logger.info("Vapi call successfully initiated with ID: {} for supplier {}", vapiCallId, supplierId);

            PendingCall pendingCall = PendingCall.builder()
                    .vapiCallId(vapiCallId)
                    .supplierId(supplierId)
                    .supplierPhone(cleanPhone)
                    .productId(productId)
                    .productName(safeProduct)
                    .requiredQuantity(requiredQuantity)
                    .status("INITIATED")
                    .createdAt(now)
                    .build();

            return pendingCallRepository.save(pendingCall);

        } catch (Exception ex) {
            String errorMsg = "Failed to dispatch Vapi voice call: " + ex.getMessage();
            logger.error(errorMsg, ex);

            PendingCall failedCall = PendingCall.builder()
                    .vapiCallId("failed-" + UUID.randomUUID().toString().substring(0, 8))
                    .supplierId(supplierId)
                    .supplierPhone(cleanPhone)
                    .productId(productId)
                    .productName(safeProduct)
                    .requiredQuantity(requiredQuantity)
                    .status("FAILED")
                    .errorMessage(errorMsg)
                    .createdAt(now)
                    .build();

            return pendingCallRepository.save(failedCall);
        }
    }

    /**
     * Normalizes phone numbers to standard E.164 format (+[country_code][number]).
     * Automatically handles Indian numbers (10 digits, with/without 0 or +91).
     */
    public static String normalizePhoneNumber(String raw) {
        if (raw == null || raw.trim().isEmpty()) {
            return "";
        }
        String cleaned = raw.replaceAll("[^0-9+]", "");
        if (cleaned.startsWith("+")) {
            return cleaned;
        }
        // Indian 10-digit mobile number -> prepend +91
        if (cleaned.length() == 10) {
            return "+91" + cleaned;
        }
        // Indian number with leading 0 (09876543210) -> strip 0 and prepend +91
        if (cleaned.startsWith("0") && cleaned.length() == 11) {
            return "+91" + cleaned.substring(1);
        }
        // Indian number starting with 91 without plus (919876543210) -> prepend +
        if (cleaned.startsWith("91") && cleaned.length() == 12) {
            return "+" + cleaned;
        }
        return "+" + cleaned;
    }
}
