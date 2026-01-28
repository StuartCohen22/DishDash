import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Recipe, RecipeCategory } from '@/types';
import { recipeService } from '@/services/recipe.service';

export function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<string>('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      try {
        const response = await recipeService.getRecipes({
          category: category || undefined,
          search: search || undefined,
        });
        setRecipes(response.items);
      } catch {
        setError('Failed to load recipes');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, [category, search]);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recipes</h1>
          <p className="text-gray-600">Manage your recipe collection</p>
        </div>
        <Link to="/recipes/new" className="btn-primary">
          Add Recipe
        </Link>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search recipes..."
              className="input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="sm:w-48">
            <select
              className="input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {Object.values(RecipeCategory).map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Recipe Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
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
          <h3 className="mt-2 text-sm font-medium text-gray-900">No recipes</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new recipe.
          </p>
          <div className="mt-6">
            <Link to="/recipes/new" className="btn-primary">
              Add Recipe
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <Link
              key={recipe.id}
              to={`/recipes/${recipe.id}`}
              className="card hover:shadow-lg transition-shadow duration-200"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                    {recipe.name}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                      recipe.category
                    )}`}
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
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
