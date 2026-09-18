package com.supplyguard.controller;

import com.supplyguard.dto.RiskDto;
import com.supplyguard.entity.RiskEvent;
import com.supplyguard.repository.jpa.RiskEventRepository;
import com.supplyguard.repository.jpa.SupplierRepository;
import com.supplyguard.repository.mongo.ProductRepository;
import com.supplyguard.service.RiskEngineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/risks")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RiskEngineController {

    private final RiskEngineService riskEngineService;
    private final RiskEventRepository riskEventRepository;
    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;

    @GetMapping
    public ResponseEntity<List<RiskDto.EventResponse>> getAllRiskEvents() {
        List<RiskEvent> events = riskEventRepository.findAllByOrderByCreatedAtDesc();
        return ResponseEntity.ok(events.stream().map(this::mapToDto).collect(Collectors.toList()));
    }

    @GetMapping("/open")
    public ResponseEntity<List<RiskDto.EventResponse>> getOpenRiskEvents() {
        List<RiskEvent> events = riskEventRepository.findByStatusOrderByCreatedAtDesc("OPEN");
        return ResponseEntity.ok(events.stream().map(this::mapToDto).collect(Collectors.toList()));
    }

    @GetMapping("/dashboard-summary")
    public ResponseEntity<RiskDto.DashboardSummary> getDashboardSummary() {
        long totalProducts = productRepository.count();
        long totalSuppliers = supplierRepository.count();
        long disruptedSuppliers = supplierRepository.findByStatus("DISRUPTED").size();

        List<RiskEvent> openRisks = riskEventRepository.findByStatusOrderByCreatedAtDesc("OPEN");
        long critical = openRisks.stream().filter(r -> "CRITICAL".equalsIgnoreCase(r.getSeverity())).count();
        long high = openRisks.stream().filter(r -> "HIGH".equalsIgnoreCase(r.getSeverity())).count();
        long medium = openRisks.stream().filter(r -> "MEDIUM".equalsIgnoreCase(r.getSeverity())).count();
        long low = openRisks.stream().filter(r -> "LOW".equalsIgnoreCase(r.getSeverity())).count();

        long pendingApprovals = openRisks.stream()
                .filter(r -> r.getActionApproved() == null && ("CRITICAL".equalsIgnoreCase(r.getSeverity()) || "HIGH".equalsIgnoreCase(r.getSeverity())))
                .count();

        List<RiskDto.EventResponse> recentEvents = openRisks.stream()
                .limit(10)
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(RiskDto.DashboardSummary.builder()
                .totalProducts(totalProducts)
                .totalSuppliers(totalSuppliers)
                .disruptedSuppliers(disruptedSuppliers)
                .criticalRisks(critical)
                .highRisks(high)
                .mediumRisks(medium)
                .lowRisks(low)
                .pendingApprovals(pendingApprovals)
                .recentRiskEvents(recentEvents)
                .build());
    }

    @PostMapping("/recalculate-all")
    public ResponseEntity<List<RiskDto.EventResponse>> recalculateAll() {
        List<RiskEvent> events = riskEngineService.evaluateAllProducts();
        return ResponseEntity.ok(events.stream().map(this::mapToDto).collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RiskDto.EventResponse> getRiskEventById(@PathVariable Long id) {
        return riskEventRepository.findById(id)
                .map(this::mapToDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    private RiskDto.EventResponse mapToDto(RiskEvent event) {
        return RiskDto.EventResponse.builder()
                .id(event.getId())
                .productId(event.getProductId())
                .productName(event.getProductName())
                .supplierId(event.getSupplierId())
                .supplierName(event.getSupplierName())
                .severity(event.getSeverity())
                .averageDailyUsage(event.getAverageDailyUsage())
                .daysUntilStockout(event.getDaysUntilStockout())
                .supplierLeadTimeDays(event.getSupplierLeadTimeDays())
                .reason(event.getReason())
                .aiRecommendation(event.getAiRecommendation())
                .aiReasoning(event.getAiReasoning())
                .actionRecommended(event.getActionRecommended())
                .actionApproved(event.getActionApproved())
                .status(event.getStatus())
                .createdAt(event.getCreatedAt())
                .updatedAt(event.getUpdatedAt())
                .build();
    }
}
