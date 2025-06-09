#!/bin/bash

# Docker deployment script for ADK Essay Analyzer

set -e

echo "🐳 ADK Essay Analyzer Docker Deployment"
echo "======================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from template..."
    cp .env.docker .env
    echo "📝 Please edit .env and add your GOOGLE_GENAI_API_KEY"
    echo "🔑 You can get an API key from: https://aistudio.google.com/app/apikey"
    read -p "Press Enter after updating .env file..."
fi

# Check if API key is set
if grep -q "your_google_api_key_here" .env; then
    echo "❌ Please set your GOOGLE_GENAI_API_KEY in .env file"
    exit 1
fi

echo "🏗️  Building and starting containers..."

# Build and start all services
docker-compose up --build -d

echo "⏳ Waiting for services to start..."
sleep 10

# Check service health
echo "🔍 Checking service health..."

# Check ADK API
if curl -s http://localhost:8000/health > /dev/null; then
    echo "✅ ADK API Server (port 8000) - HEALTHY"
else
    echo "❌ ADK API Server (port 8000) - NOT RESPONDING"
fi

# Check Express API
if curl -s http://localhost:3001/api/health > /dev/null; then
    echo "✅ Express API Server (port 3001) - HEALTHY"
else
    echo "❌ Express API Server (port 3001) - NOT RESPONDING"
fi

# Check Frontend
if curl -s http://localhost:5173 > /dev/null; then
    echo "✅ React Frontend (port 5173) - HEALTHY"
else
    echo "❌ React Frontend (port 5173) - NOT RESPONDING"
fi

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📍 Access your application:"
echo "   🌐 Frontend: http://localhost:5173"
echo "   🔧 Express API: http://localhost:3001"
echo "   🤖 ADK API: http://localhost:8000"
echo "   📚 API Docs: http://localhost:8000/docs"
echo ""
echo "📋 Useful commands:"
echo "   📊 View logs: docker-compose logs -f"
echo "   ⏹️  Stop: docker-compose down"
echo "   🔄 Restart: docker-compose restart"
echo "   🧹 Clean: docker-compose down -v --rmi all"

# Show live logs
echo "📊 Showing live logs (Ctrl+C to exit):"
docker-compose logs -f
