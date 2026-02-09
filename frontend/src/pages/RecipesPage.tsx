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
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <header className="text-center">
        <h1 className="font-serif text-4xl font-bold text-espresso-800">
          My Recipe Collection
        </h1>
        <p className="mt-2 text-espresso-600">
          {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'} in your cookbook
        </p>
      </header>

      {/* Search and Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-espresso-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search recipes..."
            className="input pl-11"
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
          <div className="spinner w-10 h-10"></div>
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-red-600">{error}</p>
        </div>
      ) : recipes.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-5xl mb-4">📖</div>
          <h3 className="font-serif text-xl font-semibold text-espresso-800 mb-2">
            No recipes yet
          </h3>
          <p className="text-espresso-600 mb-6 max-w-sm mx-auto">
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
