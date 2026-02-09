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
        className="w-full h-full min-h-[68px] border-2 border-dashed border-cream-300 rounded-xl
          hover:border-coral-400 hover:bg-coral-50/30 transition-smooth
          flex items-center justify-center text-cream-400 hover:text-coral-500 group"
      >
        <span className="text-2xl font-light group-hover:scale-110 transition-transform">+</span>
      </button>
    );
  }

  return (
    <div
      className="w-full h-full min-h-[68px] bg-white border border-cream-200/60 rounded-xl p-3
        shadow-soft-sm hover:shadow-soft transition-smooth group relative"
    >
      <p className="text-sm font-medium text-espresso-800 line-clamp-2 pr-5">
        {meal.recipe.name}
      </p>
      <p className="text-xs text-espresso-600 mt-1.5 flex items-center gap-1">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {meal.recipe.prep_time_minutes + meal.recipe.cook_time_minutes} min
      </p>
      <button
        onClick={() => onRemove(meal.id)}
        className="absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100
          text-espresso-400 hover:text-red-500 hover:bg-red-50 transition-smooth"
        aria-label="Remove meal"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
