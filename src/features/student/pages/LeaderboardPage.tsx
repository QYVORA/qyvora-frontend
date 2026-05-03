import React, { useEffect, useState, useMemo } from 'react';
import { Trophy, ChevronLeft, ChevronRight, Search, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import api from '../../../core/services/api';
import CpLogo from '../../../shared/components/CpLogo';
import StatCounter from '../../../shared/components/ui/StatCounter';
import { resolveImg } from '../../../shared/utils/resolveImg';

const CACHE_KEY = 'hsociety_leaderboard_cache_v2';
const PAGE_SIZE = 20;

// ── Single row — matches the marketing LeaderboardSection design ─────────────
const LeaderboardRow: React.FC<{ entry: any; rank: number; delay: number; onClick: () => void }> = ({
  entry, rank, delay, onClick,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const handle = entry.handle || entry.name || 'Anonymous';
  const isFirst = rank === 1;

  return (
    <motion.div
      initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -24, scale: 0.97, filter: 'blur(4px)' }}
      animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      className={`rounded-lg border p-3 md:p-4 lg:p-5 flex items-center gap-3 md:gap-4 cursor-pointer transition-colors ${
        isFirst
          ? 'border-accent/40 bg-accent-dim hover:border-accent/60'
          : 'border-border bg-bg hover:border-accent/30'
      }`}
    >
      {/* Rank */}
      <div className={`text-xl md:text-2xl lg:text-3xl font-bold font-mono w-10 md:w-14 lg:w-16 flex-none flex items-center gap-1 ${
        isFirst ? 'text-accent' : 'text-accent/60'
      }`}>
        {isFirst && <Crown className="w-4 h-4 shrink-0" />}
        #{rank}
      </div>

      {/* Avatar */}
      {entry.avatarUrl ? (
        <img
          src={resolveImg(entry.avatarUrl)}
          alt=""
          className={`w-9 h-9 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-full border flex-none object-cover ${
            isFirst ? 'border-accent/40' : 'border-border'
          }`}
        />
      ) : (
        <div className={`w-9 h-9 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-full border flex items-center justify-center flex-none text-bg text-xs md:text-sm font-bold ${
          isFirst ? 'bg-accent border-accent/40' : 'bg-accent/80 border-accent/30'
        }`}>
          {handle[0]?.toUpperCase()}
        </div>
      )}

      {/* Name + rank */}
      <div className="min-w-0 flex-1">
        <div className={`font-mono text-sm md:text-base lg:text-lg font-medium truncate ${
          isFirst ? 'text-accent' : 'text-text-primary'
        }`}>
          {handle}
        </div>
        <div className="text-[10px] md:text-[11px] uppercase tracking-widest text-text-muted">
          {entry.rank || 'Operator'}
        </div>
      </div>

      {/* Score */}
      <div className="text-right flex-none">
        <div className={`font-mono font-bold text-sm md:text-base lg:text-lg ${isFirst ? 'text-accent' : 'text-accent/80'}`}>
          {Number(entry.totalXp || 0).toLocaleString()}
        </div>
        <div className="text-[10px] uppercase tracking-widest text-text-muted inline-flex items-center justify-end">
          <CpLogo className="w-3.5 h-3.5" />
        </div>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
const Leaderboard: React.FC = () => {
  const navigate = useNavigate();
  const [operators, setOperators] = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [query, setQuery]         = useState('');
  const [page, setPage]           = useState(1);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) { const c = JSON.parse(raw); if (Array.isArray(c)) setOperators(c); }
    } catch { /* ignore */ }

    let mounted = true;
    api.get('/public/leaderboard?limit=200')
      .then((res) => {
        if (!mounted) return;
        const data = Array.isArray(res.data?.leaderboard) ? res.data.leaderboard : [];
        setOperators(data);
        try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch { /* ignore */ }
      })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() =>
    operators.filter((op) => !query || (op.handle || op.name || '').toLowerCase().includes(query.toLowerCase())),
    [operators, query]
  );

  useEffect(() => { setPage(1); }, [query]);

  const totalCp    = operators.reduce((sum, op) => sum + Number(op.totalXp || 0), 0);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="bg-bg">
      <div
        className="lg:fixed lg:inset-x-0 lg:bottom-0 lg:top-24 lg:overflow-y-auto lg:overscroll-contain"
        style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent 0px, black 24px)', maskImage: 'linear-gradient(to bottom, transparent 0px, black 24px)' }}
      >
      <div className="mx-auto max-w-7xl px-4 pt-6 pb-16 md:px-8">

        {/* ── Header ── */}
        <ScrollReveal className="mb-10 md:mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="mb-3 block text-xs font-black uppercase tracking-[0.35em] text-accent md:text-sm">
                // THE BOARD
              </span>
              <h1 className="text-4xl font-black text-text-primary md:text-6xl">Top Operators</h1>
              <p className="mt-2 max-w-lg text-base text-text-muted">Elite operators ranked by CP — chase the podium.</p>
            </div>
            {!loading && operators.length > 0 && (
              <div className="text-left md:text-right shrink-0">
                <div className="text-3xl md:text-4xl font-bold text-accent font-mono inline-flex items-center gap-2">
                  <StatCounter end={totalCp} />
                  <CpLogo className="w-7 h-7 md:w-8 md:h-8" />
                </div>
                <div className="text-[10px] uppercase tracking-widest text-text-muted">Total Community Points Earned</div>
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* ── Search ── */}
        {!loading && operators.length > 0 && (
          <div className="mb-6 flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search operator..."
                className="w-full bg-bg border border-border rounded-lg py-2.5 pl-10 pr-4 text-sm text-text-primary focus:border-accent outline-none transition-colors"
              />
            </div>
            <span className="text-[10px] font-bold text-accent uppercase tracking-widest shrink-0">
              {filtered.length} operators
            </span>
          </div>
        )}

        {/* ── List ── */}
        {loading && operators.length === 0 ? (
          <div className="space-y-2.5 md:space-y-3">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="rounded-lg border border-border bg-bg p-3 md:p-4 flex items-center gap-3 animate-pulse">
                <div className="w-10 md:w-14 h-8 bg-accent-dim/30 rounded flex-none" />
                <div className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-accent-dim/30 flex-none" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-accent-dim/30 rounded w-1/3" />
                  <div className="h-2 bg-accent-dim/20 rounded w-1/4" />
                </div>
                <div className="w-16 h-6 bg-accent-dim/20 rounded flex-none" />
              </div>
            ))}
          </div>
        ) : operators.length === 0 ? (
          <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-border py-20 text-center">
            <Trophy className="w-10 h-10 text-text-muted mx-auto mb-4 opacity-40" />
            <p className="text-text-muted text-sm">No operators on the board yet.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-text-muted text-sm border border-border rounded-lg bg-bg">
            No operators match your search.
          </div>
        ) : (
          <div className="space-y-2.5 md:space-y-3">
            {paged.map((op, i) => {
              const globalRank = (page - 1) * PAGE_SIZE + i + 1;
              const handle = op.handle || op.name || 'Anonymous';
              return (
                <LeaderboardRow
                  key={op.handle || i}
                  entry={op}
                  rank={globalRank}
                  delay={Math.min(i * 0.04, 0.4)}
                  onClick={() => navigate(`/u/${handle}`)}
                />
              );
            })}
          </div>
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between gap-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-border text-sm font-bold text-text-primary hover:border-accent/50 hover:text-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
            <span className="text-xs text-text-muted font-mono">
              Page <span className="text-text-primary font-bold">{page}</span> / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-border text-sm font-bold text-text-primary hover:border-accent/50 hover:text-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
      </div>
    </div>
  );
};

export default Leaderboard;
