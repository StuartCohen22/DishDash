interface ChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export function Chip({ label, active = false, onClick }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`chip transition-colors ${
        active ? 'chip-active' : ''
      } ${onClick ? 'cursor-pointer hover:bg-cookbook-200' : 'cursor-default'}`}
    >
      {label}
    </button>
  );
}
