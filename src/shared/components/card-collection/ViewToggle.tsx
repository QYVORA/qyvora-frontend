import React from 'react';
import { LayoutGrid, Rows3 } from 'lucide-react';
import type { ViewMode } from './types';

interface ViewToggleProps {
  value: ViewMode;
  onChange: (view: ViewMode) => void;
  className?: string;
  label?: string;
}

const VIEW_OPTIONS: { mode: ViewMode; label: string; Icon: React.ElementType }[] = [
  { mode: 'grid', label: 'Grid view', Icon: LayoutGrid },
  { mode: 'expanded', label: 'List view', Icon: Rows3 },
];

/**
 * Compact icon-only control for switching a card collection between
 * grid and expanded/list presentation modes.
 */
const ViewToggle: React.FC<ViewToggleProps> = ({
  value,
  onChange,
  className = '',
  label = 'View mode',
}) => (
  <div
    role="group"
    aria-label={label}
    className={`inline-flex items-center gap-0.5 rounded-xl border border-border/30 bg-bg-card p-1 ${className}`}
  >
    {VIEW_OPTIONS.map(({ mode, label: buttonLabel, Icon }) => {
      const isActive = value === mode;
      return (
        <button
          key={mode}
          type="button"
          aria-pressed={isActive}
          aria-label={buttonLabel}
          title={buttonLabel}
          onClick={() => onChange(mode)}
          className={`flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-200 ${
            isActive
              ? 'bg-accent text-on-accent'
              : 'text-text-muted hover:text-accent hover:bg-bg-elevated'
          }`}
        >
          <Icon className="w-3.5 h-3.5" />
        </button>
      );
    })}
  </div>
);

export default ViewToggle;
