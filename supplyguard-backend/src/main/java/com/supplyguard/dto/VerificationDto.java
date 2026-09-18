package com.supplyguard.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.Map;

public class VerificationDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class VerificationRequest {
        private String value;
        private Long supplierId;
        private Long userId;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class VerificationResponse {
        private String field;
        private String inputValue;
        private String status; // VERIFIED, FAILED
        private String message;
        private LocalDateTime verifiedAt;
        private Map<String, Object> extraData;
    }
}
