import React, { lazy, Suspense } from 'react';
import ErrorBoundary from '@/shared/components/ErrorBoundary';
import { GridBoxedBackground } from '@/shared/components/backgrounds';
import { useAdaptiveUi } from '@/core/hooks/useAdaptiveUi';

const HackerGlobe = lazy(() => import('@/features/marketing/components/HackerGlobe'));

interface PublicHeroSectionProps {
  children: React.ReactNode;
  rightContent?: React.ReactNode;
  mask?: 'right' | 'none';
  showGlobe?: boolean;
}

const PublicHeroSection: React.FC<PublicHeroSectionProps> = ({
  children,
  rightContent,
  mask = 'right',
  showGlobe = false,
}) => {
  const { isMobile } = useAdaptiveUi();
  const globeScale = isMobile ? 0.5 : 1.0;
  const globeOffset: [number, number, number] = isMobile ? [0.35, -0.2, 0] : [0.9, -0.7, 0];
  return (
    <div className="relative w-full min-h-dvh md:h-dvh overflow-hidden flex flex-col bg-bg" data-nav-invert>
      <GridBoxedBackground opacity={0.5} blur={0} mask={mask} />

      {showGlobe && (
        <div className="absolute inset-0 z-0 flex items-end justify-end overflow-hidden">
          <div className="relative w-full h-full flex items-end justify-end">
            <ErrorBoundary scope="HackerGlobe" fallback={null}>
              <Suspense fallback={null}>
                <HackerGlobe scale={globeScale} offset={globeOffset} />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
      )}

      <div className="relative z-10 w-full flex-1 mx-auto grid grid-cols-1 lg:grid-cols-2 text-left items-center h-full">
        <div className="flex flex-col items-start justify-center px-3 md:px-4 lg:px-6 pt-20 sm:pt-20 lg:pt-24 pb-20 sm:pb-16 lg:pb-16 space-y-0 w-full h-full">
          <div className="flex flex-col items-start w-full space-y-5 sm:space-y-6">
            {children}
          </div>
        </div>
        {rightContent ?? <div className="hidden lg:block" />}
      </div>
    </div>
  );
};

export default React.memo(PublicHeroSection);
