package com.supplyguard.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.supplyguard.dto.AIContextDto;
import com.supplyguard.service.AIReasoningService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Service("ollamaReasoningService")
@Primary
public class OllamaReasoningServiceImpl implements AIReasoningService {

    private static final Logger logger = LoggerFactory.getLogger(OllamaReasoningServiceImpl.class);

    @Value("${ollama.base-url:http://localhost:11434}")
    private String ollamaBaseUrl;

    @Value("${ollama.model:llama3}")
    private String ollamaModel;

    @Value("${ollama.timeout-seconds:12}")
    private int timeoutSeconds;

    private final AIReasoningService fallbackService;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public OllamaReasoningServiceImpl(@Qualifier("heuristicReasoningService") AIReasoningService fallbackService) {
        this.fallbackService = fallbackService;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public AIContextDto.ReasoningOutput generateReasoning(AIContextDto.RiskContext context) {
        try {
            String prompt = buildReasoningPrompt(context);
            String ollamaResponse = callOllamaApi(prompt);

            if (ollamaResponse != null && !ollamaResponse.trim().isEmpty()) {
                logger.info("Successfully generated AI reasoning from Ollama ({})", ollamaModel);
                return parseOllamaReasoning(ollamaResponse, context);
            }
        } catch (Exception e) {
            logger.warn("Ollama AI reasoning unavailable or timed out ({}). Using deterministic fallback.", e.getMessage());
        }

        // Graceful fallback
        return fallbackService.generateReasoning(context);
    }

    @Override
    public String generateEmailDraft(AIContextDto.RiskContext context) {
        try {
            String prompt = String.format(
                    "You are SupplyGuard AI, an autonomous supply chain procurement agent. " +
                    "Draft an urgent, concise, and professional email to supplier '%s' regarding stockout risk for product '%s'.\n" +
                    "Data: Current stock %d, average daily usage %.1f units/day, stock will run out in %.1f days, supplier lead time is %d days. " +
                    "Request expedited dispatch and express logistics options. Output only the email body.",
                    context.getPrimarySupplierName(), context.getProductName(), context.getCurrentStock(),
                    context.getAverageDailyUsage(), context.getDaysUntilStockout(), context.getPrimarySupplierLeadTime()
            );

            String response = callOllamaApi(prompt);
            if (response != null && !response.trim().isEmpty()) {
                return response.trim();
            }
        } catch (Exception e) {
            logger.warn("Ollama email generation fallback invoked: {}", e.getMessage());
        }

        return fallbackService.generateEmailDraft(context);
    }

    @Override
    public String answerRAGQuery(String userQuery, String liveDataContext) {
        try {
            String prompt = String.format(
                    "You are SupplyGuard AI's intelligent supply chain assistant. " +
                    "Answer the user's question accurately using ONLY the live inventory data context provided below. " +
                    "Cite specific product names, stockout days, and supplier statuses.\n\n" +
                    "LIVE DATA CONTEXT:\n%s\n\n" +
                    "USER QUESTION: %s\n\n" +
                    "ANSWER:",
                    liveDataContext, userQuery
            );

            String response = callOllamaApi(prompt);
            if (response != null && !response.trim().isEmpty()) {
                return response.trim();
            }
        } catch (Exception e) {
            logger.warn("Ollama RAG answer fallback invoked: {}", e.getMessage());
        }

        return fallbackService.answerRAGQuery(userQuery, liveDataContext);
    }

    private String callOllamaApi(String prompt) {
        String endpoint = ollamaBaseUrl + "/api/generate";

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", ollamaModel);
        requestBody.put("prompt", prompt);
        requestBody.put("stream", false);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        // Call Ollama with standard REST template
        ResponseEntity<String> response = restTemplate.exchange(endpoint, HttpMethod.POST, entity, String.class);

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            try {
                JsonNode root = objectMapper.readTree(response.getBody());
                if (root.has("response")) {
                    return root.get("response").asText();
                }
            } catch (Exception e) {
                logger.error("Error parsing Ollama response JSON: {}", e.getMessage());
            }
        }

        return null;
    }

    private String buildReasoningPrompt(AIContextDto.RiskContext context) {
        return String.format(
                "You are SupplyGuard AI, an autonomous supply chain risk reasoning engine.\n" +
                "Analyze this inventory risk event:\n" +
                "- Product: %s (Category: %s)\n" +
                "- Current Stock: %d units\n" +
                "- 7-Day Average Usage: %.1f units/day\n" +
                "- Projected Days until Stockout: %.1f days (Buffer: 1.2x)\n" +
                "- Primary Supplier: %s (Lead time: %d days, Status: %s, Reliability: %.0f%%)\n" +
                "- Alternate Suppliers: %s\n\n" +
                "Provide:\n" +
                "1. RECOMMENDATION: (1-2 sentences of executive decision)\n" +
                "2. REASONING: (Step-by-step logic explaining the supply-demand deficit and safety buffer)\n" +
                "3. ACTION: (One of: SWITCH_SUPPLIER, EXPEDITE_PO, PROACTIVE_REORDER, MONITOR_INVENTORY)",
                context.getProductName(), context.getCategory(), context.getCurrentStock(),
                context.getAverageDailyUsage(), context.getDaysUntilStockout(),
                context.getPrimarySupplierName(), context.getPrimarySupplierLeadTime(),
                context.getPrimarySupplierStatus(),
                context.getPrimarySupplierReliability() != null ? context.getPrimarySupplierReliability() * 100 : 80,
                context.getAlternateSuppliers() != null ? context.getAlternateSuppliers().toString() : "None"
        );
    }

    private AIContextDto.ReasoningOutput parseOllamaReasoning(String ollamaOutput, AIContextDto.RiskContext context) {
        String recommendation = "Mitigation recommended based on Ollama evaluation.";
        String reasoning = ollamaOutput;
        String action = "EXPEDITE_PO";

        String[] lines = ollamaOutput.split("\n");
        for (String line : lines) {
            String trimmed = line.trim();
            if (trimmed.toUpperCase().startsWith("RECOMMENDATION:") || trimmed.toUpperCase().startsWith("1. RECOMMENDATION:")) {
                recommendation = trimmed.substring(trimmed.indexOf(":") + 1).trim();
            } else if (trimmed.toUpperCase().startsWith("ACTION:") || trimmed.toUpperCase().startsWith("3. ACTION:")) {
                action = trimmed.substring(trimmed.indexOf(":") + 1).trim();
            }
        }

        String emailSubject = String.format("URGENT: SupplyGuard Procurement Notice - %s [SKU: %s]",
                context.getProductName(), context.getProductId());
        String emailBody = fallbackService.generateEmailDraft(context);

        return AIContextDto.ReasoningOutput.builder()
                .recommendation(recommendation)
                .reasoning(reasoning)
                .recommendedAction(action)
                .emailDraftSubject(emailSubject)
                .emailDraftBody(emailBody)
                .build();
    }
}
