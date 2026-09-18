package com.supplyguard.controller;

import com.supplyguard.dto.VerificationDto;
import com.supplyguard.service.VerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/verify")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VerificationController {

    private final VerificationService verificationService;

    @PostMapping("/{field}")
    public ResponseEntity<VerificationDto.VerificationResponse> verifyField(
            @PathVariable String field,
            @RequestBody VerificationDto.VerificationRequest request
    ) {
        VerificationDto.VerificationResponse response = verificationService.verify(field, request);
        return ResponseEntity.ok(response);
    }
}
