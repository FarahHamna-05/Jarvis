package com.supplyguard.controller;

import com.supplyguard.entity.BusinessProfile;
import com.supplyguard.entity.User;
import com.supplyguard.repository.jpa.BusinessProfileRepository;
import com.supplyguard.repository.jpa.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/business-profile")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BusinessProfileController {

    private final BusinessProfileRepository businessProfileRepository;
    private final UserRepository userRepository;

    @GetMapping("/{userId}")
    public ResponseEntity<?> getBusinessProfile(@PathVariable Long userId) {
        Optional<BusinessProfile> profile = businessProfileRepository.findByUserId(userId);
        return profile.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.ok(BusinessProfile.builder().userId(userId).build()));
    }

    @PostMapping
    public ResponseEntity<BusinessProfile> saveBusinessProfile(@RequestBody BusinessProfile profileRequest) {
        Long userId = profileRequest.getUserId();
        if (userId == null) {
            userId = 1L; // fallback default
        }

        final Long finalUserId = userId;
        BusinessProfile profile = businessProfileRepository.findByUserId(finalUserId)
                .orElseGet(() -> BusinessProfile.builder().userId(finalUserId).build());

        if (profileRequest.getCategories() != null) {
            profile.setCategories(profileRequest.getCategories());
        }
        if (profileRequest.getBusinessScale() != null) {
            profile.setBusinessScale(profileRequest.getBusinessScale());
        }
        if (profileRequest.getBusinessName() != null) {
            profile.setBusinessName(profileRequest.getBusinessName());
        }
        if (profileRequest.getBusinessType() != null) {
            profile.setBusinessType(profileRequest.getBusinessType());
        }
        if (profileRequest.getGstin() != null) {
            profile.setGstin(profileRequest.getGstin());
        }
        if (profileRequest.getUdyamNumber() != null) {
            profile.setUdyamNumber(profileRequest.getUdyamNumber());
        }
        if (profileRequest.getPan() != null) {
            profile.setPan(profileRequest.getPan());
        }
        if (profileRequest.getAddressLine1() != null) {
            profile.setAddressLine1(profileRequest.getAddressLine1());
        }
        if (profileRequest.getAddressLine2() != null) {
            profile.setAddressLine2(profileRequest.getAddressLine2());
        }
        if (profileRequest.getCity() != null) {
            profile.setCity(profileRequest.getCity());
        }
        if (profileRequest.getState() != null) {
            profile.setState(profileRequest.getState());
        }
        if (profileRequest.getPincode() != null) {
            profile.setPincode(profileRequest.getPincode());
        }
        if (profileRequest.getContactNumber() != null) {
            profile.setContactNumber(profileRequest.getContactNumber());
        }
        if (profileRequest.getContactEmail() != null) {
            profile.setContactEmail(profileRequest.getContactEmail());
        }
        if (profileRequest.getOnboardingCompleted() != null) {
            profile.setOnboardingCompleted(profileRequest.getOnboardingCompleted());
        }

        profile.setUpdatedAt(LocalDateTime.now());
        BusinessProfile saved = businessProfileRepository.save(profile);

        // If completed, update User record as well
        if (Boolean.TRUE.equals(profile.getOnboardingCompleted())) {
            userRepository.findById(finalUserId).ifPresent(user -> {
                user.setOnboardingCompleted(true);
                userRepository.save(user);
            });
        }

        return ResponseEntity.ok(saved);
    }

    @PostMapping("/complete/{userId}")
    public ResponseEntity<?> completeOnboarding(@PathVariable Long userId) {
        BusinessProfile profile = businessProfileRepository.findByUserId(userId)
                .orElseGet(() -> BusinessProfile.builder().userId(userId).build());

        profile.setOnboardingCompleted(true);
        profile.setUpdatedAt(LocalDateTime.now());
        BusinessProfile saved = businessProfileRepository.save(profile);

        userRepository.findById(userId).ifPresent(user -> {
            user.setOnboardingCompleted(true);
            userRepository.save(user);
        });

        return ResponseEntity.ok(saved);
    }
}
