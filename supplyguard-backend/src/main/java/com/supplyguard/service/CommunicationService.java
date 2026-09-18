package com.supplyguard.service;

import com.supplyguard.document.Product;
import com.supplyguard.document.SupplierConversation;
import com.supplyguard.dto.AIContextDto;
import com.supplyguard.entity.AuditLog;
import com.supplyguard.entity.RiskEvent;
import com.supplyguard.entity.Supplier;
import com.supplyguard.repository.jpa.AuditLogRepository;
import com.supplyguard.repository.jpa.RiskEventRepository;
import com.supplyguard.repository.jpa.SupplierRepository;
import com.supplyguard.repository.mongo.ProductRepository;
import com.supplyguard.repository.mongo.SupplierConversationRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class CommunicationService {

    private static final Logger logger = LoggerFactory.getLogger(CommunicationService.class);

    private final SupplierConversationRepository conversationRepository;
    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;
    private final RiskEventRepository riskEventRepository;
    private final AuditLogRepository auditLogRepository;
    private final AIReasoningService aiReasoningService;
    private final Optional<JavaMailSender> mailSender;

    /**
     * Create an AI outreach email draft for a risk event.
     */
    public SupplierConversation createEmailDraftForRisk(Long riskEventId) {
        RiskEvent event = riskEventRepository.findById(riskEventId)
                .orElseThrow(() -> new RuntimeException("RiskEvent not found: " + riskEventId));

        Product product = productRepository.findById(event.getProductId()).orElse(null);
        Supplier supplier = event.getSupplierId() != null
                ? supplierRepository.findById(event.getSupplierId()).orElse(null)
                : null;

        AIContextDto.RiskContext context = AIContextDto.RiskContext.builder()
                .productId(event.getProductId())
                .productName(event.getProductName())
                .currentStock(product != null ? product.getCurrentStock() : 100)
                .averageDailyUsage(event.getAverageDailyUsage())
                .daysUntilStockout(event.getDaysUntilStockout())
                .primarySupplierName(supplier != null ? supplier.getName() : event.getSupplierName())
                .primarySupplierLeadTime(event.getSupplierLeadTimeDays())
                .primarySupplierStatus(supplier != null ? supplier.getStatus() : "ACTIVE")
                .build();

        String emailBody = aiReasoningService.generateEmailDraft(context);
        String subject = String.format("URGENT: SupplyGuard Procurement Notice - %s [SKU: %s]",
                event.getProductName(), event.getProductId());

        SupplierConversation conversation = conversationRepository.findByRiskEventId(riskEventId)
                .orElse(SupplierConversation.builder()
                        .supplierId(supplier != null ? supplier.getId() : null)
                        .supplierName(supplier != null ? supplier.getName() : event.getSupplierName())
                        .supplierEmail(supplier != null ? supplier.getContactEmail() : "supplier@example.com")
                        .riskEventId(riskEventId)
                        .productId(event.getProductId())
                        .productName(event.getProductName())
                        .threadSubject(subject)
                        .messages(new ArrayList<>())
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build());

        SupplierConversation.ConversationMessage draftMessage = SupplierConversation.ConversationMessage.builder()
                .id(UUID.randomUUID().toString())
                .sender("AI")
                .senderName("SupplyGuard Autonomous Procurement Agent")
                .subject(subject)
                .body(emailBody)
                .deliveryStatus("PENDING_APPROVAL")
                .timestamp(LocalDateTime.now())
                .build();

        conversation.getMessages().add(draftMessage);
        conversation.setUpdatedAt(LocalDateTime.now());

        return conversationRepository.save(conversation);
    }

    /**
     * Send approved email to supplier.
     */
    public SupplierConversation sendApprovedEmail(String conversationId, String messageId, String approvedBy) {
        SupplierConversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found: " + conversationId));

        SupplierConversation.ConversationMessage targetMessage = conversation.getMessages().stream()
                .filter(m -> m.getId().equals(messageId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Message not found in conversation: " + messageId));

        targetMessage.setDeliveryStatus("SENT");
        conversation.setUpdatedAt(LocalDateTime.now());

        // Attempt actual dispatch if mailSender is configured with live credentials, otherwise log to outbox
        try {
            if (mailSender.isPresent() && conversation.getSupplierEmail() != null) {
                SimpleMailMessage mail = new SimpleMailMessage();
                mail.setTo(conversation.getSupplierEmail());
                mail.setSubject(targetMessage.getSubject());
                mail.setText(targetMessage.getBody());
                mailSender.get().send(mail);
                logger.info("Real email dispatched to {}", conversation.getSupplierEmail());
            } else {
                logger.info("Email recorded in simulated dispatch outbox for {}", conversation.getSupplierEmail());
            }
        } catch (Exception e) {
            logger.warn("Mail dispatch exception (logged to outbox): {}", e.getMessage());
        }

        SupplierConversation saved = conversationRepository.save(conversation);

        // Record Audit Log
        auditLogRepository.save(AuditLog.builder()
                .eventType("EMAIL_SENT")
                .entityType("SUPPLIER_CONVERSATION")
                .entityId(conversationId)
                .actionTaken("DISPATCH_AI_PROCUREMENT_EMAIL")
                .reasoningDetails(String.format("Subject: %s | Recipient: %s", targetMessage.getSubject(), conversation.getSupplierEmail()))
                .dataSnapshotJson(targetMessage.getBody())
                .userApproved(true)
                .approvedBy(approvedBy != null ? approvedBy : "USER")
                .timestamp(LocalDateTime.now())
                .build());

        return saved;
    }

    /**
     * Ingest or simulate an incoming supplier reply.
     */
    public SupplierConversation ingestSupplierReply(String conversationId, String replyBody, Integer promisedLeadTimeDays) {
        SupplierConversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found: " + conversationId));

        SupplierConversation.ConversationMessage replyMessage = SupplierConversation.ConversationMessage.builder()
                .id(UUID.randomUUID().toString())
                .sender("SUPPLIER")
                .senderName(conversation.getSupplierName())
                .subject("Re: " + conversation.getThreadSubject())
                .body(replyBody)
                .deliveryStatus("RECEIVED")
                .timestamp(LocalDateTime.now())
                .build();

        conversation.getMessages().add(replyMessage);
        conversation.setUpdatedAt(LocalDateTime.now());

        // If supplier promised a specific expedited lead time, we can update supplier trust and record in audit log
        if (promisedLeadTimeDays != null && conversation.getSupplierId() != null) {
            supplierRepository.findById(conversation.getSupplierId()).ifPresent(s -> {
                s.setTrustScore(Math.min(100.0, (s.getTrustScore() != null ? s.getTrustScore() : 80.0) + 2.0));
                supplierRepository.save(s);
            });
        }

        SupplierConversation saved = conversationRepository.save(conversation);

        auditLogRepository.save(AuditLog.builder()
                .eventType("SUPPLIER_REPLY_RECEIVED")
                .entityType("SUPPLIER_CONVERSATION")
                .entityId(conversationId)
                .actionTaken("INGEST_SUPPLIER_RESPONSE")
                .reasoningDetails("Supplier responded with updated availability")
                .dataSnapshotJson(replyBody)
                .approvedBy("EXTERNAL_SUPPLIER")
                .timestamp(LocalDateTime.now())
                .build());

        return saved;
    }

    public List<SupplierConversation> getAllConversations() {
        return conversationRepository.findAllByOrderByUpdatedAtDesc();
    }

    public Optional<SupplierConversation> getConversationById(String id) {
        return conversationRepository.findById(id);
    }
}
