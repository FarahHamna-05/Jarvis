package com.supplyguard.controller;

import com.supplyguard.dto.AuthDto;
import com.supplyguard.entity.User;
import com.supplyguard.repository.jpa.UserRepository;
import com.supplyguard.security.JwtTokenProvider;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody AuthDto.LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByUsername(loginRequest.getUsername()).orElseThrow();

        return ResponseEntity.ok(AuthDto.AuthResponse.builder()
                .token(jwt)
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .fullName(user.getFullName())
                .companyName(user.getCompanyName())
                .phone(user.getPhone())
                .department(user.getDepartment())
                .onboardingCompleted(user.getOnboardingCompleted() != null && user.getOnboardingCompleted())
                .build());
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody AuthDto.RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            return ResponseEntity.badRequest().body("Username is already taken!");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Email is already in use!");
        }

        User user = User.builder()
                .username(registerRequest.getUsername())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role(registerRequest.getRole() != null ? registerRequest.getRole() : "ROLE_USER")
                .fullName(registerRequest.getFullName())
                .companyName(registerRequest.getCompanyName())
                .phone(registerRequest.getPhone())
                .department(registerRequest.getDepartment())
                .onboardingCompleted(false)
                .build();

        User saved = userRepository.save(user);

        // Auto login upon register
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        registerRequest.getUsername(),
                        registerRequest.getPassword()
                )
        );
        String jwt = tokenProvider.generateToken(authentication);

        return ResponseEntity.ok(AuthDto.AuthResponse.builder()
                .token(jwt)
                .userId(saved.getId())
                .username(saved.getUsername())
                .email(saved.getEmail())
                .role(saved.getRole())
                .fullName(saved.getFullName())
                .companyName(saved.getCompanyName())
                .phone(saved.getPhone())
                .department(saved.getDepartment())
                .onboardingCompleted(saved.getOnboardingCompleted() != null && saved.getOnboardingCompleted())
                .build());
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<?> getUserProfile(@PathVariable Long userId) {
        return userRepository.findById(userId)
                .map(u -> ResponseEntity.ok(AuthDto.AuthResponse.builder()
                        .userId(u.getId())
                        .username(u.getUsername())
                        .email(u.getEmail())
                        .role(u.getRole())
                        .fullName(u.getFullName())
                        .companyName(u.getCompanyName())
                        .phone(u.getPhone())
                        .department(u.getDepartment())
                        .onboardingCompleted(u.getOnboardingCompleted() != null && u.getOnboardingCompleted())
                        .build()))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/profile/{userId}")
    public ResponseEntity<?> updateUserProfile(@PathVariable Long userId, @RequestBody AuthDto.UpdateProfileRequest request) {
        return userRepository.findById(userId)
                .map(user -> {
                    if (request.getFullName() != null) user.setFullName(request.getFullName());
                    if (request.getEmail() != null) user.setEmail(request.getEmail());
                    if (request.getPhone() != null) user.setPhone(request.getPhone());
                    if (request.getCompanyName() != null) user.setCompanyName(request.getCompanyName());
                    if (request.getDepartment() != null) user.setDepartment(request.getDepartment());
                    if (request.getRole() != null) user.setRole(request.getRole());
                    User saved = userRepository.save(user);

                    return ResponseEntity.ok(AuthDto.AuthResponse.builder()
                            .userId(saved.getId())
                            .username(saved.getUsername())
                            .email(saved.getEmail())
                            .role(saved.getRole())
                            .fullName(saved.getFullName())
                            .companyName(saved.getCompanyName())
                            .phone(saved.getPhone())
                            .department(saved.getDepartment())
                            .onboardingCompleted(saved.getOnboardingCompleted() != null && saved.getOnboardingCompleted())
                            .build());
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody AuthDto.ChangePasswordRequest request) {
        if (request.getUserId() == null || request.getOldPassword() == null || request.getNewPassword() == null) {
            return ResponseEntity.badRequest().body("User ID, current password, and new password are required.");
        }

        return userRepository.findById(request.getUserId())
                .map(user -> {
                    if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
                        return ResponseEntity.badRequest().body("Current password is incorrect.");
                    }
                    user.setPassword(passwordEncoder.encode(request.getNewPassword()));
                    userRepository.save(user);
                    return ResponseEntity.ok("Password updated successfully.");
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
