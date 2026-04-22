import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../../../../shared/components/ScrollReveal';
import StatCounter from '../../../../shared/components/ui/StatCounter';
import { resolveImg } from './helpers';
import type { LeaderboardEntry } from './types';

const CP_POINTS_BADGE = '/images/metrics/cp-points-badge.svg';

interface LeaderboardSectionProps {
  leaderboard: LeaderboardEntry[];
  totalCp: number;
}

const LeaderboardSection: React.FC<LeaderboardSectionProps> = ({ leaderboard, totalCp }) => (
  <section className="py-16 md:py-24 bg-bg-card border-y border-border relative">
    <div className="max-w-7xl mx-auto px-4 md:px-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 md:mb-16 gap-4">
        <ScrollReveal>
          <span className="text-accent text-[11px] font-bold uppercase tracking-[0.3em] mb-3 block">// THE BOARD</span>
          <h2 className="text-3xl md:text-4xl text-text-primary font-bold mb-3">Top Operators</h2>
          <Link to="/leaderboard" className="text-xs font-bold text-accent hover:underline uppercase tracking-widest flex items-center gap-2">Hall of Shadows <ArrowRight className="w-4 h-4" /></Link>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <div className="text-left md:text-right">
            <div className="text-3xl md:text-4xl font-bold text-accent font-mono inline-flex items-center gap-2">
              <img src={CP_POINTS_BADGE} alt="CP Points" className="w-6 h-6 object-contain" />
              <StatCounter end={totalCp} suffix=" CP" />
            </div>
            <div className="text-[10px] uppercase tracking-widest text-text-muted">Total Community CP Earned</div>
          </div>
        </ScrollReveal>
      </div>
      <ScrollReveal delay={0.3} className="md:hidden space-y-3">
        {(leaderboard.length > 0 ? leaderboard : []).slice(0, 5).map((u, idx) => {
          const handle = u.handle || u.name || 'Anonymous';
          return (
            <div key={u.id || idx} className="rounded-lg border border-border bg-bg p-3 flex items-center gap-3">
              <div className="text-xl font-bold font-mono text-accent w-10 flex-none">#{idx + 1}</div>
              {u.avatarUrl
                ? <img src={resolveImg(u.avatarUrl)} alt="" className="w-9 h-9 rounded-full border border-border flex-none" />
                : <div className="w-9 h-9 rounded-full border border-border bg-accent-dim flex items-center justify-center flex-none text-accent text-xs font-bold">{handle[0]?.toUpperCase()}</div>
              }
              <div className="min-w-0 flex-1">
                <div className="font-mono text-sm font-medium text-text-primary truncate">{handle}</div>
                <div className="text-[10px] uppercase tracking-widest text-text-muted">{u.rank || 'Operator'}</div>
              </div>
              <div className="text-right">
                <div className="font-mono font-bold text-accent text-sm inline-flex items-center gap-1">
                  <img src={CP_POINTS_BADGE} alt="CP Points" className="w-3.5 h-3.5 object-contain" />
                  {Number(u.totalXp || 0).toLocaleString()}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-text-muted">CP</div>
              </div>
            </div>
          );
        })}
        {leaderboard.length === 0 && (
          <div className="p-6 text-center text-text-muted text-sm border border-border rounded-lg bg-bg">No operators on the board yet.</div>
        )}
      </ScrollReveal>
      <ScrollReveal delay={0.3} className="hidden md:block overflow-x-auto border border-border rounded-lg bg-bg">
        <div className="min-w-[520px]">
          <div className="grid grid-cols-5 p-3 md:p-4 border-b border-border bg-accent-dim/5 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
            <div>Rank</div><div className="col-span-2">Operator</div><div>Role</div><div className="text-right">CP</div>
          </div>
          {(leaderboard.length > 0 ? leaderboard : []).slice(0, 5).map((u, idx) => {
            const podium = ['#FFD700', '#C0C0C0', '#CD7F32'];
            const color = idx < 3 ? podium[idx] : undefined;
            const handle = u.handle || u.name || 'Anonymous';
            return (
              <div key={u.id || idx} className="grid grid-cols-5 p-3 md:p-4 border-b border-border/50 items-center hover:bg-accent-dim/5 transition-colors">
                <div><span className="text-base md:text-xl font-bold font-mono" style={{ color: color || 'var(--text-muted)' }}>#{idx + 1}</span></div>
                <div className="col-span-2 flex items-center gap-2 md:gap-3">
                  {u.avatarUrl
                    ? <img src={resolveImg(u.avatarUrl)} alt="" className="w-7 h-7 md:w-9 md:h-9 rounded-full border border-border flex-none" />
                    : <div className="w-7 h-7 md:w-9 md:h-9 rounded-full border border-border bg-accent-dim flex items-center justify-center flex-none text-accent text-xs font-bold">{handle[0]?.toUpperCase()}</div>
                  }
                  <span className="font-mono text-text-primary text-xs md:text-sm font-medium truncate">{handle}</span>
                </div>
                <div className="font-mono text-text-secondary text-xs md:text-sm">{u.rank || 'Operator'}</div>
                <div className="text-right font-mono font-bold text-accent text-xs md:text-sm inline-flex items-center gap-1 justify-end">
                  <img src={CP_POINTS_BADGE} alt="CP Points" className="w-3.5 h-3.5 object-contain" />
                  {Number(u.totalXp || 0).toLocaleString()} CP
                </div>
              </div>
            );
          })}
          {leaderboard.length === 0 && (
            <div className="p-6 text-center text-text-muted text-sm">No operators on the board yet.</div>
          )}
        </div>
      </ScrollReveal>
    </div>
  </section>
);

export default LeaderboardSection;
