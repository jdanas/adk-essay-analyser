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

# Generate a unique tag based on timestamp
TAG=$(date +%Y%m%d%H%M%S)

# Build and Push images using buildx with unique tags
echo "🏗️  Building and Pushing Frontend (Tag: $TAG)..."
docker buildx build --platform linux/amd64 --provenance=false --push -t $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/frontend:$TAG -f Dockerfile.frontend .

echo "🏗️  Building and Pushing Node API (Tag: $TAG)..."
docker buildx build --platform linux/amd64 --provenance=false --push -t $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/api-server:$TAG -f Dockerfile.api .

echo "🏗️  Building and Pushing ADK Python API (Tag: $TAG)..."
docker buildx build --platform linux/amd64 --provenance=false --push -t $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/adk-api:$TAG -f Dockerfile.adk .

# Update service.yaml with the new tags
sed -i '' "s|frontend:.*|frontend:$TAG|g" service.yaml
sed -i '' "s|api-server:.*|api-server:$TAG|g" service.yaml
sed -i '' "s|adk-api:.*|adk-api:$TAG|g" service.yaml

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
