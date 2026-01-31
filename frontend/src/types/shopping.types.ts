export interface ShoppingItem {
  id: string;
  ingredient_name: string;
  quantity: number;
  unit: string;
  is_purchased: boolean;
  is_pantry_item: boolean;
  created_at: string;
}

export interface ShoppingList {
  id: string;
  meal_plan_id: string;
  generated_at: string;
  updated_at: string;
  items: ShoppingItem[];
  to_buy_count: number;
  pantry_count: number;
  purchased_count: number;
}

export interface ShoppingItemUpdate {
  is_purchased: boolean;
}
