package com.cloudats.auth.controller;

import com.cloudats.auth.dto.*;
import com.cloudats.auth.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Authentication REST controller — register, login, refresh, logout, forgot/reset password.
 */
@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "User authentication and authorization endpoints")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user", description = "Creates a new user account and returns JWT tokens")
    @ApiResponse(responseCode = "201", description = "User registered successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input or email already exists")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    @Operation(summary = "Login", description = "Authenticate user and issue JWT access + refresh tokens")
    @ApiResponse(responseCode = "200", description = "Login successful")
    @ApiResponse(responseCode = "401", description = "Invalid credentials")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh token", description = "Exchange a valid refresh token for a new access token (with rotation)")
    @ApiResponse(responseCode = "200", description = "Token refreshed successfully")
    @ApiResponse(responseCode = "401", description = "Invalid or expired refresh token")
    public ResponseEntity<AuthResponse> refreshToken(@Valid @RequestBody TokenRefreshRequest request) {
        AuthResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout", description = "Revoke all refresh tokens for the authenticated user",
               security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponse(responseCode = "200", description = "Logged out successfully")
    public ResponseEntity<MessageResponse> logout(Authentication authentication) {
        authService.logout(authentication.getName());
        return ResponseEntity.ok(MessageResponse.success("Logged out successfully"));
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Forgot password", description = "Generate a password reset token (in production, sent via email)")
    @ApiResponse(responseCode = "200", description = "Reset token generated")
    public ResponseEntity<MessageResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        String token = authService.forgotPassword(request);
        // In production, don't return the token — send it via email
        return ResponseEntity.ok(MessageResponse.success("Password reset token generated: " + token));
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password", description = "Reset password using a valid reset token")
    @ApiResponse(responseCode = "200", description = "Password reset successfully")
    public ResponseEntity<MessageResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(MessageResponse.success("Password has been reset successfully"));
    }

    @GetMapping("/validate")
    @Operation(summary = "Validate token", description = "Validate a JWT token and return user info (used by other services)")
    @ApiResponse(responseCode = "200", description = "Token is valid")
    @ApiResponse(responseCode = "401", description = "Token is invalid")
    public ResponseEntity<UserResponse> validateToken(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        UserResponse user = authService.validateToken(token);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/me")
    @Operation(summary = "Get current user", description = "Get the profile of the currently authenticated user",
               security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponse(responseCode = "200", description = "User profile returned")
    public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {
        UserResponse user = authService.validateToken(null);
        // Use authentication principal
        return ResponseEntity.ok(user);
    }

    @GetMapping("/users")
    @Operation(summary = "Get all users (Admin only)", description = "Returns a list of all registered users",
               security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponse(responseCode = "200", description = "Users list returned")
    @ApiResponse(responseCode = "403", description = "Not authorized")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = authService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{id}")
    @Operation(summary = "Get user by ID", description = "Get a specific user's profile by UUID",
               security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<UserResponse> getUserById(@PathVariable UUID id) {
        UserResponse user = authService.getUserById(id);
        return ResponseEntity.ok(user);
    }
}
