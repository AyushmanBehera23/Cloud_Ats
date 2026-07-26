package com.cloudats.recruiter.repository;

import com.cloudats.recruiter.entity.JobDescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface JobDescriptionRepository extends JpaRepository<JobDescription, UUID> {
    List<JobDescription> findByRecruiterIdAndIsActiveTrue(UUID recruiterId);
    List<JobDescription> findByIsActiveTrueOrderByCreatedAtDesc();
    List<JobDescription> findBySpecializationAndIsActiveTrue(String specialization);
}
