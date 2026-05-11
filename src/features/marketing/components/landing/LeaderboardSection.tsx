import React from 'react';
import { ArrowRight, Crown, Medal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
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

// ── Avatar helper ────────────────────────────────────────────────────────────
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

// ── Rank metadata ────────────────────────────────────────────────────────────
const getRankMeta = (rank: number) => {
  if (rank === 1) return {
    accent: 'var(--color-accent)',
    border: 'border-accent/40',
    bg: 'bg-accent-dim',
    color: 'text-accent',
    avatarColor: '#B7FF99',
    avatarBorder: 'border-accent/40',
    label: '#1',
    icon: <Crown className="w-3.5 h-3.5" />,
  };
  if (rank === 2) return {
    accent: '#60a5fa',
    border: 'border-blue-400/25',
    bg: 'bg-blue-400/5',
    color: 'text-blue-400',
    avatarColor: '#60a5fa',
    avatarBorder: 'border-blue-400/30',
    label: '#2',
    icon: <Medal className="w-3.5 h-3.5" style={{ color: '#60a5fa' }} />,
  };
  if (rank === 3) return {
    accent: '#fbbf24',
    border: 'border-amber-400/25',
    bg: 'bg-amber-400/5',
    color: 'text-amber-400',
    avatarColor: '#fbbf24',
    avatarBorder: 'border-amber-400/30',
    label: '#3',
    icon: <Medal className="w-3.5 h-3.5" style={{ color: '#fbbf24' }} />,
  };
  return null;
};

// ── Podium card — top 3 ──────────────────────────────────────────────────────
const PodiumCard: React.FC<{ entry: LeaderboardEntry; rank: 1 | 2 | 3; delay: number }> = ({
  entry, rank, delay,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const handle = entry.handle || entry.name || 'Anonymous';
  const meta = getRankMeta(rank)!;

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 28, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1], filter: { duration: 0.35 } }}
      className={`flex flex-col items-center text-center rounded-xl border-2 ${meta.border} ${meta.bg} p-4 lg:p-5
                  ${rank === 1 ? 'md:scale-[1.02] md:-translate-y-1' : ''}
                  transition-transform duration-300 hover:brightness-110`}
      style={{ boxShadow: rank === 1 ? `0 0 32px rgba(183,255,153,0.12)` : 'var(--card-shimmer)' }}
    >
      {/* Rank badge */}
      <div className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.2em] mb-3 ${meta.color}`}>
        {meta.icon}
        {meta.label}
      </div>

      {/* Avatar */}
      <Avatar entry={entry} size="md" colorHex={meta.avatarColor} borderClass={meta.avatarBorder} />

      {/* Handle */}
      <div className={`mt-2.5 font-mono text-sm font-bold truncate w-full ${meta.color}`}>{handle}</div>
      <div className="text-[9px] uppercase tracking-widest text-text-muted mt-0.5 mb-2.5">
        {entry.rank || 'Operator'}
      </div>

      {/* Score */}
      <div
        className={`font-mono font-black text-base inline-flex items-center gap-1.5 ${meta.color}`}
      >
        {Number(entry.totalXp || 0).toLocaleString()}
        <CpLogo className="w-3.5 h-3.5" />
      </div>
    </motion.div>
  );
};

// ── Compact desktop row — ranks 4-5 ─────────────────────────────────────────
const CompactRow: React.FC<{ entry: LeaderboardEntry; rank: number; delay: number }> = ({
  entry, rank, delay,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const handle = entry.handle || entry.name || 'Anonymous';

  return (
    <motion.div
      initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -16, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1], filter: { duration: 0.25 } }}
      className="flex items-center gap-4 rounded-xl border border-border bg-bg-card px-4 py-3.5
                 hover:border-accent/25 transition-colors duration-200"
      style={{ boxShadow: 'var(--card-shimmer)' }}
    >
      <span className="font-mono text-sm font-black text-accent/40 w-6 flex-none">#{rank}</span>
      <Avatar entry={entry} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="font-mono text-xs font-medium text-text-primary truncate">{handle}</div>
        <div className="text-[9px] uppercase tracking-widest text-text-muted mt-0.5">{entry.rank || 'Operator'}</div>
      </div>
      <div className="font-mono text-xs font-bold text-accent/80 flex-none inline-flex items-center gap-1.5">
        {Number(entry.totalXp || 0).toLocaleString()} <CpLogo className="w-3 h-3" />
      </div>
    </motion.div>
  );
};

// ── Mobile row ────────────────────────────────────────────────────────────────
const MobileRow: React.FC<{ entry: LeaderboardEntry; rank: number; delay: number }> = ({
  entry, rank, delay,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const handle = entry.handle || entry.name || 'Anonymous';
  const meta = getRankMeta(rank);

  return (
    <motion.div
      initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`rounded-xl border p-3.5 flex items-center gap-3.5 transition-colors ${
        meta ? `${meta.border} ${meta.bg}` : 'border-border bg-bg-card'
      }`}
      style={{ boxShadow: 'var(--card-shimmer)' }}
    >
      <div className={`font-mono font-black text-sm w-8 flex-none flex items-center gap-1 ${meta ? meta.color : 'text-accent/50'}`}>
        {meta ? meta.icon : null}
        #{rank}
      </div>
      <Avatar
        entry={entry}
        size="sm"
        colorHex={meta ? meta.avatarColor : '#88AD7C'}
        borderClass={meta ? meta.avatarBorder : 'border-border'}
      />
      <div className="min-w-0 flex-1">
        <div className={`font-mono text-sm font-medium truncate ${meta ? meta.color : 'text-text-primary'}`}>
          {handle}
        </div>
        <div className="text-[9px] uppercase tracking-widest text-text-muted mt-0.5">{entry.rank || 'Operator'}</div>
      </div>
      <div className={`font-mono font-bold text-sm flex-none inline-flex items-center gap-1 ${meta ? meta.color : 'text-accent/70'}`}>
        {Number(entry.totalXp || 0).toLocaleString()} <CpLogo className="w-3.5 h-3.5" />
      </div>
    </motion.div>
  );
};

// ── Skeleton ──────────────────────────────────────────────────────────────────
const PodiumSkeleton = () => (
  <div className="rounded-xl border-2 border-border bg-bg-card p-4 animate-pulse flex flex-col items-center gap-3">
    <div className="w-10 h-3 bg-accent-dim/30 rounded" />
    <div className="w-11 h-11 rounded-full bg-accent-dim/30" />
    <div className="h-3 bg-accent-dim/30 rounded w-2/3" />
    <div className="h-2 bg-accent-dim/20 rounded w-1/3" />
    <div className="h-4 bg-accent-dim/25 rounded w-1/2" />
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────
const LeaderboardSection: React.FC<LeaderboardSectionProps> = ({ leaderboard, totalCp, loading = false }) => {
  const top3 = leaderboard.slice(0, 3) as LeaderboardEntry[];
  const rest  = leaderboard.slice(3, 5);

  return (
    <section className="
      py-20 bg-bg-card border-y border-border relative has-bg-image
      md:h-full md:overflow-hidden md:py-0 md:flex md:items-center
    ">
      <img
        src="/assets/sections/backgrounds/offsec-grid-background.webp"
        alt=""
        aria-hidden="true"
        className="section-bg-img absolute inset-0 w-full h-full object-cover opacity-[0.10] pointer-events-none"
        loading="lazy"
        decoding="async"
      />
      <div className="section-bg-overlay light-theme-hide-bg-overlay absolute inset-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 w-full">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 md:mb-12 gap-4">
          <ScrollReveal>
            <span className="block text-[10px] font-black uppercase tracking-[0.35em] text-accent mb-2">
              // The Board
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-text-primary leading-none tracking-tight">
              Top Operators
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.1} className="flex items-center gap-6">
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
              className="text-[10px] font-black text-accent hover:underline underline-offset-2 uppercase tracking-[0.2em] inline-flex items-center gap-1.5 group"
            >
              Full Board <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </ScrollReveal>
        </div>

        {/* ── MOBILE: stacked rows ── */}
        <div className="md:hidden space-y-2.5">
          {loading ? (
            [0,1,2,3,4].map(i => (
              <div key={i} className="rounded-xl border border-border bg-bg-card p-3.5 flex items-center gap-3 animate-pulse">
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
            <div className="p-6 text-center text-text-muted text-sm border border-border rounded-xl bg-bg">
              No operators on the board yet.
            </div>
          ) : (
            leaderboard.slice(0, 5).map((u, idx) => (
              <MobileRow key={u.handle || idx} entry={u} rank={idx + 1} delay={idx * 0.06} />
            ))
          )}
        </div>

        {/* ── DESKTOP: podium + compact rows ── */}
        <div className="hidden md:flex gap-5 items-start">

          {/* ── LEFT: podium columns (2-1-3 order, 1 is centre+elevated) ── */}
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
                {/* Rank 2 */}
                {top3[1] ? (
                  <PodiumCard entry={top3[1]} rank={2} delay={0.1} />
                ) : (
                  <div className="rounded-xl border-2 border-border bg-bg/40 flex items-center justify-center p-6">
                    <span className="text-[9px] text-text-muted uppercase tracking-widest">#2 — TBD</span>
                  </div>
                )}
                {/* Rank 1 — centre */}
                {top3[0] ? (
                  <PodiumCard entry={top3[0]} rank={1} delay={0} />
                ) : (
                  <div className="rounded-xl border-2 border-accent/20 bg-accent-dim/20 flex items-center justify-center p-6">
                    <span className="text-[9px] text-accent uppercase tracking-widest">#1 — TBD</span>
                  </div>
                )}
                {/* Rank 3 */}
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

          {/* ── RIGHT: ranks 4-5 vertical stack ── */}
          {rest.length > 0 && !loading && (
            <div className="flex flex-col gap-3 w-64 xl:w-72 flex-none">
              {/* Label */}
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
    </section>
  );
};

export default LeaderboardSection;