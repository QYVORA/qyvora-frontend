import React from 'react';
import { RankInsignia, normalizeRank, RANK_TIERS } from './RankInsignia';

interface ProfileRankProps {
  rank?: string;
  showDescription?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProfileRank: React.FC<ProfileRankProps> = ({
  rank,
  showDescription = false,
  size = 'md',
  className = '',
}) => {
  const tier = normalizeRank(rank);
  const info = RANK_TIERS[tier];

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <RankInsignia rank={tier} size={size} />
      <div className="flex flex-col">
        <span className="text-sm font-medium text-text-primary">
          {info.label}
        </span>
        {showDescription && (
          <span className="text-[12px] text-text-muted">
            {info.description}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProfileRank;
