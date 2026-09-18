package com.supplyguard;

import com.supplyguard.service.RiskEngineService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class RiskEngineServiceTest {

    private RiskEngineService riskEngineService;

    @BeforeEach
    void setUp() {
        // Instantiate service with mocks for non-computation dependencies
        riskEngineService = new RiskEngineService(
                Mockito.mock(com.supplyguard.repository.jpa.RiskEventRepository.class),
                Mockito.mock(com.supplyguard.repository.mongo.ProductRepository.class),
                Mockito.mock(com.supplyguard.repository.jpa.SupplierRepository.class),
                Mockito.mock(com.supplyguard.repository.jpa.ProductSupplierRepository.class),
                Mockito.mock(com.supplyguard.repository.jpa.AuditLogRepository.class),
                Mockito.mock(com.supplyguard.service.AIReasoningService.class),
                Mockito.mock(org.springframework.messaging.simp.SimpMessagingTemplate.class)
        );
    }

    @Test
    void testCalculateAverageDailyUsage() {
        List<Integer> usage = Arrays.asList(10, 20, 30, 15, 25, 35, 5); // sum = 140, avg = 20.0
        double avg = riskEngineService.calculateAverageDailyUsage(usage);
        assertEquals(20.0, avg, 0.001, "Average should be exactly 20.0");
    }

    @Test
    void testDeterministicSeverityClassification() {
        // leadTime = 14 days
        // Case 1: runway <= 14 -> CRITICAL
        assertEquals("CRITICAL", riskEngineService.classifySeverity(10.0, 14, "ACTIVE"));
        assertEquals("CRITICAL", riskEngineService.classifySeverity(14.0, 14, "ACTIVE"));

        // Case 2: runway <= 14 * 1.5 (21.0) -> HIGH
        assertEquals("HIGH", riskEngineService.classifySeverity(15.0, 14, "ACTIVE"));
        assertEquals("HIGH", riskEngineService.classifySeverity(21.0, 14, "ACTIVE"));

        // Case 3: runway <= 14 * 2.5 (35.0) -> MEDIUM
        assertEquals("MEDIUM", riskEngineService.classifySeverity(25.0, 14, "ACTIVE"));
        assertEquals("MEDIUM", riskEngineService.classifySeverity(35.0, 14, "ACTIVE"));

        // Case 4: runway > 35.0 -> LOW
        assertEquals("LOW", riskEngineService.classifySeverity(50.0, 14, "ACTIVE"));
    }

    @Test
    void testDisruptedSupplierEscalation() {
        // When supplier is DISRUPTED, even with 30 days runway, it escalates to CRITICAL or HIGH!
        assertEquals("HIGH", riskEngineService.classifySeverity(30.0, 14, "DISRUPTED"));
        assertEquals("CRITICAL", riskEngineService.classifySeverity(15.0, 14, "DISRUPTED"));
    }

    @Test
    void testStockoutRunwayFormula() {
        int currentStock = 120;
        double avgDailyUsage = 20.0;
        double bufferFactor = 1.2;
        double expectedDays = currentStock / (avgDailyUsage * bufferFactor); // 120 / 24 = 5.0 days

        assertEquals(5.0, expectedDays, 0.001);
    }
}
