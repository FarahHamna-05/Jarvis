package com.supplyguard.service.impl;

import com.supplyguard.dto.VerificationDto;
import com.supplyguard.entity.VerificationRecord;
import com.supplyguard.repository.jpa.VerificationRecordRepository;
import com.supplyguard.service.VerificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class MockVerificationServiceImpl implements VerificationService {

    private final VerificationRecordRepository verificationRecordRepository;

    @Override
    public VerificationDto.VerificationResponse verify(String field, VerificationDto.VerificationRequest request) {
        String normalizedField = field != null ? field.trim().toUpperCase() : "UNKNOWN";
        String value = request.getValue() != null ? request.getValue().trim() : "";

        // Artificial latency (750ms - 1050ms) to simulate real-world government/banking gateway roundtrip
        try {
            long sleepTime = 750 + (long) (Math.random() * 300);
            Thread.sleep(sleepTime);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        String status = "VERIFIED";
        String message;
        Map<String, Object> extraData = new HashMap<>();

        switch (normalizedField) {
            case "PAN":
                message = "PAN verified active with NSDL / Income Tax Department database.";
                extraData.put("registeredName", "Verified Entity / Holder");
                extraData.put("panStatus", "OPERATIVE");
                break;

            case "AADHAAR":
                message = "Aadhaar demographic & OTP authentication probe verified via UIDAI.";
                extraData.put("verifiedMethod", "UIDAI Vault Token");
                break;

            case "GSTIN":
                message = "GSTIN verified active on Goods and Services Tax Network (GSTN).";
                extraData.put("taxpayerType", "Regular Taxpayer");
                extraData.put("filingFrequency", "Monthly GSTR-1 / 3B Active");
                break;

            case "IFSC":
                String ifscUpper = value.toUpperCase();
                String bankName = "Nationalized Commercial Bank";
                String branch = "Central Commercial Branch";

                if (ifscUpper.startsWith("HDFC")) {
                    bankName = "HDFC Bank Ltd";
                    branch = "Koramangala 4th Block, Bengaluru";
                } else if (ifscUpper.startsWith("SBIN")) {
                    bankName = "State Bank of India";
                    branch = "Industrial Finance Branch, Mumbai";
                } else if (ifscUpper.startsWith("ICIC")) {
                    bankName = "ICICI Bank";
                    branch = "Cyber City Branch, Gurugram";
                } else if (ifscUpper.startsWith("UTIB") || ifscUpper.startsWith("AXIS")) {
                    bankName = "Axis Bank Ltd";
                    branch = "MG Road, Pune";
                }

                message = "IFSC code validated against Reserve Bank of India (RBI) NEFT/RTGS gateway.";
                extraData.put("bankName", bankName);
                extraData.put("branchName", branch);
                extraData.put("city", "Commercial Hub");
                break;

            case "BANK_ACCOUNT":
                message = "Bank account penny-drop confirmation successful. Name match 99.8%.";
                extraData.put("accountStatus", "ACTIVE");
                extraData.put("pennyDropRef", "IMPS" + System.currentTimeMillis());
                break;

            case "UDYAM":
                message = "Udyam Registration Number verified with Ministry of MSME portal.";
                extraData.put("enterpriseType", "Small Enterprise");
                extraData.put("majorActivity", "Manufacturing & Supply");
                break;

            default:
                message = normalizedField + " format and validity verified successfully.";
                break;
        }

        LocalDateTime now = LocalDateTime.now();

        // Always write audit record to verification_records
        VerificationRecord record = VerificationRecord.builder()
                .supplierId(request.getSupplierId())
                .userId(request.getUserId())
                .field(normalizedField)
                .inputValue(value)
                .status(status)
                .message(message)
                .verifiedAt(now)
                .build();

        verificationRecordRepository.save(record);

        log.info("Completed verification for field: {} (supplierId: {}, userId: {}) - Status: {}",
                normalizedField, request.getSupplierId(), request.getUserId(), status);

        return VerificationDto.VerificationResponse.builder()
                .field(normalizedField)
                .inputValue(value)
                .status(status)
                .message(message)
                .verifiedAt(now)
                .extraData(extraData)
                .build();
    }
}
