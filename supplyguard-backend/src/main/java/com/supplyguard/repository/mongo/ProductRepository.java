package com.supplyguard.repository.mongo;

import com.supplyguard.document.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findByCategory(String category);
    List<Product> findByPrimarySupplierId(Long primarySupplierId);
    List<Product> findByUserId(Long userId);
    List<Product> findByUserIdIsNullOrUserId(Long userId);
}
