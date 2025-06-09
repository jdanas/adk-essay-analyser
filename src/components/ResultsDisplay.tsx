import { AnalysisResult } from '@/types';
import { PillarCard } from './PillarCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/ui/star-rating';
import { ArrowLeft, BarChart3, FileText } from 'lucide-react';

interface ResultsDisplayProps {
  results: AnalysisResult;
  onBack: () => void;
  filename?: string;
}

export function ResultsDisplay({ results, onBack, filename }: ResultsDisplayProps) {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center gap-2 hover:bg-gray-100 rounded-xl transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Upload
        </Button>
        {filename && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FileText className="w-4 h-4" />
            {filename}
          </div>
        )}
      </div>

      {/* Overall Score Card */}
      <Card className="bg-white border border-gray-200 shadow-sm rounded-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl font-medium text-gray-900">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-gray-700" />
            </div>
            Analysis Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-3">Overall Score</p>
              <StarRating rating={results.overallScore} size="lg" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-3">Essay Length</p>
              <p className="text-2xl font-semibold text-gray-900">{results.essayLength} words</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-3">Analysis Status</p>
              <p className="text-lg font-medium text-gray-900">✓ Complete</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pillars Grid */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">
          Interdisciplinary Learning Pillars
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.pillars.map((pillar, index) => (
            <PillarCard
              key={pillar.name}
              pillar={pillar}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}