import { motion } from 'framer-motion';
import { GOALS, ACTIVITY_LEVELS } from '@/types';
import { cn } from '@/lib/utils';

interface GoalsActivityStepProps {
  goal: string;
  activityLevel: string;
  onGoalChange: (value: typeof GOALS[number]['id']) => void;
  onActivityChange: (value: typeof ACTIVITY_LEVELS[number]['id']) => void;
}

const activityEmojis = ['🛋️', '🚶', '🏃', '💪', '🏋️'];

export function GoalsActivityStep({ goal, activityLevel, onGoalChange, onActivityChange }: GoalsActivityStepProps) {
  return (
    <div className="pt-4">
      <h1 className="font-display text-2xl font-bold text-foreground text-center mb-2">
        Избери цел и ниво на активност
      </h1>
      <p className="text-muted-foreground text-center mb-6 text-sm">
        Това ни помага да изчислим препоръчителния ви дневен калориен прием
      </p>

      {/* Goals Section */}
      <div className="mb-6">
        <h2 className="font-display text-lg font-semibold text-foreground mb-3">
          Каква е вашата цел?
        </h2>
        <div className="space-y-2">
          {GOALS.map((g) => (
            <motion.button
              key={g.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onGoalChange(g.id)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all",
                goal === g.id
                  ? "border-primary bg-accent"
                  : "border-border bg-card hover:border-primary/50"
              )}
            >
              <span className="text-2xl">{g.icon}</span>
              <div className="flex-1">
                <span className={cn(
                  "font-semibold block",
                  goal === g.id ? "text-primary" : "text-foreground"
                )}>
                  {g.label}
                </span>
                <span className="text-muted-foreground text-xs">{g.description}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Activity Level Section */}
      <div>
        <h2 className="font-display text-lg font-semibold text-foreground mb-3">
          Ниво на физическа активност
        </h2>
        <div className="space-y-2">
          {ACTIVITY_LEVELS.map((level, index) => (
            <motion.button
              key={level.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onActivityChange(level.id)}
              className={cn(
                "w-full flex items-center gap-4 p-3 rounded-xl border-2 text-left transition-all",
                activityLevel === level.id
                  ? "border-primary bg-accent"
                  : "border-border bg-card hover:border-primary/50"
              )}
            >
              <span className="text-xl">{activityEmojis[index]}</span>
              <div className="flex-1">
                <span className={cn(
                  "font-medium text-sm block",
                  activityLevel === level.id ? "text-primary" : "text-foreground"
                )}>
                  {level.label}
                </span>
                <span className="text-muted-foreground text-xs">{level.description}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
