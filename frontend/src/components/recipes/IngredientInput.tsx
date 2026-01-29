import { IngredientUnit, IngredientInput as IngredientInputType } from '@/types/recipe.types';

interface IngredientInputProps {
  ingredients: IngredientInputType[];
  onChange: (ingredients: IngredientInputType[]) => void;
  errors?: Record<number, Record<string, string>>;
}

const unitOptions = Object.values(IngredientUnit).map((unit) => ({
  value: unit,
  label: unit.replace(/_/g, ' '),
}));

export function IngredientInput({ ingredients, onChange, errors }: IngredientInputProps) {
  const addIngredient = () => {
    onChange([
      ...ingredients,
      { name: '', quantity: 1, unit: IngredientUnit.PIECE, order_index: ingredients.length },
    ]);
  };

  const removeIngredient = (index: number) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    // Update order_index for remaining ingredients
    const reindexed = newIngredients.map((ing, i) => ({ ...ing, order_index: i }));
    onChange(reindexed);
  };

  const updateIngredient = (index: number, field: keyof IngredientInputType, value: string | number) => {
    const newIngredients = [...ingredients];
    // Ensure quantity is always a number
    const processedValue = field === 'quantity'
      ? (typeof value === 'string' ? parseFloat(value) || 0 : value)
      : value;
    newIngredients[index] = { ...newIngredients[index], [field]: processedValue };
    onChange(newIngredients);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="label mb-0">Ingredients</label>
        <button
          type="button"
          onClick={addIngredient}
          className="text-sm text-cookbook-600 hover:text-cookbook-800 font-medium"
        >
          + Add ingredient
        </button>
      </div>

      {ingredients.length === 0 && (
        <p className="text-sm text-cookbook-500 italic">
          No ingredients yet. Add your first ingredient above.
        </p>
      )}

      <div className="space-y-2">
        {ingredients.map((ingredient, index) => (
          <div
            key={index}
            className="flex items-start gap-2 p-3 bg-cookbook-50 border border-cookbook-200/70 rounded-lg"
          >
            {/* Quantity */}
            <div className="w-20">
              <input
                type="number"
                min="0"
                step="0.25"
                value={ingredient.quantity}
                onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                placeholder="Qty"
                className={`input text-sm py-2 ${errors?.[index]?.quantity ? 'input-error' : ''}`}
              />
              {errors?.[index]?.quantity && (
                <p className="text-xs text-red-500 mt-1">{errors[index].quantity}</p>
              )}
            </div>

            {/* Unit */}
            <div className="w-32">
              <select
                value={ingredient.unit}
                onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                className="select text-sm py-2"
              >
                {unitOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Name */}
            <div className="flex-1">
              <input
                type="text"
                value={ingredient.name}
                onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                placeholder="Ingredient name"
                className={`input text-sm py-2 ${errors?.[index]?.name ? 'input-error' : ''}`}
              />
              {errors?.[index]?.name && (
                <p className="text-xs text-red-500 mt-1">{errors[index].name}</p>
              )}
            </div>

            {/* Remove button */}
            <button
              type="button"
              onClick={() => removeIngredient(index)}
              className="p-2 text-cookbook-400 hover:text-red-500 transition-colors"
              aria-label="Remove ingredient"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
