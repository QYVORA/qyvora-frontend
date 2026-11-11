import { memo, type ReactNode } from 'react';
import { Activity } from 'lucide-react';
import { SectionCard } from '@/shared/components/ui';

export interface ProfileMetric {
  icon: ReactNode;
  value: string | number;
  accent?: boolean;
  label?: string;
}

interface ProfileMetricsStripProps {
  metrics: ProfileMetric[];
}

/** Overview card: labelled stat tiles on a flat grid with hairline rules. */
const ProfileMetricsStrip: React.FC<ProfileMetricsStripProps> = ({ metrics }) => (
  <SectionCard title="Overview" icon={<Activity className="h-5 w-5" />} bodyClassName="mt-1">
    <dl className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 xl:grid-cols-5">
      {metrics.map((metric, index) => (
        <div key={index} className="flex min-w-0 flex-col gap-1.5">
          <span className={metric.accent ? 'text-accent' : 'text-text-muted'} aria-hidden="true">
            {metric.icon}
          </span>
          <dd
            className={
              metric.accent
                ? 'truncate text-xl font-medium tabular-nums leading-tight text-accent'
                : 'truncate text-xl font-medium tabular-nums leading-tight text-text-primary'
            }
          >
            {metric.value}
          </dd>
          {metric.label && (
            <dt className="truncate text-[13px] text-text-muted">{metric.label}</dt>
          )}
        </div>
      ))}
    </dl>
  </SectionCard>
);

export default memo(ProfileMetricsStrip);
