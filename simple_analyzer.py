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
Simple essay analyzer that works without ADK initially.
This will be upgraded to use ADK once dependencies are installed.
"""

import json
import sys
from typing import Dict, Any

def analyze_essay_simple(essay_text: str) -> Dict[str, Any]:
    """
    Simple essay analysis that provides basic feedback.
    This is a fallback when ADK is not available.
    """
    word_count = len(essay_text.split())
    sentence_count = essay_text.count('.') + essay_text.count('!') + essay_text.count('?')
    paragraph_count = len([p for p in essay_text.split('\n\n') if p.strip()])
    
    # Simple scoring based on length and structure
    score = 50  # Base score
    
    if word_count >= 250:
        score += 15
    elif word_count >= 150:
        score += 10
    elif word_count >= 100:
        score += 5
    
    if paragraph_count >= 3:
        score += 10
    elif paragraph_count >= 2:
        score += 5
    
    if sentence_count >= 5:
        score += 10
    
    # Cap at 100
    score = min(score, 100)
    
    return {
        "grammarFeedback": f"Your essay has {sentence_count} sentences. Consider varying sentence length and structure for better flow. Check for proper punctuation and grammar throughout.",
        "structureFeedback": f"Your essay has {paragraph_count} paragraphs and {word_count} words. Ensure you have a clear introduction, body paragraphs with supporting details, and a strong conclusion.",
        "contentFeedback": f"Your essay demonstrates engagement with the topic. Consider adding more specific examples and evidence to support your arguments. Develop your ideas more thoroughly.",
        "spellingFeedback": "Please review your essay for any spelling errors or typos. Consider using a spell-checker to catch any mistakes.",
        "overallScore": score
    }

def main():
    """Main function for command line usage."""
    if len(sys.argv) != 2:
        print(json.dumps({
            "error": "Usage: python simple_analyzer.py <essay_text>"
        }), file=sys.stderr)
        sys.exit(1)
    
    essay_text = sys.argv[1]
    
    if not essay_text.strip():
        print(json.dumps({
            "error": "Essay text cannot be empty"
        }), file=sys.stderr)
        sys.exit(1)
    
    # Analyze the essay
    result = analyze_essay_simple(essay_text)
    
    # Output the result as JSON
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()
