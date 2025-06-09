# 🐳 Docker Deployment Guide

This guide helps you deploy the ADK Essay Analyzer using Docker for a complete containerized solution.

## 📋 Prerequisites

- **Docker** and **Docker Compose** installed
- **Google Gemini API Key** (get from [Google AI Studio](https://aistudio.google.com/app/apikey))

## 🚀 Quick Start

### 1. Clone and Setup

```bash
git clone <your-repo>
cd adk-essay-analyser
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.docker .env

# Edit .env and add your API key
echo "GOOGLE_GENAI_API_KEY=your_actual_api_key_here" > .env
```

### 3. Deploy with Docker

```bash
# Make deployment script executable
chmod +x docker-deploy.sh

# Run the automated deployment
./docker-deploy.sh
```

## 🏗️ Manual Deployment

If you prefer manual control:

```bash
# Build and start all services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🌐 Access Points

Once deployed, access your application at:

- **Frontend**: http://localhost:5173
- **Express API**: http://localhost:3001
- **ADK API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🔧 Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │   Express API   │    │    ADK API      │
│   (Frontend)    │────│   (Proxy)       │────│   (Python)      │
│   Port: 5173    │    │   Port: 3001    │    │   Port: 8000    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Services:

1. **Frontend** (`frontend` service)

   - React app with Vite dev server
   - Hot reload enabled for development
   - Port: 5173

2. **Express API** (`api-server` service)

   - TypeScript Express.js proxy server
   - Handles CORS and request routing
   - Port: 3001

3. **ADK API** (`adk-api` service)
   - Python FastAPI server with ADK agents
   - Google Gemini integration
   - Port: 8000

## 🐛 Troubleshooting

### Common Issues

**1. Port Already in Use**

```bash
# Check what's using the ports
lsof -i :5173
lsof -i :3001
lsof -i :8000

# Kill processes if needed
docker-compose down
```

**2. API Key Issues**

```bash
# Check if API key is set
docker-compose logs adk-api | grep -i "api key\|auth"
```

**3. Service Health Checks**

```bash
# Check individual service health
curl http://localhost:8000/health  # ADK API
curl http://localhost:3001/api/health  # Express API
curl http://localhost:5173  # Frontend
```

**4. View Detailed Logs**

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f adk-api
docker-compose logs -f api-server
docker-compose logs -f frontend
```

### Reset Everything

```bash
# Complete reset (removes all containers, volumes, and images)
docker-compose down -v --rmi all
docker system prune -a -f
```

## 🔄 Development Workflow

### Making Changes

**Frontend Changes:**

- Files are mounted as volumes
- Changes auto-reload in development

**Backend Changes:**

```bash
# Rebuild specific service
docker-compose up --build adk-api -d
docker-compose up --build api-server -d
```

### Testing

```bash
# Test complete flow
curl -X POST http://localhost:3001/api/analyze-essay \
  -H "Content-Type: application/json" \
  -d '{"text": "Technology has changed the world..."}'
```

## 📊 Monitoring

### Resource Usage

```bash
# Check container stats
docker stats

# Check service status
docker-compose ps
```

### Performance

```bash
# Check container resource usage
docker-compose top
```

## 🔒 Production Considerations

For production deployment:

1. **Environment Variables**

   - Use Docker secrets for API keys
   - Set proper CORS origins
   - Configure logging levels

2. **Networking**

   - Use reverse proxy (nginx)
   - Enable HTTPS
   - Restrict port access

3. **Scaling**

   - Use Docker Swarm or Kubernetes
   - Add load balancing
   - Implement health checks

4. **Security**
   - Scan images for vulnerabilities
   - Use non-root users
   - Update dependencies regularly

## 📚 Additional Commands

```bash
# View environment variables
docker-compose config

# Execute commands in containers
docker-compose exec adk-api python --version
docker-compose exec frontend npm list

# Update dependencies
docker-compose exec frontend pnpm update
docker-compose exec adk-api pip install --upgrade -r requirements.txt
```
