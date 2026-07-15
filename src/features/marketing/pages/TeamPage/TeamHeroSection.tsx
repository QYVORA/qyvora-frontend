import React, { lazy, Suspense } from 'react';
import ErrorBoundary from '@/shared/components/ErrorBoundary';
import { GridBoxedBackground } from '@/shared/components/backgrounds';

const HackerGlobe = lazy(() => import('@/features/marketing/components/HackerGlobe'));

const TeamHeroSection: React.FC = () => {
  return (
    <div className="relative w-full min-h-[85svh] md:min-h-screen md:overflow-hidden flex flex-col bg-accent" data-nav-invert>

      {/* ── Grid background ── */}
      <GridBoxedBackground opacity={0.5} blur={0} mask="right" />

      {/* ── Globe ── */}
      <div className="absolute inset-0 z-0 hidden md:flex items-end justify-end overflow-hidden">
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
            <h1 className="font-black text-bg leading-[1.08] tracking-tight w-full">
              <span className="block text-[2rem] min-[400px]:text-[2.25rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[2.5rem] xl:text-[3rem] lg:leading-[1.1] xl:leading-[1.05] uppercase">
                THE <span className="text-bg/80">TEAM</span>
              </span>
            </h1>
            <p className="text-bg/70 text-sm sm:text-base lg:text-sm xl:text-base leading-relaxed max-w-xl animate-fade-in font-mono">
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
