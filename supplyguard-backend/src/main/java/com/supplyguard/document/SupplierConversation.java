package com.supplyguard.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "supplier_conversations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupplierConversation {

    @Id
    private String id;

    private Long supplierId;
    private String supplierName;
    private String supplierEmail;
    private Long riskEventId;
    private String productId;
    private String productName;

    private String threadSubject;

    @Builder.Default
    private List<ConversationMessage> messages = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ConversationMessage {
        private String id;
        private String sender; // AI, SUPPLIER, USER
        private String senderName;
        private String subject;
        private String body;
        private String deliveryStatus; // DRAFT, PENDING_APPROVAL, SENT, RECEIVED
        private LocalDateTime timestamp;
    }
}
