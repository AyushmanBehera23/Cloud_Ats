package com.cloudats.analytics.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import java.util.*;

@RestController
@RequestMapping("/api/analytics")
@Tag(name = "Analytics", description = "Dashboard data, trends, and reports")
public class AnalyticsController {

    @Autowired
    private EntityManager entityManager;

    @GetMapping("/dashboard")
    @Operation(summary = "Get complete dashboard data")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        Map<String, Object> dashboard = new LinkedHashMap<>();
        dashboard.put("userStats", getUserStats().getBody());
        dashboard.put("resumeStats", getResumeStats().getBody());
        dashboard.put("scoreStats", getScoreStats().getBody());
        dashboard.put("recruiterActivity", getRecruiterActivity().getBody());
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/users")
    @Operation(summary = "User growth statistics")
    public ResponseEntity<Map<String, Object>> getUserStats() {
        Map<String, Object> stats = new LinkedHashMap<>();
        try {
            Query totalUsers = entityManager.createNativeQuery("SELECT COUNT(*) FROM auth_schema.users");
            stats.put("totalUsers", ((Number) totalUsers.getSingleResult()).longValue());

            Query byRole = entityManager.createNativeQuery("SELECT role, COUNT(*) FROM auth_schema.users GROUP BY role");
            List<Object[]> roleData = byRole.getResultList();
            Map<String, Long> roleCounts = new LinkedHashMap<>();
            for (Object[] row : roleData) {
                roleCounts.put((String) row[0], ((Number) row[1]).longValue());
            }
            stats.put("byRole", roleCounts);

            Query activeUsers = entityManager.createNativeQuery("SELECT COUNT(*) FROM auth_schema.users WHERE is_active = true");
            stats.put("activeUsers", ((Number) activeUsers.getSingleResult()).longValue());
        } catch (Exception e) {
            stats.put("error", "User stats unavailable: " + e.getMessage());
        }
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/resumes")
    @Operation(summary = "Resume upload statistics")
    public ResponseEntity<Map<String, Object>> getResumeStats() {
        Map<String, Object> stats = new LinkedHashMap<>();
        try {
            Query totalResumes = entityManager.createNativeQuery("SELECT COUNT(*) FROM resume_schema.resumes WHERE is_active = true");
            stats.put("totalResumes", ((Number) totalResumes.getSingleResult()).longValue());

            Query byType = entityManager.createNativeQuery("SELECT file_type, COUNT(*) FROM resume_schema.resumes WHERE is_active = true GROUP BY file_type");
            List<Object[]> typeData = byType.getResultList();
            Map<String, Long> typeCounts = new LinkedHashMap<>();
            for (Object[] row : typeData) {
                typeCounts.put((String) row[0], ((Number) row[1]).longValue());
            }
            stats.put("byFileType", typeCounts);

            Query recentUploads = entityManager.createNativeQuery(
                    "SELECT DATE(uploaded_at) as upload_date, COUNT(*) FROM resume_schema.resumes WHERE uploaded_at >= CURRENT_DATE - INTERVAL '30 days' GROUP BY DATE(uploaded_at) ORDER BY upload_date");
            List<Object[]> dailyData = recentUploads.getResultList();
            List<Map<String, Object>> uploadTrends = new ArrayList<>();
            for (Object[] row : dailyData) {
                uploadTrends.add(Map.of("date", row[0].toString(), "count", ((Number) row[1]).longValue()));
            }
            stats.put("dailyUploads", uploadTrends);
        } catch (Exception e) {
            stats.put("error", "Resume stats unavailable: " + e.getMessage());
        }
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/scores")
    @Operation(summary = "ATS score statistics")
    public ResponseEntity<Map<String, Object>> getScoreStats() {
        Map<String, Object> stats = new LinkedHashMap<>();
        try {
            Query avgScore = entityManager.createNativeQuery("SELECT AVG(overall_score), MIN(overall_score), MAX(overall_score) FROM scoring_schema.ats_scores");
            Object[] scoreData = (Object[]) avgScore.getSingleResult();
            if (scoreData[0] != null) {
                stats.put("averageScore", Math.round(((Number) scoreData[0]).doubleValue() * 10.0) / 10.0);
                stats.put("minScore", Math.round(((Number) scoreData[1]).doubleValue() * 10.0) / 10.0);
                stats.put("maxScore", Math.round(((Number) scoreData[2]).doubleValue() * 10.0) / 10.0);
            }

            Query bySpec = entityManager.createNativeQuery(
                    "SELECT specialization, COUNT(*), AVG(overall_score) FROM scoring_schema.ats_scores GROUP BY specialization ORDER BY COUNT(*) DESC");
            List<Object[]> specData = bySpec.getResultList();
            List<Map<String, Object>> specStats = new ArrayList<>();
            for (Object[] row : specData) {
                specStats.add(Map.of(
                        "specialization", row[0] != null ? row[0] : "Unknown",
                        "count", ((Number) row[1]).longValue(),
                        "averageScore", Math.round(((Number) row[2]).doubleValue() * 10.0) / 10.0));
            }
            stats.put("bySpecialization", specStats);

            Query totalScores = entityManager.createNativeQuery("SELECT COUNT(*) FROM scoring_schema.ats_scores");
            stats.put("totalScoresGenerated", ((Number) totalScores.getSingleResult()).longValue());
        } catch (Exception e) {
            stats.put("error", "Score stats unavailable: " + e.getMessage());
        }
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/recruiter-activity")
    @Operation(summary = "Recruiter activity metrics")
    public ResponseEntity<Map<String, Object>> getRecruiterActivity() {
        Map<String, Object> stats = new LinkedHashMap<>();
        try {
            Query totalJobs = entityManager.createNativeQuery("SELECT COUNT(*) FROM recruiter_schema.job_descriptions WHERE is_active = true");
            stats.put("activeJobPostings", ((Number) totalJobs.getSingleResult()).longValue());

            Query totalShortlists = entityManager.createNativeQuery("SELECT COUNT(*) FROM recruiter_schema.shortlists");
            stats.put("totalShortlisted", ((Number) totalShortlists.getSingleResult()).longValue());

            Query totalApps = entityManager.createNativeQuery("SELECT COUNT(*) FROM recruiter_schema.applications");
            stats.put("totalApplications", ((Number) totalApps.getSingleResult()).longValue());

            Query byStatus = entityManager.createNativeQuery("SELECT status, COUNT(*) FROM recruiter_schema.applications GROUP BY status");
            List<Object[]> statusData = byStatus.getResultList();
            Map<String, Long> statusCounts = new LinkedHashMap<>();
            for (Object[] row : statusData) {
                statusCounts.put((String) row[0], ((Number) row[1]).longValue());
            }
            stats.put("applicationsByStatus", statusCounts);
        } catch (Exception e) {
            stats.put("error", "Recruiter stats unavailable: " + e.getMessage());
        }
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/popular-skills")
    @Operation(summary = "Most popular skills across all resumes")
    public ResponseEntity<Map<String, Object>> getPopularSkills() {
        Map<String, Object> stats = new LinkedHashMap<>();
        try {
            Query skillsQuery = entityManager.createNativeQuery(
                    "SELECT skills FROM resume_schema.parsed_resume_data WHERE skills IS NOT NULL");
            List<String> allSkills = skillsQuery.getResultList();

            Map<String, Integer> skillFrequency = new TreeMap<>(String.CASE_INSENSITIVE_ORDER);
            for (String skillsJson : allSkills) {
                if (skillsJson != null) {
                    // Simple JSON array parsing
                    String cleaned = skillsJson.replaceAll("[\\[\\]\"]", "");
                    String[] skills = cleaned.split(",");
                    for (String skill : skills) {
                        String trimmed = skill.trim();
                        if (!trimmed.isEmpty()) {
                            skillFrequency.merge(trimmed, 1, Integer::sum);
                        }
                    }
                }
            }

            // Sort by frequency
            List<Map<String, Object>> topSkills = skillFrequency.entrySet().stream()
                    .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                    .limit(20)
                    .map(e -> Map.<String, Object>of("skill", e.getKey(), "count", e.getValue()))
                    .toList();

            stats.put("topSkills", topSkills);
            stats.put("uniqueSkillsCount", skillFrequency.size());
        } catch (Exception e) {
            stats.put("error", "Skills stats unavailable: " + e.getMessage());
        }
        return ResponseEntity.ok(stats);
    }
}
