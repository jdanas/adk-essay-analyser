#!/bin/bash

# Google Cloud Run Deployment Script for ADK Essay Analyzer
# Deploying as a single Multi-Container service

set -e

PROJECT_ID="adk-essay-analyser-gaa"
REGION="us-central1"
REPO_NAME="adk-repo"

echo "🚀 Starting Google Cloud Deployment for $PROJECT_ID in $REGION"
echo "============================================================"

# Check for gcloud
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI not found. Please install it and authenticate first."
    exit 1
fi

# Set project
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "📡 Enabling Google Cloud APIs..."
gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com

# Create Artifact Registry if it doesn't exist
echo "📦 Creating Artifact Registry repository..."
gcloud artifacts repositories create $REPO_NAME \
    --repository-format=docker \
    --location=$REGION \
    --description="Docker repository for ADK Essay Analyzer" \
    --quiet || echo "Repository already exists"

# Wait a moment for the registry to be fully ready
echo "⏳ Waiting for Artifact Registry to initialize..."
sleep 5

# Configure Docker to use gcloud as a credential helper
echo "🔐 Configuring Docker authentication..."
gcloud auth configure-docker $REGION-docker.pkg.dev --quiet

# Build and Push images
echo "🏗️  Building and Pushing Frontend..."
docker build --platform linux/amd64 -t $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/frontend:latest -f Dockerfile.frontend .
docker push $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/frontend:latest

echo "🏗️  Building and Pushing Node API..."
docker build --platform linux/amd64 -t $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/api-server:latest -f Dockerfile.api .
docker push $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/api-server:latest

echo "🏗️  Building and Pushing ADK Python API..."
docker build --platform linux/amd64 -t $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/adk-api:latest -f Dockerfile.adk .
docker push $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/adk-api:latest

# Deploy to Cloud Run
echo "🌩️  Deploying Multi-Container Service to Cloud Run..."
gcloud run services replace service.yaml --region $REGION

# Get the URL
SERVICE_URL=$(gcloud run services describe essay-analyzer --region $REGION --format='value(status.url)')

echo ""
echo "🎉 DEPLOYMENT SUCCESSFUL!"
echo "========================"
echo "📍 Your app is now live at: $SERVICE_URL"
echo ""
echo "Note: If this is the first deployment, you may need to allow public access:"
echo "gcloud run services add-iam-policy-binding essay-analyzer --region $REGION --member='allUsers' --role='roles/run.invoker'"
