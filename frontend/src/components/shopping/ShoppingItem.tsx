import { ShoppingItem as ShoppingItemType } from '@/types';

interface ShoppingItemProps {
  item: ShoppingItemType;
  onToggle: (itemId: string, isPurchased: boolean) => void;
  onDelete: (itemId: string) => void;
}

export function ShoppingItem({ item, onToggle, onDelete }: ShoppingItemProps) {
  const formatUnit = (unit: string) => {
    return unit.replace(/_/g, ' ');
  };

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
        item.is_purchased
          ? 'bg-cookbook-100 border-cookbook-200'
          : 'bg-white border-cookbook-200 hover:border-cookbook-300'
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(item.id, !item.is_purchased)}
        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
          item.is_purchased
            ? 'bg-sage-500 border-sage-500 text-white'
            : 'border-cookbook-300 hover:border-sage-400'
        }`}
      >
        {item.is_purchased && (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Item details */}
      <div className="flex-1 min-w-0">
        <p
          className={`font-medium ${
            item.is_purchased ? 'text-cookbook-400 line-through' : 'text-cookbook-800'
          }`}
        >
          {item.ingredient_name}
        </p>
        <p className="text-sm text-cookbook-500">
          {item.quantity} {formatUnit(item.unit)}
        </p>
      </div>

      {/* Delete button */}
      <button
        onClick={() => onDelete(item.id)}
        className="p-1 text-cookbook-400 hover:text-red-500 transition-colors"
        aria-label="Remove item"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
