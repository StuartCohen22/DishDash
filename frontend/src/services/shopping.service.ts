import api from './api';
import { ShoppingItem, ShoppingItemUpdate, ShoppingList } from '@/types';

export const shoppingService = {
  /**
   * Generate a shopping list from a meal plan
   */
  async generateShoppingList(planId: string): Promise<ShoppingList> {
    const response = await api.post<ShoppingList>(`/meal-plans/${planId}/shopping-list`);
    return response.data;
  },

  /**
   * Get a shopping list by ID
   */
  async getShoppingList(listId: string): Promise<ShoppingList> {
    const response = await api.get<ShoppingList>(`/shopping-lists/${listId}`);
    return response.data;
  },

  /**
   * Get shopping list for a meal plan
   */
  async getShoppingListByPlan(planId: string): Promise<ShoppingList> {
    const response = await api.get<ShoppingList>(`/meal-plans/${planId}/shopping-list`);
    return response.data;
  },

  /**
   * Toggle purchased status of an item
   */
  async updateItem(itemId: string, data: ShoppingItemUpdate): Promise<ShoppingItem> {
    const response = await api.patch<ShoppingItem>(`/shopping-items/${itemId}`, data);
    return response.data;
  },

  /**
   * Delete a shopping item
   */
  async deleteItem(itemId: string): Promise<void> {
    await api.delete(`/shopping-items/${itemId}`);
  },
};
