import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Recipe, RecipeCategory } from '@/types';
import { recipeService } from '@/services/recipe.service';
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { Chip } from '@/components/common/Chip';

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

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <header className="text-center">
        <h1 className="font-serif text-4xl font-bold text-cookbook-900">
          My Recipe Collection
        </h1>
        <p className="mt-2 text-cookbook-600">
          {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'} in your cookbook
        </p>
      </header>

      {/* Search and Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-cookbook-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search recipes..."
            className="input pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Link to="/recipes/new" className="btn-primary whitespace-nowrap">
          + Add Recipe
        </Link>
      </div>

      {/* Category Chips */}
      <div className="flex flex-wrap gap-2">
        <Chip
          label="All"
          active={!category}
          onClick={() => setCategory('')}
        />
        {Object.values(RecipeCategory).map((cat) => (
          <Chip
            key={cat}
            label={cat.charAt(0).toUpperCase() + cat.slice(1)}
            active={category === cat}
            onClick={() => setCategory(cat)}
          />
        ))}
      </div>

      {/* Recipe Grid */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cookbook-800"></div>
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-red-600">{error}</p>
        </div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cookbook-100 flex items-center justify-center">
            <svg className="h-8 w-8 text-cookbook-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h3 className="font-serif text-xl font-semibold text-cookbook-900 mb-2">
            No recipes yet
          </h3>
          <p className="text-cookbook-600 mb-6 max-w-sm mx-auto">
            Start building your cookbook. Add your first recipe to get started.
          </p>
          <Link to="/recipes/new" className="btn-primary">
            Add Your First Recipe
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}
