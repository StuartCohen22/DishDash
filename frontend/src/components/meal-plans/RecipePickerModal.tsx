import { useEffect, useState } from 'react';
import { Recipe, RecipeCategory } from '@/types';
import { recipeService } from '@/services/recipe.service';

interface RecipePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (recipe: Recipe) => void;
}

export function RecipePickerModal({ isOpen, onClose, onSelect }: RecipePickerModalProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      loadRecipes();
    }
  }, [isOpen, search, category]);

  const loadRecipes = async () => {
    setLoading(true);
    try {
      const response = await recipeService.getRecipes({
        page_size: 50,
        search: search || undefined,
        category: category || undefined,
      });
      setRecipes(response.items);
    } catch (error) {
      console.error('Failed to load recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-cookbook-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-serif font-semibold text-cookbook-900">
              Select Recipe
            </h2>
            <button
              onClick={onClose}
              className="p-1 text-cookbook-400 hover:text-cookbook-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search recipes..."
              className="input text-sm flex-1"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="select text-sm"
            >
              <option value="">All</option>
              {Object.values(RecipeCategory).map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Recipe list */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cookbook-600"></div>
            </div>
          ) : recipes.length === 0 ? (
            <p className="text-center text-cookbook-500 py-8">
              No recipes found. Create some recipes first!
            </p>
          ) : (
            <div className="space-y-2">
              {recipes.map((recipe) => (
                <button
                  key={recipe.id}
                  onClick={() => {
                    onSelect(recipe);
                    onClose();
                  }}
                  className="w-full text-left p-3 rounded-lg border border-cookbook-200
                    hover:border-cookbook-400 hover:bg-cookbook-50 transition-colors"
                >
                  <p className="font-medium text-cookbook-800">{recipe.name}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-cookbook-500">
                    <span className="capitalize">{recipe.category}</span>
                    <span>•</span>
                    <span>{recipe.prep_time_minutes + recipe.cook_time_minutes} min</span>
                    <span>•</span>
                    <span>{recipe.servings} servings</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
