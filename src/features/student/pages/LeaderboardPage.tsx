import React, { useEffect, useState, useMemo } from 'react';
import { Trophy, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import api from '../../../core/services/api';
import CpLogo from '../../../shared/components/CpLogo';

const CACHE_KEY = 'hsociety_leaderboard_cache_v1';
const PAGE_SIZE = 10;

const resolveImg = (value?: string, fallback = '') => {
  const src = String(value || '').trim();
  if (!src) return fallback;
  if (/^https?:\/\//i.test(src)) return src;
  const apiBase = String(import.meta.env.VITE_API_BASE_URL || '').trim();
  if (src.startsWith('/uploads/')) {
    if (/^https?:\/\//i.test(apiBase)) return `${apiBase.replace(/\/api\/?$/, '')}${src}`;
    if (apiBase.startsWith('/api')) return `/api${src}`;
  }
  return `${apiBase.replace(/\/api\/?$/, '')}${src.startsWith('/') ? '' : '/'}${src}`;
};

const podiumColors = ['#FFD700', '#C0C0C0', '#CD7F32'];

const Leaderboard: React.FC = () => {
  const navigate = useNavigate();
  const [operators, setOperators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    // Hydrate from cache immediately
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const cached = JSON.parse(raw);
        if (Array.isArray(cached)) setOperators(cached);
      }
    } catch { /* ignore */ }

    let mounted = true;
    api.get('/public/leaderboard?limit=200')
      .then((res) => {
        if (!mounted) return;
        const data = Array.isArray(res.data?.leaderboard) ? res.data.leaderboard : [];
        setOperators(data);
        try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch { /* ignore */ }
      })
      .catch(() => { if (mounted && operators.length === 0) setOperators([]); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() =>
    operators.filter((op) =>
      !query || (op.handle || op.name || '').toLowerCase().includes(query.toLowerCase())
    ), [operators, query]);

  // Reset page when search changes
  useEffect(() => { setPage(1); }, [query]);

  const top3 = filtered.slice(0, 3);
  const rest = filtered.slice(3);
  const totalPages = Math.max(1, Math.ceil(rest.length / PAGE_SIZE));
  const pagedRest = rest.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-bg pb-12 scanlines">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
        <ScrollReveal className="text-center mb-10">
          <span className="text-accent text-xs font-bold uppercase tracking-[0.3em] mb-4 block">// HALL_OF_SHADOWS</span>
          <h1 className="text-4xl md:text-5xl font-black text-text-primary tracking-tighter uppercase mb-3">Leaderboard</h1>
          <p className="text-text-muted max-w-xl mx-auto text-sm">The elite operators of HSOCIETY, ranked by points earned.</p>
        </ScrollReveal>

        {loading && operators.length === 0 ? (
          <div className="space-y-3">
            {[0,1,2,3,4].map((i) => (
              <div key={i} className="h-16 bg-bg-card border border-border rounded-lg animate-pulse" />
            ))}
          </div>
        ) : operators.length === 0 ? (
          <div className="py-20 text-center">
            <Trophy className="w-10 h-10 text-text-muted mx-auto mb-4 opacity-40" />
            <p className="text-text-muted text-sm">No operators on the board yet.</p>
          </div>
        ) : (
          <>
            {/* TOP 3 PODIUM */}
            {top3.length > 0 && !query && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                {top3.map((op, i) => {
                  const handle = op.handle || op.name || 'Anonymous';
                  return (
                    <ScrollReveal key={op.id || i} delay={i * 0.1}>
                      <div
                        className={`relative p-6 bg-bg-card border-2 rounded-2xl text-center cursor-pointer group transition-all hover:-translate-y-1 ${
                          i === 0 ? 'border-accent md:-translate-y-3' : 'border-border'
                        }`}
                        onClick={() => navigate(`/profile/${handle}`)}
                      >
                        {i === 0 && (
                          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-accent text-bg px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap">
                            #1 OPERATOR
                          </div>
                        )}
                        {op.avatarUrl ? (
                          <img src={resolveImg(op.avatarUrl)} alt="" className="w-14 h-14 rounded-xl mx-auto mb-3 border border-border object-cover" />
                        ) : (
                          <div className="w-14 h-14 mx-auto rounded-xl bg-accent-dim border border-accent/20 flex items-center justify-center text-accent text-xl font-black mb-3">
                            {handle[0]?.toUpperCase()}
                          </div>
                        )}
                        <div className="text-2xl font-black mb-1" style={{ color: podiumColors[i] }}>#{i + 1}</div>
                        <h3 className="text-sm font-bold text-text-primary mb-1 uppercase font-mono truncate">{handle}</h3>
                        <div className="text-[9px] font-bold uppercase tracking-widest mb-3" style={{ color: podiumColors[i] }}>
                          {op.rank || 'Operator'}
                        </div>
                        <div className="text-xl font-black font-mono inline-flex items-center gap-1.5" style={{ color: podiumColors[i] }}>
                          {Number(op.totalXp || 0).toLocaleString()} <CpLogo className="w-4 h-4" />
                        </div>
                      </div>
                    </ScrollReveal>
                  );
                })}
              </div>
            )}

            {/* SEARCH + TABLE */}
            <ScrollReveal delay={0.15}>
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
                  <span className="text-[10px] font-bold text-accent uppercase tracking-widest">{filtered.length} OPERATORS RANKED</span>
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
                        // All results shown in podium, no table rows needed
                        <tr><td colSpan={4} className="px-5 py-8 text-center text-text-muted text-sm">Top 3 shown above.</td></tr>
                      ) : pagedRest.length === 0 ? (
                        <tr><td colSpan={4} className="px-5 py-8 text-center text-text-muted text-sm">No operators match your search.</td></tr>
                      ) : (
                        pagedRest.map((op, i) => {
                          const handle = op.handle || op.name || 'Anonymous';
                          const globalRank = (query ? filtered.indexOf(op) : 3 + (page - 1) * PAGE_SIZE + i) + 1;
                          return (
                            <tr
                              key={op.id || i}
                              className="group hover:bg-accent-dim/5 transition-colors cursor-pointer"
                              onClick={() => navigate(`/profile/${handle}`)}
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
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="p-4 border-t border-border flex items-center justify-between gap-3">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded border border-border text-xs font-bold text-text-primary hover:border-accent/50 hover:text-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" /> Prev
                    </button>
                    <span className="text-xs text-text-muted font-mono">
                      Page <span className="text-text-primary font-bold">{page}</span> / {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded border border-border text-xs font-bold text-text-primary hover:border-accent/50 hover:text-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </ScrollReveal>
          </>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
