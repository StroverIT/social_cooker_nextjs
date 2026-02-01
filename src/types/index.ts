export interface UserProfile {
  id: string;
  gender: 'male' | 'female';
  age: number;
  weight: number; // kg
  height: number; // cm
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
  goals: 'lose' | 'maintain' | 'gain';
  dietTypes: ('balanced' | 'zone' | 'keto' | 'vegan' | 'highProtein' | 'glutenFree')[]; // Multiple diet types
  bmr: number;
  tdee: number;
  onboardingComplete: boolean;
  // Daily tracking
  dailyLog: DailyLog;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  consumedMeals: ConsumedMeal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export interface ConsumedMeal {
  recipeId: string;
  recipeName: string;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  consumedAt: Date;
  status: 'cooked' | 'eaten';
}

export interface Recipe {
  id: string;
  title: string;
  image: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  tags: ('sweet' | 'savory' | 'pastry' | 'soup')[];
  dietTypes: ('balanced' | 'zone' | 'keto' | 'vegan' | 'highProtein' | 'glutenFree')[];
  ingredients: Ingredient[];
  instructions: string[];
  macros: {
    protein: number;
    carbs: number;
    fat: number;
    calories: number;
  };
  prepTime: number; // minutes
  cookTime: number; // minutes
  servings: number;
  authorId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  // Community features
  ratings: Rating[];
  comments: Comment[];
  averageRating: number;
}

export interface Rating {
  userId: string;
  rating: number; // 1-5
  createdAt: Date;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: Date;
}

export interface RecipeReport {
  id: string;
  recipeId: string;
  userId: string;
  reason: string;
  details: string;
  createdAt: Date;
  status: 'pending' | 'reviewed';
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  category: 'dairy' | 'vegetables' | 'meat' | 'grains' | 'spices' | 'other';
}

export interface ShoppingItem extends Ingredient {
  recipeId: string;
  recipeName: string;
  checked: boolean;
}

export type CategoryLabel = {
  id: Recipe['category'];
  label: string;
  icon: string;
};

export type TagLabel = {
  id: Recipe['tags'][number];
  label: string;
};

export const CATEGORIES: CategoryLabel[] = [
  { id: 'breakfast', label: 'Закуска', icon: '🌅' },
  { id: 'lunch', label: 'Обяд', icon: '☀️' },
  { id: 'dinner', label: 'Вечеря', icon: '🌙' },
  { id: 'snack', label: 'Междинно хранене', icon: '🍎' },
];

export const TAGS: TagLabel[] = [
  { id: 'sweet', label: 'Сладко' },
  { id: 'savory', label: 'Солено' },
  { id: 'pastry', label: 'Печива' },
  { id: 'soup', label: 'Супи' },
];

export const DIET_TYPES = [
  { id: 'balanced', label: 'Балансирана' },
  { id: 'zone', label: 'Зонова диета' },
  { id: 'keto', label: 'Кето' },
  { id: 'vegan', label: 'Веган' },
  { id: 'highProtein', label: 'Високо протеинова' },
  { id: 'glutenFree', label: 'Без глутен' },
] as const;

export const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: 'Седящ начин на живот', description: 'Офис работа, малко движение', multiplier: 1.2 },
  { id: 'light', label: 'Лека активност', description: 'Леки упражнения 1-3 дни/седмица', multiplier: 1.375 },
  { id: 'moderate', label: 'Умерена активност', description: 'Умерени упражнения 3-5 дни/седмица', multiplier: 1.55 },
  { id: 'active', label: 'Висока активност', description: 'Интензивни тренировки 6-7 дни/седмица', multiplier: 1.725 },
  { id: 'veryActive', label: 'Много висока активност', description: 'Професионален спорт или физически труд', multiplier: 1.9 },
] as const;

export const GOALS = [
  { id: 'lose', label: 'Искам да отслабна', icon: '📉', description: 'Дефицит от 500 kcal дневно', calorieAdjustment: -500 },
  { id: 'maintain', label: 'Искам да поддържам тегло', icon: '⚖️', description: 'Балансиран прием на калории', calorieAdjustment: 0 },
  { id: 'gain', label: 'Искам да кача мускулна маса', icon: '💪', description: 'Излишък от 500 kcal дневно', calorieAdjustment: 500 },
] as const;

export const INGREDIENT_CATEGORIES = [
  { id: 'dairy', label: 'Млечни продукти' },
  { id: 'vegetables', label: 'Зеленчуци' },
  { id: 'meat', label: 'Месо' },
  { id: 'grains', label: 'Зърнени храни' },
  { id: 'spices', label: 'Подправки' },
  { id: 'other', label: 'Други' },
] as const;

// Zone Diet Block Calculations
// 1 Protein Block = 7g protein
// 1 Carb Block = 9g carbs
// 1 Fat Block = 1.5g fat (3g if including hidden fat)
export const ZONE_BLOCK_VALUES = {
  protein: 7, // grams per block
  carbs: 9,   // grams per block
  fat: 3,     // grams per block (including hidden fat)
} as const;

export function calculateZoneBlocks(macros: { protein: number; carbs: number; fat: number }) {
  return {
    proteinBlocks: Math.round(macros.protein / ZONE_BLOCK_VALUES.protein * 10) / 10,
    carbBlocks: Math.round(macros.carbs / ZONE_BLOCK_VALUES.carbs * 10) / 10,
    fatBlocks: Math.round(macros.fat / ZONE_BLOCK_VALUES.fat * 10) / 10,
  };
}
