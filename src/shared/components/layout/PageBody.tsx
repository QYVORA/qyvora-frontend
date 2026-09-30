import React from 'react';
import { cn } from '@/shared/utils/cn';

interface PageBodyProps {
  children: React.ReactNode;
  /** Vertical rhythm between page sections. Defaults to the standard page stack. */
  spacing?: 'none' | 'sections';
  className?: string;
}

/**
 * PageBody — the canonical content column for every signed-in (dashboard) page.
 *
 * The student dashboard, admin dashboard, learning pages and profile all sit in a
 * fixed rail + topbar shell, so they share one measuring line: full-bleed
 * gutters, no max-width cap, and the same top/bottom clearance. Previously each
 * page hand-rolled this class string and they drifted apart (SettingsPage lost
 * its `lg:pb-24`, MarketplacePage lost its top padding entirely), which made the
 * page rhythm feel inconsistent while navigating between screens.
 */
const PageBody: React.FC<PageBodyProps> = ({ children, spacing = 'none', className }) => (
  <div
    className={cn(
      'w-full px-3 pb-16 pt-6 md:px-4 md:pb-20 md:pt-8 lg:px-6 lg:pb-24',
      spacing === 'sections' && 'space-y-8',
      className,
    )}
  >
    {children}
  </div>
);

export default PageBody;
