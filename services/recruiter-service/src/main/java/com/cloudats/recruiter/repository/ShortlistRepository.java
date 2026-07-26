package com.cloudats.recruiter.repository;

import com.cloudats.recruiter.entity.Shortlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface ShortlistRepository extends JpaRepository<Shortlist, UUID> {
    List<Shortlist> findByRecruiterId(UUID recruiterId);
    List<Shortlist> findByJobDescriptionId(UUID jobDescriptionId);
    boolean existsByRecruiterIdAndCandidateId(UUID recruiterId, UUID candidateId);
}
