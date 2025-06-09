import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import axios from "axios";

// Define the response interface as specified
interface EssayAnalysisResponse {
  grammarFeedback: string;
  structureFeedback: string;
  contentFeedback: string;
  spellingFeedback: string;
  overallScore: number;
}

interface AnalyzeEssayRequest {
  text: string;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

const app = express();
const PORT = process.env.PORT || 3001;
const ADK_API_URL = process.env.ADK_API_URL || "http://localhost:8000";

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));

/**
 * Calls the ADK API server to analyze the essay
 */
const callAdkAnalyzer = async (
  essayText: string
): Promise<EssayAnalysisResponse> => {
  try {
    const response = await axios.post(
      `${ADK_API_URL}/analyze`,
      {
        text: essayText,
        user_id: "web_client",
      },
      {
        timeout: 120000, // 2 minute timeout
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(`ADK API returned status ${response.status}`);
    }

    const result = response.data;

    // Validate the response structure
    const requiredFields = [
      "grammarFeedback",
      "structureFeedback",
      "contentFeedback",
      "spellingFeedback",
      "overallScore",
    ];
    for (const field of requiredFields) {
      if (!(field in result)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    return {
      grammarFeedback: result.grammarFeedback,
      structureFeedback: result.structureFeedback,
      contentFeedback: result.contentFeedback,
      spellingFeedback: result.spellingFeedback,
      overallScore: Number(result.overallScore),
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.code === "ECONNREFUSED") {
        throw new Error(
          "ADK API server is not running. Please start the Python ADK server first."
        );
      }
      if (error.response) {
        throw new Error(
          `ADK API error: ${error.response.status} - ${
            error.response.data?.detail || error.message
          }`
        );
      }
    }
    throw error;
  }
};

/**
 * POST /api/analyze-essay
 * Analyzes essay text and returns structured feedback using ADK API
 */
app.post(
  "/api/analyze-essay",
  async (
    req: Request<
      object,
      EssayAnalysisResponse | ErrorResponse,
      AnalyzeEssayRequest
    >,
    res: Response<EssayAnalysisResponse | ErrorResponse>
  ) => {
    try {
      const { text } = req.body;

      // Validate input
      if (!text || typeof text !== "string") {
        res.status(400).json({
          error: "Invalid request: essay text is required and must be a string",
        });
        return;
      }

      if (text.trim().length === 0) {
        res.status(400).json({
          error: "Invalid request: essay text cannot be empty",
        });
        return;
      }

      if (text.length > 50000) {
        // Reasonable limit for essay length
        res.status(400).json({
          error:
            "Invalid request: essay text is too long (maximum 50,000 characters)",
        });
        return;
      }

      // Run the ADK analyzer
      console.log("Starting essay analysis via ADK API...");
      const analysisResult = await callAdkAnalyzer(text);
      console.log("Essay analysis completed successfully");

      // Return the structured response
      res.status(200).json(analysisResult);
    } catch (error) {
      console.error("Error analyzing essay:", error);

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      res.status(500).json({
        error: "Internal server error during essay analysis",
        details: errorMessage,
      });
    }
  }
);

/**
 * GET /api/health
 * Health check endpoint
 */
app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "essay-analyzer-api",
    adk_api_url: ADK_API_URL,
  });
});

/**
 * GET /
 * Root endpoint
 */
app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "Essay Analyzer API",
    version: "1.0.0",
    endpoints: {
      analyze: "/api/analyze-essay",
      health: "/api/health",
    },
    adk_api_url: ADK_API_URL,
  });
});

// Error handling middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
    details: err.message,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Essay Analyzer API server running on port ${PORT}`);
  console.log(`📡 ADK API URL: ${ADK_API_URL}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});

export default app;
