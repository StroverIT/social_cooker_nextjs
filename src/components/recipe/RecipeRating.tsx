import { useState } from 'react';
import { Star } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';

interface RecipeRatingProps {
  recipeId: string;
  averageRating: number;
  totalRatings: number;
}

export function RecipeRating({ recipeId, averageRating, totalRatings }: RecipeRatingProps) {
  const { user, addRating, recipes } = useApp();
  const [hoverRating, setHoverRating] = useState(0);
  
  const recipe = recipes.find(r => r.id === recipeId);
  const userRating = recipe?.ratings?.find(r => r.userId === user?.id)?.rating || 0;

  const handleRate = (rating: number) => {
    if (!user) return;
    addRating(recipeId, rating);
  };

  return (
    <div className="flex items-center gap-4">
      {/* Average Rating Display */}
      <div className="flex items-center gap-2">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={cn(
                "w-5 h-5",
                star <= Math.round(averageRating)
                  ? "fill-warning text-warning"
                  : "text-muted-foreground"
              )}
            />
          ))}
        </div>
        <span className="text-sm font-medium text-foreground">
          {averageRating > 0 ? averageRating.toFixed(1) : '-'}
        </span>
        <span className="text-sm text-muted-foreground">
          ({totalRatings} {totalRatings === 1 ? 'оценка' : 'оценки'})
        </span>
      </div>

      {/* User Rating Input */}
      {user && (
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-muted-foreground">Вашата оценка:</span>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRate(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-0.5 transition-transform hover:scale-110"
              >
                <Star
                  className={cn(
                    "w-5 h-5 transition-colors",
                    (hoverRating ? star <= hoverRating : star <= userRating)
                      ? "fill-warning text-warning"
                      : "text-muted-foreground hover:text-warning"
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
