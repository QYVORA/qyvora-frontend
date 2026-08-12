import React, { lazy, Suspense, useEffect, useRef } from 'react';
import ErrorBoundary from '@/shared/components/ErrorBoundary';
import { GridBoxedBackground } from '@/shared/components/backgrounds';

const HackerGlobe = lazy(() => import('@/features/marketing/components/HackerGlobe'));

interface StudentHeroStat {
  label: string;
  value: string | number;
  accent?: boolean;
}

interface StudentHeroSectionProps {
  title: string;
  accentWord?: string;
  description: string;
  stats?: StudentHeroStat[];
  children?: React.ReactNode;
  rightContent?: React.ReactNode;
  titleClassName?: string;
  showGlobe?: boolean;
  typewrite?: boolean;
  villain?: {
    name: string;
    alias: string;
    description: string;
  };
}

/**
 * Canonical marketing/public-page hero heading scale.
 * Flows horizontally with natural wrapping — never one word per line.
 */
export const PUBLIC_HERO_TITLE_CLASS =
  'text-[2rem] min-[400px]:text-[2.25rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[2.5rem] xl:text-[3rem] lg:leading-[1.08]';

export function StudentHeroSection({
  title,
  accentWord,
  description,
  stats,
  children,
  rightContent,
  titleClassName,
  showGlobe = false,
  typewrite = false,
}: StudentHeroSectionProps) {
  const accentRef = useRef<HTMLSpanElement>(null);

  // Typewriter reveal for the accent word — mirrors the landing hero's
  // typing animation so public heroes share the same UI language.
  useEffect(() => {
    if (!typewrite || !accentWord) return;
    const el = accentRef.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = accentWord;
      return;
    }

    let i = 0;
    el.textContent = '';
    const id = window.setInterval(() => {
      i++;
      el.textContent = accentWord.slice(0, i);
      if (i >= accentWord.length) window.clearInterval(id);
    }, 90);
    return () => window.clearInterval(id);
  }, [typewrite, accentWord]);

  return (
    <div className="relative min-h-dvh flex flex-col justify-center overflow-hidden">
      <GridBoxedBackground blur={0} mask="right" />

      {showGlobe && (
        <div className="absolute inset-0 z-0 flex items-end justify-end overflow-hidden">
          <div className="relative w-full h-full flex items-end justify-end">
            <ErrorBoundary scope="HackerGlobe" fallback={null}>
              <Suspense fallback={null}>
                <HackerGlobe fluid />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
      )}

      <div className="relative z-10 w-full flex-1 mx-auto grid grid-cols-1 lg:grid-cols-2 text-left items-center h-full">
        <div className="flex flex-col items-start justify-center px-3 md:px-4 lg:px-6 py-16 md:py-24">
          <div className="w-full space-y-10 lg:space-y-12">
            <h1 className={`${titleClassName ?? 'text-4xl md:text-6xl'} font-black text-text-primary tracking-tight leading-[1.05]`}>
              {title}{' '}
              {accentWord && (
                <span className="text-accent">
                  <span ref={accentRef}>{accentWord}</span>
                  {typewrite && (
                    <span className="ml-1 font-extralight select-none animate-pulse">|</span>
                  )}
                </span>
              )}
            </h1>

            <p className="text-text-secondary text-base sm:text-lg lg:text-base xl:text-lg leading-relaxed max-w-xl animate-fade-in font-mono">
              {description}
            </p>

            {stats && stats.length > 0 && (
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                {stats.map((stat, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className={`font-mono text-2xl sm:text-3xl font-black ${stat.accent ? 'text-accent' : 'text-text-primary'}`}>
                      {stat.value}
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {children}
          </div>
        </div>
        {rightContent ?? <div className="hidden lg:block" />}
      </div>
    </div>
  );
}

export default StudentHeroSection;
