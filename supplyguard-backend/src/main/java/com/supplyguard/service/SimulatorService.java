package com.supplyguard.service;

import com.supplyguard.document.Product;
import com.supplyguard.dto.RiskDto;
import com.supplyguard.entity.Supplier;
import com.supplyguard.repository.jpa.SupplierRepository;
import com.supplyguard.repository.mongo.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SimulatorService {

    private static final Logger logger = LoggerFactory.getLogger(SimulatorService.class);

    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;
    private final SupplierService supplierService;
    private final RiskEngineService riskEngineService;

    public void simulateDisruption(RiskDto.SimulationRequest request) {
        // 1. If supplier disruption requested
        if (request.getSupplierId() != null) {
            supplierRepository.findById(request.getSupplierId()).ifPresent(supplier -> {
                if (request.getMarkSupplierDisrupted() != null) {
                    supplier.setStatus(request.getMarkSupplierDisrupted() ? "DISRUPTED" : "ACTIVE");
                }
                if (request.getAddedLeadTimeDays() != null && request.getAddedLeadTimeDays() > 0) {
                    supplier.setLeadTimeDays(supplier.getLeadTimeDays() + request.getAddedLeadTimeDays());
                }
                supplierRepository.save(supplier);
                supplierService.recalculateRisksForSupplierProducts(supplier.getId());
            });
        }

        // 2. If product demand spike requested
        if (request.getProductId() != null) {
            productRepository.findById(request.getProductId()).ifPresent(product -> {
                if (request.getDemandMultiplier() != null && request.getDemandMultiplier() > 1.0) {
                    List<Integer> spikeUsage = new ArrayList<>();
                    for (Integer u : product.getRecentUsage()) {
                        spikeUsage.add((int) (u * request.getDemandMultiplier()));
                    }
                    product.setRecentUsage(spikeUsage);
                    // Also decrement current stock to reflect recent surge
                    product.setCurrentStock(Math.max(5, (int) (product.getCurrentStock() * 0.7)));
                    productRepository.save(product);
                    riskEngineService.evaluateProductRisk(product);
                }
            });
        }
    }

    /**
     * Restore baseline demo conditions.
     */
    public void resetAllToBaseline() {
        List<Supplier> suppliers = supplierRepository.findAll();
        for (Supplier s : suppliers) {
            s.setStatus("ACTIVE");
            if (s.getLeadTimeDays() > 30) {
                s.setLeadTimeDays(14);
            }
            supplierRepository.save(s);
        }

        List<Product> products = productRepository.findAll();
        for (Product p : products) {
            p.setCurrentStock(350);
            p.setRecentUsage(List.of(12, 14, 15, 13, 16, 14, 15));
            productRepository.save(p);
            riskEngineService.evaluateProductRisk(p);
        }
    }
}
