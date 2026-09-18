package com.supplyguard.service.impl;

import com.supplyguard.dto.AIContextDto;
import com.supplyguard.service.AIReasoningService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.Optional;

@Service("heuristicReasoningService")
public class DeterministicHeuristicReasoningServiceImpl implements AIReasoningService {

    private static final Logger logger = LoggerFactory.getLogger(DeterministicHeuristicReasoningServiceImpl.class);

    @Override
    public AIContextDto.ReasoningOutput generateReasoning(AIContextDto.RiskContext context) {
        double daysStockout = context.getDaysUntilStockout() != null ? context.getDaysUntilStockout() : 0.0;
        int leadTime = context.getPrimarySupplierLeadTime() != null ? context.getPrimarySupplierLeadTime() : 0;
        boolean isDisrupted = "DISRUPTED".equalsIgnoreCase(context.getPrimarySupplierStatus());

        StringBuilder reasoning = new StringBuilder();
        reasoning.append("Deterministic Analysis Breakdown:\n");
        reasoning.append(String.format("1. Current stock is %d units against 7-day average daily consumption of %.2f units/day.\n",
                context.getCurrentStock(), context.getAverageDailyUsage()));
        reasoning.append(String.format("2. Buffer factor applied: 1.20x. Projected days until stockout = %.1f days.\n", daysStockout));
        reasoning.append(String.format("3. Primary supplier '%s' has a standard replenishment lead time of %d days (Status: %s).\n",
                context.getPrimarySupplierName(), leadTime, context.getPrimarySupplierStatus()));

        String recommendation;
        String action;

        // Check alternate suppliers
        Optional<AIContextDto.AlternateSupplierInfo> bestAlternate = Optional.empty();
        if (context.getAlternateSuppliers() != null && !context.getAlternateSuppliers().isEmpty()) {
            bestAlternate = context.getAlternateSuppliers().stream()
                    .filter(s -> "ACTIVE".equalsIgnoreCase(s.getStatus()))
                    .min(Comparator.comparingInt(AIContextDto.AlternateSupplierInfo::getLeadTimeDays));
        }

        if (isDisrupted) {
            reasoning.append("4. CRITICAL THREAT: Primary supplier is completely offline/disrupted. Standard replenishment pipeline is frozen.\n");
            if (bestAlternate.isPresent()) {
                AIContextDto.AlternateSupplierInfo alt = bestAlternate.get();
                reasoning.append(String.format("5. Alternate supplier '%s' (Region: %s) is verified ACTIVE with lead time of %d days and %.0f%% reliability.\n",
                        alt.getSupplierName(), alt.getRegion(), alt.getLeadTimeDays(), alt.getReliabilityScore() * 100));
                recommendation = String.format("IMMEDIATE ACTION REQUIRED: Divert replenishment orders to backup supplier '%s' immediately. With primary supplier '%s' down, stock will deplete in %.1f days.",
                        alt.getSupplierName(), context.getPrimarySupplierName(), daysStockout);
                action = "SWITCH_SUPPLIER_AND_EXPEDITE";
            } else {
                recommendation = String.format("CRITICAL ALERT: Primary supplier '%s' is disrupted with NO active alternate supplier configured. Stockout in %.1f days. Initiate emergency procurement sourcing immediately.",
                        context.getPrimarySupplierName(), daysStockout);
                action = "EMERGENCY_SOURCING_REQUIRED";
            }
        } else if (daysStockout <= leadTime) {
            reasoning.append(String.format("4. DEFICIT GAP: Lead time (%d days) exceeds projected stock runway (%.1f days). Stockout is guaranteed before standard delivery.\n",
                    leadTime, daysStockout));
            if (bestAlternate.isPresent() && bestAlternate.get().getLeadTimeDays() < daysStockout) {
                AIContextDto.AlternateSupplierInfo alt = bestAlternate.get();
                reasoning.append(String.format("5. Fast-track alternative: '%s' has an expedited lead time of %d days, which beats the %.1f day stockout horizon.\n",
                        alt.getSupplierName(), alt.getLeadTimeDays(), daysStockout));
                recommendation = String.format("EXPEDITE BACKUP PO: Issue priority purchase order to '%s' (%d days lead time) to prevent inventory exhaustion before '%s' can deliver.",
                        alt.getSupplierName(), alt.getLeadTimeDays(), context.getPrimarySupplierName());
                action = "EXPEDITE_BACKUP_PO";
            } else {
                recommendation = String.format("EXPEDITE AIR FREIGHT: Contact primary supplier '%s' immediately to negotiate premium expedited transit. Standard %d-day sea/ground freight will breach safe stock.",
                        context.getPrimarySupplierName(), leadTime);
                action = "EXPEDITE_PRIMARY_PO";
            }
        } else if (daysStockout <= leadTime * 1.5) {
            reasoning.append(String.format("4. HIGH BUFFER EROSION: Stock runway (%.1f days) is within 1.5x of supplier lead time (%d days). Any transport glitch will cascade into a stockout.\n",
                    daysStockout, leadTime));
            recommendation = String.format("PRE-EMPTIVE REORDER: Trigger proactive purchase order now with '%s'. Consumption rate has narrowed the safety margin.",
                    context.getPrimarySupplierName());
            action = "PROACTIVE_REORDER";
        } else {
            reasoning.append("4. NOMINAL: Inventory is within acceptable safety thresholds. Continual automated monitoring active.\n");
            recommendation = "Maintain regular monitoring schedule. No immediate emergency purchase order required.";
            action = "MONITOR_INVENTORY";
        }

        String emailSubject = String.format("URGENT: SupplyGuard Procurement Notice - %s [SKU: %s]",
                context.getProductName(), context.getProductId());
        String emailBody = generateEmailDraft(context);

        return AIContextDto.ReasoningOutput.builder()
                .recommendation(recommendation)
                .reasoning(reasoning.toString())
                .recommendedAction(action)
                .emailDraftSubject(emailSubject)
                .emailDraftBody(emailBody)
                .build();
    }

    @Override
    public String generateEmailDraft(AIContextDto.RiskContext context) {
        int neededUnits = (int) Math.max(500, (context.getAverageDailyUsage() != null ? context.getAverageDailyUsage() : 25) * 30);
        return String.format(
                "Dear %s Procurement & Fulfillment Team,\n\n" +
                "This is an automated priority communication from SupplyGuard AI on behalf of Operations.\n\n" +
                "Our real-time inventory telemetry indicates an impending supply constraint for:\n" +
                "- Product: %s (Item ID: %s)\n" +
                "- Current On-Hand Stock: %d units\n" +
                "- 7-Day Average Consumption: %.1f units/day\n" +
                "- Projected Runway Until Stockout: %.1f days (Buffer: 1.2x)\n" +
                "- Standard Registered Lead Time: %d days\n\n" +
                "We urgently request confirmation on:\n" +
                "1. Earliest expedited dispatch date for an order batch of %d units.\n" +
                "2. Availability of air freight or express logistics options.\n" +
                "3. Confirmation of unit pricing for expedited handling.\n\n" +
                "Please reply directly to this email or confirm through your supplier portal.\n\n" +
                "Sincerely,\n" +
                "SupplyGuard Automated Risk Management System",
                context.getPrimarySupplierName() != null ? context.getPrimarySupplierName() : "Supplier",
                context.getProductName(),
                context.getProductId(),
                context.getCurrentStock(),
                context.getAverageDailyUsage(),
                context.getDaysUntilStockout(),
                context.getPrimarySupplierLeadTime(),
                neededUnits
        );
    }

    @Override
    public String answerRAGQuery(String userQuery, String liveDataContext) {
        String queryLower = userQuery.toLowerCase();
        if (queryLower.contains("biggest risk") || queryLower.contains("highest risk") || queryLower.contains("critical")) {
            return "Based on live inventory telemetry:\n" +
                   "- Products flagged as **CRITICAL** or **HIGH** risk have stockout projections falling below or dangerously near their supplier lead times.\n" +
                   "- Key driving factors: Primary supplier unavailability or recent usage acceleration (> 1.2x safety buffer).\n" +
                   "- Live Data Reference:\n" + liveDataContext;
        } else if (queryLower.contains("why did you contact") || queryLower.contains("email") || queryLower.contains("contact")) {
            return "SupplyGuard AI drafts outreach whenever a product's days-until-stockout breaches 1.5x of the supplier's registered lead time. " +
                   "The email explicitly cites the current 7-day average daily usage and requests expedited dispatch to bridge the replenishment gap before zero inventory is reached.";
        } else {
            return "SupplyGuard AI Intelligence Summary:\n" +
                   "Current system status is actively tracking all product SKUs across primary and secondary suppliers.\n" +
                   "Summary of live parameters:\n" + liveDataContext;
        }
    }
}
