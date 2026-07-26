CREATE TABLE IF NOT EXISTS recruiter_schema.job_descriptions (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recruiter_id     UUID         NOT NULL,
    title            VARCHAR(255) NOT NULL,
    description      TEXT         NOT NULL,
    required_skills  TEXT,
    preferred_skills TEXT,
    experience_level VARCHAR(20),
    specialization   VARCHAR(50),
    is_active        BOOLEAN DEFAULT true,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recruiter_schema.applications (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id        UUID NOT NULL,
    job_description_id  UUID NOT NULL REFERENCES recruiter_schema.job_descriptions(id),
    resume_id           UUID,
    ats_score_id        UUID,
    status              VARCHAR(20) NOT NULL DEFAULT 'APPLIED',
    recruiter_notes     TEXT,
    reviewed_by         UUID,
    applied_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at         TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recruiter_schema.shortlists (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recruiter_id        UUID NOT NULL,
    candidate_id        UUID NOT NULL,
    job_description_id  UUID,
    resume_id           UUID,
    notes               TEXT,
    shortlisted_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_jd_recruiter ON recruiter_schema.job_descriptions(recruiter_id);
CREATE INDEX idx_app_candidate ON recruiter_schema.applications(candidate_id);
CREATE INDEX idx_app_job ON recruiter_schema.applications(job_description_id);
CREATE INDEX idx_shortlist_recruiter ON recruiter_schema.shortlists(recruiter_id);
