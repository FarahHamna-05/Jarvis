package com.supplyguard.service;

import com.supplyguard.dto.AIContextDto;

public interface AIReasoningService {

    /**
     * Generates plain-language recommendation, structured reasoning, and action plan.
     */
    AIContextDto.ReasoningOutput generateReasoning(AIContextDto.RiskContext context);

    /**
     * Generates a targeted, professional outreach email draft for a supplier.
     */
    String generateEmailDraft(AIContextDto.RiskContext context);

    /**
     * RAG grounded Q&A answering user inquiries citing live database context.
     */
    String answerRAGQuery(String userQuery, String liveDataContext);
}
