import React, { useEffect, useState } from 'react';
import { Trophy, ChevronRight, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import api from '../../../core/services/api';

const resolveImg = (value?: string, fallback = '') => {
  const src = String(value || '').trim();
  if (!src) return fallback;
  if (/^https?:\/\//i.test(src)) return src;
  const apiBase = String(import.meta.env.VITE_API_BASE_URL || '').trim();

  if (src.startsWith('/uploads/')) {
    if (/^https?:\/\//i.test(apiBase)) {
      const origin = apiBase.replace(/\/api\/?$/, '');
      return `${origin}${src}`;
    }
    if (apiBase.startsWith('/api')) {
      return `/api${src}`;
    }
  }

  const base = apiBase.replace(/\/api\/?$/, '');
  return `${base}${src.startsWith('/') ? '' : '/'}${src}`;
};

const Leaderboard: React.FC = () => {
  const navigate = useNavigate();
  const [operators, setOperators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let mounted = true;
    api.get('/public/leaderboard?limit=50')
      .then((res) => { if (mounted) setOperators(Array.isArray(res.data?.leaderboard) ? res.data.leaderboard : []); })
      .catch(() => { if (mounted) setOperators([]); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const filtered = operators.filter((op) =>
    !query || (op.handle || op.name || '').toLowerCase().includes(query.toLowerCase())
  );

  const top3 = filtered.slice(0, 3);
  const rest = filtered.slice(3);
  const podiumColors = ['#FFD700', '#C0C0C0', '#CD7F32'];

  return (
    <div className="min-h-screen bg-bg pb-8 scanlines">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8">
        <ScrollReveal className="text-center mb-12">
          <span className="text-accent text-xs font-bold uppercase tracking-[0.3em] mb-4 block">// HALL_OF_SHADOWS</span>
          <h1 className="text-5xl md:text-6xl font-black text-text-primary tracking-tighter uppercase mb-4">Leaderboard</h1>
          <p className="text-text-muted max-w-xl mx-auto">The elite operators of HSOCIETY, ranked by CP earned.</p>
        </ScrollReveal>

        {loading ? (
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
            {top3.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {top3.map((op, i) => {
                  const handle = op.handle || op.name || 'Anonymous';
                  return (
                    <ScrollReveal key={op.id || i} delay={i * 0.1}>
                      <div className={`relative p-8 bg-bg-card border-2 rounded-2xl text-center group transition-all ${
                        i === 0 ? 'border-accent md:-translate-y-4' : 'border-border'
                      }`}>
                        {i === 0 && (
                          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-bg px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                            #1 OPERATOR
                          </div>
                        )}
                        {op.avatarUrl ? (
                          <img src={resolveImg(op.avatarUrl)} alt="" className="w-16 h-16 rounded-2xl mx-auto mb-4 border border-border object-cover" />
                        ) : (
                          <div className="w-16 h-16 mx-auto rounded-2xl bg-accent-dim border border-accent/20 flex items-center justify-center text-accent text-2xl font-black mb-4">
                            {handle[0]?.toUpperCase()}
                          </div>
                        )}
                        <h3 className="text-lg font-bold text-text-primary mb-1 uppercase font-mono">{handle}</h3>
                        <div className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: podiumColors[i] }}>
                          {op.rank || 'Operator'}
                        </div>
                        <div className="text-2xl font-black font-mono" style={{ color: podiumColors[i] }}>
                          {Number(op.totalXp || 0).toLocaleString()} CP
                        </div>
                        <Link to={`/profile/${handle}`}
                          className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 bg-bg border border-border hover:border-accent/40 rounded transition-all text-[10px] font-bold text-text-primary uppercase">
                          View Profile <ChevronRight className="w-3 h-3 text-accent" />
                        </Link>
                      </div>
                    </ScrollReveal>
                  );
                })}
              </div>
            )}

            {/* TABLE */}
            <ScrollReveal delay={0.2}>
              <div className="card-hsociety overflow-hidden">
                <div className="p-5 border-b border-border bg-accent-dim/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                    <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search operator..."
                      className="w-full bg-bg border border-border rounded-lg py-2 pl-10 pr-4 text-sm text-text-primary focus:border-accent outline-none transition-colors" />
                  </div>
                  <span className="text-[10px] font-bold text-accent uppercase tracking-widest">{operators.length} OPERATORS RANKED</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-bg border-b border-border text-[9px] font-bold text-text-muted uppercase tracking-widest">
                      <tr>
                        <th className="px-6 py-4"># Rank</th>
                        <th className="px-6 py-4">Operator</th>
                        <th className="px-6 py-4">Tier</th>
                        <th className="px-6 py-4 text-right">CP Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50 font-mono">
                      {(rest.length > 0 ? rest : filtered.slice(top3.length)).map((op, i) => {
                        const handle = op.handle || op.name || 'Anonymous';
                        const rank = i + 4;
                        return (
                          <tr key={op.id || i}
                            className="group hover:bg-accent-dim/5 transition-colors cursor-pointer"
                            onClick={() => navigate(`/profile/${handle}`)}>
                            <td className="px-6 py-4">
                              <span className="text-sm font-black text-text-muted">{String(rank).padStart(2, '0')}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {op.avatarUrl ? (
                                  <img src={resolveImg(op.avatarUrl)} alt="" className="w-8 h-8 rounded border border-border object-cover flex-none" />
                                ) : (
                                  <div className="w-8 h-8 rounded bg-bg border border-border flex items-center justify-center text-text-primary group-hover:border-accent/50 group-hover:text-accent transition-colors flex-none">
                                    {handle[0]?.toUpperCase()}
                                  </div>
                                )}
                                <span className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors uppercase">{handle}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase">{op.rank || 'Operator'}</td>
                            <td className="px-6 py-4 text-right text-sm font-black text-accent">
                              <span>{Number(op.totalXp || 0).toLocaleString()}</span>
                            </td>
                          </tr>
                        );
                      })}
                      {filtered.length === 0 && (
                        <tr><td colSpan={4} className="px-6 py-10 text-center text-text-muted text-sm">No operators match your search.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </ScrollReveal>
          </>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
