import { memo, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import { QyvoraMark } from '@/shared/components/brand';
import ModuleHeader from './ModuleHeader';

export interface ProfileMetric {
  icon: ReactNode;
  value: string | number;
  accent?: boolean;
  label?: string;
}

interface ProfileMetricsStripProps {
  metrics: ProfileMetric[];
}

const ProfileMetricsStrip: React.FC<ProfileMetricsStripProps> = ({ metrics }) => {
  const prefersReduced = useReducedMotion();

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface p-5 md:p-6">
      <ModuleHeader icon={<QyvoraMark className="h-4 w-4" />} title="Overview" />

      <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={prefersReduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReduced ? 0 : 0.3, delay: prefersReduced ? 0 : index * 0.04 }}
            className="flex min-w-0 items-center gap-3"
          >
            <span className={metric.accent ? 'shrink-0 text-accent' : 'shrink-0 text-text-muted/70'}>
              {metric.icon}
            </span>
            <div className="min-w-0">
              <div
                className={
                  metric.accent
                    ? 'truncate font-mono text-xl font-black tabular-nums leading-tight text-accent'
                    : 'truncate font-mono text-xl font-black tabular-nums leading-tight text-text-primary'
                }
              >
                {metric.value}
              </div>
              {metric.label && (
                <div className="mt-0.5 truncate text-[10px] font-black uppercase tracking-widest leading-tight text-text-muted/70">
                  {metric.label}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default memo(ProfileMetricsStrip);