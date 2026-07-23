import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IconArrowRight } from '@/shared/components/icons';
import { GridBoxedBackground } from '@/shared/components/backgrounds';
import { motion } from 'motion/react';

interface DashboardHeroProps {
  isEnrolled: boolean;
  allDone: boolean;
  nextMission: { title: string } | null;
  continuePath: string;
  currentPhaseTitle?: string;
  username?: string;
}

const DashboardHero = ({
  isEnrolled, allDone, nextMission, continuePath, currentPhaseTitle, username,
}: DashboardHeroProps) => {
  const { t } = useTranslation();
  const displayName = username ? `@${username}` : t('student.dashboard.hero.operatorFallback');

  const cardClass = "relative rounded-2xl border border-border/30 bg-bg-card p-6 sm:p-10 lg:p-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6";

  if (allDone) {
    return (
      <div data-nav-invert>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={cardClass}
        >
          <GridBoxedBackground opacity={0.3} blur={0} mask="none" />
          <div className="relative z-10 w-full sm:w-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="hero-text text-xs font-black uppercase tracking-[0.3em] text-text-muted mb-2"
            >
              {t('student.dashboard.hero.welcomeBack')} <span className="text-text-primary font-black">{displayName}</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="hero-title text-xl sm:text-2xl lg:text-3xl font-black text-text-primary tracking-tight"
            >
              {t('student.dashboard.hero.allMissionsComplete')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="hero-sub text-sm text-text-secondary mt-1.5"
            >
              {t('student.dashboard.hero.allRoomsComplete')}
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
          >
            <Link to={continuePath} className="hero-cta btn-primary shrink-0 !text-xs w-full sm:w-auto text-center relative z-10 whitespace-nowrap" aria-label={t('student.dashboard.hero.reviewCurriculum')}>
              {t('student.dashboard.hero.reviewCurriculum')} <IconArrowRight size={14} className="inline" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (isEnrolled) {
    return (
      <div data-nav-invert>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={cardClass}
        >
          <GridBoxedBackground opacity={0.3} blur={0} mask="none" />
          <div className="relative z-10 w-full sm:w-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="hero-text text-xs font-black uppercase tracking-[0.3em] text-text-muted mb-2"
            >
              {t('student.dashboard.hero.welcomeBack')} <span className="text-text-primary font-black">{displayName}</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="hero-title text-xl sm:text-2xl lg:text-3xl font-black text-text-primary tracking-tight break-words"
            >
              {nextMission?.title || currentPhaseTitle || t('student.dashboard.hero.continueTraining')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="hero-sub text-sm text-text-secondary mt-1.5"
            >
              {t('student.dashboard.hero.pickUpWhere')}
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
          >
            <Link to={continuePath} className="hero-cta btn-primary shrink-0 !text-xs w-full sm:w-auto text-center relative z-10 whitespace-nowrap" aria-label={t('student.dashboard.hero.continueTraining')}>
              {t('student.dashboard.hero.continue')} <IconArrowRight size={14} className="inline" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div data-nav-invert>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={cardClass}
      >
        <GridBoxedBackground opacity={0.3} blur={0} mask="none" />
        <div className="relative z-10 w-full sm:w-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
              className="hero-text text-xs font-black uppercase tracking-[0.3em] text-text-muted mb-2"
            >
              {t('student.dashboard.hero.welcome')} <span className="text-text-primary font-black">{displayName}</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="hero-title text-xl sm:text-2xl lg:text-3xl font-black text-text-primary tracking-tight"
            >
              {t('student.dashboard.hero.beginJourney')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="hero-sub text-sm text-text-secondary mt-1.5"
            >
              {t('student.dashboard.hero.startHpb')}
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
        >
            <Link to={continuePath} className="hero-cta btn-primary shrink-0 !text-xs w-full sm:w-auto text-center relative z-10 whitespace-nowrap" aria-label={t('student.dashboard.hero.startTraining')}>
              {t('student.dashboard.hero.startTraining')} <IconArrowRight size={14} className="inline" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DashboardHero;
