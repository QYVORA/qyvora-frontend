import React from 'react';
import { cn } from '@/shared/utils/cn';

interface FilterTab {
  key: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

interface FilterTabsProps {
  tabs: FilterTab[];
  activeKey: string;
  onChange: (key: string) => void;
  size?: 'sm' | 'md';
  className?: string;
}

const FilterTabs: React.FC<FilterTabsProps> = ({ tabs, activeKey, onChange, size = 'md', className }) => {
  const sizeClasses = size === 'sm'
    ? 'px-4 min-h-[44px] rounded-xl text-[11px]'
    : 'px-5 min-h-[44px] rounded-xl text-xs';

  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          role="tab"
          aria-selected={activeKey === tab.key}
          className={cn(
            sizeClasses,
            'font-black uppercase tracking-wider transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
            activeKey === tab.key
              ? 'bg-accent text-on-accent'
              : 'bg-bg-card border border-border text-text-muted hover:border-accent/50 hover:text-accent',
          )}
        >
          <span className="inline-flex items-center gap-2">
            {tab.icon}
            {tab.label}
            {tab.count !== undefined && (
              <span className="text-[9px] font-mono opacity-70">{tab.count}</span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;
