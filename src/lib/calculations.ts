import { ACTIVITY_LEVELS, GOALS } from '@/types';

// Mifflin-St Jeor Formula
export function calculateBMR(
  gender: 'male' | 'female',
  weight: number,
  height: number,
  age: number
): number {
  if (gender === 'male') {
    return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
  } else {
    return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
  }
}

export function calculateTDEE(
  bmr: number,
  activityLevel: typeof ACTIVITY_LEVELS[number]['id']
): number {
  const activity = ACTIVITY_LEVELS.find(a => a.id === activityLevel);
  return Math.round(bmr * (activity?.multiplier || 1.2));
}

export function calculateTargetCalories(
  tdee: number,
  goal: typeof GOALS[number]['id']
): number {
  const goalData = GOALS.find(g => g.id === goal);
  return tdee + (goalData?.calorieAdjustment || 0);
}

export function calculateMacros(targetCalories: number, dietType: string) {
  // Default balanced macro split
  let proteinPercent = 0.3;
  let carbPercent = 0.4;
  let fatPercent = 0.3;

  switch (dietType) {
    case 'keto':
      proteinPercent = 0.25;
      carbPercent = 0.05;
      fatPercent = 0.7;
      break;
    case 'highProtein':
      proteinPercent = 0.4;
      carbPercent = 0.35;
      fatPercent = 0.25;
      break;
    case 'zone':
      proteinPercent = 0.3;
      carbPercent = 0.4;
      fatPercent = 0.3;
      break;
    case 'vegan':
      proteinPercent = 0.2;
      carbPercent = 0.55;
      fatPercent = 0.25;
      break;
  }

  return {
    protein: Math.round((targetCalories * proteinPercent) / 4), // 4 cal per gram
    carbs: Math.round((targetCalories * carbPercent) / 4),
    fat: Math.round((targetCalories * fatPercent) / 9), // 9 cal per gram
  };
}
