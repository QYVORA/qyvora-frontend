import { Link } from 'react-router-dom';
import { ArrowUpRight, CheckCircle2, Flame, Trophy, Zap } from 'lucide-react';
import { Card } from '@/shared/components/ui';
import { ProfileAvatar } from '@/shared/components/profile';

interface YourStatsCardProps {
  username: string;
  rankName?: string;
  cp?: number;
  streakDays?: number;
  roomsCompleted?: number;
  roomsTotal?: number;
  bootcampStatus?: string | null;
  overviewError?: boolean;
  progression?: {
    progress?: number;
    pointsToNext?: number;
    next?: { name?: string } | null;
  } | null;
}

const YourStatsCard = ({
  username,
  rankName,
  cp,
  streakDays,
  roomsCompleted,
  roomsTotal,
  bootcampStatus,
  overviewError = false,
  progression,
}: YourStatsCardProps) => {
  const progressValue = progression?.progress;
  const progress = typeof progressValue === 'number'
    && Number.isFinite(progressValue)
    && progressValue >= 0
    && progressValue <= 100
    ? Math.round(progressValue)
    : undefined;
  const nextName = progression?.next?.name;
  const statusLabel = bootcampStatus === 'completed'
    ? 'Programme complete'
    : bootcampStatus === 'not_enrolled'
      ? 'Not enrolled'
      : bootcampStatus
        ? 'In training'
        : undefined;

  const metrics = [
    ...(typeof streakDays === 'number' ? [{
      key: 'streak',
      icon: <Flame className="h-4 w-4 text-accent" aria-hidden="true" />,
      label: 'Learning streak',
      value: `${streakDays} ${streakDays === 1 ? 'day' : 'days'}`,
    }] : []),
    ...(typeof cp === 'number' ? [{
      key: 'cp',
      icon: <Zap className="h-4 w-4 text-accent" aria-hidden="true" />,
      label: 'CP balance',
      value: cp.toLocaleString(),
    }] : []),
    ...(typeof roomsCompleted === 'number' ? [{
      key: 'rooms',
      icon: <CheckCircle2 className="h-4 w-4 text-accent" aria-hidden="true" />,
      label: 'Bootcamp rooms complete',
      value: typeof roomsTotal === 'number' && roomsTotal > 0
        ? `${roomsCompleted}/${roomsTotal}`
        : String(roomsCompleted),
    }] : []),
  ];

  return (
    <Card as="section" className="p-5 md:p-6">
      <h2 className="type-h2 mb-4 text-text-primary">Your Stats</h2>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <ProfileAvatar handle={username || 'operator'} size="sm" />
          <div className="min-w-0">
            <h3 className="truncate text-base font-medium text-text-primary">@{username || 'operator'}</h3>
            <p className="mt-0.5 type-meta">
              {overviewError
                ? 'Progress unavailable'
                : (
                    <span className="inline-flex flex-wrap items-center gap-x-1">
                      {rankName && <Trophy className="h-3 w-3 text-accent" aria-hidden="true" />}
                      {rankName ? `Rank tier · ${rankName}` : 'Rank unavailable'}
                      {statusLabel && <span>· {statusLabel}</span>}
                    </span>
                  )}
            </p>
          </div>
        </div>
        <Link
          to="/dashboard/profile"
          aria-label="Open your profile"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-text-muted transition-colors duration-[var(--dur-fast)] ease-[var(--ease-smooth)] hover:bg-surface-raised hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      {metrics.length > 0 ? (
        <dl className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {metrics.map((metric) => (
            <div
              key={metric.key}
              className="flex min-w-0 items-center gap-2.5 rounded-xl bg-canvas px-3 py-2.5"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                {metric.icon}
              </span>
              <span className="flex min-w-0 flex-col">
                <dd className="text-base font-medium leading-tight tabular-nums text-text-primary">
                  {metric.value}
                </dd>
                <dt className="truncate text-sm text-text-muted">{metric.label}</dt>
              </span>
            </div>
          ))}
        </dl>
      ) : overviewError ? (
        <p role="status" className="type-body-sm text-text-secondary">
          Statistics are unavailable until your progress data can be loaded.
        </p>
      ) : (
        <p className="type-body-sm text-text-secondary">
          Statistics will appear as progress data becomes available.
        </p>
      )}

      {nextName && progress !== undefined && !overviewError && (
        <div className="mt-3 border-t border-border-subtle pt-3">
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <span className="type-meta">Progress to {nextName}</span>
            <span className="font-mono text-[11px] font-bold text-accent">{progress}%</span>
          </div>
          <div
            className="h-1.5 overflow-hidden rounded-full bg-surface-raised"
            role="progressbar"
            aria-label={`Progress to ${nextName}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-[var(--dur-slow)] ease-[var(--ease-smooth)] motion-reduce:transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </Card>
  );
};

export default YourStatsCard;
