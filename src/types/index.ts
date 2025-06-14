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
  source: "upload" | "paste";
  filename?: string;
}

export interface EssayAnalysisResponse {
  grammarFeedback: string;
  grammarRating: number;
  structureFeedback: string;
  structureRating: number;
  contentFeedback: string;
  contentRating: number;
  spellingFeedback: string;
  spellingRating: number;
  overallScore: number;
}
