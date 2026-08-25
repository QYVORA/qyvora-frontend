import { type ReactNode } from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';

export interface ProfileMetric {
  icon: ReactNode;
  value: string | number;
  accent?: boolean;
}

interface ProfileMetricsStripProps {
  metrics: ProfileMetric[];
}

const ProfileMetricsStrip: React.FC<ProfileMetricsStripProps> = ({ metrics }) => {
  const prefersReduced = useReducedMotion();

  return (
    <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-border/50 bg-bg-card sm:grid-cols-3 lg:grid-cols-6">
      {metrics.map((metric, index) => (
        <motion.div
          key={index}
          initial={prefersReduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReduced ? 0 : 0.3, delay: prefersReduced ? 0 : index * 0.04 }}
          className="flex min-h-18 items-center justify-center gap-3 border-b border-r border-border/20 px-4 py-4 last:border-r-0 sm:nth-[3n]:border-r-0 lg:border-b-0 lg:nth-[3n]:border-r lg:nth-[6n]:border-r-0"
        >
          <span className={metric.accent ? 'text-accent' : 'text-text-muted'}>{metric.icon}</span>
          <span className={metric.accent ? 'font-mono text-xl font-black tabular-nums text-accent' : 'font-mono text-xl font-black tabular-nums text-text-primary'}>
            {metric.value}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

export default ProfileMetricsStrip;
