CREATE TABLE IF NOT EXISTS scoring_schema.ats_scores (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_id           UUID         NOT NULL,
    user_id             UUID         NOT NULL,
    job_description_id  UUID,
    specialization      VARCHAR(50),
    overall_score       DOUBLE PRECISION NOT NULL,
    score_breakdown     TEXT,
    matched_skills      TEXT,
    missing_skills      TEXT,
    missing_keywords    TEXT,
    suggestions         TEXT,
    recommendation      TEXT,
    scored_at           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ats_scores_resume_id ON scoring_schema.ats_scores(resume_id);
CREATE INDEX idx_ats_scores_user_id ON scoring_schema.ats_scores(user_id);
CREATE INDEX idx_ats_scores_specialization ON scoring_schema.ats_scores(specialization);
