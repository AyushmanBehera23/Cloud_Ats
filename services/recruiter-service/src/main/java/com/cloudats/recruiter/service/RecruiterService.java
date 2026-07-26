package com.cloudats.recruiter.service;

import com.cloudats.recruiter.entity.*;
import com.cloudats.recruiter.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class RecruiterService {

    private final JobDescriptionRepository jdRepository;
    private final ApplicationRepository applicationRepository;
    private final ShortlistRepository shortlistRepository;
    private final RestTemplate restTemplate;
    private final String atsScoringUrl;
    private final String resumeServiceUrl;

    public RecruiterService(JobDescriptionRepository jdRepository,
                            ApplicationRepository applicationRepository,
                            ShortlistRepository shortlistRepository,
                            @Value("${ats-scoring-service.url:http://localhost:8083}") String atsScoringUrl,
                            @Value("${resume-service.url:http://localhost:8082}") String resumeServiceUrl) {
        this.jdRepository = jdRepository;
        this.applicationRepository = applicationRepository;
        this.shortlistRepository = shortlistRepository;
        this.restTemplate = new RestTemplate();
        this.atsScoringUrl = atsScoringUrl;
        this.resumeServiceUrl = resumeServiceUrl;
    }

    // ── Job Descriptions ──
    @Transactional
    public JobDescription createJobDescription(JobDescription jd) {
        return jdRepository.save(jd);
    }

    public List<JobDescription> getActiveJobDescriptions() {
        return jdRepository.findByIsActiveTrueOrderByCreatedAtDesc();
    }

    public List<JobDescription> getRecruiterJobs(UUID recruiterId) {
        return jdRepository.findByRecruiterIdAndIsActiveTrue(recruiterId);
    }

    // ── Candidate Search ──
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> searchCandidates(String skill, Double minScore, String specialization) {
        List<Map<String, Object>> results = new ArrayList<>();
        try {
            // Fetch all resumes from resume-service
            List<Map<String, Object>> resumes = restTemplate.getForObject(
                    resumeServiceUrl + "/api/resumes", List.class);

            if (resumes == null) return results;

            for (Map<String, Object> resume : resumes) {
                String resumeId = resume.get("id").toString();

                // Get parsed data
                Map<String, Object> parsed = null;
                try {
                    parsed = restTemplate.getForObject(
                            resumeServiceUrl + "/api/resumes/" + resumeId + "/parsed", Map.class);
                } catch (Exception ignored) {}

                if (parsed == null) continue;

                // Filter by skill if specified
                if (skill != null && !skill.isEmpty()) {
                    String skills = parsed.getOrDefault("skills", "").toString().toLowerCase();
                    if (!skills.contains(skill.toLowerCase())) continue;
                }

                // Get score if available
                Map<String, Object> candidate = new HashMap<>(resume);
                candidate.put("parsedData", parsed);

                // Fetch scores
                try {
                    List<Map<String, Object>> scores = restTemplate.getForObject(
                            atsScoringUrl + "/api/scores/resume/" + resumeId, List.class);
                    if (scores != null && !scores.isEmpty()) {
                        Map<String, Object> latestScore = scores.get(scores.size() - 1);
                        double score = ((Number) latestScore.get("overallScore")).doubleValue();

                        // Filter by min score
                        if (minScore != null && score < minScore) continue;

                        // Filter by specialization
                        if (specialization != null && !specialization.isEmpty()) {
                            String scoreSpec = (String) latestScore.get("specialization");
                            if (scoreSpec != null && !scoreSpec.equalsIgnoreCase(specialization)) continue;
                        }

                        candidate.put("atsScore", score);
                        candidate.put("scoreDetails", latestScore);
                    }
                } catch (Exception ignored) {}

                results.add(candidate);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to search candidates: " + e.getMessage());
        }

        // Sort by ATS score descending
        results.sort((a, b) -> {
            double scoreA = a.containsKey("atsScore") ? ((Number) a.get("atsScore")).doubleValue() : 0;
            double scoreB = b.containsKey("atsScore") ? ((Number) b.get("atsScore")).doubleValue() : 0;
            return Double.compare(scoreB, scoreA);
        });

        return results;
    }

    // ── Shortlisting ──
    @Transactional
    public Shortlist shortlistCandidate(UUID recruiterId, UUID candidateId, UUID resumeId,
                                         UUID jobDescriptionId, String notes) {
        if (shortlistRepository.existsByRecruiterIdAndCandidateId(recruiterId, candidateId)) {
            throw new RuntimeException("Candidate already shortlisted");
        }

        Shortlist shortlist = new Shortlist();
        shortlist.setRecruiterId(recruiterId);
        shortlist.setCandidateId(candidateId);
        shortlist.setResumeId(resumeId);
        shortlist.setJobDescriptionId(jobDescriptionId);
        shortlist.setNotes(notes);
        return shortlistRepository.save(shortlist);
    }

    public List<Shortlist> getRecruiterShortlists(UUID recruiterId) {
        return shortlistRepository.findByRecruiterId(recruiterId);
    }

    // ── Applications ──
    @Transactional
    public Application updateApplicationStatus(UUID applicationId, String status, UUID reviewerId, String notes) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        app.setStatus(status);
        app.setReviewedBy(reviewerId);
        app.setRecruiterNotes(notes);
        app.setReviewedAt(LocalDateTime.now());
        return applicationRepository.save(app);
    }

    public List<Application> getJobApplications(UUID jobDescriptionId) {
        return applicationRepository.findByJobDescriptionId(jobDescriptionId);
    }
}
