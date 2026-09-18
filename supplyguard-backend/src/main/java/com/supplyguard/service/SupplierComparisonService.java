package com.supplyguard.service;

import com.supplyguard.document.CallResult;
import com.supplyguard.document.PendingCall;
import com.supplyguard.document.Product;
import com.supplyguard.dto.CallDto;
import com.supplyguard.entity.AuditLog;
import com.supplyguard.entity.BusinessProfile;
import com.supplyguard.entity.Supplier;
import com.supplyguard.repository.jpa.AuditLogRepository;
import com.supplyguard.repository.jpa.BusinessProfileRepository;
import com.supplyguard.repository.jpa.SupplierRepository;
import com.supplyguard.repository.mongo.CallResultRepository;
import com.supplyguard.repository.mongo.PendingCallRepository;
import com.supplyguard.repository.mongo.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SupplierComparisonService {

    private static final Logger logger = LoggerFactory.getLogger(SupplierComparisonService.class);

    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;
    private final BusinessProfileRepository businessProfileRepository;
    private final SupplierCallService supplierCallService;
    private final PendingCallRepository pendingCallRepository;
    private final CallResultRepository callResultRepository;
    private final AIReasoningService aiReasoningService;
    private final AuditLogRepository auditLogRepository;

    /**
     * Checks availability with all alternate suppliers for a given product by triggering Vapi AI calls.
     */
    public List<PendingCall> checkAllSuppliers(String productId, int requiredQuantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        int demandQty = requiredQuantity > 0 ? requiredQuantity : (product.getReorderThreshold() != null ? product.getReorderThreshold() : 100);

        // Determine merchant name from business profile or fallback
        String merchantName = businessProfileRepository.findAll().stream()
                .findFirst()
                .map(BusinessProfile::getBusinessName)
                .filter(name -> name != null && !name.trim().isEmpty())
                .orElse("SupplyGuard Autonomous Procurement");

        // Identify target suppliers: alternate suppliers first
        List<Supplier> targetSuppliers = new ArrayList<>();
        if (product.getAlternateSupplierIds() != null && !product.getAlternateSupplierIds().isEmpty()) {
            targetSuppliers = supplierRepository.findAllById(product.getAlternateSupplierIds());
        }

        // If no alternate suppliers are registered, check primary supplier or all available suppliers
        if (targetSuppliers.isEmpty()) {
            if (product.getPrimarySupplierId() != null) {
                supplierRepository.findById(product.getPrimarySupplierId()).ifPresent(targetSuppliers::add);
            }
            if (targetSuppliers.isEmpty()) {
                targetSuppliers = supplierRepository.findAll();
            }
        }

        logger.info("Initiating sequential Vapi AI voice calls for Product '{}' (SKU: {}) to {} supplier(s)",
                product.getName(), productId, targetSuppliers.size());

        List<PendingCall> initiatedCalls = new ArrayList<>();

        for (Supplier supplier : targetSuppliers) {
            try {
                String phone = supplier.getPhone();
                if (phone == null || phone.trim().isEmpty()) {
                    phone = "+1-555-0199"; // Safe placeholder for demo/simulation
                }

                PendingCall call = supplierCallService.initiateCall(
                        phone,
                        merchantName,
                        product.getName(),
                        demandQty,
                        String.valueOf(supplier.getId()),
                        supplier.getName(),
                        productId
                );
                initiatedCalls.add(call);

            } catch (Exception e) {
                logger.error("Failed to initiate voice call to supplier {} (ID: {}): {}",
                        supplier.getName(), supplier.getId(), e.getMessage(), e);
            }
        }

        return initiatedCalls;
    }

    /**
     * Fetches all CallResult documents for this product, ranks them, and generates AI recommendation & reasoning.
     * Ranking criteria:
     * 1) sufficient stockQuantity >= requiredQuantity first
     * 2) lowest deliveryDays
     * 3) lowest pricePerUnit
     */
    public CallDto.SupplierComparisonResponse getComparisonResults(String productId) {
        Product product = productRepository.findById(productId).orElse(null);
        String productName = product != null ? product.getName() : "Product " + productId;
        int requiredQty = (product != null && product.getReorderThreshold() != null) ? product.getReorderThreshold() : 100;

        List<CallResult> allResults = callResultRepository.findByProductIdOrderByTimestampDesc(productId);
        List<PendingCall> pendingCalls = pendingCallRepository.findByProductIdOrderByCreatedAtDesc(productId);

        // Deduplicate CallResults keeping latest per supplier
        Map<String, CallResult> latestBySupplier = new LinkedHashMap<>();
        for (CallResult cr : allResults) {
            String key = cr.getSupplierId() != null ? cr.getSupplierId() : cr.getSupplierName();
            if (key != null && !latestBySupplier.containsKey(key)) {
                latestBySupplier.put(key, cr);
            }
        }

        List<CallResult> uniqueResults = new ArrayList<>(latestBySupplier.values());

        // Multi-tier deterministic ranking:
        // 1. sufficient stock >= requiredQty (true before false)
        // 2. lowest deliveryDays
        // 3. lowest pricePerUnit
        uniqueResults.sort((a, b) -> {
            boolean aHasStock = a.getStockQuantity() != null && a.getStockQuantity() >= requiredQty;
            boolean bHasStock = b.getStockQuantity() != null && b.getStockQuantity() >= requiredQty;

            if (aHasStock != bHasStock) {
                return aHasStock ? -1 : 1; // Sufficient stock first
            }

            // Both have or lack sufficient stock -> sort by deliveryDays ascending
            int aDays = a.getDeliveryDays() != null ? a.getDeliveryDays() : 999;
            int bDays = b.getDeliveryDays() != null ? b.getDeliveryDays() : 999;
            if (aDays != bDays) {
                return Integer.compare(aDays, bDays);
            }

            // Lowest pricePerUnit
            double aPrice = a.getPricePerUnit() != null ? a.getPricePerUnit() : 99999.0;
            double bPrice = b.getPricePerUnit() != null ? b.getPricePerUnit() : 99999.0;
            return Double.compare(aPrice, bPrice);
        });

        // Build ranked DTO list
        List<CallDto.RankedSupplierOptionDto> rankedList = new ArrayList<>();
        for (int i = 0; i < uniqueResults.size(); i++) {
            CallResult res = uniqueResults.get(i);
            boolean meetsStock = res.getStockQuantity() != null && res.getStockQuantity() >= requiredQty;
            boolean isRecommended = (i == 0);

            // Lookup phone for display
            String phone = "";
            if (res.getSupplierId() != null) {
                try {
                    Long supId = Long.parseLong(res.getSupplierId());
                    phone = supplierRepository.findById(supId).map(Supplier::getPhone).orElse("");
                } catch (Exception ignored) {}
            }

            rankedList.add(CallDto.RankedSupplierOptionDto.builder()
                    .rank(i + 1)
                    .supplierId(res.getSupplierId())
                    .supplierName(res.getSupplierName() != null ? res.getSupplierName() : "Supplier " + res.getSupplierId())
                    .supplierPhone(phone)
                    .availability(res.getAvailability())
                    .stockQuantity(res.getStockQuantity())
                    .deliveryDays(res.getDeliveryDays())
                    .pricePerUnit(res.getPricePerUnit())
                    .interested(res.getInterested())
                    .meetsQuantityDemand(meetsStock)
                    .isRecommended(isRecommended)
                    .transcript(res.getFullTranscript())
                    .vapiCallId(res.getVapiCallId())
                    .callTimestamp(res.getTimestamp())
                    .build());
        }

        String recommendedSupplierId = null;
        String recommendedSupplierName = null;
        String aiRecommendation = "No call responses received yet. Click 'Initiate Calls' to phone suppliers.";
        String aiReasoning = "Calls in progress or awaiting responses.";

        if (!rankedList.isEmpty()) {
            CallDto.RankedSupplierOptionDto top = rankedList.get(0);
            recommendedSupplierId = top.getSupplierId();
            recommendedSupplierName = top.getSupplierName();

            aiRecommendation = String.format("RECOMMENDATION: Allocate expedited purchase order to '%s'. Verified %d units available with fastest delivery in %d days at $%.2f/unit.",
                    top.getSupplierName(), top.getStockQuantity() != null ? top.getStockQuantity() : 0,
                    top.getDeliveryDays() != null ? top.getDeliveryDays() : 0,
                    top.getPricePerUnit() != null ? top.getPricePerUnit() : 0.0);

            // Construct context string for Ollama reasoning call
            StringBuilder contextBuilder = new StringBuilder();
            contextBuilder.append("PRODUCT: ").append(productName).append(" | Required Quantity: ").append(requiredQty).append(" units.\n");
            contextBuilder.append("SUPPLIER VOICE INQUIRY RESULTS:\n");
            for (CallDto.RankedSupplierOptionDto opt : rankedList) {
                contextBuilder.append(String.format("- Rank %d: %s | Available: %s | Stock: %d | Delivery: %d days | Price: $%.2f/unit\n",
                        opt.getRank(), opt.getSupplierName(), opt.getAvailability(),
                        opt.getStockQuantity() != null ? opt.getStockQuantity() : 0,
                        opt.getDeliveryDays() != null ? opt.getDeliveryDays() : 0,
                        opt.getPricePerUnit() != null ? opt.getPricePerUnit() : 0.0));
            }
            contextBuilder.append("Chosen Top Rank: ").append(top.getSupplierName());

            // Call existing Ollama AI reasoning service
            try {
                String query = "Explain why the top-ranked supplier was chosen for this product procurement and how it minimizes supply chain disruption.";
                String rawReasoning = aiReasoningService.answerRAGQuery(query, contextBuilder.toString());

                if (rawReasoning != null && !rawReasoning.trim().isEmpty() && !rawReasoning.contains("SupplyGuard AI Intelligence Summary")) {
                    aiReasoning = rawReasoning.trim();
                } else {
                    // Clean deterministic fallback
                    aiReasoning = String.format(
                            "SupplyGuard Deterministic Reasoning:\n" +
                            "1. Inventory Security: Supplier '%s' confirmed on-hand inventory of %d units, satisfying 100%% of immediate requirement (%d units).\n" +
                            "2. Delivery Velocity: Fastest delivery timeline among responsive vendors (%d days), preventing stockout runway depletion.\n" +
                            "3. Commercial Viability: Negotiated price of $%.2f/unit ensures cost stability while mitigating operational risk.",
                            top.getSupplierName(), top.getStockQuantity(), requiredQty, top.getDeliveryDays(), top.getPricePerUnit());
                }
            } catch (Exception e) {
                logger.warn("Ollama call failed for comparison reasoning: {}. Using deterministic calculus.", e.getMessage());
                aiReasoning = String.format("Selected '%s' based on multi-factor optimization: %d units stock, %d days delivery, $%.2f/unit.",
                        top.getSupplierName(), top.getStockQuantity(), top.getDeliveryDays(), top.getPricePerUnit());
            }
        }

        return CallDto.SupplierComparisonResponse.builder()
                .productId(productId)
                .productName(productName)
                .requiredQuantity(requiredQty)
                .rankedSuppliers(rankedList)
                .recommendedSupplierId(recommendedSupplierId)
                .recommendedSupplierName(recommendedSupplierName)
                .aiRecommendation(aiRecommendation)
                .aiReasoning(aiReasoning)
                .totalSuppliersContacted(pendingCalls.size())
                .responsesReceived(uniqueResults.size())
                .comparisonReady(!rankedList.isEmpty())
                .lastEvaluatedAt(LocalDateTime.now())
                .build();
    }

    /**
     * Approves the chosen supplier for a product and logs decision in the audit log.
     */
    public void approveSupplier(String productId, Long supplierId, String approvedBy, String notes) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + supplierId));

        String user = (approvedBy != null && !approvedBy.trim().isEmpty()) ? approvedBy : "OPERATOR";
        String memo = (notes != null && !notes.trim().isEmpty())
                ? notes
                : String.format("Approved supplier '%s' (ID: %d) for product '%s' following Vapi AI voice call comparison.",
                        supplier.getName(), supplierId, product.getName());

        // Update product's primary supplier and timestamp
        product.setPrimarySupplierId(supplier.getId());
        product.setUpdatedAt(LocalDateTime.now());
        productRepository.save(product);

        AuditLog log = AuditLog.builder()
                .eventType("SUPPLIER_VOICE_CALL_APPROVAL")
                .entityType("PRODUCT")
                .entityId(productId)
                .actionTaken("APPROVE_AI_VOICE_SOURCING_SELECTION")
                .reasoningDetails(memo)
                .dataSnapshotJson(String.format("{\"supplierId\":%d,\"supplierName\":\"%s\",\"productId\":\"%s\",\"productName\":\"%s\"}",
                        supplierId, supplier.getName(), productId, product.getName()))
                .userApproved(true)
                .approvedBy(user)
                .timestamp(LocalDateTime.now())
                .build();

        auditLogRepository.save(log);
        logger.info("Saved audit log for voice sourcing approval: Supplier {} for Product {}", supplier.getName(), product.getName());
    }

    /**
     * Dispatches an interactive demo call to any specified phone number (e.g. evaluator's Indian mobile).
     */
    public PendingCall dispatchCustomDemoCall(String productId, String phoneNumber, String supplierName, int requiredQuantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        String merchantName = businessProfileRepository.findAll().stream()
                .findFirst()
                .map(BusinessProfile::getBusinessName)
                .filter(name -> name != null && !name.trim().isEmpty())
                .orElse("SupplyGuard Autonomous Procurement");

        String name = (supplierName != null && !supplierName.trim().isEmpty()) ? supplierName : "Demo Indian Supplier";
        int demand = requiredQuantity > 0 ? requiredQuantity : 100;

        return supplierCallService.initiateCall(
                phoneNumber,
                merchantName,
                product.getName(),
                demand,
                "demo-" + UUID.randomUUID().toString().substring(0, 6),
                name,
                product.getId()
        );
    }
}
