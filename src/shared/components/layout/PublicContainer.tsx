import React from 'react';
import { cn } from '@/shared/utils/cn';

interface PublicContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * PublicContainer — canonical content column for every public marketing page.
 *
 * Public pages previously stretched full-bleed while the landing page used a
 * centered 1320px canvas, so navigating from the landing into any inner page
 * made the content jump to the far left on wide screens. This matches the
 * landing canvas (`max-w-[1320px]`) and the standard public gutters so every
 * public page shares one measuring line.
 */
const PublicContainer: React.FC<PublicContainerProps> = ({ children, className }) => (
  <div className={cn('mx-auto w-full max-w-[1320px] px-3 md:px-4 lg:px-6', className)}>
    {children}
  </div>
);

export default PublicContainer;
