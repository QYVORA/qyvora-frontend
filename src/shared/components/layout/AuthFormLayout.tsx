import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IconArrowLeft } from '@/shared/components/icons';
import { GridBoxedBackground } from '@/shared/components/backgrounds';
import ErrorBoundary from '@/shared/components/ErrorBoundary';
import AuthHero from '@/features/auth/components/AuthHero';

const HackerGlobe = lazy(() => import('@/features/marketing/components/HackerGlobe'));

interface AuthFormLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const AuthFormLayout: React.FC<AuthFormLayoutProps> = ({ children }) => {
  const { t } = useTranslation();
  return (
    <div className="relative min-h-dvh">
      {/* Mobile background layer */}
      <div className="md:hidden fixed inset-0 bg-bg -z-10">
        <GridBoxedBackground blur={0} mask="right" />
      </div>

      {/* Desktop blank ground — full-page decorative backdrop behind hero + form.
          The form column and form cards stay translucent so this shows through. */}
      <div className="hidden md:block absolute inset-0 bg-bg overflow-hidden" aria-hidden="true">
        <GridBoxedBackground blur={0} mask="right" />
      </div>

      {/* Globe — belongs to the page, not the hero. Spans the whole viewport in
          the bottom-right corner so hero and form share one canvas and the
          globe is never clipped at the column boundary. Fixed so it stays pinned
          to the bottom-right corner on mobile while the form scrolls; scroll-exit
          animation is disabled because the globe is a persistent page backdrop
          here, not a hero. */}
      <div className="fixed inset-0 z-0 flex items-end justify-end overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="relative w-full h-full flex items-end justify-end">
          <ErrorBoundary scope="HackerGlobe" fallback={null}>
            <Suspense fallback={null}>
              <HackerGlobe fluid scrollExit={false} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>

      <div className="min-h-dvh relative md:grid md:grid-cols-2">
        <AuthHero />

        {/* Mobile: hero + form stacked — translucent so the backdrop shows through */}
        <div className="md:hidden relative w-full min-h-dvh flex flex-col" data-nav-invert>
          <div className="absolute top-6 left-6 z-20">
            <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 text-text-primary rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:opacity-70 active:scale-95">
              <IconArrowLeft size={16} /> {t('button.backToHome')}
            </Link>
          </div>

          <div className="relative z-10 w-full flex-1 flex flex-col items-start justify-start px-3 pt-20 sm:pt-20 pb-12 sm:pb-14">
            <div className="w-full">
              {children}
            </div>
          </div>
        </div>

        {/* Desktop: form column — natural height (no forced scroll), translucent */}
        <div className="hidden md:flex flex-col items-center px-3 md:px-4 lg:px-6 py-12 md:py-16 relative min-h-dvh">
          <div className="w-full max-w-lg relative z-10 my-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthFormLayout;
