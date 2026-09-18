package com.supplyguard.repository.jpa;

import com.supplyguard.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findAllByOrderByOrderDateDesc();
    List<Order> findByProductId(String productId);
    List<Order> findBySupplierId(Long supplierId);
    List<Order> findByStatus(String status);
}
