-- ============================================================================
-- CloudATS — PostgreSQL Initialization Script
-- ============================================================================
-- This script runs once on first container start via docker-entrypoint-initdb.d
-- Creates isolated schemas for each microservice
-- ============================================================================

-- Create schemas for each service
CREATE SCHEMA IF NOT EXISTS auth_schema;
CREATE SCHEMA IF NOT EXISTS resume_schema;
CREATE SCHEMA IF NOT EXISTS scoring_schema;
CREATE SCHEMA IF NOT EXISTS recruiter_schema;
CREATE SCHEMA IF NOT EXISTS analytics_schema;
CREATE SCHEMA IF NOT EXISTS notification_schema;

-- Grant usage to the cloudats_admin user (already has superuser, but explicit is better)
GRANT ALL PRIVILEGES ON SCHEMA auth_schema TO cloudats_admin;
GRANT ALL PRIVILEGES ON SCHEMA resume_schema TO cloudats_admin;
GRANT ALL PRIVILEGES ON SCHEMA scoring_schema TO cloudats_admin;
GRANT ALL PRIVILEGES ON SCHEMA recruiter_schema TO cloudats_admin;
GRANT ALL PRIVILEGES ON SCHEMA analytics_schema TO cloudats_admin;
GRANT ALL PRIVILEGES ON SCHEMA notification_schema TO cloudats_admin;

-- Log successful initialization
DO $$
BEGIN
    RAISE NOTICE '✅ CloudATS database schemas initialized successfully';
    RAISE NOTICE '   - auth_schema';
    RAISE NOTICE '   - resume_schema';
    RAISE NOTICE '   - scoring_schema';
    RAISE NOTICE '   - recruiter_schema';
    RAISE NOTICE '   - analytics_schema';
    RAISE NOTICE '   - notification_schema';
END $$;
