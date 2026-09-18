package com.supplyguard.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String productId;
    private String productName;
    private Long supplierId;
    private String supplierName;

    private Integer quantity;
    private Double unitPrice;
    private Double totalAmount;

    private String status; // PENDING_APPROVAL, APPROVED, PLACED, FULFILLED, REJECTED
    private LocalDateTime orderDate;
    private LocalDateTime expectedDeliveryDate;

    @PrePersist
    protected void onCreate() {
        if (orderDate == null) {
            orderDate = LocalDateTime.now();
        }
        if (status == null) {
            status = "PENDING_APPROVAL";
        }
    }
}
