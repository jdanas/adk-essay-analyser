import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StarRating({ 
  rating, 
  maxRating = 5, 
  size = 'md',
  className 
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {Array.from({ length: maxRating }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= Math.floor(rating);
        const isHalfFilled = starValue === Math.floor(rating) + 1 && rating % 1 >= 0.5;
        
        return (
          <div key={index} className="relative">
            <Star 
              className={cn(
                sizeClasses[size],
                'transition-colors duration-200',
                isFilled 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'fill-gray-200 text-gray-200'
              )}
            />
            {isHalfFilled && (
              <Star 
                className={cn(
                  sizeClasses[size],
                  'absolute top-0 left-0 fill-yellow-400 text-yellow-400 transition-colors duration-200'
                )}
                style={{
                  clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)'
                }}
              />
            )}
          </div>
        );
      })}
      <span className="ml-2 text-sm font-medium text-gray-600">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}