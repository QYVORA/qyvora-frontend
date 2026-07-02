import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import ErrorBoundary from '@/shared/components/ErrorBoundary';
import { useAdaptiveUi } from '@/core/hooks/useAdaptiveUi';

const HackerGlobe = lazy(() => import('@/features/marketing/components/HackerGlobe'));

const LearnHeroSection: React.FC = () => {
  const { isLg, isMobile } = useAdaptiveUi();

  return (
    <div className="relative w-full min-h-[85svh] md:min-h-screen flex flex-col">
      <div className="relative z-30 w-full flex-1 mx-auto grid grid-cols-1 lg:grid-cols-2 text-left items-center md:h-full">
        <div className="flex flex-col items-start justify-center px-6 sm:px-10 md:px-12 lg:pl-16 xl:pl-20 lg:pr-8 xl:pr-12 pt-20 sm:pt-28 lg:pt-24 pb-10 sm:pb-12 lg:pb-16 w-full h-full">
          <div className="flex flex-col items-start w-full space-y-6">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[0.9]">
              Hacker Protocol <br />
              <span className="text-accent">Bootcamp</span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-text-secondary font-mono leading-relaxed max-w-xl">
              Master offensive security through hands-on challenges.
              The HPB curriculum transforms you into a specialized operator.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <Link
                to="/register"
                className="btn-primary px-8 py-4 font-black uppercase tracking-[0.15em] text-xs flex items-center justify-center gap-3"
              >
                <Play className="w-4 h-4 fill-current" /> Start Training
              </Link>
              <a
                href="#phases"
                className="px-8 py-4 border border-border bg-bg-card/30 hover:border-accent/40 rounded-xl text-xs font-black uppercase tracking-[0.15em] hover:text-accent transition-all text-center"
                onClick={(e) => {
                  if (!isMobile) {
                    e.preventDefault();
                    const el = document.getElementById('phases');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                }}
              >
                Explore Phases
              </a>
            </div>
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

export default LearnHeroSection;
export { LearnHeroSection };
