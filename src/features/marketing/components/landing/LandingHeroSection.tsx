import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { IconDashboard, IconArrowRight } from '@/shared/components/icons';
import { lazy, Suspense } from 'react';
import { SITE_CONFIG } from '../../content/siteConfig';
import type { BackendStats } from './types';
import { useAdaptiveUi } from '../../../../core/hooks/useAdaptiveUi';
import ErrorBoundary from '../../../../shared/components/ErrorBoundary';

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
  const shouldReduceMotion = useReducedMotion();
  const { constrainedDevice, isMobile, isLg } = useAdaptiveUi();
  const minimizeEffects = shouldReduceMotion || constrainedDevice || isMobile;

  const [stepIndex, setStepIndex] = React.useState(0);
  const [displayText, setDisplayText] = React.useState('');
  const [isDeleting, setIsDeleting] = React.useState(false);

  const steps = React.useMemo(() => [
    { line1: "Train Like a", line2: "Hacker." },
    { line1: "Train Like a Hacker.", line2: "Become a Hacker." },
    { line1: "Securing Africa's", line2: "Digital Future." },
    { line1: "Creating 100,000", line2: "Cyber Professionals." }
  ], []);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentStep = steps[stepIndex];
    const fullText = currentStep.line2;

    const tick = () => {
      if (!isDeleting) {
        const nextText = fullText.substring(0, displayText.length + 1);
        setDisplayText(nextText);

        if (nextText === fullText) {
          const pauseTime = stepIndex === steps.length - 1 ? 4000 : 2000;
          timer = setTimeout(() => {
            setIsDeleting(true);
          }, pauseTime);
        } else {
          const typingSpeed = 80 + Math.random() * 40;
          timer = setTimeout(tick, typingSpeed);
        }
      } else {
        const nextText = fullText.substring(0, displayText.length - 1);
        setDisplayText(nextText);

        if (nextText === '') {
          setIsDeleting(false);
          setStepIndex((prev) => (prev + 1) % steps.length);
        } else {
          timer = setTimeout(tick, 30);
        }
      }
    };

    timer = setTimeout(tick, isDeleting ? 30 : 80);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, stepIndex, steps]);

  return (
    <div ref={heroRef} className="relative w-full min-h-dvh md:min-h-screen flex flex-col bg-accent" data-nav-invert>
      
      {/* ── Main content grid ── */}
      <div
        className="
          relative z-30 w-full flex-1 mx-auto 
          grid grid-cols-1 lg:grid-cols-2
          text-left
          items-center
          md:h-full
        "
      >

        {/* ── Left column - Hero Text Area ── */}
        <div className="
          flex flex-col items-start justify-center
          px-4 sm:px-10 md:px-12 lg:pl-16 xl:pl-20 lg:pr-8 xl:pr-12
          pt-20 sm:pt-20 lg:pt-24
          pb-14 sm:pb-16 lg:pb-16
          space-y-0
          w-full
          h-full
        ">

          {/* Top content block */}
          <div className="flex flex-col items-start w-full space-y-5 sm:space-y-6">
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={minimizeEffects ? { duration: 0.2 } : { duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 border border-bg/20 bg-bg/10 dark:backdrop-blur-sm backdrop-blur-none rounded-lg max-w-full shadow-[0_0_15px_rgba(0,0,0,0.05)]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-bg animate-pulse flex-none" />
              <span className="font-mono text-[9px] min-[380px]:text-[10px] sm:text-[11px] font-black uppercase tracking-[0.12em] min-[380px]:tracking-[0.14em] sm:tracking-[0.3em] text-bg whitespace-normal">
                Africa's Offensive Security Platform
              </span>
            </motion.div>

            {/* ── Headline ── */}
            <h1 className="font-black text-bg leading-[1.08] tracking-tight w-full relative">
              {/* Hidden placeholder — sets fixed height for tallest text so nothing shifts */}
              <span className="invisible pointer-events-none select-none" aria-hidden="true">
                <span className="block whitespace-normal lg:whitespace-nowrap text-[2.5rem] min-[400px]:text-[3rem] sm:text-[3.25rem] md:text-[3.75rem] lg:text-[3.25rem] xl:text-[3.75rem] lg:leading-[1.1] xl:leading-[1.05]">
                  Train Like a Hacker.
                </span>
                <span className="block whitespace-normal lg:whitespace-nowrap text-[2.5rem] min-[400px]:text-[3rem] sm:text-[3.25rem] md:text-[3.75rem] lg:text-[3.25rem] xl:text-[3.75rem] lg:leading-[1.1] xl:leading-[1.05]">
                  Cyber Professionals.
                </span>
              </span>
              {/* Visible animated text — absolute overlay */}
              <span className="absolute inset-0">
                <span className="block whitespace-normal lg:whitespace-nowrap text-[2.5rem] min-[400px]:text-[3rem] sm:text-[3.25rem] md:text-[3.75rem] lg:text-[3.25rem] xl:text-[3.75rem] lg:leading-[1.1] xl:leading-[1.05]">
                  {steps[stepIndex].line1}
                </span>
                <span className="relative block whitespace-normal lg:whitespace-nowrap text-[2.5rem] min-[400px]:text-[3rem] sm:text-[3.25rem] md:text-[3.75rem] lg:text-[3.25rem] xl:text-[3.75rem] lg:leading-[1.1] xl:leading-[1.05]">
                  <span className="invisible" aria-hidden="true">{steps[stepIndex].line2}</span>
                  <span className="absolute left-0 top-0 text-bg">
                    {displayText}
                    <span className="text-bg ml-1 font-extralight select-none animate-pulse">|</span>
                  </span>
                </span>
              </span>
            </h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={minimizeEffects ? { duration: 0.2 } : { duration: 0.5, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-bg/70 text-base sm:text-lg lg:text-base xl:text-lg leading-relaxed max-w-xl animate-fade-in"
            >
              {SITE_CONFIG.brand.description}
            </motion.p>
          </div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={minimizeEffects ? { duration: 0.2 } : { duration: 0.5, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row w-full sm:w-auto items-stretch sm:items-center gap-4 mt-6 sm:mt-8 lg:mt-9"
          >
            {user ? (
              <Link to="/dashboard" className="btn-primary flex items-center justify-center gap-2.5 !px-8 sm:!px-10 !py-3 sm:!py-4">
                <IconDashboard size={20} /> Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary flex items-center justify-center gap-2.5 !px-8 sm:!px-10 !py-3 sm:!py-4 whitespace-nowrap">
                   Start Training <IconArrowRight size={20} />
                </Link>
                <Link to="/login" className="btn-secondary !px-8 sm:!px-10 !py-3 sm:!py-4 text-center whitespace-nowrap">
                  Log In
                </Link>
              </>
            )}
          </motion.div>
        </div>

        {/* ── Right column: Globe - Desktop only ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="
            relative hidden lg:flex items-center justify-center
            w-full h-full
            pt-20 xl:pt-24
          "
        >
          {/* Globe container - responsive to prevent clipping */}
          <div className="relative z-10 w-full h-full max-w-[80%] 2xl:max-w-[75%] flex items-center justify-center">
            <ErrorBoundary scope="HackerGlobe" fallback={null}>
              <Suspense fallback={null}>
                {isLg && <HackerGlobe scale={1.0} />}
              </Suspense>
            </ErrorBoundary>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default React.memo(LandingHeroSection);