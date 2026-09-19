package com.supplyguard.controller;

import com.supplyguard.document.Product;
import com.supplyguard.dto.RiskDto;
import com.supplyguard.entity.RiskEvent;
import com.supplyguard.repository.jpa.RiskEventRepository;
import com.supplyguard.repository.jpa.SupplierRepository;
import com.supplyguard.repository.mongo.ProductRepository;
import com.supplyguard.service.RiskEngineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Set;
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
    public ResponseEntity<List<RiskDto.EventResponse>> getAllRiskEvents(@RequestParam(required = false) Long userId) {
        List<RiskEvent> events = riskEventRepository.findAllByOrderByCreatedAtDesc();
        if (userId != null) {
            Set<String> userProductIds = productRepository.findByUserId(userId).stream()
                    .map(Product::getId)
                    .collect(Collectors.toSet());
            if (!userProductIds.isEmpty()) {
                events = events.stream()
                        .filter(e -> e.getProductId() == null || userProductIds.contains(e.getProductId()))
                        .collect(Collectors.toList());
            }
        }
        return ResponseEntity.ok(events.stream().map(this::mapToDto).collect(Collectors.toList()));
    }

    @GetMapping("/open")
    public ResponseEntity<List<RiskDto.EventResponse>> getOpenRiskEvents() {
        List<RiskEvent> events = riskEventRepository.findByStatusOrderByCreatedAtDesc("OPEN");
        return ResponseEntity.ok(events.stream().map(this::mapToDto).collect(Collectors.toList()));
    }

    @GetMapping("/dashboard-summary")
    public ResponseEntity<RiskDto.DashboardSummary> getDashboardSummary(@RequestParam(required = false) Long userId) {
        long totalProducts;
        Set<String> userProductIds = Collections.emptySet();
        if (userId != null) {
            List<Product> userProducts = productRepository.findByUserId(userId);
            totalProducts = userProducts.size();
            userProductIds = userProducts.stream().map(Product::getId).collect(Collectors.toSet());
        } else {
            totalProducts = productRepository.count();
        }
        long totalSuppliers = supplierRepository.count();
        long disruptedSuppliers = supplierRepository.findByStatus("DISRUPTED").size();

        List<RiskEvent> openRisks = riskEventRepository.findByStatusOrderByCreatedAtDesc("OPEN");
        if (userId != null && !userProductIds.isEmpty()) {
            final Set<String> fUserProdIds = userProductIds;
            openRisks = openRisks.stream()
                    .filter(r -> r.getProductId() == null || fUserProdIds.contains(r.getProductId()))
                    .collect(Collectors.toList());
        }
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
