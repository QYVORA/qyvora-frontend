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
    <div className="relative w-full min-h-dvh md:h-dvh bg-bg flex flex-col lg:flex-row overflow-hidden" data-nav-invert>
      <GridBoxedBackground opacity={0.4} blur={0} mask="right" />
      <div className="relative z-10 w-full h-full px-3 md:px-4 lg:px-6 flex flex-col lg:flex-row lg:items-stretch gap-8 lg:gap-16 pt-20 pb-12 lg:pt-0 lg:pb-0">

        {/* Content */}
        <div className="flex items-center">
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl"
          >
            <SimpleHeading
              text={user ? t('landing.finalCta.headingReturning') : t('landing.finalCta.headingNew')}
              align="left"
              variant="default"
              accentWords={1}
              accentPlacement="end"
              className="mb-4"
            />

            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
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
          </motion.div>
        </div>

        {/* Logo — full section height on desktop */}
        <motion.div
          initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:flex items-center justify-end shrink-0 lg:ml-6 xl:ml-10 lg:mr-2 xl:mr-4"
        >
          <div className="h-full py-12 flex items-center">
            <QyvoraMark
              aria-label="QYVORA Offensive Security Platform"
              className="h-full w-auto block"
              color="#06B66F"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default React.memo(LandingFinalCtaSection);
