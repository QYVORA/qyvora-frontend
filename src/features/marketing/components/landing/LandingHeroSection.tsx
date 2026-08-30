import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { IconDashboard, IconArrowRight } from '@/shared/components/icons';
import { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import type { BackendStats } from './types';
import { useAdaptiveUi } from '../../../../core/hooks/useAdaptiveUi';
import { useFluidGlobe } from '../hacker-globe/useFluidGlobe';
import ErrorBoundary from '../../../../shared/components/ErrorBoundary';
import { GridBoxedBackground } from '@/shared/components/backgrounds';
import { SOCIAL_LINKS } from '@/shared/components/layout/Footer';

const HackerGlobe = lazy(() => import('@/features/marketing/components/HackerGlobe'));

interface LandingHeroSectionProps {
  heroRef: React.RefObject<HTMLDivElement | null>;
  user: { isAdmin?: boolean } | null;
  stats: BackendStats | null;
  totalCp: number;
}

const LandingHeroSection: React.FC<LandingHeroSectionProps> = ({
  heroRef,
  user,
  stats,
  totalCp,
}) => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const { constrainedDevice, isMobile } = useAdaptiveUi();
  const minimizeEffects = shouldReduceMotion || constrainedDevice || isMobile;
  const disableTypewriter = shouldReduceMotion;

  const { scale: rawGlobeScale, offset: globeOffset } = useFluidGlobe();

  const line1Ref = React.useRef<HTMLSpanElement>(null);
  const line2DisplayRef = React.useRef<HTMLSpanElement>(null);
  const line2PlaceholderRef = React.useRef<HTMLSpanElement>(null);

  const steps = React.useMemo(() => [
    { line1: t('typewriter.trainLikeA'), line2: t('typewriter.hacker') },
    { line1: t('typewriter.trainLikeAHacker'), line2: t('typewriter.becomeAHacker') },
    { line1: t('typewriter.securingAfricas'), line2: t('typewriter.digitalFuture') },
    { line1: t('typewriter.creating100k'), line2: t('typewriter.cyberProfessionals') }
  ], [t]);

  React.useEffect(() => {
    const l1 = line1Ref.current;
    const l2d = line2DisplayRef.current;
    const l2p = line2PlaceholderRef.current;
    if (!l1 || !l2d || !l2p) return;

    // Only disable typewriter for reduced-motion preference (not mobile)
    if (disableTypewriter) {
      l1.textContent = steps[0].line1;
      l2d.textContent = steps[0].line2;
      l2p.textContent = steps[0].line2;
      return;
    }

    let stepIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let alive = true;

    l1.textContent = steps[0].line1;
    l2p.textContent = steps[0].line2;

    function tick() {
      if (!alive) return;
      const fullText = steps[stepIdx].line2;

      if (!deleting) {
        charIdx++;
        l2d.textContent = fullText.substring(0, charIdx);

        if (charIdx === fullText.length) {
          const pause = stepIdx === steps.length - 1 ? 4000 : 2000;
          setTimeout(() => { deleting = true; tick(); }, pause);
          return;
        }
        setTimeout(tick, 80 + Math.random() * 40);
      } else {
        charIdx--;
        l2d.textContent = fullText.substring(0, charIdx);

        if (charIdx === 0) {
          deleting = false;
          stepIdx = (stepIdx + 1) % steps.length;
          l1.textContent = steps[stepIdx].line1;
          l2p.textContent = steps[stepIdx].line2;
          setTimeout(tick, 400);
          return;
        }
        setTimeout(tick, 30);
      }
    }

    const id = setTimeout(tick, 600);
    return () => { alive = false; clearTimeout(id); };
  }, [disableTypewriter, steps]);

  return (
    <div ref={heroRef} className="relative w-full h-full min-h-dvh overflow-hidden flex flex-col bg-bg" >

      {/* ── Animated grid background — fades in from globe side ── */}
      <GridBoxedBackground reduced={shouldReduceMotion || constrainedDevice} blur={0} mask="right" />

      {/* ── Globe - positioned absolutely behind text, expands + fades on scroll ── */}
      <div className="absolute inset-0 z-[1] flex items-end justify-end overflow-hidden">
        <div className="relative w-full h-full flex items-end justify-end">
          <ErrorBoundary scope="HackerGlobe" fallback={null}>
            <Suspense fallback={null}>
              <HackerGlobe scale={rawGlobeScale} offset={globeOffset} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>

      {/* ── Main content grid ── */}
      <div
        className="
          relative z-10 w-full flex-1 mx-auto
          grid grid-cols-1 lg:grid-cols-2
          text-left
          lg:items-center
          h-full
        "
      >

        {/* ── Left column - Hero Text Area ── */}
        <div className="
          flex flex-col items-start lg:justify-center
          px-3 md:px-4 lg:px-6
          pt-24 md:pt-28 lg:pt-32
          pb-14 sm:pb-16 lg:pb-16
          space-y-0
          w-full
          h-full
        ">

          {/* Top content block */}
          <div className="flex flex-col items-start w-full space-y-8 sm:space-y-10">
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={minimizeEffects ? { duration: 0.2 } : { duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 border border-border/50 bg-bg-elevated/50 dark:backdrop-blur-sm backdrop-blur-none rounded-lg max-w-full shadow-[0_0_15px] shadow-black/5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse flex-none" />
              <span className="font-mono text-[9px] min-[380px]:text-[10px] sm:text-[11px] font-black uppercase tracking-[0.12em] min-[380px]:tracking-[0.14em] sm:tracking-[0.3em] text-text-muted whitespace-normal">
                {t('hero.tagline')}
              </span>
            </motion.div>

            {/* ── Headline ── */}
            <h1 className="font-black text-text-primary leading-[1.08] tracking-tight w-full relative">
              {/* Hidden placeholder — sets fixed height for tallest text so nothing shifts */}
              <span className="invisible pointer-events-none select-none" aria-hidden="true">
                <span className="block whitespace-normal lg:whitespace-nowrap text-[2rem] min-[400px]:text-[2.25rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[2.5rem] xl:text-[3rem] lg:leading-[1.1] xl:leading-[1.05]">
                  {t('typewriter.trainLikeAHacker')}
                </span>
                <span className="block whitespace-normal lg:whitespace-nowrap text-[2rem] min-[400px]:text-[2.25rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[2.5rem] xl:text-[3rem] lg:leading-[1.1] xl:leading-[1.05]">
                  {t('typewriter.cyberProfessionals')}
                </span>
              </span>
              {/* Visible animated text — absolute overlay */}
              <span className="absolute inset-0">
                <span ref={line1Ref} className="block whitespace-normal lg:whitespace-nowrap text-[2rem] min-[400px]:text-[2.25rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[2.5rem] xl:text-[3rem] lg:leading-[1.1] xl:leading-[1.05]">
                  {steps[0].line1}
                </span>
                <span className="relative block whitespace-normal lg:whitespace-nowrap text-[2rem] min-[400px]:text-[2.25rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[2.5rem] xl:text-[3rem] lg:leading-[1.1] xl:leading-[1.05]">
                  <span ref={line2PlaceholderRef} className="invisible" aria-hidden="true">{steps[0].line2}</span>
                  <span className="absolute left-0 top-0 text-accent">
                    <span ref={line2DisplayRef}></span>
                    <span className="ml-1 font-extralight select-none animate-pulse">|</span>
                  </span>
                </span>
              </span>
            </h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={minimizeEffects ? { duration: 0.2 } : { duration: 0.35, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-text-secondary text-base sm:text-lg lg:text-base xl:text-lg leading-relaxed max-w-xl animate-fade-in"
            >
              {t('hero.description')}
            </motion.p>
          </div>

          {/* Social buttons */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={minimizeEffects ? { duration: 0.2 } : { duration: 0.35, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 sm:mt-10 lg:mt-9 flex items-center gap-2.5 sm:gap-3"
          >
            {SOCIAL_LINKS.map(({ key, label, href, Icon }) => (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-xl border border-border/50 bg-bg-elevated/50 text-text-muted transition-[border-color,color,transform] duration-[var(--dur-fast)] ease-[var(--ease-smooth)] hover:border-accent/40 hover:text-accent active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={minimizeEffects ? { duration: 0.2 } : { duration: 0.35, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row w-full sm:w-auto items-stretch sm:items-center gap-4 mt-6 sm:mt-8 lg:mt-7"
          >
            {user ? (
              <Link to="/dashboard" className="btn-primary flex items-center justify-center gap-2.5 !px-8 sm:!px-10 !py-3 sm:!py-4">
                <IconDashboard size={20} /> {t('button.goToDashboard')}
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary flex items-center justify-center gap-2.5 !px-8 sm:!px-10 !py-3 sm:!py-4 whitespace-nowrap">
                   {t('button.startTraining')} <IconArrowRight size={20} />
                </Link>
                <Link to="/login" className="btn-secondary !px-8 sm:!px-10 !py-3 sm:!py-4 text-center whitespace-nowrap">
                  {t('button.logIn')}
                </Link>
              </>
            )}
          </motion.div>
        </div>

        {/* ── Right column: empty ── */}
        <div className="hidden lg:block" />

      </div>

    </div>
  );
};

export default React.memo(LandingHeroSection);
