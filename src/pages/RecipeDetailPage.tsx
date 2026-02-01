import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Clock, Users, Flame, Plus, Minus, 
  ChefHat, ShoppingCart, Check, Timer, ChevronRight
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { CATEGORIES, TAGS, ShoppingItem, calculateZoneBlocks } from '@/types';
import { cn } from '@/lib/utils';
import { MacroDisplay } from '@/components/MacroDisplay';
import { RecipeRating } from '@/components/recipe/RecipeRating';
import { RecipeComments } from '@/components/recipe/RecipeComments';
import { ReportDialog } from '@/components/recipe/ReportDialog';
import { ConsumeButton } from '@/components/recipe/ConsumeButton';

export default function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, recipes, shoppingList, addToShoppingList, removeFromShoppingList } = useApp();
  const [servings, setServings] = useState(1);
  const [cookingMode, setCookingMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const recipe = recipes.find(r => r.id === id);

  if (!recipe) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Рецептата не е намерена</p>
          <Button onClick={() => navigate(-1)}>Назад</Button>
        </div>
      </div>
    );
  }

  const category = CATEGORIES.find(c => c.id === recipe.category);
  const multiplier = servings / recipe.servings;
  const isInShoppingList = shoppingList.some(item => item.recipeId === recipe.id);
  const showZoneBlocks = user?.dietTypes.includes('zone') || recipe.dietTypes.includes('zone');
  
  const scaledMacros = {
    protein: Math.round(recipe.macros.protein * multiplier),
    carbs: Math.round(recipe.macros.carbs * multiplier),
    fat: Math.round(recipe.macros.fat * multiplier),
    calories: Math.round(recipe.macros.calories * multiplier),
  };
  
  const zoneBlocks = showZoneBlocks ? calculateZoneBlocks(scaledMacros) : null;

  const handleAddToShoppingList = () => {
    if (isInShoppingList) {
      removeFromShoppingList(recipe.id);
    } else {
      const items: ShoppingItem[] = recipe.ingredients.map(ing => ({
        ...ing,
        amount: Math.round(ing.amount * multiplier * 10) / 10,
        recipeId: recipe.id,
        recipeName: recipe.title,
        checked: false,
      }));
      addToShoppingList(items);
    }
  };

  if (cookingMode) {
    return (
      <div className="min-h-screen bg-foreground text-background">
        {/* Cooking Mode Header */}
        <header className="flex items-center justify-between p-4 border-b border-background/20">
          <button onClick={() => setCookingMode(false)}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-display text-lg font-semibold">Режим готвене</h1>
          <div className="flex items-center gap-2">
            <Timer className="w-5 h-5" />
            <span>{recipe.cookTime} мин</span>
          </div>
        </header>

        {/* Step Display */}
        <main className="p-6">
          <div className="mb-8">
            <p className="text-background/60 text-sm mb-2">
              Стъпка {currentStep + 1} от {recipe.instructions.length}
            </p>
            <div className="flex gap-1">
              {recipe.instructions.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex-1 h-1 rounded-full transition-colors",
                    index <= currentStep ? "bg-primary" : "bg-background/30"
                  )}
                />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="min-h-[200px]"
            >
              <p className="text-3xl font-display leading-relaxed">
                {recipe.instructions[currentStep]}
              </p>
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Navigation */}
        <footer className="fixed bottom-0 left-0 right-0 p-4 safe-bottom flex gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="flex-1 bg-transparent border-background/30 text-background hover:bg-background/10"
          >
            Назад
          </Button>
          <Button
            size="lg"
            onClick={() => {
              if (currentStep < recipe.instructions.length - 1) {
                setCurrentStep(currentStep + 1);
              } else {
                setCookingMode(false);
              }
            }}
            className="flex-1 gradient-primary text-primary-foreground border-0"
          >
            {currentStep < recipe.instructions.length - 1 ? 'Напред' : 'Готово'}
            <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Image Header */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img 
          src={recipe.image} 
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>

        <div className="absolute bottom-4 left-4 right-4">
          <span className="px-3 py-1 bg-card/90 backdrop-blur-sm rounded-full text-sm font-medium">
            {category?.icon} {category?.label}
          </span>
          <h1 className="font-display text-2xl font-bold text-foreground mt-2">
            {recipe.title}
          </h1>
        </div>
      </div>

      <main className="px-4 max-w-lg mx-auto -mt-2">
        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 py-4 border-b border-border"
        >
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{recipe.prepTime + recipe.cookTime} мин</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Flame className="w-4 h-4 text-secondary" />
            <span>{scaledMacros.calories} kcal</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{servings} порции</span>
          </div>
        </motion.div>

        {/* Rating */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="py-4 border-b border-border"
        >
          <RecipeRating 
            recipeId={recipe.id}
            averageRating={recipe.averageRating}
            totalRatings={recipe.ratings?.length || 0}
          />
        </motion.div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 py-4">
          {recipe.tags.map(tagId => {
            const tag = TAGS.find(t => t.id === tagId);
            return (
              <span 
                key={tagId}
                className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm"
              >
                {tag?.label}
              </span>
            );
          })}
        </div>

        {/* Macros with distinct colors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <MacroDisplay
            protein={scaledMacros.protein}
            carbs={scaledMacros.carbs}
            fat={scaledMacros.fat}
            calories={scaledMacros.calories}
            showZoneBlocks={showZoneBlocks}
          />
          
          {showZoneBlocks && zoneBlocks && (
            <div className="mt-2 bg-accent/50 rounded-lg p-3">
              <p className="text-xs text-center text-muted-foreground">
                <span className="font-semibold">Зонова диета:</span>{' '}
                {zoneBlocks.proteinBlocks} Блока Протеини • {zoneBlocks.carbBlocks} Блока Въглехидрати • {zoneBlocks.fatBlocks} Блока Мазнини
              </p>
            </div>
          )}
        </motion.div>

        {/* Servings Adjuster */}
        <div className="flex items-center justify-between py-4 border-y border-border mb-6">
          <span className="font-medium text-foreground">Порции</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setServings(Math.max(1, servings - 1))}
              className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-foreground"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-xl font-bold text-foreground w-8 text-center">{servings}</span>
            <button
              onClick={() => setServings(servings + 1)}
              className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-foreground"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Ingredients */}
        <section className="mb-6">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">
            Съставки
          </h2>
          <div className="space-y-2">
            {recipe.ingredients.map((ing, index) => (
              <div 
                key={index}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <span className="text-foreground">{ing.name}</span>
                <span className="text-muted-foreground">
                  {Math.round(ing.amount * multiplier * 10) / 10} {ing.unit}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Instructions */}
        <section className="mb-6">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">
            Приготвяне
          </h2>
          <div className="space-y-4">
            {recipe.instructions.map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="w-8 h-8 rounded-full gradient-primary flex-shrink-0 flex items-center justify-center text-primary-foreground font-semibold text-sm">
                  {index + 1}
                </div>
                <p className="text-foreground pt-1">{step}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Report Button */}
        <div className="flex justify-center mb-6">
          <ReportDialog recipeId={recipe.id} recipeName={recipe.title} />
        </div>

        {/* Comments Section */}
        <RecipeComments recipeId={recipe.id} comments={recipe.comments || []} />
      </main>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border safe-bottom">
        <div className="flex gap-3 max-w-lg mx-auto">
          <Button
            variant="outline"
            size="lg"
            onClick={handleAddToShoppingList}
            className={cn(
              "flex-1",
              isInShoppingList && "border-primary text-primary"
            )}
          >
            {isInShoppingList ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                В списъка
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5 mr-2" />
                Добави
              </>
            )}
          </Button>
          
          <ConsumeButton recipe={recipe} servings={servings} />
          
          <Button
            size="lg"
            onClick={() => setCookingMode(true)}
            className="flex-1 gradient-primary text-primary-foreground border-0"
          >
            <ChefHat className="w-5 h-5 mr-2" />
            Готви
          </Button>
        </div>
      </div>
    </div>
  );
}