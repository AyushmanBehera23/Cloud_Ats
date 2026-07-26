package com.cloudats.recruiter.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "job_descriptions", schema = "recruiter_schema")
public class JobDescription {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @Column(name = "recruiter_id", nullable = false) private UUID recruiterId;
    @Column(nullable = false) private String title;
    @Column(columnDefinition = "TEXT", nullable = false) private String description;
    @Column(name = "required_skills", columnDefinition = "TEXT") private String requiredSkills;
    @Column(name = "preferred_skills", columnDefinition = "TEXT") private String preferredSkills;
    @Column(name = "experience_level", length = 20) private String experienceLevel;
    @Column(length = 50) private String specialization;
    @Column(name = "is_active") private boolean isActive = true;
    @Column(name = "created_at", updatable = false) private LocalDateTime createdAt;
    @Column(name = "updated_at") private LocalDateTime updatedAt;

    @PrePersist protected void onCreate() { createdAt = LocalDateTime.now(); updatedAt = LocalDateTime.now(); }
    @PreUpdate protected void onUpdate() { updatedAt = LocalDateTime.now(); }
    public JobDescription() {}

    public UUID getId() { return id; } public void setId(UUID id) { this.id = id; }
    public UUID getRecruiterId() { return recruiterId; } public void setRecruiterId(UUID recruiterId) { this.recruiterId = recruiterId; }
    public String getTitle() { return title; } public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; } public void setDescription(String description) { this.description = description; }
    public String getRequiredSkills() { return requiredSkills; } public void setRequiredSkills(String requiredSkills) { this.requiredSkills = requiredSkills; }
    public String getPreferredSkills() { return preferredSkills; } public void setPreferredSkills(String preferredSkills) { this.preferredSkills = preferredSkills; }
    public String getExperienceLevel() { return experienceLevel; } public void setExperienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; }
    public String getSpecialization() { return specialization; } public void setSpecialization(String specialization) { this.specialization = specialization; }
    public boolean isActive() { return isActive; } public void setActive(boolean active) { isActive = active; }
    public LocalDateTime getCreatedAt() { return createdAt; } public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; } public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
