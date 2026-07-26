package com.cloudats.notification.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "notifications", schema = "notification_schema")
public class Notification {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @Column(name = "user_id", nullable = false) private UUID userId;
    @Column(nullable = false, length = 30) private String type; // REGISTRATION, RESUME_UPLOAD, ATS_COMPLETE, SHORTLISTED, PASSWORD_RESET, GENERAL
    @Column(nullable = false) private String title;
    @Column(columnDefinition = "TEXT") private String message;
    @Column(name = "is_read") private boolean isRead = false;
    @Column(length = 10) private String channel = "IN_APP"; // EMAIL, IN_APP, BOTH
    @Column(length = 10) private String status = "PENDING"; // PENDING, SENT, FAILED
    @Column(name = "created_at", updatable = false) private LocalDateTime createdAt;
    @Column(name = "sent_at") private LocalDateTime sentAt;

    @PrePersist protected void onCreate() { createdAt = LocalDateTime.now(); }
    public Notification() {}

    public UUID getId() { return id; } public void setId(UUID id) { this.id = id; }
    public UUID getUserId() { return userId; } public void setUserId(UUID userId) { this.userId = userId; }
    public String getType() { return type; } public void setType(String type) { this.type = type; }
    public String getTitle() { return title; } public void setTitle(String title) { this.title = title; }
    public String getMessage() { return message; } public void setMessage(String message) { this.message = message; }
    public boolean isRead() { return isRead; } public void setRead(boolean read) { isRead = read; }
    public String getChannel() { return channel; } public void setChannel(String channel) { this.channel = channel; }
    public String getStatus() { return status; } public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; } public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getSentAt() { return sentAt; } public void setSentAt(LocalDateTime sentAt) { this.sentAt = sentAt; }
}
