import React, { useRef } from 'react';
import { cn } from '@/shared/utils/cn';
import type { TabItem } from './UnderlineTabs';

interface SegmentedTabsProps {
  tabs: TabItem[];
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  className?: string;
}

/** Pill group on a canvas track; active segment lifts to surface. */
const SegmentedTabs: React.FC<SegmentedTabsProps> = ({
  tabs,
  value,
  onChange,
  ariaLabel,
  className,
}) => {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  const move = (index: number) => {
    const next = (index + tabs.length) % tabs.length;
    onChange(tabs[next].value);
    refs.current[next]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      move(index + 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      move(index - 1);
    }
  };

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn('inline-flex items-center gap-1 rounded-xl bg-canvas p-1', className)}
    >
      {tabs.map((tab, index) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            ref={(el) => { refs.current[index] = el; }}
            type="button"
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(tab.value)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={cn(
              'flex min-h-[36px] items-center justify-center gap-1.5 rounded-lg px-3 text-sm transition-colors',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
              active
                ? 'bg-surface font-medium text-text-primary'
                : 'text-text-muted hover:text-text-secondary',
            )}
          >
            {tab.icon && <span className="[&_svg]:h-4 [&_svg]:w-4">{tab.icon}</span>}
            {tab.label}
            {typeof tab.count === 'number' && (
              <span className="tabular-nums text-text-muted">{tab.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default SegmentedTabs;
