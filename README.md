# Essay Analyzer with Google ADK Integration

## Overview

This project implements a complete essay analysis system that combines:

- **TypeScript/Node.js API** for the backend service
- **Python agent** using Google's ADK Python SDK with Gemini 2.5 Flash Preview
- **React frontend** components for seamless integration
- **Model Context Protocol (MCP)** for robust AI agent execution
- **Docker containerization** for easy deployment and development

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React Client  │───▶│  TypeScript API  │───▶│  Python Agent  │
│                 │    │   (Fast API)   │    │  (Google ADK)   │
│  - EssayAnalyzer│    │  - Input validation│    │  - MCP Context  │
│  - UI Components│    │  - Process mgmt  │    │  - Gemini Model │
│  - State mgmt   │    │  - Error handling│    │  - JSON Response│
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Option 1: Docker Deployment (Recommended)

The easiest way to get everything running:

```bash
# Quick deployment with npm scripts
pnpm run docker:deploy

# OR manual Docker commands
pnpm run docker:setup  # Copy environment file
pnpm run docker:up     # Start all services
```

**Access your application:**

- **Frontend**: http://localhost:5173
- **Express API**: http://localhost:3001
- **ADK API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### Option 2: Development Setup

For local development without Docker:

1. **Run the setup script:**

   ```bash
   ./setup.sh
   ```

2. **Configure your Google API key:**

   ```bash
   # Edit the .env file
   GOOGLE_API_KEY=your_actual_api_key_here
   ```

3. **Start the API server:**
   ```bash
   pnpm run server:dev
   ```

### Manual Setup

1. **Install dependencies:**

   ```bash
   # Node.js dependencies
   pnpm install

   # Python dependencies
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

2. **Environment configuration:**

   ```bash
   cp .env.example .env
   # Edit .env with your Google API key
   ```

3. **Start services:**

   ```bash
   # API server (development)
   pnpm run server:dev

   # Frontend (if running separately)
   pnpm run dev
   ```

## API Documentation

### Endpoint: `POST /api/analyze-essay`

**Request:**

```json
{
  "text": "Your essay text here..."
}
```

**Response:**

```json
{
  "grammarFeedback": "Detailed grammar analysis and suggestions...",
  "structureFeedback": "Essay structure evaluation and recommendations...",
  "contentFeedback": "Content quality assessment and improvements...",
  "spellingFeedback": "Spelling and typo detection with corrections...",
  "overallScore": 85
}
```

**Error Response:**

```json
{
  "error": "Error description",
  "details": "Additional error information"
}
```

### Health Check: `GET /api/health`

Returns service status and basic information.

## Frontend Integration

### Using the EssayAnalyzer Component

```tsx
import { EssayAnalyzer } from "@/components/EssayAnalyzer";
import { EssayAnalysisResponse } from "@/types";

function MyComponent() {
  const [essayText, setEssayText] = useState("");

  const handleAnalysisComplete = (result: EssayAnalysisResponse) => {
    console.log("Analysis completed:", result);
    // Handle the analysis results
  };

  return (
    <EssayAnalyzer
      essayText={essayText}
      onAnalysisComplete={handleAnalysisComplete}
    />
  );
}
```

### Custom Integration

```tsx
import { essayAnalysisService } from "@/services/essayAnalysisService";

// Direct service usage
const result = await essayAnalysisService.analyzeEssay(essayText);

// With React hook
const { analyzeEssay, isAnalyzing, error } = useEssayAnalysis();
const result = await analyzeEssay(essayText);
```

## File Structure

```
📁 essay-analyser/
├── 📄 package.json              # Node.js dependencies and scripts
├── 📄 requirements.txt          # Python dependencies
├── 📄 setup.sh                  # Automated setup script
├── 📄 .env.example              # Environment template
├── 📄 API_README.md             # Detailed API documentation
│
├── 📁 src/
│   ├── 📁 server/
│   │   └── 📄 api.ts             # Express.js API server
│   ├── 📁 services/
│   │   └── 📄 essayAnalysisService.ts  # Frontend service layer
│   ├── 📁 components/
│   │   └── 📄 EssayAnalyzer.tsx  # React component
│   ├── 📁 types/
│   │   └── 📄 index.ts           # TypeScript interfaces
│   └── 📁 utils/
│       └── 📄 testClient.ts      # API testing utilities
│
└── 📁 scripts/
    └── 📄 essay_analyzer.py      # Python ADK agent
```

## Configuration

### Environment Variables

| Variable         | Description                         | Required |
| ---------------- | ----------------------------------- | -------- |
| `GOOGLE_API_KEY` | Google AI API key for Gemini access | ✅       |
| `PORT`           | API server port (default: 3001)     | ❌       |

### Python Dependencies

- `google-adk>=1.2.1` - Google's Agent Development Kit
- `python-dotenv>=1.0.0` - Environment variable management

### Node.js Dependencies

- `express` - Web framework
- `cors` - Cross-origin resource sharing
- `tsx` - TypeScript execution
- React ecosystem (already in your project)

## Testing

### Test the Python Script

```bash
source venv/bin/activate
python scripts/essay_analyzer.py "Your test essay text here"
```

### Test the API

```bash
# Health check
curl http://localhost:3001/api/health

# Essay analysis
curl -X POST http://localhost:3001/api/analyze-essay \
  -H "Content-Type: application/json" \
  -d '{"text": "Your essay text here"}'
```

### Using the Test Client

```bash
npx tsx src/utils/testClient.ts
```

## Performance Considerations

- **Essay length limit**: 50,000 characters
- **Analysis timeout**: 60 seconds
- **Process isolation**: Separate Python subprocess for reliability
- **Memory management**: Automatic cleanup of completed processes
- **Error recovery**: Fallback responses for failed analyses

## Security Features

- **Input validation**: Prevents injection attacks
- **Process sandboxing**: Isolated Python execution
- **Environment variables**: Secure API key management
- **CORS configuration**: Controlled cross-origin access
- **Request size limits**: 10MB JSON payload limit

## Troubleshooting

### Common Issues

1. **"Import google.adk could not be resolved"**

   - Ensure virtual environment is activated
   - Run `pip install google-adk python-dotenv`

2. **"Python process exited with code 1"**

   - Check your Google API key in `.env`
   - Verify virtual environment setup
   - Check Python script permissions

3. **"CORS error" in browser**

   - Ensure API server is running on port 3001
   - Check CORS configuration in `api.ts`

4. **"Module not found" TypeScript errors**
   - Run `pnpm install` to install dependencies
   - Check import paths in TypeScript files

### Debug Mode

Enable debug logging:

```bash
DEBUG=* pnpm run server:dev
```

### Logs Location

- **API server logs**: Console output
- **Python agent logs**: Subprocess stderr
- **Frontend logs**: Browser developer console

## Production Deployment

### Build for Production

```bash
# Build TypeScript
pnpm run build:server

# Start production server
pnpm run start:server
```

### Environment Setup

1. Set production environment variables
2. Configure proper Python path in API server
3. Set up process monitoring (PM2, systemd, etc.)
4. Configure reverse proxy (nginx, Apache)
5. Set up SSL certificates

### Scaling Considerations

- **Horizontal scaling**: Multiple API server instances
- **Load balancing**: Distribute essay analysis requests
- **Caching**: Cache analysis results for identical essays
- **Rate limiting**: Prevent API abuse
- **Monitoring**: Track performance and errors

## 🐳 Docker Management

We've included comprehensive Docker support with npm scripts for easy management:

### Docker Commands

| Command                   | Description                                 |
| ------------------------- | ------------------------------------------- |
| `pnpm run docker:setup`   | Copy environment file and setup permissions |
| `pnpm run docker:deploy`  | Run the full automated deployment script    |
| `pnpm run docker:up`      | Start all services with Docker Compose      |
| `pnpm run docker:down`    | Stop all Docker services                    |
| `pnpm run docker:logs`    | View live logs from all services            |
| `pnpm run docker:restart` | Restart all services                        |
| `pnpm run docker:ps`      | Show status of all containers               |
| `pnpm run docker:health`  | Check health of all services                |
| `pnpm run docker:clean`   | Remove all containers, volumes, and images  |

### Docker Services

The application runs as three containerized services:

1. **Frontend** (React + Vite) - Port 5173
2. **API Server** (Express.js) - Port 3001
3. **ADK API** (Python + FastAPI) - Port 8000

### Environment Configuration

```bash
# Copy the Docker environment template
cp .env.docker .env

# Edit with your API key
GOOGLE_GENAI_API_KEY=your_actual_api_key_here
```

### Development with Docker

```bash
# Start everything for development
pnpm run docker:up

# Watch logs in real-time
pnpm run docker:logs

# Make changes to frontend (auto-reloads)
# Frontend files are mounted as volumes

# Restart specific services after backend changes
docker-compose restart adk-api
docker-compose restart api-server
```

### Production Deployment

```bash
# Full production deployment
pnpm run docker:deploy

# Check service health
pnpm run docker:health

# Monitor with logs
pnpm run docker:logs
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Follow TypeScript and Python best practices
4. Add tests for new functionality
5. Update documentation
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Need help?** Check the troubleshooting section or create an issue in the repository.
