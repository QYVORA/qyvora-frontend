import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { IconArrowRight, IconLabs } from '@/shared/components/icons';
import SimpleHeading from '../../../../shared/components/ui/SimpleHeading';
import quiteRootLogo from '@/assets/quiteRoot/ChatGPT Image Jul 3, 2026, 02_45_59 AM.png';
import { useTranslation } from 'react-i18next';

const LandingQuiteRootSection: React.FC = () => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative w-full md:h-screen md:overflow-hidden flex items-center justify-center py-20 sm:py-24 lg:py-20">
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 flex flex-col justify-center">

        {/* Mobile layout: stacked — logo on top, content below */}
        <div className="flex flex-col lg:hidden w-full gap-12">

          <motion.div
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.88 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center w-full px-4"
          >
            <div className="relative w-full max-w-[420px] sm:max-w-[540px]">
              <img
                src={quiteRootLogo}
                alt="QuiteRoot"
                className="relative z-10 w-full h-auto block"
              />
            </div>
          </motion.div>

          <div className="flex flex-col items-start w-full gap-7">
            <SimpleHeading
              text="Quite Root"
              align="left"
              accentWords={1}
              accentPlacement="end"
              className="mb-0"
            />

            <motion.p
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-xl"
            >
              {t('landing.quiteroot.description')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto"
            >
              <Link
                to="/quiteroot"
                className="btn-primary !border-accent/30 !px-8 sm:!px-10 !py-3 sm:!py-4 inline-flex items-center justify-center gap-2.5"
              >
                 {t('landing.quiteroot.explore')} <IconArrowRight size={20} />
              </Link>
              <Link
                to="/blogs?tag=QuiteRoot"
                className="btn-secondary !px-8 sm:!px-10 !py-3 sm:!py-4 inline-flex items-center justify-center gap-2.5"
              >
                 <IconLabs size={20} /> {t('landing.quiteroot.research')}
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Desktop layout: side-by-side grid */}
        <div className="hidden lg:grid grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 items-center">

          <div className="max-w-2xl">
            <SimpleHeading
              text="Quite Root"
              align="left"
              accentWords={1}
              accentPlacement="end"
              className="mb-6"
            />

            <motion.p
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-base md:text-lg text-text-secondary leading-relaxed mb-10 max-w-xl"
            >
              {t('landing.quiteroot.description')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
            >
              <Link
                to="/quiteroot"
                className="btn-primary !border-accent/30 !px-8 !py-4 inline-flex items-center justify-center gap-2.5"
              >
                 {t('landing.quiteroot.explore')} <IconArrowRight size={20} />
              </Link>
              <Link
                to="/blogs?tag=QuiteRoot"
                className="btn-secondary !px-8 !py-4 inline-flex items-center justify-center gap-2.5"
              >
                 <IconLabs size={20} /> {t('landing.quiteroot.research')}
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-end lg:-translate-x-4 xl:-translate-x-8"
          >
            <div className="relative w-full max-w-4xl xl:max-w-5xl flex items-center justify-end">
              <img
                src={quiteRootLogo}
                alt="QuiteRoot"
                className="relative z-10 w-full max-w-[850px] xl:max-w-[1100px] h-auto block"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default React.memo(LandingQuiteRootSection);
