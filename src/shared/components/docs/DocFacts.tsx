import React from 'react';
import { cn } from '@/shared/utils/cn';

export interface DocFact {
  label: string;
  value: string;
  /** Render the value in monospace — for versions, paths and module names. */
  mono?: boolean;
}

interface DocFactsProps {
  items: DocFact[];
  className?: string;
}

/**
 * DocFacts — the "at a glance" strip under a page heading.
 *
 * A description list of the facts a reader needs before anything else: module
 * path, Go version, license, entrypoint. Flat rows, no tiles.
 */
const DocFacts: React.FC<DocFactsProps> = ({ items, className }) => {
  if (!items.length) return null;

  return (
    <dl
      className={cn(
        'grid grid-cols-1 gap-x-8 border-t border-border-subtle sm:grid-cols-2 lg:grid-cols-3',
        className,
      )}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="flex min-w-0 flex-col gap-0.5 border-b border-border-subtle py-3"
        >
          <dt className="font-mono text-[11px] font-black uppercase tracking-[0.16em] text-text-muted">
            {item.label}
          </dt>
          <dd
            className={cn(
              'min-w-0 break-words text-sm text-text-primary',
              item.mono !== false && 'font-mono',
            )}
          >
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
};

export default DocFacts;
