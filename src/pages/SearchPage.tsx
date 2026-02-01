import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { useApp } from '@/context/AppContext';
import { BottomNav } from '@/components/BottomNav';
import { RecipeCard } from '@/components/RecipeCard';
import { CategoryFilter, TagFilter } from '@/components/CategoryFilter';
import { CATEGORIES, TAGS } from '@/types';

export default function SearchPage() {
  const { recipes } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredRecipes = useMemo(() => {
    return recipes.filter(r => {
      if (r.status !== 'approved') return false;
      if (selectedCategory && r.category !== selectedCategory) return false;
      if (selectedTags.length > 0 && !selectedTags.some(t => r.tags.includes(t as any))) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const titleMatch = r.title.toLowerCase().includes(query);
        const ingredientMatch = r.ingredients.some(i => 
          i.name.toLowerCase().includes(query)
        );
        if (!titleMatch && !ingredientMatch) return false;
      }
      return true;
    });
  }, [recipes, selectedCategory, selectedTags, searchQuery]);

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(t => t !== tagId)
        : [...prev, tagId]
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border px-4 py-4">
        <div className="max-w-lg mx-auto">
          <h1 className="font-display text-xl font-semibold text-foreground mb-4">
            Търсене
          </h1>
          
          {/* Search Input */}
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Търси рецепти или съставки..."
              className="pl-10 pr-10 h-12 rounded-xl bg-muted border-0"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="px-4 max-w-lg mx-auto pt-4">
        {/* Filters */}
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

        {/* Results */}
        <div className="mt-6">
          <p className="text-sm text-muted-foreground mb-4">
            {filteredRecipes.length} рецепти
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {filteredRecipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <RecipeCard 
                  recipe={recipe}
                  onClick={() => navigate(`/recipe/${recipe.id}`)}
                />
              </motion.div>
            ))}
          </div>

          {filteredRecipes.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-muted-foreground">
                Няма намерени рецепти
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Опитайте с други думи или филтри
              </p>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
