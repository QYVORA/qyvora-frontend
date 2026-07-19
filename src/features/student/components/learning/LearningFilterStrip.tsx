interface LearningFilter {
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
    <div className="border border-border/30 rounded-xl bg-bg-card p-1.5 flex items-center gap-1">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.id;
        return (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              isActive
                ? 'bg-accent text-bg shadow-sm'
                : 'text-text-muted hover:text-accent hover:bg-bg-elevated'
            }`}
          >
            {filter.label}
            {filter.count != null && (
              <span className={`text-[9px] font-mono ${isActive ? 'text-bg/60' : 'text-text-muted/40'}`}>
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
