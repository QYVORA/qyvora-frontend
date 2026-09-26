import React from 'react';
import InlineCode from '@/shared/components/docs/InlineCode';
import { cn } from '@/shared/utils/cn';

export interface DocDefinition {
  term: string;
  detail: string;
}

interface DocDefinitionsProps {
  items: DocDefinition[];
  className?: string;
}

/**
 * DocDefinitions — term/description pairs for flags, config keys and settings.
 * The term column is fixed so a long list of `--flags` aligns into one column.
 */
const DocDefinitions: React.FC<DocDefinitionsProps> = ({ items, className }) => {
  if (!items.length) return null;

  return (
    <dl className={cn('min-w-0 border-t border-border-subtle', className)}>
      {items.map((item) => (
        <div
          key={item.term}
          className="grid grid-cols-1 gap-x-6 gap-y-1 border-b border-border-subtle py-2.5 sm:grid-cols-[minmax(0,16rem)_minmax(0,1fr)]"
        >
          <dt className="min-w-0 font-mono text-xs">
            <InlineCode code={item.term} lang="sh" />
          </dt>
          <dd className="min-w-0 text-sm leading-relaxed text-text-secondary">{item.detail}</dd>
        </div>
      ))}
    </dl>
  );
};

export default DocDefinitions;
