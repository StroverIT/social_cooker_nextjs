import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { calculateBMR, calculateTDEE } from '@/lib/calculations';
import { ACTIVITY_LEVELS, GOALS, DIET_TYPES } from '@/types';
import { GenderStep } from './GenderStep';
import { MeasurementsStep } from './MeasurementsStep';
import { GoalsActivityStep } from './GoalsActivityStep';
import { DietStep } from './DietStep';
import { ResultsStep } from './ResultsStep';

const steps = [
  { id: 'gender', title: 'Пол' },
  { id: 'measurements', title: 'Измервания' },
  { id: 'goals-activity', title: 'Цел и активност' },
  { id: 'diet', title: 'Диета' },
  { id: 'results', title: 'Резултати' },
];

export function OnboardingWizard() {
  const { setUser } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    gender: '' as 'male' | 'female' | '',
    age: 25,
    weight: 70,
    height: 170,
    activityLevel: '' as typeof ACTIVITY_LEVELS[number]['id'] | '',
    goals: '' as typeof GOALS[number]['id'] | '',
    dietTypes: ['balanced'] as string[],
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return formData.gender !== '';
      case 1: return formData.age > 0 && formData.weight > 0 && formData.height > 0;
      case 2: return formData.activityLevel !== '' && formData.goals !== '';
      case 3: return formData.dietTypes.length > 0;
      case 4: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    const bmr = calculateBMR(
      formData.gender as 'male' | 'female',
      formData.weight,
      formData.height,
      formData.age
    );
    const tdee = calculateTDEE(bmr, formData.activityLevel as typeof ACTIVITY_LEVELS[number]['id']);

    setUser({
      id: crypto.randomUUID(),
      gender: formData.gender as 'male' | 'female',
      age: formData.age,
      weight: formData.weight,
      height: formData.height,
      activityLevel: formData.activityLevel as typeof ACTIVITY_LEVELS[number]['id'],
      goals: formData.goals as typeof GOALS[number]['id'],
      dietTypes: formData.dietTypes as ('balanced' | 'zone' | 'keto' | 'vegan' | 'highProtein' | 'glutenFree')[],
      bmr,
      tdee,
      onboardingComplete: true,
      dailyLog: {
        date: new Date().toISOString().split('T')[0],
        consumedMeals: [],
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
      },
    });
  };

  const bmr = formData.gender && formData.weight && formData.height && formData.age
    ? calculateBMR(formData.gender as 'male' | 'female', formData.weight, formData.height, formData.age)
    : 0;
  
  const tdee = bmr && formData.activityLevel
    ? calculateTDEE(bmr, formData.activityLevel as typeof ACTIVITY_LEVELS[number]['id'])
    : 0;

  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      {/* Progress */}
      <div className="p-4 pt-8">
        <div className="flex gap-1.5">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`flex-1 h-1.5 rounded-full transition-colors ${
                index <= currentStep ? 'gradient-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Стъпка {currentStep + 1} от {steps.length}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-24 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {currentStep === 0 && (
              <GenderStep 
                value={formData.gender} 
                onChange={(v) => updateFormData('gender', v)} 
              />
            )}
            {currentStep === 1 && (
              <MeasurementsStep
                age={formData.age}
                weight={formData.weight}
                height={formData.height}
                onAgeChange={(v) => updateFormData('age', v)}
                onWeightChange={(v) => updateFormData('weight', v)}
                onHeightChange={(v) => updateFormData('height', v)}
              />
            )}
            {currentStep === 2 && (
              <GoalsActivityStep
                goal={formData.goals}
                activityLevel={formData.activityLevel}
                onGoalChange={(v) => updateFormData('goals', v)}
                onActivityChange={(v) => updateFormData('activityLevel', v)}
              />
            )}
            {currentStep === 3 && (
              <DietStep
                value={formData.dietTypes}
                onChange={(v) => updateFormData('dietTypes', v)}
              />
            )}
            {currentStep === 4 && (
              <ResultsStep
                gender={formData.gender as 'male' | 'female'}
                age={formData.age}
                weight={formData.weight}
                height={formData.height}
                bmr={bmr}
                tdee={tdee}
                goal={formData.goals as typeof GOALS[number]['id']}
                dietTypes={formData.dietTypes}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border safe-bottom">
        <div className="flex gap-3 max-w-lg mx-auto">
          {currentStep > 0 && (
            <Button
              variant="outline"
              size="lg"
              onClick={handleBack}
              className="flex-1"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Назад
            </Button>
          )}
          
          {currentStep < steps.length - 1 ? (
            <Button
              size="lg"
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex-1 gradient-primary text-primary-foreground border-0"
            >
              Напред
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={handleComplete}
              className="flex-1 gradient-primary text-primary-foreground border-0"
            >
              <Check className="w-5 h-5 mr-1" />
              Завърши
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
