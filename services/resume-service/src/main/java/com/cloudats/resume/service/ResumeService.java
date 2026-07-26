package com.cloudats.resume.service;

import com.cloudats.resume.entity.ParsedResumeData;
import com.cloudats.resume.entity.Resume;
import com.cloudats.resume.repository.ParsedResumeDataRepository;
import com.cloudats.resume.repository.ResumeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

/**
 * Core resume service — upload, parse, store, retrieve, delete.
 */
@Service
public class ResumeService {

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
    private static final Set<String> ALLOWED_TYPES = Set.of(
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    private final ResumeRepository resumeRepository;
    private final ParsedResumeDataRepository parsedResumeDataRepository;
    private final MinioStorageService minioStorageService;
    private final ResumeParserService resumeParserService;

    public ResumeService(ResumeRepository resumeRepository,
                         ParsedResumeDataRepository parsedResumeDataRepository,
                         MinioStorageService minioStorageService,
                         ResumeParserService resumeParserService) {
        this.resumeRepository = resumeRepository;
        this.parsedResumeDataRepository = parsedResumeDataRepository;
        this.minioStorageService = minioStorageService;
        this.resumeParserService = resumeParserService;
    }

    /**
     * Upload, store, and parse a resume.
     */
    @Transactional
    public Map<String, Object> uploadResume(MultipartFile file, UUID userId) throws IOException {
        // Validate
        validateFile(file);

        // Upload to MinIO
        String objectKey = minioStorageService.uploadFile(file, userId);

        // Determine version
        List<Resume> existing = resumeRepository.findByUserIdAndIsActiveTrueOrderByVersionDesc(userId);
        int nextVersion = existing.isEmpty() ? 1 : existing.get(0).getVersion() + 1;

        // Save metadata
        Resume resume = new Resume();
        resume.setUserId(userId);
        resume.setFileName(file.getOriginalFilename());
        resume.setFileType(file.getContentType());
        resume.setFileSize(file.getSize());
        resume.setMinioObjectKey(objectKey);
        resume.setMinioBucket(minioStorageService.getBucketName());
        resume.setVersion(nextVersion);
        resume = resumeRepository.save(resume);

        // Parse resume
        Map<String, Object> parsed = resumeParserService.parseResume(file);

        ParsedResumeData parsedData = new ParsedResumeData();
        parsedData.setResume(resume);
        parsedData.setFullName((String) parsed.get("fullName"));
        parsedData.setEmail((String) parsed.get("email"));
        parsedData.setPhone((String) parsed.get("phone"));
        parsedData.setLinkedinUrl((String) parsed.get("linkedinUrl"));
        parsedData.setGithubUrl((String) parsed.get("githubUrl"));
        parsedData.setSkills(resumeParserService.toJson(parsed.get("skills")));
        parsedData.setProjects(resumeParserService.toJson(parsed.get("projects")));
        parsedData.setEducation(resumeParserService.toJson(parsed.get("education")));
        parsedData.setExperience(resumeParserService.toJson(parsed.get("experience")));
        parsedData.setCertifications(resumeParserService.toJson(parsed.get("certifications")));
        parsedData.setRawText((String) parsed.get("rawText"));
        parsedResumeDataRepository.save(parsedData);

        Map<String, Object> result = new HashMap<>();
        result.put("id", resume.getId());
        result.put("fileName", resume.getFileName());
        result.put("fileSize", resume.getFileSize());
        result.put("version", resume.getVersion());
        result.put("uploadedAt", resume.getUploadedAt());
        result.put("parsed", parsed);
        return result;
    }

    /**
     * Get all resumes for a user.
     */
    public List<Map<String, Object>> getUserResumes(UUID userId) {
        List<Resume> resumes = resumeRepository.findByUserIdAndIsActiveTrueOrderByVersionDesc(userId);
        return resumes.stream().map(this::toResumeResponse).toList();
    }

    /**
     * Get resume by ID.
     */
    public Map<String, Object> getResumeById(UUID resumeId) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found: " + resumeId));
        return toResumeResponse(resume);
    }

    /**
     * Get parsed data for a resume.
     */
    public Map<String, Object> getParsedData(UUID resumeId) {
        ParsedResumeData data = parsedResumeDataRepository.findByResumeId(resumeId)
                .orElseThrow(() -> new RuntimeException("Parsed data not found for resume: " + resumeId));

        Map<String, Object> result = new HashMap<>();
        result.put("id", data.getId());
        result.put("resumeId", resumeId);
        result.put("fullName", data.getFullName());
        result.put("email", data.getEmail());
        result.put("phone", data.getPhone());
        result.put("linkedinUrl", data.getLinkedinUrl());
        result.put("githubUrl", data.getGithubUrl());
        result.put("skills", data.getSkills());
        result.put("projects", data.getProjects());
        result.put("education", data.getEducation());
        result.put("experience", data.getExperience());
        result.put("certifications", data.getCertifications());
        result.put("rawText", data.getRawText());
        result.put("parsedAt", data.getParsedAt());
        return result;
    }

    /**
     * Generate a secure download URL for a resume.
     */
    public String getDownloadUrl(UUID resumeId) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found: " + resumeId));
        return minioStorageService.getPresignedUrl(resume.getMinioObjectKey());
    }

    /**
     * Soft-delete a resume.
     */
    @Transactional
    public void deleteResume(UUID resumeId) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found: " + resumeId));
        resume.setActive(false);
        resumeRepository.save(resume);
    }

    /**
     * Get all active resumes (for admin/recruiter use).
     */
    public List<Map<String, Object>> getAllResumes() {
        return resumeRepository.findByIsActiveTrueOrderByUploadedAtDesc()
                .stream().map(this::toResumeResponse).toList();
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new RuntimeException("File size exceeds maximum limit of 10 MB");
        }
        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new RuntimeException("Invalid file type. Only PDF and DOCX are allowed");
        }
    }

    private Map<String, Object> toResumeResponse(Resume resume) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", resume.getId());
        map.put("userId", resume.getUserId());
        map.put("fileName", resume.getFileName());
        map.put("fileType", resume.getFileType());
        map.put("fileSize", resume.getFileSize());
        map.put("version", resume.getVersion());
        map.put("uploadedAt", resume.getUploadedAt());
        return map;
    }
}
