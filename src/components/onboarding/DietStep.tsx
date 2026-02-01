import { motion } from 'framer-motion';
import { DIET_TYPES } from '@/types';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface DietStepProps {
  value: string[]; // Now an array for multiple selection
  onChange: (value: string[]) => void;
}

const dietEmojis: Record<string, string> = {
  balanced: '⚖️',
  zone: '🎯',
  keto: '🥑',
  vegan: '🌱',
  highProtein: '💪',
  glutenFree: '🌾',
};

const dietDescriptions: Record<string, string> = {
  balanced: 'Разнообразно хранене с балансирани макроси',
  zone: 'Контрол на блокове: 40% въглехидрати, 30% протеин, 30% мазнини',
  keto: 'Много ниско на въглехидрати, високо на мазнини',
  vegan: 'Без продукти от животински произход',
  highProtein: 'Повишен прием на протеин за мускулен растеж',
  glutenFree: 'Без глутен-съдържащи продукти',
};

export function DietStep({ value, onChange }: DietStepProps) {
  const toggleDiet = (dietId: string) => {
    if (value.includes(dietId)) {
      // Remove if already selected (but keep at least one)
      if (value.length > 1) {
        onChange(value.filter(d => d !== dietId));
      }
    } else {
      // Add to selection
      onChange([...value, dietId]);
    }
  };

  return (
    <div className="pt-4">
      <h1 className="font-display text-2xl font-bold text-foreground text-center mb-2">
        Тип хранене
      </h1>
      <p className="text-muted-foreground text-center mb-6 text-sm">
        Можете да изберете няколко типа хранене
      </p>

      <div className="space-y-3 max-w-sm mx-auto">
        {DIET_TYPES.map((diet) => {
          const isSelected = value.includes(diet.id);
          return (
            <motion.button
              key={diet.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => toggleDiet(diet.id)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all relative",
                isSelected
                  ? "border-primary bg-accent"
                  : "border-border bg-card hover:border-primary/50"
              )}
            >
              <span className="text-2xl">{dietEmojis[diet.id] || '🍽️'}</span>
              <div className="flex-1">
                <span className={cn(
                  "font-semibold block",
                  isSelected ? "text-primary" : "text-foreground"
                )}>
                  {diet.label}
                </span>
                <span className="text-muted-foreground text-xs">
                  {dietDescriptions[diet.id]}
                </span>
              </div>
              {isSelected && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {value.length > 1 && (
        <p className="text-center text-sm text-muted-foreground mt-4">
          Избрани: {value.length} типа хранене
        </p>
      )}
    </div>
  );
}
