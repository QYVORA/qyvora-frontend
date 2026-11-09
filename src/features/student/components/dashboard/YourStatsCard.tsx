import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Award, CheckCircle2, Flame, Zap } from 'lucide-react';
import { CardBase as Card } from '@/shared/components/ui/Card';
import { ProfileAvatar } from '@/shared/components/profile';

interface YourStatsCardProps {
  username: string;
  rankName: string;
  cp: number;
  streakDays: number;
  roomsCompleted: number;
  roomsTotal: number;
  bootcampStatus: string;
  progression?: {
    progress?: number;
    pointsToNext?: number;
    next?: { name?: string } | null;
  } | null;
}

const StatTile = ({
  icon,
  value,
  label,
}: {
  icon: ReactNode;
  value: string;
  label: string;
}) => (
  <div className="rounded-xl border border-border-subtle bg-surface-raised/40 p-3">
    <div className="flex items-center gap-1.5 text-text-muted">{icon}</div>
    <p className="mt-1.5 font-mono text-lg font-black leading-none text-text-primary">{value}</p>
    <p className="mt-1 type-meta leading-tight">{label}</p>
  </div>
);

/**
 * YourStatsCard — quick overview of the student's progress.
 *
 * Values come from the authenticated user and `/student/overview` (CP, streak,
 * room progress, progression). Large numbers are locale-formatted and the card
 * links to the existing profile page.
 */
const YourStatsCard = ({
  username,
  rankName,
  cp,
  streakDays,
  roomsCompleted,
  roomsTotal,
  bootcampStatus,
  progression,
}: YourStatsCardProps) => {
  const progress = Math.max(0, Math.min(100, Math.round(Number(progression?.progress ?? 0))));
  const nextName = progression?.next?.name;
  const statusLabel = bootcampStatus === 'completed'
    ? 'Programme complete'
    : bootcampStatus === 'not_enrolled'
      ? 'Not enrolled'
      : 'In training';

  return (
    <Card className="p-5 md:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <ProfileAvatar handle={username || 'operator'} size="sm" />
          <div className="min-w-0">
            <h2 className="truncate text-base font-black text-text-primary">@{username || 'operator'}</h2>
            <p className="type-meta mt-0.5">{rankName} · {statusLabel}</p>
          </div>
        </div>
        <Link
          to="/dashboard/profile"
          aria-label="Open your profile"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border-subtle text-text-muted transition-colors hover:border-accent/40 hover:text-accent"
        >
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <StatTile icon={<Zap className="h-4 w-4 text-accent" aria-hidden="true" />} value={cp.toLocaleString()} label="Cyber Points" />
        <StatTile icon={<Flame className="h-4 w-4 text-accent" aria-hidden="true" />} value={`${streakDays}d`} label="Streak" />
        <StatTile
          icon={<CheckCircle2 className="h-4 w-4 text-accent" aria-hidden="true" />}
          value={roomsTotal > 0 ? `${roomsCompleted}/${roomsTotal}` : String(roomsCompleted)}
          label="Rooms complete"
        />
      </div>

      {nextName && (
        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <span className="type-meta">Next rank: {nextName}</span>
            <span className="font-mono text-[11px] font-bold text-accent">{progress}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-surface-raised">
            <div className="h-full rounded-full bg-accent" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 border-t border-border-subtle pt-3 text-[11px] font-black uppercase tracking-widest text-text-muted">
        <Award className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
        Progress is verified on QYVORA Chain
      </div>
    </Card>
  );
};

export default YourStatsCard;
