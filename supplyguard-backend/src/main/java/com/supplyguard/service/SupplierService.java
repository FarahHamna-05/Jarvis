package com.supplyguard.service;

import com.supplyguard.document.Product;
import com.supplyguard.dto.SupplierDto;
import com.supplyguard.entity.Supplier;
import com.supplyguard.repository.jpa.ProductSupplierRepository;
import com.supplyguard.repository.jpa.SupplierRepository;
import com.supplyguard.repository.mongo.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SupplierService {

    private static final Logger logger = LoggerFactory.getLogger(SupplierService.class);

    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;
    private final ProductSupplierRepository productSupplierRepository;
    private final RiskEngineService riskEngineService;

    public List<SupplierDto.Response> getAllSuppliers() {
        return supplierRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Optional<SupplierDto.Response> getSupplierById(Long id) {
        return supplierRepository.findById(id).map(this::mapToResponse);
    }

    @Transactional
    public SupplierDto.Response createSupplier(SupplierDto.Request request) {
        Supplier supplier = Supplier.builder()
                .name(request.getName())
                .contactEmail(request.getContactEmail())
                .phone(request.getPhone())
                .region(request.getRegion())
                .reliabilityScore(request.getReliabilityScore())
                .leadTimeDays(request.getLeadTimeDays())
                .status(request.getStatus() != null ? request.getStatus() : "ACTIVE")
                .trustScore(request.getTrustScore() != null ? request.getTrustScore() : request.getReliabilityScore() * 100.0)
                .pan(request.getPan())
                .aadhaar(request.getAadhaar())
                .gstin(request.getGstin())
                .ifsc(request.getIfsc())
                .bankAccount(request.getBankAccount())
                .bankName(request.getBankName())
                .branchName(request.getBranchName())
                .udyamNumber(request.getUdyamNumber())
                .cin(request.getCin())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Supplier saved = supplierRepository.save(supplier);
        return mapToResponse(saved);
    }

    @Transactional
    public SupplierDto.Response updateSupplier(Long id, SupplierDto.Request request) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + id));

        String oldStatus = supplier.getStatus();
        Integer oldLeadTime = supplier.getLeadTimeDays();

        supplier.setName(request.getName());
        supplier.setContactEmail(request.getContactEmail());
        supplier.setPhone(request.getPhone());
        supplier.setRegion(request.getRegion());
        supplier.setReliabilityScore(request.getReliabilityScore());
        supplier.setLeadTimeDays(request.getLeadTimeDays());
        if (request.getStatus() != null) {
            supplier.setStatus(request.getStatus());
        }
        if (request.getTrustScore() != null) {
            supplier.setTrustScore(request.getTrustScore());
        }
        if (request.getPan() != null) supplier.setPan(request.getPan());
        if (request.getAadhaar() != null) supplier.setAadhaar(request.getAadhaar());
        if (request.getGstin() != null) supplier.setGstin(request.getGstin());
        if (request.getIfsc() != null) supplier.setIfsc(request.getIfsc());
        if (request.getBankAccount() != null) supplier.setBankAccount(request.getBankAccount());
        if (request.getBankName() != null) supplier.setBankName(request.getBankName());
        if (request.getBranchName() != null) supplier.setBranchName(request.getBranchName());
        if (request.getUdyamNumber() != null) supplier.setUdyamNumber(request.getUdyamNumber());
        if (request.getCin() != null) supplier.setCin(request.getCin());

        supplier.setUpdatedAt(LocalDateTime.now());

        Supplier updated = supplierRepository.save(supplier);

        // If status or lead time changed, re-evaluate all affected products!
        if (!oldStatus.equals(updated.getStatus()) || !oldLeadTime.equals(updated.getLeadTimeDays())) {
            recalculateRisksForSupplierProducts(updated.getId());
        }

        return mapToResponse(updated);
    }

    @Transactional
    public SupplierDto.Response toggleStatus(Long id, String newStatus) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + id));

        supplier.setStatus(newStatus);
        supplier.setUpdatedAt(LocalDateTime.now());

        // Adjust trust score slightly on disruption
        if ("DISRUPTED".equalsIgnoreCase(newStatus)) {
            supplier.setTrustScore(Math.max(10.0, (supplier.getTrustScore() != null ? supplier.getTrustScore() : 80.0) - 15.0));
        } else {
            supplier.setTrustScore(Math.min(100.0, (supplier.getTrustScore() != null ? supplier.getTrustScore() : 80.0) + 5.0));
        }

        Supplier updated = supplierRepository.save(supplier);
        logger.info("Supplier {} ({}) status toggled to {}", updated.getName(), updated.getId(), newStatus);

        // Immediately recalculate risk for all products relying on this supplier
        recalculateRisksForSupplierProducts(updated.getId());

        return mapToResponse(updated);
    }

    @Transactional
    public void deleteSupplier(Long id) {
        supplierRepository.deleteById(id);
    }

    public void recalculateRisksForSupplierProducts(Long supplierId) {
        List<Product> products = productRepository.findByPrimarySupplierId(supplierId);
        logger.info("Recalculating risk for {} products tied to supplier {}", products.size(), supplierId);
        for (Product product : products) {
            riskEngineService.evaluateProductRisk(product);
        }
    }

    public SupplierDto.Response mapToResponse(Supplier supplier) {
        int count = productRepository.findByPrimarySupplierId(supplier.getId()).size();

        return SupplierDto.Response.builder()
                .id(supplier.getId())
                .name(supplier.getName())
                .contactEmail(supplier.getContactEmail())
                .phone(supplier.getPhone())
                .region(supplier.getRegion())
                .reliabilityScore(supplier.getReliabilityScore())
                .leadTimeDays(supplier.getLeadTimeDays())
                .status(supplier.getStatus())
                .trustScore(supplier.getTrustScore())
                .pan(supplier.getPan())
                .aadhaar(supplier.getAadhaar())
                .gstin(supplier.getGstin())
                .ifsc(supplier.getIfsc())
                .bankAccount(supplier.getBankAccount())
                .bankName(supplier.getBankName())
                .branchName(supplier.getBranchName())
                .udyamNumber(supplier.getUdyamNumber())
                .cin(supplier.getCin())
                .productsSuppliedCount(count)
                .createdAt(supplier.getCreatedAt())
                .updatedAt(supplier.getUpdatedAt())
                .build();
    }
}
