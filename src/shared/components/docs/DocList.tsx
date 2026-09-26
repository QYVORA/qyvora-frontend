import React from 'react';
import { cn } from '@/shared/utils/cn';

interface DocListProps {
  items: string[];
  ordered?: boolean;
  className?: string;
}

/**
 * DocList — plain prose list. Two-column on wide viewports, single column
 * below, so a long requirement list stays one readable measure.
 */
const DocList: React.FC<DocListProps> = ({ items, ordered = false, className }) => {
  const List = ordered ? 'ol' : 'ul';

  return (
    <List
      className={cn(
        'grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2',
        className,
      )}
    >
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2.5">
          <span className="mt-[0.7em] h-px w-3 shrink-0 bg-accent" aria-hidden="true" />
          <span className="min-w-0 text-sm leading-[1.9] text-text-secondary">{item}</span>
        </li>
      ))}
    </List>
  );
};

export default DocList;
