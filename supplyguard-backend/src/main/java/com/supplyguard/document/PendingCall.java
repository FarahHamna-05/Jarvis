package com.supplyguard.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "pending_calls")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PendingCall {

    @Id
    private String id;

    private String vapiCallId;
    private String supplierId;
    private String supplierName;
    private String supplierPhone;

    private String productId;
    private String productName;
    private Integer requiredQuantity;

    @Builder.Default
    private String status = "INITIATED"; // INITIATED, COMPLETED, FAILED

    private String errorMessage;

    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
}
