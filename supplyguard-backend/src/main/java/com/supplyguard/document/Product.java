package com.supplyguard.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    private String id;

    private String name;
    private String category;
    private String description;

    private String imageBase64; // base64 encoded or URL
    private String launchDate;

    private Integer currentStock;
    @Builder.Default
    private List<Integer> recentUsage = new ArrayList<>(); // Last 7 days usage
    private Integer reorderThreshold;

    private Long primarySupplierId;
    @Builder.Default
    private List<Long> alternateSupplierIds = new ArrayList<>();

    // Market context fields
    private Double marketPriceReference; // manual price reference
    private String demandTrend; // RISING, STABLE, FALLING

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
