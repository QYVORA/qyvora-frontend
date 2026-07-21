import React from 'react';
import { cn } from '@/shared/utils/cn';

interface StickySidebarLayoutProps {
  sidebar?: React.ReactNode;
  children: React.ReactNode;
  heading?: React.ReactNode;
  className?: string;
}

const StickySidebarLayout: React.FC<StickySidebarLayoutProps> = ({ sidebar, children, heading, className }) => (
  <div className={cn('w-full flex flex-col md:flex-row md:items-start md:gap-12 lg:gap-16', className)}>
    <div className="md:w-[35%] lg:w-[38%] text-center md:text-left mb-8 md:mb-0 md:sticky md:top-32 shrink-0">
      {heading ?? sidebar}
    </div>
    <div className="md:w-[65%] lg:w-[62%] min-w-0">
      {heading ? (sidebar ?? children) : children}
    </div>
  </div>
);

export default StickySidebarLayout;
