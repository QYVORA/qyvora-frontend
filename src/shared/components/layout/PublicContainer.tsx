import React from 'react';
import { cn } from '@/shared/utils/cn';

interface PublicContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * PublicContainer — canonical content column for every public marketing page.
 *
 * Full-viewport width with the standard public gutters (`px-3 md:px-4 lg:px-6`)
 * and NO page-level max-width. Every public surface (navbar, landing blocks,
 * inner pages, footer) shares these exact gutters so one vertical measuring
 * line runs edge-to-edge through the whole page on every viewport — a centered
 * max-width canvas next to full-bleed chrome is a visible misalignment on wide
 * screens.
 */
const PublicContainer: React.FC<PublicContainerProps> = ({ children, className }) => (
  <div className={cn('w-full overflow-x-hidden px-3 md:px-4 lg:px-6', className)}>
    {children}
  </div>
);

export default PublicContainer;
