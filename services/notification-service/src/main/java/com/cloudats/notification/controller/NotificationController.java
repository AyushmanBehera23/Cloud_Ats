package com.cloudats.notification.controller;

import com.cloudats.notification.entity.Notification;
import com.cloudats.notification.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@Tag(name = "Notifications", description = "User notification management")
public class NotificationController {

    private final NotificationService notificationService;
    public NotificationController(NotificationService notificationService) { this.notificationService = notificationService; }

    @PostMapping("/send")
    @Operation(summary = "Send a notification")
    public ResponseEntity<Notification> sendNotification(@RequestBody Map<String, String> request) {
        Notification n = notificationService.sendNotification(
                UUID.fromString(request.get("userId")),
                request.getOrDefault("type", "GENERAL"),
                request.get("title"),
                request.get("message"));
        return ResponseEntity.ok(n);
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get user's notifications")
    public ResponseEntity<List<Notification>> getUserNotifications(@PathVariable UUID userId) {
        return ResponseEntity.ok(notificationService.getUserNotifications(userId));
    }

    @GetMapping("/user/{userId}/unread")
    @Operation(summary = "Get unread notifications")
    public ResponseEntity<List<Notification>> getUnread(@PathVariable UUID userId) {
        return ResponseEntity.ok(notificationService.getUnreadNotifications(userId));
    }

    @GetMapping("/user/{userId}/unread-count")
    @Operation(summary = "Get unread notification count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@PathVariable UUID userId) {
        return ResponseEntity.ok(Map.of("count", notificationService.getUnreadCount(userId)));
    }

    @PutMapping("/{id}/read")
    @Operation(summary = "Mark notification as read")
    public ResponseEntity<Map<String, String>> markRead(@PathVariable UUID id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(Map.of("message", "Marked as read"));
    }

    @PutMapping("/user/{userId}/read-all")
    @Operation(summary = "Mark all notifications as read")
    public ResponseEntity<Map<String, String>> markAllRead(@PathVariable UUID userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }
}
