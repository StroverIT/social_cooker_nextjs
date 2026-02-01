import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, Recipe, ShoppingItem, ConsumedMeal, DailyLog, Comment, Rating } from '@/types';
import { mockRecipes } from '@/data/mockRecipes';

interface AppContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  recipes: Recipe[];
  addRecipe: (recipe: Recipe) => void;
  updateRecipeStatus: (recipeId: string, status: 'pending' | 'approved' | 'rejected') => void;
  shoppingList: ShoppingItem[];
  addToShoppingList: (items: ShoppingItem[]) => void;
  removeFromShoppingList: (recipeId: string) => void;
  toggleShoppingItem: (index: number) => void;
  clearShoppingList: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  // Daily tracking
  markMealConsumed: (meal: Omit<ConsumedMeal, 'consumedAt'>) => void;
  getDailyLog: () => DailyLog;
  getRemainingCalories: () => number;
  getRemainingMacros: () => { protein: number; carbs: number; fat: number };
  resetDailyLog: () => void;
  // Community features
  addComment: (recipeId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  addRating: (recipeId: string, rating: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

function createEmptyDailyLog(): DailyLog {
  return {
    date: getTodayDateString(),
    consumedMeals: [],
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('fitnutri-user');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure dailyLog exists and is for today
      if (!parsed.dailyLog || parsed.dailyLog.date !== getTodayDateString()) {
        parsed.dailyLog = createEmptyDailyLog();
      }
      // Migrate old single dietType to array
      if (parsed.dietType && !parsed.dietTypes) {
        parsed.dietTypes = [parsed.dietType];
        delete parsed.dietType;
      }
      return parsed;
    }
    return null;
  });
  
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    // Add default community fields to mock recipes
    return mockRecipes.map(r => ({
      ...r,
      ratings: r.ratings || [],
      comments: r.comments || [],
      averageRating: r.averageRating || 0,
    }));
  });
  
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>(() => {
    const saved = localStorage.getItem('fitnutri-shopping');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('fitnutri-darkmode');
    return saved ? JSON.parse(saved) : false;
  });

  const setUser = (newUser: UserProfile | null) => {
    if (newUser && !newUser.dailyLog) {
      newUser.dailyLog = createEmptyDailyLog();
    }
    setUserState(newUser);
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem('fitnutri-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('fitnutri-user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('fitnutri-shopping', JSON.stringify(shoppingList));
  }, [shoppingList]);

  useEffect(() => {
    localStorage.setItem('fitnutri-darkmode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Check if it's a new day and reset log
  useEffect(() => {
    if (user && user.dailyLog.date !== getTodayDateString()) {
      setUser({
        ...user,
        dailyLog: createEmptyDailyLog(),
      });
    }
  }, [user]);

  const addRecipe = (recipe: Recipe) => {
    setRecipes(prev => [...prev, recipe]);
  };

  const updateRecipeStatus = (recipeId: string, status: 'pending' | 'approved' | 'rejected') => {
    setRecipes(prev => prev.map(recipe => 
      recipe.id === recipeId ? { ...recipe, status } : recipe
    ));
  };

  const addToShoppingList = (items: ShoppingItem[]) => {
    setShoppingList(prev => [...prev, ...items]);
  };

  const removeFromShoppingList = (recipeId: string) => {
    setShoppingList(prev => prev.filter(item => item.recipeId !== recipeId));
  };

  const toggleShoppingItem = (index: number) => {
    setShoppingList(prev => 
      prev.map((item, i) => 
        i === index ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const clearShoppingList = () => {
    setShoppingList([]);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev: boolean) => !prev);
  };

  // Daily tracking functions
  const markMealConsumed = (meal: Omit<ConsumedMeal, 'consumedAt'>) => {
    if (!user) return;
    
    const consumedMeal: ConsumedMeal = {
      ...meal,
      consumedAt: new Date(),
    };

    const newLog: DailyLog = {
      ...user.dailyLog,
      consumedMeals: [...user.dailyLog.consumedMeals, consumedMeal],
      totalCalories: user.dailyLog.totalCalories + meal.calories,
      totalProtein: user.dailyLog.totalProtein + meal.protein,
      totalCarbs: user.dailyLog.totalCarbs + meal.carbs,
      totalFat: user.dailyLog.totalFat + meal.fat,
    };

    setUser({
      ...user,
      dailyLog: newLog,
    });
  };

  const getDailyLog = (): DailyLog => {
    return user?.dailyLog || createEmptyDailyLog();
  };

  const getRemainingCalories = (): number => {
    if (!user) return 0;
    const targetCalories = user.tdee + (user.goals === 'lose' ? -500 : user.goals === 'gain' ? 500 : 0);
    return Math.max(0, targetCalories - user.dailyLog.totalCalories);
  };

  const getRemainingMacros = () => {
    if (!user) return { protein: 0, carbs: 0, fat: 0 };
    
    // Calculate target macros based on diet type (using first selected diet for simplicity)
    const targetCalories = user.tdee + (user.goals === 'lose' ? -500 : user.goals === 'gain' ? 500 : 0);
    const primaryDiet = user.dietTypes[0] || 'balanced';
    
    let proteinRatio = 0.3, carbsRatio = 0.4, fatRatio = 0.3;
    
    switch (primaryDiet) {
      case 'keto':
        proteinRatio = 0.25; carbsRatio = 0.05; fatRatio = 0.70;
        break;
      case 'highProtein':
        proteinRatio = 0.40; carbsRatio = 0.35; fatRatio = 0.25;
        break;
      case 'zone':
        proteinRatio = 0.30; carbsRatio = 0.40; fatRatio = 0.30;
        break;
      case 'vegan':
        proteinRatio = 0.25; carbsRatio = 0.50; fatRatio = 0.25;
        break;
    }

    const targetProtein = Math.round((targetCalories * proteinRatio) / 4);
    const targetCarbs = Math.round((targetCalories * carbsRatio) / 4);
    const targetFat = Math.round((targetCalories * fatRatio) / 9);

    return {
      protein: Math.max(0, targetProtein - user.dailyLog.totalProtein),
      carbs: Math.max(0, targetCarbs - user.dailyLog.totalCarbs),
      fat: Math.max(0, targetFat - user.dailyLog.totalFat),
    };
  };

  const resetDailyLog = () => {
    if (!user) return;
    setUser({
      ...user,
      dailyLog: createEmptyDailyLog(),
    });
  };

  // Community features
  const addComment = (recipeId: string, commentData: Omit<Comment, 'id' | 'createdAt'>) => {
    setRecipes(prev => prev.map(recipe => {
      if (recipe.id !== recipeId) return recipe;
      
      const newComment: Comment = {
        ...commentData,
        id: crypto.randomUUID(),
        createdAt: new Date(),
      };
      
      return {
        ...recipe,
        comments: [...(recipe.comments || []), newComment],
      };
    }));
  };

  const addRating = (recipeId: string, rating: number) => {
    if (!user) return;
    
    setRecipes(prev => prev.map(recipe => {
      if (recipe.id !== recipeId) return recipe;
      
      const existingRatings = recipe.ratings || [];
      const userRatingIndex = existingRatings.findIndex(r => r.userId === user.id);
      
      let newRatings: Rating[];
      if (userRatingIndex >= 0) {
        newRatings = existingRatings.map((r, i) => 
          i === userRatingIndex ? { ...r, rating, createdAt: new Date() } : r
        );
      } else {
        newRatings = [...existingRatings, { userId: user.id, rating, createdAt: new Date() }];
      }
      
      const averageRating = newRatings.reduce((sum, r) => sum + r.rating, 0) / newRatings.length;
      
      return {
        ...recipe,
        ratings: newRatings,
        averageRating: Math.round(averageRating * 10) / 10,
      };
    }));
  };

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      recipes,
      addRecipe,
      updateRecipeStatus,
      shoppingList,
      addToShoppingList,
      removeFromShoppingList,
      toggleShoppingItem,
      clearShoppingList,
      isDarkMode,
      toggleDarkMode,
      markMealConsumed,
      getDailyLog,
      getRemainingCalories,
      getRemainingMacros,
      resetDailyLog,
      addComment,
      addRating,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
