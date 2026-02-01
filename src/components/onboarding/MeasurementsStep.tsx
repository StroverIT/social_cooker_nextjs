import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface MeasurementsStepProps {
  age: number;
  weight: number;
  height: number;
  onAgeChange: (value: number) => void;
  onWeightChange: (value: number) => void;
  onHeightChange: (value: number) => void;
}

export function MeasurementsStep({
  age,
  weight,
  height,
  onAgeChange,
  onWeightChange,
  onHeightChange,
}: MeasurementsStepProps) {
  return (
    <div className="pt-8">
      <h1 className="font-display text-3xl font-bold text-foreground text-center mb-2">
        Вашите измервания
      </h1>
      <p className="text-muted-foreground text-center mb-10">
        Това ни помага да изчислим вашите нужди
      </p>

      <div className="space-y-8 max-w-sm mx-auto">
        {/* Age */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-base font-medium">Възраст</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={age}
                onChange={(e) => onAgeChange(Number(e.target.value))}
                className="w-20 text-center text-lg font-semibold"
              />
              <span className="text-muted-foreground">години</span>
            </div>
          </div>
          <Slider
            value={[age]}
            onValueChange={([v]) => onAgeChange(v)}
            min={16}
            max={80}
            step={1}
            className="w-full"
          />
        </div>

        {/* Weight */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-base font-medium">Тегло</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={weight}
                onChange={(e) => onWeightChange(Number(e.target.value))}
                className="w-20 text-center text-lg font-semibold"
              />
              <span className="text-muted-foreground">кг</span>
            </div>
          </div>
          <Slider
            value={[weight]}
            onValueChange={([v]) => onWeightChange(v)}
            min={40}
            max={150}
            step={1}
            className="w-full"
          />
        </div>

        {/* Height */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-base font-medium">Височина</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={height}
                onChange={(e) => onHeightChange(Number(e.target.value))}
                className="w-20 text-center text-lg font-semibold"
              />
              <span className="text-muted-foreground">см</span>
            </div>
          </div>
          <Slider
            value={[height]}
            onValueChange={([v]) => onHeightChange(v)}
            min={140}
            max={220}
            step={1}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
