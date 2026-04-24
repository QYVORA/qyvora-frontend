import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../../../../shared/components/ScrollReveal';
import StatCounter from '../../../../shared/components/ui/StatCounter';
import { resolveImg } from './helpers';
import type { LeaderboardEntry } from './types';
import CpLogo from '../../../../shared/components/CpLogo';

interface LeaderboardSectionProps {
  leaderboard: LeaderboardEntry[];
  totalCp: number;
  loading?: boolean;
}

// Fix #15 & #16: single shared row component — no duplicated mobile/desktop trees
const LeaderboardRow: React.FC<{ entry: LeaderboardEntry; rank: number }> = ({ entry, rank }) => {
  const handle = entry.handle || entry.name || 'Anonymous';
  return (
    <div className="rounded-lg border border-border bg-bg p-3 md:p-4 lg:p-5 flex items-center gap-3 md:gap-4 lg:gap-5">
      <div className="text-xl md:text-2xl lg:text-3xl font-bold font-mono text-accent w-10 md:w-14 lg:w-16 flex-none">
        #{rank}
      </div>
      {entry.avatarUrl ? (
        <img
          src={resolveImg(entry.avatarUrl)}
          alt=""
          className="w-9 h-9 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-full border border-border flex-none"
        />
      ) : (
        <div className="w-9 h-9 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-full border border-border bg-accent-dim flex items-center justify-center flex-none text-accent text-xs md:text-sm font-bold">
          {handle[0]?.toUpperCase()}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="font-mono text-sm md:text-base lg:text-lg font-medium text-text-primary truncate">{handle}</div>
        <div className="text-[10px] md:text-[11px] uppercase tracking-widest text-text-muted">{entry.rank || 'Operator'}</div>
      </div>
      <div className="text-right flex-none">
        <div className="font-mono font-bold text-accent text-sm md:text-base lg:text-lg">
          {Number(entry.totalXp || 0).toLocaleString()}
        </div>
        <div className="text-[10px] uppercase tracking-widest text-text-muted inline-flex items-center justify-end">
          <CpLogo className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};

const LeaderboardSection: React.FC<LeaderboardSectionProps> = ({ leaderboard, totalCp, loading = false }) => (
  <section className="py-16 md:py-24 bg-bg-card border-y border-border relative">
    <div className="max-w-7xl mx-auto px-4 md:px-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 md:mb-16 gap-4">
        <ScrollReveal>
          <span className="text-accent text-[11px] font-bold uppercase tracking-[0.3em] mb-3 block">// THE BOARD</span>
          <h2 className="text-3xl md:text-4xl text-text-primary font-bold mb-3">Top Operators</h2>
          <Link to="/leaderboard" className="text-xs font-bold text-accent hover:underline uppercase tracking-widest flex items-center gap-2">
            Hall of Shadows <ArrowRight className="w-4 h-4" />
          </Link>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <div className="text-left md:text-right">
            <div className="text-3xl md:text-4xl font-bold text-accent font-mono inline-flex items-center gap-2">
              <StatCounter end={totalCp} />
              <CpLogo className="w-7 h-7 md:w-8 md:h-8" />
            </div>
            <div className="text-[10px] uppercase tracking-widest text-text-muted">Total Community Points Earned</div>
          </div>
        </ScrollReveal>
      </div>

      {/* Fix #15 & #16: single unified list, no duplicate mobile/desktop trees */}
      <ScrollReveal delay={0.3} className="space-y-3 md:space-y-4">
        {loading ? (
          [0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-lg border border-border bg-bg p-3 md:p-4 flex items-center gap-3 animate-pulse">
              <div className="w-10 md:w-14 h-8 bg-accent-dim/30 rounded flex-none" />
              <div className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-accent-dim/30 flex-none" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-accent-dim/30 rounded w-1/3" />
                <div className="h-2 bg-accent-dim/20 rounded w-1/4" />
              </div>
              <div className="w-16 h-6 bg-accent-dim/20 rounded flex-none" />
            </div>
          ))
        ) : leaderboard.length === 0 ? (
          <div className="p-6 text-center text-text-muted text-sm border border-border rounded-lg bg-bg">
            No operators on the board yet.
          </div>
        ) : (
          leaderboard.slice(0, 5).map((u, idx) => (
            <LeaderboardRow key={u.id || idx} entry={u} rank={idx + 1} />
          ))
        )}
      </ScrollReveal>
    </div>
  </section>
);

export default LeaderboardSection;
