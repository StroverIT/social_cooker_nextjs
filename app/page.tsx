"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles, ChevronRight, Plus, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { BottomNav } from "@/components/BottomNav";
import { RecipeCard } from "@/components/RecipeCard";
import { CategoryFilter, TagFilter } from "@/components/CategoryFilter";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import { Button } from "@/components/ui/button";
import { CATEGORIES, TAGS, DIET_TYPES } from "@/types";

export default function HomePage() {
  const { user, recipes } = useApp();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const dietLabels = useMemo(() => {
    if (!user) return "";
    return user.dietTypes
      .map((d) => DIET_TYPES.find((dt) => dt.id === d)?.label)
      .filter(Boolean)
      .join(", ");
  }, [user]);

  const recommendedRecipes = useMemo(() => {
    if (!user) return [];
    return recipes
      .filter(
        (r) =>
          r.status === "approved" &&
          r.dietTypes.some((d) => user.dietTypes.includes(d))
      )
      .slice(0, 4);
  }, [recipes, user]);

  const filteredRecipes = useMemo(() => {
    return recipes.filter((r) => {
      if (r.status !== "approved") return false;
      if (selectedCategory && r.category !== selectedCategory) return false;
      if (
        selectedTags.length > 0 &&
        !selectedTags.some((t) => r.tags.includes(t as any))
      )
        return false;
      return true;
    });
  }, [recipes, selectedCategory, selectedTags]);

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  if (!user?.onboardingComplete) {
    return <OnboardingWizard />;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="gradient-hero px-4 pt-8 pb-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg mx-auto"
        >
          <p className="text-muted-foreground text-sm">Добър ден! 👋</p>
          <h1 className="font-display text-2xl font-bold text-foreground mt-1">
            Какво ще готвим днес?
          </h1>
          <div className="mt-4 gradient-primary rounded-xl p-4 text-primary-foreground">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-foreground/80 text-xs">Дневна цел</p>
                <p className="text-2xl font-bold">{user.tdee} kcal</p>
              </div>
              <div className="text-right">
                <p className="text-primary-foreground/80 text-xs">Диета</p>
                <p className="font-medium text-sm">{dietLabels}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </header>

      <div className="px-4 max-w-lg mx-auto -mt-3 mb-4 flex gap-2">
        <Button
          onClick={() => router.push("/submit-recipe")}
          className="flex-1"
          variant="outline"
        >
          <Plus className="h-4 w-4 mr-2" />
          Добави рецепта
        </Button>
        <Button
          onClick={() => router.push("/admin")}
          variant="ghost"
          size="icon"
          title="Админ панел"
        >
          <Shield className="h-4 w-4" />
        </Button>
      </div>

      <main className="px-4 max-w-lg mx-auto">
        <section className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-secondary" />
              <h2 className="font-display text-lg font-semibold text-foreground">
                Препоръчано за вас
              </h2>
            </div>
            <button
              onClick={() => router.push("/search")}
              className="text-primary text-sm font-medium flex items-center gap-1"
            >
              Виж всички
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto -mx-4 px-4 pb-2 scrollbar-hide">
            {recommendedRecipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0 w-64"
              >
                <RecipeCard
                  recipe={recipe}
                  onClick={() => router.push(`/recipe/${recipe.id}`)}
                />
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">
            Разгледайте всички
          </h2>

          <CategoryFilter
            categories={CATEGORIES}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          <div className="mt-3">
            <TagFilter
              tags={TAGS}
              selectedTags={selectedTags}
              onToggleTag={toggleTag}
            />
          </div>

          <div className="mt-4 grid gap-4">
            {filteredRecipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <RecipeCard
                  recipe={recipe}
                  variant="compact"
                  onClick={() => router.push(`/recipe/${recipe.id}`)}
                />
              </motion.div>
            ))}

            {filteredRecipes.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Няма намерени рецепти с избраните филтри
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
