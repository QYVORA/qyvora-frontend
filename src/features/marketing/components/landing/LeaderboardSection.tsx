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

// ── Podium card — top 3 on desktop ───────────────────────────────────────────
const PodiumCard: React.FC<{
  entry: LeaderboardEntry;
  rank: 1 | 2 | 3;
  delay: number;
}> = ({ entry, rank, delay }) => {
  const shouldReduceMotion = useReducedMotion();
  const handle = entry.handle || entry.name || 'Anonymous';

  const rankMeta = {
    1: { label: 'text-accent', border: 'border-accent/50', bg: 'bg-accent-dim', crown: true,  size: 'md:scale-[1.06]', medal: '#B7FF99' },
    2: { label: 'text-blue-400', border: 'border-blue-400/30', bg: 'bg-blue-400/5', crown: false, size: '',              medal: '#60a5fa' },
    3: { label: 'text-amber-400', border: 'border-amber-400/30', bg: 'bg-amber-400/5', crown: false, size: '',           medal: '#fbbf24' },
  }[rank];

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 32, scale: 0.92, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1], filter: { duration: 0.4 } }}
      className={`flex flex-col items-center rounded-xl border-2 p-4 md:p-3 lg:p-4 text-center ${rankMeta.border} ${rankMeta.bg} ${rankMeta.size} transition-transform`}
    >
      {/* Rank badge */}
      <div className={`text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-1 ${rankMeta.label}`}>
        {rankMeta.crown
          ? <Crown className="w-3.5 h-3.5" />
          : <Medal className="w-3.5 h-3.5" style={{ color: rankMeta.medal }} />
        }
        #{rank}
      </div>

      {/* Avatar */}
      {entry.avatarUrl ? (
        <img
          src={resolveImg(entry.avatarUrl)}
          alt=""
          className={`w-14 h-14 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full border-2 mb-2 object-cover ${rankMeta.border}`}
        />
      ) : (
        <div className={`w-14 h-14 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full border-2 flex items-center justify-center mb-2 text-bg text-lg font-black ${rankMeta.border}`}
          style={{ background: rankMeta.medal }}>
          {handle[0]?.toUpperCase()}
        </div>
      )}

      {/* Handle */}
      <div className={`font-mono text-sm md:text-xs lg:text-sm font-bold truncate w-full ${rankMeta.label}`}>
        {handle}
      </div>
      <div className="text-[9px] uppercase tracking-widest text-text-muted mb-2">{entry.rank || 'Operator'}</div>

      {/* Score */}
      <div className={`font-mono font-black text-base md:text-sm lg:text-base ${rankMeta.label} inline-flex items-center gap-1`}>
        {Number(entry.totalXp || 0).toLocaleString()}
        <CpLogo className="w-3.5 h-3.5" />
      </div>
    </motion.div>
  );
};

// ── Compact row — ranks 4–5 on desktop ───────────────────────────────────────
const CompactRow: React.FC<{ entry: LeaderboardEntry; rank: number; delay: number }> = ({ entry, rank, delay }) => {
  const shouldReduceMotion = useReducedMotion();
  const handle = entry.handle || entry.name || 'Anonymous';

  return (
    <motion.div
      initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -16, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1], filter: { duration: 0.3 } }}
      className="flex items-center gap-3 rounded-lg border border-border bg-bg px-3 py-2 hover:border-accent/30 transition-colors"
    >
      <span className="text-sm font-bold font-mono text-accent/60 w-6 flex-none">#{rank}</span>
      {entry.avatarUrl ? (
        <img src={resolveImg(entry.avatarUrl)} alt="" className="w-7 h-7 rounded-full border border-border flex-none object-cover" />
      ) : (
        <div className="w-7 h-7 rounded-full bg-accent/80 border border-accent/30 flex items-center justify-center flex-none text-bg text-xs font-bold">
          {handle[0]?.toUpperCase()}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="font-mono text-xs font-medium text-text-primary truncate">{handle}</div>
        <div className="text-[9px] uppercase tracking-widest text-text-muted">{entry.rank || 'Operator'}</div>
      </div>
      <div className="font-mono text-xs font-bold text-accent/80 flex-none inline-flex items-center gap-1">
        {Number(entry.totalXp || 0).toLocaleString()} <CpLogo className="w-3 h-3" />
      </div>
    </motion.div>
  );
};

// ── Mobile row — simple stacked list ─────────────────────────────────────────
const MobileRow: React.FC<{ entry: LeaderboardEntry; rank: number; delay: number }> = ({ entry, rank, delay }) => {
  const shouldReduceMotion = useReducedMotion();
  const handle = entry.handle || entry.name || 'Anonymous';
  const isFirst = rank === 1;

  return (
    <motion.div
      initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -24, scale: 0.97, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1], filter: { duration: 0.35 } }}
      className={`rounded-lg border p-3 flex items-center gap-3 transition-colors ${
        isFirst ? 'border-accent/40 bg-accent-dim' : 'border-border bg-bg'
      }`}
    >
      <div className={`text-xl font-bold font-mono w-10 flex-none flex items-center gap-1 ${isFirst ? 'text-accent' : 'text-accent/60'}`}>
        {isFirst && <Crown className="w-4 h-4 shrink-0" />}
        #{rank}
      </div>
      {entry.avatarUrl ? (
        <img src={resolveImg(entry.avatarUrl)} alt="" className={`w-9 h-9 rounded-full border flex-none ${isFirst ? 'border-accent/40' : 'border-border'}`} />
      ) : (
        <div className={`w-9 h-9 rounded-full border flex items-center justify-center flex-none text-bg text-xs font-bold ${isFirst ? 'bg-accent border-accent/40' : 'bg-accent/80 border-accent/30'}`}>
          {handle[0]?.toUpperCase()}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className={`font-mono text-sm font-medium truncate ${isFirst ? 'text-accent' : 'text-text-primary'}`}>{handle}</div>
        <div className="text-[10px] uppercase tracking-widest text-text-muted">{entry.rank || 'Operator'}</div>
      </div>
      <div className="text-right flex-none">
        <div className={`font-mono font-bold text-sm ${isFirst ? 'text-accent' : 'text-accent/80'}`}>{Number(entry.totalXp || 0).toLocaleString()}</div>
        <div className="text-[10px] uppercase tracking-widest text-text-muted inline-flex items-center justify-end"><CpLogo className="w-3.5 h-3.5" /></div>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
const LeaderboardSection: React.FC<LeaderboardSectionProps> = ({ leaderboard, totalCp, loading = false }) => {
  const top3 = leaderboard.slice(0, 3) as LeaderboardEntry[];
  const rest = leaderboard.slice(3, 5);

  return (
    <section className="
      py-20 bg-bg-card border-y border-border relative has-bg-image
      md:h-full md:overflow-hidden md:py-0 md:flex md:items-center
    ">
      <img
        src="/assets/sections/backgrounds/offsec-grid-background.webp"
        alt=""
        aria-hidden="true"
        className="section-bg-img absolute inset-0 w-full h-full object-cover opacity-[0.10] md:opacity-[0.13] pointer-events-none"
        loading="lazy"
        decoding="async"
      />
      <div className="section-bg-overlay light-theme-hide-bg-overlay absolute inset-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 md:mb-6 gap-3">
          <ScrollReveal>
            <span className="text-accent text-[11px] font-bold uppercase tracking-[0.3em] mb-1 block">// THE BOARD</span>
            <h2 className="text-3xl lg:text-4xl text-text-primary font-bold">Top Operators</h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1} className="flex items-center gap-6">
            <div className="text-left md:text-right">
              <div className="text-2xl lg:text-3xl font-bold text-accent font-mono inline-flex items-center gap-1.5">
                <StatCounter end={totalCp} />
                <CpLogo className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="text-[9px] uppercase tracking-widest text-text-muted">Total Community Points</div>
            </div>
            <Link
              to="/leaderboard"
              className="text-xs font-bold text-accent hover:underline uppercase tracking-widest flex items-center gap-1.5 group"
            >
              Full Board <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </ScrollReveal>
        </div>

        {/* ── MOBILE: simple stacked rows ── */}
        <div className="md:hidden space-y-2.5">
          {loading ? (
            [0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-lg border border-border bg-bg p-3 flex items-center gap-3 animate-pulse">
                <div className="w-10 h-7 bg-accent-dim/30 rounded flex-none" />
                <div className="w-9 h-9 rounded-full bg-accent-dim/30 flex-none" />
                <div className="flex-1 space-y-2"><div className="h-3 bg-accent-dim/30 rounded w-1/3" /><div className="h-2 bg-accent-dim/20 rounded w-1/4" /></div>
                <div className="w-14 h-5 bg-accent-dim/20 rounded flex-none" />
              </div>
            ))
          ) : leaderboard.length === 0 ? (
            <div className="p-6 text-center text-text-muted text-sm border border-border rounded-lg bg-bg">No operators on the board yet.</div>
          ) : (
            leaderboard.slice(0, 5).map((u, idx) => (
              <MobileRow key={u.handle || idx} entry={u} rank={idx + 1} delay={idx * 0.07} />
            ))
          )}
        </div>

        {/* ── DESKTOP: podium + compact rows ── */}
        <div className="hidden md:block">
          {loading ? (
            <div className="grid grid-cols-3 gap-3 mb-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-xl border-2 border-border bg-bg p-4 animate-pulse flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-accent-dim/30" />
                  <div className="h-3 bg-accent-dim/30 rounded w-2/3" />
                  <div className="h-4 bg-accent-dim/20 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="p-8 text-center text-text-muted text-sm border border-border rounded-xl bg-bg">No operators on the board yet.</div>
          ) : (
            <>
              {/* Podium — top 3 */}
              <div className="grid grid-cols-3 gap-3 mb-3">
                {/* Rank 2 */}
                {top3[1] ? (
                  <PodiumCard entry={top3[1]} rank={2} delay={0.1} />
                ) : (
                  <div className="rounded-xl border-2 border-border bg-bg/40 flex items-center justify-center p-4">
                    <span className="text-[10px] text-text-muted uppercase tracking-widest">#2 — TBD</span>
                  </div>
                )}
                {/* Rank 1 — center, slightly elevated */}
                {top3[0] ? (
                  <PodiumCard entry={top3[0]} rank={1} delay={0} />
                ) : (
                  <div className="rounded-xl border-2 border-accent/20 bg-accent-dim/20 flex items-center justify-center p-4">
                    <span className="text-[10px] text-accent uppercase tracking-widest">#1 — TBD</span>
                  </div>
                )}
                {/* Rank 3 */}
                {top3[2] ? (
                  <PodiumCard entry={top3[2]} rank={3} delay={0.2} />
                ) : (
                  <div className="rounded-xl border-2 border-border bg-bg/40 flex items-center justify-center p-4">
                    <span className="text-[10px] text-text-muted uppercase tracking-widest">#3 — TBD</span>
                  </div>
                )}
              </div>

              {/* Ranks 4–5 compact rows */}
              {rest.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {rest.map((u, idx) => (
                    <CompactRow key={u.handle || idx} entry={u} rank={idx + 4} delay={0.3 + idx * 0.08} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </section>
  );
};

export default LeaderboardSection;
