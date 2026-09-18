package com.supplyguard.service;

import com.supplyguard.document.Product;
import com.supplyguard.dto.RiskDto;
import com.supplyguard.entity.AuditLog;
import com.supplyguard.entity.Order;
import com.supplyguard.entity.RiskEvent;
import com.supplyguard.entity.Supplier;
import com.supplyguard.repository.jpa.AuditLogRepository;
import com.supplyguard.repository.jpa.OrderRepository;
import com.supplyguard.repository.jpa.RiskEventRepository;
import com.supplyguard.repository.jpa.SupplierRepository;
import com.supplyguard.repository.mongo.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HumanApprovalService {

    private static final Logger logger = LoggerFactory.getLogger(HumanApprovalService.class);

    private final RiskEventRepository riskEventRepository;
    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;
    private final OrderRepository orderRepository;
    private final AuditLogRepository auditLogRepository;
    private final RiskEngineService riskEngineService;
    private final CommunicationService communicationService;

    @Transactional
    public RiskEvent processApproval(RiskDto.ApprovalActionRequest request, String approvedBy) {
        RiskEvent event = riskEventRepository.findById(request.getRiskEventId())
                .orElseThrow(() -> new RuntimeException("RiskEvent not found: " + request.getRiskEventId()));

        Product product = productRepository.findById(event.getProductId()).orElse(null);
        boolean isApproved = Boolean.TRUE.equals(request.getApproved());

        event.setActionApproved(isApproved);
        event.setStatus(isApproved ? "APPROVED" : "REJECTED");
        event.setUpdatedAt(LocalDateTime.now());

        String actionDescription;

        if (isApproved) {
            actionDescription = "HUMAN_APPROVED: " + event.getActionRecommended();

            // 1. If switching supplier was requested or chosen
            if (request.getSwitchSupplierId() != null && product != null) {
                Long oldSupplierId = product.getPrimarySupplierId();
                product.setPrimarySupplierId(request.getSwitchSupplierId());

                // Move old primary to alternates if not already present
                if (oldSupplierId != null && !product.getAlternateSupplierIds().contains(oldSupplierId)) {
                    product.getAlternateSupplierIds().add(oldSupplierId);
                }
                productRepository.save(product);

                Supplier newSup = supplierRepository.findById(request.getSwitchSupplierId()).orElse(null);
                actionDescription += String.format(" | Switched primary supplier to %s", newSup != null ? newSup.getName() : request.getSwitchSupplierId());
            }

            // 2. Create Purchase Order if applicable
            int orderQty = request.getOrderQuantity() != null && request.getOrderQuantity() > 0
                    ? request.getOrderQuantity()
                    : (int) Math.max(250, (event.getAverageDailyUsage() != null ? event.getAverageDailyUsage() : 20) * 30);

            Order order = Order.builder()
                    .productId(event.getProductId())
                    .productName(event.getProductName())
                    .supplierId(event.getSupplierId())
                    .supplierName(event.getSupplierName())
                    .quantity(orderQty)
                    .unitPrice(45.0)
                    .totalAmount(orderQty * 45.0)
                    .status("APPROVED")
                    .orderDate(LocalDateTime.now())
                    .expectedDeliveryDate(LocalDateTime.now().plusDays(event.getSupplierLeadTimeDays() != null ? event.getSupplierLeadTimeDays() : 14))
                    .build();

            orderRepository.save(order);
            actionDescription += String.format(" | Created Order PO #%d for %d units", order.getId(), orderQty);

            // 3. Draft and auto-prepare email for communication
            try {
                communicationService.createEmailDraftForRisk(event.getId());
            } catch (Exception e) {
                logger.warn("Failed to create email draft during approval: {}", e.getMessage());
            }

            // 4. Re-evaluate product risk with the new parameters
            if (product != null) {
                riskEngineService.evaluateProductRisk(product);
            }
        } else {
            actionDescription = "HUMAN_REJECTED: AI recommendation dismissed by user. Reason/Notes: " + (request.getNotes() != null ? request.getNotes() : "Manual override");
        }

        RiskEvent savedEvent = riskEventRepository.save(event);

        // Record detailed audit log
        String snapshot = String.format("{\"riskEventId\":%d,\"productId\":\"%s\",\"severity\":\"%s\",\"approved\":%b,\"notes\":\"%s\"}",
                event.getId(), event.getProductId(), event.getSeverity(), isApproved, request.getNotes());

        auditLogRepository.save(AuditLog.builder()
                .eventType(isApproved ? "HUMAN_APPROVAL" : "HUMAN_REJECTION")
                .entityType("RISK_EVENT")
                .entityId(String.valueOf(event.getId()))
                .actionTaken(actionDescription)
                .reasoningDetails(event.getAiReasoning())
                .dataSnapshotJson(snapshot)
                .userApproved(isApproved)
                .approvedBy(approvedBy != null ? approvedBy : "USER")
                .timestamp(LocalDateTime.now())
                .build());

        return savedEvent;
    }

    public List<AuditLog> getAuditLogs() {
        return auditLogRepository.findAllByOrderByTimestampDesc();
    }
}
