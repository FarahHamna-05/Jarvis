package com.supplyguard.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.supplyguard.document.CallResult;
import com.supplyguard.document.PendingCall;
import com.supplyguard.entity.Supplier;
import com.supplyguard.repository.jpa.SupplierRepository;
import com.supplyguard.repository.mongo.CallResultRepository;
import com.supplyguard.repository.mongo.PendingCallRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/calls")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CallWebhookController {

    private static final Logger logger = LoggerFactory.getLogger(CallWebhookController.class);

    private final PendingCallRepository pendingCallRepository;
    private final CallResultRepository callResultRepository;
    private final SupplierRepository supplierRepository;
    private final ObjectMapper objectMapper;

    /**
     * Webhook endpoint called by Vapi when voice calls end or update.
     * Publicly accessible endpoint (configured in SecurityConfig).
     */
    @PostMapping("/webhook")
    public ResponseEntity<Map<String, Object>> handleVapiWebhook(@RequestBody JsonNode payload) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Determine message object (some Vapi payloads wrap in "message")
            JsonNode messageNode = payload.has("message") ? payload.get("message") : payload;
            String messageType = messageNode.has("type") ? messageNode.get("type").asText() : "";

            logger.info("Received Vapi webhook event of type: {}", messageType);

            // We specifically process "end-of-call-report"
            if (!"end-of-call-report".equalsIgnoreCase(messageType)) {
                response.put("status", "ignored");
                response.put("reason", "Event type '" + messageType + "' acknowledged but not end-of-call-report");
                return ResponseEntity.ok(response);
            }

            // Extract Vapi Call ID from multiple potential locations
            String vapiCallId = "";
            if (messageNode.has("call") && messageNode.get("call").has("id")) {
                vapiCallId = messageNode.get("call").get("id").asText();
            } else if (messageNode.has("callId")) {
                vapiCallId = messageNode.get("callId").asText();
            } else if (payload.has("call") && payload.get("call").has("id")) {
                vapiCallId = payload.get("call").get("id").asText();
            } else if (messageNode.has("id")) {
                vapiCallId = messageNode.get("id").asText();
            }

            logger.info("Processing end-of-call report for Vapi Call ID: {}", vapiCallId);

            // Match against PendingCalls in MongoDB
            Optional<PendingCall> pendingCallOpt = !vapiCallId.isEmpty()
                    ? pendingCallRepository.findByVapiCallId(vapiCallId)
                    : Optional.empty();

            String supplierId = pendingCallOpt.map(PendingCall::getSupplierId).orElse(null);
            String productId = pendingCallOpt.map(PendingCall::getProductId).orElse(null);
            String productName = pendingCallOpt.map(PendingCall::getProductName).orElse(null);

            // Fetch supplier name for convenient reference
            String supplierName = "Supplier";
            if (supplierId != null) {
                try {
                    Long supIdNum = Long.parseLong(supplierId);
                    Optional<Supplier> sOpt = supplierRepository.findById(supIdNum);
                    if (sOpt.isPresent()) {
                        supplierName = sOpt.get().getName();
                    }
                } catch (NumberFormatException ignored) {}
            }

            // Extract structured data from analysis.structuredData or directly from message/payload
            JsonNode structuredData = null;
            if (messageNode.has("analysis") && messageNode.get("analysis").has("structuredData")) {
                structuredData = messageNode.get("analysis").get("structuredData");
            } else if (messageNode.has("structuredData")) {
                structuredData = messageNode.get("structuredData");
            } else if (payload.has("analysis") && payload.get("analysis").has("structuredData")) {
                structuredData = payload.get("analysis").get("structuredData");
            } else if (payload.has("structuredData")) {
                structuredData = payload.get("structuredData");
            }

            Boolean availability = null;
            Integer stockQuantity = null;
            Integer deliveryDays = null;
            Double pricePerUnit = null;
            Boolean interested = null;

            if (structuredData != null && !structuredData.isNull()) {
                if (structuredData.has("availability")) {
                    availability = structuredData.get("availability").asBoolean();
                }
                if (structuredData.has("stockQuantity")) {
                    stockQuantity = structuredData.get("stockQuantity").asInt();
                }
                if (structuredData.has("deliveryDays")) {
                    deliveryDays = structuredData.get("deliveryDays").asInt();
                }
                if (structuredData.has("pricePerUnit")) {
                    pricePerUnit = structuredData.get("pricePerUnit").asDouble();
                }
                if (structuredData.has("interested")) {
                    interested = structuredData.get("interested").asBoolean();
                }
            }

            // Extract transcript
            String fullTranscript = "";
            if (messageNode.has("transcript")) {
                fullTranscript = messageNode.get("transcript").asText();
            } else if (messageNode.has("artifact") && messageNode.get("artifact").has("transcript")) {
                fullTranscript = messageNode.get("artifact").get("transcript").asText();
            } else if (payload.has("transcript")) {
                fullTranscript = payload.get("transcript").asText();
            } else if (payload.has("artifact") && payload.get("artifact").has("transcript")) {
                fullTranscript = payload.get("artifact").get("transcript").asText();
            }

            // Extract call status / ended reason
            String callStatus = messageNode.has("endedReason")
                    ? messageNode.get("endedReason").asText()
                    : (payload.has("endedReason") ? payload.get("endedReason").asText() : "completed");

            LocalDateTime now = LocalDateTime.now();

            // Save new CallResult document to MongoDB
            CallResult callResult = CallResult.builder()
                    .vapiCallId(vapiCallId)
                    .supplierId(supplierId)
                    .supplierName(supplierName)
                    .productId(productId)
                    .productName(productName)
                    .availability(availability != null ? availability : Boolean.TRUE)
                    .stockQuantity(stockQuantity != null ? stockQuantity : 0)
                    .deliveryDays(deliveryDays != null ? deliveryDays : 7)
                    .pricePerUnit(pricePerUnit != null ? pricePerUnit : 0.0)
                    .interested(interested != null ? interested : Boolean.TRUE)
                    .fullTranscript(fullTranscript)
                    .callStatus(callStatus)
                    .timestamp(now)
                    .createdAt(now)
                    .build();

            CallResult savedResult = callResultRepository.save(callResult);
            logger.info("Successfully persisted CallResult in MongoDB with ID: {} for supplier {}",
                    savedResult.getId(), supplierName);

            // Update status of the PendingCall document
            if (pendingCallOpt.isPresent()) {
                PendingCall pc = pendingCallOpt.get();
                pc.setStatus("COMPLETED");
                pc.setCompletedAt(now);
                pendingCallRepository.save(pc);
            }

            response.put("status", "success");
            response.put("callResultId", savedResult.getId());
            response.put("vapiCallId", vapiCallId);
            response.put("supplierName", supplierName);
            return ResponseEntity.ok(response);

        } catch (Exception ex) {
            logger.error("Error processing Vapi webhook payload: {}", ex.getMessage(), ex);
            response.put("status", "error");
            response.put("message", ex.getMessage());
            return ResponseEntity.ok(response); // Return 200 to prevent Vapi webhook retries on parse warnings
        }
    }
}
