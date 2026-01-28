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

const getCategoryColor = (cat: RecipeCategory) => {
  const colors: Record<RecipeCategory, string> = {
    [RecipeCategory.BREAKFAST]: 'bg-yellow-100 text-yellow-800',
    [RecipeCategory.LUNCH]: 'bg-green-100 text-green-800',
    [RecipeCategory.DINNER]: 'bg-blue-100 text-blue-800',
    [RecipeCategory.SNACK]: 'bg-purple-100 text-purple-800',
    [RecipeCategory.DESSERT]: 'bg-pink-100 text-pink-800',
    [RecipeCategory.BEVERAGE]: 'bg-cyan-100 text-cyan-800',
  };
  return colors[cat] || 'bg-gray-100 text-gray-800';
};

export function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">DishDash</span>
              <span className="ml-3 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                DEMO MODE
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="btn-secondary text-sm">
                Sign in
              </Link>
              <Link to="/register" className="btn-primary text-sm">
                Get started
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Demo Banner */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg p-8 mb-8 text-white">
          <h1 className="text-3xl font-bold">Welcome to DishDash!</h1>
          <p className="mt-2 text-primary-100">
            This is a demo preview of the app. Sign up to create your own recipes and meal plans.
          </p>
          <div className="mt-4 flex space-x-4">
            <Link
              to="/register"
              className="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-primary-50"
            >
              Create Free Account
            </Link>
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-400"
            >
              View API Docs
            </a>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary-100 rounded-lg">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Recipes</h2>
                <p className="text-gray-600">{DEMO_RECIPES.length} sample recipes</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-accent-100 rounded-lg">
                <svg className="w-8 h-8 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Meal Plans</h2>
                <p className="text-gray-600">Plan your weekly meals</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Shopping List</h2>
                <p className="text-gray-600">Auto-generate lists</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sample Recipes */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Sample Recipes</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {DEMO_RECIPES.map((recipe) => (
              <div
                key={recipe.id}
                className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                      {recipe.name}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(recipe.category)}`}
                    >
                      {recipe.category}
                    </span>
                  </div>
                  {recipe.description && (
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {recipe.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>
                      {recipe.prep_time_minutes + recipe.cook_time_minutes} min
                    </span>
                    <span>{recipe.servings} servings</span>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-500">
                      {recipe.ingredients.length} ingredients
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Ready to start planning your meals?
          </p>
          <Link to="/register" className="btn-primary px-8 py-3 text-lg">
            Create Your Free Account
          </Link>
        </div>
      </main>
    </div>
  );
}
