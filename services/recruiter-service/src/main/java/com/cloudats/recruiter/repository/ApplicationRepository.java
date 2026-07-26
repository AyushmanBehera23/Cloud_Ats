package com.cloudats.recruiter.repository;

import com.cloudats.recruiter.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, UUID> {
    List<Application> findByJobDescriptionId(UUID jobDescriptionId);
    List<Application> findByCandidateId(UUID candidateId);
    List<Application> findByStatus(String status);
    long countByStatus(String status);
}
