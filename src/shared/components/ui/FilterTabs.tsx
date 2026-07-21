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
    ? 'px-4 py-2 rounded-xl text-[11px]'
    : 'px-5 py-2.5 rounded-xl text-xs';

  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={cn(
            sizeClasses,
            'font-black uppercase tracking-wider transition-all duration-300',
            activeKey === tab.key
              ? 'bg-accent text-bg'
              : 'bg-bg-card border border-border text-text-muted hover:border-accent/30 hover:text-accent',
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
