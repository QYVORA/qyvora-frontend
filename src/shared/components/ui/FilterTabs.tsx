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
  idPrefix?: string;
  ariaLabel?: string;
}

const FilterTabs: React.FC<FilterTabsProps> = ({
  tabs,
  activeKey,
  onChange,
  size = 'md',
  className,
  idPrefix,
  ariaLabel,
}) => {
  const sizeClasses = size === 'sm'
    ? 'px-4 min-h-[44px] rounded-xl text-xs'
    : 'px-5 min-h-[44px] rounded-xl text-xs';

  return (
    <div
      className={cn('flex items-center gap-2 flex-wrap', className)}
      role="tablist"
      aria-label={ariaLabel}
    >
      {tabs.map((tab, index) => (
        <button
          key={tab.key}
          id={idPrefix ? `${idPrefix}-tab-${tab.key}` : undefined}
          type="button"
          onClick={() => onChange(tab.key)}
          onKeyDown={idPrefix ? (event) => {
            const nextIndex = event.key === 'ArrowRight'
              ? (index + 1) % tabs.length
              : event.key === 'ArrowLeft'
                ? (index - 1 + tabs.length) % tabs.length
                : event.key === 'Home'
                  ? 0
                  : event.key === 'End'
                    ? tabs.length - 1
                    : -1;
            if (nextIndex < 0) return;
            event.preventDefault();
            const nextTab = tabs[nextIndex];
            onChange(nextTab.key);
            document.getElementById(`${idPrefix}-tab-${nextTab.key}`)?.focus();
          } : undefined}
          role="tab"
          aria-selected={activeKey === tab.key}
          aria-controls={idPrefix ? `${idPrefix}-panel` : undefined}
          tabIndex={idPrefix ? (activeKey === tab.key ? 0 : -1) : undefined}
          className={cn(
            sizeClasses,
            'font-black uppercase tracking-wider transition-[background-color,color,border-color,transform] duration-[var(--dur-base)] ease-[var(--ease-smooth)] active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
            activeKey === tab.key
              ? 'bg-accent text-on-accent'
              : 'bg-bg-card border border-border text-text-muted hover:border-accent/50 hover:text-accent',
          )}
        >
          <span className="inline-flex items-center gap-2">
            {tab.icon}
            {tab.label}
            {tab.count !== undefined && (
              <span className="text-xs font-mono opacity-70">{tab.count}</span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;
