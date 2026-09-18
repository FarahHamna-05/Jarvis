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
    private final EmailService emailService;

    /**
     * Create an AI outreach email draft for a risk event and actually dispatch via SendGrid.
     *
     * @param riskEventId     ID of the detected risk event
     * @param toEmailOverride Optional destination email override (for live demo/testing)
     * @return Saved conversation with actual delivery result
     */
    public SupplierConversation createEmailDraftForRisk(Long riskEventId, String toEmailOverride) {
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

        String effectiveRecipient = (toEmailOverride != null && !toEmailOverride.trim().isEmpty())
                ? toEmailOverride.trim()
                : (conversation.getSupplierEmail() != null ? conversation.getSupplierEmail().trim() : "supplier@example.com");

        // ACTUALLY SEND that email to the supplier's real email address using SendGrid's API
        EmailService.EmailSendResult sendResult = emailService.sendSupplierEmail(
                effectiveRecipient,
                subject,
                emailBody
        );

        SupplierConversation.ConversationMessage draftMessage = SupplierConversation.ConversationMessage.builder()
                .id(UUID.randomUUID().toString())
                .sender("AI")
                .senderName("SupplyGuard Autonomous Procurement Agent")
                .subject(subject)
                .body(emailBody)
                .recipientEmail(effectiveRecipient)
                .deliveryStatus(sendResult.isSuccess() ? "SENT" : "FAILED")
                .status(sendResult.isSuccess() ? "sent" : "failed")
                .deliveryDetails(sendResult.getMessage())
                .sentAt(sendResult.getSentAt())
                .timestamp(LocalDateTime.now())
                .build();

        conversation.getMessages().add(draftMessage);
        conversation.setLastDeliveryStatus(sendResult.isSuccess() ? "sent" : "failed");
        conversation.setLastDeliveryDetails(sendResult.getMessage());
        conversation.setLastSentAt(sendResult.getSentAt());
        conversation.setUpdatedAt(LocalDateTime.now());

        SupplierConversation saved = conversationRepository.save(conversation);

        // Record Audit Log with actual delivery result
        auditLogRepository.save(AuditLog.builder()
                .eventType(sendResult.isSuccess() ? "EMAIL_SENT" : "EMAIL_FAILED")
                .entityType("RISK_EVENT_OUTREACH")
                .entityId(String.valueOf(riskEventId))
                .actionTaken("DISPATCH_AI_RISK_OUTREACH_EMAIL")
                .reasoningDetails(String.format("Subject: %s | Recipient: %s | SendGrid HTTP %d: %s",
                        subject, effectiveRecipient, sendResult.getStatusCode(), sendResult.getMessage()))
                .dataSnapshotJson(emailBody)
                .userApproved(true)
                .approvedBy("AUTONOMOUS_RISK_ENGINE")
                .timestamp(LocalDateTime.now())
                .build());

        return saved;
    }

    public SupplierConversation createEmailDraftForRisk(Long riskEventId) {
        return createEmailDraftForRisk(riskEventId, null);
    }

    /**
     * Send approved email to supplier using SendGrid API.
     */
    public SupplierConversation sendApprovedEmail(String conversationId, String messageId, String toEmailOverride, String approvedBy) {
        SupplierConversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found: " + conversationId));

        SupplierConversation.ConversationMessage targetMessage = conversation.getMessages().stream()
                .filter(m -> m.getId().equals(messageId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Message not found in conversation: " + messageId));

        String effectiveRecipient = (toEmailOverride != null && !toEmailOverride.trim().isEmpty())
                ? toEmailOverride.trim()
                : (conversation.getSupplierEmail() != null ? conversation.getSupplierEmail().trim() : "supplier@example.com");

        // Send via real SendGrid API
        EmailService.EmailSendResult sendResult = emailService.sendSupplierEmail(
                effectiveRecipient,
                targetMessage.getSubject(),
                targetMessage.getBody()
        );

        targetMessage.setRecipientEmail(effectiveRecipient);
        targetMessage.setSentAt(sendResult.getSentAt());
        targetMessage.setDeliveryDetails(sendResult.getMessage());
        targetMessage.setDeliveryStatus(sendResult.isSuccess() ? "SENT" : "FAILED");
        targetMessage.setStatus(sendResult.isSuccess() ? "sent" : "failed");

        conversation.setLastDeliveryStatus(sendResult.isSuccess() ? "sent" : "failed");
        conversation.setLastDeliveryDetails(sendResult.getMessage());
        conversation.setLastSentAt(sendResult.getSentAt());
        conversation.setUpdatedAt(LocalDateTime.now());

        SupplierConversation saved = conversationRepository.save(conversation);

        // Record Audit Log with actual delivery result
        auditLogRepository.save(AuditLog.builder()
                .eventType(sendResult.isSuccess() ? "EMAIL_SENT" : "EMAIL_FAILED")
                .entityType("SUPPLIER_CONVERSATION")
                .entityId(conversationId)
                .actionTaken("DISPATCH_AI_PROCUREMENT_EMAIL")
                .reasoningDetails(String.format("Subject: %s | Recipient: %s | SendGrid HTTP %d: %s",
                        targetMessage.getSubject(), effectiveRecipient, sendResult.getStatusCode(), sendResult.getMessage()))
                .dataSnapshotJson(targetMessage.getBody())
                .userApproved(true)
                .approvedBy(approvedBy != null ? approvedBy : "USER")
                .timestamp(LocalDateTime.now())
                .build());

        return saved;
    }

    public SupplierConversation sendApprovedEmail(String conversationId, String messageId, String approvedBy) {
        return sendApprovedEmail(conversationId, messageId, null, approvedBy);
    }

    /**
     * Trigger on-demand supplier outreach (generate draft & dispatch via SendGrid).
     */
    public SupplierConversation contactSupplierOnDemand(Long supplierId, String toEmailOverride, String customSubject, String customNotes, String productId, String approvedBy) {
        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + supplierId));

        Product product = productId != null ? productRepository.findById(productId).orElse(null) : null;
        if (product == null) {
            List<Product> allProds = productRepository.findAll();
            if (!allProds.isEmpty()) product = allProds.get(0);
        }

        String effectiveTo = (toEmailOverride != null && !toEmailOverride.trim().isEmpty())
                ? toEmailOverride.trim()
                : (supplier.getContactEmail() != null ? supplier.getContactEmail() : "supplier@example.com");

        String productName = product != null ? product.getName() : "Critical Sourcing Material";
        String prodId = product != null ? product.getId() : "SKU-AUTO-01";

        AIContextDto.RiskContext context = AIContextDto.RiskContext.builder()
                .productId(prodId)
                .productName(productName)
                .currentStock(product != null ? product.getCurrentStock() : 120)
                .averageDailyUsage(18.5)
                .daysUntilStockout(6.5)
                .primarySupplierName(supplier.getName())
                .primarySupplierLeadTime(supplier.getLeadTimeDays() != null ? supplier.getLeadTimeDays() : 14)
                .primarySupplierStatus(supplier.getStatus() != null ? supplier.getStatus() : "ACTIVE")
                .build();

        String emailBody = (customNotes != null && !customNotes.trim().isEmpty())
                ? customNotes.trim()
                : aiReasoningService.generateEmailDraft(context);

        String subject = (customSubject != null && !customSubject.trim().isEmpty())
                ? customSubject.trim()
                : String.format("URGENT: SupplyGuard Procurement Notice - %s [SKU: %s]", productName, prodId);

        // Send via SendGrid
        EmailService.EmailSendResult sendResult = emailService.sendSupplierEmail(effectiveTo, subject, emailBody);

        SupplierConversation.ConversationMessage msg = SupplierConversation.ConversationMessage.builder()
                .id(UUID.randomUUID().toString())
                .sender("AI")
                .senderName("SupplyGuard Autonomous Procurement Agent")
                .subject(subject)
                .body(emailBody)
                .recipientEmail(effectiveTo)
                .deliveryStatus(sendResult.isSuccess() ? "SENT" : "FAILED")
                .status(sendResult.isSuccess() ? "sent" : "failed")
                .deliveryDetails(sendResult.getMessage())
                .sentAt(sendResult.getSentAt())
                .timestamp(LocalDateTime.now())
                .build();

        SupplierConversation conversation = conversationRepository.findFirstBySupplierIdOrderByUpdatedAtDesc(supplierId)
                .orElse(SupplierConversation.builder()
                        .supplierId(supplier.getId())
                        .supplierName(supplier.getName())
                        .supplierEmail(supplier.getContactEmail())
                        .productId(prodId)
                        .productName(productName)
                        .threadSubject(subject)
                        .messages(new ArrayList<>())
                        .createdAt(LocalDateTime.now())
                        .build());

        conversation.getMessages().add(msg);
        conversation.setLastDeliveryStatus(sendResult.isSuccess() ? "sent" : "failed");
        conversation.setLastDeliveryDetails(sendResult.getMessage());
        conversation.setLastSentAt(sendResult.getSentAt());
        conversation.setUpdatedAt(LocalDateTime.now());

        SupplierConversation saved = conversationRepository.save(conversation);

        auditLogRepository.save(AuditLog.builder()
                .eventType(sendResult.isSuccess() ? "EMAIL_SENT" : "EMAIL_FAILED")
                .entityType("SUPPLIER_CONTACT")
                .entityId(String.valueOf(supplierId))
                .actionTaken("ON_DEMAND_SUPPLIER_CONTACT")
                .reasoningDetails(String.format("Subject: %s | Recipient: %s | SendGrid HTTP %d: %s",
                        subject, effectiveTo, sendResult.getStatusCode(), sendResult.getMessage()))
                .dataSnapshotJson(emailBody)
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
