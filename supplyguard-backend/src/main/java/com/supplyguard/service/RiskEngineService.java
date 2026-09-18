package com.supplyguard.service;

import com.supplyguard.document.Product;
import com.supplyguard.dto.AIContextDto;
import com.supplyguard.entity.AuditLog;
import com.supplyguard.entity.ProductSupplier;
import com.supplyguard.entity.RiskEvent;
import com.supplyguard.entity.Supplier;
import com.supplyguard.repository.jpa.AuditLogRepository;
import com.supplyguard.repository.jpa.ProductSupplierRepository;
import com.supplyguard.repository.jpa.RiskEventRepository;
import com.supplyguard.repository.jpa.SupplierRepository;
import com.supplyguard.repository.mongo.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import com.supplyguard.repository.mongo.PendingCallRepository;
import com.supplyguard.document.PendingCall;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
public class RiskEngineService {

    private static final Logger logger = LoggerFactory.getLogger(RiskEngineService.class);

    private final RiskEventRepository riskEventRepository;
    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;
    private final ProductSupplierRepository productSupplierRepository;
    private final AuditLogRepository auditLogRepository;
    private final AIReasoningService aiReasoningService;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired(required = false)
    @Lazy
    private SupplierComparisonService supplierComparisonService;

    @Autowired(required = false)
    private PendingCallRepository pendingCallRepository;

    public void setSupplierComparisonService(SupplierComparisonService supplierComparisonService) {
        this.supplierComparisonService = supplierComparisonService;
    }

    public void setPendingCallRepository(PendingCallRepository pendingCallRepository) {
        this.pendingCallRepository = pendingCallRepository;
    }

    /**
     * Deterministic risk recalculation for a single product.
     */
    @Transactional
    public RiskEvent evaluateProductRisk(Product product) {
        logger.info("Evaluating risk for product: {} ({})", product.getName(), product.getId());

        // 1. Calculate averageDailyUsage from recentUsage array
        double avgDailyUsage = calculateAverageDailyUsage(product.getRecentUsage());

        // 2. Calculate daysUntilStockout = currentStock / (averageDailyUsage * 1.2 buffer)
        double daysUntilStockout;
        if (avgDailyUsage <= 0.0001) {
            daysUntilStockout = product.getCurrentStock() > 0 ? 999.0 : 0.0;
        } else {
            daysUntilStockout = product.getCurrentStock() / (avgDailyUsage * 1.2);
        }

        // 3. Fetch Primary Supplier
        Supplier primarySupplier = null;
        if (product.getPrimarySupplierId() != null) {
            primarySupplier = supplierRepository.findById(product.getPrimarySupplierId()).orElse(null);
        }

        int leadTimeDays = primarySupplier != null && primarySupplier.getLeadTimeDays() != null
                ? primarySupplier.getLeadTimeDays()
                : 14;
        String supplierStatus = primarySupplier != null && primarySupplier.getStatus() != null
                ? primarySupplier.getStatus()
                : "ACTIVE";

        // 4. Deterministic Severity Classification
        String severity = classifySeverity(daysUntilStockout, leadTimeDays, supplierStatus);

        // 5. Build reason description
        String reason = buildDeterministicReason(severity, daysUntilStockout, leadTimeDays, supplierStatus, avgDailyUsage, product.getCurrentStock());

        // 6. Build Context for AI Reasoning
        AIContextDto.RiskContext aiContext = buildRiskContext(product, primarySupplier, avgDailyUsage, daysUntilStockout, leadTimeDays, reason);

        // 7. Call AI Reasoning Layer
        AIContextDto.ReasoningOutput reasoningOutput = aiReasoningService.generateReasoning(aiContext);

        // 8. Find existing open RiskEvent for this product or create a new one
        RiskEvent riskEvent = riskEventRepository.findTopByProductIdOrderByCreatedAtDesc(product.getId())
                .orElse(new RiskEvent());

        riskEvent.setProductId(product.getId());
        riskEvent.setProductName(product.getName());
        riskEvent.setSupplierId(primarySupplier != null ? primarySupplier.getId() : null);
        riskEvent.setSupplierName(primarySupplier != null ? primarySupplier.getName() : "Unassigned");
        riskEvent.setSeverity(severity);
        riskEvent.setAverageDailyUsage(Math.round(avgDailyUsage * 100.0) / 100.0);
        riskEvent.setDaysUntilStockout(Math.round(daysUntilStockout * 10.0) / 10.0);
        riskEvent.setSupplierLeadTimeDays(leadTimeDays);
        riskEvent.setReason(reason);
        riskEvent.setAiRecommendation(reasoningOutput.getRecommendation());
        riskEvent.setAiReasoning(reasoningOutput.getReasoning());
        riskEvent.setActionRecommended(reasoningOutput.getRecommendedAction());

        if (riskEvent.getStatus() == null || "RESOLVED".equals(riskEvent.getStatus())) {
            riskEvent.setStatus("OPEN");
            riskEvent.setActionApproved(null); // Reset pending approval
        }

        RiskEvent savedEvent = riskEventRepository.save(riskEvent);

        // 9. Save Audit Log
        saveAuditLog(savedEvent, product, primarySupplier, avgDailyUsage, daysUntilStockout);

        // 10. Broadcast live update to dashboard via WebSocket
        try {
            messagingTemplate.convertAndSend("/topic/risks", savedEvent);
        } catch (Exception e) {
            logger.warn("WebSocket broadcast failed: {}", e.getMessage());
        }

        // 11. Autonomous AI Voice Call Trigger on Disruption or Critical Runway
        triggerAutonomousVoiceSourcingIfNeeded(product, primarySupplier, savedEvent);

        return savedEvent;
    }

    /**
     * Autonomously triggers Vapi AI voice calls to alternate suppliers if a supplier
     * is disrupted or stockout runway reaches a critical threshold.
     */
    private void triggerAutonomousVoiceSourcingIfNeeded(Product product, Supplier primarySupplier, RiskEvent savedEvent) {
        if (supplierComparisonService == null || product == null) {
            return;
        }

        // Check trigger condition:
        // 1. Primary supplier is marked DISRUPTED, OR
        // 2. Risk severity is CRITICAL (runway depleted below lead time), OR
        // 3. Current stock is at or below the reorder threshold (low stock inventory threat)
        boolean isSupplierDisrupted = primarySupplier != null && "DISRUPTED".equalsIgnoreCase(primarySupplier.getStatus());
        boolean isCritical = "CRITICAL".equalsIgnoreCase(savedEvent.getSeverity());
        boolean isLowStock = product.getCurrentStock() != null && product.getReorderThreshold() != null && product.getCurrentStock() <= product.getReorderThreshold();

        if (!isSupplierDisrupted && !isCritical && !isLowStock) {
            return;
        }

        // Must have alternate suppliers registered
        if (product.getAlternateSupplierIds() == null || product.getAlternateSupplierIds().isEmpty()) {
            logger.info("Product '{}' has no alternate suppliers registered for autonomous voice sourcing.", product.getName());
            return;
        }

        // Debounce: prevent duplicate call bursts within 10 minutes for the same product
        if (pendingCallRepository != null) {
            List<PendingCall> recentCalls = pendingCallRepository.findByProductIdOrderByCreatedAtDesc(product.getId());
            if (!recentCalls.isEmpty()) {
                PendingCall latest = recentCalls.get(0);
                if (latest.getCreatedAt() != null &&
                        latest.getCreatedAt().isAfter(LocalDateTime.now().minusMinutes(10))) {
                    logger.debug("Autonomous voice calls recently initiated for product '{}' at {}. Debounce active.",
                            product.getName(), latest.getCreatedAt());
                    return;
                }
            }
        }

        int reorderThreshold = product.getReorderThreshold() != null ? product.getReorderThreshold() : 50;
        int currentStock = product.getCurrentStock() != null ? product.getCurrentStock() : 0;
        int neededQty = Math.max(50, reorderThreshold - currentStock);

        // Asynchronously dispatch calls via Vapi so risk calculation thread returns immediately
        CompletableFuture.runAsync(() -> {
            try {
                logger.info("⚡ [AUTONOMOUS AI VOICE TRIGGER] Calling alternate suppliers for Product '{}' (Low Stock: {}, Disrupted: {}, Severity: {}, Needed: {} units)",
                        product.getName(), isLowStock, isSupplierDisrupted, savedEvent.getSeverity(), neededQty);
                supplierComparisonService.checkAllSuppliers(product.getId(), neededQty);
            } catch (Exception e) {
                logger.warn("Autonomous supplier call initiation encountered error: {}", e.getMessage());
            }
        });
    }

    /**
     * Recalculate risks across all products in the catalog.
     */
    public List<RiskEvent> evaluateAllProducts() {
        List<Product> products = productRepository.findAll();
        List<RiskEvent> events = new ArrayList<>();
        for (Product product : products) {
            events.add(evaluateProductRisk(product));
        }
        return events;
    }

    /**
     * Deterministic average calculation over recent usage array.
     */
    public double calculateAverageDailyUsage(List<Integer> recentUsage) {
        if (recentUsage == null || recentUsage.isEmpty()) {
            return 10.0; // Default baseline if unpopulated
        }
        double sum = 0;
        for (Integer usage : recentUsage) {
            if (usage != null) {
                sum += usage;
            }
        }
        return sum / recentUsage.size();
    }

    /**
     * Deterministic Severity Matrix.
     */
    public String classifySeverity(double daysUntilStockout, int leadTimeDays, String supplierStatus) {
        if ("DISRUPTED".equalsIgnoreCase(supplierStatus)) {
            if (daysUntilStockout <= leadTimeDays * 1.5) {
                return "CRITICAL";
            }
            return "HIGH";
        }

        if (daysUntilStockout <= leadTimeDays) {
            return "CRITICAL";
        } else if (daysUntilStockout <= leadTimeDays * 1.5) {
            return "HIGH";
        } else if (daysUntilStockout <= leadTimeDays * 2.5) {
            return "MEDIUM";
        } else {
            return "LOW";
        }
    }

    private String buildDeterministicReason(String severity, double daysUntilStockout, int leadTimeDays,
                                           String supplierStatus, double avgDailyUsage, int stock) {
        if ("DISRUPTED".equalsIgnoreCase(supplierStatus)) {
            return String.format("PRIMARY SUPPLIER DISRUPTED: Current stock (%d units) will last %.1f days at %.1f units/day (1.2x buffer). Inability to ship triggers automatic escalation.",
                    stock, daysUntilStockout, avgDailyUsage);
        }

        switch (severity) {
            case "CRITICAL":
                return String.format("STOCKOUT IMMINENT: Stock runway (%.1f days) is LESS than supplier lead time (%d days). Stockout is mathematically inevitable without expedited freight or backup diversion.",
                        daysUntilStockout, leadTimeDays);
            case "HIGH":
                return String.format("BUFFER COMPROMISED: Stock runway (%.1f days) is within 1.5x of supplier lead time (%d days). Any transport interruption will cause a stockout.",
                        daysUntilStockout, leadTimeDays);
            case "MEDIUM":
                return String.format("REORDER THRESHOLD REACHED: Stock runway (%.1f days) approaches 2.5x lead time (%d days). Routine purchase order dispatch recommended.",
                        daysUntilStockout, leadTimeDays);
            default:
                return String.format("NOMINAL: Inventory runway (%.1f days) exceeds safety thresholds relative to lead time (%d days).",
                        daysUntilStockout, leadTimeDays);
        }
    }

    private AIContextDto.RiskContext buildRiskContext(Product product, Supplier primarySupplier,
                                                     double avgDailyUsage, double daysUntilStockout,
                                                     int leadTimeDays, String reason) {
        List<AIContextDto.AlternateSupplierInfo> alternates = new ArrayList<>();
        if (product.getAlternateSupplierIds() != null) {
            for (Long altId : product.getAlternateSupplierIds()) {
                supplierRepository.findById(altId).ifPresent(s -> {
                    alternates.add(AIContextDto.AlternateSupplierInfo.builder()
                            .supplierId(s.getId())
                            .supplierName(s.getName())
                            .region(s.getRegion())
                            .leadTimeDays(s.getLeadTimeDays())
                            .reliabilityScore(s.getReliabilityScore())
                            .status(s.getStatus())
                            .build());
                });
            }
        }

        return AIContextDto.RiskContext.builder()
                .productId(product.getId())
                .productName(product.getName())
                .category(product.getCategory())
                .currentStock(product.getCurrentStock())
                .recentUsage(product.getRecentUsage())
                .averageDailyUsage(avgDailyUsage)
                .daysUntilStockout(daysUntilStockout)
                .reorderThreshold(product.getReorderThreshold())
                .primarySupplierId(primarySupplier != null ? primarySupplier.getId() : null)
                .primarySupplierName(primarySupplier != null ? primarySupplier.getName() : "None")
                .primarySupplierStatus(primarySupplier != null ? primarySupplier.getStatus() : "INACTIVE")
                .primarySupplierLeadTime(leadTimeDays)
                .primarySupplierReliability(primarySupplier != null ? primarySupplier.getReliabilityScore() : 0.7)
                .alternateSuppliers(alternates)
                .disruptionReason(reason)
                .build();
    }

    private void saveAuditLog(RiskEvent event, Product product, Supplier supplier, double avgUsage, double daysStockout) {
        String snapshot = String.format("{\"productId\":\"%s\",\"stock\":%d,\"avgDailyUsage\":%.2f,\"daysUntilStockout\":%.1f,\"leadTime\":%d,\"supplierStatus\":\"%s\"}",
                product.getId(), product.getCurrentStock(), avgUsage, daysStockout, event.getSupplierLeadTimeDays(),
                supplier != null ? supplier.getStatus() : "UNKNOWN");

        AuditLog log = AuditLog.builder()
                .eventType("RISK_EVALUATION")
                .entityType("RISK_EVENT")
                .entityId(event.getId() != null ? String.valueOf(event.getId()) : product.getId())
                .actionTaken("EVALUATE_DETERMINISTIC_RISK")
                .reasoningDetails(event.getAiRecommendation())
                .dataSnapshotJson(snapshot)
                .approvedBy("SYSTEM_RISK_ENGINE")
                .timestamp(LocalDateTime.now())
                .build();

        auditLogRepository.save(log);
    }
}
