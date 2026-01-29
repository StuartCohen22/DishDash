import { Recipe } from '@/types/recipe.types';

interface RecipeDetailProps {
  recipe: Recipe;
  onEdit: () => void;
  onDelete: () => void;
}

export function RecipeDetail({ recipe, onEdit, onDelete }: RecipeDetailProps) {
  const totalTime = recipe.prep_time_minutes + recipe.cook_time_minutes;

  return (
    <article className="max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-8 pb-6 border-b border-cookbook-200">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <span className="chip mb-3 capitalize">{recipe.category}</span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cookbook-900">
              {recipe.name}
            </h1>
            {recipe.description && (
              <p className="mt-3 text-lg text-cookbook-600">{recipe.description}</p>
            )}
          </div>
          <div className="flex gap-2 shrink-0">
            <button onClick={onEdit} className="btn-secondary text-sm">
              Edit
            </button>
            <button
              onClick={onDelete}
              className="btn-ghost text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap gap-4 mt-6 text-sm text-cookbook-600">
          {recipe.prep_time_minutes > 0 && (
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Prep: {recipe.prep_time_minutes} min</span>
            </div>
          )}
          {recipe.cook_time_minutes > 0 && (
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
              <span>Cook: {recipe.cook_time_minutes} min</span>
            </div>
          )}
          {totalTime > 0 && (
            <div className="flex items-center gap-1.5 font-medium text-cookbook-800">
              <span>Total: {totalTime} min</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Serves {recipe.servings}</span>
          </div>
        </div>
      </header>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Ingredients sidebar */}
        <aside className="md:col-span-1">
          <div className="sticky top-24">
            <h2 className="font-serif text-xl font-semibold text-cookbook-900 mb-4">
              Ingredients
            </h2>
            <ul className="space-y-2">
              {recipe.ingredients
                .sort((a, b) => a.order_index - b.order_index)
                .map((ing) => (
                  <li
                    key={ing.id}
                    className="flex items-baseline gap-2 py-2 px-3 bg-cookbook-50 rounded-lg border border-cookbook-100"
                  >
                    <span className="font-medium text-cookbook-800 whitespace-nowrap">
                      {ing.quantity} {ing.unit.replace(/_/g, ' ')}
                    </span>
                    <span className="text-cookbook-700">{ing.name}</span>
                  </li>
                ))}
            </ul>
          </div>
        </aside>

        {/* Instructions main content */}
        <main className="md:col-span-2">
          <h2 className="font-serif text-xl font-semibold text-cookbook-900 mb-4">
            Instructions
          </h2>
          <div className="prose prose-cookbook max-w-none space-y-4">
            {recipe.instructions.split('\n').filter(Boolean).map((para, idx) => (
              <p key={idx} className="text-cookbook-700 leading-relaxed">
                {para}
              </p>
            ))}
          </div>
        </main>
      </div>
    </article>
  );
}
