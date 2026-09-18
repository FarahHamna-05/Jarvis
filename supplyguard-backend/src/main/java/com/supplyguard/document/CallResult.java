package com.supplyguard.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "call_results")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CallResult {

    @Id
    private String id;

    private String vapiCallId;
    private String supplierId;
    private String supplierName;

    private String productId;
    private String productName;

    private Boolean availability;
    private Integer stockQuantity;
    private Integer deliveryDays;
    private Double pricePerUnit;
    private Boolean interested;

    private String fullTranscript;
    private String callStatus; // e.g. "ended", "completed", "failed"

    private LocalDateTime timestamp;
    private LocalDateTime createdAt;
}
