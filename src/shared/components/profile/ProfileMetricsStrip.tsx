import { type ReactNode } from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import { LayoutGrid } from 'lucide-react';
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
    <div className="rounded-2xl border border-border/50 bg-bg-card overflow-hidden">
      <ModuleHeader
        icon={<LayoutGrid className="w-4 h-4 text-accent" />}
        iconClassName="bg-accent/10"
        title="Overview"
      />

      <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={prefersReduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReduced ? 0 : 0.3, delay: prefersReduced ? 0 : index * 0.04 }}
            className="flex items-center gap-3 rounded-xl border border-border/50 bg-bg-elevated/40 px-3 py-3"
          >
            <span className={metric.accent ? 'text-accent shrink-0' : 'text-text-muted shrink-0'}>
              {metric.icon}
            </span>
            <div className="min-w-0">
              <div
                className={
                  metric.accent
                    ? 'font-mono text-lg font-black tabular-nums leading-tight text-accent truncate'
                    : 'font-mono text-lg font-black tabular-nums leading-tight text-text-primary truncate'
                }
              >
                {metric.value}
              </div>
              {metric.label && (
                <div className="text-[9px] font-black uppercase tracking-widest leading-tight text-text-muted/70 truncate">
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

export default ProfileMetricsStrip;