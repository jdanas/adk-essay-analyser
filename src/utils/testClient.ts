/**
 * Test client for the Essay Analyzer API
 * This demonstrates how to use the /api/analyze-essay endpoint
 */

interface EssayAnalysisResponse {
  grammarFeedback: string;
  structureFeedback: string;
  contentFeedback: string;
  spellingFeedback: string;
  overallScore: number;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

/**
 * Analyzes essay text using the API endpoint
 */
export async function analyzeEssay(text: string, apiUrl: string = 'http://localhost:3001'): Promise<EssayAnalysisResponse> {
  const response = await fetch(`${apiUrl}/api/analyze-essay`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errorData = await response.json() as ErrorResponse;
    throw new Error(`API Error: ${errorData.error}${errorData.details ? ` - ${errorData.details}` : ''}`);
  }

  return response.json() as Promise<EssayAnalysisResponse>;
}

/**
 * Example usage of the essay analyzer
 */
async function testEssayAnalyzer() {
  const sampleEssay = `
The importance of education cannot be overstated in today's rapidly evolving world. Education serves as the foundation for personal growth, economic development, and social progress.

First, education empowers individuals by providing them with knowledge and skills necessary for success. Through formal schooling, people acquire literacy, numeracy, and critical thinking abilities that enable them to navigate complex challenges in their personal and professional lives.

Second, education drives economic growth by creating a skilled workforce. Countries with higher education levels tend to have stronger economies, as educated workers are more productive and innovative. This leads to increased competitiveness in the global market.

Finally, education promotes social cohesion and democratic values. It teaches people about their rights and responsibilities as citizens, fostering civic engagement and social responsibility.

In conclusion, investing in education is essential for building a prosperous and equitable society. Governments and individuals must prioritize educational opportunities to ensure continued progress and development.
  `.trim();

  try {
    console.log('🔍 Analyzing sample essay...\n');
    console.log('Essay text:');
    console.log(sampleEssay);
    console.log('\n' + '='.repeat(80) + '\n');

    const result = await analyzeEssay(sampleEssay);

    console.log('📊 Analysis Results:\n');
    console.log('📝 Grammar Feedback:');
    console.log(result.grammarFeedback);
    console.log('\n📚 Structure Feedback:');
    console.log(result.structureFeedback);
    console.log('\n💡 Content Feedback:');
    console.log(result.contentFeedback);
    console.log('\n✏️  Spelling Feedback:');
    console.log(result.spellingFeedback);
    console.log('\n🎯 Overall Score:', result.overallScore, '/100');

  } catch (error) {
    console.error('❌ Error analyzing essay:', error);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testEssayAnalyzer();
}
