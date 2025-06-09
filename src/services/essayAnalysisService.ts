/**
 * Essay Analysis Service
 * Service for integrating with the Essay Analyzer API
 */

import { EssayAnalysisResponse } from '../types';

interface ApiErrorResponse {
  error: string;
  details?: string;
}

export class EssayAnalysisService {
  private readonly baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3001') {
    this.baseUrl = baseUrl;
  }

  /**
   * Analyzes essay text using the Python ADK agent
   */
  async analyzeEssay(text: string): Promise<EssayAnalysisResponse> {
    if (!text || text.trim().length === 0) {
      throw new Error('Essay text is required');
    }

    if (text.length > 50000) {
      throw new Error('Essay text is too long (maximum 50,000 characters)');
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/analyze-essay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json() as ApiErrorResponse;
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json() as EssayAnalysisResponse;
      
      // Validate response structure
      this.validateAnalysisResponse(result);
      
      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error occurred during essay analysis');
    }
  }

  /**
   * Checks if the API server is healthy
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/health`, {
        method: 'GET',
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Validates the analysis response structure
   */
  private validateAnalysisResponse(response: unknown): asserts response is EssayAnalysisResponse {
    if (!response || typeof response !== 'object') {
      throw new Error('Invalid response: response must be an object');
    }

    const obj = response as Record<string, unknown>;
    const requiredFields = ['grammarFeedback', 'structureFeedback', 'contentFeedback', 'spellingFeedback', 'overallScore'];
    
    for (const field of requiredFields) {
      if (!(field in obj)) {
        throw new Error(`Invalid response: missing field ${field}`);
      }
    }

    if (typeof obj.overallScore !== 'number') {
      throw new Error('Invalid response: overallScore must be a number');
    }

    if (obj.overallScore < 0 || obj.overallScore > 100) {
      throw new Error('Invalid response: overallScore must be between 0 and 100');
    }
  }
}

// Create a singleton instance for easy use
export const essayAnalysisService = new EssayAnalysisService();

/**
 * React Hook for essay analysis
 */
export function useEssayAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeEssay = async (text: string): Promise<EssayAnalysisResponse | null> => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await essayAnalysisService.analyzeEssay(text);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed';
      setError(errorMessage);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    analyzeEssay,
    isAnalyzing,
    error,
  };
}

// Add React import for the hook
import { useState } from 'react';
