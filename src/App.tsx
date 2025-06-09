import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { TextInput } from "@/components/TextInput";
import { EssayAnalyzer } from "@/components/EssayAnalyzer";
import { AuthButton } from "@/components/AuthButton";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { EssayAnalysisResponse, EssayData } from "@/types";
import { BookOpen, Upload, PenTool, BarChart3, FileText } from "lucide-react";
import "./App.css";

function App() {
  const [analysisResult, setAnalysisResult] =
    useState<EssayAnalysisResponse | null>(null);
  const [essayData, setEssayData] = useState<EssayData | null>(null);
  const { toast } = useToast();

  const handleFileProcessed = (content: string, filename: string) => {
    const data: EssayData = {
      content,
      source: "upload",
      filename,
    };
    setEssayData(data);

    toast({
      title: "File Uploaded",
      description: `Ready to analyze ${filename}`,
    });
  };

  const handleTextSubmit = (content: string) => {
    const data: EssayData = {
      content,
      source: "paste",
    };
    setEssayData(data);

    toast({
      title: "Text Ready",
      description: "Ready to analyze your essay text",
    });
  };

  const handleAnalysisComplete = (result: EssayAnalysisResponse) => {
    setAnalysisResult(result);

    toast({
      title: "Analysis Complete",
      description: `Your essay scored ${result.overallScore}/100`,
    });
  };

  const handleBack = () => {
    setAnalysisResult(null);
    setEssayData(null);
  };

  const handleError = (error: string) => {
    toast({
      title: "Error",
      description: error,
      variant: "destructive",
    });
  };

  if (analysisResult) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Top Navigation */}
        <div className="w-full border-b border-gray-200 bg-white">
          <div className="w-full px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-lg font-medium text-gray-900">
                  Essay Analyser
                </h1>
              </div>
              <AuthButton />
            </div>
          </div>
        </div>

        <div className="w-full px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <button
                onClick={handleBack}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                ← Back to Upload
              </button>
            </div>
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Analysis Results</h2>
                <div className="text-4xl font-bold text-blue-600">
                  {analysisResult.overallScore}/100
                </div>
                <p className="text-gray-600 mt-2">Overall Essay Score</p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-green-700 mb-3">
                      Grammar Feedback
                    </h3>
                    <p className="text-gray-700">
                      {analysisResult.grammarFeedback}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-blue-700 mb-3">
                      Structure Feedback
                    </h3>
                    <p className="text-gray-700">
                      {analysisResult.structureFeedback}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-purple-700 mb-3">
                      Content Feedback
                    </h3>
                    <p className="text-gray-700">
                      {analysisResult.contentFeedback}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-orange-700 mb-3">
                      Spelling Feedback
                    </h3>
                    <p className="text-gray-700">
                      {analysisResult.spellingFeedback}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="w-full border-b border-gray-200 bg-white">
        <div className="w-full px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-medium text-gray-900">
                Essay Analyser
              </h1>
            </div>
            <AuthButton />
          </div>
        </div>
      </div>

      <div className="w-full px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-semibold text-gray-900">
                Essay Analyser
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Analyze your essays with AI-powered feedback using Google's Gemini
              model. Upload a PDF or paste your text to get detailed insights
              and scoring.
            </p>
          </div>

          {/* Main Content */}
          <Card className="bg-white border border-gray-200 shadow-sm rounded-2xl">
            <CardContent className="p-8">
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 rounded-xl p-1">
                  <TabsTrigger
                    value="upload"
                    className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-300"
                  >
                    <Upload className="w-4 h-4" />
                    Upload PDF
                  </TabsTrigger>
                  <TabsTrigger
                    value="paste"
                    className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-300"
                  >
                    <PenTool className="w-4 h-4" />
                    Paste Text
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="space-y-4">
                  <FileUpload
                    onFileProcessed={handleFileProcessed}
                    onError={handleError}
                  />
                </TabsContent>

                <TabsContent value="paste" className="space-y-4">
                  <TextInput onTextSubmit={handleTextSubmit} />
                </TabsContent>
              </Tabs>

              {/* Essay Analysis Section */}
              {essayData && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <EssayAnalyzer
                    essayText={essayData.content}
                    onAnalysisComplete={handleAnalysisComplete}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center p-6 bg-white border border-gray-200 shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-5 h-5 text-gray-700" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">
                AI-Powered Analysis
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Comprehensive evaluation using Google's advanced Gemini model
              </p>
            </Card>

            <Card className="text-center p-6 bg-white border border-gray-200 shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-5 h-5 text-gray-700" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">
                Detailed Scoring
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Clear scoring and feedback across grammar, structure, content,
                and spelling
              </p>
            </Card>

            <Card className="text-center p-6 bg-white border border-gray-200 shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-5 h-5 text-gray-700" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">
                Multiple Formats
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Support for PDF uploads and direct text input for maximum
                flexibility
              </p>
            </Card>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
