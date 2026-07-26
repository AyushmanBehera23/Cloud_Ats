package com.cloudats.scoring.repository;

import com.cloudats.scoring.entity.AtsScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface AtsScoreRepository extends JpaRepository<AtsScore, UUID> {
    List<AtsScore> findByResumeId(UUID resumeId);
    List<AtsScore> findByUserId(UUID userId);
    List<AtsScore> findBySpecialization(String specialization);

    @Query("SELECT AVG(a.overallScore) FROM AtsScore a")
    Double findAverageScore();

    @Query("SELECT a.specialization, AVG(a.overallScore) FROM AtsScore a GROUP BY a.specialization")
    List<Object[]> findAverageScoreBySpecialization();

    @Query("SELECT a FROM AtsScore a WHERE a.overallScore >= :minScore ORDER BY a.overallScore DESC")
    List<AtsScore> findByMinScore(double minScore);
}
