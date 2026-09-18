package com.supplyguard.service;

import com.supplyguard.dto.VerificationDto;

public interface VerificationService {
    VerificationDto.VerificationResponse verify(String field, VerificationDto.VerificationRequest request);
}
