import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { RecipeForm } from '@/components/recipes/RecipeForm';
import { recipeService } from '@/services/recipe.service';
import { Recipe, RecipeCreate } from '@/types/recipe.types';
import { AxiosError } from 'axios';

export function RecipeEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = async (data: RecipeCreate) => {
    if (!id) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await recipeService.updateRecipe(id, data);
      navigate(`/recipes/${id}`);
    } catch (err) {
      const axiosError = err as AxiosError<{ detail: string }>;
      setError(axiosError.response?.data?.detail || 'Failed to update recipe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cookbook-800"></div>
      </div>
    );
  }

  if (error && !recipe) {
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
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          to={`/recipes/${id}`}
          className="inline-flex items-center text-sm text-cookbook-600 hover:text-cookbook-800 mb-4"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to recipe
        </Link>
        <h1 className="font-serif text-3xl font-bold text-cookbook-900">Edit Recipe</h1>
        <p className="mt-2 text-cookbook-600">
          Update your recipe details below.
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Form */}
      {recipe && (
        <div className="card">
          <RecipeForm
            initialData={recipe}
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
          />
        </div>
      )}
    </div>
  );
}
