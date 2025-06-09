#!/usr/bin/env python3
# Copyright 2025 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""
ADK Essay Analyzer API Server

This module provides a FastAPI server that serves the ADK essay analysis agents.
It follows the ADK pattern for deploying agents as web services.
"""

import asyncio
import json
import logging
import os
from typing import Any, Dict, Optional

import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google.adk.runners import InMemoryRunner
from google.genai import types
from pydantic import BaseModel

from essay_analyzer.agent import root_agent

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# FastAPI app initialization
app = FastAPI(
    title="ADK Essay Analyzer API",
    description="Comprehensive essay analysis using Google ADK agents",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response models
class EssayAnalysisRequest(BaseModel):
    text: str
    user_id: Optional[str] = "anonymous"

class EssayAnalysisResponse(BaseModel):
    grammarFeedback: str
    structureFeedback: str
    contentFeedback: str
    spellingFeedback: str
    overallScore: int
    session_id: Optional[str] = None

class HealthResponse(BaseModel):
    status: str
    service: str
    version: str

# Global runner instance
runner: Optional[InMemoryRunner] = None

async def initialize_runner():
    """Initialize the ADK runner with the essay analyzer agent."""
    global runner
    try:
        runner = InMemoryRunner(
            agent=root_agent,
            app_name="essay_analyzer_api"
        )
        logger.info("ADK runner initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize ADK runner: {e}")
        raise

@app.on_event("startup")
async def startup_event():
    """Initialize the application on startup."""
    logger.info("Starting ADK Essay Analyzer API...")
    await initialize_runner()
    logger.info("ADK Essay Analyzer API started successfully")

@app.on_event("shutdown")
async def shutdown_event():
    """Clean up resources on shutdown."""
    logger.info("Shutting down ADK Essay Analyzer API...")
    # Add any cleanup logic here
    logger.info("ADK Essay Analyzer API shut down successfully")

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    return HealthResponse(
        status="healthy",
        service="adk-essay-analyzer",
        version="1.0.0"
    )

@app.post("/analyze", response_model=EssayAnalysisResponse)
async def analyze_essay(request: EssayAnalysisRequest):
    """
    Analyze an essay using the ADK essay analysis agents.
    
    Args:
        request: EssayAnalysisRequest containing the essay text and optional user_id
        
    Returns:
        EssayAnalysisResponse with detailed analysis feedback
    """
    if not runner:
        raise HTTPException(status_code=503, detail="ADK runner not initialized")
    
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Essay text cannot be empty")
    
    try:
        # Create a session for this analysis
        session = await runner.session_service.create_session(
            app_name="essay_analyzer_api",
            user_id=request.user_id
        )
        
        logger.info(f"Created session {session.id} for user {request.user_id}")
        
        # Prepare the content for analysis
        content = types.Content(
            role='user',
            parts=[types.Part.from_text(text=f"Please analyze this essay:\n\n{request.text}")]
        )
        
        # Run the analysis
        response_text = ""
        async for event in runner.run_async(
            user_id=request.user_id,
            session_id=session.id,
            new_message=content,
        ):
            if event.content.parts and event.content.parts[0].text:
                response_text += event.content.parts[0].text
        
        # Parse the response
        analysis_result = parse_analysis_response(response_text)
        analysis_result["session_id"] = session.id
        
        logger.info(f"Analysis completed for session {session.id}")
        return EssayAnalysisResponse(**analysis_result)
        
    except Exception as e:
        logger.error(f"Error during essay analysis: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

def parse_analysis_response(response_text: str) -> Dict[str, Any]:
    """
    Parse the response from the ADK agent into the expected format.
    
    Args:
        response_text: Raw response text from the agent
        
    Returns:
        Dictionary with parsed analysis results
    """
    try:
        # Clean up the response to extract JSON
        cleaned_response = response_text.strip()
        if cleaned_response.startswith('```json'):
            cleaned_response = cleaned_response[7:]
        if cleaned_response.endswith('```'):
            cleaned_response = cleaned_response[:-3]
        cleaned_response = cleaned_response.strip()
        
        result = json.loads(cleaned_response)
        
        # Validate required fields
        required_fields = ["grammarFeedback", "structureFeedback", "contentFeedback", "spellingFeedback", "overallScore"]
        for field in required_fields:
            if field not in result:
                raise ValueError(f"Missing required field: {field}")
        
        # Ensure overallScore is a number
        if not isinstance(result["overallScore"], (int, float)):
            result["overallScore"] = 50
        
        # Ensure it's an integer for the response model
        result["overallScore"] = int(result["overallScore"])
        
        return result
        
    except (json.JSONDecodeError, ValueError) as e:
        logger.warning(f"Failed to parse analysis response: {e}")
        # Fallback response if JSON parsing fails
        return {
            "grammarFeedback": "Unable to parse detailed grammar feedback from analysis.",
            "structureFeedback": "Unable to parse detailed structure feedback from analysis.",
            "contentFeedback": "Unable to parse detailed content feedback from analysis.",
            "spellingFeedback": "Unable to parse detailed spelling feedback from analysis.",
            "overallScore": 50
        }

@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "ADK Essay Analyzer API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    # Run the server
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    
    logger.info(f"Starting server on {host}:{port}")
    uvicorn.run(
        "adk_api_server:app",
        host=host,
        port=port,
        reload=True,
        log_level="info"
    )
