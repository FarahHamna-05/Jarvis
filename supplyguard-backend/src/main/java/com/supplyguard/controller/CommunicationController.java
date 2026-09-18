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

    @GetMapping
    public ResponseEntity<List<SupplierConversation>> getAllConversations() {
        return ResponseEntity.ok(communicationService.getAllConversations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SupplierConversation> getConversationById(@PathVariable String id) {
        return communicationService.getConversationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/draft/{riskId}")
    public ResponseEntity<SupplierConversation> createDraftForRisk(@PathVariable Long riskId) {
        return ResponseEntity.ok(communicationService.createEmailDraftForRisk(riskId));
    }

    @PostMapping("/{conversationId}/send/{messageId}")
    public ResponseEntity<SupplierConversation> sendApprovedEmail(
            @PathVariable String conversationId,
            @PathVariable String messageId,
            @RequestParam(required = false, defaultValue = "Operator") String approvedBy) {
        return ResponseEntity.ok(communicationService.sendApprovedEmail(conversationId, messageId, approvedBy));
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
