import { useState } from 'react';
import {
  MealPlan,
  MealType,
  Recipe,
  PlannedMealCreate,
  DAYS_OF_WEEK,
  MEAL_TYPE_LABELS,
} from '@/types';
import { MealSlot } from './MealSlot';
import { RecipePickerModal } from './RecipePickerModal';

interface WeekPlannerProps {
  mealPlan: MealPlan;
  onAddMeal: (data: PlannedMealCreate) => Promise<void>;
  onRemoveMeal: (mealId: string) => Promise<void>;
}

interface SlotSelection {
  dayOfWeek: number;
  mealType: MealType;
}

export function WeekPlanner({ mealPlan, onAddMeal, onRemoveMeal }: WeekPlannerProps) {
  const [selectedSlot, setSelectedSlot] = useState<SlotSelection | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Build a lookup for meals by day and meal type
  const getMeal = (dayOfWeek: number, mealType: MealType) => {
    return mealPlan.planned_meals.find(
      (meal) => meal.day_of_week === dayOfWeek && meal.meal_type === mealType
    ) || null;
  };

  const handleAddClick = (dayOfWeek: number, mealType: MealType) => {
    setSelectedSlot({ dayOfWeek, mealType });
    setIsModalOpen(true);
  };

  const handleRecipeSelect = async (recipe: Recipe) => {
    if (!selectedSlot) return;

    await onAddMeal({
      recipe_id: recipe.id,
      day_of_week: selectedSlot.dayOfWeek,
      meal_type: selectedSlot.mealType,
    });

    setSelectedSlot(null);
  };

  const mealTypes = Object.values(MealType);

  return (
    <>
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header row with day names */}
          <div className="grid grid-cols-8 gap-2 mb-2">
            <div className="p-2"></div> {/* Empty corner cell */}
            {DAYS_OF_WEEK.map((day, index) => (
              <div
                key={day}
                className="p-2 text-center font-medium text-cookbook-700 bg-cookbook-100 rounded-lg"
              >
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden">{day.slice(0, 3)}</span>
              </div>
            ))}
          </div>

          {/* Meal rows */}
          {mealTypes.map((mealType) => (
            <div key={mealType} className="grid grid-cols-8 gap-2 mb-2">
              {/* Meal type label */}
              <div className="p-2 flex items-center">
                <span className="text-sm font-medium text-cookbook-600">
                  {MEAL_TYPE_LABELS[mealType]}
                </span>
              </div>

              {/* Day slots */}
              {DAYS_OF_WEEK.map((_, dayIndex) => (
                <div key={`${mealType}-${dayIndex}`} className="min-h-[70px]">
                  <MealSlot
                    meal={getMeal(dayIndex, mealType)}
                    onAdd={() => handleAddClick(dayIndex, mealType)}
                    onRemove={onRemoveMeal}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <RecipePickerModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSlot(null);
        }}
        onSelect={handleRecipeSelect}
      />
    </>
  );
}
