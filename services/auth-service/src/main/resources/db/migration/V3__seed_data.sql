-- ============================================================================
-- V3: Seed data — 1 admin, 2 recruiters, 5 candidates
-- ============================================================================
-- All passwords are BCrypt-hashed: "Password123!"
-- BCrypt hash generated with strength 12

INSERT INTO auth_schema.users (id, email, password_hash, first_name, last_name, phone, role, is_active, email_verified) VALUES
-- Admin
('a0000000-0000-0000-0000-000000000001', 'admin@cloudats.dev',
 '$2a$10$IC53qNZLEor6UeqBMHKUJOu.sGMTqXW3VYhK4MKvg9JUzfyWF7hNO',
 'Admin', 'CloudATS', '+1-555-0100', 'ADMIN', true, true),

-- Recruiters
('b0000000-0000-0000-0000-000000000001', 'recruiter1@cloudats.dev',
 '$2a$10$IC53qNZLEor6UeqBMHKUJOu.sGMTqXW3VYhK4MKvg9JUzfyWF7hNO',
 'Sarah', 'Johnson', '+1-555-0201', 'RECRUITER', true, true),

('b0000000-0000-0000-0000-000000000002', 'recruiter2@cloudats.dev',
 '$2a$10$IC53qNZLEor6UeqBMHKUJOu.sGMTqXW3VYhK4MKvg9JUzfyWF7hNO',
 'Michael', 'Chen', '+1-555-0202', 'RECRUITER', true, true),

-- Candidates
('c0000000-0000-0000-0000-000000000001', 'candidate1@example.com',
 '$2a$10$IC53qNZLEor6UeqBMHKUJOu.sGMTqXW3VYhK4MKvg9JUzfyWF7hNO',
 'Ayushman', 'Behera', '+1-555-0301', 'CANDIDATE', true, true),

('c0000000-0000-0000-0000-000000000002', 'candidate2@example.com',
 '$2a$10$IC53qNZLEor6UeqBMHKUJOu.sGMTqXW3VYhK4MKvg9JUzfyWF7hNO',
 'James', 'Wilson', '+1-555-0302', 'CANDIDATE', true, true),

('c0000000-0000-0000-0000-000000000003', 'candidate3@example.com',
 '$2a$10$IC53qNZLEor6UeqBMHKUJOu.sGMTqXW3VYhK4MKvg9JUzfyWF7hNO',
 'Aisha', 'Khan', '+1-555-0303', 'CANDIDATE', true, true),

('c0000000-0000-0000-0000-000000000004', 'candidate4@example.com',
 '$2a$10$IC53qNZLEor6UeqBMHKUJOu.sGMTqXW3VYhK4MKvg9JUzfyWF7hNO',
 'Carlos', 'Rodriguez', '+1-555-0304', 'CANDIDATE', true, true),

('c0000000-0000-0000-0000-000000000005', 'candidate5@example.com',
 '$2a$10$IC53qNZLEor6UeqBMHKUJOu.sGMTqXW3VYhK4MKvg9JUzfyWF7hNO',
 'Emily', 'Davis', '+1-555-0305', 'CANDIDATE', true, true)

ON CONFLICT (email) DO NOTHING;
