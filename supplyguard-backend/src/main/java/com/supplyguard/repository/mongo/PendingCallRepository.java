package com.supplyguard.repository.mongo;

import com.supplyguard.document.PendingCall;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PendingCallRepository extends MongoRepository<PendingCall, String> {
    Optional<PendingCall> findByVapiCallId(String vapiCallId);
    List<PendingCall> findByProductIdOrderByCreatedAtDesc(String productId);
    List<PendingCall> findByProductIdAndStatus(String productId, String status);
}
