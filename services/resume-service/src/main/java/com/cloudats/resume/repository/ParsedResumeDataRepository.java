package com.cloudats.resume.repository;

import com.cloudats.resume.entity.ParsedResumeData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ParsedResumeDataRepository extends JpaRepository<ParsedResumeData, UUID> {
    Optional<ParsedResumeData> findByResumeId(UUID resumeId);
}
