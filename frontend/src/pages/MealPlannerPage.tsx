import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MealPlan, PlannedMealCreate } from '@/types';
import { mealPlanService } from '@/services/mealPlan.service';
import { shoppingService } from '@/services/shopping.service';
import { WeekPlanner } from '@/components/meal-plans/WeekPlanner';

// Helper to get Monday of a given week
function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Format date as YYYY-MM-DD
function formatDateISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Format date for display
function formatWeekLabel(date: Date): string {
  const endOfWeek = new Date(date);
  endOfWeek.setDate(date.getDate() + 6);

  const startMonth = date.toLocaleDateString('en-US', { month: 'short' });
  const startDay = date.getDate();
  const endMonth = endOfWeek.toLocaleDateString('en-US', { month: 'short' });
  const endDay = endOfWeek.getDate();
  const year = date.getFullYear();

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay} - ${endDay}, ${year}`;
  }
  return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
}

// Generate a plan name from a date
function generatePlanName(date: Date): string {
  return `Week of ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
}

export function MealPlannerPage() {
  const navigate = useNavigate();
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<MealPlan | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getMonday(new Date()));
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadMealPlans();
  }, []);

  // When week changes, find or clear the selected plan
  useEffect(() => {
    const weekDateStr = formatDateISO(currentWeekStart);
    const planForWeek = mealPlans.find(p => p.week_start_date === weekDateStr);

    if (planForWeek && planForWeek.id !== selectedPlan?.id) {
      loadPlanDetails(planForWeek.id);
    } else if (!planForWeek) {
      setSelectedPlan(null);
    }
  }, [currentWeekStart, mealPlans]);

  const loadMealPlans = async () => {
    try {
      const response = await mealPlanService.getMealPlans();
      setMealPlans(response.items);

      // Find plan for current week
      const currentWeekStr = formatDateISO(currentWeekStart);
      const currentPlan = response.items.find(p => p.week_start_date === currentWeekStr);

      if (currentPlan) {
        const plan = await mealPlanService.getMealPlanById(currentPlan.id);
        setSelectedPlan(plan);
      }
    } catch (error) {
      console.error('Failed to load meal plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPlanDetails = async (planId: string) => {
    try {
      const plan = await mealPlanService.getMealPlanById(planId);
      setSelectedPlan(plan);
    } catch (error) {
      console.error('Failed to load meal plan:', error);
    }
  };

  const handlePrevWeek = () => {
    const newWeek = new Date(currentWeekStart);
    newWeek.setDate(newWeek.getDate() - 7);
    setCurrentWeekStart(newWeek);
  };

  const handleNextWeek = () => {
    const newWeek = new Date(currentWeekStart);
    newWeek.setDate(newWeek.getDate() + 7);
    setCurrentWeekStart(newWeek);
  };

  const handleToday = () => {
    setCurrentWeekStart(getMonday(new Date()));
  };

  const handleCreatePlanForWeek = async () => {
    setCreating(true);
    try {
      const weekStartDate = formatDateISO(currentWeekStart);
      const planName = generatePlanName(currentWeekStart);

      const newPlan = await mealPlanService.createMealPlan({
        name: planName,
        week_start_date: weekStartDate,
      });

      setMealPlans([newPlan, ...mealPlans]);
      setSelectedPlan(newPlan);
    } catch (error) {
      console.error('Failed to create meal plan:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleAddMeal = async (data: PlannedMealCreate) => {
    if (!selectedPlan) return;

    try {
      await mealPlanService.addMeal(selectedPlan.id, data);
      const updatedPlan = await mealPlanService.getMealPlanById(selectedPlan.id);
      setSelectedPlan(updatedPlan);
    } catch (error) {
      console.error('Failed to add meal:', error);
    }
  };

  const handleRemoveMeal = async (mealId: string) => {
    if (!selectedPlan) return;

    try {
      await mealPlanService.removeMeal(mealId);
      const updatedPlan = await mealPlanService.getMealPlanById(selectedPlan.id);
      setSelectedPlan(updatedPlan);
    } catch (error) {
      console.error('Failed to remove meal:', error);
    }
  };

  const handleDeletePlan = async () => {
    if (!selectedPlan) return;

    if (!confirm('Are you sure you want to delete this meal plan?')) return;

    try {
      await mealPlanService.deleteMealPlan(selectedPlan.id);
      setMealPlans(mealPlans.filter((p) => p.id !== selectedPlan.id));
      setSelectedPlan(null);
    } catch (error) {
      console.error('Failed to delete meal plan:', error);
    }
  };

  const handleGenerateShoppingList = async () => {
    if (!selectedPlan) return;

    setGenerating(true);
    try {
      await shoppingService.generateShoppingList(selectedPlan.id);
      navigate('/shopping');
    } catch (error) {
      console.error('Failed to generate shopping list:', error);
    } finally {
      setGenerating(false);
    }
  };

  // Check if current week is the actual current week
  const isCurrentWeek = formatDateISO(currentWeekStart) === formatDateISO(getMonday(new Date()));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="spinner w-8 h-8"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-espresso-800">
            Meal Planner
          </h1>
          <p className="text-espresso-600 mt-1">
            Plan your meals for the week
          </p>
        </div>

        {/* Saved Plans Dropdown */}
        {mealPlans.length > 0 && (
          <select
            value={selectedPlan?.id || ''}
            onChange={(e) => {
              const plan = mealPlans.find(p => p.id === e.target.value);
              if (plan) {
                setCurrentWeekStart(new Date(plan.week_start_date + 'T00:00:00'));
              }
            }}
            className="select"
          >
            <option value="" disabled>Jump to saved week...</option>
            {mealPlans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name} ({plan.planned_meals?.length || 0} meals)
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Week Navigation */}
      <div className="card">
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevWeek}
            className="p-3 rounded-xl hover:bg-cream-100 text-espresso-600 transition-smooth press-scale"
            aria-label="Previous week"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="text-center">
            <h2 className="text-xl font-serif font-semibold text-espresso-800">
              {formatWeekLabel(currentWeekStart)}
            </h2>
            <div className="flex items-center justify-center gap-2 mt-2">
              {isCurrentWeek && (
                <span className="text-xs bg-sage-100 text-sage-700 px-3 py-1 rounded-full font-medium">
                  Current Week
                </span>
              )}
              {selectedPlan && (
                <span className="text-xs bg-cream-200 text-espresso-600 px-3 py-1 rounded-full font-medium">
                  {selectedPlan.planned_meals.length} meals planned
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleNextWeek}
            className="p-3 rounded-xl hover:bg-cream-100 text-espresso-600 transition-smooth press-scale"
            aria-label="Next week"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Today button */}
        {!isCurrentWeek && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleToday}
              className="text-sm text-coral-500 hover:text-coral-600 font-medium transition-colors"
            >
              Go to current week
            </button>
          </div>
        )}
      </div>

      {/* Week Planner */}
      {selectedPlan ? (
        <>
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-medium text-espresso-700 text-lg">{selectedPlan.name}</h3>
              </div>
              <button
                onClick={handleDeletePlan}
                className="text-espresso-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-smooth"
                title="Delete plan"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>

            <WeekPlanner
              mealPlan={selectedPlan}
              onAddMeal={handleAddMeal}
              onRemoveMeal={handleRemoveMeal}
            />
          </div>

          {/* Generate shopping list button */}
          {selectedPlan.planned_meals.length > 0 && (
            <div className="flex justify-center">
              <button
                onClick={handleGenerateShoppingList}
                disabled={generating}
                className="btn-secondary px-8 py-4 text-lg"
              >
                {generating ? (
                  <span className="flex items-center gap-2">
                    <span className="spinner w-5 h-5 border-white/30 border-t-white"></span>
                    Generating...
                  </span>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    Generate Shopping List
                  </>
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="card text-center py-12">
          <div className="text-5xl mb-4">📅</div>
          <p className="text-espresso-600 mb-6 text-lg">
            No meal plan for this week yet.
          </p>
          <button
            onClick={handleCreatePlanForWeek}
            disabled={creating}
            className="btn-primary px-6 py-3"
          >
            {creating ? (
              <span className="flex items-center gap-2">
                <span className="spinner w-5 h-5 border-white/30 border-t-white"></span>
                Creating...
              </span>
            ) : (
              `Create Plan for ${generatePlanName(currentWeekStart)}`
            )}
          </button>
        </div>
      )}

      {/* Saved weeks overview */}
      {mealPlans.length > 0 && (
        <div className="card">
          <h3 className="font-medium text-espresso-700 mb-4">Your Saved Weeks</h3>
          <div className="flex flex-wrap gap-2">
            {mealPlans.map((plan) => {
              const isSelected = selectedPlan?.id === plan.id;
              return (
                <button
                  key={plan.id}
                  onClick={() => setCurrentWeekStart(new Date(plan.week_start_date + 'T00:00:00'))}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-smooth press-scale ${
                    isSelected
                      ? 'bg-coral-500 text-white shadow-glow-coral'
                      : 'bg-cream-100 text-espresso-700 hover:bg-cream-200'
                  }`}
                >
                  {plan.name}
                  <span className="ml-1.5 opacity-70">({plan.planned_meals?.length || 0})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
