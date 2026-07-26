package com.cloudats.scoring.controller;

import com.cloudats.scoring.entity.AtsScore;
import com.cloudats.scoring.service.AtsScoringService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/scores")
@Tag(name = "ATS Scoring", description = "Resume scoring and JD comparison")
public class ScoringController {

    private final AtsScoringService scoringService;

    public ScoringController(AtsScoringService scoringService) {
        this.scoringService = scoringService;
    }

    @PostMapping("/analyze")
    @Operation(summary = "Score a resume by specialization")
    public ResponseEntity<Map<String, Object>> scoreResume(
            @RequestParam UUID resumeId,
            @RequestParam UUID userId,
            @RequestParam String specialization) {
        return ResponseEntity.ok(scoringService.scoreResume(resumeId, userId, specialization));
    }

    @PostMapping("/compare-jd")
    @Operation(summary = "Compare resume with a job description")
    public ResponseEntity<Map<String, Object>> compareWithJd(@RequestBody Map<String, Object> request) {
        UUID resumeId = UUID.fromString((String) request.get("resumeId"));
        UUID jdId = request.get("jobDescriptionId") != null ?
                UUID.fromString((String) request.get("jobDescriptionId")) : null;
        String jdTitle = (String) request.get("jdTitle");
        String jdDescription = (String) request.get("jdDescription");
        @SuppressWarnings("unchecked")
        List<String> requiredSkills = (List<String>) request.getOrDefault("requiredSkills", List.of());
        @SuppressWarnings("unchecked")
        List<String> preferredSkills = (List<String>) request.getOrDefault("preferredSkills", List.of());

        return ResponseEntity.ok(scoringService.compareWithJd(resumeId, jdId, jdTitle, jdDescription,
                requiredSkills, preferredSkills));
    }

    @GetMapping("/resume/{resumeId}")
    @Operation(summary = "Get all scores for a resume")
    public ResponseEntity<List<AtsScore>> getResumeScores(@PathVariable UUID resumeId) {
        return ResponseEntity.ok(scoringService.getScoresForResume(resumeId));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get all scores for a user")
    public ResponseEntity<List<AtsScore>> getUserScores(@PathVariable UUID userId) {
        return ResponseEntity.ok(scoringService.getScoresForUser(userId));
    }

    @GetMapping("/specializations")
    @Operation(summary = "Get all available specializations with their criteria")
    public ResponseEntity<Map<String, Object>> getSpecializations() {
        return ResponseEntity.ok(scoringService.getSpecializations());
    }
}
