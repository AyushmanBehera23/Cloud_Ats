# ☁️ CloudATS — Production-Grade Cloud-Native AI Recruitment Platform

> An enterprise-grade, microservices-based Applicant Tracking System with AI-powered resume scoring, built on Spring Boot 3, React, Kubernetes, and modern cloud-native tooling.

---

## 🏗️ Architecture Overview

CloudATS is decomposed into **7 independently deployable microservices**, fronted by an API Gateway and a React SPA. All services communicate over **REST/HTTP** through the gateway, with async event notifications handled via Spring's `@Async` + an internal event bus.

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────────────────────────────────┐
│  React SPA  │────▶│  API Gateway │────▶│  Microservices (Spring Boot 3 / Java 21)    │
│  (Vite/TS)  │     │  (Port 8080) │     │                                             │
└─────────────┘     └──────┬───────┘     │  ┌──────────┐  ┌───────────┐  ┌──────────┐  │
                           │             │  │ Auth     │  │ Resume    │  │ ATS      │  │
                           │             │  │ :8081    │  │ :8082     │  │ Scoring  │  │
                           │             │  └──────────┘  └───────────┘  │ :8083    │  │
                           │             │  ┌──────────┐  ┌───────────┐  └──────────┘  │
                           │             │  │Recruiter │  │ Analytics │  ┌──────────┐  │
                           │             │  │ :8084    │  │ :8085     │  │Notif.    │  │
                           │             │  └──────────┘  └───────────┘  │ :8086    │  │
                           │             │                               └──────────┘  │
                           │             └─────────────────────────────────────────────┘
                           │
                    ┌──────┴───────┐
                    │  PostgreSQL  │     ┌──────────┐
                    │  (Port 5432) │     │  MinIO   │
                    └──────────────┘     │ (Port 9000) │
                                        └──────────┘
```

## 📦 Tech Stack

| Layer              | Technology                                              |
|--------------------|---------------------------------------------------------|
| **Frontend**       | React 18, TypeScript, Vite, TailwindCSS, Shadcn/UI     |
| **API Gateway**    | Spring Cloud Gateway (reactive)                         |
| **Backend**        | Spring Boot 3.4, Java 21, Spring Security, Spring Data JPA |
| **Authentication** | JWT (access + refresh tokens), BCrypt, Role-based (RBAC)|
| **Database**       | PostgreSQL 16                                           |
| **Object Storage** | MinIO (S3-compatible, for resume files)                 |
| **Migrations**     | Flyway                                                  |
| **API Docs**       | SpringDoc OpenAPI 3 (Swagger UI)                        |
| **Containerization** | Docker, Docker Compose                               |
| **Orchestration**  | Kubernetes (Deployments, Services, Ingress, HPA)        |
| **Monitoring**     | Prometheus + Grafana + Spring Boot Actuator             |
| **CI/CD**          | GitHub Actions                                          |
| **Testing**        | JUnit 5, Mockito, Spring Boot Test, Testcontainers      |

---

## 🗂️ Repository Structure

```
CloudATS/
├── frontend/                          # React + TypeScript + Vite SPA
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── services/                          # Java 21 / Spring Boot 3 microservices
│   ├── api-gateway/                   # Spring Cloud Gateway — route + filter
│   ├── auth-service/                  # Registration, login, JWT, RBAC
│   ├── resume-service/                # Upload, parse, store (MinIO + Postgres)
│   ├── ats-scoring-service/           # Rule-based scoring + JD matching
│   ├── recruiter-service/             # Search, shortlist, JD management
│   ├── analytics-service/             # Dashboards, trends, aggregations
│   └── notification-service/          # Async notifications (email stubs)
│
├── k8s/                               # Kubernetes manifests
│   ├── base/                          # Namespace, common ConfigMaps
│   ├── services/                      # Deployment + Service per microservice
│   ├── storage/                       # PVCs for PostgreSQL and MinIO
│   └── networking/                    # Ingress, NetworkPolicies
│
├── docker/                            # Shared Dockerfiles and compose overrides
├── monitoring/                        # Prometheus + Grafana configs
│   ├── prometheus/
│   └── grafana/dashboards/
│
├── docs/                              # Architecture docs, guides, reports
├── scripts/                           # Utility scripts (seed, test, deploy)
│
├── docker-compose.yml                 # Full local development stack
├── .github/workflows/                 # CI/CD pipelines
└── README.md                          # ← You are here
```

---

## 🔀 Service Communication

All inter-service communication follows a **synchronous REST** pattern routed through the API Gateway:

| From                  | To                   | Purpose                                          |
|-----------------------|----------------------|--------------------------------------------------|
| Frontend              | API Gateway          | All client requests                               |
| API Gateway           | Auth Service         | Login, register, token validation                 |
| API Gateway           | Resume Service       | Upload, download, parse resumes                   |
| API Gateway           | ATS Scoring Service  | Score resumes, compare with JDs                   |
| API Gateway           | Recruiter Service    | Search, shortlist, manage candidates               |
| API Gateway           | Analytics Service    | Dashboard data, trends, reports                    |
| API Gateway           | Notification Service | Trigger notifications                              |
| Resume Service        | Auth Service         | Validate JWT tokens                                |
| ATS Scoring Service   | Resume Service       | Fetch parsed resume data                           |
| Recruiter Service     | ATS Scoring Service  | Fetch/trigger scores                               |
| Recruiter Service     | Resume Service       | Fetch candidate resumes                            |
| Notification Service  | Auth Service         | Lookup user emails for notifications               |

**Async notifications** are fired via Spring's `@Async` within the notification-service (no external message broker required for MVP).

---

## 🗄️ Database Strategy

- **Single PostgreSQL instance** with schema-per-service isolation:
  - `auth_schema` — users, roles, refresh_tokens
  - `resume_schema` — resumes, parsed_data
  - `scoring_schema` — ats_scores, scoring_rules
  - `recruiter_schema` — job_descriptions, applications, shortlists
  - `analytics_schema` — materialized views / aggregation tables
  - `notification_schema` — notification_logs
- **Flyway** manages migrations per service
- Each service connects to the same Postgres instance but uses its own schema

---

## 🚀 Quick Start (Docker Compose)

```bash
# Clone the repository
git clone https://github.com/your-org/cloudats.git
cd cloudats

# Start infrastructure (Postgres + MinIO)
docker-compose up -d postgres minio

# Start all services (once they're built)
docker-compose up -d

# Frontend dev server
cd frontend && npm install && npm run dev
```

---

## 🧪 Testing

```bash
# Run all service tests
cd services/auth-service && ./mvnw test
cd services/resume-service && ./mvnw test
# ... repeat per service

# Integration tests (require Docker)
cd services/auth-service && ./mvnw verify -Pintegration
```

---

## 📊 Monitoring

- **Prometheus**: `http://localhost:9090` — scrapes Spring Boot Actuator `/actuator/prometheus`
- **Grafana**: `http://localhost:3000` — pre-configured dashboards for CPU, memory, API latency, JVM metrics

---

## 📝 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 👥 Contributors

Built by Ayushman Behera as a production-grade cloud-native portfolio project.
