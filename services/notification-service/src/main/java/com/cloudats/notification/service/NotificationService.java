package com.cloudats.notification.service;

import com.cloudats.notification.entity.Notification;
import com.cloudats.notification.repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);
    private final NotificationRepository repository;

    public NotificationService(NotificationRepository repository) {
        this.repository = repository;
    }

    @Async
    public void sendRegistrationNotification(UUID userId, String email) {
        createAndSend(userId, "REGISTRATION", "Welcome to CloudATS!",
                "Your account (" + email + ") has been created successfully. Start by uploading your resume.");
    }

    @Async
    public void sendResumeUploadNotification(UUID userId, String fileName) {
        createAndSend(userId, "RESUME_UPLOAD", "Resume Uploaded",
                "Your resume '" + fileName + "' has been uploaded and parsed successfully.");
    }

    @Async
    public void sendAtsScoreNotification(UUID userId, double score, String specialization) {
        createAndSend(userId, "ATS_COMPLETE", "ATS Score Ready",
                String.format("Your resume scored %.1f/100 for %s specialization. Check your dashboard for details.", score, specialization));
    }

    @Async
    public void sendShortlistNotification(UUID userId) {
        createAndSend(userId, "SHORTLISTED", "You've Been Shortlisted!",
                "Congratulations! A recruiter has shortlisted your profile. Stay tuned for next steps.");
    }

    @Async
    public void sendPasswordResetNotification(UUID userId, String resetToken) {
        createAndSend(userId, "PASSWORD_RESET", "Password Reset Requested",
                "Use this token to reset your password: " + resetToken + ". Valid for 15 minutes.");
    }

    public Notification sendNotification(UUID userId, String type, String title, String message) {
        return createAndSend(userId, type, title, message);
    }

    public List<Notification> getUserNotifications(UUID userId) {
        return repository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Notification> getUnreadNotifications(UUID userId) {
        return repository.findByUserIdAndIsReadFalse(userId);
    }

    public long getUnreadCount(UUID userId) {
        return repository.countByUserIdAndIsReadFalse(userId);
    }

    public void markAsRead(UUID notificationId) {
        repository.findById(notificationId).ifPresent(n -> {
            n.setRead(true);
            repository.save(n);
        });
    }

    public void markAllAsRead(UUID userId) {
        List<Notification> unread = repository.findByUserIdAndIsReadFalse(userId);
        unread.forEach(n -> n.setRead(true));
        repository.saveAll(unread);
    }

    private Notification createAndSend(UUID userId, String type, String title, String message) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setChannel("IN_APP");

        // Simulate email sending
        log.info("📧 Sending notification [{}] to user {}: {}", type, userId, title);
        notification.setStatus("SENT");
        notification.setSentAt(LocalDateTime.now());

        return repository.save(notification);
    }
}
