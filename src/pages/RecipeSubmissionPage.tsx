import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { Recipe, Ingredient, CATEGORIES, TAGS, DIET_TYPES, INGREDIENT_CATEGORIES } from '@/types';
import { BottomNav } from '@/components/BottomNav';

const emptyIngredient: Ingredient = {
  name: '',
  amount: 0,
  unit: 'г',
  category: 'other',
};

export default function RecipeSubmissionPage() {
  const navigate = useNavigate();
  const { user, addRecipe } = useApp();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState<Recipe['category']>('lunch');
  const [selectedTags, setSelectedTags] = useState<Recipe['tags'][number][]>([]);
  const [selectedDietTypes, setSelectedDietTypes] = useState<Recipe['dietTypes']>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ ...emptyIngredient }]);
  const [instructions, setInstructions] = useState<string[]>(['']);
  const [prepTime, setPrepTime] = useState(15);
  const [cookTime, setCookTime] = useState(30);
  const [servings, setServings] = useState(4);
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fat, setFat] = useState(0);

  const calculateCalories = () => {
    return Math.round(protein * 4 + carbs * 4 + fat * 9);
  };

  const toggleTag = (tagId: Recipe['tags'][number]) => {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
    );
  };

  const toggleDietType = (dietId: Recipe['dietTypes'][number]) => {
    setSelectedDietTypes(prev =>
      prev.includes(dietId) ? prev.filter(d => d !== dietId) : [...prev, dietId]
    );
  };

  const addIngredient = () => {
    setIngredients(prev => [...prev, { ...emptyIngredient }]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string | number) => {
    setIngredients(prev =>
      prev.map((ing, i) => (i === index ? { ...ing, [field]: value } : ing))
    );
  };

  const addInstruction = () => {
    setInstructions(prev => [...prev, '']);
  };

  const removeInstruction = (index: number) => {
    if (instructions.length > 1) {
      setInstructions(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateInstruction = (index: number, value: string) => {
    setInstructions(prev => prev.map((inst, i) => (i === index ? value : inst)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) {
      toast({ title: 'Грешка', description: 'Моля, въведете име на рецептата', variant: 'destructive' });
      return;
    }
    if (ingredients.some(ing => !ing.name.trim() || ing.amount <= 0)) {
      toast({ title: 'Грешка', description: 'Моля, попълнете всички съставки коректно', variant: 'destructive' });
      return;
    }
    if (instructions.some(inst => !inst.trim())) {
      toast({ title: 'Грешка', description: 'Моля, попълнете всички стъпки за приготвяне', variant: 'destructive' });
      return;
    }

    const newRecipe: Recipe = {
      id: crypto.randomUUID(),
      title: title.trim(),
      image: image || '/placeholder.svg',
      category,
      tags: selectedTags,
      dietTypes: selectedDietTypes.length > 0 ? selectedDietTypes : ['balanced'],
      ingredients: ingredients.filter(ing => ing.name.trim()),
      instructions: instructions.filter(inst => inst.trim()),
      macros: {
        protein,
        carbs,
        fat,
        calories: calculateCalories(),
      },
      prepTime,
      cookTime,
      servings,
      authorId: user?.id || 'anonymous',
      status: 'pending',
      createdAt: new Date(),
      ratings: [],
      comments: [],
      averageRating: 0,
    };

    addRecipe(newRecipe);
    toast({
      title: 'Рецептата е изпратена!',
      description: 'Вашата рецепта ще бъде прегледана от администратор преди публикуване.',
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="flex items-center gap-3 p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-display text-xl font-bold">Добави рецепта</h1>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Име на рецептата *</Label>
            <Input
              id="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="напр. Пилешко с броколи"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="image">URL на снимка</Label>
            <Input
              id="image"
              value={image}
              onChange={e => setImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="mt-1"
            />
          </div>

          <div>
            <Label>Категория</Label>
            <Select value={category} onValueChange={(v: Recipe['category']) => setCategory(v)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.icon} {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <Label>Тагове</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {TAGS.map(tag => (
              <Button
                key={tag.id}
                type="button"
                variant={selectedTags.includes(tag.id) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleTag(tag.id)}
              >
                {tag.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Diet Types */}
        <div>
          <Label>Типове диета</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {DIET_TYPES.map(diet => (
              <Button
                key={diet.id}
                type="button"
                variant={selectedDietTypes.includes(diet.id) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleDietType(diet.id)}
              >
                {diet.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Timing & Servings */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="prepTime">Подготовка (мин)</Label>
            <Input
              id="prepTime"
              type="number"
              value={prepTime}
              onChange={e => setPrepTime(Number(e.target.value))}
              min={0}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="cookTime">Готвене (мин)</Label>
            <Input
              id="cookTime"
              type="number"
              value={cookTime}
              onChange={e => setCookTime(Number(e.target.value))}
              min={0}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="servings">Порции</Label>
            <Input
              id="servings"
              type="number"
              value={servings}
              onChange={e => setServings(Number(e.target.value))}
              min={1}
              className="mt-1"
            />
          </div>
        </div>

        {/* Macros */}
        <div className="space-y-3">
          <Label>Хранителни стойности (на порция)</Label>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="protein" className="text-macro-protein text-xs">Протеини (г)</Label>
              <Input
                id="protein"
                type="number"
                value={protein}
                onChange={e => setProtein(Number(e.target.value))}
                min={0}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="carbs" className="text-macro-carbs text-xs">Въглехидрати (г)</Label>
              <Input
                id="carbs"
                type="number"
                value={carbs}
                onChange={e => setCarbs(Number(e.target.value))}
                min={0}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="fat" className="text-macro-fat text-xs">Мазнини (г)</Label>
              <Input
                id="fat"
                type="number"
                value={fat}
                onChange={e => setFat(Number(e.target.value))}
                min={0}
                className="mt-1"
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Калории: <span className="font-semibold">{calculateCalories()} kcal</span>
          </p>
        </div>

        {/* Ingredients */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Съставки *</Label>
            <Button type="button" variant="outline" size="sm" onClick={addIngredient}>
              <Plus className="h-4 w-4 mr-1" /> Добави
            </Button>
          </div>
          {ingredients.map((ing, idx) => (
            <div key={idx} className="flex gap-2 items-start">
              <Input
                placeholder="Съставка"
                value={ing.name}
                onChange={e => updateIngredient(idx, 'name', e.target.value)}
                className="flex-1"
              />
              <Input
                type="number"
                placeholder="Кол."
                value={ing.amount || ''}
                onChange={e => updateIngredient(idx, 'amount', Number(e.target.value))}
                className="w-20"
                min={0}
              />
              <Select
                value={ing.unit}
                onValueChange={v => updateIngredient(idx, 'unit', v)}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="г">г</SelectItem>
                  <SelectItem value="мл">мл</SelectItem>
                  <SelectItem value="бр">бр</SelectItem>
                  <SelectItem value="с.л.">с.л.</SelectItem>
                  <SelectItem value="ч.л.">ч.л.</SelectItem>
                  <SelectItem value="чаша">чаша</SelectItem>
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeIngredient(idx)}
                disabled={ingredients.length === 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Стъпки за приготвяне *</Label>
            <Button type="button" variant="outline" size="sm" onClick={addInstruction}>
              <Plus className="h-4 w-4 mr-1" /> Добави
            </Button>
          </div>
          {instructions.map((inst, idx) => (
            <div key={idx} className="flex gap-2 items-start">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-semibold shrink-0">
                {idx + 1}
              </span>
              <Textarea
                placeholder={`Стъпка ${idx + 1}...`}
                value={inst}
                onChange={e => updateInstruction(idx, e.target.value)}
                className="flex-1 min-h-[60px]"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeInstruction(idx)}
                disabled={instructions.length === 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full" size="lg">
          <Upload className="h-5 w-5 mr-2" />
          Изпрати за преглед
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Рецептата ще бъде прегледана от администратор преди да бъде публикувана.
        </p>
      </form>

      <BottomNav />
    </div>
  );
}
