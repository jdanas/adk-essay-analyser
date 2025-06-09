import { useCallback, useState } from "react";
import { Upload, FileText, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { extractTextFromPDF } from "@/utils/pdfParser";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileProcessed: (content: string, filename: string) => void;
  onError: (error: string) => void;
}

export function FileUpload({ onFileProcessed, onError }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const processFile = useCallback(
    async (file: File) => {
      if (!file.type.includes("pdf")) {
        onError("Please upload a PDF file");
        return;
      }

      setIsProcessing(true);
      setUploadedFile(file);

      try {
        const content = await extractTextFromPDF(file);
        if (!content.trim()) {
          throw new Error("No text found in PDF");
        }
        onFileProcessed(content, file.name);
        //TODO : fix linting
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        onError("Failed to process PDF file. Please try again.");
        setUploadedFile(null);
      } finally {
        setIsProcessing(false);
      }
    },
    [onFileProcessed, onError]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        processFile(files[0]);
      }
    },
    [processFile]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        processFile(files[0]);
      }
    },
    [processFile]
  );

  const clearFile = () => {
    setUploadedFile(null);
  };

  return (
    <Card
      className={cn(
        "border-2 border-dashed border-gray-300 rounded-2xl transition-all duration-300",
        isDragOver && "border-gray-400 bg-gray-50"
      )}
    >
      <div
        className="p-12 text-center"
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
      >
        {uploadedFile ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                <FileText className="w-6 h-6 text-gray-700" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFile}
                className="ml-2 hover:bg-gray-100 rounded-lg transition-all duration-300"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            {isProcessing && (
              <div className="text-sm text-gray-600">Processing PDF...</div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto">
              <Upload className="w-8 h-8 text-gray-600" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900 mb-2">
                Upload your essay PDF
              </p>
              <p className="text-base text-gray-600 mb-6 leading-relaxed">
                Drag and drop your PDF file here, or click to browse
              </p>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <Button
                asChild
                variant="outline"
                className="border-gray-300 hover:bg-gray-50 rounded-xl transition-all duration-300"
              >
                <label htmlFor="file-upload" className="cursor-pointer">
                  Choose File
                </label>
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
