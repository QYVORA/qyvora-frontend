import { Link } from 'react-router-dom';
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
  const displayName = username ? `@${username}` : 'Operator';

  const cardClass = "relative rounded-2xl border border-bg/20 bg-accent p-6 sm:p-10 lg:p-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6";

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
              className="hero-text text-xs font-black uppercase tracking-[0.3em] text-bg/60 mb-2"
            >
              Welcome back, <span className="text-bg font-black">{displayName}</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="hero-title text-xl sm:text-2xl lg:text-3xl font-black text-bg tracking-tight"
            >
              All missions complete
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="hero-sub text-sm text-bg/70 mt-1.5"
            >
              You have completed every available room.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
          >
            <Link to={continuePath} className="hero-cta btn-primary shrink-0 !text-xs w-full sm:w-auto text-center relative z-10" aria-label="Review completed curriculum">
              Review Curriculum <IconArrowRight size={14} className="inline" />
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
              className="hero-text text-xs font-black uppercase tracking-[0.3em] text-bg/60 mb-2"
            >
              Welcome back, <span className="text-bg font-black">{displayName}</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="hero-title text-xl sm:text-2xl lg:text-3xl font-black text-bg tracking-tight break-words"
            >
              {nextMission?.title || currentPhaseTitle || 'Continue your training'}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="hero-sub text-sm text-bg/70 mt-1.5"
            >
              Pick up where you left off.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
          >
            <Link to={continuePath} className="hero-cta btn-primary shrink-0 !text-xs w-full sm:w-auto text-center relative z-10" aria-label="Continue training">
              Continue <IconArrowRight size={14} className="inline" />
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
            className="hero-text text-xs font-black uppercase tracking-[0.3em] text-bg/60 mb-2"
          >
            Welcome, <span className="text-bg font-black">{displayName}</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="hero-title text-xl sm:text-2xl lg:text-3xl font-black text-bg tracking-tight"
          >
            Begin your journey
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="hero-sub text-sm text-bg/70 mt-1.5"
          >
            Start the Hacker Protocol Bootcamp and earn your first CP.
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
        >
          <Link to={continuePath} className="hero-cta btn-primary shrink-0 !text-xs w-full sm:w-auto text-center relative z-10" aria-label="Start Hacker Protocol Bootcamp training">
            Start Training <IconArrowRight size={14} className="inline" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DashboardHero;
