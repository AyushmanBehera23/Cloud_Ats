package com.cloudats.recruiter.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "shortlists", schema = "recruiter_schema")
public class Shortlist {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @Column(name = "recruiter_id", nullable = false) private UUID recruiterId;
    @Column(name = "candidate_id", nullable = false) private UUID candidateId;
    @Column(name = "job_description_id") private UUID jobDescriptionId;
    @Column(name = "resume_id") private UUID resumeId;
    @Column(columnDefinition = "TEXT") private String notes;
    @Column(name = "shortlisted_at", updatable = false) private LocalDateTime shortlistedAt;

    @PrePersist protected void onCreate() { shortlistedAt = LocalDateTime.now(); }
    public Shortlist() {}

    public UUID getId() { return id; } public void setId(UUID id) { this.id = id; }
    public UUID getRecruiterId() { return recruiterId; } public void setRecruiterId(UUID recruiterId) { this.recruiterId = recruiterId; }
    public UUID getCandidateId() { return candidateId; } public void setCandidateId(UUID candidateId) { this.candidateId = candidateId; }
    public UUID getJobDescriptionId() { return jobDescriptionId; } public void setJobDescriptionId(UUID jobDescriptionId) { this.jobDescriptionId = jobDescriptionId; }
    public UUID getResumeId() { return resumeId; } public void setResumeId(UUID resumeId) { this.resumeId = resumeId; }
    public String getNotes() { return notes; } public void setNotes(String notes) { this.notes = notes; }
    public LocalDateTime getShortlistedAt() { return shortlistedAt; } public void setShortlistedAt(LocalDateTime shortlistedAt) { this.shortlistedAt = shortlistedAt; }
}
