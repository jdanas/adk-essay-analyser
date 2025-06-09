#!/usr/bin/env python3
"""
Essay Analyzer using Google Gemini API
Analyzes essays based on writing quality, structure, and content pillars.
"""

import sys
import json
import os
from typing import Dict, Any, List
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

def initialize_gemini() -> genai.GenerativeModel:
    """Initialize Gemini model with API key"""
    try:
        api_key = os.getenv('GOOGLE_API_KEY')
        
        if not api_key:
            raise ValueError("GOOGLE_API_KEY environment variable is required")
        
        # Configure Gemini
        genai.configure(api_key=api_key)
        
        # Initialize model
        model = genai.GenerativeModel('gemini-pro')
        
        return model
        
    except Exception as e:
        print(f"Error initializing Gemini: {str(e)}", file=sys.stderr)
        raise

def analyze_essay(essay_text: str) -> Dict[str, Any]:
    """Analyze essay using Google Gemini"""
    try:
        model = initialize_gemini()
        
        # Create analysis prompt
        prompt = f"""
        You are an expert essay analyzer. Analyze the provided essay and return a JSON response with the following exact structure:
        
        {{
            "overallScore": number (0-100),
            "pillars": [
                {{
                    "name": "Structure & Organization",
                    "score": number (0-100),
                    "feedback": "detailed feedback about essay structure, paragraph organization, and logical flow",
                    "suggestions": ["specific suggestion 1", "specific suggestion 2"]
                }},
                {{
                    "name": "Content & Ideas",
                    "score": number (0-100),
                    "feedback": "detailed feedback about content quality, idea development, and argument strength",
                    "suggestions": ["specific suggestion 1", "specific suggestion 2"]
                }},
                {{
                    "name": "Language & Style",
                    "score": number (0-100),
                    "feedback": "detailed feedback about writing style, word choice, and clarity",
                    "suggestions": ["specific suggestion 1", "specific suggestion 2"]
                }},
                {{
                    "name": "Grammar & Mechanics",
                    "score": number (0-100),
                    "feedback": "detailed feedback about grammar, punctuation, and mechanical correctness",
                    "suggestions": ["specific suggestion 1", "specific suggestion 2"]
                }}
            ],
            "strengths": ["strength 1", "strength 2", "strength 3"],
            "areasForImprovement": ["improvement area 1", "improvement area 2"],
            "detailedFeedback": "comprehensive analysis with specific examples from the essay"
        }}
        
        Essay to analyze:
        {essay_text}
        
        Please provide constructive, specific feedback that helps improve writing quality. Return ONLY the JSON object, no additional text.
        """
        
        # Get response from Gemini
        response = model.generate_content(prompt)
        
        # Parse the JSON response
        try:
            # Clean up the response text (remove markdown formatting if present)
            response_text = response.text.strip()
            if response_text.startswith('```json'):
                response_text = response_text[7:]
            if response_text.endswith('```'):
                response_text = response_text[:-3]
            response_text = response_text.strip()
            
            analysis_result = json.loads(response_text)
            return analysis_result
        except json.JSONDecodeError as e:
            print(f"JSON decode error: {str(e)}", file=sys.stderr)
            print(f"Raw response: {response.text}", file=sys.stderr)
            # If the response isn't valid JSON, create a fallback response
            return create_fallback_analysis(essay_text, response.text)
            
    except Exception as e:
        print(f"Error during analysis: {str(e)}", file=sys.stderr)
        return create_error_response(str(e))

def create_fallback_analysis(essay_text: str, raw_response: str) -> Dict[str, Any]:
    """Create a fallback analysis when ADK response isn't valid JSON"""
    word_count = len(essay_text.split())
    sentence_count = essay_text.count('.') + essay_text.count('!') + essay_text.count('?')
    
    # Basic scoring based on length and structure
    structure_score = min(80, max(40, (sentence_count * 10)))
    content_score = min(85, max(50, (word_count * 0.2)))
    language_score = 70  # Default score
    grammar_score = 75   # Default score
    
    overall_score = (structure_score + content_score + language_score + grammar_score) / 4
    
    return {
        "overallScore": round(overall_score),
        "pillars": [
            {
                "name": "Structure & Organization",
                "score": structure_score,
                "feedback": "Essay structure analysis based on sentence count and organization.",
                "suggestions": ["Consider adding clearer topic sentences", "Improve paragraph transitions"]
            },
            {
                "name": "Content & Ideas",
                "score": content_score,
                "feedback": "Content evaluation based on depth and word count.",
                "suggestions": ["Expand on key ideas", "Provide more specific examples"]
            },
            {
                "name": "Language & Style",
                "score": language_score,
                "feedback": "Language use appears appropriate for the topic.",
                "suggestions": ["Vary sentence structure", "Use more precise vocabulary"]
            },
            {
                "name": "Grammar & Mechanics",
                "score": grammar_score,
                "feedback": "Grammar appears generally correct.",
                "suggestions": ["Review punctuation usage", "Check for clarity"]
            }
        ],
        "strengths": ["Clear topic focus", "Appropriate length"],
        "areasForImprovement": ["Structure enhancement", "Detail development"],
        "detailedFeedback": f"Analysis completed with basic metrics. Word count: {word_count}, Sentence count: {sentence_count}. Raw ADK response: {raw_response[:200]}..."
    }

def create_error_response(error_message: str) -> Dict[str, Any]:
    """Create an error response when analysis fails"""
    return {
        "overallScore": 0,
        "pillars": [
            {
                "name": "Structure & Organization",
                "score": 0,
                "feedback": "Analysis unavailable due to error.",
                "suggestions": ["Please try again"]
            },
            {
                "name": "Content & Ideas",
                "score": 0,
                "feedback": "Analysis unavailable due to error.",
                "suggestions": ["Please try again"]
            },
            {
                "name": "Language & Style",
                "score": 0,
                "feedback": "Analysis unavailable due to error.",
                "suggestions": ["Please try again"]
            },
            {
                "name": "Grammar & Mechanics",
                "score": 0,
                "feedback": "Analysis unavailable due to error.",
                "suggestions": ["Please try again"]
            }
        ],
        "strengths": [],
        "areasForImprovement": ["System error resolution"],
        "detailedFeedback": f"Error occurred during analysis: {error_message}"
    }

def main():
    """Main function to handle command line arguments and perform analysis"""
    if len(sys.argv) != 2:
        print("Usage: python essay_analyzer.py <essay_text>", file=sys.stderr)
        sys.exit(1)
    
    essay_text = sys.argv[1]
    
    if not essay_text or len(essay_text.strip()) == 0:
        print(json.dumps(create_error_response("Empty essay text provided")))
        sys.exit(1)
    
    try:
        result = analyze_essay(essay_text)
        print(json.dumps(result, indent=2))
    except Exception as e:
        error_result = create_error_response(str(e))
        print(json.dumps(error_result, indent=2))
        sys.exit(1)

if __name__ == "__main__":
    main()
