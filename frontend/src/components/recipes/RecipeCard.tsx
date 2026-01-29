import { Link } from 'react-router-dom';
import { Recipe } from '@/types/recipe.types';

interface RecipeCardProps {
  recipe: Recipe;
}

// Category-specific gradient backgrounds for visual variety
const categoryGradients: Record<string, string> = {
  breakfast: 'from-amber-100/60 to-orange-100/40',
  lunch: 'from-emerald-100/60 to-teal-100/40',
  dinner: 'from-indigo-100/60 to-purple-100/40',
  snack: 'from-rose-100/60 to-pink-100/40',
  dessert: 'from-fuchsia-100/60 to-pink-100/40',
  beverage: 'from-cyan-100/60 to-sky-100/40',
};

export function RecipeCard({ recipe }: RecipeCardProps) {
  const totalTime = recipe.prep_time_minutes + recipe.cook_time_minutes;
  const gradientClass = categoryGradients[recipe.category] || 'from-cookbook-100 to-cookbook-50';

  return (
    <Link
      to={`/recipes/${recipe.id}`}
      className="group block bg-white rounded-2xl border border-cookbook-200/70 overflow-hidden hover:border-cookbook-300 transition-all duration-200 hover:shadow-sm"
    >
      {/* Visual header with gradient */}
      <div className={`h-32 bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
        <span className="text-4xl opacity-60">
          {recipe.category === 'breakfast' && '🍳'}
          {recipe.category === 'lunch' && '🥗'}
          {recipe.category === 'dinner' && '🍽️'}
          {recipe.category === 'snack' && '🍿'}
          {recipe.category === 'dessert' && '🍰'}
          {recipe.category === 'beverage' && '🥤'}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif text-lg font-semibold text-cookbook-900 group-hover:text-accent-700 line-clamp-1 transition-colors">
            {recipe.name}
          </h3>
        </div>

        {recipe.description && (
          <p className="text-cookbook-600 text-sm line-clamp-2">{recipe.description}</p>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-cookbook-100">
          <span className="chip text-xs capitalize">{recipe.category}</span>
          <div className="flex items-center gap-3 text-xs text-cookbook-500">
            {totalTime > 0 && <span>{totalTime} min</span>}
            <span>{recipe.servings} servings</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
