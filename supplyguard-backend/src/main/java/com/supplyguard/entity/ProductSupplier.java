package com.supplyguard.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_suppliers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductSupplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String productId; // Links to MongoDB Product ObjectId / String ID

    @Column(nullable = false)
    private Long supplierId;

    @Column(nullable = false)
    private Boolean isPrimary;

    private Double unitCost;

    private String notes;
}
