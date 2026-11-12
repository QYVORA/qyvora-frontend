import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Trophy } from 'lucide-react';
import { Card } from '@/shared/components/ui';
import Button from '@/shared/components/ui/Button';
import Skeleton from '@/shared/components/ui/Skeleton';
import { Identicon } from '@/shared/components';
import type { LeaderboardEntry } from '@/shared/components/leaderboard';
import api from '@/core/services/api';

interface TopOperatorsCardProps {
  currentUserId?: string;
}

/**
 * TopOperatorsCard — weekly standings from the public leaderboard.
 *
 * This complements CommunityCard's activity feed and follow controls with
 * real operator rankings and links to their public profiles.
 */
const TopOperatorsCard = ({ currentUserId }: TopOperatorsCardProps) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    api.get('/public/leaderboard?period=week&limit=5')
      .then((res) => {
        if (!mounted) return;
        setEntries(Array.isArray(res.data?.entries) ? res.data.entries : []);
        setError(false);
      })
      .catch(() => {
        if (mounted) setError(true);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  return (
    <Card as="section" className="flex flex-col p-5 md:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center text-accent">
            <Trophy className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="type-h2 text-text-primary">Top operators</h2>
            <p className="type-meta mt-0.5">This week</p>
          </div>
        </div>
        <Button to="/dashboard/competitive" variant="ghost" size="sm" className="shrink-0">
          Board
        </Button>
      </div>

      {loading && (
        <div className="space-y-2.5" role="status" aria-label="Loading community operators">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-2.5 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <p className="type-body-sm text-text-secondary">
          Community activity is unavailable right now. Open the leaderboard to try again.
        </p>
      )}

      {!loading && !error && entries.length === 0 && (
        <p className="type-body-sm text-text-secondary">
          No operators are ranked this week yet. Complete a Lab to appear on the board.
        </p>
      )}

      {!loading && !error && entries.length > 0 && (
        <ul>
          {entries.map((entry) => {
            const handle = entry.hackerHandle || entry.name || 'operator';
            const isYou = currentUserId && entry.userId === currentUserId;
            return (
              <li key={entry.userId} className="border-t border-border-subtle py-2.5 first:border-t-0">
                <Link
                  to={`/@${entry.hackerHandle}`}
                  className="flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-accent/30 bg-black [&_svg]:h-full [&_svg]:w-full">
                    <Identicon value={handle} size={36} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-text-primary">@{handle}</span>
                      {isYou && (
                        <span className="rounded-md bg-accent px-1.5 py-0.5 text-[12px] font-medium text-on-accent">
                          You
                        </span>
                      )}
                    </span>
                    <span className="type-meta block truncate">
                      {entry.progression?.rank || entry.rankLabel || 'Operator'} · {entry.cp.toLocaleString()} CP
                    </span>
                  </span>
                  <span className="shrink-0 text-xs font-medium tabular-nums text-text-muted">#{entry.rank}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <Link
        to="/dashboard/competitive"
        className="mt-4 inline-flex items-center gap-1 border-t border-border-subtle pt-3 text-sm font-medium text-accent hover:underline"
      >
        View the full leaderboard <ArrowRight className="h-3 w-3" aria-hidden="true" />
      </Link>
    </Card>
  );
};

export default TopOperatorsCard;
