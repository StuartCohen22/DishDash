import { ShoppingList as ShoppingListType } from '@/types';
import { ShoppingItem } from './ShoppingItem';

interface ShoppingListProps {
  shoppingList: ShoppingListType;
  onToggleItem: (itemId: string, isPurchased: boolean) => void;
  onDeleteItem: (itemId: string) => void;
}

export function ShoppingList({ shoppingList, onToggleItem, onDeleteItem }: ShoppingListProps) {
  // Separate items into categories
  const toBuyItems = shoppingList.items.filter(
    (item) => !item.is_pantry_item && !item.is_purchased
  );
  const pantryItems = shoppingList.items.filter(
    (item) => item.is_pantry_item && !item.is_purchased
  );
  const purchasedItems = shoppingList.items.filter((item) => item.is_purchased);

  // Sort alphabetically
  const sortByName = (a: { ingredient_name: string }, b: { ingredient_name: string }) =>
    a.ingredient_name.localeCompare(b.ingredient_name);

  return (
    <div className="space-y-6">
      {/* To Buy section */}
      <div>
        <h3 className="font-serif font-semibold text-cookbook-800 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-cookbook-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          To Buy
          <span className="text-sm font-normal text-cookbook-500">
            ({toBuyItems.length} items)
          </span>
        </h3>
        {toBuyItems.length === 0 ? (
          <p className="text-cookbook-500 text-sm italic">All items purchased!</p>
        ) : (
          <div className="space-y-2">
            {[...toBuyItems].sort(sortByName).map((item) => (
              <ShoppingItem
                key={item.id}
                item={item}
                onToggle={onToggleItem}
                onDelete={onDeleteItem}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pantry Items section */}
      {pantryItems.length > 0 && (
        <div>
          <h3 className="font-serif font-semibold text-cookbook-800 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            Pantry Items
            <span className="text-sm font-normal text-cookbook-500">
              (check if needed)
            </span>
          </h3>
          <p className="text-sm text-cookbook-500 mb-3">
            These are spices and seasonings you likely already have. Check your pantry!
          </p>
          <div className="space-y-2">
            {[...pantryItems].sort(sortByName).map((item) => (
              <ShoppingItem
                key={item.id}
                item={item}
                onToggle={onToggleItem}
                onDelete={onDeleteItem}
              />
            ))}
          </div>
        </div>
      )}

      {/* Purchased section */}
      {purchasedItems.length > 0 && (
        <div>
          <h3 className="font-serif font-semibold text-cookbook-800 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-sage-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Purchased
            <span className="text-sm font-normal text-cookbook-500">
              ({purchasedItems.length} items)
            </span>
          </h3>
          <div className="space-y-2">
            {[...purchasedItems].sort(sortByName).map((item) => (
              <ShoppingItem
                key={item.id}
                item={item}
                onToggle={onToggleItem}
                onDelete={onDeleteItem}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
