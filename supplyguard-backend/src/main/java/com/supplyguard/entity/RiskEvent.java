package com.supplyguard.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "risk_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RiskEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String productId;

    private String productName;

    private Long supplierId;

    private String supplierName;

    @Column(nullable = false)
    private String severity; // LOW, MEDIUM, HIGH, CRITICAL

    private Double averageDailyUsage;

    private Double daysUntilStockout;

    private Integer supplierLeadTimeDays;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Column(columnDefinition = "TEXT")
    private String aiRecommendation;

    @Column(columnDefinition = "TEXT")
    private String aiReasoning;

    @Column(columnDefinition = "TEXT")
    private String actionRecommended; // e.g., "SWITCH_SUPPLIER", "EXPEDITE_PO", "SAFETY_STOCK_ALERT"

    private Boolean actionApproved; // null = pending, true = approved, false = rejected

    private String status; // OPEN, APPROVED, REJECTED, RESOLVED, DISMISSED

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = "OPEN";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
