import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Recipe, RecipeCategory, RecipeCreate, IngredientUnit, IngredientInput as IngredientInputType } from '@/types/recipe.types';
import { IngredientInput } from './IngredientInput';
import { useState } from 'react';

const ingredientSchema = z.object({
  name: z.string().min(1, 'Ingredient name is required'),
  quantity: z.number().positive('Quantity must be positive'),
  unit: z.nativeEnum(IngredientUnit),
  order_index: z.number().optional(),
});

const recipeSchema = z.object({
  name: z.string().min(1, 'Recipe name is required').max(200, 'Name is too long'),
  description: z.string().max(1000, 'Description is too long').optional().or(z.literal('')),
  instructions: z.string().min(1, 'Instructions are required'),
  prep_time_minutes: z.number().min(0, 'Must be positive').default(0),
  cook_time_minutes: z.number().min(0, 'Must be positive').default(0),
  servings: z.number().min(1, 'Must be at least 1').default(1),
  category: z.nativeEnum(RecipeCategory),
});

type RecipeFormData = z.infer<typeof recipeSchema>;

interface RecipeFormProps {
  initialData?: Recipe;
  onSubmit: (data: RecipeCreate) => Promise<void>;
  isLoading?: boolean;
}

const categoryOptions = Object.values(RecipeCategory).map((cat) => ({
  value: cat,
  label: cat.charAt(0).toUpperCase() + cat.slice(1),
}));

export function RecipeForm({ initialData, onSubmit, isLoading }: RecipeFormProps) {
  const [ingredients, setIngredients] = useState<IngredientInputType[]>(
    initialData?.ingredients?.map((ing, idx) => ({
      name: ing.name,
      quantity: typeof ing.quantity === 'string' ? parseFloat(ing.quantity) : ing.quantity,
      unit: ing.unit,
      order_index: idx,
    })) || [{ name: '', quantity: 1, unit: IngredientUnit.PIECE, order_index: 0 }]
  );
  const [ingredientErrors, setIngredientErrors] = useState<Record<number, Record<string, string>>>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      instructions: initialData?.instructions || '',
      prep_time_minutes: initialData?.prep_time_minutes || 0,
      cook_time_minutes: initialData?.cook_time_minutes || 0,
      servings: initialData?.servings || 1,
      category: initialData?.category || RecipeCategory.DINNER,
    },
  });

  const validateIngredients = (): boolean => {
    const newErrors: Record<number, Record<string, string>> = {};
    let isValid = true;

    ingredients.forEach((ing, index) => {
      const result = ingredientSchema.safeParse(ing);
      if (!result.success) {
        isValid = false;
        newErrors[index] = {};
        result.error.errors.forEach((err) => {
          const field = err.path[0] as string;
          newErrors[index][field] = err.message;
        });
      }
    });

    if (ingredients.length === 0) {
      isValid = false;
    }

    setIngredientErrors(newErrors);
    return isValid;
  };

  const handleFormSubmit = async (data: RecipeFormData) => {
    if (!validateIngredients()) {
      return;
    }

    const recipeData: RecipeCreate = {
      ...data,
      description: data.description || undefined,
      ingredients: ingredients.map((ing, idx) => ({
        ...ing,
        order_index: idx,
      })),
    };

    await onSubmit(recipeData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Name */}
      <div>
        <label htmlFor="name" className="label">
          Recipe Name
        </label>
        <input
          id="name"
          type="text"
          {...register('name')}
          className={`input ${errors.name ? 'input-error' : ''}`}
          placeholder="Enter recipe name"
        />
        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="label">
          Description <span className="text-cookbook-400">(optional)</span>
        </label>
        <textarea
          id="description"
          {...register('description')}
          className={`textarea h-20 ${errors.description ? 'input-error' : ''}`}
          placeholder="A brief description of your recipe"
        />
        {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
      </div>

      {/* Category and Times */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <label htmlFor="category" className="label">
            Category
          </label>
          <select id="category" {...register('category')} className="select">
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="prep_time_minutes" className="label">
            Prep Time (min)
          </label>
          <input
            id="prep_time_minutes"
            type="number"
            min="0"
            {...register('prep_time_minutes', { valueAsNumber: true })}
            className={`input ${errors.prep_time_minutes ? 'input-error' : ''}`}
          />
        </div>

        <div>
          <label htmlFor="cook_time_minutes" className="label">
            Cook Time (min)
          </label>
          <input
            id="cook_time_minutes"
            type="number"
            min="0"
            {...register('cook_time_minutes', { valueAsNumber: true })}
            className={`input ${errors.cook_time_minutes ? 'input-error' : ''}`}
          />
        </div>

        <div>
          <label htmlFor="servings" className="label">
            Servings
          </label>
          <input
            id="servings"
            type="number"
            min="1"
            {...register('servings', { valueAsNumber: true })}
            className={`input ${errors.servings ? 'input-error' : ''}`}
          />
        </div>
      </div>

      {/* Ingredients */}
      <div className="border-t border-cookbook-200 pt-6">
        <IngredientInput
          ingredients={ingredients}
          onChange={setIngredients}
          errors={ingredientErrors}
        />
        {ingredients.length === 0 && (
          <p className="text-sm text-red-500 mt-1">At least one ingredient is required</p>
        )}
      </div>

      {/* Instructions */}
      <div className="border-t border-cookbook-200 pt-6">
        <label htmlFor="instructions" className="label">
          Instructions
        </label>
        <textarea
          id="instructions"
          {...register('instructions')}
          className={`textarea h-48 ${errors.instructions ? 'input-error' : ''}`}
          placeholder="Write out your recipe steps. You can use multiple paragraphs."
        />
        {errors.instructions && <p className="text-sm text-red-500 mt-1">{errors.instructions.message}</p>}
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3 pt-4 border-t border-cookbook-200">
        <button type="submit" disabled={isLoading} className="btn-primary">
          {isLoading ? 'Saving...' : initialData ? 'Save Changes' : 'Create Recipe'}
        </button>
      </div>
    </form>
  );
}
