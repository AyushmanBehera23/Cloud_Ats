-- ============================================================================
-- V1: Create users table
-- ============================================================================

CREATE TABLE IF NOT EXISTS auth_schema.users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    phone           VARCHAR(20),
    role            VARCHAR(20)  NOT NULL DEFAULT 'CANDIDATE',
    is_active       BOOLEAN      NOT NULL DEFAULT true,
    email_verified  BOOLEAN      NOT NULL DEFAULT false,
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON auth_schema.users(email);
CREATE INDEX idx_users_role ON auth_schema.users(role);
