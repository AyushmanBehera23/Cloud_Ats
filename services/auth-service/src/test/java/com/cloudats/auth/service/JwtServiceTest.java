package com.cloudats.auth.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for JwtService.
 */
class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService(
                "cloudats-jwt-secret-key-that-is-at-least-256-bits-long-for-hmac-sha256-algorithm",
                900000,   // 15 min
                604800000 // 7 days
        );
    }

    @Test
    void generateAccessToken_shouldReturnValidToken() {
        UUID userId = UUID.randomUUID();
        String token = jwtService.generateAccessToken(userId, "test@cloudats.dev", "CANDIDATE");

        assertNotNull(token);
        assertFalse(token.isEmpty());
        assertTrue(jwtService.isTokenValid(token));
    }

    @Test
    void extractEmail_shouldReturnCorrectEmail() {
        String email = "test@cloudats.dev";
        String token = jwtService.generateAccessToken(UUID.randomUUID(), email, "CANDIDATE");

        assertEquals(email, jwtService.extractEmail(token));
    }

    @Test
    void extractRole_shouldReturnCorrectRole() {
        String token = jwtService.generateAccessToken(UUID.randomUUID(), "test@cloudats.dev", "ADMIN");

        assertEquals("ADMIN", jwtService.extractRole(token));
    }

    @Test
    void extractUserId_shouldReturnCorrectUserId() {
        UUID userId = UUID.randomUUID();
        String token = jwtService.generateAccessToken(userId, "test@cloudats.dev", "RECRUITER");

        assertEquals(userId.toString(), jwtService.extractUserId(token));
    }

    @Test
    void isTokenValid_shouldReturnFalseForInvalidToken() {
        assertFalse(jwtService.isTokenValid("invalid.token.here"));
    }

    @Test
    void isTokenValid_shouldReturnFalseForNull() {
        assertFalse(jwtService.isTokenValid(null));
    }

    @Test
    void generateRefreshTokenString_shouldReturnUniqueTokens() {
        String token1 = jwtService.generateRefreshTokenString();
        String token2 = jwtService.generateRefreshTokenString();

        assertNotNull(token1);
        assertNotNull(token2);
        assertNotEquals(token1, token2);
    }

    @Test
    void isTokenExpired_shouldReturnFalseForFreshToken() {
        String token = jwtService.generateAccessToken(UUID.randomUUID(), "test@cloudats.dev", "CANDIDATE");
        assertFalse(jwtService.isTokenExpired(token));
    }
}
