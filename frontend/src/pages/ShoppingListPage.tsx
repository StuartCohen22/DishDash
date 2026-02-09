import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MealPlan, ShoppingList as ShoppingListType } from '@/types';
import { mealPlanService } from '@/services/mealPlan.service';
import { shoppingService } from '@/services/shopping.service';
import { ShoppingList } from '@/components/shopping/ShoppingList';

export function ShoppingListPage() {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [shoppingList, setShoppingList] = useState<ShoppingListType | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMealPlans();
  }, []);

  useEffect(() => {
    if (selectedPlanId) {
      loadShoppingList(selectedPlanId);
    } else {
      setShoppingList(null);
    }
  }, [selectedPlanId]);

  const loadMealPlans = async () => {
    try {
      const response = await mealPlanService.getMealPlans();
      setMealPlans(response.items);

      // Find a plan with a shopping list
      const planWithList = response.items.find((p) => p.shopping_list);
      if (planWithList) {
        setSelectedPlanId(planWithList.id);
      } else if (response.items.length > 0) {
        setSelectedPlanId(response.items[0].id);
      }
    } catch (err) {
      console.error('Failed to load meal plans:', err);
      setError('Failed to load meal plans');
    } finally {
      setLoading(false);
    }
  };

  const loadShoppingList = async (planId: string) => {
    setError(null);
    try {
      const list = await shoppingService.getShoppingListByPlan(planId);
      setShoppingList(list);
    } catch (err: any) {
      // 404 means no shopping list exists yet
      if (err?.response?.status === 404) {
        setShoppingList(null);
      } else {
        console.error('Failed to load shopping list:', err);
        setError('Failed to load shopping list');
      }
    }
  };

  const handleGenerate = async () => {
    if (!selectedPlanId) return;

    setGenerating(true);
    setError(null);
    try {
      const list = await shoppingService.generateShoppingList(selectedPlanId);
      setShoppingList(list);
    } catch (err) {
      console.error('Failed to generate shopping list:', err);
      setError('Failed to generate shopping list');
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleItem = async (itemId: string, isPurchased: boolean) => {
    if (!shoppingList) return;

    try {
      await shoppingService.updateItem(itemId, { is_purchased: isPurchased });
      // Update local state
      setShoppingList({
        ...shoppingList,
        items: shoppingList.items.map((item) =>
          item.id === itemId ? { ...item, is_purchased: isPurchased } : item
        ),
      });
    } catch (err) {
      console.error('Failed to update item:', err);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!shoppingList) return;

    try {
      await shoppingService.deleteItem(itemId);
      // Update local state
      setShoppingList({
        ...shoppingList,
        items: shoppingList.items.filter((item) => item.id !== itemId),
      });
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="spinner w-8 h-8"></div>
      </div>
    );
  }

  if (mealPlans.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-serif font-bold text-espresso-800">Shopping List</h1>
          <p className="text-espresso-600 mt-1">Your shopping list based on meal plans</p>
        </div>

        <div className="card text-center py-12">
          <div className="text-5xl mb-4">🛒</div>
          <p className="text-espresso-600 mb-6 text-lg">
            You need to create a meal plan first before you can generate a shopping list.
          </p>
          <Link to="/planner" className="btn-primary px-6 py-3">
            Create Meal Plan
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-espresso-800">Shopping List</h1>
          <p className="text-espresso-600 mt-1">Your shopping list based on meal plans</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Plan selector */}
          <select
            value={selectedPlanId}
            onChange={(e) => setSelectedPlanId(e.target.value)}
            className="select"
          >
            {mealPlans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name}
                {plan.shopping_list ? ' (has list)' : ''}
              </option>
            ))}
          </select>

          <button
            onClick={handleGenerate}
            disabled={generating || !selectedPlanId}
            className="btn-primary"
          >
            {generating ? (
              <span className="flex items-center gap-2">
                <span className="spinner w-4 h-4 border-white/30 border-t-white"></span>
                Generating...
              </span>
            ) : shoppingList ? (
              'Refresh'
            ) : (
              'Generate'
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border-2 border-red-200">{error}</div>
      )}

      {/* Shopping list */}
      {shoppingList ? (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-espresso-600">
                Generated {new Date(shoppingList.generated_at).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium">
              <span className="text-espresso-600 bg-cream-100 px-3 py-1 rounded-full">
                {shoppingList.to_buy_count + shoppingList.pantry_count} remaining
              </span>
              <span className="text-sage-700 bg-sage-100 px-3 py-1 rounded-full">
                {shoppingList.purchased_count} purchased
              </span>
            </div>
          </div>

          <ShoppingList
            shoppingList={shoppingList}
            onToggleItem={handleToggleItem}
            onDeleteItem={handleDeleteItem}
          />
        </div>
      ) : (
        <div className="card text-center py-12">
          <div className="text-5xl mb-4">📝</div>
          <p className="text-espresso-600 mb-6 text-lg">
            No shopping list for this meal plan yet.
            {selectedPlanId && ' Click "Generate" to create one based on your planned meals.'}
          </p>
          {selectedPlanId && (
            <button onClick={handleGenerate} disabled={generating} className="btn-primary px-6 py-3">
              {generating ? (
                <span className="flex items-center gap-2">
                  <span className="spinner w-4 h-4 border-white/30 border-t-white"></span>
                  Generating...
                </span>
              ) : (
                'Generate Shopping List'
              )}
            </button>
          )}
        </div>
      )}

      {/* Print styles */}
      <style>{`
        @media print {
          .btn-primary, .btn-secondary, select, button {
            display: none !important;
          }
          .card {
            box-shadow: none !important;
            border: 1px solid #ddd !important;
          }
        }
      `}</style>
    </div>
  );
}
