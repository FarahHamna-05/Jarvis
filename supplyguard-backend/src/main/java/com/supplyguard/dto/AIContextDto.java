package com.supplyguard.dto;

import lombok.*;

import java.util.List;

public class AIContextDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RiskContext {
        private String productId;
        private String productName;
        private String category;
        private Integer currentStock;
        private List<Integer> recentUsage;
        private Double averageDailyUsage;
        private Double daysUntilStockout;
        private Integer reorderThreshold;

        // Primary Supplier
        private Long primarySupplierId;
        private String primarySupplierName;
        private String primarySupplierStatus;
        private Integer primarySupplierLeadTime;
        private Double primarySupplierReliability;

        // Alternate Suppliers
        private List<AlternateSupplierInfo> alternateSuppliers;

        private String disruptionReason;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AlternateSupplierInfo {
        private Long supplierId;
        private String supplierName;
        private String region;
        private Integer leadTimeDays;
        private Double reliabilityScore;
        private String status;
        private Double unitCost;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ReasoningOutput {
        private String recommendation;
        private String reasoning;
        private String recommendedAction; // SWITCH_SUPPLIER, EXPEDITE_PO, SAFETY_BUFFER_ADJUST
        private String emailDraftSubject;
        private String emailDraftBody;
    }
}
