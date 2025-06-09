#!/bin/bash

# ADK Essay Analyzer Startup Script
# This script starts both the Python ADK API server and the TypeScript Express server

set -e

echo "🚀 Starting ADK Essay Analyzer servers..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}Creating Python virtual environment...${NC}"
    python3 -m venv venv
fi

# Activate virtual environment
echo -e "${YELLOW}Activating Python virtual environment...${NC}"
source venv/bin/activate

# Install Python dependencies
echo -e "${YELLOW}Installing Python dependencies...${NC}"
pip install -r requirements.txt

# Check if Node modules are installed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing Node.js dependencies...${NC}"
    pnpm install
fi

# Set environment variables if .env doesn't exist
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating .env file...${NC}"
    cat > .env << EOF
# Google AI API Key - Replace with your actual API key
GOOGLE_GENAI_API_KEY=your_api_key_here

# ADK API Server Configuration
PORT=8000
HOST=0.0.0.0

# TypeScript Server Configuration
ADK_API_URL=http://localhost:8000
EOF
    echo -e "${RED}⚠️  Please edit .env and add your GOOGLE_GENAI_API_KEY${NC}"
    echo -e "${RED}   You can get one from: https://makersuite.google.com/app/apikey${NC}"
fi

# Function to start Python ADK server
start_adk_server() {
    echo -e "${GREEN}Starting ADK API server on port 8000...${NC}"
    source venv/bin/activate
    python adk_api_server.py
}

# Function to start TypeScript server
start_ts_server() {
    echo -e "${GREEN}Starting TypeScript API server on port 3001...${NC}"
    pnpm run server:dev
}

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}Shutting down servers...${NC}"
    kill $(jobs -p) 2>/dev/null || true
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM EXIT

# Start servers in background
echo -e "${GREEN}🔥 Starting both servers...${NC}"
start_adk_server &
sleep 3  # Give ADK server time to start
start_ts_server &

echo -e "${GREEN}✅ Servers started!${NC}"
echo -e "${GREEN}📡 ADK API Server: http://localhost:8000${NC}"
echo -e "${GREEN}🌐 TypeScript API Server: http://localhost:3001${NC}"
echo -e "${GREEN}🏥 Health Check: http://localhost:3001/api/health${NC}"
echo -e "\n${YELLOW}Press Ctrl+C to stop all servers${NC}"

# Wait for background jobs
wait
