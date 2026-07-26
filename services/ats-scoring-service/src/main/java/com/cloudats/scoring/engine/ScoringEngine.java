package com.cloudats.scoring.engine;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Rule-based ATS scoring engine.
 * Scores resumes against specialization criteria or job descriptions.
 */
public class ScoringEngine {

    /**
     * Score a resume against a specialization.
     */
    public static Map<String, Object> scoreBySpecialization(
            String specialization,
            List<String> skills,
            List<String> experience,
            List<String> education,
            List<String> projects,
            List<String> certifications,
            String rawText) {

        SpecializationConfig.Specialization spec = SpecializationConfig.get(specialization);
        if (spec == null) {
            throw new RuntimeException("Unknown specialization: " + specialization +
                    ". Available: " + String.join(", ", SpecializationConfig.getSpecializationNames()));
        }

        // Score each dimension
        Map<String, Object> skillsScore = scoreSkills(skills, spec.requiredSkills(), spec.preferredSkills());
        Map<String, Object> experienceScore = scoreExperience(experience);
        Map<String, Object> educationScore = scoreEducation(education);
        Map<String, Object> projectsScore = scoreProjects(projects);
        Map<String, Object> certificationsScore = scoreCertifications(certifications);
        Map<String, Object> formattingScore = scoreFormatting(rawText);
        Map<String, Object> keywordsScore = scoreKeywords(rawText, spec.keywords());

        // Calculate weighted overall score
        double overall =
                (double) skillsScore.get("score") * spec.skillsWeight() +
                (double) experienceScore.get("score") * spec.experienceWeight() +
                (double) educationScore.get("score") * spec.educationWeight() +
                (double) projectsScore.get("score") * spec.projectsWeight() +
                (double) certificationsScore.get("score") * spec.certificationsWeight() +
                (double) formattingScore.get("score") * spec.formattingWeight() +
                (double) keywordsScore.get("score") * spec.keywordsWeight();

        overall = Math.min(100.0, Math.max(0.0, overall));

        // Matched & missing skills
        List<String> matchedSkills = (List<String>) skillsScore.get("matched");
        List<String> missingSkills = (List<String>) skillsScore.get("missing");
        List<String> missingKeywords = (List<String>) keywordsScore.get("missing");

        // Generate suggestions
        List<String> suggestions = generateSuggestions(missingSkills, missingKeywords,
                (double) experienceScore.get("score"), (double) projectsScore.get("score"),
                (double) certificationsScore.get("score"), spec);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("overallScore", Math.round(overall * 10.0) / 10.0);
        result.put("specialization", spec.name());
        result.put("breakdown", Map.of(
                "skills", skillsScore,
                "experience", experienceScore,
                "education", educationScore,
                "projects", projectsScore,
                "certifications", certificationsScore,
                "formatting", formattingScore,
                "keywords", keywordsScore
        ));
        result.put("weights", Map.of(
                "skills", spec.skillsWeight(),
                "experience", spec.experienceWeight(),
                "education", spec.educationWeight(),
                "projects", spec.projectsWeight(),
                "certifications", spec.certificationsWeight(),
                "formatting", spec.formattingWeight(),
                "keywords", spec.keywordsWeight()
        ));
        result.put("matchedSkills", matchedSkills);
        result.put("missingSkills", missingSkills);
        result.put("missingKeywords", missingKeywords);
        result.put("suggestions", suggestions);
        result.put("recommendation", generateRecommendation(overall));

        return result;
    }

    /**
     * Score a resume against a specific job description.
     */
    public static Map<String, Object> scoreByJobDescription(
            List<String> resumeSkills,
            String rawText,
            String jdTitle,
            String jdDescription,
            List<String> jdRequiredSkills,
            List<String> jdPreferredSkills) {

        // Find matches
        Set<String> resumeSkillsLower = resumeSkills.stream()
                .map(String::toLowerCase).collect(Collectors.toSet());
        String rawLower = rawText.toLowerCase();

        List<String> matchedRequired = jdRequiredSkills.stream()
                .filter(s -> resumeSkillsLower.contains(s.toLowerCase()) || rawLower.contains(s.toLowerCase()))
                .toList();
        List<String> missingRequired = jdRequiredSkills.stream()
                .filter(s -> !resumeSkillsLower.contains(s.toLowerCase()) && !rawLower.contains(s.toLowerCase()))
                .toList();
        List<String> matchedPreferred = jdPreferredSkills.stream()
                .filter(s -> resumeSkillsLower.contains(s.toLowerCase()) || rawLower.contains(s.toLowerCase()))
                .toList();
        List<String> missingPreferred = jdPreferredSkills.stream()
                .filter(s -> !resumeSkillsLower.contains(s.toLowerCase()) && !rawLower.contains(s.toLowerCase()))
                .toList();

        // Extract JD keywords
        String[] jdWords = jdDescription.toLowerCase().split("\\W+");
        Set<String> jdKeywords = Arrays.stream(jdWords)
                .filter(w -> w.length() > 3)
                .collect(Collectors.toSet());
        List<String> missingKeywords = jdKeywords.stream()
                .filter(k -> !rawLower.contains(k))
                .limit(15)
                .toList();

        // Calculate match percentage
        int totalRequired = jdRequiredSkills.size();
        int totalPreferred = jdPreferredSkills.size();
        double requiredMatch = totalRequired > 0 ? (double) matchedRequired.size() / totalRequired * 100 : 100;
        double preferredMatch = totalPreferred > 0 ? (double) matchedPreferred.size() / totalPreferred * 100 : 100;
        double matchPercent = requiredMatch * 0.7 + preferredMatch * 0.3;

        List<String> recommendations = new ArrayList<>();
        if (!missingRequired.isEmpty()) {
            recommendations.add("Add these required skills to your resume: " + String.join(", ", missingRequired));
        }
        if (!missingPreferred.isEmpty()) {
            recommendations.add("Consider learning: " + String.join(", ", missingPreferred));
        }
        if (matchPercent < 50) {
            recommendations.add("Your resume has a low match for this role. Consider tailoring it specifically.");
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("jobTitle", jdTitle);
        result.put("matchPercentage", Math.round(matchPercent * 10.0) / 10.0);
        result.put("matchedRequiredSkills", matchedRequired);
        result.put("missingRequiredSkills", missingRequired);
        result.put("matchedPreferredSkills", matchedPreferred);
        result.put("missingPreferredSkills", missingPreferred);
        result.put("missingKeywords", missingKeywords);
        result.put("recommendations", recommendations);
        return result;
    }

    // ── Private scoring methods ──

    private static Map<String, Object> scoreSkills(List<String> resumeSkills,
                                                    List<String> requiredSkills,
                                                    List<String> preferredSkills) {
        Set<String> resumeSkillsLower = resumeSkills.stream()
                .map(String::toLowerCase).collect(Collectors.toSet());

        List<String> matched = new ArrayList<>();
        List<String> missing = new ArrayList<>();

        for (String skill : requiredSkills) {
            if (resumeSkillsLower.contains(skill.toLowerCase())) {
                matched.add(skill);
            } else {
                missing.add(skill);
            }
        }

        int preferredMatches = 0;
        for (String skill : preferredSkills) {
            if (resumeSkillsLower.contains(skill.toLowerCase())) {
                matched.add(skill);
                preferredMatches++;
            }
        }

        double requiredRatio = requiredSkills.isEmpty() ? 1.0 :
                (double) (requiredSkills.size() - missing.size()) / requiredSkills.size();
        double preferredRatio = preferredSkills.isEmpty() ? 0.0 :
                (double) preferredMatches / preferredSkills.size();

        double score = (requiredRatio * 80 + preferredRatio * 20);
        score = Math.min(100, score + resumeSkills.size() * 0.5); // bonus for breadth

        Map<String, Object> result = new HashMap<>();
        result.put("score", score);
        result.put("matched", matched);
        result.put("missing", missing);
        result.put("totalResume", resumeSkills.size());
        return result;
    }

    private static Map<String, Object> scoreExperience(List<String> experience) {
        double score;
        if (experience.isEmpty()) {
            score = 20.0;
        } else if (experience.size() == 1) {
            score = 45.0;
        } else if (experience.size() == 2) {
            score = 65.0;
        } else if (experience.size() <= 4) {
            score = 80.0;
        } else {
            score = 95.0;
        }

        // Bonus for detailed experience entries
        long detailedEntries = experience.stream().filter(e -> e.length() > 50).count();
        score += detailedEntries * 2;
        score = Math.min(100, score);

        Map<String, Object> result = new HashMap<>();
        result.put("score", score);
        result.put("count", experience.size());
        return result;
    }

    private static Map<String, Object> scoreEducation(List<String> education) {
        double score;
        if (education.isEmpty()) {
            score = 30.0;
        } else if (education.size() == 1) {
            score = 65.0;
        } else {
            score = 85.0;
        }

        // Check for keywords suggesting higher education
        String eduText = String.join(" ", education).toLowerCase();
        if (eduText.contains("master") || eduText.contains("m.s.") || eduText.contains("m.tech")) score += 10;
        if (eduText.contains("phd") || eduText.contains("doctorate")) score += 15;
        if (eduText.contains("computer science") || eduText.contains("engineering")) score += 5;
        score = Math.min(100, score);

        Map<String, Object> result = new HashMap<>();
        result.put("score", score);
        result.put("count", education.size());
        return result;
    }

    private static Map<String, Object> scoreProjects(List<String> projects) {
        double score;
        if (projects.isEmpty()) {
            score = 15.0;
        } else if (projects.size() == 1) {
            score = 45.0;
        } else if (projects.size() == 2) {
            score = 65.0;
        } else if (projects.size() <= 4) {
            score = 80.0;
        } else {
            score = 95.0;
        }

        Map<String, Object> result = new HashMap<>();
        result.put("score", score);
        result.put("count", projects.size());
        return result;
    }

    private static Map<String, Object> scoreCertifications(List<String> certifications) {
        double score;
        if (certifications.isEmpty()) {
            score = 30.0;
        } else if (certifications.size() <= 2) {
            score = 65.0;
        } else {
            score = 90.0;
        }

        Map<String, Object> result = new HashMap<>();
        result.put("score", score);
        result.put("count", certifications.size());
        return result;
    }

    private static Map<String, Object> scoreFormatting(String rawText) {
        double score = 60.0; // base

        // Check length (not too short, not too long)
        int wordCount = rawText.split("\\s+").length;
        if (wordCount >= 300 && wordCount <= 800) score += 20;
        else if (wordCount >= 200 && wordCount <= 1200) score += 10;
        else if (wordCount < 100) score -= 20;

        // Check for section headers
        String lower = rawText.toLowerCase();
        if (lower.contains("experience")) score += 5;
        if (lower.contains("education")) score += 5;
        if (lower.contains("skills")) score += 5;
        if (lower.contains("projects")) score += 5;

        score = Math.min(100, Math.max(0, score));

        Map<String, Object> result = new HashMap<>();
        result.put("score", score);
        result.put("wordCount", wordCount);
        return result;
    }

    private static Map<String, Object> scoreKeywords(String rawText, List<String> keywords) {
        String lower = rawText.toLowerCase();
        List<String> found = new ArrayList<>();
        List<String> missing = new ArrayList<>();

        for (String keyword : keywords) {
            if (lower.contains(keyword.toLowerCase())) {
                found.add(keyword);
            } else {
                missing.add(keyword);
            }
        }

        double score = keywords.isEmpty() ? 70.0 :
                (double) found.size() / keywords.size() * 100;

        Map<String, Object> result = new HashMap<>();
        result.put("score", score);
        result.put("found", found);
        result.put("missing", missing);
        return result;
    }

    private static List<String> generateSuggestions(List<String> missingSkills, List<String> missingKeywords,
                                                     double experienceScore, double projectsScore,
                                                     double certificationsScore,
                                                     SpecializationConfig.Specialization spec) {
        List<String> suggestions = new ArrayList<>();

        if (!missingSkills.isEmpty()) {
            suggestions.add("Add these in-demand skills for " + spec.name() + ": " + String.join(", ", missingSkills));
        }
        if (experienceScore < 50) {
            suggestions.add("Expand your work experience section with more details about responsibilities and achievements.");
        }
        if (projectsScore < 50) {
            suggestions.add("Add relevant projects demonstrating your " + spec.name() + " expertise.");
        }
        if (certificationsScore < 50) {
            suggestions.add("Consider obtaining certifications relevant to " + spec.name() + ".");
        }
        if (!missingKeywords.isEmpty() && missingKeywords.size() > 3) {
            suggestions.add("Include more industry keywords: " + String.join(", ", missingKeywords.subList(0, Math.min(5, missingKeywords.size()))));
        }
        if (suggestions.isEmpty()) {
            suggestions.add("Your resume is well-aligned with " + spec.name() + " requirements. Keep it updated!");
        }

        return suggestions;
    }

    private static String generateRecommendation(double score) {
        if (score >= 85) return "Excellent resume! Highly competitive for this role.";
        if (score >= 70) return "Strong resume. Minor improvements could make it outstanding.";
        if (score >= 55) return "Decent resume. Focus on adding missing skills and expanding project details.";
        if (score >= 40) return "Below average. Significant improvements needed in skills and experience sections.";
        return "Needs major revision. Consider adding more relevant skills, projects, and certifications.";
    }
}
