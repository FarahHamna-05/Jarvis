package com.supplyguard.repository.mongo;

import com.supplyguard.document.CallResult;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CallResultRepository extends MongoRepository<CallResult, String> {
    Optional<CallResult> findByVapiCallId(String vapiCallId);
    List<CallResult> findByProductIdOrderByTimestampDesc(String productId);
    List<CallResult> findByProductIdAndSupplierId(String productId, String supplierId);
}
