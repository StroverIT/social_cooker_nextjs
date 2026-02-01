import { motion } from 'framer-motion';
import { User, Moon, Sun, LogOut, Edit, Flame, Target, Activity, Utensils, RotateCcw } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { calculateTargetCalories, calculateMacros } from '@/lib/calculations';
import { GOALS, DIET_TYPES, ACTIVITY_LEVELS } from '@/types';
import { MacroDisplay } from '@/components/MacroDisplay';
import { Progress } from '@/components/ui/progress';

export default function ProfilePage() {
  const { user, setUser, isDarkMode, toggleDarkMode, getDailyLog, getRemainingCalories, resetDailyLog } = useApp();

  if (!user) {
    return (
      <div className="min-h-screen bg-background pb-20 flex items-center justify-center">
        <p className="text-muted-foreground">Моля, завършете регистрацията</p>
        <BottomNav />
      </div>
    );
  }

  const targetCalories = calculateTargetCalories(user.tdee, user.goals);
  const primaryDiet = user.dietTypes[0] as typeof DIET_TYPES[number]['id'];
  const macros = calculateMacros(targetCalories, primaryDiet);
  const goalData = GOALS.find(g => g.id === user.goals);
  const dietLabels = user.dietTypes.map(d => DIET_TYPES.find(dt => dt.id === d)?.label).filter(Boolean).join(', ');
  const activityData = ACTIVITY_LEVELS.find(a => a.id === user.activityLevel);
  
  const dailyLog = getDailyLog();
  const remainingCalories = getRemainingCalories();
  const calorieProgress = Math.min(100, (dailyLog.totalCalories / targetCalories) * 100);
  const showZoneBlocks = user.dietTypes.includes('zone');

  const handleReset = () => {
    if (confirm('Сигурни ли сте, че искате да нулирате профила си?')) {
      setUser(null);
    }
  };

  const handleResetDailyLog = () => {
    if (confirm('Сигурни ли сте, че искате да нулирате дневния лог?')) {
      resetDailyLog();
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="gradient-hero px-4 pt-8 pb-6">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">
                {user.gender === 'male' ? 'Потребител' : 'Потребителка'}
              </h1>
              <p className="text-muted-foreground text-sm">
                {user.age} години • {user.weight} кг • {user.height} см
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 max-w-lg mx-auto -mt-2">
        {/* Daily Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl p-4 border border-border mb-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Utensils className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Дневен прогрес</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetDailyLog}
              className="text-muted-foreground hover:text-destructive"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">
                {dailyLog.totalCalories} / {targetCalories} kcal
              </span>
              <span className="font-medium text-foreground">
                {remainingCalories} kcal оставащи
              </span>
            </div>
            <Progress value={calorieProgress} className="h-3" />
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div>
              <p className="text-muted-foreground">Консумирано</p>
              <p className="font-bold text-foreground">{dailyLog.consumedMeals.length} ястия</p>
            </div>
            <div>
              <p className="text-muted-foreground">Протеин</p>
              <p className="font-bold text-macro-protein">{dailyLog.totalProtein}г / {macros.protein}г</p>
            </div>
            <div>
              <p className="text-muted-foreground">Въглехидрати</p>
              <p className="font-bold text-macro-carbs">{dailyLog.totalCarbs}г / {macros.carbs}г</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <div className="bg-card rounded-xl p-4 border border-border text-center">
            <Flame className="w-5 h-5 text-secondary mx-auto mb-1" />
            <p className="text-xl font-bold text-foreground">{targetCalories}</p>
            <p className="text-xs text-muted-foreground">kcal/ден</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border text-center">
            <Target className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-xl font-bold text-foreground">{user.bmr}</p>
            <p className="text-xs text-muted-foreground">Базов метаболизъм</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border text-center">
            <Activity className="w-5 h-5 text-info mx-auto mb-1" />
            <p className="text-xl font-bold text-foreground">{user.tdee}</p>
            <p className="text-xs text-muted-foreground">Дневен разход</p>
          </div>
        </motion.div>

        {/* Macros with distinct colors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl p-4 border border-border mb-6"
        >
          <h3 className="font-semibold text-foreground mb-4">Дневни макроси</h3>
          <MacroDisplay
            protein={macros.protein}
            carbs={macros.carbs}
            fat={macros.fat}
            showZoneBlocks={showZoneBlocks}
          />
        </motion.div>

        {/* Profile Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl border border-border mb-6"
        >
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Настройки на профила</h3>
          </div>
          
          <div className="divide-y divide-border">
            <InfoRow label="Цел" value={goalData?.label || ''} />
            <InfoRow label="Тип хранене" value={dietLabels} />
            <InfoRow label="Активност" value={activityData?.label || ''} />
          </div>
        </motion.div>

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl border border-border mb-6"
        >
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Настройки</h3>
          </div>
          
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isDarkMode ? <Moon className="w-5 h-5 text-muted-foreground" /> : <Sun className="w-5 h-5 text-muted-foreground" />}
              <span className="text-foreground">Тъмен режим</span>
            </div>
            <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={handleReset}
          >
            <Edit className="w-5 h-5" />
            Редактирай профила
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start gap-3 text-destructive border-destructive/30 hover:bg-destructive/10"
            onClick={handleReset}
          >
            <LogOut className="w-5 h-5" />
            Изход / Нулиране
          </Button>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-3 flex justify-between items-center">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="font-medium text-foreground text-sm text-right max-w-[60%]">{value}</span>
    </div>
  );
}