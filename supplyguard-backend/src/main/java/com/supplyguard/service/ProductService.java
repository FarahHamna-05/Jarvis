package com.supplyguard.service;

import com.supplyguard.document.Product;
import com.supplyguard.dto.ProductDto;
import com.supplyguard.entity.ProductSupplier;
import com.supplyguard.entity.RiskEvent;
import com.supplyguard.entity.Supplier;
import com.supplyguard.repository.jpa.ProductSupplierRepository;
import com.supplyguard.repository.jpa.RiskEventRepository;
import com.supplyguard.repository.jpa.SupplierRepository;
import com.supplyguard.repository.mongo.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;
    private final ProductSupplierRepository productSupplierRepository;
    private final RiskEventRepository riskEventRepository;
    private final RiskEngineService riskEngineService;

    public List<ProductDto.Response> getAllProducts() {
        return getAllProducts(null);
    }

    public List<ProductDto.Response> getAllProducts(Long userId) {
        List<Product> products;
        if (userId != null) {
            products = productRepository.findByUserId(userId);
            if (products.isEmpty()) {
                products = seedStarterProductsForUser(userId);
            }
        } else {
            products = productRepository.findAll();
        }
        return products.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private List<Product> seedStarterProductsForUser(Long userId) {
        List<Product> templates = productRepository.findByUserId(null);
        if (templates.isEmpty()) {
            templates = productRepository.findAll();
        }
        if (templates.isEmpty()) {
            return Collections.emptyList();
        }
        List<Product> userProducts = new ArrayList<>();
        for (Product base : templates) {
            Product clone = Product.builder()
                    .userId(userId)
                    .name(base.getName())
                    .category(base.getCategory())
                    .description(base.getDescription())
                    .imageBase64(base.getImageBase64())
                    .launchDate(base.getLaunchDate())
                    .currentStock(base.getCurrentStock())
                    .recentUsage(base.getRecentUsage() != null ? new ArrayList<>(base.getRecentUsage()) : Arrays.asList(10, 12, 11, 14, 13, 15, 12))
                    .reorderThreshold(base.getReorderThreshold())
                    .primarySupplierId(base.getPrimarySupplierId())
                    .alternateSupplierIds(base.getAlternateSupplierIds() != null ? new ArrayList<>(base.getAlternateSupplierIds()) : new ArrayList<>())
                    .marketPriceReference(base.getMarketPriceReference())
                    .demandTrend(base.getDemandTrend())
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            Product saved = productRepository.save(clone);
            syncProductSuppliers(saved);
            riskEngineService.evaluateProductRisk(saved);
            userProducts.add(saved);
        }
        return userProducts;
    }

    public Optional<ProductDto.Response> getProductById(String id) {
        return productRepository.findById(id).map(this::mapToResponse);
    }

    @Transactional
    public ProductDto.Response createProduct(ProductDto.Request request) {
        Product product = Product.builder()
                .userId(request.getUserId())
                .name(request.getName())
                .category(request.getCategory())
                .description(request.getDescription())
                .imageBase64(request.getImageBase64())
                .launchDate(request.getLaunchDate())
                .currentStock(request.getCurrentStock())
                .recentUsage(request.getRecentUsage() != null ? request.getRecentUsage() : Arrays.asList(10, 12, 11, 14, 13, 15, 12))
                .reorderThreshold(request.getReorderThreshold() != null ? request.getReorderThreshold() : 50)
                .primarySupplierId(request.getPrimarySupplierId())
                .alternateSupplierIds(request.getAlternateSupplierIds() != null ? request.getAlternateSupplierIds() : new ArrayList<>())
                .marketPriceReference(request.getMarketPriceReference())
                .demandTrend(request.getDemandTrend() != null ? request.getDemandTrend() : "STABLE")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Product savedProduct = productRepository.save(product);

        // Sync relational mappings in MySQL
        syncProductSuppliers(savedProduct);

        // Auto-evaluate risk immediately
        riskEngineService.evaluateProductRisk(savedProduct);

        return mapToResponse(savedProduct);
    }

    @Transactional
    public ProductDto.Response updateProduct(String id, ProductDto.Request request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        product.setName(request.getName());
        product.setCategory(request.getCategory());
        product.setDescription(request.getDescription());
        if (request.getImageBase64() != null) {
            product.setImageBase64(request.getImageBase64());
        }
        product.setLaunchDate(request.getLaunchDate());
        product.setCurrentStock(request.getCurrentStock());
        if (request.getRecentUsage() != null) {
            product.setRecentUsage(request.getRecentUsage());
        }
        if (request.getReorderThreshold() != null) {
            product.setReorderThreshold(request.getReorderThreshold());
        }
        product.setPrimarySupplierId(request.getPrimarySupplierId());
        if (request.getAlternateSupplierIds() != null) {
            product.setAlternateSupplierIds(request.getAlternateSupplierIds());
        }
        if (request.getMarketPriceReference() != null) {
            product.setMarketPriceReference(request.getMarketPriceReference());
        }
        if (request.getDemandTrend() != null) {
            product.setDemandTrend(request.getDemandTrend());
        }
        product.setUpdatedAt(LocalDateTime.now());

        Product updatedProduct = productRepository.save(product);

        // Sync relational mappings
        syncProductSuppliers(updatedProduct);

        // Re-evaluate risk immediately
        riskEngineService.evaluateProductRisk(updatedProduct);

        return mapToResponse(updatedProduct);
    }

    @Transactional
    public void deleteProduct(String id) {
        productRepository.deleteById(id);
        productSupplierRepository.deleteByProductId(id);
    }

    private void syncProductSuppliers(Product product) {
        productSupplierRepository.deleteByProductId(product.getId());

        if (product.getPrimarySupplierId() != null) {
            productSupplierRepository.save(ProductSupplier.builder()
                    .productId(product.getId())
                    .supplierId(product.getPrimarySupplierId())
                    .isPrimary(true)
                    .unitCost(45.0)
                    .notes("Primary Tier-1 Supplier")
                    .build());
        }

        if (product.getAlternateSupplierIds() != null) {
            for (Long altId : product.getAlternateSupplierIds()) {
                productSupplierRepository.save(ProductSupplier.builder()
                    .productId(product.getId())
                    .supplierId(altId)
                    .isPrimary(false)
                    .unitCost(52.0)
                    .notes("Secondary Backup Supplier")
                    .build());
            }
        }
    }

    public ProductDto.Response mapToResponse(Product product) {
        Supplier primarySupplier = null;
        if (product.getPrimarySupplierId() != null) {
            primarySupplier = supplierRepository.findById(product.getPrimarySupplierId()).orElse(null);
        }

        List<String> altNames = new ArrayList<>();
        if (product.getAlternateSupplierIds() != null) {
            for (Long altId : product.getAlternateSupplierIds()) {
                supplierRepository.findById(altId).ifPresent(s -> altNames.add(s.getName()));
            }
        }

        double avgUsage = riskEngineService.calculateAverageDailyUsage(product.getRecentUsage());
        double daysStockout = avgUsage > 0 ? product.getCurrentStock() / (avgUsage * 1.2) : 999.0;

        Optional<RiskEvent> latestRisk = riskEventRepository.findTopByProductIdOrderByCreatedAtDesc(product.getId());

        return ProductDto.Response.builder()
                .id(product.getId())
                .userId(product.getUserId())
                .name(product.getName())
                .category(product.getCategory())
                .description(product.getDescription())
                .imageBase64(product.getImageBase64())
                .launchDate(product.getLaunchDate())
                .currentStock(product.getCurrentStock())
                .recentUsage(product.getRecentUsage())
                .reorderThreshold(product.getReorderThreshold())
                .primarySupplierId(product.getPrimarySupplierId())
                .primarySupplierName(primarySupplier != null ? primarySupplier.getName() : "Unassigned")
                .primarySupplierStatus(primarySupplier != null ? primarySupplier.getStatus() : "N/A")
                .primarySupplierLeadTime(primarySupplier != null ? primarySupplier.getLeadTimeDays() : 14)
                .alternateSupplierIds(product.getAlternateSupplierIds())
                .alternateSupplierNames(altNames)
                .marketPriceReference(product.getMarketPriceReference())
                .demandTrend(product.getDemandTrend())
                .averageDailyUsage(Math.round(avgUsage * 100.0) / 100.0)
                .daysUntilStockout(Math.round(daysStockout * 10.0) / 10.0)
                .riskSeverity(latestRisk.map(RiskEvent::getSeverity).orElse("LOW"))
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }
}
