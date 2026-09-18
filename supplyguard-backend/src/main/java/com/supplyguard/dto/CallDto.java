package com.supplyguard.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

public class CallDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CheckSuppliersRequest {
        private Integer requiredQuantity;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class InitiateCallResponse {
        private String vapiCallId;
        private String supplierId;
        private String supplierName;
        private String productId;
        private String status;
        private String message;
        private LocalDateTime timestamp;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RankedSupplierOptionDto {
        private int rank;
        private String supplierId;
        private String supplierName;
        private String supplierPhone;
        private Boolean availability;
        private Integer stockQuantity;
        private Integer deliveryDays;
        private Double pricePerUnit;
        private Boolean interested;
        private Boolean meetsQuantityDemand;
        private Boolean isRecommended;
        private String transcript;
        private String vapiCallId;
        private LocalDateTime callTimestamp;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SupplierComparisonResponse {
        private String productId;
        private String productName;
        private Integer requiredQuantity;
        private List<RankedSupplierOptionDto> rankedSuppliers;
        private String recommendedSupplierId;
        private String recommendedSupplierName;
        private String aiRecommendation;
        private String aiReasoning;
        private int totalSuppliersContacted;
        private int responsesReceived;
        private boolean comparisonReady;
        private LocalDateTime lastEvaluatedAt;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ApproveSupplierRequest {
        private String supplierId;
        private String notes;
        private String approvedBy;
    }
}
