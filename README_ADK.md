# ADK Essay Analyzer

A comprehensive essay analysis tool built with Google ADK (Agent Development Kit) and TypeScript/React frontend.

## Overview

This application provides detailed essay analysis using specialized AI agents that evaluate:

- **Grammar & Language Mechanics**: Sentence structure, punctuation, word choice
- **Structure & Organization**: Essay flow, transitions, paragraph development  
- **Content & Argumentation**: Argument quality, evidence usage, critical thinking
- **Spelling & Mechanics**: Spelling errors, formatting consistency

## Architecture

The system follows the Google ADK pattern with:

1. **Python ADK API Server** (`adk_api_server.py`): Serves specialized analysis agents
2. **TypeScript API Server** (`src/server/api.ts`): Express.js server that interfaces with ADK
3. **React Frontend** (`src/`): Modern web interface built with Vite + React + Tailwind CSS

## Quick Start

### Prerequisites

- Python 3.9+
- Node.js 18+
- pnpm package manager
- Google Generative AI API key

### Setup

1. **Clone and setup the project:**
```bash
git clone <your-repo>
cd adk-essay-analyser
./setup.sh
```

2. **Configure environment:**
```bash
# Edit .env and add your API key
cp .env.example .env
# Add your GOOGLE_GENAI_API_KEY to .env
```

3. **Start both servers:**
```bash
./start_servers.sh
```

Or start them individually:

```bash
# Terminal 1: ADK API Server
source venv/bin/activate
python adk_api_server.py

# Terminal 2: TypeScript API Server  
pnpm run server:dev

# Terminal 3: Frontend (optional)
pnpm run dev
```

## API Endpoints

### ADK API Server (Port 8000)
- `POST /analyze` - Analyze essay using ADK agents
- `GET /health` - Health check
- `GET /docs` - FastAPI documentation

### TypeScript API Server (Port 3001)
- `POST /api/analyze-essay` - Proxy to ADK server
- `GET /api/health` - Health check

## Agent Structure

Following the ADK academic research pattern:

```
essay_analyzer/
├── agent.py              # Root coordinator agent
├── prompt.py             # System prompts
└── sub_agents/
    ├── grammar_analyzer.py    # Grammar specialist
    ├── structure_analyzer.py  # Structure specialist  
    └── content_analyzer.py    # Content specialist
```

## Development

### Python Dependencies
```bash
source venv/bin/activate
pip install -r requirements.txt
```

### Node.js Dependencies
```bash
pnpm install
```

### Testing the CLI
```bash
source venv/bin/activate
python adk_essay_cli.py "Your essay text here"
```

### Running Tests
```bash
# Python tests (when available)
source venv/bin/activate
pytest

# TypeScript tests
pnpm test
```

## Configuration

### Environment Variables

- `GOOGLE_GENAI_API_KEY`: Your Google Generative AI API key
- `PORT`: API server port (default: 8000 for ADK, 3001 for TypeScript)
- `HOST`: Server host (default: 0.0.0.0)
- `ADK_API_URL`: URL of ADK server for TypeScript server

### Model Configuration

The agents use `gemini-2.5-flash-preview-05-20` by default. You can modify this in:
- `essay_analyzer/agent.py`
- `essay_analyzer/sub_agents/*.py`

## Deployment

### Local Development
Use the provided startup scripts for local development.

### Production
For production deployment, follow the ADK deployment patterns:

1. Use the `deployment/deploy.py` script for Google Cloud
2. Configure appropriate environment variables
3. Set up proper authentication

## Troubleshooting

### Common Issues

1. **Import errors**: Ensure all dependencies are installed via `pip install -r requirements.txt`
2. **ADK server not starting**: Check your `GOOGLE_GENAI_API_KEY` is set correctly
3. **TypeScript errors**: Run `pnpm install` to ensure all packages are installed
4. **Connection refused**: Make sure the ADK server is running before starting the TypeScript server

### Logs

- ADK server logs appear in the terminal where you run `python adk_api_server.py`
- TypeScript server logs appear in the terminal where you run `pnpm run server:dev`
- Frontend logs appear in browser developer tools

## Contributing

1. Follow the Google ADK patterns for agent development
2. Use TypeScript for the API server
3. Follow React best practices for frontend components
4. Add appropriate error handling and logging

## License

Copyright 2025 Google LLC - Licensed under the Apache License, Version 2.0
