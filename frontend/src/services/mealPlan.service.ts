import api from './api';
import {
  MealPlan,
  MealPlanCreate,
  MealPlanListResponse,
  MealPlanUpdate,
  PlannedMeal,
  PlannedMealCreate,
} from '@/types';

export const mealPlanService = {
  /**
   * Get all meal plans for the current user
   */
  async getMealPlans(): Promise<MealPlanListResponse> {
    const response = await api.get<MealPlanListResponse>('/meal-plans');
    return response.data;
  },

  /**
   * Get a single meal plan by ID
   */
  async getMealPlanById(id: string): Promise<MealPlan> {
    const response = await api.get<MealPlan>(`/meal-plans/${id}`);
    return response.data;
  },

  /**
   * Create a new meal plan
   */
  async createMealPlan(data: MealPlanCreate): Promise<MealPlan> {
    const response = await api.post<MealPlan>('/meal-plans', data);
    return response.data;
  },

  /**
   * Update an existing meal plan
   */
  async updateMealPlan(id: string, data: MealPlanUpdate): Promise<MealPlan> {
    const response = await api.put<MealPlan>(`/meal-plans/${id}`, data);
    return response.data;
  },

  /**
   * Delete a meal plan
   */
  async deleteMealPlan(id: string): Promise<void> {
    await api.delete(`/meal-plans/${id}`);
  },

  /**
   * Add a meal to a plan slot
   */
  async addMeal(planId: string, data: PlannedMealCreate): Promise<PlannedMeal> {
    const response = await api.post<PlannedMeal>(`/meal-plans/${planId}/meals`, data);
    return response.data;
  },

  /**
   * Remove a meal from a plan
   */
  async removeMeal(mealId: string): Promise<void> {
    await api.delete(`/planned-meals/${mealId}`);
  },
};
