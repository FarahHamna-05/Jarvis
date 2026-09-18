package com.supplyguard.repository.mongo;

import com.supplyguard.document.SupplierConversation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SupplierConversationRepository extends MongoRepository<SupplierConversation, String> {
    List<SupplierConversation> findBySupplierIdOrderByUpdatedAtDesc(Long supplierId);
    Optional<SupplierConversation> findByRiskEventId(Long riskEventId);
    List<SupplierConversation> findAllByOrderByUpdatedAtDesc();
}
