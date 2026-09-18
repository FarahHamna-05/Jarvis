package com.supplyguard.service;

import com.supplyguard.document.AIChatSession;
import com.supplyguard.document.Product;
import com.supplyguard.entity.RiskEvent;
import com.supplyguard.entity.Supplier;
import com.supplyguard.repository.jpa.RiskEventRepository;
import com.supplyguard.repository.jpa.SupplierRepository;
import com.supplyguard.repository.mongo.AIChatSessionRepository;
import com.supplyguard.repository.mongo.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class RAGChatService {

    private final AIChatSessionRepository chatSessionRepository;
    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;
    private final RiskEventRepository riskEventRepository;
    private final AIReasoningService aiReasoningService;

    public AIChatSession.ChatMessage processUserChat(String sessionId, String userPrompt, Long userId) {
        // 1. Fetch or create chat session
        AIChatSession session = chatSessionRepository.findBySessionId(sessionId)
                .orElse(AIChatSession.builder()
                        .sessionId(sessionId)
                        .userId(userId != null ? userId : 1L)
                        .title("Chat Session " + sessionId.substring(0, Math.min(8, sessionId.length())))
                        .messages(new ArrayList<>())
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build());

        // 2. Add user message
        AIChatSession.ChatMessage userMsg = AIChatSession.ChatMessage.builder()
                .id(UUID.randomUUID().toString())
                .role("user")
                .content(userPrompt)
                .timestamp(LocalDateTime.now())
                .build();
        session.getMessages().add(userMsg);

        // 3. Assemble RAG Live Data Context
        List<Product> products = productRepository.findAll();
        List<Supplier> suppliers = supplierRepository.findAll();
        List<RiskEvent> openRisks = riskEventRepository.findByStatusOrderByCreatedAtDesc("OPEN");

        StringBuilder liveContext = new StringBuilder();
        liveContext.append("=== LIVE ACTIVE RISK EVENTS ===\n");
        List<String> citations = new ArrayList<>();

        for (RiskEvent risk : openRisks) {
            liveContext.append(String.format("- Product: %s | Severity: %s | Runway: %.1f days | Primary Supplier: %s (Status: %s, LeadTime: %d days) | Rec: %s\n",
                    risk.getProductName(), risk.getSeverity(), risk.getDaysUntilStockout(),
                    risk.getSupplierName(), risk.getReason(), risk.getSupplierLeadTimeDays(), risk.getAiRecommendation()));

            if ("CRITICAL".equalsIgnoreCase(risk.getSeverity()) || "HIGH".equalsIgnoreCase(risk.getSeverity())) {
                citations.add(String.format("Risk [%s]: %s (Runway: %.1f d, Supplier: %s)",
                        risk.getSeverity(), risk.getProductName(), risk.getDaysUntilStockout(), risk.getSupplierName()));
            }
        }

        liveContext.append("\n=== PRODUCT INVENTORY SUMMARY ===\n");
        for (Product p : products) {
            liveContext.append(String.format("- %s (ID: %s): Stock %d units, Reorder Threshold: %d\n",
                    p.getName(), p.getId(), p.getCurrentStock(), p.getReorderThreshold()));
        }

        liveContext.append("\n=== SUPPLIER STATUS DIRECTORY ===\n");
        for (Supplier s : suppliers) {
            liveContext.append(String.format("- Supplier: %s (ID: %d) | Region: %s | Status: %s | Lead Time: %d days | Reliability: %.0f%%\n",
                    s.getName(), s.getId(), s.getRegion(), s.getStatus(), s.getLeadTimeDays(), s.getReliabilityScore() * 100));
        }

        // 4. Query AI Reasoning Service
        String aiAnswer = aiReasoningService.answerRAGQuery(userPrompt, liveContext.toString());

        // 5. Add assistant message
        AIChatSession.ChatMessage assistantMsg = AIChatSession.ChatMessage.builder()
                .id(UUID.randomUUID().toString())
                .role("assistant")
                .content(aiAnswer)
                .citations(citations)
                .timestamp(LocalDateTime.now())
                .build();

        session.getMessages().add(assistantMsg);
        session.setUpdatedAt(LocalDateTime.now());
        chatSessionRepository.save(session);

        return assistantMsg;
    }

    public List<AIChatSession.ChatMessage> getSessionMessages(String sessionId) {
        return chatSessionRepository.findBySessionId(sessionId)
                .map(AIChatSession::getMessages)
                .orElse(new ArrayList<>());
    }
}
