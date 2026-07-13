import React, { lazy, Suspense } from 'react';
import ErrorBoundary from '@/shared/components/ErrorBoundary';
import { useAdaptiveUi } from '@/core/hooks/useAdaptiveUi';

const HackerGlobe = lazy(() => import('@/features/marketing/components/HackerGlobe'));

const TeamHeroSection: React.FC = () => {
  const { isLg } = useAdaptiveUi();

  return (
    <div className="relative w-full min-h-[85svh] md:min-h-screen flex flex-col bg-accent" data-nav-invert>
      <div className="relative z-30 w-full flex-1 mx-auto grid grid-cols-1 lg:grid-cols-2 text-left items-center md:h-full">
        <div className="flex flex-col items-start justify-center px-6 sm:px-10 md:px-12 lg:pl-16 xl:pl-20 lg:pr-8 xl:pr-12 pt-16 sm:pt-20 lg:pt-24 pb-14 sm:pb-16 lg:pb-16 w-full h-full">
          <div className="flex flex-col items-start w-full space-y-6">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[0.9] text-bg">
              THE <span className="text-bg/80">TEAM</span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-bg/70 font-mono leading-relaxed max-w-xl">
              Meet the core developers, security researchers, and operators building QYVORA&apos;s offensive security ecosystem.
            </p>
          </div>
        </div>
        <div className="relative hidden lg:flex items-center justify-center w-full h-full pt-20 xl:pt-24">
          <div className="relative z-10 w-full h-full max-w-[80%] 2xl:max-w-[75%] flex items-center justify-center">
            <ErrorBoundary scope="HackerGlobe" fallback={null}>
              <Suspense fallback={null}>
                {isLg && <HackerGlobe scale={1.0} />}
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamHeroSection;
export { TeamHeroSection };
