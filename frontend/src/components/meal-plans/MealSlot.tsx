import { PlannedMeal } from '@/types';

interface MealSlotProps {
  meal: PlannedMeal | null;
  onAdd: () => void;
  onRemove: (mealId: string) => void;
}

export function MealSlot({ meal, onAdd, onRemove }: MealSlotProps) {
  if (!meal) {
    return (
      <button
        onClick={onAdd}
        className="w-full h-full min-h-[60px] border-2 border-dashed border-cookbook-200 rounded-lg
          hover:border-cookbook-400 hover:bg-cookbook-50 transition-colors
          flex items-center justify-center text-cookbook-400 hover:text-cookbook-600"
      >
        <span className="text-2xl">+</span>
      </button>
    );
  }

  return (
    <div
      className="w-full h-full min-h-[60px] bg-white border border-cookbook-200 rounded-lg p-2
        hover:shadow-sm transition-shadow group relative"
    >
      <p className="text-sm font-medium text-cookbook-800 line-clamp-2">
        {meal.recipe.name}
      </p>
      <p className="text-xs text-cookbook-500 mt-1">
        {meal.recipe.prep_time_minutes + meal.recipe.cook_time_minutes} min
      </p>
      <button
        onClick={() => onRemove(meal.id)}
        className="absolute top-1 right-1 p-1 opacity-0 group-hover:opacity-100
          text-cookbook-400 hover:text-red-500 transition-all"
        aria-label="Remove meal"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
