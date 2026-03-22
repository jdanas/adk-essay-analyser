#!/bin/bash

# Google Cloud Run Deployment Script for ADK Essay Analyzer
# Deploying as a single Multi-Container service

set -e

# Load environment variables from .env
if [ -f .env ]; then
    echo "🔑 Loading environment variables from .env..."
    # Export variables from .env for substitution
    export $(grep -v '^#' .env | xargs)
else
    echo "❌ .env file not found. Please create one with GOOGLE_GENAI_API_KEY."
    exit 1
fi

PROJECT_ID="adk-essay-analyser-gaa"
REGION="us-central1"
REPO_NAME="adk-repo"

if [ -z "$GOOGLE_GENAI_API_KEY" ]; then
    echo "❌ GOOGLE_GENAI_API_KEY is not set in your .env file."
    exit 1
fi

echo "🚀 Starting Google Cloud Deployment for $PROJECT_ID in $REGION"
echo "============================================================"

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

# Generate a temporary service.yaml with placeholders replaced
echo "📝 Generating temporary service.yaml..."
cp service.yaml service.tmp.yaml

# Replace TAG_PLACEHOLDER with the actual tag
sed -i '' "s/TAG_PLACEHOLDER/$TAG/g" service.tmp.yaml

# Replace GOOGLE_GENAI_API_KEY_PLACEHOLDER with the key from .env
# Using | as a delimiter in case the key contains /
sed -i '' "s|GOOGLE_GENAI_API_KEY_PLACEHOLDER|$GOOGLE_GENAI_API_KEY|g" service.tmp.yaml

# Deploy to Cloud Run using the temporary file
echo "🌩️  Deploying Multi-Container Service to Cloud Run..."
gcloud run services replace service.tmp.yaml --region $REGION

# Clean up temporary file
rm service.tmp.yaml

# Get the URL
SERVICE_URL=$(gcloud run services describe essay-analyzer --region $REGION --format='value(status.url)')

echo ""
echo "🎉 DEPLOYMENT SUCCESSFUL!"
echo "========================"
echo "📍 Your app is now live at: $SERVICE_URL"
echo ""
echo "Note: If this is the first deployment, you may need to allow public access:"
echo "gcloud run services add-iam-policy-binding essay-analyzer --region $REGION --member='allUsers' --role='roles/run.invoker'"
