import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GenderStepProps {
  value: string;
  onChange: (value: 'male' | 'female') => void;
}

export function GenderStep({ value, onChange }: GenderStepProps) {
  return (
    <div className="flex flex-col items-center pt-8">
      <h1 className="font-display text-3xl font-bold text-foreground text-center mb-2">
        Добре дошли!
      </h1>
      <p className="text-muted-foreground text-center mb-12">
        Нека персонализираме вашето изживяване
      </p>

      <div className="flex gap-4 w-full max-w-sm">
        <GenderButton
          selected={value === 'male'}
          onClick={() => onChange('male')}
          emoji="👨"
          label="Мъж"
        />
        <GenderButton
          selected={value === 'female'}
          onClick={() => onChange('female')}
          emoji="👩"
          label="Жена"
        />
      </div>
    </div>
  );
}

interface GenderButtonProps {
  selected: boolean;
  onClick: () => void;
  emoji: string;
  label: string;
}

function GenderButton({ selected, onClick, emoji, label }: GenderButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "flex-1 flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all",
        selected 
          ? "border-primary bg-accent shadow-lg" 
          : "border-border bg-card hover:border-primary/50"
      )}
    >
      <span className="text-5xl mb-3">{emoji}</span>
      <span className={cn(
        "font-medium",
        selected ? "text-primary" : "text-foreground"
      )}>
        {label}
      </span>
    </motion.button>
  );
}
