package com.supplyguard.controller;

import com.supplyguard.dto.RiskDto;
import com.supplyguard.entity.AuditLog;
import com.supplyguard.entity.RiskEvent;
import com.supplyguard.service.HumanApprovalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/approvals")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ApprovalController {

    private final HumanApprovalService humanApprovalService;

    @PostMapping("/action")
    public ResponseEntity<RiskEvent> processApprovalAction(
            @RequestBody RiskDto.ApprovalActionRequest request,
            @RequestParam(required = false, defaultValue = "Operator") String approvedBy) {
        return ResponseEntity.ok(humanApprovalService.processApproval(request, approvedBy));
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<List<AuditLog>> getAuditLogs() {
        return ResponseEntity.ok(humanApprovalService.getAuditLogs());
    }
}
