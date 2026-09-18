package com.supplyguard.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "verification_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerificationRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long supplierId;

    private Long userId;

    @Column(nullable = false)
    private String field; // PAN, AADHAAR, GSTIN, IFSC, BANK_ACCOUNT, UDYAM

    @Column(nullable = false)
    private String inputValue;

    @Column(nullable = false)
    private String status; // VERIFIED, FAILED

    private String message;

    private LocalDateTime verifiedAt;

    @PrePersist
    protected void onCreate() {
        if (verifiedAt == null) {
            verifiedAt = LocalDateTime.now();
        }
    }
}
