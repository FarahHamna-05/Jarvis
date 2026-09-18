package com.supplyguard.repository.mongo;

import com.supplyguard.document.AIChatSession;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AIChatSessionRepository extends MongoRepository<AIChatSession, String> {
    Optional<AIChatSession> findBySessionId(String sessionId);
    List<AIChatSession> findByUserIdOrderByUpdatedAtDesc(Long userId);
    List<AIChatSession> findAllByOrderByUpdatedAtDesc();
}
