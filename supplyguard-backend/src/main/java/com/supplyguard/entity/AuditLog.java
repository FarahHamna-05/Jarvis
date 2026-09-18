package com.supplyguard.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String eventType; // AI_RECOMMENDATION, HUMAN_APPROVAL, HUMAN_REJECTION, SYSTEM_RECALCULATION, EMAIL_SENT

    private String entityType; // RISK_EVENT, PRODUCT, SUPPLIER, ORDER

    private String entityId;

    @Column(columnDefinition = "TEXT")
    private String actionTaken;

    @Column(columnDefinition = "TEXT")
    private String reasoningDetails;

    @Column(columnDefinition = "TEXT")
    private String dataSnapshotJson;

    private Boolean userApproved;

    private String approvedBy; // Username or "SYSTEM"

    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
    }
}
