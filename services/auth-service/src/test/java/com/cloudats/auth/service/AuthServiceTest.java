package com.cloudats.auth.service;

import com.cloudats.auth.dto.*;
import com.cloudats.auth.entity.Role;
import com.cloudats.auth.entity.User;
import com.cloudats.auth.entity.RefreshToken;
import com.cloudats.auth.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Unit tests for AuthService.
 */
@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private RefreshTokenRepository refreshTokenRepository;
    @Mock private PasswordResetTokenRepository passwordResetTokenRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User("test@cloudats.dev", "hashedpassword", "Test", "User", Role.CANDIDATE);
        testUser.setId(UUID.randomUUID());
        testUser.setActive(true);
        testUser.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void register_shouldCreateUserAndReturnTokens() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("new@cloudats.dev");
        request.setPassword("Password123!");
        request.setFirstName("New");
        request.setLastName("User");

        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtService.generateAccessToken(any(), anyString(), anyString())).thenReturn("access-token");
        when(jwtService.generateRefreshTokenString()).thenReturn("refresh-token");
        when(jwtService.getAccessTokenExpirationMs()).thenReturn(900000L);
        when(jwtService.getRefreshTokenExpirationMs()).thenReturn(604800000L);
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenReturn(new RefreshToken());

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("access-token", response.getAccessToken());
        assertEquals("refresh-token", response.getRefreshToken());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void register_shouldThrowWhenEmailExists() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("existing@cloudats.dev");
        request.setPassword("Password123!");
        request.setFirstName("Existing");
        request.setLastName("User");

        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        assertThrows(RuntimeException.class, () -> authService.register(request));
    }

    @Test
    void login_shouldReturnTokensForValidCredentials() {
        LoginRequest request = new LoginRequest("test@cloudats.dev", "Password123!");

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
        when(jwtService.generateAccessToken(any(), anyString(), anyString())).thenReturn("access-token");
        when(jwtService.generateRefreshTokenString()).thenReturn("refresh-token");
        when(jwtService.getAccessTokenExpirationMs()).thenReturn(900000L);
        when(jwtService.getRefreshTokenExpirationMs()).thenReturn(604800000L);
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenReturn(new RefreshToken());

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("access-token", response.getAccessToken());
    }

    @Test
    void login_shouldThrowForInvalidPassword() {
        LoginRequest request = new LoginRequest("test@cloudats.dev", "wrong");

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

        assertThrows(RuntimeException.class, () -> authService.login(request));
    }

    @Test
    void login_shouldThrowForNonExistentUser() {
        LoginRequest request = new LoginRequest("nonexistent@cloudats.dev", "pass");

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> authService.login(request));
    }

    @Test
    void login_shouldThrowForDeactivatedUser() {
        testUser.setActive(false);
        LoginRequest request = new LoginRequest("test@cloudats.dev", "Password123!");

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));

        assertThrows(RuntimeException.class, () -> authService.login(request));
    }

    @Test
    void logout_shouldRevokeAllRefreshTokens() {
        when(userRepository.findByEmail("test@cloudats.dev")).thenReturn(Optional.of(testUser));

        authService.logout("test@cloudats.dev");

        verify(refreshTokenRepository).revokeAllByUser(testUser);
    }

    @Test
    void forgotPassword_shouldGenerateResetToken() {
        ForgotPasswordRequest request = new ForgotPasswordRequest("test@cloudats.dev");

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(passwordResetTokenRepository.save(any())).thenReturn(null);

        String token = authService.forgotPassword(request);

        assertNotNull(token);
        assertFalse(token.isEmpty());
    }
}
