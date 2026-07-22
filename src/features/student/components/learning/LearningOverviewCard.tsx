import { Link } from 'react-router-dom';
import { IconArrowRight } from '@/shared/components/icons';
import { GridBoxedBackground } from '@/shared/components/backgrounds';
import { motion } from 'motion/react';

interface LearningOverviewStat {
  label: string;
  value: string | number;
  accent?: boolean;
}

interface LearningOverviewCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  avatar?: React.ReactNode;
  stats?: LearningOverviewStat[];
  action?: {
    label: string;
    to?: string;
    onClick?: () => void;
    icon?: React.ReactNode;
  };
  progress?: number;
  breadcrumbs?: Array<{ label: string; to?: string }>;
}

const LearningOverviewCard: React.FC<LearningOverviewCardProps> = ({
  icon,
  title,
  description,
  avatar,
  stats,
  action,
  progress,
  breadcrumbs,
}) => {
  return (
    <div data-nav-invert>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-text-muted">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span className="opacity-40">/</span>}
              {crumb.to ? (
                <Link to={crumb.to} className="font-black uppercase tracking-widest transition-colors hover:text-text-primary">
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-black uppercase tracking-wide text-text-primary">{crumb.label}</span>
              )}
            </span>
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl border border-border/30 bg-bg-card p-6 sm:p-8 lg:p-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 overflow-hidden"
      >
        <GridBoxedBackground opacity={0.3} blur={0} mask="none" />
        <div className="relative z-10 w-full sm:w-auto min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            className="ov-text flex items-center gap-3 mb-2"
          >
            {avatar ? (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-border/30 shrink-0">
                {avatar}
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-bg-elevated flex items-center justify-center shrink-0">
                {icon}
              </div>
            )}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="ov-title text-lg sm:text-xl lg:text-2xl font-black text-text-primary tracking-tight break-words"
          >
            {title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.35 }}
            className="ov-desc text-xs sm:text-sm text-text-secondary mt-1 max-w-xl"
          >
            {description}
          </motion.p>

          {stats && stats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.45 }}
              className="ov-stats flex flex-wrap items-center gap-3 mt-3"
            >
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className={`font-mono text-sm sm:text-base font-black ${stat.accent ? 'text-accent' : 'text-text-primary'}`}>
                    {stat.value}
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {action && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, delay: 0.55, type: 'spring', stiffness: 200, damping: 20 }}
            className="ov-cta shrink-0 w-full sm:w-auto relative z-10"
          >
            {action.to ? (
              <Link
                to={action.to}
                className="btn-primary !text-xs inline-flex items-center justify-center gap-2 px-6 py-2.5 w-full sm:w-auto text-center"
              >
                {action.icon}
                {action.label}
                <IconArrowRight size={12} className="inline" />
              </Link>
            ) : (
              <button
                onClick={action.onClick}
                className="btn-primary !text-xs inline-flex items-center justify-center gap-2 px-6 py-2.5 w-full sm:w-auto"
              >
                {action.icon}
                {action.label}
                <IconArrowRight size={12} className="inline" />
              </button>
            )}
          </motion.div>
        )}
      </motion.div>

      {typeof progress === 'number' && (
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-bg-elevated">
          <div
            className="h-full rounded-full bg-accent transition-all duration-700"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default LearningOverviewCard;
