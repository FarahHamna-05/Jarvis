package com.supplyguard.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

public class ProductDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Request {
        @NotBlank
        private String name;
        private String category;
        private String description;
        private String imageBase64;
        private String launchDate;

        @NotNull
        private Integer currentStock;
        private List<Integer> recentUsage; // 7 days array
        private Integer reorderThreshold;

        private Long primarySupplierId;
        private List<Long> alternateSupplierIds;
        private Double marketPriceReference;
        private String demandTrend;
        private Long userId;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private String id;
        private Long userId;
        private String name;
        private String category;
        private String description;
        private String imageBase64;
        private String launchDate;
        private Integer currentStock;
        private List<Integer> recentUsage;
        private Integer reorderThreshold;
        private Long primarySupplierId;
        private String primarySupplierName;
        private String primarySupplierStatus;
        private Integer primarySupplierLeadTime;
        private List<Long> alternateSupplierIds;
        private List<String> alternateSupplierNames;
        private Double marketPriceReference;
        private String demandTrend;
        private Double averageDailyUsage;
        private Double daysUntilStockout;
        private String riskSeverity; // LOW, MEDIUM, HIGH, CRITICAL
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}
