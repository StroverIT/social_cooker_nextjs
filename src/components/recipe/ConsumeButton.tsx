import { useState } from 'react';
import { UtensilsCrossed, Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useApp } from '@/context/AppContext';
import { Recipe } from '@/types';
import { toast } from '@/hooks/use-toast';

interface ConsumeButtonProps {
  recipe: Recipe;
  servings: number;
}

export function ConsumeButton({ recipe, servings }: ConsumeButtonProps) {
  const { user, markMealConsumed, getDailyLog } = useApp();
  const [isConsumed, setIsConsumed] = useState(false);
  
  const dailyLog = getDailyLog();
  const alreadyConsumedToday = dailyLog.consumedMeals.some(m => m.recipeId === recipe.id);

  const handleConsume = (status: 'cooked' | 'eaten') => {
    if (!user) return;

    const multiplier = servings / recipe.servings;
    
    markMealConsumed({
      recipeId: recipe.id,
      recipeName: recipe.title,
      servings,
      calories: Math.round(recipe.macros.calories * multiplier),
      protein: Math.round(recipe.macros.protein * multiplier),
      carbs: Math.round(recipe.macros.carbs * multiplier),
      fat: Math.round(recipe.macros.fat * multiplier),
      status,
    });

    setIsConsumed(true);
    
    toast({
      title: status === 'cooked' ? "Приготвено! 👨‍🍳" : "Изядено! 🍽️",
      description: `${Math.round(recipe.macros.calories * multiplier)} kcal бяха добавени към дневния ви лог.`,
    });
  };

  if (isConsumed || alreadyConsumedToday) {
    return (
      <Button
        variant="outline"
        size="lg"
        disabled
        className="flex-1 border-success text-success"
      >
        <Check className="w-5 h-5 mr-2" />
        Записано
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="flex-1"
        >
          <UtensilsCrossed className="w-5 h-5 mr-2" />
          Маркирай
          <ChevronDown className="w-4 h-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-48">
        <DropdownMenuItem onClick={() => handleConsume('cooked')}>
          👨‍🍳 Приготвена
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleConsume('eaten')}>
          🍽️ Изядена
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
