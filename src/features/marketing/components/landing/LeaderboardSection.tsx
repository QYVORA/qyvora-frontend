import React from 'react';
import { Crown, Medal, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import ScrollReveal from '../../../../shared/components/ScrollReveal';
import StatCounter from '../../../../shared/components/ui/StatCounter';
import { resolveImg } from './helpers';
import type { LeaderboardEntry } from './types';
import CpLogo from '../../../../shared/components/CpLogo';
import AsciiHeading from '../../../../shared/components/ui/AsciiHeading';
import { extractCpBalance } from '../../../../shared/utils/cpBalance';

interface LeaderboardSectionProps {
  leaderboard: LeaderboardEntry[];
  totalCp: number;
  loading?: boolean;
}

const Avatar: React.FC<{
  entry: LeaderboardEntry;
  size?: 'sm' | 'md' | 'lg';
  colorHex?: string;
  borderClass?: string;
}> = ({ entry, size = 'md', colorHex = '#88AD7C', borderClass = 'border-border' }) => {
  const handle = entry.handle || entry.name || 'A';
  const sizeMap = { sm: 'w-8 h-8 text-xs', md: 'w-11 h-11 text-sm', lg: 'w-14 h-14 text-base' };

  if (entry.avatarUrl) {
    return (
      <img
        src={resolveImg(entry.avatarUrl)}
        alt=""
        className={`${sizeMap[size]} rounded-full border-2 ${borderClass} object-cover flex-none`}
      />
    );
  }
  return (
    <div
      className={`${sizeMap[size]} rounded-full border-2 ${borderClass} flex items-center justify-center flex-none font-black text-bg`}
      style={{ background: colorHex }}
    >
      {handle[0]?.toUpperCase()}
    </div>
  );
};

const getRankMeta = (rank: number) => {
  if (rank === 1) {
    return {
      border: 'border-accent/25',
      bg: 'bg-accent/5',
      color: 'text-accent',
      avatarColor: '#88AD7C',
      avatarBorder: 'border-accent/30',
      label: '#1',
      icon: <Crown className="w-3.5 h-3.5" />,
    };
  }
  return {
    border: 'border-border',
    bg: 'bg-bg-card',
    color: 'text-text-muted',
    avatarColor: '#5C7454',
    avatarBorder: 'border-border',
    label: `#${rank}`,
    icon: <Medal className="w-3.5 h-3.5" />,
  };
};

const PodiumCard: React.FC<{ entry: LeaderboardEntry; rank: 1 | 2 | 3; delay: number }> = ({
  entry, rank, delay,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const handle = entry.handle || entry.name || 'Anonymous';
  const meta = getRankMeta(rank)!;

  return (
    <Link to={`/@${handle}`}>
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 28, filter: 'blur(6px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1], filter: { duration: 0.35 } }}
        className={`terminal-card flex flex-col items-center rounded-2xl border ${meta.border} ${meta.bg} p-4 text-center lg:p-5
                    ${rank === 1 ? 'md:scale-[1.02] md:-translate-y-1' : ''}
                    transition-all duration-300 hover:-translate-y-1 hover:border-border-strong cursor-pointer`}
        style={{ boxShadow: 'var(--card-shimmer)' }}
      >
      <div className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.2em] mb-3 ${meta.color}`}>
        {meta.icon}
        {meta.label}
      </div>
      <Avatar entry={entry} size="md" colorHex={meta.avatarColor} borderClass={meta.avatarBorder} />
      <div className={`mt-2.5 font-mono text-sm font-bold truncate w-full ${meta.color}`}>{handle}</div>
      <div className="text-[9px] uppercase tracking-widest text-text-muted mt-0.5 mb-2.5">
        {entry.rank || 'Operator'}
      </div>
      <div
        className={`font-mono font-black text-base inline-flex items-center gap-1.5 ${meta.color}`}
      >
        {(extractCpBalance(entry) ?? Number(entry.totalXp || 0)).toLocaleString()}
        <CpLogo className="w-3.5 h-3.5" />
      </div>
    </motion.div>
    </Link>
  );
};

const CompactRow: React.FC<{ entry: LeaderboardEntry; rank: number; delay: number }> = ({
  entry, rank, delay,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const handle = entry.handle || entry.name || 'Anonymous';

  return (
    <Link to={`/@${handle}`}>
      <motion.div
        initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -16, filter: 'blur(4px)' }}
        whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1], filter: { duration: 0.25 } }}
        className="terminal-card flex items-center gap-4 rounded-2xl border border-border bg-bg-card px-4 py-3.5 transition-colors duration-200 hover:border-border-strong cursor-pointer"
        style={{ boxShadow: 'var(--card-shimmer)' }}
      >
        <span className="font-mono text-sm font-black text-accent/40 w-6 flex-none">#{rank}</span>
        <Avatar entry={entry} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="font-mono text-xs font-medium text-text-primary truncate">{handle}</div>
          <div className="text-[9px] uppercase tracking-widest text-text-muted mt-0.5">{entry.rank || 'Operator'}</div>
        </div>
        <div className="font-mono text-xs font-bold text-accent/80 flex-none inline-flex items-center gap-1.5">
          {(extractCpBalance(entry) ?? Number(entry.totalXp || 0)).toLocaleString()} <CpLogo className="w-3 h-3" />
        </div>
      </motion.div>
    </Link>
  );
};

const MobileRow: React.FC<{ entry: LeaderboardEntry; rank: number; delay: number }> = ({
  entry, rank, delay,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const handle = entry.handle || entry.name || 'Anonymous';
  const meta = getRankMeta(rank);

  return (
    <Link to={`/@${handle}`} className="block">
      <motion.div
        initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
        className={`terminal-card flex items-center gap-4 rounded-2xl border px-4 py-5 transition-colors cursor-pointer ${
          meta ? `${meta.border} ${meta.bg}` : 'border-border bg-bg-card'
        }`}
        style={{ boxShadow: 'var(--card-shimmer)' }}
      >
        <div className={`font-mono font-black text-base w-10 flex-none flex items-center gap-1.5 ${meta ? meta.color : 'text-accent/50'}`}>
          {meta ? React.cloneElement(meta.icon as React.ReactElement, { className: 'w-4 h-4' } as any) : null}
          #{rank}
        </div>
        <Avatar
          entry={entry}
          size="md"
          colorHex={meta ? meta.avatarColor : '#88AD7C'}
          borderClass={meta ? meta.avatarBorder : 'border-border'}
        />
        <div className="min-w-0 flex-1">
          <div className={`font-mono text-base font-medium truncate ${meta ? meta.color : 'text-text-primary'}`}>
            {handle}
          </div>
          <div className="text-[11px] uppercase tracking-widest text-text-muted mt-1">{entry.rank || 'Operator'}</div>
        </div>
        <div className={`font-mono font-bold text-base flex-none inline-flex items-center gap-2 ${meta ? meta.color : 'text-accent/70'}`}>
          {(extractCpBalance(entry) ?? Number(entry.totalXp || 0)).toLocaleString()} <CpLogo className="w-4 h-4" />
        </div>
      </motion.div>
    </Link>
  );
};

const PodiumSkeleton = () => (
  <div className="rounded-xl border-2 border-border bg-bg-card p-4 animate-pulse flex flex-col items-center gap-3">
    <div className="w-10 h-3 bg-accent-dim/30 rounded" />
    <div className="w-11 h-11 rounded-full bg-accent-dim/30" />
    <div className="h-3 bg-accent-dim/30 rounded w-2/3" />
    <div className="h-2 bg-accent-dim/20 rounded w-1/4" />
    <div className="h-4 bg-accent-dim/25 rounded w-1/2" />
  </div>
);

const LeaderboardSection: React.FC<LeaderboardSectionProps> = ({ leaderboard, totalCp, loading = false }) => {
  const top3 = leaderboard.slice(0, 3) as LeaderboardEntry[];
  const rest  = leaderboard.slice(3, 5);

  return (
    <div className="w-full min-h-full flex items-center py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-2 md:px-10 relative z-10 w-full overflow-hidden">
        
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-3">
          <div className="h-[1px] w-8 bg-accent/40" />
          <span className="text-[10px] font-black text-accent uppercase tracking-[0.35em]">
            Rank Up be the First
          </span>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 md:mb-10 gap-4 px-2 md:px-0">
          <div>
            <AsciiHeading 
              text="Leaderboard" 
              font="ANSI Shadow" 
              align="left" 
              compact
              animated 
              className="mb-6" 
            />
            <ScrollReveal>
              <p className="text-text-secondary text-sm mt-2 max-w-lg">Elite operators ranked by CP — chase the podium.</p>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.1} className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="text-left md:text-right">
              <div className="text-2xl lg:text-3xl font-black text-accent font-mono inline-flex items-center gap-2">
                <StatCounter end={totalCp} />
                <CpLogo className="w-5 h-5" />
              </div>
              <div className="text-[9px] uppercase tracking-widest text-text-muted mt-0.5">
                Community Points
              </div>
            </div>
            <Link 
              to="/leaderboard"
              className="btn-primary px-6 py-2.5 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
            >
              Full Board <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </ScrollReveal>
        </div>

        <div className="md:hidden flex flex-col gap-10 px-2">
          {loading ? (
            [0,1,2,3,4].map(i => (
              <div key={i} className="rounded-xl border border-border bg-bg-card p-4 flex items-center gap-3 animate-pulse">
                <div className="w-8 h-5 bg-accent-dim/30 rounded" />
                <div className="w-8 h-8 rounded-full bg-accent-dim/30" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-accent-dim/30 rounded w-1/3" />
                  <div className="h-2 bg-accent-dim/20 rounded w-1/4" />
                </div>
                <div className="w-14 h-4 bg-accent-dim/20 rounded" />
              </div>
            ))
          ) : leaderboard.length === 0 ? (
            <div className="p-8 text-center text-text-muted text-sm border border-border rounded-xl bg-bg">
              No operators on the board yet.
            </div>
          ) : (
            leaderboard.slice(0, 3).map((u, idx) => (
              <MobileRow key={u.handle || idx} entry={u} rank={idx + 1} delay={idx * 0.06} />
            ))
          )}
        </div>

        <div className="hidden md:flex gap-5 items-start">
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-3 gap-4">
                {[0,1,2].map(i => <PodiumSkeleton key={i} />)}
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="p-8 text-center text-text-muted text-sm border border-border rounded-xl bg-bg">
                No operators on the board yet.
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4 items-end">
                {top3[1] ? (
                  <PodiumCard entry={top3[1]} rank={2} delay={0.1} />
                ) : (
                  <div className="rounded-xl border-2 border-border bg-bg/40 flex items-center justify-center p-6">
                    <span className="text-[9px] text-text-muted uppercase tracking-widest">#2 — TBD</span>
                  </div>
                )}
                {top3[0] ? (
                  <PodiumCard entry={top3[0]} rank={1} delay={0} />
                ) : (
                  <div className="rounded-xl border-2 border-accent/20 bg-accent-dim/20 flex items-center justify-center p-6">
                    <span className="text-[9px] text-accent uppercase tracking-widest">#1 — TBD</span>
                  </div>
                )}
                {top3[2] ? (
                  <PodiumCard entry={top3[2]} rank={3} delay={0.2} />
                ) : (
                  <div className="rounded-xl border-2 border-border bg-bg/40 flex items-center justify-center p-6">
                    <span className="text-[9px] text-text-muted uppercase tracking-widest">#3 — TBD</span>
                  </div>
                )}
              </div>
            )}
          </div>
          {rest.length > 0 && !loading && (
            <div className="flex flex-col gap-4 w-64 xl:w-72 flex-none">
              <div className="text-[9px] font-black uppercase tracking-[0.25em] text-text-muted px-1">
                Rising Operators
              </div>
              {rest.map((u, idx) => (
                <CompactRow key={u.handle || idx} entry={u} rank={idx + 4} delay={0.3 + idx * 0.08} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardSection;
