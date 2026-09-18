package com.supplyguard.repository.jpa;

import com.supplyguard.entity.VerificationRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VerificationRecordRepository extends JpaRepository<VerificationRecord, Long> {
    List<VerificationRecord> findBySupplierId(Long supplierId);
    List<VerificationRecord> findByUserId(Long userId);
    List<VerificationRecord> findBySupplierIdAndField(Long supplierId, String field);
}
