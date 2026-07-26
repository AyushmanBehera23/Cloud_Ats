package com.cloudats.resume.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "parsed_resume_data", schema = "resume_schema")
public class ParsedResumeData {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false, unique = true)
    private Resume resume;

    @Column(name = "full_name")
    private String fullName;

    private String email;
    private String phone;

    @Column(name = "linkedin_url")
    private String linkedinUrl;

    @Column(name = "github_url")
    private String githubUrl;

    @Column(columnDefinition = "TEXT")
    private String skills; // JSON array

    @Column(columnDefinition = "TEXT")
    private String projects; // JSON array

    @Column(columnDefinition = "TEXT")
    private String education; // JSON array

    @Column(columnDefinition = "TEXT")
    private String experience; // JSON array

    @Column(columnDefinition = "TEXT")
    private String certifications; // JSON array

    @Column(name = "raw_text", columnDefinition = "TEXT")
    private String rawText;

    @Column(name = "parsed_at", nullable = false)
    private LocalDateTime parsedAt;

    @PrePersist
    protected void onCreate() {
        parsedAt = LocalDateTime.now();
    }

    public ParsedResumeData() {}

    // Getters & Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Resume getResume() { return resume; }
    public void setResume(Resume resume) { this.resume = resume; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }
    public String getGithubUrl() { return githubUrl; }
    public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }
    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }
    public String getProjects() { return projects; }
    public void setProjects(String projects) { this.projects = projects; }
    public String getEducation() { return education; }
    public void setEducation(String education) { this.education = education; }
    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }
    public String getCertifications() { return certifications; }
    public void setCertifications(String certifications) { this.certifications = certifications; }
    public String getRawText() { return rawText; }
    public void setRawText(String rawText) { this.rawText = rawText; }
    public LocalDateTime getParsedAt() { return parsedAt; }
    public void setParsedAt(LocalDateTime parsedAt) { this.parsedAt = parsedAt; }
}
