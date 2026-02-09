import { Link } from 'react-router-dom';
import { Recipe } from '@/types/recipe.types';

interface RecipeCardProps {
  recipe: Recipe;
}

// Category-specific gradient backgrounds for visual variety
const categoryGradients: Record<string, string> = {
  breakfast: 'from-amber-50 to-orange-100',
  lunch: 'from-emerald-50 to-teal-100',
  dinner: 'from-indigo-50 to-purple-100',
  snack: 'from-rose-50 to-pink-100',
  dessert: 'from-fuchsia-50 to-pink-100',
  beverage: 'from-cyan-50 to-sky-100',
};

const categoryEmojis: Record<string, string> = {
  breakfast: '🍳',
  lunch: '🥗',
  dinner: '🍽️',
  snack: '🍿',
  dessert: '🍰',
  beverage: '🥤',
};

export function RecipeCard({ recipe }: RecipeCardProps) {
  const totalTime = recipe.prep_time_minutes + recipe.cook_time_minutes;
  const gradientClass = categoryGradients[recipe.category] || 'from-cream-50 to-cream-100';
  const emoji = categoryEmojis[recipe.category] || '🍴';

  return (
    <Link
      to={`/recipes/${recipe.id}`}
      className="group block bg-white rounded-2xl border border-cream-200/60 overflow-hidden hover-lift shadow-soft-sm"
    >
      {/* Visual header with gradient */}
      <div className={`h-36 bg-gradient-to-br ${gradientClass} flex items-center justify-center relative overflow-hidden`}>
        <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
          {emoji}
        </span>
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.8),transparent_70%)]" />
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif text-lg font-semibold text-espresso-800 group-hover:text-coral-500 line-clamp-1 transition-colors">
            {recipe.name}
          </h3>
        </div>

        {recipe.description && (
          <p className="text-espresso-600 text-sm line-clamp-2 leading-relaxed">{recipe.description}</p>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-cream-200/60">
          <span className="chip text-xs capitalize">{recipe.category}</span>
          <div className="flex items-center gap-3 text-xs text-espresso-600 font-medium">
            {totalTime > 0 && (
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {totalTime} min
              </span>
            )}
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {recipe.servings}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
