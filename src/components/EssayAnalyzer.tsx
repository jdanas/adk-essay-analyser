import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { EssayAnalysisResponse } from '@/types';

interface EssayAnalyzerProps {
  essayText: string;
  onAnalysisComplete: (result: EssayAnalysisResponse) => void;
}

export function EssayAnalyzer({ essayText, onAnalysisComplete }: EssayAnalyzerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAnalysis, setLastAnalysis] = useState<EssayAnalysisResponse | null>(null);

  const analyzeEssay = async () => {
    if (!essayText || essayText.trim().length === 0) {
      setError('Please provide essay text to analyze');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-essay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: essayText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json() as EssayAnalysisResponse;
      setLastAnalysis(result);
      onAnalysisComplete(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed';
      setError(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>AI Essay Analysis</span>
          {lastAnalysis && <CheckCircle className="h-5 w-5 text-green-500" />}
        </CardTitle>
        <CardDescription>
          Analyze your essay with AI-powered feedback using Google's Gemini model
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Essay length: {essayText.length.toLocaleString()} characters
          </div>
          <Button 
            onClick={analyzeEssay} 
            disabled={isAnalyzing || !essayText.trim()}
            className="min-w-[120px]"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Essay'
            )}
          </Button>
        </div>

        {lastAnalysis && (
          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Analysis Complete</h4>
              <div className="text-2xl font-bold text-primary">
                {lastAnalysis.overallScore}/100
              </div>
            </div>
            
            <div className="grid gap-3">
              <div className="space-y-1">
                <h5 className="text-sm font-medium text-green-700">Grammar Feedback</h5>
                <p className="text-sm text-muted-foreground">{lastAnalysis.grammarFeedback}</p>
              </div>
              
              <div className="space-y-1">
                <h5 className="text-sm font-medium text-blue-700">Structure Feedback</h5>
                <p className="text-sm text-muted-foreground">{lastAnalysis.structureFeedback}</p>
              </div>
              
              <div className="space-y-1">
                <h5 className="text-sm font-medium text-purple-700">Content Feedback</h5>
                <p className="text-sm text-muted-foreground">{lastAnalysis.contentFeedback}</p>
              </div>
              
              <div className="space-y-1">
                <h5 className="text-sm font-medium text-orange-700">Spelling Feedback</h5>
                <p className="text-sm text-muted-foreground">{lastAnalysis.spellingFeedback}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
