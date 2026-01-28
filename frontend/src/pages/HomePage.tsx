import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export function HomePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="mt-2 text-gray-600">
          Plan your meals, organize recipes, and create shopping lists all in one place.
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recipes Card */}
        <Link
          to="/recipes"
          className="card hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary-100 rounded-lg">
              <svg
                className="w-8 h-8 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Recipes</h2>
              <p className="text-gray-600">Browse and add recipes</p>
            </div>
          </div>
        </Link>

        {/* Meal Plans Card */}
        <Link
          to="/meal-plans"
          className="card hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-accent-100 rounded-lg">
              <svg
                className="w-8 h-8 text-accent-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Meal Plans</h2>
              <p className="text-gray-600">Plan your weekly meals</p>
            </div>
          </div>
        </Link>

        {/* Shopping List Card */}
        <Link
          to="/shopping-list"
          className="card hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Shopping List
              </h2>
              <p className="text-gray-600">View your shopping list</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Getting Started Section */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Getting Started
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-600">
          <li>
            <Link to="/recipes/new" className="text-primary-600 hover:underline">
              Add your favorite recipes
            </Link>{' '}
            with ingredients and instructions
          </li>
          <li>
            <Link to="/meal-plans/new" className="text-primary-600 hover:underline">
              Create a meal plan
            </Link>{' '}
            for the week
          </li>
          <li>
            Generate a shopping list from your meal plan
          </li>
          <li>
            Check off items as you shop
          </li>
        </ol>
      </div>
    </div>
  );
}
