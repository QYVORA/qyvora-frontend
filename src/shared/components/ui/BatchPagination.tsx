import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BatchPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  className?: string;
}

export const BatchPagination: React.FC<BatchPaginationProps> = ({
  page,
  totalPages,
  onPageChange,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-center gap-3 pt-4 shrink-0 ${className}`}>
      <button
        onClick={() => onPageChange(Math.max(0, page - 1))}
        disabled={page === 0}
        aria-label="Previous batch"
        className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border/50 bg-bg-card text-text-muted hover:border-accent/40 hover:text-text-primary transition-all disabled:opacity-50 disabled:pointer-events-none text-[10px] font-black uppercase tracking-widest"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        <span>Prev</span>
      </button>

      <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-bg-card border border-border/20">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => onPageChange(i)}
            aria-label={`Go to batch ${i + 1}`}
            className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full transition-all duration-300 ${
              i === page
                ? 'w-6 bg-accent'
                : 'w-2 bg-text-muted/30 hover:bg-text-muted/60'
            }`}
          />
        ))}
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
        disabled={page >= totalPages - 1}
        aria-label="Next batch"
        className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border/50 bg-bg-card text-text-muted hover:border-accent/40 hover:text-text-primary transition-all disabled:opacity-50 disabled:pointer-events-none text-[10px] font-black uppercase tracking-widest"
      >
        <span>Next</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default BatchPagination;
