export interface PillarScore {
  name: string;
  score: number;
  description: string;
}

export interface AnalysisResult {
  pillars: PillarScore[];
  overallScore: number;
  essayLength: number;
}

export interface EssayData {
  content: string;
  source: 'upload' | 'paste';
  filename?: string;
}