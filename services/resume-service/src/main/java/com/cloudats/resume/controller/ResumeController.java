package com.cloudats.resume.controller;

import com.cloudats.resume.service.ResumeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/resumes")
@Tag(name = "Resumes", description = "Resume upload, parsing, and management")
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @PostMapping("/upload")
    @Operation(summary = "Upload a resume", description = "Upload a PDF or DOCX resume file for parsing and storage")
    public ResponseEntity<Map<String, Object>> uploadResume(
            @RequestParam("file") MultipartFile file,
            @RequestParam("userId") UUID userId) throws IOException {
        Map<String, Object> result = resumeService.uploadResume(file, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get user's resumes", description = "Get all active resumes for a specific user")
    public ResponseEntity<List<Map<String, Object>>> getUserResumes(@PathVariable UUID userId) {
        return ResponseEntity.ok(resumeService.getUserResumes(userId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get resume by ID")
    public ResponseEntity<Map<String, Object>> getResumeById(@PathVariable UUID id) {
        return ResponseEntity.ok(resumeService.getResumeById(id));
    }

    @GetMapping("/{id}/parsed")
    @Operation(summary = "Get parsed resume data", description = "Returns structured parsed data for a resume")
    public ResponseEntity<Map<String, Object>> getParsedData(@PathVariable UUID id) {
        return ResponseEntity.ok(resumeService.getParsedData(id));
    }

    @GetMapping("/{id}/download")
    @Operation(summary = "Get download URL", description = "Generate a secure presigned download URL")
    public ResponseEntity<Map<String, String>> getDownloadUrl(@PathVariable UUID id) {
        String url = resumeService.getDownloadUrl(id);
        return ResponseEntity.ok(Map.of("downloadUrl", url));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete resume", description = "Soft-delete a resume")
    public ResponseEntity<Map<String, String>> deleteResume(@PathVariable UUID id) {
        resumeService.deleteResume(id);
        return ResponseEntity.ok(Map.of("message", "Resume deleted successfully"));
    }

    @GetMapping
    @Operation(summary = "Get all resumes", description = "Get all active resumes (admin/recruiter)")
    public ResponseEntity<List<Map<String, Object>>> getAllResumes() {
        return ResponseEntity.ok(resumeService.getAllResumes());
    }
}
