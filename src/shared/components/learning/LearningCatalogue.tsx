import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import LearningCard from './LearningCard';
import type { LearningCardProps } from './LearningCard';
import LearningFilterStrip from './LearningFilterStrip';

export interface LearningCatalogueItem extends LearningCardProps {
  key: string;
}

interface LearningCatalogueProps {
  items: LearningCatalogueItem[];
  className?: string;
  gridClassName?: string;
  showFilter?: boolean;
  showSearch?: boolean;
  searchPlaceholder?: string;
  filterLabel?: (id: string) => string;
  renderItem?: (item: LearningCatalogueItem) => React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
}

const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'] as const;

const baseDifficulty = (difficulty?: LearningCardProps['difficulty']) =>
  (difficulty ?? '').split('-')[0].toLowerCase();

const LearningCatalogue: React.FC<LearningCatalogueProps> = ({
  items,
  className = '',
  gridClassName = 'mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3',
  showFilter = true,
  showSearch = false,
  searchPlaceholder,
  filterLabel,
  renderItem,
  emptyTitle,
  emptyDescription,
}) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filters = useMemo(() => {
    const counts: Record<string, number> = { all: items.length };
    items.forEach((item) => {
      const level = baseDifficulty(item.difficulty);
      if (DIFFICULTIES.includes(level as (typeof DIFFICULTIES)[number])) {
        counts[level] = (counts[level] ?? 0) + 1;
      }
    });
    const difficultyFilters = DIFFICULTIES.filter((level) => counts[level] > 0).map((level) => ({
      id: level,
      label:
        filterLabel?.(level) ??
        level.charAt(0).toUpperCase() + level.slice(1),
      count: counts[level],
    }));
    return [
      {
        id: 'all',
        label: filterLabel?.('all') ?? "All",
        count: counts.all,
      },
      ...difficultyFilters,
    ];
  }, [filterLabel, items]);

  const filteredItems = useMemo(() => {
    let result = items;
    if (activeFilter !== 'all') {
      result = result.filter((item) => baseDifficulty(item.difficulty) === activeFilter);
    }
    if (searchQuery) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (item) =>
          item.title?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q),
      );
    }
    return result;
  }, [activeFilter, items, searchQuery]);

  const showEmpty = filteredItems.length === 0;

  return (
    <div className={className}>
      {showFilter && (
        <LearningFilterStrip
          filters={filters}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      )}

      {showSearch && (
        <div className="relative mt-4">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface border border-border-subtle rounded-xl py-3 pl-11 pr-4 text-sm text-text-primary outline-none font-mono transition-colors focus:border-accent"
          />
        </div>
      )}

      <p className="mt-4 text-xs font-mono uppercase tracking-widest text-text-muted" role="status">
        {`${filteredItems.length} items`}
      </p>

      {showEmpty ? (
        <div className="mt-6 flex flex-col items-start gap-2 rounded-2xl border border-border-subtle bg-surface p-8">
          <h3 className="text-sm font-black uppercase tracking-tight text-text-primary">
            {emptyTitle ?? "No items match this filter"}
          </h3>
          {emptyDescription && (
            <p className="text-sm font-mono text-text-muted">{emptyDescription}</p>
          )}
        </div>
      ) : (
        <div className={gridClassName}>
          {filteredItems.map((item) =>
            renderItem ? (
              <div key={item.key}>{renderItem(item)}</div>
            ) : (
              <LearningCard key={item.key} {...item} />
            ),
          )}
        </div>
      )}
    </div>
  );
};

export default LearningCatalogue;