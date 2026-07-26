package com.cloudats.recruiter.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "applications", schema = "recruiter_schema")
public class Application {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @Column(name = "candidate_id", nullable = false) private UUID candidateId;
    @Column(name = "job_description_id", nullable = false) private UUID jobDescriptionId;
    @Column(name = "resume_id") private UUID resumeId;
    @Column(name = "ats_score_id") private UUID atsScoreId;
    @Column(length = 20, nullable = false) private String status = "APPLIED";
    @Column(name = "recruiter_notes", columnDefinition = "TEXT") private String recruiterNotes;
    @Column(name = "reviewed_by") private UUID reviewedBy;
    @Column(name = "applied_at", updatable = false) private LocalDateTime appliedAt;
    @Column(name = "reviewed_at") private LocalDateTime reviewedAt;
    @Column(name = "updated_at") private LocalDateTime updatedAt;

    @PrePersist protected void onCreate() { appliedAt = LocalDateTime.now(); updatedAt = LocalDateTime.now(); }
    @PreUpdate protected void onUpdate() { updatedAt = LocalDateTime.now(); }
    public Application() {}

    public UUID getId() { return id; } public void setId(UUID id) { this.id = id; }
    public UUID getCandidateId() { return candidateId; } public void setCandidateId(UUID candidateId) { this.candidateId = candidateId; }
    public UUID getJobDescriptionId() { return jobDescriptionId; } public void setJobDescriptionId(UUID jobDescriptionId) { this.jobDescriptionId = jobDescriptionId; }
    public UUID getResumeId() { return resumeId; } public void setResumeId(UUID resumeId) { this.resumeId = resumeId; }
    public UUID getAtsScoreId() { return atsScoreId; } public void setAtsScoreId(UUID atsScoreId) { this.atsScoreId = atsScoreId; }
    public String getStatus() { return status; } public void setStatus(String status) { this.status = status; }
    public String getRecruiterNotes() { return recruiterNotes; } public void setRecruiterNotes(String recruiterNotes) { this.recruiterNotes = recruiterNotes; }
    public UUID getReviewedBy() { return reviewedBy; } public void setReviewedBy(UUID reviewedBy) { this.reviewedBy = reviewedBy; }
    public LocalDateTime getAppliedAt() { return appliedAt; } public void setAppliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; }
    public LocalDateTime getReviewedAt() { return reviewedAt; } public void setReviewedAt(LocalDateTime reviewedAt) { this.reviewedAt = reviewedAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; } public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
