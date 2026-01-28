# DishDash GCP Deployment Guide

This document provides step-by-step instructions for deploying DishDash to Google Cloud Platform.

## Prerequisites

1. Google Cloud Platform account with billing enabled
2. `gcloud` CLI installed and configured
3. Docker installed locally
4. Project code pushed to a Git repository

## GCP Services Used

| Service | Purpose |
|---------|---------|
| Cloud Run | Container hosting for backend and frontend |
| Cloud SQL | Managed PostgreSQL database |
| Container Registry | Docker image storage |
| Secret Manager | Secure secrets storage |
| Cloud Build | CI/CD pipeline |
| Cloud Logging | Log aggregation |

## Step 1: Initial GCP Setup

### 1.1 Create a New Project

```bash
# Set your project ID
export PROJECT_ID="dishdash-prod"

# Create the project
gcloud projects create $PROJECT_ID

# Set as default project
gcloud config set project $PROJECT_ID

# Link billing account (required)
gcloud beta billing projects link $PROJECT_ID \
  --billing-account=YOUR_BILLING_ACCOUNT_ID
```

### 1.2 Enable Required APIs

```bash
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  sqladmin.googleapis.com \
  secretmanager.googleapis.com \
  containerregistry.googleapis.com \
  compute.googleapis.com
```

## Step 2: Set Up Cloud SQL (PostgreSQL)

### 2.1 Create the Database Instance

```bash
# Create Cloud SQL instance
gcloud sql instances create dishdash-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --root-password=YOUR_ROOT_PASSWORD \
  --storage-type=SSD \
  --storage-size=10GB

# Create the database
gcloud sql databases create dishdash \
  --instance=dishdash-db

# Create application user
gcloud sql users create dishdash_user \
  --instance=dishdash-db \
  --password=YOUR_DB_PASSWORD
```

### 2.2 Get Connection Information

```bash
# Get the connection name (needed for Cloud Run)
gcloud sql instances describe dishdash-db \
  --format="value(connectionName)"

# Output: PROJECT_ID:us-central1:dishdash-db
```

## Step 3: Set Up Secret Manager

### 3.1 Create Secrets

```bash
# Generate a secure JWT secret
JWT_SECRET=$(openssl rand -hex 32)

# Store JWT secret
echo -n "$JWT_SECRET" | gcloud secrets create jwt-secret --data-file=-

# Store database password
echo -n "YOUR_DB_PASSWORD" | gcloud secrets create db-password --data-file=-
```

### 3.2 Grant Access to Cloud Run

```bash
# Get the project number
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")

# Grant access to secrets
gcloud secrets add-iam-policy-binding jwt-secret \
  --member="serviceAccount:$PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding db-password \
  --member="serviceAccount:$PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

## Step 4: Build and Push Docker Images

### 4.1 Configure Docker for GCR

```bash
gcloud auth configure-docker
```

### 4.2 Build and Push Backend

```bash
cd backend

# Build the image
docker build -t gcr.io/$PROJECT_ID/dishdash-backend:latest \
  --target production .

# Push to Container Registry
docker push gcr.io/$PROJECT_ID/dishdash-backend:latest
```

### 4.3 Build and Push Frontend

```bash
cd frontend

# Build the image (production nginx)
docker build -t gcr.io/$PROJECT_ID/dishdash-frontend:latest \
  --target production .

# Push to Container Registry
docker push gcr.io/$PROJECT_ID/dishdash-frontend:latest
```

## Step 5: Deploy to Cloud Run

### 5.1 Deploy Backend

```bash
gcloud run deploy dishdash-backend \
  --image=gcr.io/$PROJECT_ID/dishdash-backend:latest \
  --platform=managed \
  --region=us-central1 \
  --allow-unauthenticated \
  --add-cloudsql-instances=$PROJECT_ID:us-central1:dishdash-db \
  --set-env-vars="ENVIRONMENT=production" \
  --set-env-vars="DEBUG=false" \
  --set-env-vars="DATABASE_URL=postgresql+asyncpg://dishdash_user:$(gcloud secrets versions access latest --secret=db-password)@/dishdash?host=/cloudsql/$PROJECT_ID:us-central1:dishdash-db" \
  --set-secrets="JWT_SECRET_KEY=jwt-secret:latest" \
  --memory=512Mi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=10
```

### 5.2 Get Backend URL

```bash
BACKEND_URL=$(gcloud run services describe dishdash-backend \
  --platform=managed \
  --region=us-central1 \
  --format="value(status.url)")

echo "Backend URL: $BACKEND_URL"
```

### 5.3 Deploy Frontend

```bash
gcloud run deploy dishdash-frontend \
  --image=gcr.io/$PROJECT_ID/dishdash-frontend:latest \
  --platform=managed \
  --region=us-central1 \
  --allow-unauthenticated \
  --set-env-vars="VITE_API_URL=$BACKEND_URL" \
  --memory=256Mi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=5
```

## Step 6: Run Database Migrations

### 6.1 Using Cloud Shell or Local Machine with Cloud SQL Proxy

```bash
# Download Cloud SQL Proxy
wget https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64 -O cloud_sql_proxy
chmod +x cloud_sql_proxy

# Start the proxy
./cloud_sql_proxy -instances=$PROJECT_ID:us-central1:dishdash-db=tcp:5432 &

# Run migrations
cd backend
export DATABASE_URL="postgresql+asyncpg://dishdash_user:YOUR_DB_PASSWORD@localhost:5432/dishdash"
alembic upgrade head

# Optional: Run seed script
python -m scripts.seed_data
```

## Step 7: Set Up Cloud Build (CI/CD)

### 7.1 Create Cloud Build Configuration

The `deployment/cloudbuild.yaml` file should contain:

```yaml
steps:
  # Build backend
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'build'
      - '-t'
      - 'gcr.io/$PROJECT_ID/dishdash-backend:$COMMIT_SHA'
      - '-t'
      - 'gcr.io/$PROJECT_ID/dishdash-backend:latest'
      - '-f'
      - 'backend/Dockerfile'
      - '--target'
      - 'production'
      - 'backend/'

  # Build frontend
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'build'
      - '-t'
      - 'gcr.io/$PROJECT_ID/dishdash-frontend:$COMMIT_SHA'
      - '-t'
      - 'gcr.io/$PROJECT_ID/dishdash-frontend:latest'
      - '-f'
      - 'frontend/Dockerfile'
      - '--target'
      - 'production'
      - 'frontend/'

  # Push images
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/dishdash-backend:$COMMIT_SHA']
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/dishdash-backend:latest']
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/dishdash-frontend:$COMMIT_SHA']
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/dishdash-frontend:latest']

  # Deploy backend
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'dishdash-backend'
      - '--image=gcr.io/$PROJECT_ID/dishdash-backend:$COMMIT_SHA'
      - '--region=us-central1'
      - '--platform=managed'

  # Deploy frontend
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'dishdash-frontend'
      - '--image=gcr.io/$PROJECT_ID/dishdash-frontend:$COMMIT_SHA'
      - '--region=us-central1'
      - '--platform=managed'

images:
  - 'gcr.io/$PROJECT_ID/dishdash-backend:$COMMIT_SHA'
  - 'gcr.io/$PROJECT_ID/dishdash-backend:latest'
  - 'gcr.io/$PROJECT_ID/dishdash-frontend:$COMMIT_SHA'
  - 'gcr.io/$PROJECT_ID/dishdash-frontend:latest'

options:
  logging: CLOUD_LOGGING_ONLY
```

### 7.2 Connect Repository

```bash
# Create a trigger for main branch
gcloud builds triggers create github \
  --repo-name=DishDash \
  --repo-owner=StuartCohen22 \
  --branch-pattern="^main$" \
  --build-config=deployment/cloudbuild.yaml
```

## Step 8: Configure Custom Domain (Optional)

### 8.1 Map Domain to Cloud Run

```bash
# Map domain to frontend
gcloud run domain-mappings create \
  --service=dishdash-frontend \
  --domain=dishdash.app \
  --region=us-central1

# Map domain to backend API
gcloud run domain-mappings create \
  --service=dishdash-backend \
  --domain=api.dishdash.app \
  --region=us-central1
```

### 8.2 Update DNS

Add the DNS records shown by the domain mapping command to your DNS provider.

## Step 9: Monitoring & Logging

### 9.1 View Logs

```bash
# Backend logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=dishdash-backend" \
  --limit=50

# Frontend logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=dishdash-frontend" \
  --limit=50
```

### 9.2 Set Up Alerts

1. Go to Cloud Console > Monitoring > Alerting
2. Create alerts for:
   - High error rate (>5% of requests)
   - High latency (>2s p95)
   - Cloud SQL CPU usage (>80%)

## Step 10: Cost Estimation

### Estimated Monthly Costs (Low Traffic)

| Service | Configuration | Est. Cost |
|---------|---------------|-----------|
| Cloud Run (Backend) | 0-10 instances, 512MB | $0-20 |
| Cloud Run (Frontend) | 0-5 instances, 256MB | $0-10 |
| Cloud SQL | db-f1-micro, 10GB | ~$10 |
| Secret Manager | 2 secrets | <$1 |
| Container Registry | ~1GB storage | <$1 |
| **Total** | | **~$20-40/month** |

*Note: Cloud Run has a generous free tier. Costs increase with traffic.*

### Cost Optimization Tips

1. Use minimum instances = 0 during development
2. Scale down Cloud SQL instance tier if needed
3. Enable autoscaling with appropriate limits
4. Use Cloud CDN for static assets (optional)

## Troubleshooting

### Common Issues

**Container fails to start:**
```bash
# Check logs
gcloud run services logs read dishdash-backend --region=us-central1

# Common causes:
# - Missing environment variables
# - Database connection issues
# - Port mismatch (ensure app listens on $PORT)
```

**Database connection fails:**
```bash
# Verify Cloud SQL instance is running
gcloud sql instances describe dishdash-db

# Check Cloud SQL connection name is correct
# Ensure Cloud Run service has Cloud SQL client role
```

**Health check fails:**
```bash
# Test health endpoint
curl $BACKEND_URL/health

# Check application logs for startup errors
```

## Teardown Instructions

To delete all resources:

```bash
# Delete Cloud Run services
gcloud run services delete dishdash-backend --region=us-central1 --quiet
gcloud run services delete dishdash-frontend --region=us-central1 --quiet

# Delete Cloud SQL instance
gcloud sql instances delete dishdash-db --quiet

# Delete secrets
gcloud secrets delete jwt-secret --quiet
gcloud secrets delete db-password --quiet

# Delete container images
gcloud container images delete gcr.io/$PROJECT_ID/dishdash-backend --quiet
gcloud container images delete gcr.io/$PROJECT_ID/dishdash-frontend --quiet

# Delete the project (optional - removes everything)
gcloud projects delete $PROJECT_ID
```

## Security Checklist

- [ ] JWT secret stored in Secret Manager
- [ ] Database password stored in Secret Manager
- [ ] HTTPS enforced (automatic on Cloud Run)
- [ ] CORS configured for production domain only
- [ ] Cloud SQL requires SSL
- [ ] IAM roles follow least-privilege principle
- [ ] No secrets in environment variables (use Secret Manager)
- [ ] Regular dependency updates scheduled
