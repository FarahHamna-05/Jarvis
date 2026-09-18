package com.supplyguard.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

public class RiskDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class EventResponse {
        private Long id;
        private String productId;
        private String productName;
        private Long supplierId;
        private String supplierName;
        private String severity; // LOW, MEDIUM, HIGH, CRITICAL
        private Double averageDailyUsage;
        private Double daysUntilStockout;
        private Integer supplierLeadTimeDays;
        private String reason;
        private String aiRecommendation;
        private String aiReasoning;
        private String actionRecommended;
        private Boolean actionApproved;
        private String status;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SimulationRequest {
        private Long supplierId;
        private String productId;
        private Boolean markSupplierDisrupted;
        private Double demandMultiplier; // e.g. 2.0 = 200% usage spike
        private Integer addedLeadTimeDays; // e.g. +10 days
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ApprovalActionRequest {
        private Long riskEventId;
        private Boolean approved;
        private String notes;
        private Long switchSupplierId; // Optional alternative supplier to switch to
        private Integer orderQuantity; // Optional PO quantity
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DashboardSummary {
        private Long totalProducts;
        private Long totalSuppliers;
        private Long disruptedSuppliers;
        private Long criticalRisks;
        private Long highRisks;
        private Long mediumRisks;
        private Long lowRisks;
        private Long pendingApprovals;
        private List<EventResponse> recentRiskEvents;
    }
}
