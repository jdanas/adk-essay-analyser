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
ADK Essay Analyzer CLI

Command-line interface for the ADK essay analysis agents.
"""

import asyncio
import json
import sys
from pathlib import Path

# Add the project root to the path so we can import our modules
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

try:
    from google.adk.runners import InMemoryRunner
    from google.genai import types
    from dotenv import load_dotenv
    from essay_analyzer.agent import root_agent
except ImportError as e:
    print(f"Error importing required modules: {e}")
    print("Please ensure all dependencies are installed:")
    print("pip install -r requirements.txt")
    sys.exit(1)

# Load environment variables
load_dotenv()

async def analyze_essay_cli(essay_text: str) -> dict:
    """
    Analyze essay using the ADK agent and return results.
    
    Args:
        essay_text: The essay text to analyze
        
    Returns:
        Dictionary containing the analysis results
    """
    try:
        # Create runner for the agent
        runner = InMemoryRunner(
            agent=root_agent,
            app_name="essay_analyzer_cli"
        )
        
        # Create a session
        session = await runner.session_service.create_session(
            app_name="essay_analyzer_cli",
            user_id="cli_user"
        )
        
        # Prepare content for analysis
        content = types.Content(
            role='user',
            parts=[types.Part.from_text(text=f"Please analyze this essay:\n\n{essay_text}")]
        )
        
        # Run the analysis
        response_text = ""
        async for event in runner.run_async(
            user_id="cli_user",
            session_id=session.id,
            new_message=content,
        ):
            if event.content.parts and event.content.parts[0].text:
                response_text += event.content.parts[0].text
        
        # Parse the response
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
                    result[field] = f"No {field.replace('Feedback', '').lower()} feedback available"
            
            # Ensure overallScore is a number
            if not isinstance(result.get("overallScore"), (int, float)):
                result["overallScore"] = 50
            
            return result
            
        except json.JSONDecodeError:
            # If we can't parse JSON, return the raw response with structure
            return {
                "grammarFeedback": "Analysis completed but response format needs adjustment",
                "structureFeedback": "Analysis completed but response format needs adjustment", 
                "contentFeedback": "Analysis completed but response format needs adjustment",
                "spellingFeedback": "Analysis completed but response format needs adjustment",
                "overallScore": 75,
                "rawResponse": response_text
            }
    
    except Exception as e:
        return {
            "grammarFeedback": f"Error during analysis: {str(e)}",
            "structureFeedback": "Analysis could not be completed",
            "contentFeedback": "Analysis could not be completed", 
            "spellingFeedback": "Analysis could not be completed",
            "overallScore": 0,
            "error": str(e)
        }

async def main():
    """Main CLI function."""
    if len(sys.argv) != 2:
        print(json.dumps({
            "error": "Usage: python adk_essay_cli.py <essay_text>"
        }), file=sys.stderr)
        sys.exit(1)
    
    essay_text = sys.argv[1]
    
    if not essay_text.strip():
        print(json.dumps({
            "error": "Essay text cannot be empty"
        }), file=sys.stderr)
        sys.exit(1)
    
    # Analyze the essay
    result = await analyze_essay_cli(essay_text)
    
    # Output the result as JSON
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    asyncio.run(main())
