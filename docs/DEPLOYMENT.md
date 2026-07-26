# CloudATS — Deployment Guide

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Docker + Docker Compose | 24+ | Local containerization |
| Java | 21 (Temurin) | Building services locally |
| Maven | 3.9+ | Java build tool |
| Node.js | 18+ | Frontend development |
| kubectl | 1.28+ | Kubernetes deployments |

---

## Option 1: Local Development (Fastest)

### Step 1 — Start infrastructure only

```bash
# Clone the repo and start Postgres + MinIO
docker-compose up postgres minio minio-init -d

# Wait for healthy status
docker-compose ps
```

### Step 2 — Run services locally

Open 7 terminals (or use IntelliJ run configurations):

```bash
# Terminal 1 — Auth Service
cd services/auth-service && mvn spring-boot:run

# Terminal 2 — Resume Service  
cd services/resume-service && mvn spring-boot:run

# Terminal 3 — ATS Scoring Service
cd services/ats-scoring-service && mvn spring-boot:run

# Terminal 4 — Recruiter Service
cd services/recruiter-service && mvn spring-boot:run

# Terminal 5 — Analytics Service
cd services/analytics-service && mvn spring-boot:run

# Terminal 6 — Notification Service
cd services/notification-service && mvn spring-boot:run

# Terminal 7 — API Gateway
cd services/api-gateway && mvn spring-boot:run
```

### Step 3 — Start the Frontend

```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:5173
```

---

## Option 2: Full Docker Compose (Recommended for testing)

```bash
# Build all services and start everything
docker-compose up --build -d

# Check all services are healthy
docker-compose ps

# View combined logs
docker-compose logs -f

# Stop everything
docker-compose down
```

### Service URLs after startup:

| Service | URL | Swagger UI |
|---------|-----|------------|
| API Gateway | http://localhost:8080 | — |
| Auth Service | http://localhost:8081 | http://localhost:8081/swagger-ui.html |
| Resume Service | http://localhost:8082 | http://localhost:8082/swagger-ui.html |
| ATS Scoring | http://localhost:8083 | http://localhost:8083/swagger-ui.html |
| Recruiter Service | http://localhost:8084 | http://localhost:8084/swagger-ui.html |
| Analytics Service | http://localhost:8085 | http://localhost:8085/swagger-ui.html |
| Notification Service | http://localhost:8086 | http://localhost:8086/swagger-ui.html |
| MinIO Console | http://localhost:9001 | — |
| Prometheus | http://localhost:9090 | — |
| Grafana | http://localhost:3001 | (admin/cloudats_grafana_2024) |
| Frontend (dev) | http://localhost:5173 | — |

---

## Option 3: Kubernetes (Production)

### Prerequisites
- Kubernetes cluster (minikube, kind, or cloud provider)
- kubectl configured
- Docker images built and pushed

### Step 1 — Build and push images

```bash
# Build all service images
for svc in auth-service resume-service ats-scoring-service recruiter-service analytics-service notification-service api-gateway; do
  docker build -t your-registry/cloudats-$svc:latest services/$svc/
  docker push your-registry/cloudats-$svc:latest
done
```

### Step 2 — Deploy to Kubernetes

```bash
# Apply in order
kubectl apply -f k8s/base/namespace.yaml
kubectl apply -f k8s/storage/postgres.yaml
kubectl apply -f k8s/storage/minio.yaml

# Wait for storage to be ready
kubectl rollout status deployment/postgres -n cloudats
kubectl rollout status deployment/minio -n cloudats

# Deploy all microservices
kubectl apply -f k8s/services/deployments.yaml

# Apply Ingress
kubectl apply -f k8s/networking/ingress.yaml
```

### Step 3 — Verify

```bash
# Check all pods are Running
kubectl get pods -n cloudats

# Check services
kubectl get services -n cloudats

# Check HPA status
kubectl get hpa -n cloudats

# Get API Gateway NodePort
kubectl get service api-gateway -n cloudats
```

---

## Database Schemas

Each service uses its own Postgres schema. Flyway auto-creates tables on first start.

| Service | Schema | Tables |
|---------|--------|--------|
| Auth | `auth_schema` | users, refresh_tokens, password_reset_tokens |
| Resume | `resume_schema` | resumes, parsed_resume_data |
| Scoring | `scoring_schema` | ats_scores |
| Recruiter | `recruiter_schema` | job_descriptions, applications, shortlists |
| Notification | `notification_schema` | notifications |

---

## Default Credentials

### Database
- Host: `localhost:5432`
- Database: `cloudats`
- User: `cloudats_admin`
- Password: `cloudats_secret_2024`

### MinIO
- Endpoint: `http://localhost:9000`
- Access Key: `cloudats_minio`
- Secret Key: `cloudats_minio_secret_2024`

### Seed Users (all passwords: `Password123!`)
| Email | Role |
|-------|------|
| admin@cloudats.dev | ADMIN |
| recruiter1@cloudats.dev | RECRUITER |
| recruiter2@cloudats.dev | RECRUITER |
| candidate1@example.com | CANDIDATE |
| candidate2@example.com | CANDIDATE |

---

## CI/CD Pipeline

Push to `main` branch triggers:
1. **Build & Test** — Maven build + unit tests for all 7 services in parallel
2. **Docker Build & Push** — Multi-stage Docker builds pushed to Docker Hub
3. **Kubernetes Deploy** — `kubectl apply` + rolling update with health checks
4. **Manual Rollback** — Trigger `workflow_dispatch` to undo last deployment

Required GitHub Secrets:
- `DOCKER_HUB_USERNAME`
- `DOCKER_HUB_TOKEN`
- `KUBECONFIG` (base64-encoded kubeconfig)

---

## Monitoring

### Prometheus
- URL: `http://localhost:9090`
- Scrapes all services at `/actuator/prometheus` every 15 seconds

### Grafana
- URL: `http://localhost:3001`
- Login: `admin` / `cloudats_grafana_2024`
- Dashboard: **CloudATS Overview** (pre-loaded)
  - CPU & Memory usage per service
  - HTTP request rate and latency (p95)
  - Service health status
  - JVM thread count
  - Database connection pool

---

## Troubleshooting

**Services fail to start:**
```bash
docker-compose logs auth-service  # Check specific service logs
docker-compose restart auth-service
```

**Flyway migration errors:**
```bash
# Connect to Postgres and check flyway_schema_history
docker exec -it cloudats-postgres psql -U cloudats_admin -d cloudats -c "SELECT * FROM auth_schema.flyway_schema_history;"
```

**MinIO connection refused:**
```bash
docker-compose restart minio minio-init
```

**JWT token issues:**
- Ensure `jwt.secret` in `application.yml` matches the value set in environment variables
- Default secret must be ≥256 bits for HMAC-SHA256
