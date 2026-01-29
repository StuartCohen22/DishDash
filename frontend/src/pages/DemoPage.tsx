import { Link } from 'react-router-dom';
import { Recipe, RecipeCategory, IngredientUnit } from '@/types';

// Sample demo data - no API calls needed
const DEMO_RECIPES: Recipe[] = [
  {
    id: '1',
    user_id: 'demo',
    name: 'Classic Buttermilk Pancakes',
    description: 'Fluffy homemade pancakes perfect for a lazy weekend breakfast.',
    instructions: 'Mix dry ingredients, add wet, cook on griddle until golden.',
    prep_time_minutes: 10,
    cook_time_minutes: 20,
    servings: 4,
    category: RecipeCategory.BREAKFAST,
    ingredients: [
      { id: '1', name: 'All-purpose flour', quantity: 2, unit: IngredientUnit.CUP, order_index: 0 },
      { id: '2', name: 'Eggs', quantity: 2, unit: IngredientUnit.WHOLE, order_index: 1 },
      { id: '3', name: 'Buttermilk', quantity: 2, unit: IngredientUnit.CUP, order_index: 2 },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    user_id: 'demo',
    name: 'Grilled Chicken Caesar Salad',
    description: 'Classic Caesar salad with grilled chicken breast.',
    instructions: 'Grill chicken, prepare dressing, toss with romaine.',
    prep_time_minutes: 15,
    cook_time_minutes: 15,
    servings: 4,
    category: RecipeCategory.LUNCH,
    ingredients: [
      { id: '4', name: 'Chicken breast', quantity: 1.5, unit: IngredientUnit.POUND, order_index: 0 },
      { id: '5', name: 'Romaine lettuce', quantity: 2, unit: IngredientUnit.WHOLE, order_index: 1 },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    user_id: 'demo',
    name: 'Spaghetti Carbonara',
    description: 'Authentic Italian pasta with crispy pancetta.',
    instructions: 'Cook pasta, fry pancetta, toss with egg and cheese sauce.',
    prep_time_minutes: 10,
    cook_time_minutes: 20,
    servings: 4,
    category: RecipeCategory.DINNER,
    ingredients: [
      { id: '6', name: 'Spaghetti', quantity: 1, unit: IngredientUnit.POUND, order_index: 0 },
      { id: '7', name: 'Pancetta', quantity: 8, unit: IngredientUnit.OUNCE, order_index: 1 },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    user_id: 'demo',
    name: 'Fudgy Chocolate Brownies',
    description: 'Rich, dense chocolate brownies with a crackly top.',
    instructions: 'Melt chocolate, mix batter, bake until set.',
    prep_time_minutes: 15,
    cook_time_minutes: 30,
    servings: 9,
    category: RecipeCategory.DESSERT,
    ingredients: [
      { id: '8', name: 'Dark chocolate', quantity: 4, unit: IngredientUnit.OUNCE, order_index: 0 },
      { id: '9', name: 'Butter', quantity: 0.5, unit: IngredientUnit.CUP, order_index: 1 },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Category-specific gradient backgrounds
const categoryGradients: Record<string, string> = {
  breakfast: 'from-amber-100/60 to-orange-100/40',
  lunch: 'from-emerald-100/60 to-teal-100/40',
  dinner: 'from-indigo-100/60 to-purple-100/40',
  snack: 'from-rose-100/60 to-pink-100/40',
  dessert: 'from-fuchsia-100/60 to-pink-100/40',
  beverage: 'from-cyan-100/60 to-sky-100/40',
};

export function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cookbook-50 to-cookbook-100">
      {/* Demo Header */}
      <header className="sticky top-0 z-40 border-b border-cookbook-200/60 bg-cookbook-50/80 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-cookbook-900 text-cookbook-50 grid place-items-center text-sm font-bold">
              DD
            </div>
            <div className="leading-tight">
              <div className="font-serif text-lg font-semibold text-cookbook-900">Dish Dash</div>
              <div className="text-xs text-cookbook-500">Demo Preview</div>
            </div>
            <span className="ml-2 px-2 py-0.5 bg-accent-100 text-accent-700 text-xs font-medium rounded-full">
              DEMO
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-cookbook-600 hover:text-cookbook-900 px-3 py-2">
              Sign in
            </Link>
            <Link to="/register" className="btn-primary text-sm">
              Get started
            </Link>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10 py-10">
        {/* Demo Banner */}
        <div className="bg-cookbook-800 rounded-2xl p-8 mb-10 text-cookbook-50">
          <h1 className="font-serif text-3xl font-bold">Welcome to Dish Dash!</h1>
          <p className="mt-2 text-cookbook-300 max-w-2xl">
            This is a demo preview of the app. Sign up to create your own recipes, plan meals, and generate shopping lists.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/register"
              className="bg-cookbook-50 text-cookbook-900 px-4 py-2 rounded-lg font-medium hover:bg-white transition-colors"
            >
              Create Free Account
            </Link>
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-cookbook-600 text-cookbook-200 px-4 py-2 rounded-lg font-medium hover:bg-cookbook-700 transition-colors"
            >
              View API Docs
            </a>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="p-6 bg-white rounded-2xl border border-cookbook-200/70">
            <div className="w-12 h-12 rounded-xl bg-sage-100 flex items-center justify-center mb-4">
              <span className="text-2xl">📖</span>
            </div>
            <h2 className="font-serif text-xl font-semibold text-cookbook-900">Recipes</h2>
            <p className="mt-1 text-cookbook-600">{DEMO_RECIPES.length} sample recipes</p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-cookbook-200/70">
            <div className="w-12 h-12 rounded-xl bg-accent-100 flex items-center justify-center mb-4">
              <span className="text-2xl">📅</span>
            </div>
            <h2 className="font-serif text-xl font-semibold text-cookbook-900">Meal Plans</h2>
            <p className="mt-1 text-cookbook-600">Plan your weekly meals</p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-cookbook-200/70">
            <div className="w-12 h-12 rounded-xl bg-cookbook-100 flex items-center justify-center mb-4">
              <span className="text-2xl">🛒</span>
            </div>
            <h2 className="font-serif text-xl font-semibold text-cookbook-900">Shopping List</h2>
            <p className="mt-1 text-cookbook-600">Auto-generate lists</p>
          </div>
        </div>

        {/* Sample Recipes */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl font-bold text-cookbook-900">Sample Recipes</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DEMO_RECIPES.map((recipe) => {
              const gradientClass = categoryGradients[recipe.category] || 'from-cookbook-100 to-cookbook-50';
              const totalTime = recipe.prep_time_minutes + recipe.cook_time_minutes;

              return (
                <div
                  key={recipe.id}
                  className="bg-white rounded-2xl border border-cookbook-200/70 overflow-hidden hover:border-cookbook-300 transition-colors cursor-pointer"
                >
                  {/* Visual header with gradient */}
                  <div className={`h-24 bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
                    <span className="text-3xl opacity-60">
                      {recipe.category === 'breakfast' && '🍳'}
                      {recipe.category === 'lunch' && '🥗'}
                      {recipe.category === 'dinner' && '🍝'}
                      {recipe.category === 'snack' && '🍿'}
                      {recipe.category === 'dessert' && '🍫'}
                      {recipe.category === 'beverage' && '🥤'}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-serif text-lg font-semibold text-cookbook-900 line-clamp-1">
                      {recipe.name}
                    </h3>
                    {recipe.description && (
                      <p className="text-cookbook-600 text-sm line-clamp-2">
                        {recipe.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t border-cookbook-100">
                      <span className="chip text-xs capitalize">{recipe.category}</span>
                      <span className="text-xs text-cookbook-500">{totalTime} min</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <p className="text-cookbook-600 mb-4">
            Ready to start planning your meals?
          </p>
          <Link to="/register" className="btn-primary px-8 py-3">
            Create Your Free Account
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-cookbook-200/60 mt-16">
        <div className="mx-auto max-w-6xl px-4 py-8 text-center text-cookbook-500 text-sm">
          Dish Dash - Your Personal Recipe Cookbook
        </div>
      </footer>
    </div>
  );
}
