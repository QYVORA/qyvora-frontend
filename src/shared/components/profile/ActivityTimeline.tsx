import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import {
  FlaskConical,
  GraduationCap,
  Shield,
  Award,
  TrendingUp,
  Clock,
  UserCheck,
} from 'lucide-react';
import type { ActivityEvent, ActivityType, ProfileData } from '@/shared/types/profile';
import { deriveActivityEvents } from '@/shared/utils/profileDerivations';
import ModuleHeader from './ModuleHeader';

const ACTIVITY_CONFIG: Record<ActivityType, { icon: React.ReactNode; color: string; bg: string }> = {
  lab_completed:     { icon: <FlaskConical className="w-4 h-4" />,  color: 'text-red-400',    bg: 'bg-red-400/10' },
  course_completed:  { icon: <GraduationCap className="w-4 h-4" />, color: 'text-blue-400',   bg: 'bg-blue-400/10' },
  bootcamp_completed:{ icon: <Shield className="w-4 h-4" />,        color: 'text-accent',     bg: 'bg-accent/10' },
  achievement_earned:{ icon: <Award className="w-4 h-4" />,         color: 'text-amber-400',  bg: 'bg-amber-400/10' },
  rank_up:           { icon: <TrendingUp className="w-4 h-4" />,    color: 'text-purple-400', bg: 'bg-purple-400/10' },
  login:             { icon: <UserCheck className="w-4 h-4" />,     color: 'text-text-muted', bg: 'bg-bg-elevated' },
  profile_updated:   { icon: <UserCheck className="w-4 h-4" />,     color: 'text-text-muted', bg: 'bg-bg-elevated' },
};

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

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ profile, className = '' }) => {
  const { t } = useTranslation();
  const prefersReduced = useReducedMotion();

  const events = useMemo(() => deriveActivityEvents(profile), [profile]);

  if (events.length === 0) {
    return (
      <div className={`rounded-2xl border border-border/30 bg-bg-card p-6 ${className}`}>
        <ModuleHeader
          icon={<Clock className="w-4 h-4 text-accent" />}
          iconClassName="bg-accent/10"
          title={t('profile.activity.title', 'Recent Activity')}
        />
        <p className="text-xs text-text-muted text-center py-4">
          {t('profile.activity.empty', 'No activity yet. Complete labs and courses to see your timeline.')}
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-border/30 bg-bg-card overflow-hidden ${className}`}>
      <ModuleHeader
        icon={<Clock className="w-4 h-4 text-accent" />}
        iconClassName="bg-accent/10"
        title={t('profile.activity.title', 'Recent Activity')}
      />

      <div className="p-5">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[15px] top-3 bottom-3 w-px bg-border/30" />

          <div className="space-y-1">
            {events.map((event, idx) => {
              const config = ACTIVITY_CONFIG[event.type];
              return (
                <motion.div
                  key={event.id}
                  initial={prefersReduced ? false : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: prefersReduced ? 0 : 0.3, delay: prefersReduced ? 0 : idx * 0.05 }}
                  className="relative flex items-start gap-3 py-3 pl-1"
                >
                  {/* Icon dot */}
                  <div className={`relative z-10 w-[30px] h-[30px] rounded-lg ${config.bg} flex items-center justify-center shrink-0`}>
                    <span className={config.color}>{config.icon}</span>
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-sm font-bold text-text-primary leading-snug truncate">
                      {event.title}
                    </p>
                    {event.description && (
                      <p className="text-[10px] text-text-muted mt-0.5">
                        {event.description}
                      </p>
                    )}
                  </div>

                  {/* Timestamp */}
                  <span className="text-[9px] font-mono text-text-muted/60 shrink-0 pt-1">
                    {formatTimestamp(event.timestamp)}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityTimeline;
