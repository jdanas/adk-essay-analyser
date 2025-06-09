import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PenTool } from 'lucide-react';

interface TextInputProps {
  onTextSubmit: (content: string) => void;
}

export function TextInput({ onTextSubmit }: TextInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim()) {
      onTextSubmit(text.trim());
    }
  };

  const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;

  return (
    <Card className="h-full bg-white border border-gray-200 rounded-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg font-medium text-gray-900">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
            <PenTool className="w-4 h-4 text-gray-700" />
          </div>
          Paste Your Essay
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Textarea
          placeholder="Paste your essay text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[300px] resize-none border-gray-200 rounded-xl focus:border-gray-400 focus:ring-0 transition-all duration-300"
        />
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {wordCount} words
          </p>
          <Button 
            onClick={handleSubmit}
            disabled={!text.trim()}
            className="bg-gray-900 hover:bg-gray-800 text-white rounded-xl transition-all duration-300 disabled:bg-gray-300"
          >
            Analyze Essay
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}