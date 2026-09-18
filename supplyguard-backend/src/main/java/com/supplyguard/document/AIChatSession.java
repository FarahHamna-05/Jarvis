package com.supplyguard.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "ai_chat_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIChatSession {

    @Id
    private String id;

    private Long userId;
    private String sessionId;
    private String title;

    @Builder.Default
    private List<ChatMessage> messages = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ChatMessage {
        private String id;
        private String role; // user, assistant, system
        private String content;
        private List<String> citations; // e.g., ["Product: RTX-500", "Stock: 12 days", "Supplier: MicroTech Taiwan"]
        private LocalDateTime timestamp;
    }
}
