import { motion } from 'framer-motion';
import { Flame, Sparkles } from 'lucide-react';
import { GOALS, DIET_TYPES } from '@/types';
import { calculateTargetCalories, calculateMacros } from '@/lib/calculations';

interface ResultsStepProps {
  gender: 'male' | 'female';
  age: number;
  weight: number;
  height: number;
  bmr: number;
  tdee: number;
  goal: typeof GOALS[number]['id'];
  dietTypes: string[];
}

export function ResultsStep({ 
  gender, 
  age, 
  weight, 
  height, 
  bmr, 
  tdee, 
  goal,
  dietTypes
}: ResultsStepProps) {
  const goalData = GOALS.find(g => g.id === goal);
  const primaryDiet = dietTypes[0] as typeof DIET_TYPES[number]['id'];
  const dietLabels = dietTypes.map(d => DIET_TYPES.find(dt => dt.id === d)?.label).filter(Boolean).join(', ');
  const targetCalories = calculateTargetCalories(tdee, goal);
  const macros = calculateMacros(targetCalories, primaryDiet);

  return (
    <div className="pt-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center mb-6"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full gradient-primary mb-4">
          <Sparkles className="w-10 h-10 text-primary-foreground" />
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">
          Вашият персонализиран план
        </h1>
        <p className="text-muted-foreground text-sm">
          Изчислихме оптималния ви хранителен режим
        </p>
      </motion.div>

      {/* Daily Calorie Target - User-friendly label */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="gradient-primary rounded-2xl p-6 text-center mb-4"
      >
        <Flame className="w-8 h-8 text-primary-foreground mx-auto mb-2" />
        <p className="text-primary-foreground/80 text-sm mb-1">Препоръчителен дневен калориен прием</p>
        <p className="text-4xl font-bold text-primary-foreground">{targetCalories}</p>
        <p className="text-primary-foreground/80 text-sm">килокалории на ден</p>
      </motion.div>

      {/* Macros with distinct colors */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-3 mb-4"
      >
        <div className="bg-macro-protein rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-macro-protein-foreground">{macros.protein}г</p>
          <p className="text-xs text-macro-protein-foreground/80">Протеин</p>
        </div>
        <div className="bg-macro-carbs rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-macro-carbs-foreground">{macros.carbs}г</p>
          <p className="text-xs text-macro-carbs-foreground/80">Въглехидрати</p>
        </div>
        <div className="bg-macro-fat rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-macro-fat-foreground">{macros.fat}г</p>
          <p className="text-xs text-macro-fat-foreground/80">Мазнини</p>
        </div>
      </motion.div>

      {/* Profile Summary */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-card rounded-xl border border-border p-4"
      >
        <h3 className="font-display font-semibold text-foreground mb-3">Вашият профил</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Пол</span>
            <span className="font-medium text-foreground">{gender === 'male' ? 'Мъж' : 'Жена'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Възраст</span>
            <span className="font-medium text-foreground">{age} години</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Тегло</span>
            <span className="font-medium text-foreground">{weight} кг</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Височина</span>
            <span className="font-medium text-foreground">{height} см</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-border space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Цел</span>
            <span className="font-medium text-foreground">{goalData?.label}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Тип хранене</span>
            <span className="font-medium text-foreground text-right max-w-[60%]">{dietLabels}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
