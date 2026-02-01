import { cn } from '@/lib/utils';
import { calculateZoneBlocks } from '@/types';

interface MacroDisplayProps {
  protein: number;
  carbs: number;
  fat: number;
  calories?: number;
  showZoneBlocks?: boolean;
  variant?: 'default' | 'compact';
  className?: string;
}

export function MacroDisplay({ 
  protein, 
  carbs, 
  fat, 
  calories, 
  showZoneBlocks = false,
  variant = 'default',
  className 
}: MacroDisplayProps) {
  const zoneBlocks = showZoneBlocks ? calculateZoneBlocks({ protein, carbs, fat }) : null;

  if (variant === 'compact') {
    return (
      <div className={cn("flex gap-2 text-xs", className)}>
        <span className="px-2 py-1 rounded-md bg-macro-protein text-macro-protein-foreground font-medium">
          П: {protein}г
        </span>
        <span className="px-2 py-1 rounded-md bg-macro-carbs text-macro-carbs-foreground font-medium">
          В: {carbs}г
        </span>
        <span className="px-2 py-1 rounded-md bg-macro-fat text-macro-fat-foreground font-medium">
          М: {fat}г
        </span>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-2", calories ? "grid-cols-4" : "grid-cols-3", className)}>
      <div className="bg-macro-protein rounded-xl p-3 text-center">
        <p className="text-xl font-bold text-macro-protein-foreground">{protein}</p>
        <p className="text-xs text-macro-protein-foreground/80">г Протеин</p>
        {showZoneBlocks && zoneBlocks && (
          <p className="text-[10px] text-macro-protein-foreground/60 mt-1">
            {zoneBlocks.proteinBlocks} блока
          </p>
        )}
      </div>
      <div className="bg-macro-carbs rounded-xl p-3 text-center">
        <p className="text-xl font-bold text-macro-carbs-foreground">{carbs}</p>
        <p className="text-xs text-macro-carbs-foreground/80">г Въглехидрати</p>
        {showZoneBlocks && zoneBlocks && (
          <p className="text-[10px] text-macro-carbs-foreground/60 mt-1">
            {zoneBlocks.carbBlocks} блока
          </p>
        )}
      </div>
      <div className="bg-macro-fat rounded-xl p-3 text-center">
        <p className="text-xl font-bold text-macro-fat-foreground">{fat}</p>
        <p className="text-xs text-macro-fat-foreground/80">г Мазнини</p>
        {showZoneBlocks && zoneBlocks && (
          <p className="text-[10px] text-macro-fat-foreground/60 mt-1">
            {zoneBlocks.fatBlocks} блока
          </p>
        )}
      </div>
      {calories !== undefined && (
        <div className="bg-macro-calories rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-macro-calories-foreground">{calories}</p>
          <p className="text-xs text-macro-calories-foreground/80">kcal</p>
        </div>
      )}
    </div>
  );
}
