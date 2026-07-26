package com.cloudats.scoring.service;

import com.cloudats.scoring.engine.ScoringEngine;
import com.cloudats.scoring.engine.SpecializationConfig;
import com.cloudats.scoring.entity.AtsScore;
import com.cloudats.scoring.repository.AtsScoreRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class AtsScoringService {

    private final AtsScoreRepository scoreRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final String resumeServiceUrl;

    public AtsScoringService(AtsScoreRepository scoreRepository,
                             @Value("${resume-service.url:http://localhost:8082}") String resumeServiceUrl) {
        this.scoreRepository = scoreRepository;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
        this.resumeServiceUrl = resumeServiceUrl;
    }

    @Transactional
    @SuppressWarnings("unchecked")
    public Map<String, Object> scoreResume(UUID resumeId, UUID userId, String specialization) {
        // Fetch parsed data from resume-service
        Map<String, Object> parsedData;
        try {
            parsedData = restTemplate.getForObject(
                    resumeServiceUrl + "/api/resumes/" + resumeId + "/parsed",
                    Map.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch parsed resume data: " + e.getMessage());
        }

        if (parsedData == null) {
            throw new RuntimeException("No parsed data found for resume: " + resumeId);
        }

        // Extract fields
        List<String> skills = parseJsonList(parsedData.get("skills"));
        List<String> experience = parseJsonList(parsedData.get("experience"));
        List<String> education = parseJsonList(parsedData.get("education"));
        List<String> projects = parseJsonList(parsedData.get("projects"));
        List<String> certifications = parseJsonList(parsedData.get("certifications"));
        String rawText = (String) parsedData.getOrDefault("rawText", "");

        // Score
        Map<String, Object> result = ScoringEngine.scoreBySpecialization(
                specialization, skills, experience, education, projects, certifications, rawText);

        // Persist
        AtsScore score = new AtsScore();
        score.setResumeId(resumeId);
        score.setUserId(userId);
        score.setSpecialization(specialization);
        score.setOverallScore((double) result.get("overallScore"));
        score.setScoreBreakdown(toJson(result.get("breakdown")));
        score.setMatchedSkills(toJson(result.get("matchedSkills")));
        score.setMissingSkills(toJson(result.get("missingSkills")));
        score.setMissingKeywords(toJson(result.get("missingKeywords")));
        score.setSuggestions(toJson(result.get("suggestions")));
        score.setRecommendation((String) result.get("recommendation"));
        scoreRepository.save(score);

        result.put("scoreId", score.getId());
        return result;
    }

    @Transactional
    @SuppressWarnings("unchecked")
    public Map<String, Object> compareWithJd(UUID resumeId, UUID jobDescriptionId,
                                              String jdTitle, String jdDescription,
                                              List<String> requiredSkills, List<String> preferredSkills) {
        Map<String, Object> parsedData;
        try {
            parsedData = restTemplate.getForObject(
                    resumeServiceUrl + "/api/resumes/" + resumeId + "/parsed",
                    Map.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch parsed resume data: " + e.getMessage());
        }

        List<String> resumeSkills = parseJsonList(parsedData.get("skills"));
        String rawText = (String) parsedData.getOrDefault("rawText", "");

        return ScoringEngine.scoreByJobDescription(resumeSkills, rawText, jdTitle, jdDescription,
                requiredSkills, preferredSkills);
    }

    public List<AtsScore> getScoresForResume(UUID resumeId) {
        return scoreRepository.findByResumeId(resumeId);
    }

    public List<AtsScore> getScoresForUser(UUID userId) {
        return scoreRepository.findByUserId(userId);
    }

    public Map<String, Object> getSpecializations() {
        Map<String, Object> result = new LinkedHashMap<>();
        SpecializationConfig.getAll().forEach((key, spec) -> {
            Map<String, Object> info = new LinkedHashMap<>();
            info.put("name", spec.name());
            info.put("requiredSkills", spec.requiredSkills());
            info.put("preferredSkills", spec.preferredSkills());
            info.put("weights", Map.of(
                    "skills", spec.skillsWeight(),
                    "experience", spec.experienceWeight(),
                    "education", spec.educationWeight(),
                    "projects", spec.projectsWeight(),
                    "certifications", spec.certificationsWeight(),
                    "formatting", spec.formattingWeight(),
                    "keywords", spec.keywordsWeight()
            ));
            result.put(key, info);
        });
        return result;
    }

    @SuppressWarnings("unchecked")
    private List<String> parseJsonList(Object value) {
        if (value == null) return List.of();
        if (value instanceof List) return (List<String>) value;
        if (value instanceof String str) {
            try {
                return objectMapper.readValue(str, new TypeReference<List<String>>() {});
            } catch (Exception e) {
                return List.of(str);
            }
        }
        return List.of();
    }

    private String toJson(Object obj) {
        try { return objectMapper.writeValueAsString(obj); }
        catch (Exception e) { return "[]"; }
    }
}
