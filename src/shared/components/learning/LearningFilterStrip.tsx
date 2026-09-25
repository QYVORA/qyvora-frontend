import React from 'react';

export interface LearningFilter {
  id: string;
  label: string;
  count?: number;
}

interface LearningFilterStripProps {
  filters: LearningFilter[];
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
}

const LearningFilterStrip: React.FC<LearningFilterStripProps> = ({
  filters,
  activeFilter,
  onFilterChange,
}) => {
  if (!filters || filters.length === 0) return null;

  return (
    <div className="border border-border-subtle rounded-xl bg-surface p-1.5 flex flex-wrap items-center gap-1">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.id;
        return (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            aria-pressed={isActive}
            className={`min-h-[44px] flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-[background-color,color,box-shadow] ${
              isActive
                ? 'bg-accent text-on-accent shadow-sm'
                : 'text-text-muted hover:text-accent hover:bg-surface-raised'
            }`}
          >
            {filter.label}
            {filter.count != null && (
              <span className={`text-xs font-mono ${isActive ? 'text-on-accent/60' : 'text-text-muted/40'}`}>
                {filter.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default LearningFilterStrip;