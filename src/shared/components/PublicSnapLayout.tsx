import React from 'react';
import { cn } from '@/shared/utils/cn';

interface PublicSnapLayoutProps {
  children: React.ReactNode;
  /**
   * Enable desktop scroll-snap (full-viewport sections) like the landing page.
   * HPB pages opt in; every other public inner page keeps natural flow.
   */
  snap?: boolean;
}

const PublicSnapLayout: React.FC<PublicSnapLayoutProps> = ({ children, snap = false }) => {
  return (
    <div className={cn('relative w-full bg-bg', snap && 'snap-container no-scrollbar')}>
      {children}
    </div>
  );
};

export default PublicSnapLayout;
