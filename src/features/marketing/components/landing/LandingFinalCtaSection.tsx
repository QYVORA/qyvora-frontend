import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { IconDashboard, IconArrowRight } from '@/shared/components/icons';
import SimpleHeading from '../../../../shared/components/ui/SimpleHeading';
import { QyvoraMark } from '../../../../shared/components/brand/QyvoraMark';
import { GridBoxedBackground } from '@/shared/components/backgrounds';
import { useTranslation } from 'react-i18next';

interface LandingFinalCtaSectionProps {
  user: { isAdmin?: boolean } | null;
}

const LandingFinalCtaSection: React.FC<LandingFinalCtaSectionProps> = ({ user }) => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative w-full min-h-dvh md:h-dvh bg-accent flex items-center overflow-hidden" data-nav-invert>
      <GridBoxedBackground opacity={0.4} blur={0} mask="none" />
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-3 sm:px-8 lg:px-12 xl:px-16 flex flex-col justify-center pb-12 lg:pb-0">

        {/* Mobile layout */}
        <div className="flex flex-col lg:hidden w-full gap-8">
          <motion.div
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.88 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center w-full"
          >
            <div className="relative w-full max-w-[420px] sm:max-w-[540px]">
              <QyvoraMark
                aria-label="QYVORA Logo - Africa's Offensive Security Platform"
                className="relative z-10 w-full h-auto block"
                color="#000000"
              />
            </div>
          </motion.div>

          <div className="flex flex-col items-start w-full gap-5">
            <SimpleHeading
              text={user ? t('landing.finalCta.headingReturning') : t('landing.finalCta.headingNew')}
              align="left"
              variant="inverted"
              className="mb-0"
            />

            <motion.p
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg text-bg/60 leading-relaxed max-w-xl"
            >
              {t('landing.finalCta.description')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto"
            >
              {user ? (
                <Link
                  to="/dashboard"
                  className="btn-primary !px-8 sm:!px-10 !py-3 sm:!py-4 inline-flex items-center justify-center gap-2.5"
                >
                   <IconDashboard size={20} /> {t('landing.finalCta.goToDashboard')}
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="btn-primary !px-8 sm:!px-10 !py-3 sm:!py-4 inline-flex items-center justify-center gap-2.5"
                  >
                     {t('landing.finalCta.startTraining')} <IconArrowRight size={20} />
                  </Link>
                  <Link
                    to="/login"
                    className="btn-secondary !px-8 sm:!px-10 !py-3 sm:!py-4 inline-flex items-center justify-center"
                  >
                     {t('landing.finalCta.logIn')}
                  </Link>
                </>
              )}
            </motion.div>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden lg:grid grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 items-center">
          <div className="max-w-2xl">
            <SimpleHeading
              text={user ? t('landing.finalCta.headingReturning') : t('landing.finalCta.headingNew')}
              align="left"
              variant="inverted"
              className="mb-6"
            />

            <motion.p
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-base md:text-lg text-bg/60 leading-relaxed mb-10 max-w-xl"
            >
              {t('landing.finalCta.description')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
            >
              {user ? (
                <Link
                  to="/dashboard"
                  className="btn-primary !px-8 !py-4 inline-flex items-center justify-center gap-2.5"
                >
                   <IconDashboard size={20} /> {t('landing.finalCta.goToDashboard')}
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="btn-primary !px-8 !py-4 inline-flex items-center justify-center gap-2.5"
                  >
                     {t('landing.finalCta.startTraining')} <IconArrowRight size={20} />
                  </Link>
                  <Link
                    to="/login"
                    className="btn-secondary !px-8 !py-4 inline-flex items-center justify-center"
                  >
                     {t('landing.finalCta.logIn')}
                  </Link>
                </>
              )}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-end"
          >
            <div className="relative w-full max-w-4xl xl:max-w-5xl flex items-center justify-end">
              <QyvoraMark
                aria-label="QYVORA Offensive Security Platform"
                className="relative z-10 w-full max-w-[850px] xl:max-w-[1100px] h-auto block"
                color="#000000"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(LandingFinalCtaSection);
