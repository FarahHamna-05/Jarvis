package com.supplyguard.controller;

import com.supplyguard.dto.SupplierDto;
import com.supplyguard.service.SupplierService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/suppliers")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SupplierController {

    private final SupplierService supplierService;
    private final com.supplyguard.service.CommunicationService communicationService;

    @GetMapping
    public ResponseEntity<List<SupplierDto.Response>> getAllSuppliers() {
        return ResponseEntity.ok(supplierService.getAllSuppliers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SupplierDto.Response> getSupplierById(@PathVariable Long id) {
        return supplierService.getSupplierById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<SupplierDto.Response> createSupplier(@Valid @RequestBody SupplierDto.Request request) {
        return ResponseEntity.ok(supplierService.createSupplier(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SupplierDto.Response> updateSupplier(@PathVariable Long id, @Valid @RequestBody SupplierDto.Request request) {
        return ResponseEntity.ok(supplierService.updateSupplier(id, request));
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<SupplierDto.Response> toggleStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String newStatus = body.getOrDefault("status", "ACTIVE");
        return ResponseEntity.ok(supplierService.toggleStatus(id, newStatus));
    }

    @PostMapping("/{id}/contact")
    public ResponseEntity<?> contactSupplier(
            @PathVariable Long id,
            @RequestParam(required = false) String toEmail,
            @RequestParam(required = false) String customSubject,
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) String customNotes,
            @RequestParam(required = false) String productId,
            @RequestParam(required = false) String approvedBy,
            @RequestBody(required = false) Map<String, Object> contactPayload) {

        String effToEmail = toEmail;
        String effSubject = customSubject != null ? customSubject : subject;
        String effCustomNotes = customNotes;
        String effProductId = productId;
        String effApprovedBy = (approvedBy != null && !approvedBy.trim().isEmpty()) ? approvedBy : "Operator";

        if (contactPayload != null) {
            if (contactPayload.get("toEmail") != null) effToEmail = (String) contactPayload.get("toEmail");
            if (contactPayload.get("customSubject") != null) effSubject = (String) contactPayload.get("customSubject");
            else if (contactPayload.get("subject") != null) effSubject = (String) contactPayload.get("subject");
            if (contactPayload.get("customNotes") != null) effCustomNotes = (String) contactPayload.get("customNotes");
            if (contactPayload.get("productId") != null) effProductId = String.valueOf(contactPayload.get("productId"));
            if (contactPayload.get("approvedBy") != null) effApprovedBy = (String) contactPayload.get("approvedBy");
        }

        com.supplyguard.document.SupplierConversation convo = communicationService.contactSupplierOnDemand(
                id, effToEmail, effSubject, effCustomNotes, effProductId, effApprovedBy
        );
        return ResponseEntity.ok(convo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSupplier(@PathVariable Long id) {
        supplierService.deleteSupplier(id);
        return ResponseEntity.noContent().build();
    }
}
