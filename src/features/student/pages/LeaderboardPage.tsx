import React, { useEffect, useState, useMemo } from 'react';
import { Trophy, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import api from '../../../core/services/api';
import CpLogo from '../../../shared/components/CpLogo';
import { resolveImg } from '../../../shared/utils/resolveImg';

const CACHE_KEY = 'hsociety_leaderboard_cache_v2';
const PAGE_SIZE = 15;
const podiumColors = ['#FFD700', '#C0C0C0', '#CD7F32'];

const Leaderboard: React.FC = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
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

  const top3      = filtered.slice(0, 3);
  const rest      = filtered.slice(3);
  const totalPages = Math.max(1, Math.ceil(rest.length / PAGE_SIZE));
  const pagedRest  = rest.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-bg pb-12">
      <div className="mx-auto max-w-7xl px-4 pt-8 md:px-8 md:pt-10">

        <ScrollReveal className="mb-10 md:mb-12">
          <span className="mb-3 block text-xs font-black uppercase tracking-[0.35em] text-accent md:text-sm">Hall of shadows</span>
          <h1 className="text-4xl font-black text-text-primary md:text-6xl">Leaderboard</h1>
          <p className="mt-2 max-w-lg text-base text-text-muted">Elite operators ranked by CP — chase the podium.</p>
        </ScrollReveal>

        {loading && operators.length === 0 ? (
          <div className="space-y-3">
            {[0,1,2,3,4].map((i) => (
              <div key={i} className="h-16 bg-bg-card border border-border rounded-lg animate-pulse" />
            ))}
          </div>
        ) : operators.length === 0 ? (
          <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-border py-20 text-center">
            <Trophy className="w-10 h-10 text-text-muted mx-auto mb-4 opacity-40" />
            <p className="text-text-muted text-sm">No operators on the board yet.</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

            {/* ── LEFT COLUMN — podium ── */}
            <div className="w-full lg:w-72 xl:w-80 flex-none space-y-4">

              {/* Stats pill */}
              <ScrollReveal>
                <div className="relative overflow-hidden rounded-3xl border-2 border-accent/25 bg-accent-dim p-6">
                  <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-accent/20 blur-3xl" aria-hidden />
                  <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-1">Operators</p>
                    <div className="text-5xl font-black text-accent font-mono mb-2">
                      {loading ? '—' : operators.length}
                    </div>
                    <p className="text-xs text-text-secondary">ranked on the board</p>
                  </div>
                </div>
              </ScrollReveal>

              {/* Top 3 podium cards */}
              {top3.length > 0 && !query && (
                <div className="space-y-3">
                  {top3.map((op, i) => {
                    const handle = op.handle || op.name || 'Anonymous';
                    return (
                      <motion.div
                        key={op.handle || i}
                        initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div
                          className={`relative p-4 bg-bg-card border-2 rounded-2xl cursor-pointer transition-all hover:-translate-y-0.5 ${
                            i === 0 ? 'border-accent' : 'border-border hover:border-accent/30'
                          }`}
                          onClick={() => navigate(`/u/${handle}`)}
                        >
                          <div className="flex items-center gap-3">
                            {op.avatarUrl ? (
                              <img src={resolveImg(op.avatarUrl)} alt="" className="w-10 h-10 rounded-xl border border-border object-cover flex-none" />
                            ) : (
                              <div className="w-10 h-10 rounded-xl bg-accent-dim border border-accent/20 flex items-center justify-center text-accent text-sm font-black flex-none">
                                {handle[0]?.toUpperCase()}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-black" style={{ color: podiumColors[i] }}>#{i + 1}</span>
                                <span className="text-sm font-bold text-text-primary uppercase font-mono truncate">{handle}</span>
                              </div>
                              <div className="text-xs font-mono font-bold inline-flex items-center gap-1 mt-0.5" style={{ color: podiumColors[i] }}>
                                {Number(op.totalXp || 0).toLocaleString()} <CpLogo className="w-3 h-3" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

            </div>{/* end left */}

            {/* ── RIGHT COLUMN — full table ── */}
            <div className="w-full flex-1 min-w-0">
              <ScrollReveal>
                <div className="card-hsociety overflow-hidden">
                  <div className="p-4 border-b border-border bg-accent-dim/5 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                      <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search operator..."
                        className="w-full bg-bg border border-border rounded-lg py-2 pl-10 pr-4 text-sm text-text-primary focus:border-accent outline-none transition-colors"
                      />
                    </div>
                    <span className="text-[10px] font-bold text-accent uppercase tracking-widest shrink-0">
                      {filtered.length} OPERATORS
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-bg border-b border-border text-[9px] font-bold text-text-muted uppercase tracking-widest">
                        <tr>
                          <th className="px-5 py-3"># Rank</th>
                          <th className="px-5 py-3">Operator</th>
                          <th className="px-5 py-3 hidden sm:table-cell">Tier</th>
                          <th className="px-5 py-3 text-right">Points</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50 font-mono">
                        {pagedRest.length === 0 && filtered.length <= 3 && !query ? (
                          <tr><td colSpan={4} className="px-5 py-8 text-center text-text-muted text-sm">Top 3 shown on the left.</td></tr>
                        ) : pagedRest.length === 0 ? (
                          <tr><td colSpan={4} className="px-5 py-8 text-center text-text-muted text-sm">No operators match your search.</td></tr>
                        ) : (
                          pagedRest.map((op, i) => {
                            const handle = op.handle || op.name || 'Anonymous';
                            const globalRank = (query ? filtered.indexOf(op) : 3 + (page - 1) * PAGE_SIZE + i) + 1;
                            return (
                              <motion.tr
                                key={op.handle || i}
                                initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.03, ease: [0.16, 1, 0.3, 1] }}
                                className="group hover:bg-accent-dim/5 transition-colors cursor-pointer"
                                onClick={() => navigate(`/u/${handle}`)}
                              >
                                <td className="px-5 py-3.5">
                                  <span className="text-sm font-black text-text-muted">{String(globalRank).padStart(2, '0')}</span>
                                </td>
                                <td className="px-5 py-3.5">
                                  <div className="flex items-center gap-3">
                                    {op.avatarUrl ? (
                                      <img src={resolveImg(op.avatarUrl)} alt="" className="w-8 h-8 rounded border border-border object-cover flex-none" />
                                    ) : (
                                      <div className="w-8 h-8 rounded bg-bg border border-border flex items-center justify-center text-text-primary group-hover:border-accent/50 group-hover:text-accent transition-colors flex-none text-xs font-bold">
                                        {handle[0]?.toUpperCase()}
                                      </div>
                                    )}
                                    <span className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors uppercase">{handle}</span>
                                  </div>
                                </td>
                                <td className="px-5 py-3.5 text-[10px] font-bold text-text-muted uppercase hidden sm:table-cell">{op.rank || 'Operator'}</td>
                                <td className="px-5 py-3.5 text-right text-sm font-black text-accent">
                                  <span className="inline-flex items-center gap-1.5 justify-end">
                                    {Number(op.totalXp || 0).toLocaleString()} <CpLogo className="w-3.5 h-3.5" />
                                  </span>
                                </td>
                              </motion.tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  {totalPages > 1 && (
                    <div className="p-4 border-t border-border flex items-center justify-between gap-3">
                      <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded border border-border text-xs font-bold text-text-primary hover:border-accent/50 hover:text-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                        <ChevronLeft className="w-4 h-4" /> Prev
                      </button>
                      <span className="text-xs text-text-muted font-mono">
                        Page <span className="text-text-primary font-bold">{page}</span> / {totalPages}
                      </span>
                      <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded border border-border text-xs font-bold text-text-primary hover:border-accent/50 hover:text-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                        Next <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            </div>{/* end right */}

          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
