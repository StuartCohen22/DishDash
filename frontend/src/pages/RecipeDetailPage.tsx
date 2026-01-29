import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { RecipeDetail } from '@/components/recipes/RecipeDetail';
import { recipeService } from '@/services/recipe.service';
import { Recipe } from '@/types/recipe.types';

export function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return;

      try {
        const data = await recipeService.getRecipeById(id);
        setRecipe(data);
      } catch (err) {
        setError('Recipe not found');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleEdit = () => {
    navigate(`/recipes/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this recipe? This cannot be undone.')) {
      return;
    }

    try {
      await recipeService.deleteRecipe(id);
      navigate('/recipes');
    } catch (err) {
      setError('Failed to delete recipe');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cookbook-800"></div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="text-center py-20">
        <h2 className="font-serif text-2xl text-cookbook-900 mb-2">Recipe Not Found</h2>
        <p className="text-cookbook-600 mb-6">
          {error || "We couldn't find the recipe you're looking for."}
        </p>
        <Link to="/recipes" className="btn-primary">
          Back to Recipes
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Back link */}
      <Link
        to="/recipes"
        className="inline-flex items-center text-sm text-cookbook-600 hover:text-cookbook-800 mb-6"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to recipes
      </Link>

      <RecipeDetail recipe={recipe} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}
