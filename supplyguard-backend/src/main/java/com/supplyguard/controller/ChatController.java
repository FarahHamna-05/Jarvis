package com.supplyguard.controller;

import com.supplyguard.document.AIChatSession;
import com.supplyguard.service.RAGChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ChatController {

    private final RAGChatService ragChatService;

    @PostMapping("/message")
    public ResponseEntity<AIChatSession.ChatMessage> sendMessage(@RequestBody Map<String, String> payload) {
        String sessionId = payload.getOrDefault("sessionId", UUID.randomUUID().toString());
        String message = payload.getOrDefault("message", "");

        return ResponseEntity.ok(ragChatService.processUserChat(sessionId, message, 1L));
    }

    @GetMapping("/history/{sessionId}")
    public ResponseEntity<List<AIChatSession.ChatMessage>> getHistory(@PathVariable String sessionId) {
        return ResponseEntity.ok(ragChatService.getSessionMessages(sessionId));
    }
}
