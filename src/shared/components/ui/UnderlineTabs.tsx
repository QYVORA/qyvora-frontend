import React, { useRef } from 'react';
import { cn } from '@/shared/utils/cn';

export interface TabItem {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  count?: number;
}

interface UnderlineTabsProps {
  tabs: TabItem[];
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  className?: string;
}

/** Section tabs: sentence-case label with a 2px accent underline. */
const UnderlineTabs: React.FC<UnderlineTabsProps> = ({
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
    } else if (event.key === 'Home') {
      event.preventDefault();
      move(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      move(tabs.length - 1);
    }
  };

  return (
    <div role="tablist" aria-label={ariaLabel} className={cn('flex gap-6 border-b border-border-subtle', className)}>
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
              'relative -mb-px flex min-h-[44px] items-center gap-2 border-b-2 pb-3 pt-2 text-[15px] transition-colors',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
              active
                ? 'border-accent font-medium text-text-primary'
                : 'border-transparent text-text-muted hover:text-text-secondary',
            )}
          >
            {tab.icon && <span className="[&_svg]:h-4 [&_svg]:w-4">{tab.icon}</span>}
            {tab.label}
            {typeof tab.count === 'number' && (
              <span className="rounded-full bg-surface-raised px-2 py-0.5 text-xs tabular-nums text-text-muted">
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default UnderlineTabs;
