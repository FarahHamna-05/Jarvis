package com.supplyguard.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

public class SupplierDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Request {
        @NotBlank
        private String name;
        @NotBlank
        @Email
        private String contactEmail;
        private String phone;
        private String region;
        @NotNull
        private Double reliabilityScore;
        @NotNull
        private Integer leadTimeDays;
        private String status; // ACTIVE, DISRUPTED
        private Double trustScore;

        // KYB and Verification
        private String pan;
        private String aadhaar;
        private String gstin;
        private String ifsc;
        private String bankAccount;
        private String bankName;
        private String branchName;
        private String udyamNumber;
        private String cin;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long id;
        private String name;
        private String contactEmail;
        private String phone;
        private String region;
        private Double reliabilityScore;
        private Integer leadTimeDays;
        private String status;
        private Double trustScore;
        private String pan;
        private String aadhaar;
        private String gstin;
        private String ifsc;
        private String bankAccount;
        private String bankName;
        private String branchName;
        private String udyamNumber;
        private String cin;
        private Integer productsSuppliedCount;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}
