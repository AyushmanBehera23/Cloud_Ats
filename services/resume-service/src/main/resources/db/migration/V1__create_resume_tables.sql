CREATE TABLE IF NOT EXISTS resume_schema.resumes (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID         NOT NULL,
    file_name        VARCHAR(255) NOT NULL,
    file_type        VARCHAR(50)  NOT NULL,
    file_size        BIGINT       NOT NULL,
    minio_object_key VARCHAR(500) NOT NULL,
    minio_bucket     VARCHAR(100) NOT NULL,
    version          INTEGER      NOT NULL DEFAULT 1,
    is_active        BOOLEAN      NOT NULL DEFAULT true,
    uploaded_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_resumes_user_id ON resume_schema.resumes(user_id);

CREATE TABLE IF NOT EXISTS resume_schema.parsed_resume_data (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_id       UUID NOT NULL UNIQUE REFERENCES resume_schema.resumes(id) ON DELETE CASCADE,
    full_name       VARCHAR(255),
    email           VARCHAR(255),
    phone           VARCHAR(50),
    linkedin_url    VARCHAR(500),
    github_url      VARCHAR(500),
    skills          TEXT,
    projects        TEXT,
    education       TEXT,
    experience      TEXT,
    certifications  TEXT,
    raw_text        TEXT,
    parsed_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_parsed_resume_data_resume_id ON resume_schema.parsed_resume_data(resume_id);
