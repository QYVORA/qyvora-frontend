import React from 'react';
import { motion } from 'motion/react';
import type { ViewMode } from './types';

export interface CardCollectionProps<T> {
  items: T[];
  renderItem: (item: T, view: ViewMode, index: number) => React.ReactNode;
  keyOf: (item: T, index: number) => React.Key;
  view: ViewMode;
  className?: string;
  gridClassName?: string;
  expandedClassName?: string;
}

const GRID_CLASSES = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6';
const EXPANDED_CLASSES = 'flex flex-col gap-3 md:gap-4';

const LAYOUT_TRANSITION = { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const };

/**
 * Renders a collection of cards in either a responsive grid or an expanded
 * full-width list layout. Only the presentation changes — the same items are
 * used in both modes, so filtering/searching/pagination is untouched.
 *
 * The parent owns the view state and renders the shared ViewToggle wherever it
 * fits best (typically next to the page heading or search bar).
 */
const CardCollection = <T,>({
  items,
  renderItem,
  keyOf,
  view,
  className = '',
  gridClassName,
  expandedClassName,
}: CardCollectionProps<T>) => {
  const isGrid = view === 'grid';
  const containerClass = isGrid
    ? gridClassName ?? GRID_CLASSES
    : expandedClassName ?? EXPANDED_CLASSES;

  return (
    <div className={`${containerClass} ${className}`}>
      {items.map((item, index) => (
        <motion.div
          key={keyOf(item, index)}
          layout
          transition={LAYOUT_TRANSITION}
          className={isGrid ? 'h-full' : undefined}
        >
          <div key={view} className={isGrid ? 'h-full' : undefined}>
            {renderItem(item, view, index)}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default CardCollection;
