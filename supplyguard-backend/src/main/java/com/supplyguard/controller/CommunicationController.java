package com.supplyguard.controller;

import com.supplyguard.document.SupplierConversation;
import com.supplyguard.service.CommunicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/communications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CommunicationController {

    private final CommunicationService communicationService;
    private final com.supplyguard.service.EmailService emailService;

    @GetMapping
    public ResponseEntity<List<SupplierConversation>> getAllConversations() {
        return ResponseEntity.ok(communicationService.getAllConversations());
    }

    @GetMapping("/email-config")
    public ResponseEntity<Map<String, Object>> getEmailConfig() {
        return ResponseEntity.ok(emailService.getEmailConfigStatus());
    }

    @PostMapping("/email-config")
    public ResponseEntity<Map<String, Object>> updateEmailConfig(@RequestBody Map<String, String> config) {
        String username = config.get("gmailUsername");
        String appPassword = config.get("gmailAppPassword");
        emailService.configureGmail(username, appPassword);
        return ResponseEntity.ok(emailService.getEmailConfigStatus());
    }

    @PostMapping("/test-email")
    public ResponseEntity<com.supplyguard.service.EmailService.EmailSendResult> testEmailDelivery(@RequestBody Map<String, String> payload) {
        String toEmail = payload.getOrDefault("toEmail", "test@example.com");
        String subject = payload.getOrDefault("subject", "SupplyGuard Real Email Delivery Test");
        String body = payload.getOrDefault("body", "This is a real test email dispatched by SupplyGuard to verify Gmail SMTP delivery.");
        return ResponseEntity.ok(emailService.sendSupplierEmail(toEmail, subject, body));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SupplierConversation> getConversationById(@PathVariable String id) {
        return communicationService.getConversationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/draft/{riskId}")
    public ResponseEntity<SupplierConversation> createDraftForRisk(
            @PathVariable Long riskId,
            @RequestParam(required = false) String toEmail) {
        return ResponseEntity.ok(communicationService.createEmailDraftForRisk(riskId, toEmail));
    }

    @PostMapping("/trigger-outreach/{riskId}")
    public ResponseEntity<SupplierConversation> triggerOutreachForRisk(
            @PathVariable Long riskId,
            @RequestParam(required = false) String toEmail) {
        return ResponseEntity.ok(communicationService.createEmailDraftForRisk(riskId, toEmail));
    }

    @PostMapping("/{conversationId}/send/{messageId}")
    public ResponseEntity<SupplierConversation> sendApprovedEmail(
            @PathVariable String conversationId,
            @PathVariable String messageId,
            @RequestParam(required = false) String toEmail,
            @RequestParam(required = false, defaultValue = "Operator") String approvedBy) {
        return ResponseEntity.ok(communicationService.sendApprovedEmail(conversationId, messageId, toEmail, approvedBy));
    }

    @PostMapping("/{conversationId}/reply")
    public ResponseEntity<SupplierConversation> ingestSupplierReply(
            @PathVariable String conversationId,
            @RequestBody Map<String, Object> replyPayload) {
        String replyBody = (String) replyPayload.getOrDefault("replyBody", "We acknowledge receipt and will provide expedited delivery update.");
        Integer promisedDays = replyPayload.get("promisedLeadTimeDays") != null
                ? Integer.parseInt(replyPayload.get("promisedLeadTimeDays").toString())
                : null;

        return ResponseEntity.ok(communicationService.ingestSupplierReply(conversationId, replyBody, promisedDays));
    }
}
