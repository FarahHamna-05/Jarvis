package com.supplyguard.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "suppliers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String contactEmail;

    private String phone;

    private String region;

    // KYB and Verification Fields
    private String pan;
    private String aadhaar;
    private String gstin;
    private String ifsc;
    private String bankAccount;
    private String bankName;
    private String branchName;
    private String udyamNumber;
    private String cin;

    @Column(nullable = false)
    private Double reliabilityScore; // 0.00 to 1.00

    @Column(nullable = false)
    private Integer leadTimeDays;

    @Column(nullable = false)
    private String status; // ACTIVE, DISRUPTED

    private Double trustScore; // Dynamic trust score 0-100 or 0-5

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = "ACTIVE";
        }
        if (reliabilityScore == null) {
            reliabilityScore = 0.85;
        }
        if (trustScore == null) {
            trustScore = reliabilityScore * 100.0;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
