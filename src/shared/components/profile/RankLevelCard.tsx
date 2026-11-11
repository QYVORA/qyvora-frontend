import React from 'react';
import { Card, Progress } from '@/shared/components/ui';
import CpLogo from '@/shared/components/CpLogo';
import RankInsignia from './RankInsignia';

interface RankLevelCardProps {
  rank?: string;
  xpLevel?: number;
  xpCurrent?: number;
  xpToNext?: number;
  cp?: number;
}

/** Rank, level progress and CP — moved out of the identity block. */
const RankLevelCard: React.FC<RankLevelCardProps> = ({
  rank,
  xpLevel,
  xpCurrent = 0,
  xpToNext = 0,
  cp = 0,
}) => {
  const percent = xpToNext > 0 ? Math.min(Math.round((xpCurrent / xpToNext) * 100), 100) : 0;

  return (
    <Card tone="feature" className="p-[var(--app-card-pad)]">
      <div className="flex items-center gap-3">
        {rank && <RankInsignia rank={rank} size="sm" />}
        <div className="min-w-0">
          <p className="text-base font-bold text-text-primary">{rank || 'Candidate'}</p>
          <p className="text-sm text-text-muted">Current rank</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-sm font-medium text-text-primary">
          <CpLogo className="h-4 w-4" />
          {cp.toLocaleString()}
          <span className="text-text-muted">CP</span>
        </div>
      </div>

      {xpLevel != null && xpToNext > 0 && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-text-primary">Level {xpLevel}</span>
            <span className="text-[13px] tabular-nums text-text-muted">
              {xpCurrent.toLocaleString()} / {xpToNext.toLocaleString()} XP
            </span>
          </div>
          <Progress label={`Level ${xpLevel} progress`} hideLabel value={percent} size="strip" />
        </div>
      )}
    </Card>
  );
};

export default RankLevelCard;
