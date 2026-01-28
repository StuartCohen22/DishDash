import api from './api';
import {
  CategoryOption,
  Recipe,
  RecipeCreate,
  RecipeListResponse,
  RecipeUpdate,
} from '@/types';

export interface RecipeListParams {
  page?: number;
  page_size?: number;
  category?: string;
  search?: string;
}

export const recipeService = {
  /**
   * Get list of recipes with pagination and filters
   */
  async getRecipes(params: RecipeListParams = {}): Promise<RecipeListResponse> {
    const response = await api.get<RecipeListResponse>('/recipes', { params });
    return response.data;
  },

  /**
   * Get a single recipe by ID
   */
  async getRecipeById(id: string): Promise<Recipe> {
    const response = await api.get<Recipe>(`/recipes/${id}`);
    return response.data;
  },

  /**
   * Create a new recipe
   */
  async createRecipe(data: RecipeCreate): Promise<Recipe> {
    const response = await api.post<Recipe>('/recipes', data);
    return response.data;
  },

  /**
   * Update an existing recipe
   */
  async updateRecipe(id: string, data: RecipeUpdate): Promise<Recipe> {
    const response = await api.put<Recipe>(`/recipes/${id}`, data);
    return response.data;
  },

  /**
   * Delete a recipe
   */
  async deleteRecipe(id: string): Promise<void> {
    await api.delete(`/recipes/${id}`);
  },

  /**
   * Get available recipe categories
   */
  async getCategories(): Promise<CategoryOption[]> {
    const response = await api.get<{ categories: CategoryOption[] }>(
      '/recipes/categories'
    );
    return response.data.categories;
  },
};
