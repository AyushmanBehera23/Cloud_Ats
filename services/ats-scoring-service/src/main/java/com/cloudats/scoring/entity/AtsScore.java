package com.cloudats.scoring.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "ats_scores", schema = "scoring_schema")
public class AtsScore {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "resume_id", nullable = false)
    private UUID resumeId;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "job_description_id")
    private UUID jobDescriptionId;

    @Column(length = 50)
    private String specialization;

    @Column(name = "overall_score", nullable = false)
    private double overallScore;

    @Column(name = "score_breakdown", columnDefinition = "TEXT")
    private String scoreBreakdown; // JSON

    @Column(name = "matched_skills", columnDefinition = "TEXT")
    private String matchedSkills; // JSON

    @Column(name = "missing_skills", columnDefinition = "TEXT")
    private String missingSkills; // JSON

    @Column(name = "missing_keywords", columnDefinition = "TEXT")
    private String missingKeywords; // JSON

    @Column(columnDefinition = "TEXT")
    private String suggestions; // JSON

    @Column(columnDefinition = "TEXT")
    private String recommendation;

    @Column(name = "scored_at", nullable = false)
    private LocalDateTime scoredAt;

    @PrePersist
    protected void onCreate() { scoredAt = LocalDateTime.now(); }

    public AtsScore() {}

    // Getters & Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getResumeId() { return resumeId; }
    public void setResumeId(UUID resumeId) { this.resumeId = resumeId; }
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public UUID getJobDescriptionId() { return jobDescriptionId; }
    public void setJobDescriptionId(UUID jobDescriptionId) { this.jobDescriptionId = jobDescriptionId; }
    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }
    public double getOverallScore() { return overallScore; }
    public void setOverallScore(double overallScore) { this.overallScore = overallScore; }
    public String getScoreBreakdown() { return scoreBreakdown; }
    public void setScoreBreakdown(String scoreBreakdown) { this.scoreBreakdown = scoreBreakdown; }
    public String getMatchedSkills() { return matchedSkills; }
    public void setMatchedSkills(String matchedSkills) { this.matchedSkills = matchedSkills; }
    public String getMissingSkills() { return missingSkills; }
    public void setMissingSkills(String missingSkills) { this.missingSkills = missingSkills; }
    public String getMissingKeywords() { return missingKeywords; }
    public void setMissingKeywords(String missingKeywords) { this.missingKeywords = missingKeywords; }
    public String getSuggestions() { return suggestions; }
    public void setSuggestions(String suggestions) { this.suggestions = suggestions; }
    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }
    public LocalDateTime getScoredAt() { return scoredAt; }
    public void setScoredAt(LocalDateTime scoredAt) { this.scoredAt = scoredAt; }
}
