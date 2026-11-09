import { Flame, Swords, Trophy } from 'lucide-react';
import { CardBase as Card } from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';

interface LeagueCardProps {
  rankName: string;
  cp: number;
  streakDays: number;
  progression?: {
    progress?: number;
    pointsToNext?: number;
    next?: { name?: string } | null;
  } | null;
}

/**
 * LeagueCard — competitive standing for the current student.
 *
 * Uses the authoritative progression summary already returned by
 * `/student/overview`; it never fabricates a league, rank or deadline. The
 * action links to the existing competitive leaderboard.
 */
const LeagueCard = ({ rankName, cp, streakDays, progression }: LeagueCardProps) => {
  const progress = Math.max(0, Math.min(100, Math.round(Number(progression?.progress ?? 0))));
  const nextName = progression?.next?.name;
  const pointsToNext = Number(progression?.pointsToNext ?? 0);

  return (
    <Card className="flex flex-col p-5 md:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
            <Swords className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="type-h2 text-text-primary">Competitive</h2>
            <p className="type-meta mt-0.5">Climb the operator leaderboard</p>
          </div>
        </div>
        <Trophy className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
      </div>

      <div className="grid grid-cols-3 gap-2 rounded-xl border border-border-subtle bg-surface-raised/40 p-3 text-center">
        <div>
          <p className="font-mono text-lg font-black text-text-primary">{cp.toLocaleString()}</p>
          <p className="type-meta mt-0.5">CP</p>
        </div>
        <div className="border-x border-border-subtle">
          <p className="font-mono text-lg font-black text-accent">{rankName}</p>
          <p className="type-meta mt-0.5">Rank</p>
        </div>
        <div>
          <p className="flex items-center justify-center gap-1 font-mono text-lg font-black text-text-primary">
            <Flame className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
            {streakDays}d
          </p>
          <p className="type-meta mt-0.5">Streak</p>
        </div>
      </div>

      {nextName ? (
        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <span className="type-meta">Progress to {nextName}</span>
            <span className="font-mono text-[11px] font-bold text-accent">
              {pointsToNext > 0 ? `${pointsToNext} CP to go` : `${progress}%`}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-surface-raised">
            <div className="h-full rounded-full bg-accent" style={{ width: `${progress}%` }} />
          </div>
        </div>
      ) : (
        <p className="mt-4 type-body-sm text-text-secondary">
          You have reached the top of the current progression ladder. Keep earning CP to stay ahead.
        </p>
      )}

      <Button to="/dashboard/competitive" variant="secondary" size="sm" className="mt-4 self-start">
        View leaderboard
      </Button>
    </Card>
  );
};

export default LeagueCard;
