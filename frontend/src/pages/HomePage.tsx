import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export function HomePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Welcome Section */}
      <header className="text-center py-10">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-espresso-800">
          Welcome back, {user?.name}!
        </h1>
        <p className="mt-4 text-lg text-espresso-600 max-w-2xl mx-auto leading-relaxed">
          Plan your meals, organize recipes, and create shopping lists all in one place.
        </p>
      </header>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recipes Card */}
        <Link
          to="/recipes"
          className="group p-6 bg-white rounded-2xl border border-cream-200/60 hover-lift shadow-soft-sm"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-soft-sm">
            <span className="text-3xl">📖</span>
          </div>
          <h2 className="font-serif text-xl font-semibold text-espresso-800 group-hover:text-coral-500 transition-colors">
            Recipes
          </h2>
          <p className="mt-2 text-espresso-600">Browse and add your favorite recipes</p>
        </Link>

        {/* Meal Plans Card */}
        <Link
          to="/planner"
          className="group p-6 bg-white rounded-2xl border border-cream-200/60 hover-lift shadow-soft-sm"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-soft-sm">
            <span className="text-3xl">📅</span>
          </div>
          <h2 className="font-serif text-xl font-semibold text-espresso-800 group-hover:text-coral-500 transition-colors">
            Planner
          </h2>
          <p className="mt-2 text-espresso-600">Plan your weekly meals with ease</p>
        </Link>

        {/* Shopping List Card */}
        <Link
          to="/shopping"
          className="group p-6 bg-white rounded-2xl border border-cream-200/60 hover-lift shadow-soft-sm"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-soft-sm">
            <span className="text-3xl">🛒</span>
          </div>
          <h2 className="font-serif text-xl font-semibold text-espresso-800 group-hover:text-coral-500 transition-colors">
            Shopping
          </h2>
          <p className="mt-2 text-espresso-600">Generate and manage shopping lists</p>
        </Link>
      </div>

      {/* Getting Started Section */}
      <div className="bg-white rounded-2xl border border-cream-200/60 p-8 shadow-soft-sm">
        <h2 className="font-serif text-2xl font-semibold text-espresso-800 mb-8">
          Getting Started
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-coral-500 to-coral-600 text-white flex items-center justify-center text-sm font-bold shadow-soft-sm">
              1
            </div>
            <div>
              <h3 className="font-medium text-espresso-800 text-lg">Add your recipes</h3>
              <p className="text-espresso-600 mt-1">
                <Link to="/recipes/new" className="text-coral-500 hover:text-coral-600 font-medium transition-colors">
                  Start adding recipes
                </Link>{' '}
                with ingredients and instructions.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-coral-500 to-coral-600 text-white flex items-center justify-center text-sm font-bold shadow-soft-sm">
              2
            </div>
            <div>
              <h3 className="font-medium text-espresso-800 text-lg">Create a meal plan</h3>
              <p className="text-espresso-600 mt-1">
                <Link to="/planner" className="text-coral-500 hover:text-coral-600 font-medium transition-colors">
                  Plan your week
                </Link>{' '}
                by assigning recipes to each day.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-coral-500 to-coral-600 text-white flex items-center justify-center text-sm font-bold shadow-soft-sm">
              3
            </div>
            <div>
              <h3 className="font-medium text-espresso-800 text-lg">Generate shopping list</h3>
              <p className="text-espresso-600 mt-1">
                Automatically create a shopping list from your meal plan.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-coral-500 to-coral-600 text-white flex items-center justify-center text-sm font-bold shadow-soft-sm">
              4
            </div>
            <div>
              <h3 className="font-medium text-espresso-800 text-lg">Shop with confidence</h3>
              <p className="text-espresso-600 mt-1">
                Check off items as you shop and never forget an ingredient.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
