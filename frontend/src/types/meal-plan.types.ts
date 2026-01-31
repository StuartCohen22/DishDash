import { Recipe } from './recipe.types';

export enum MealType {
  BREAKFAST = 'breakfast',
  LUNCH = 'lunch',
  DINNER = 'dinner',
  SNACK = 'snack',
}

export interface PlannedMeal {
  id: string;
  recipe_id: string;
  day_of_week: number; // 0 = Monday, 6 = Sunday
  meal_type: MealType;
  recipe: Recipe;
  created_at: string;
}

export interface PlannedMealCreate {
  recipe_id: string;
  day_of_week: number;
  meal_type: MealType;
}

export interface ShoppingListSummary {
  id: string;
  generated_at: string;
  item_count: number;
}

export interface MealPlan {
  id: string;
  user_id: string;
  name: string;
  week_start_date: string; // ISO date string (YYYY-MM-DD)
  planned_meals: PlannedMeal[];
  shopping_list: ShoppingListSummary | null;
  created_at: string;
  updated_at: string;
}

export interface MealPlanCreate {
  name: string;
  week_start_date: string;
}

export interface MealPlanUpdate {
  name?: string;
  week_start_date?: string;
}

export interface MealPlanListResponse {
  items: MealPlan[];
  total: number;
}

// Helper type for the weekly grid
export type WeekGrid = {
  [day: number]: {
    [mealType: string]: PlannedMeal | null;
  };
};

// Days of week labels
export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

// Meal type labels
export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  [MealType.BREAKFAST]: 'Breakfast',
  [MealType.LUNCH]: 'Lunch',
  [MealType.DINNER]: 'Dinner',
  [MealType.SNACK]: 'Snack',
};
