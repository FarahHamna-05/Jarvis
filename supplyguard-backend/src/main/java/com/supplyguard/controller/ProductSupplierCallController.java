package com.supplyguard.controller;

import com.supplyguard.document.PendingCall;
import com.supplyguard.dto.CallDto;
import com.supplyguard.service.SupplierComparisonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductSupplierCallController {

    private final SupplierComparisonService supplierComparisonService;

    /**
     * Triggers automated Vapi AI voice calls to all alternate suppliers for a given product.
     */
    @PostMapping("/{id}/check-suppliers")
    public ResponseEntity<List<PendingCall>> checkSuppliers(
            @PathVariable String id,
            @RequestParam(required = false, defaultValue = "100") Integer requiredQuantity,
            @RequestBody(required = false) CallDto.CheckSuppliersRequest body) {

        int demand = (body != null && body.getRequiredQuantity() != null && body.getRequiredQuantity() > 0)
                ? body.getRequiredQuantity()
                : (requiredQuantity != null ? requiredQuantity : 100);

        List<PendingCall> initiatedCalls = supplierComparisonService.checkAllSuppliers(id, demand);
        return ResponseEntity.ok(initiatedCalls);
    }

    /**
     * Retrieves ranked supplier comparison results based on structured voice call reports.
     */
    @GetMapping("/{id}/supplier-comparison")
    public ResponseEntity<CallDto.SupplierComparisonResponse> getSupplierComparison(@PathVariable String id) {
        CallDto.SupplierComparisonResponse response = supplierComparisonService.getComparisonResults(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Confirms the merchant's choice of supplier and records the approval to the audit log.
     */
    @PostMapping("/{id}/approve-supplier")
    public ResponseEntity<Map<String, Object>> approveSupplier(
            @PathVariable String id,
            @RequestBody Map<String, Object> payload) {

        Object supIdObj = payload.get("supplierId");
        if (supIdObj == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "supplierId is required"));
        }

        Long supplierId;
        try {
            supplierId = Long.parseLong(supIdObj.toString());
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid supplierId: " + supIdObj));
        }

        String approvedBy = (String) payload.getOrDefault("approvedBy", "Operator");
        String notes = (String) payload.getOrDefault("notes", null);

        supplierComparisonService.approveSupplier(id, supplierId, approvedBy, notes);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "productId", id,
                "approvedSupplierId", supplierId,
                "message", "Supplier successfully approved and logged to audit trail."
        ));
    }
}
