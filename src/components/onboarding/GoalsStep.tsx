import { motion } from 'framer-motion';
import { TrendingDown, Minus, TrendingUp } from 'lucide-react';
import { GOALS } from '@/types';
import { cn } from '@/lib/utils';

interface GoalsStepProps {
  value: string;
  onChange: (value: typeof GOALS[number]['id']) => void;
}

const goalIcons = [TrendingDown, Minus, TrendingUp];
const goalEmojis = ['🏃', '⚖️', '💪'];

export function GoalsStep({ value, onChange }: GoalsStepProps) {
  return (
    <div className="pt-8">
      <h1 className="font-display text-3xl font-bold text-foreground text-center mb-2">
        Вашата цел
      </h1>
      <p className="text-muted-foreground text-center mb-8">
        Какво искате да постигнете?
      </p>

      <div className="space-y-3 max-w-sm mx-auto">
        {GOALS.map((goal, index) => {
          const Icon = goalIcons[index];
          return (
            <motion.button
              key={goal.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onChange(goal.id)}
              className={cn(
                "w-full flex items-center gap-4 p-5 rounded-xl border-2 text-left transition-all",
                value === goal.id
                  ? "border-primary bg-accent"
                  : "border-border bg-card hover:border-primary/50"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center text-2xl",
                value === goal.id ? "gradient-primary" : "bg-muted"
              )}>
                {goalEmojis[index]}
              </div>
              <div>
                <span className={cn(
                  "font-semibold block",
                  value === goal.id ? "text-primary" : "text-foreground"
                )}>
                  {goal.label}
                </span>
                <span className="text-sm text-muted-foreground">
                  {goal.calorieAdjustment > 0 ? '+' : ''}{goal.calorieAdjustment} kcal/ден
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
