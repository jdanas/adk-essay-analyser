# Essay Analyzer API

A TypeScript backend API that integrates with a Python agent built using Google's ADK Python SDK for AI-powered essay analysis.

## Features

- 🤖 **AI-Powered Analysis**: Uses Gemini 2.5 Flash Preview model via Google ADK
- 📝 **Comprehensive Feedback**: Grammar, structure, content, and spelling analysis
- 🎯 **Scoring System**: Numerical scoring from 0-100
- 🔒 **Type Safety**: Full TypeScript implementation with proper error handling
- 🚀 **Fast Processing**: Efficient subprocess communication between Node.js and Python

## Architecture

### TypeScript API Layer (`src/server/api.ts`)
- Express.js REST API endpoint at `POST /api/analyze-essay`
- Handles essay text input validation and sanitization
- Spawns Python subprocess for AI analysis
- Returns structured JSON response with analysis results

### Python AI Agent (`scripts/essay_analyzer.py`)
- Uses Google ADK Python SDK with proper MCP context management
- Implements Gemini 2.5 Flash Preview model for analysis
- Returns structured JSON feedback across multiple dimensions
- Includes comprehensive error handling and fallback responses

## API Endpoints

### `POST /api/analyze-essay`

**Request Body:**
```json
{
  "text": "Your essay text here..."
}
```

**Response:**
```json
{
  "grammarFeedback": "Detailed grammar analysis...",
  "structureFeedback": "Essay structure evaluation...",
  "contentFeedback": "Content quality assessment...",
  "spellingFeedback": "Spelling and typo detection...",
  "overallScore": 85
}
```

### `GET /api/health`
Health check endpoint returning service status.

### `GET /`
Root endpoint with API documentation.

## Setup Instructions

### 1. Prerequisites
- Node.js 18+ with pnpm
- Python 3.8+
- Google AI API key

### 2. Install Dependencies

**Node.js dependencies:**
```bash
pnpm install
```

**Python dependencies:**
```bash
pip install -r requirements.txt
```

### 3. Environment Configuration

Copy the example environment file:
```bash
cp .env.example .env
```

Add your Google AI API key to `.env`:
```env
GOOGLE_API_KEY=your_api_key_here
PORT=3001
```

### 4. Start the Server

**Development mode (with auto-reload):**
```bash
pnpm run server:dev
```

**Production mode:**
```bash
pnpm run server
```

The API will be available at `http://localhost:3001`

## Usage Examples

### Using the Test Client

```typescript
import { analyzeEssay } from './src/utils/testClient';

const result = await analyzeEssay("Your essay text here");
console.log(result);
```

### Direct API Call

```typescript
const response = await fetch('http://localhost:3001/api/analyze-essay', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: 'Your essay text' })
});

const analysis = await response.json();
```

### Frontend Integration

```typescript
// Add this to your existing frontend components
export async function analyzeEssayText(text: string) {
  const response = await fetch('/api/analyze-essay', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  
  if (!response.ok) {
    throw new Error('Analysis failed');
  }
  
  return response.json();
}
```

## Error Handling

The API includes comprehensive error handling for:
- Invalid input validation
- Python subprocess failures
- JSON parsing errors
- Model response timeouts
- API key authentication issues

All errors return structured JSON responses with appropriate HTTP status codes.

## Performance Considerations

- Essay text limited to 50,000 characters
- 60-second timeout for analysis
- Subprocess isolation for reliability
- Structured logging for debugging

## Development

### Running Tests
```bash
# Test the API with sample essay
npx tsx src/utils/testClient.ts
```

### Debugging
- Check server logs for API requests
- Python script outputs to stdout/stderr
- Use `DEBUG=*` environment variable for verbose logging

## Security Notes

- Input validation prevents injection attacks
- Process isolation between Node.js and Python
- Environment variables for sensitive configuration
- CORS enabled for cross-origin requests

## Integration with Existing Frontend

To integrate with your existing React frontend:

1. Update your essay analysis component to call the new API endpoint
2. Replace existing analysis logic with API calls
3. Handle loading states and error responses
4. Display the structured feedback in your UI components

The response format matches the existing `EssayAnalysisResponse` interface in your TypeScript types.
