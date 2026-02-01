import { motion } from 'framer-motion';
import { Clock, Flame, Users } from 'lucide-react';
import { Recipe, CATEGORIES, TAGS } from '@/types';
import { cn } from '@/lib/utils';

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
  variant?: 'default' | 'compact';
}

export function RecipeCard({ recipe, onClick, variant = 'default' }: RecipeCardProps) {
  const category = CATEGORIES.find(c => c.id === recipe.category);
  
  if (variant === 'compact') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="flex items-center gap-3 p-3 bg-card rounded-xl shadow-card cursor-pointer"
      >
        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
          <img 
            src={recipe.image} 
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-foreground line-clamp-1">{recipe.title}</h4>
          <div className="flex items-center gap-2 mt-1 text-muted-foreground text-xs">
            <span className="flex items-center gap-1">
              <Flame className="w-3 h-3" />
              {recipe.macros.calories} kcal
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {recipe.prepTime + recipe.cookTime} мин
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow cursor-pointer"
    >
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img 
          src={recipe.image} 
          alt={recipe.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      
      <div className="absolute top-3 left-3">
        <span className="px-2.5 py-1 bg-card/90 backdrop-blur-sm rounded-full text-xs font-medium">
          {category?.icon} {category?.label}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-display font-semibold text-foreground text-lg line-clamp-2 mb-2">
          {recipe.title}
        </h3>
        
        <div className="flex flex-wrap gap-1.5 mb-3">
          {recipe.tags.map(tagId => {
            const tag = TAGS.find(t => t.id === tagId);
            return (
              <span 
                key={tagId}
                className="px-2 py-0.5 bg-accent text-accent-foreground rounded-full text-xs"
              >
                {tag?.label}
              </span>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Flame className="w-4 h-4 text-secondary" />
              {recipe.macros.calories}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {recipe.prepTime + recipe.cookTime} мин
            </span>
          </div>
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {recipe.servings}
          </span>
        </div>

        <div className="mt-3 flex gap-2">
          <MacroBar label="П" value={recipe.macros.protein} color="bg-primary" />
          <MacroBar label="В" value={recipe.macros.carbs} color="bg-secondary" />
          <MacroBar label="М" value={recipe.macros.fat} color="bg-warning" />
        </div>
      </div>
    </motion.div>
  );
}

function MacroBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex-1">
      <div className="flex justify-between text-xs text-muted-foreground mb-1">
        <span>{label}</span>
        <span>{value}г</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full", color)}
          style={{ width: `${Math.min((value / 100) * 100, 100)}%` }}
        />
      </div>
    </div>
  );
}
