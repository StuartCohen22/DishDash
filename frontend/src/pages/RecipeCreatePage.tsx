import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { RecipeForm } from '@/components/recipes/RecipeForm';
import { recipeService } from '@/services/recipe.service';
import { RecipeCreate } from '@/types/recipe.types';
import { AxiosError } from 'axios';

export function RecipeCreatePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: RecipeCreate) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const recipe = await recipeService.createRecipe(data);
      navigate(`/recipes/${recipe.id}`);
    } catch (err) {
      const axiosError = err as AxiosError<{ detail: string }>;
      setError(axiosError.response?.data?.detail || 'Failed to create recipe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/recipes"
          className="inline-flex items-center text-sm text-cookbook-600 hover:text-cookbook-800 mb-4"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to recipes
        </Link>
        <h1 className="font-serif text-3xl font-bold text-cookbook-900">Add a New Recipe</h1>
        <p className="mt-2 text-cookbook-600">
          Share your culinary creation. Fill in the details below.
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="card">
        <RecipeForm onSubmit={handleSubmit} isLoading={isSubmitting} />
      </div>
    </div>
  );
}
