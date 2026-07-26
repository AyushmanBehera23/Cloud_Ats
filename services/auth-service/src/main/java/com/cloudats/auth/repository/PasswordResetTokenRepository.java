package com.cloudats.auth.repository;

import com.cloudats.auth.entity.PasswordResetToken;
import com.cloudats.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, UUID> {
    Optional<PasswordResetToken> findByToken(String token);
    Optional<PasswordResetToken> findByTokenAndUsedFalse(String token);
    void deleteByUser(User user);
}
