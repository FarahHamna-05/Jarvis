package com.supplyguard.service;

import com.supplyguard.document.Product;
import com.supplyguard.entity.Supplier;
import com.supplyguard.entity.User;
import com.supplyguard.repository.jpa.SupplierRepository;
import com.supplyguard.repository.jpa.UserRepository;
import com.supplyguard.repository.mongo.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DataSeederService implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataSeederService.class);

    private final UserRepository userRepository;
    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;
    private final RiskEngineService riskEngineService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedUsers();
        seedSuppliersAndProducts();
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            logger.info("Seeding default users...");
            userRepository.save(User.builder()
                    .username("admin")
                    .email("admin@supplyguard.ai")
                    .password(passwordEncoder.encode("password123"))
                    .role("ROLE_ADMIN")
                    .createdAt(LocalDateTime.now())
                    .build());

            userRepository.save(User.builder()
                    .username("dhanush")
                    .email("dhanush@supplyguard.ai")
                    .password(passwordEncoder.encode("password123"))
                    .role("ROLE_USER")
                    .createdAt(LocalDateTime.now())
                    .build());
            logger.info("Users seeded: admin, dhanush (password: password123)");
        }
    }

    private void seedSuppliersAndProducts() {
        if (supplierRepository.count() == 0) {
            logger.info("Seeding realistic global suppliers...");

            Supplier s1 = supplierRepository.save(Supplier.builder()
                    .name("Apex Microelectronics Corp")
                    .contactEmail("procurement@apex-micro.tw")
                    .phone("+886-2-2883-9100")
                    .region("Hsinchu, Taiwan")
                    .reliabilityScore(0.94)
                    .leadTimeDays(12)
                    .status("ACTIVE")
                    .trustScore(94.0)
                    .build());

            Supplier s2 = supplierRepository.save(Supplier.builder()
                    .name("Bavaria Precision Sensors GmbH")
                    .contactEmail("orders@bavaria-sensors.de")
                    .phone("+49-89-636-00")
                    .region("Munich, Germany")
                    .reliabilityScore(0.97)
                    .leadTimeDays(18)
                    .status("ACTIVE")
                    .trustScore(97.0)
                    .build());

            Supplier s3 = supplierRepository.save(Supplier.builder()
                    .name("Shenzhen Opto-Tech Logistics")
                    .contactEmail("sales@shenzhen-opto.cn")
                    .phone("+86-755-8321-4400")
                    .region("Shenzhen, China")
                    .reliabilityScore(0.78)
                    .leadTimeDays(24)
                    .status("DISRUPTED") // Disrupted for immediate demonstration!
                    .trustScore(65.0)
                    .build());

            Supplier s4 = supplierRepository.save(Supplier.builder()
                    .name("Saigon Power Components")
                    .contactEmail("b2b@saigon-power.vn")
                    .phone("+84-28-3829-5000")
                    .region("Ho Chi Minh City, Vietnam")
                    .reliabilityScore(0.90)
                    .leadTimeDays(14)
                    .status("ACTIVE")
                    .trustScore(90.0)
                    .build());

            Supplier s5 = supplierRepository.save(Supplier.builder()
                    .name("Nordic Titanium Works AB")
                    .contactEmail("contracts@nordic-titanium.se")
                    .phone("+46-8-123-4567")
                    .region("Stockholm, Sweden")
                    .reliabilityScore(0.98)
                    .leadTimeDays(10)
                    .status("ACTIVE")
                    .trustScore(98.0)
                    .build());

            if (productRepository.count() == 0) {
                logger.info("Seeding realistic product catalog...");

                // Product 1: Critical risk due to disrupted primary supplier s3!
                productRepository.save(Product.builder()
                        .name("AI Neural Co-Processor X9")
                        .category("Semiconductors")
                        .description("High-density 4nm tensor chip for edge robotics and autonomous systems.")
                        .imageBase64("https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60")
                        .launchDate("2024-03-15")
                        .currentStock(115)
                        .recentUsage(Arrays.asList(22, 25, 24, 26, 28, 24, 23)) // avg ~24.5 -> runway ~3.9 days!
                        .reorderThreshold(200)
                        .primarySupplierId(s3.getId()) // Disrupted!
                        .alternateSupplierIds(Arrays.asList(s1.getId(), s4.getId()))
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build());

                // Product 2: High risk due to demand spike
                productRepository.save(Product.builder()
                        .name("EV Battery Pack Cell 4680")
                        .category("Automotive Energy")
                        .description("High-nickel cylindrical lithium-ion power cell with dry electrode tech.")
                        .imageBase64("https://images.unsplash.com/photo-1558441719-8b489c63f7d1?w=500&auto=format&fit=crop&q=60")
                        .launchDate("2024-01-10")
                        .currentStock(240)
                        .recentUsage(Arrays.asList(35, 38, 40, 36, 42, 39, 38)) // avg ~38.3 -> runway ~5.2 days vs lead time 14 -> CRITICAL!
                        .reorderThreshold(300)
                        .primarySupplierId(s4.getId())
                        .alternateSupplierIds(Arrays.asList(s1.getId()))
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build());

                // Product 3: Medium risk
                productRepository.save(Product.builder()
                        .name("MEMS Pressure Transducer PT-20")
                        .category("Industrial Sensors")
                        .description("Ceramic piezoresistive sensor for aerospace fuel injection telemetry.")
                        .imageBase64("https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60")
                        .launchDate("2023-11-20")
                        .currentStock(410)
                        .recentUsage(Arrays.asList(15, 16, 14, 18, 17, 15, 16)) // avg ~15.8 -> runway ~21.6 days vs lead time 18 -> MEDIUM!
                        .reorderThreshold(250)
                        .primarySupplierId(s2.getId())
                        .alternateSupplierIds(Arrays.asList(s5.getId()))
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build());

                // Product 4: Low risk (nominal)
                productRepository.save(Product.builder()
                        .name("Titanium Surgical Bone Screws 3.5mm")
                        .category("Medical Hardware")
                        .description("Biocompatible Grade 5 titanium orthopedic self-tapping osteosynthesis screws.")
                        .imageBase64("https://images.unsplash.com/photo-1583912267670-6575ad362e4a?w=500&auto=format&fit=crop&q=60")
                        .launchDate("2023-08-05")
                        .currentStock(580)
                        .recentUsage(Arrays.asList(12, 14, 13, 11, 15, 14, 12)) // avg ~13.0 -> runway ~37.1 days vs lead time 10 -> LOW!
                        .reorderThreshold(150)
                        .primarySupplierId(s5.getId())
                        .alternateSupplierIds(Arrays.asList(s2.getId()))
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build());

                // Product 5: Low risk (nominal)
                productRepository.save(Product.builder()
                        .name("Optical Fiber Transceiver 100G QSFP28")
                        .category("Networking")
                        .description("Single-mode 1310nm CWDM4 optical transceiver module for data centers.")
                        .imageBase64("https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&auto=format&fit=crop&q=60")
                        .launchDate("2024-02-01")
                        .currentStock(820)
                        .recentUsage(Arrays.asList(18, 20, 19, 22, 21, 19, 20)) // avg ~19.8 -> runway ~34.5 days vs lead time 12 -> LOW!
                        .reorderThreshold(200)
                        .primarySupplierId(s1.getId())
                        .alternateSupplierIds(Arrays.asList(s4.getId()))
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build());

                logger.info("Products seeded! Triggering initial deterministic risk evaluations...");
                riskEngineService.evaluateAllProducts();
                logger.info("Initial risk evaluations completed!");
            }
        }
    }
}
