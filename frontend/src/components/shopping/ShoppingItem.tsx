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
      className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-smooth group ${
        item.is_purchased
          ? 'bg-sage-50/50 border-sage-200/60'
          : 'bg-white border-cream-200/60 hover:border-cream-300 shadow-soft-sm'
      }`}
    >
      {/* Animated Checkbox */}
      <button
        onClick={() => onToggle(item.id, !item.is_purchased)}
        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-smooth press-scale ${
          item.is_purchased
            ? 'bg-sage-500 border-sage-500 text-white shadow-glow-sage'
            : 'border-cream-300 hover:border-sage-400 hover:bg-sage-50'
        }`}
      >
        <svg
          className={`w-4 h-4 transition-all duration-200 ${
            item.is_purchased ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </button>

      {/* Item details */}
      <div className="flex-1 min-w-0">
        <p
          className={`font-medium transition-all duration-200 ${
            item.is_purchased
              ? 'text-espresso-400 line-through decoration-sage-400'
              : 'text-espresso-800'
          }`}
        >
          {item.ingredient_name}
        </p>
        <p className={`text-sm mt-0.5 ${item.is_purchased ? 'text-espresso-400' : 'text-espresso-600'}`}>
          {item.quantity} {formatUnit(item.unit)}
        </p>
      </div>

      {/* Delete button */}
      <button
        onClick={() => onDelete(item.id)}
        className="p-2 rounded-lg text-espresso-400 hover:text-red-500 hover:bg-red-50
          opacity-0 group-hover:opacity-100 transition-smooth"
        aria-label="Remove item"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
