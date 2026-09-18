package com.supplyguard.repository.jpa;

import com.supplyguard.entity.RiskEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RiskEventRepository extends JpaRepository<RiskEvent, Long> {
    List<RiskEvent> findByStatusOrderByCreatedAtDesc(String status);
    List<RiskEvent> findAllByOrderByCreatedAtDesc();
    List<RiskEvent> findBySeverityOrderByCreatedAtDesc(String severity);
    Optional<RiskEvent> findTopByProductIdOrderByCreatedAtDesc(String productId);
}
