import { motion } from 'framer-motion';
import { CategoryLabel, TagLabel } from '@/types';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  categories: CategoryLabel[];
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
}

export function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
      <FilterButton
        active={selectedCategory === null}
        onClick={() => onSelectCategory(null)}
      >
        🍽️ Всички
      </FilterButton>
      {categories.map(cat => (
        <FilterButton
          key={cat.id}
          active={selectedCategory === cat.id}
          onClick={() => onSelectCategory(cat.id)}
        >
          {cat.icon} {cat.label}
        </FilterButton>
      ))}
    </div>
  );
}

interface TagFilterProps {
  tags: TagLabel[];
  selectedTags: string[];
  onToggleTag: (id: string) => void;
}

export function TagFilter({ tags, selectedTags, onToggleTag }: TagFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
      {tags.map(tag => (
        <FilterButton
          key={tag.id}
          active={selectedTags.includes(tag.id)}
          onClick={() => onToggleTag(tag.id)}
          variant="small"
        >
          {tag.label}
        </FilterButton>
      ))}
    </div>
  );
}

interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'default' | 'small';
}

function FilterButton({ active, onClick, children, variant = 'default' }: FilterButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "flex-shrink-0 rounded-full font-medium transition-colors whitespace-nowrap",
        variant === 'small' ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
        active 
          ? "gradient-primary text-primary-foreground" 
          : "bg-muted text-muted-foreground hover:bg-accent"
      )}
    >
      {children}
    </motion.button>
  );
}
