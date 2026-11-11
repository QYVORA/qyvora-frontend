import React from 'react';
import { cn } from '@/shared/utils/cn';

export type TwoColumnSplit = 'dash' | 'profile' | 'rail';

interface TwoColumnProps {
  split: TwoColumnSplit;
  children: React.ReactNode;
  className?: string;
}

const SPLIT_CLASS: Record<TwoColumnSplit, string> = {
  // dashboard: ~67 / 33
  dash: 'lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]',
  // profile: ~36 / 64
  profile: 'lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)]',
  // settings: fixed 306px rail + content
  rail: 'lg:grid-cols-[306px_minmax(0,1fr)]',
};

/**
 * TwoColumn — the one shared page split. Single column below `lg` (1024px);
 * explicit, literal grid templates from `lg` so Tailwind always emits them.
 * Children must carry `min-w-0`; the caller stacks them in DOM order.
 */
const TwoColumn: React.FC<TwoColumnProps> = ({ split, children, className }) => (
  <div className={cn('grid grid-cols-1 items-start gap-6', SPLIT_CLASS[split], className)}>
    {children}
  </div>
);

export default TwoColumn;
