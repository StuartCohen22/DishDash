export enum RecipeCategory {
  BREAKFAST = 'breakfast',
  LUNCH = 'lunch',
  DINNER = 'dinner',
  SNACK = 'snack',
  DESSERT = 'dessert',
  BEVERAGE = 'beverage',
}

export enum IngredientUnit {
  CUP = 'cup',
  TABLESPOON = 'tablespoon',
  TEASPOON = 'teaspoon',
  MILLILITER = 'milliliter',
  LITER = 'liter',
  FLUID_OUNCE = 'fluid_ounce',
  GRAM = 'gram',
  KILOGRAM = 'kilogram',
  OUNCE = 'ounce',
  POUND = 'pound',
  PIECE = 'piece',
  WHOLE = 'whole',
  SLICE = 'slice',
  CLOVE = 'clove',
  PINCH = 'pinch',
  DASH = 'dash',
  TO_TASTE = 'to_taste',
}

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: IngredientUnit;
  order_index: number;
}

export interface IngredientInput {
  name: string;
  quantity: number;
  unit: IngredientUnit;
  order_index?: number;
}

export interface Recipe {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  instructions: string;
  prep_time_minutes: number;
  cook_time_minutes: number;
  servings: number;
  category: RecipeCategory;
  ingredients: Ingredient[];
  created_at: string;
  updated_at: string;
}

export interface RecipeCreate {
  name: string;
  description?: string;
  instructions: string;
  prep_time_minutes?: number;
  cook_time_minutes?: number;
  servings?: number;
  category: RecipeCategory;
  ingredients: IngredientInput[];
}

export interface RecipeUpdate {
  name?: string;
  description?: string;
  instructions?: string;
  prep_time_minutes?: number;
  cook_time_minutes?: number;
  servings?: number;
  category?: RecipeCategory;
  ingredients?: IngredientInput[];
}

export interface RecipeListResponse {
  items: Recipe[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export interface CategoryOption {
  value: string;
  label: string;
}
