import React, { lazy, Suspense } from 'react';
import { motion } from 'motion/react';
import ErrorBoundary from '@/shared/components/ErrorBoundary';
import { useAdaptiveUi } from '@/core/hooks/useAdaptiveUi';
import { termsData } from './termsData';

const HackerGlobe = lazy(() => import('@/features/marketing/components/HackerGlobe'));

const TermsHeroSection: React.FC = () => {
  const { isLg } = useAdaptiveUi();

  return (
    <div className="relative w-full min-h-[85svh] md:min-h-screen flex flex-col">
      <div className="relative z-30 w-full flex-1 mx-auto grid grid-cols-1 lg:grid-cols-2 text-left items-center md:h-full">
        <div className="flex flex-col items-start justify-center px-6 sm:px-10 md:px-12 lg:pl-16 xl:pl-20 lg:pr-8 xl:pr-12 pt-16 sm:pt-20 lg:pt-24 pb-14 sm:pb-16 lg:pb-16 w-full h-full">
          <div className="flex flex-col items-start w-full space-y-6">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[0.9]">
              TERMS <span className="text-accent">OF SERVICE</span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-text-secondary font-mono leading-relaxed max-w-xl">
              By accessing or using QYVORA services you agree to these terms. Read them carefully
              before participating in any training, community, or professional engagement.
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-6 text-[11px] font-mono text-text-muted uppercase tracking-[0.2em]"
            >
              {termsData.effectiveDate && (
                <div className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-accent" />
                  <span>Effective: {termsData.effectiveDate}</span>
                </div>
              )}
              {termsData.lastUpdated && (
                <div className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-accent" />
                  <span>Updated: {termsData.lastUpdated}</span>
                </div>
              )}
            </motion.div>
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

export default TermsHeroSection;
export { TermsHeroSection };
