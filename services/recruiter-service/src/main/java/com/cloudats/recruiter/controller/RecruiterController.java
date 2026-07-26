package com.cloudats.recruiter.controller;

import com.cloudats.recruiter.entity.*;
import com.cloudats.recruiter.service.RecruiterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/recruiter")
@Tag(name = "Recruiter", description = "Candidate search, shortlisting, and JD management")
public class RecruiterController {

    private final RecruiterService recruiterService;
    public RecruiterController(RecruiterService recruiterService) { this.recruiterService = recruiterService; }

    @GetMapping("/candidates")
    @Operation(summary = "Search candidates with filters")
    public ResponseEntity<List<Map<String, Object>>> searchCandidates(
            @RequestParam(required = false) String skill,
            @RequestParam(required = false) Double minScore,
            @RequestParam(required = false) String specialization) {
        return ResponseEntity.ok(recruiterService.searchCandidates(skill, minScore, specialization));
    }

    @PostMapping("/shortlist")
    @Operation(summary = "Shortlist a candidate")
    public ResponseEntity<Shortlist> shortlistCandidate(@RequestBody Map<String, String> request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                recruiterService.shortlistCandidate(
                        UUID.fromString(request.get("recruiterId")),
                        UUID.fromString(request.get("candidateId")),
                        request.get("resumeId") != null ? UUID.fromString(request.get("resumeId")) : null,
                        request.get("jobDescriptionId") != null ? UUID.fromString(request.get("jobDescriptionId")) : null,
                        request.get("notes")));
    }

    @GetMapping("/shortlists/{recruiterId}")
    @Operation(summary = "Get recruiter's shortlisted candidates")
    public ResponseEntity<List<Shortlist>> getShortlists(@PathVariable UUID recruiterId) {
        return ResponseEntity.ok(recruiterService.getRecruiterShortlists(recruiterId));
    }

    @PostMapping("/jobs")
    @Operation(summary = "Create a job description")
    public ResponseEntity<JobDescription> createJob(@RequestBody JobDescription jd) {
        return ResponseEntity.status(HttpStatus.CREATED).body(recruiterService.createJobDescription(jd));
    }

    @GetMapping("/jobs")
    @Operation(summary = "Get all active job descriptions")
    public ResponseEntity<List<JobDescription>> getJobs() {
        return ResponseEntity.ok(recruiterService.getActiveJobDescriptions());
    }

    @GetMapping("/jobs/recruiter/{recruiterId}")
    @Operation(summary = "Get recruiter's job descriptions")
    public ResponseEntity<List<JobDescription>> getRecruiterJobs(@PathVariable UUID recruiterId) {
        return ResponseEntity.ok(recruiterService.getRecruiterJobs(recruiterId));
    }

    @PutMapping("/applications/{id}/status")
    @Operation(summary = "Update application status (shortlist/reject)")
    public ResponseEntity<Application> updateStatus(@PathVariable UUID id, @RequestBody Map<String, String> request) {
        return ResponseEntity.ok(recruiterService.updateApplicationStatus(id,
                request.get("status"),
                request.get("reviewerId") != null ? UUID.fromString(request.get("reviewerId")) : null,
                request.get("notes")));
    }

    @GetMapping("/applications/job/{jobId}")
    @Operation(summary = "Get applications for a job")
    public ResponseEntity<List<Application>> getJobApplications(@PathVariable UUID jobId) {
        return ResponseEntity.ok(recruiterService.getJobApplications(jobId));
    }
}
