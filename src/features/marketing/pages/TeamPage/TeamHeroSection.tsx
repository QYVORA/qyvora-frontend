import React, { lazy, Suspense } from 'react';
import ErrorBoundary from '@/shared/components/ErrorBoundary';
import { GridBoxedBackground } from '@/shared/components/backgrounds';

const HackerGlobe = lazy(() => import('@/features/marketing/components/HackerGlobe'));

const TeamHeroSection: React.FC = () => {
  return (
    <div className="relative w-full min-h-[85svh] md:min-h-screen flex flex-col overflow-hidden bg-accent" data-nav-invert>

      {/* ── Grid background ── */}
      <GridBoxedBackground opacity={0.5} blur={0} mask="right" />

      {/* ── Globe ── */}
      <div className="absolute inset-0 z-0 flex items-end justify-end">
        <div className="relative w-full h-full flex items-end justify-end">
          <ErrorBoundary scope="HackerGlobe" fallback={null}>
            <Suspense fallback={null}>
              <HackerGlobe scale={1.0} offset={[0.9, -0.7, 0]} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>

      <div className="relative z-10 w-full flex-1 mx-auto grid grid-cols-1 lg:grid-cols-2 text-left items-center md:h-full">
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
        <div className="hidden lg:block" />
      </div>
    </div>
  );
};

export default TeamHeroSection;
export { TeamHeroSection };
