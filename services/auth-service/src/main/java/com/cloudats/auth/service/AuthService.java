package com.cloudats.auth.service;

import com.cloudats.auth.dto.*;
import com.cloudats.auth.entity.*;
import com.cloudats.auth.repository.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Core authentication service — handles registration, login, token refresh, logout, and password reset.
 */
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       RefreshTokenRepository refreshTokenRepository,
                       PasswordResetTokenRepository passwordResetTokenRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    /**
     * Register a new user.
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered: " + request.getEmail());
        }

        Role role = Role.CANDIDATE; // default
        if (request.getRole() != null) {
            try {
                role = Role.valueOf(request.getRole().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid role: " + request.getRole());
            }
        }

        User user = new User(
                request.getEmail().toLowerCase().trim(),
                passwordEncoder.encode(request.getPassword()),
                request.getFirstName().trim(),
                request.getLastName().trim(),
                role
        );
        user.setPhone(request.getPhone());
        user = userRepository.save(user);

        return generateAuthResponse(user);
    }

    /**
     * Authenticate user and issue tokens.
     */
    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!user.isActive()) {
            throw new RuntimeException("Account is deactivated");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }

        return generateAuthResponse(user);
    }

    /**
     * Refresh the access token using a valid refresh token.
     */
    @Transactional
    public AuthResponse refreshToken(TokenRefreshRequest request) {
        RefreshToken refreshToken = refreshTokenRepository
                .findByTokenAndRevokedFalse(request.getRefreshToken())
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));

        if (refreshToken.isExpired()) {
            refreshToken.setRevoked(true);
            refreshTokenRepository.save(refreshToken);
            throw new RuntimeException("Refresh token has expired. Please login again.");
        }

        // Revoke old refresh token (rotation)
        refreshToken.setRevoked(true);
        refreshTokenRepository.save(refreshToken);

        User user = refreshToken.getUser();
        return generateAuthResponse(user);
    }

    /**
     * Logout — revoke all refresh tokens for the user.
     */
    @Transactional
    public void logout(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        refreshTokenRepository.revokeAllByUser(user);
    }

    /**
     * Initiate forgot password flow — generates a reset token.
     */
    @Transactional
    public String forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new RuntimeException("No account found with this email"));

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken(
                user, token, LocalDateTime.now().plusMinutes(15)
        );
        passwordResetTokenRepository.save(resetToken);

        // In production, this would send an email. For now, return the token.
        return token;
    }

    /**
     * Reset password using a valid reset token.
     */
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken resetToken = passwordResetTokenRepository
                .findByTokenAndUsedFalse(request.getToken())
                .orElseThrow(() -> new RuntimeException("Invalid or expired reset token"));

        if (resetToken.isExpired()) {
            throw new RuntimeException("Reset token has expired");
        }

        User user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);

        // Revoke all refresh tokens for security
        refreshTokenRepository.revokeAllByUser(user);
    }

    /**
     * Validate a JWT token and return the user info (used by other services).
     */
    public UserResponse validateToken(String token) {
        if (!jwtService.isTokenValid(token)) {
            throw new RuntimeException("Invalid token");
        }

        String email = jwtService.extractEmail(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found for token"));

        return toUserResponse(user);
    }

    /**
     * Get user by ID.
     */
    public UserResponse getUserById(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        return toUserResponse(user);
    }

    /**
     * Get all users (admin only).
     */
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toUserResponse)
                .collect(Collectors.toList());
    }

    // ── Private helpers ──

    private AuthResponse generateAuthResponse(User user) {
        String accessToken = jwtService.generateAccessToken(user.getId(), user.getEmail(), user.getRole().name());
        String refreshTokenStr = jwtService.generateRefreshTokenString();

        // Store refresh token
        RefreshToken refreshToken = new RefreshToken(
                user,
                refreshTokenStr,
                LocalDateTime.now().plusSeconds(jwtService.getRefreshTokenExpirationMs() / 1000)
        );
        refreshTokenRepository.save(refreshToken);

        return new AuthResponse(
                accessToken,
                refreshTokenStr,
                jwtService.getAccessTokenExpirationMs() / 1000,
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getFullName(),
                user.getRole().name()
        );
    }

    private UserResponse toUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setPhone(user.getPhone());
        response.setRole(user.getRole().name());
        response.setActive(user.isActive());
        response.setEmailVerified(user.isEmailVerified());
        response.setCreatedAt(user.getCreatedAt() != null ? user.getCreatedAt().toString() : null);
        return response;
    }
}
