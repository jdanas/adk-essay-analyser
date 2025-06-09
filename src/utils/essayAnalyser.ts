import { AnalysisResult, PillarScore } from '@/types';

const PILLARS = [
  {
    name: 'Critical Thinking',
    description: 'Ability to analyze information objectively and make reasoned judgments'
  },
  {
    name: 'Communication',
    description: 'Clarity of expression and effective conveyance of ideas'
  },
  {
    name: 'Collaboration',
    description: 'Integration of diverse perspectives and interdisciplinary connections'
  },
  {
    name: 'Creativity',
    description: 'Original thinking and innovative approaches to problem-solving'
  },
  {
    name: 'Global Perspective',
    description: 'Understanding of global contexts and cultural awareness'
  }
];

export function analyzeEssay(content: string): AnalysisResult {
  // Simulate analysis with realistic scoring based on essay characteristics
  const wordCount = content.split(/\s+/).length;
  const sentenceCount = content.split(/[.!?]+/).length;
  const complexWords = content.split(/\s+/).filter(word => word.length > 7).length;
  
  const pillars: PillarScore[] = PILLARS.map(pillar => {
    // Generate scores based on different text characteristics
    let score = 2.5; // Base score
    
    // Adjust based on length and complexity
    if (wordCount > 300) score += 0.5;
    if (wordCount > 500) score += 0.5;
    if (complexWords / wordCount > 0.15) score += 0.3;
    if (sentenceCount > 20) score += 0.2;
    
    // Add some randomization to make it more realistic
    score += (Math.random() - 0.5) * 1.2;
    
    // Clamp to 1-5 range
    score = Math.max(1, Math.min(5, score));
    
    return {
      name: pillar.name,
      score: Math.round(score * 10) / 10, // Round to 1 decimal
      description: pillar.description
    };
  });
  
  const overallScore = pillars.reduce((sum, pillar) => sum + pillar.score, 0) / pillars.length;
  
  return {
    pillars,
    overallScore: Math.round(overallScore * 10) / 10,
    essayLength: wordCount
  };
}