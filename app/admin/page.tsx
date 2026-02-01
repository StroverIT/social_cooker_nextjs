"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  X,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useApp } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";
import { Recipe, CATEGORIES, DIET_TYPES } from "@/types";

export default function AdminPage() {
  const router = useRouter();
  const { recipes, updateRecipeStatus } = useApp();
  const { toast } = useToast();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const pendingRecipes = recipes.filter((r) => r.status === "pending");
  const approvedRecipes = recipes.filter((r) => r.status === "approved");
  const rejectedRecipes = recipes.filter((r) => r.status === "rejected");

  const handleApprove = (recipeId: string) => {
    updateRecipeStatus(recipeId, "approved");
    toast({
      title: "Рецептата е одобрена!",
      description: "Рецептата вече е видима за всички потребители.",
    });
    setSelectedRecipe(null);
  };

  const handleReject = (recipeId: string) => {
    updateRecipeStatus(recipeId, "rejected");
    toast({
      title: "Рецептата е отхвърлена",
      description: "Авторът ще бъде уведомен.",
      variant: "destructive",
    });
    setSelectedRecipe(null);
  };

  const getCategoryLabel = (categoryId: string) => {
    return CATEGORIES.find((c) => c.id === categoryId)?.label || categoryId;
  };

  const getDietLabels = (dietTypes: Recipe["dietTypes"]) => {
    return dietTypes.map(
      (dt) => DIET_TYPES.find((d) => d.id === dt)?.label || dt
    );
  };

  const RecipePreviewDialog = ({ recipe }: { recipe: Recipe }) => (
    <Dialog
      open={selectedRecipe?.id === recipe.id}
      onOpenChange={(open) => !open && setSelectedRecipe(null)}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Преглед на рецепта
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="aspect-video rounded-lg overflow-hidden bg-muted">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold">{recipe.title}</h2>
            <p className="text-muted-foreground">
              {getCategoryLabel(recipe.category)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {getDietLabels(recipe.dietTypes).map((label, idx) => (
              <Badge key={idx} variant="secondary">
                {label}
              </Badge>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-3 p-3 bg-muted rounded-lg">
            <div className="text-center">
              <p className="text-lg font-bold">{recipe.macros.calories}</p>
              <p className="text-xs text-muted-foreground">kcal</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-macro-protein">
                {recipe.macros.protein}г
              </p>
              <p className="text-xs text-muted-foreground">Протеини</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-macro-carbs">
                {recipe.macros.carbs}г
              </p>
              <p className="text-xs text-muted-foreground">Въглехидрати</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-macro-fat">
                {recipe.macros.fat}г
              </p>
              <p className="text-xs text-muted-foreground">Мазнини</p>
            </div>
          </div>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>⏱️ Подготовка: {recipe.prepTime} мин</span>
            <span>🍳 Готвене: {recipe.cookTime} мин</span>
            <span>🍽️ Порции: {recipe.servings}</span>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Съставки</h3>
            <ul className="list-disc list-inside space-y-1">
              {recipe.ingredients.map((ing, idx) => (
                <li key={idx} className="text-sm">
                  {ing.name} - {ing.amount} {ing.unit}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Стъпки за приготвяне</h3>
            <ol className="list-decimal list-inside space-y-2">
              {recipe.instructions.map((inst, idx) => (
                <li key={idx} className="text-sm">
                  {inst}
                </li>
              ))}
            </ol>
          </div>
          {recipe.status === "pending" && (
            <div className="flex gap-3 pt-4 border-t">
              <Button
                className="flex-1"
                onClick={() => handleApprove(recipe.id)}
              >
                <Check className="h-4 w-4 mr-2" />
                Одобри
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => handleReject(recipe.id)}
              >
                <X className="h-4 w-4 mr-2" />
                Отхвърли
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  const RecipeCardItem = ({ recipe }: { recipe: Recipe }) => (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex gap-4 p-4">
        <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{recipe.title}</h3>
          <p className="text-sm text-muted-foreground">
            {getCategoryLabel(recipe.category)}
          </p>
          <div className="flex gap-2 mt-1">
            <Badge variant="outline" className="text-xs">
              {recipe.macros.calories} kcal
            </Badge>
            <Badge variant="outline" className="text-xs">
              {recipe.servings} порции
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {new Date(recipe.createdAt).toLocaleDateString("bg-BG")}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedRecipe(recipe)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          {recipe.status === "pending" && (
            <>
              <Button size="sm" onClick={() => handleApprove(recipe.id)}>
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleReject(recipe.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
      {selectedRecipe?.id === recipe.id && (
        <RecipePreviewDialog recipe={recipe} />
      )}
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="flex items-center gap-3 p-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h1 className="font-display text-xl font-bold">Админ панел</h1>
          </div>
        </div>
      </header>

      <div className="p-4">
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-6 w-6 mx-auto mb-1 text-yellow-500" />
              <p className="text-2xl font-bold">{pendingRecipes.length}</p>
              <p className="text-xs text-muted-foreground">Чакащи</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-6 w-6 mx-auto mb-1 text-green-500" />
              <p className="text-2xl font-bold">{approvedRecipes.length}</p>
              <p className="text-xs text-muted-foreground">Одобрени</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <XCircle className="h-6 w-6 mx-auto mb-1 text-red-500" />
              <p className="text-2xl font-bold">{rejectedRecipes.length}</p>
              <p className="text-xs text-muted-foreground">Отхвърлени</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList className="w-full">
            <TabsTrigger value="pending" className="flex-1">
              Чакащи ({pendingRecipes.length})
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex-1">
              Одобрени
            </TabsTrigger>
            <TabsTrigger value="rejected" className="flex-1">
              Отхвърлени
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-3">
            {pendingRecipes.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Няма рецепти за преглед</p>
                </CardContent>
              </Card>
            ) : (
              pendingRecipes.map((recipe) => (
                <RecipeCardItem key={recipe.id} recipe={recipe} />
              ))
            )}
          </TabsContent>

          <TabsContent value="approved" className="space-y-3">
            {approvedRecipes.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Няма одобрени рецепти</p>
                </CardContent>
              </Card>
            ) : (
              approvedRecipes.map((recipe) => (
                <RecipeCardItem key={recipe.id} recipe={recipe} />
              ))
            )}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-3">
            {rejectedRecipes.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  <XCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Няма отхвърлени рецепти</p>
                </CardContent>
              </Card>
            ) : (
              rejectedRecipes.map((recipe) => (
                <RecipeCardItem key={recipe.id} recipe={recipe} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
