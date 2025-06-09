import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StarRating } from '@/components/ui/star-rating';
import { PillarScore } from '@/types';

interface PillarCardProps {
  pillar: PillarScore;
  index: number;
}

export function PillarCard({ pillar, index }: PillarCardProps) {
  return (
    <Card className="group hover:shadow-md transition-all duration-300 bg-white border border-gray-200 rounded-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700 font-medium text-sm">
            {index + 1}
          </div>
          <CardTitle className="text-lg font-medium text-gray-900">
            {pillar.name}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <StarRating rating={pillar.score} size="lg" />
        <CardDescription className="text-sm text-gray-600 leading-relaxed">
          {pillar.description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}