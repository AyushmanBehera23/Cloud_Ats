package com.cloudats.resume.repository;

import com.cloudats.resume.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, UUID> {
    List<Resume> findByUserIdAndIsActiveTrueOrderByVersionDesc(UUID userId);
    List<Resume> findByIsActiveTrueOrderByUploadedAtDesc();
    long countByIsActiveTrue();
    long countByUserId(UUID userId);
}
