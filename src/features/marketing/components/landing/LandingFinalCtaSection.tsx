import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { IconDashboard, IconArrowRight } from '@/shared/components/icons';
import { Logo } from '@/shared/components/brand';
import { GridBoxedBackground } from '@/shared/components/backgrounds';
import DottedMapOverlay from '@/shared/components/ui/DottedMapOverlay';
import { useTranslation } from 'react-i18next';

interface LandingFinalCtaSectionProps {
  user: { isAdmin?: boolean } | null;
}

const LandingFinalCtaSection: React.FC<LandingFinalCtaSectionProps> = ({ user }) => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  const headingText = user ? t('landing.finalCta.headingReturning') : t('landing.finalCta.headingNew');
  const words = headingText.split(' ');
  const accentWord = words.pop() || '';
  const primaryText = words.join(' ');

  return (
    <div className="relative w-full min-h-dvh bg-bg flex flex-col lg:flex-row overflow-hidden">
      <GridBoxedBackground blur={0} mask="right" />
      <div className="relative z-10 w-full flex-1 px-3 md:px-4 lg:px-6 flex flex-col lg:flex-row lg:items-stretch gap-10 lg:gap-12 pt-24 pb-12 md:pt-28 lg:pt-32 lg:pb-10">

        {/* Content — flex-1 fills the column so it centres vertically on mobile
            and keeps the left column balanced on desktop */}
        <div className="flex-1 flex items-center lg:pr-4 xl:pr-6">
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl"
          >
            <h2 className="font-black text-text-primary leading-[1.08] tracking-tight text-[2rem] min-[400px]:text-[2.25rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[2.5rem] xl:text-[3rem] lg:leading-[1.1] xl:leading-[1.05] mb-6">
              {primaryText} <span className="text-accent">{accentWord}</span>
            </h2>

            <motion.p
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-text-secondary text-base sm:text-lg leading-relaxed max-w-xl font-mono mb-10"
            >
              {t('landing.finalCta.description')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-stretch gap-4"
            >
              {user ? (
                <Link
                  to="/dashboard"
                  className="btn-primary !px-8 sm:!px-10 !py-4 inline-flex items-center justify-center gap-2.5 whitespace-nowrap flex-1 sm:flex-none"
                >
                  <IconDashboard size={18} /> {t('landing.finalCta.goToDashboard')}
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="btn-primary !px-8 sm:!px-10 !py-4 inline-flex items-center justify-center gap-2.5 whitespace-nowrap flex-1 sm:flex-none"
                  >
                    {t('landing.finalCta.startTraining')} <IconArrowRight size={18} />
                  </Link>
                  <Link
                    to="/login"
                    className="btn-secondary !px-8 sm:!px-10 !py-4 inline-flex items-center justify-center gap-2.5 whitespace-nowrap flex-1 sm:flex-none"
                  >
                    {t('landing.finalCta.logIn')}
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Logo — visible on all screens: centred below the content on mobile,
            right column on desktop. Composition: drifting dotted world map
            merging into the hero grid, two slow orbit rings with a satellite
            glint, a border-beam frame tracing the enclosure, and a light sweep
            travelling inside the mark's strokes. */}
        <motion.div
          initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex items-center justify-center lg:justify-end shrink-0 lg:ml-2 xl:ml-4 lg:mr-6 xl:mr-10 2xl:mr-12"
        >
          <motion.div
            animate={shouldReduceMotion ? undefined : { y: [0, -12, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="relative"
          >
            {/* Dotted world map — drifts slowly and fades out radially so it
                combines with the boxed grid behind the section */}
            {!shouldReduceMotion && (
              <div aria-hidden className="absolute -inset-8 sm:-inset-14 md:-inset-20 pointer-events-none">
                <DottedMapOverlay
                  opacity={0.22}
                  className="dotted-map-drift [mask-image:radial-gradient(circle_at_center,#000_28%,transparent_70%)]"
                />
              </div>
            )}

            {/* Orbit rings — satellite glint rides the outer ring */}
            {!shouldReduceMotion && (
              <>
                <div
                  aria-hidden
                  className="spin-slower absolute left-1/2 top-1/2 aspect-square w-[128%] max-w-none rounded-full border border-dashed border-accent/15"
                >
                  <span className="absolute -top-[3px] left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-accent" />
                </div>
                <div
                  aria-hidden
                  className="spin-slower-reverse absolute left-1/2 top-1/2 aspect-square w-[106%] max-w-none rounded-full border border-accent/25"
                />
              </>
            )}

            {/* Beam frame — accent pulse travelling the enclosure line */}
            <div className="border-beam relative rounded-[2rem] p-5 sm:p-7 md:p-9">
              <Logo
                variant="mark"
                size="3xl"
                color="#06B66F"
                animated={!shouldReduceMotion}
                className="!w-[300px] min-[420px]:!w-[420px] sm:!w-[500px] md:!w-[580px] lg:!w-[min(520px,42vw)] xl:!w-[min(640px,44vw)] 2xl:!w-[min(760px,42vw)]"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default React.memo(LandingFinalCtaSection);
