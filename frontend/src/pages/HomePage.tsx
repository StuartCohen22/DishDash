import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export function HomePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-10">
      {/* Welcome Section */}
      <header className="text-center py-8">
        <h1 className="font-serif text-4xl font-bold text-cookbook-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="mt-3 text-lg text-cookbook-600 max-w-2xl mx-auto">
          Plan your meals, organize recipes, and create shopping lists all in one place.
        </p>
      </header>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recipes Card */}
        <Link
          to="/recipes"
          className="group p-6 bg-white rounded-2xl border border-cookbook-200/70 hover:border-cookbook-300 transition-all duration-200"
        >
          <div className="w-12 h-12 rounded-xl bg-sage-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <span className="text-2xl">📖</span>
          </div>
          <h2 className="font-serif text-xl font-semibold text-cookbook-900">Recipes</h2>
          <p className="mt-1 text-cookbook-600">Browse and add your favorite recipes</p>
        </Link>

        {/* Meal Plans Card */}
        <Link
          to="/meal-plans"
          className="group p-6 bg-white rounded-2xl border border-cookbook-200/70 hover:border-cookbook-300 transition-all duration-200"
        >
          <div className="w-12 h-12 rounded-xl bg-accent-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <span className="text-2xl">📅</span>
          </div>
          <h2 className="font-serif text-xl font-semibold text-cookbook-900">Planner</h2>
          <p className="mt-1 text-cookbook-600">Plan your weekly meals with ease</p>
        </Link>

        {/* Shopping List Card */}
        <Link
          to="/shopping-list"
          className="group p-6 bg-white rounded-2xl border border-cookbook-200/70 hover:border-cookbook-300 transition-all duration-200"
        >
          <div className="w-12 h-12 rounded-xl bg-cookbook-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <span className="text-2xl">🛒</span>
          </div>
          <h2 className="font-serif text-xl font-semibold text-cookbook-900">Shopping</h2>
          <p className="mt-1 text-cookbook-600">Generate and manage shopping lists</p>
        </Link>
      </div>

      {/* Getting Started Section */}
      <div className="bg-white rounded-2xl border border-cookbook-200/70 p-8">
        <h2 className="font-serif text-2xl font-semibold text-cookbook-900 mb-6">
          Getting Started
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cookbook-800 text-cookbook-50 flex items-center justify-center text-sm font-medium">
              1
            </div>
            <div>
              <h3 className="font-medium text-cookbook-900">Add your recipes</h3>
              <p className="text-cookbook-600 text-sm mt-1">
                <Link to="/recipes/new" className="text-accent-600 hover:underline">
                  Start adding recipes
                </Link>{' '}
                with ingredients and instructions.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cookbook-800 text-cookbook-50 flex items-center justify-center text-sm font-medium">
              2
            </div>
            <div>
              <h3 className="font-medium text-cookbook-900">Create a meal plan</h3>
              <p className="text-cookbook-600 text-sm mt-1">
                <Link to="/meal-plans/new" className="text-accent-600 hover:underline">
                  Plan your week
                </Link>{' '}
                by assigning recipes to each day.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cookbook-800 text-cookbook-50 flex items-center justify-center text-sm font-medium">
              3
            </div>
            <div>
              <h3 className="font-medium text-cookbook-900">Generate shopping list</h3>
              <p className="text-cookbook-600 text-sm mt-1">
                Automatically create a shopping list from your meal plan.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cookbook-800 text-cookbook-50 flex items-center justify-center text-sm font-medium">
              4
            </div>
            <div>
              <h3 className="font-medium text-cookbook-900">Shop with confidence</h3>
              <p className="text-cookbook-600 text-sm mt-1">
                Check off items as you shop and never forget an ingredient.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
