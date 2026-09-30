import { useMemo } from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import type { ActivityEvent, ProfileData } from '@/shared/types/profile';
import { deriveActivityEvents } from '@/shared/utils/profileDerivations';
import BootcampBadge from '@/shared/components/BootcampBadge';
import CourseBadge from '@/shared/components/CourseBadge';
import { QyvoraMark } from '@/shared/components/brand';
import ModuleHeader from './ModuleHeader';

interface ActivityTimelineProps {
  profile: ProfileData;
  className?: string;
}

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function GenericBadge({ icon }: { icon: React.ReactNode }) {
  return (
    <span className="relative z-10 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg border border-border-subtle bg-surface-raised text-accent">
      {icon}
    </span>
  );
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ profile, className = '' }) => {
  const prefersReduced = useReducedMotion();

  const events = useMemo(() => deriveActivityEvents(profile), [profile]);

  if (events.length === 0) {
    return (
      <div className={`rounded-2xl border border-border-subtle bg-surface p-5 md:p-6 ${className}`}>
        <ModuleHeader icon={<QyvoraMark className="h-4 w-4" />} title="Recent Activity" />
        <p className="py-4 text-center text-sm text-text-muted">
          No activity yet. Complete labs and courses to see your timeline.
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-border-subtle bg-surface p-5 md:p-6 ${className}`}>
      <ModuleHeader icon={<QyvoraMark className="h-4 w-4" />} title="Recent Activity" />

      <div className="relative">
        <div className="absolute bottom-3 left-[15px] top-3 w-px bg-border/30" />

        <div className="space-y-1">
          {events.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={prefersReduced ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: prefersReduced ? 0 : 0.3, delay: prefersReduced ? 0 : idx * 0.05 }}
              className="relative flex items-start gap-3 py-3 pl-1"
            >
              {eventIcon(event, profile)}

              <div className="min-w-0 flex-1 pt-0.5">
                <p className="truncate text-sm font-bold leading-snug text-text-primary">
                  {event.title}
                </p>
                {event.description && (
                  <p className="mt-0.5 text-xs text-text-muted">{event.description}</p>
                )}
              </div>

              <span className="shrink-0 pt-1 font-mono text-xs text-text-muted/60">
                {formatTimestamp(event.timestamp)}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

function eventIcon(event: ActivityEvent, profile: ProfileData): React.ReactNode {
  if (event.type === 'bootcamp_completed') {
    return <BootcampBadge completed className="h-8 w-8 shrink-0" />;
  }
  if (event.type === 'course_completed') {
    const courseId = profile.completedCourseIds?.[0];
    return courseId ? (
      <CourseBadge courseId={courseId} className="h-8 w-8 shrink-0" />
    ) : (
      <GenericBadge icon={<QyvoraMark className="h-4 w-4" />} />
    );
  }
  return <GenericBadge icon={<QyvoraMark className="h-4 w-4" />} />;
}

export default ActivityTimeline;