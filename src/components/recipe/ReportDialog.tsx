import { useState } from 'react';
import { Flag, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

interface ReportDialogProps {
  recipeId: string;
  recipeName: string;
}

const REPORT_REASONS = [
  { id: 'wrong-ingredients', label: 'Грешни съставки' },
  { id: 'wrong-instructions', label: 'Грешни инструкции' },
  { id: 'wrong-macros', label: 'Грешни хранителни стойности' },
  { id: 'inappropriate', label: 'Неподходящо съдържание' },
  { id: 'other', label: 'Друго' },
];

export function ReportDialog({ recipeId, recipeName }: ReportDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedReason) return;
    
    setIsSubmitting(true);
    
    // In a real app, this would send to backend
    // For now, just show success toast
    await new Promise(resolve => setTimeout(resolve, 500));
    
    toast({
      title: "Благодарим ви!",
      description: "Докладът е изпратен успешно. Ще го прегледаме скоро.",
    });
    
    setOpen(false);
    setSelectedReason('');
    setDetails('');
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
          <Flag className="w-4 h-4 mr-1" />
          Докладвай грешка
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            Докладвай грешка
          </DialogTitle>
          <DialogDescription>
            Докладвай проблем с рецептата "{recipeName}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Причина:</p>
            <div className="space-y-2">
              {REPORT_REASONS.map((reason) => (
                <label
                  key={reason.id}
                  className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedReason === reason.id
                      ? 'border-primary bg-accent'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={reason.id}
                    checked={selectedReason === reason.id}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="sr-only"
                  />
                  <span className={`text-sm ${selectedReason === reason.id ? 'text-primary font-medium' : 'text-foreground'}`}>
                    {reason.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Допълнителни детайли:</p>
            <Textarea
              placeholder="Опишете проблема по-подробно..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Отказ
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedReason || isSubmitting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Изпрати доклад
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
