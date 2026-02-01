"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Trash2, ShoppingBag } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { INGREDIENT_CATEGORIES } from "@/types";

export default function ShoppingPage() {
  const { shoppingList, toggleShoppingItem, clearShoppingList } = useApp();

  const groupedItems = useMemo(() => {
    const groups: Record<string, typeof shoppingList> = {};
    shoppingList.forEach((item) => {
      const category = item.category || "other";
      if (!groups[category]) groups[category] = [];
      groups[category].push(item);
    });
    return groups;
  }, [shoppingList]);

  const checkedCount = shoppingList.filter((item) => item.checked).length;
  const totalCount = shoppingList.length;

  if (shoppingList.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="px-4 pt-8 pb-4">
          <div className="max-w-lg mx-auto">
            <h1 className="font-display text-2xl font-bold text-foreground">
              Списък за пазаруване
            </h1>
          </div>
        </header>
        <main className="px-4 max-w-lg mx-auto">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="font-display text-lg font-semibold text-foreground mb-2">
              Списъкът е празен
            </h2>
            <p className="text-muted-foreground text-center text-sm">
              Добавете съставки от рецепти, за да създадете вашия списък за
              пазаруване
            </p>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border px-4 py-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-xl font-semibold text-foreground">
              Списък за пазаруване
            </h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearShoppingList}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Изчисти
            </Button>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-sm text-muted-foreground mb-1">
              <span>
                {checkedCount} от {totalCount} продукта
              </span>
              <span>{Math.round((checkedCount / totalCount) * 100)}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full gradient-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(checkedCount / totalCount) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 max-w-lg mx-auto pt-4">
        {INGREDIENT_CATEGORIES.map((category) => {
          const items = groupedItems[category.id];
          if (!items || items.length === 0) return null;

          return (
            <motion.section
              key={category.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h2 className="font-semibold text-foreground mb-3">
                {category.label}
              </h2>
              <div className="space-y-2">
                {items.map((item, index) => {
                  const itemIndex = shoppingList.findIndex(
                    (i) => i.name === item.name && i.recipeId === item.recipeId
                  );
                  return (
                    <motion.div
                      key={`${item.recipeId}-${item.name}-${index}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex items-center gap-3 p-3 bg-card rounded-xl border border-border ${
                        item.checked ? "opacity-60" : ""
                      }`}
                    >
                      <Checkbox
                        checked={item.checked}
                        onCheckedChange={() => toggleShoppingItem(itemIndex)}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <div className="flex-1">
                        <p
                          className={`font-medium text-foreground ${
                            item.checked ? "line-through" : ""
                          }`}
                        >
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.amount} {item.unit} • {item.recipeName}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>
          );
        })}
      </main>

      <BottomNav />
    </div>
  );
}
