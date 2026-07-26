# CloudATS — Entity-Relationship Diagram

## Complete ER Diagram

```mermaid
erDiagram
    USERS {
        uuid id PK "Primary key"
        varchar email UK "Unique, login identifier"
        varchar password_hash "BCrypt hashed"
        varchar first_name "User first name"
        varchar last_name "User last name"
        varchar phone "Optional phone number"
        enum role "CANDIDATE | RECRUITER | ADMIN"
        boolean is_active "Soft-delete flag"
        boolean email_verified "Email confirmation status"
        timestamp created_at "Registration timestamp"
        timestamp updated_at "Last modification"
    }

    REFRESH_TOKENS {
        uuid id PK "Primary key"
        uuid user_id FK "References USERS"
        varchar token UK "Unique refresh token string"
        timestamp expires_at "Token expiry"
        boolean revoked "Revocation flag"
        timestamp created_at "Issue timestamp"
    }

    PASSWORD_RESET_TOKENS {
        uuid id PK "Primary key"
        uuid user_id FK "References USERS"
        varchar token UK "One-time reset token"
        timestamp expires_at "Token expiry (15 min)"
        boolean used "Single-use flag"
        timestamp created_at "Issue timestamp"
    }

    RESUMES {
        uuid id PK "Primary key"
        uuid user_id FK "References USERS (candidate)"
        varchar file_name "Original uploaded filename"
        varchar file_type "MIME type (PDF/DOCX)"
        bigint file_size "File size in bytes"
        varchar minio_object_key "MinIO storage key"
        varchar minio_bucket "MinIO bucket name"
        integer version "Resume version number"
        boolean is_active "Soft-delete flag"
        timestamp uploaded_at "Upload timestamp"
        timestamp updated_at "Last modification"
    }

    PARSED_RESUME_DATA {
        uuid id PK "Primary key"
        uuid resume_id FK "References RESUMES"
        varchar full_name "Extracted full name"
        varchar email "Extracted email"
        varchar phone "Extracted phone"
        varchar linkedin_url "Extracted LinkedIn URL"
        varchar github_url "Extracted GitHub URL"
        text skills "JSON array of skills"
        text projects "JSON array of projects"
        text education "JSON array of education entries"
        text experience "JSON array of work experience"
        text certifications "JSON array of certifications"
        text raw_text "Full extracted text"
        timestamp parsed_at "Parsing timestamp"
    }

    ATS_SCORES {
        uuid id PK "Primary key"
        uuid resume_id FK "References RESUMES"
        uuid user_id FK "References USERS"
        uuid job_description_id FK "Nullable — references JOB_DESCRIPTIONS"
        varchar specialization "e.g., Java Developer, DevOps"
        decimal overall_score "0-100 composite score"
        text skills_score "JSON breakdown"
        text experience_score "JSON breakdown"
        text education_score "JSON breakdown"
        text projects_score "JSON breakdown"
        text certifications_score "JSON breakdown"
        text formatting_score "JSON breakdown"
        text keyword_score "JSON breakdown"
        text matched_skills "JSON array"
        text missing_skills "JSON array"
        text missing_keywords "JSON array"
        text suggestions "JSON array of improvement tips"
        text recommendation "Overall recommendation text"
        timestamp scored_at "Scoring timestamp"
    }

    JOB_DESCRIPTIONS {
        uuid id PK "Primary key"
        uuid recruiter_id FK "References USERS (recruiter)"
        varchar title "Job title"
        text description "Full JD text"
        text required_skills "JSON array of required skills"
        text preferred_skills "JSON array of preferred skills"
        varchar experience_level "ENTRY | MID | SENIOR | LEAD"
        varchar specialization "Target specialization"
        boolean is_active "Active listing flag"
        timestamp created_at "Creation timestamp"
        timestamp updated_at "Last modification"
    }

    APPLICATIONS {
        uuid id PK "Primary key"
        uuid candidate_id FK "References USERS (candidate)"
        uuid job_description_id FK "References JOB_DESCRIPTIONS"
        uuid resume_id FK "References RESUMES"
        uuid ats_score_id FK "References ATS_SCORES"
        enum status "APPLIED | UNDER_REVIEW | SHORTLISTED | REJECTED | HIRED"
        text recruiter_notes "Recruiter's internal notes"
        uuid reviewed_by FK "Nullable — references USERS (recruiter)"
        timestamp applied_at "Application timestamp"
        timestamp reviewed_at "Review timestamp"
        timestamp updated_at "Last status change"
    }

    SHORTLISTS {
        uuid id PK "Primary key"
        uuid recruiter_id FK "References USERS (recruiter)"
        uuid candidate_id FK "References USERS (candidate)"
        uuid job_description_id FK "Nullable — references JOB_DESCRIPTIONS"
        uuid resume_id FK "References RESUMES"
        text notes "Shortlisting reason"
        timestamp shortlisted_at "Shortlist timestamp"
    }

    NOTIFICATIONS {
        uuid id PK "Primary key"
        uuid user_id FK "References USERS (recipient)"
        enum type "REGISTRATION | RESUME_UPLOAD | ATS_COMPLETE | SHORTLISTED | PASSWORD_RESET | GENERAL"
        varchar title "Notification title"
        text message "Notification body"
        boolean is_read "Read status"
        varchar channel "EMAIL | IN_APP | BOTH"
        varchar status "PENDING | SENT | FAILED"
        timestamp created_at "Creation timestamp"
        timestamp sent_at "Delivery timestamp"
    }

    %% ── Relationships ──

    USERS ||--o{ REFRESH_TOKENS : "has"
    USERS ||--o{ PASSWORD_RESET_TOKENS : "requests"
    USERS ||--o{ RESUMES : "uploads"
    USERS ||--o{ ATS_SCORES : "receives"
    USERS ||--o{ NOTIFICATIONS : "receives"
    USERS ||--o{ JOB_DESCRIPTIONS : "creates (recruiter)"
    USERS ||--o{ APPLICATIONS : "submits (candidate)"
    USERS ||--o{ SHORTLISTS : "creates (recruiter)"
    USERS ||--o{ SHORTLISTS : "is shortlisted (candidate)"

    RESUMES ||--|| PARSED_RESUME_DATA : "has parsed"
    RESUMES ||--o{ ATS_SCORES : "scored by"
    RESUMES ||--o{ APPLICATIONS : "attached to"
    RESUMES ||--o{ SHORTLISTS : "referenced in"

    JOB_DESCRIPTIONS ||--o{ APPLICATIONS : "receives"
    JOB_DESCRIPTIONS ||--o{ ATS_SCORES : "compared against"
    JOB_DESCRIPTIONS ||--o{ SHORTLISTS : "referenced in"

    APPLICATIONS ||--o| ATS_SCORES : "has score"
```

---

## Schema Ownership by Service

| Schema               | Service              | Tables                                          |
|----------------------|----------------------|--------------------------------------------------|
| `auth_schema`        | Auth Service         | `users`, `refresh_tokens`, `password_reset_tokens` |
| `resume_schema`      | Resume Service       | `resumes`, `parsed_resume_data`                   |
| `scoring_schema`     | ATS Scoring Service  | `ats_scores`                                      |
| `recruiter_schema`   | Recruiter Service    | `job_descriptions`, `applications`, `shortlists`  |
| `notification_schema`| Notification Service | `notifications`                                   |
| `analytics_schema`   | Analytics Service    | Materialized views / cross-schema read access     |

---

## Key Design Decisions

1. **UUID primary keys** — No auto-increment leakage, safe for distributed systems.
2. **Schema-per-service isolation** — Each service owns its schema; cross-service data access happens via API calls, not direct DB joins.
3. **JSON fields for variable-length data** — Skills, projects, experience stored as JSON arrays in `text` columns for flexibility (PostgreSQL's `jsonb` in actual implementation).
4. **Soft deletes** — `is_active` flags instead of hard deletes for audit trails.
5. **Separate parsed data table** — Raw file in MinIO, structured data in `parsed_resume_data`, keeping concerns separated.
6. **Application lifecycle** — Full status tracking from APPLIED → HIRED with recruiter audit trail.
