# CloudATS — API Reference

All requests go through the **API Gateway** at `http://localhost:8080` (or port 8080 in production).

---

## Authentication — `/api/auth`

All auth endpoints are public (no JWT required).

### `POST /api/auth/register`
Create a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1-555-0100",
  "role": "CANDIDATE"
}
```
**Response `201`:**
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "abc123...",
  "tokenType": "Bearer",
  "expiresIn": 900000,
  "userId": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "role": "CANDIDATE"
}
```

### `POST /api/auth/login`
Authenticate and receive JWT tokens.

**Request:** `{ "email": "...", "password": "..." }`  
**Response:** Same as register.

### `POST /api/auth/refresh`
Rotate JWT access token using a refresh token.

**Request:** `{ "refreshToken": "abc123..." }`  
**Response:** New `accessToken` + `refreshToken`

### `POST /api/auth/logout`
Revoke all refresh tokens. Requires `Authorization: Bearer <token>`.

### `POST /api/auth/forgot-password`
Request a password reset token.

**Request:** `{ "email": "user@example.com" }`

### `POST /api/auth/reset-password`
Reset password using the token.

**Request:** `{ "token": "reset-token", "newPassword": "NewPass123!" }`

---

## Resumes — `/api/resumes`

> All endpoints require `Authorization: Bearer <token>`

### `POST /api/resumes/upload`
Upload and parse a resume.

**Content-Type:** `multipart/form-data`  
**Fields:** `file` (PDF/DOCX, max 10MB), `userId` (UUID)

**Response `201`:**
```json
{
  "id": "resume-uuid",
  "fileName": "john_cv.pdf",
  "fileSize": 102400,
  "version": 1,
  "uploadedAt": "2024-01-15T10:30:00",
  "parsed": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1-555-0100",
    "linkedinUrl": "linkedin.com/in/johndoe",
    "githubUrl": "github.com/johndoe",
    "skills": ["Java", "Spring Boot", "Docker", "Kubernetes"],
    "projects": ["E-commerce platform with microservices", "..."],
    "education": ["B.Tech Computer Science, IIT Delhi, 2020"],
    "experience": ["Senior Developer at TechCorp 2021–2024"],
    "certifications": ["AWS Solutions Architect"]
  }
}
```

### `GET /api/resumes/user/{userId}`
Get all active resumes for a user.

### `GET /api/resumes/{id}`
Get resume metadata by ID.

### `GET /api/resumes/{id}/parsed`
Get structured parsed data for a resume.

### `GET /api/resumes/{id}/download`
Get a presigned MinIO download URL (valid 1 hour).

**Response:** `{ "downloadUrl": "https://minio.../..." }`

### `DELETE /api/resumes/{id}`
Soft-delete a resume.

---

## ATS Scoring — `/api/scores`

### `POST /api/scores/analyze`
Score a resume against a specialization.

**Params:** `resumeId` (UUID), `userId` (UUID), `specialization` (string)

**Available specializations:**
`CLOUD_ENGINEER`, `JAVA_DEVELOPER`, `BACKEND_DEVELOPER`, `FRONTEND_DEVELOPER`,
`DEVOPS_ENGINEER`, `SOFTWARE_ENGINEER`, `DATA_ENGINEER`, `AI_ENGINEER`, `CYBER_SECURITY`

**Response:**
```json
{
  "scoreId": "uuid",
  "overallScore": 74.5,
  "specialization": "Java Developer",
  "breakdown": {
    "skills": { "score": 85.0, "matched": ["Java", "Spring"], "missing": ["JPA"] },
    "experience": { "score": 70.0, "count": 2 },
    "education": { "score": 80.0, "count": 1 },
    "projects": { "score": 65.0, "count": 3 },
    "certifications": { "score": 30.0, "count": 0 },
    "formatting": { "score": 80.0, "wordCount": 520 },
    "keywords": { "score": 60.0, "found": ["API", "SOLID"], "missing": ["JVM"] }
  },
  "weights": { "skills": 0.3, "experience": 0.25, "education": 0.1, "projects": 0.15, "certifications": 0.1, "formatting": 0.05, "keywords": 0.05 },
  "matchedSkills": ["Java", "Spring Boot", "Maven"],
  "missingSkills": ["Hibernate", "JPA"],
  "missingKeywords": ["multithreading", "JVM", "garbage collection"],
  "suggestions": ["Add Hibernate and JPA to your resume", "Expand work experience section"],
  "recommendation": "Strong resume. Minor improvements could make it outstanding."
}
```

### `POST /api/scores/compare-jd`
Compare resume against a job description.

**Request:**
```json
{
  "resumeId": "uuid",
  "jdTitle": "Senior Java Developer",
  "jdDescription": "We are looking for a Java developer...",
  "requiredSkills": ["Java", "Spring Boot", "PostgreSQL"],
  "preferredSkills": ["Kafka", "Docker", "Kubernetes"]
}
```

### `GET /api/scores/resume/{resumeId}`
Get all ATS score results for a resume.

### `GET /api/scores/user/{userId}`
Get all ATS score results for a user.

### `GET /api/scores/specializations`
List all 9 specializations with their scoring criteria and weights.

---

## Recruiter — `/api/recruiter`

### `GET /api/recruiter/candidates`
Search and rank candidates.

**Query params:**
- `skill` (string) — filter by skill
- `minScore` (number) — minimum ATS score
- `specialization` (string) — filter by specialization

Returns candidates sorted by ATS score descending.

### `POST /api/recruiter/shortlist`
Shortlist a candidate.

```json
{
  "recruiterId": "uuid",
  "candidateId": "uuid",
  "resumeId": "uuid",
  "jobDescriptionId": "uuid",
  "notes": "Strong Java background"
}
```

### `GET /api/recruiter/shortlists/{recruiterId}`
Get all shortlisted candidates for a recruiter.

### `POST /api/recruiter/jobs`
Create a job description.

```json
{
  "recruiterId": "uuid",
  "title": "Senior Java Developer",
  "description": "Full job description...",
  "requiredSkills": "[\"Java\",\"Spring Boot\"]",
  "preferredSkills": "[\"Kafka\",\"Docker\"]",
  "experienceLevel": "SENIOR",
  "specialization": "JAVA_DEVELOPER"
}
```

### `GET /api/recruiter/jobs`
Get all active job descriptions.

### `PUT /api/recruiter/applications/{id}/status`
Update an application status.

```json
{
  "status": "SHORTLISTED",
  "reviewerId": "uuid",
  "notes": "Moving to next round"
}
```
**Status values:** `APPLIED`, `UNDER_REVIEW`, `SHORTLISTED`, `REJECTED`, `HIRED`

---

## Analytics — `/api/analytics`

### `GET /api/analytics/dashboard`
Full dashboard data (combines all endpoints below).

### `GET /api/analytics/users`
User count by role, active users.

### `GET /api/analytics/resumes`
Total resumes, by file type, daily uploads (last 30 days).

### `GET /api/analytics/scores`
Average/min/max score, count by specialization.

### `GET /api/analytics/recruiter-activity`
Active jobs, total shortlisted, applications by status.

### `GET /api/analytics/popular-skills`
Top 20 most common skills across all resumes.

---

## Notifications — `/api/notifications`

### `POST /api/notifications/send`
Send a notification.

```json
{
  "userId": "uuid",
  "type": "GENERAL",
  "title": "Update available",
  "message": "A new feature has been added."
}
```

### `GET /api/notifications/user/{userId}`
Get all notifications for a user.

### `GET /api/notifications/user/{userId}/unread`
Get unread notifications.

### `GET /api/notifications/user/{userId}/unread-count`
**Response:** `{ "count": 3 }`

### `PUT /api/notifications/{id}/read`
Mark a notification as read.

### `PUT /api/notifications/user/{userId}/read-all`
Mark all notifications as read.

---

## Error Responses

All endpoints return standardized error responses:

```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Email already exists",
  "path": "/api/auth/register"
}
```

**Common HTTP status codes:**
- `200 OK` — Success
- `201 Created` — Resource created
- `400 Bad Request` — Validation error
- `401 Unauthorized` — Missing or invalid JWT
- `403 Forbidden` — Insufficient role
- `404 Not Found` — Resource not found
- `500 Internal Server Error` — Server error
