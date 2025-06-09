import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { TextInput } from '@/components/TextInput';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { AuthButton } from '@/components/AuthButton';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { analyzeEssay } from '@/utils/essayAnalyser';
import { AnalysisResult, EssayData } from '@/types';
import { BookOpen, Upload, PenTool, BarChart3, FileText } from 'lucide-react';
import './App.css';

function App() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [essayData, setEssayData] = useState<EssayData | null>(null);
  const { toast } = useToast();

  const handleFileProcessed = (content: string, filename: string) => {
    const data: EssayData = {
      content,
      source: 'upload',
      filename
    };
    setEssayData(data);
    
    const results = analyzeEssay(content);
    setAnalysisResult(results);
    
    toast({
      title: "Analysis Complete",
      description: `Successfully analyzed ${filename}`,
    });
  };

  const handleTextSubmit = (content: string) => {
    const data: EssayData = {
      content,
      source: 'paste'
    };
    setEssayData(data);
    
    const results = analyzeEssay(content);
    setAnalysisResult(results);
    
    toast({
      title: "Analysis Complete",
      description: "Successfully analyzed your essay text",
    });
  };

  const handleError = (error: string) => {
    toast({
      title: "Error",
      description: error,
      variant: "destructive",
    });
  };

  const handleBack = () => {
    setAnalysisResult(null);
    setEssayData(null);
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
                <h1 className="text-lg font-medium text-gray-900">Essay Analyser</h1>
              </div>
              <AuthButton />
            </div>
          </div>
        </div>

        <div className="w-full px-6 py-8">
          <ResultsDisplay
            results={analysisResult}
            onBack={handleBack}
            filename={essayData?.filename}
          />
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
              <h1 className="text-lg font-medium text-gray-900">Essay Analyser</h1>
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
              Analyze your essays across the five pillars of interdisciplinary learning. 
              Upload a PDF or paste your text to get detailed insights and scoring.
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
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center p-6 bg-white border border-gray-200 shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-5 h-5 text-gray-700" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Comprehensive Analysis</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Detailed evaluation across all five pillars of interdisciplinary learning
              </p>
            </Card>
            
            <Card className="text-center p-6 bg-white border border-gray-200 shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-5 h-5 text-gray-700" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Visual Scoring</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Clear star ratings and metrics to understand your essay's strengths
              </p>
            </Card>
            
            <Card className="text-center p-6 bg-white border border-gray-200 shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-5 h-5 text-gray-700" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Multiple Formats</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Support for PDF uploads and direct text input for maximum flexibility
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