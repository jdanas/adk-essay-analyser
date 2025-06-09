#!/bin/bash

# Essay Analyzer API Setup Script
# This script sets up and starts the essay analyzer system

set -e

echo "🚀 Essay Analyzer API Setup"
echo "============================="

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install Python dependencies
echo "📚 Installing Python dependencies..."
pip install -r requirements.txt

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found. Creating from template..."
    cp .env.example .env
    echo "🔑 Please edit .env file and add your GOOGLE_API_KEY"
    echo "   Get your API key from: https://ai.google.dev/"
    exit 1
fi

# Check if GOOGLE_API_KEY is set
if grep -q "your_google_api_key_here" .env; then
    echo "🔑 Please set your GOOGLE_API_KEY in the .env file"
    echo "   Get your API key from: https://ai.google.dev/"
    exit 1
fi

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
pnpm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎯 Available commands:"
echo "   pnpm run server:dev  - Start API server in development mode"
echo "   pnpm run server      - Start API server in production mode"
echo "   pnpm run dev         - Start frontend development server"
echo ""
echo "🌐 API will be available at: http://localhost:3001"
echo "📊 Health check endpoint: http://localhost:3001/api/health"
echo "📝 Essay analysis endpoint: POST http://localhost:3001/api/analyze-essay"
echo ""
echo "💡 To test the Python script directly:"
echo "   source venv/bin/activate"
echo "   python scripts/essay_analyzer.py \"Your essay text here\""
