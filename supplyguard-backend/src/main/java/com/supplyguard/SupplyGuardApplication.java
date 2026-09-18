package com.supplyguard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
@EntityScan(basePackages = "com.supplyguard.entity")
@EnableJpaRepositories(basePackages = "com.supplyguard.repository.jpa")
@EnableMongoRepositories(basePackages = "com.supplyguard.repository.mongo")
public class SupplyGuardApplication {

    public static void main(String[] args) {
        SpringApplication.run(SupplyGuardApplication.class, args);
    }
}
