import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

interface OptionTileProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  name?: string;
  value?: string;
  className?: string;
}

/**
 * Radio tile: native radio input visually hidden behind a 8px card. Used for
 * experience level, learning goal, theme and similar single-choice groups.
 */
const OptionTile: React.FC<OptionTileProps> = ({
  title,
  description,
  selected,
  onSelect,
  disabled,
  name,
  value,
  className,
}) => (
  <label
    className={cn(
      'relative flex min-h-[44px] cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors',
      selected
        ? 'border-accent bg-accent/[0.08]'
        : 'border-border-subtle bg-surface hover:border-text-muted/30',
      disabled && 'pointer-events-none opacity-55',
      className,
    )}
  >
    <input
      type="radio"
      name={name}
      value={value}
      checked={selected}
      disabled={disabled}
      onChange={onSelect}
      className="sr-only"
    />
    <span
      className={cn(
        'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
        selected ? 'border-accent bg-accent text-on-accent' : 'border-border',
      )}
      aria-hidden="true"
    >
      {selected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
    </span>
    <span className="min-w-0">
      <span className="block text-base font-medium text-text-primary">{title}</span>
      {description && (
        <span className="mt-1 block text-sm text-text-muted">{description}</span>
      )}
    </span>
  </label>
);

export default OptionTile;
