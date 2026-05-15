import React, { useEffect, useState, useMemo } from 'react';
import { Trophy, ChevronLeft, ChevronRight, Search, Crown, ArrowRight, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import api from '../../../core/services/api';
import CpLogo from '../../../shared/components/CpLogo';
import StatCounter from '../../../shared/components/ui/StatCounter';
import { resolveImg } from '../../../shared/utils/resolveImg';
import Footer from '../components/layout/Footer';
import BinaryStreamBackground from '../../../shared/components/BinaryStreamBackground';

const CACHE_KEY = 'hsociety_leaderboard_public_cache_v1';
const PAGE_SIZE = 20;

const Snap: React.FC<{ id: string; children: React.ReactNode; className?: string }> = ({
  id, children, className = '',
}) => {
  const shouldReduceMotion = useReducedMotion();
  return (
    <section
      id={id}
      className={`ascii-section md:snap-start md:h-full md:flex-shrink-0 md:overflow-hidden flex flex-col justify-center ${className}`}
    >
      <BinaryStreamBackground />
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 40, filter: 'blur(6px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], filter: { duration: 0.45 } }}
        className="w-full md:h-full md:overflow-y-auto md:overflow-x-hidden"
        style={{ scrollbarWidth: 'none' }}
      >
        {children}
      </motion.div>
    </section>
  );
};

const ScrollHint: React.FC<{ targetId: string; containerId: string }> = ({ targetId, containerId }) => (
  <motion.button
    onClick={() => {
      const container = document.getElementById(containerId);
      const target = document.getElementById(targetId);
      if (container && target) container.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
    }}
    aria-label="Scroll down"
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.6 }}
    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1.5 text-text-muted hover:text-accent transition-colors"
  >
    <span className="text-[10px] font-bold uppercase tracking-[0.25em]">Scroll</span>
    <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}>
      <ChevronDown className="w-6 h-6" />
    </motion.div>
  </motion.button>
);

const LeaderboardRow: React.FC<{ entry: any; rank: number; index: number; onClick: () => void }> = ({
  entry, rank, index, onClick,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const handle = entry.handle || entry.name || 'Anonymous';
  const isFirst = rank === 1;

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, x: index % 2 === 0 ? -40 : 40, scale: 0.96, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: false, amount: 0.1 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.5), ease: [0.16, 1, 0.3, 1], filter: { duration: 0.3 } }}
      whileHover={shouldReduceMotion ? {} : { x: 6, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`terminal-card flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors md:gap-4 md:p-4 ${
        isFirst ? 'border-border-strong bg-accent-dim hover:border-border-strong'
        : 'border-border bg-bg-card hover:border-border-strong'
      }`}
      style={{ boxShadow: 'var(--card-shimmer)' }}
    >
      <div className={`text-xl md:text-2xl font-bold font-mono w-10 md:w-14 flex-none flex items-center gap-1 ${isFirst ? 'text-accent' : 'text-accent/60'}`}>
        {isFirst && <Crown className="w-4 h-4 shrink-0" />}
        #{rank}
      </div>
      {entry.avatarUrl ? (
        <img src={resolveImg(entry.avatarUrl)} alt="" className={`w-9 h-9 md:w-10 md:h-10 rounded-full border flex-none object-cover ${isFirst ? 'border-accent/40' : 'border-border'}`} />
      ) : (
        <div className={`w-9 h-9 md:w-10 md:h-10 rounded-full border flex items-center justify-center flex-none text-bg text-xs font-bold ${isFirst ? 'bg-accent border-border-strong' : 'bg-accent border-border-strong'}`}>
          {handle[0]?.toUpperCase()}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className={`font-mono text-sm md:text-base font-medium truncate ${isFirst ? 'text-accent' : 'text-text-primary'}`}>{handle}</div>
        <div className="text-[10px] uppercase tracking-widest text-text-muted">{entry.rank || 'Operator'}</div>
      </div>
      <div className="text-right flex-none">
        <div className={`font-mono font-bold text-sm md:text-base ${isFirst ? 'text-accent' : 'text-accent/80'}`}>{Number(entry.totalXp || 0).toLocaleString()}</div>
        <div className="text-[10px] uppercase tracking-widest text-text-muted inline-flex items-center justify-end"><CpLogo className="w-3 h-3" /></div>
      </div>
    </motion.div>
  );
};

const PublicLeaderboardPage: React.FC = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const [operators, setOperators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

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

  const filtered = useMemo(
    () => operators.filter((op) => !query || (op.handle || op.name || '').toLowerCase().includes(query.toLowerCase())),
    [operators, query],
  );
  useEffect(() => { setPage(1); }, [query]);

  const totalCp = operators.reduce((sum, op) => sum + Number(op.totalXp || 0), 0);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div
      id="lb-scroll"
      className="w-full overflow-x-hidden md:h-full md:overflow-y-scroll md:snap-y md:snap-mandatory"
      style={{ scrollSnapType: undefined }}
    >

      {/* ── 1. Hero ── */}
      <section
        id="lb-hero"
        className="ascii-section md:snap-start md:h-full md:flex-shrink-0 relative flex items-center md:overflow-hidden scanlines bg-bg min-h-[85vh] md:min-h-0"
      >
        <BinaryStreamBackground />
        <div className="absolute inset-0 bg-bg z-0 light-theme-hide-bg-base" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-accent/5 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute inset-0 dot-grid hero-dot-grid opacity-20 z-0" />
        <div className="absolute inset-0 bg-radial-vignette opacity-70 z-10" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-20 w-full py-16">
          <motion.div
            initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="ascii-kicker mb-3 block md:text-sm">
              // THE BOARD
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-text-primary leading-tight mb-4">
              Hall of Shadows.{' '}
              <span className="text-accent">Top Operators.</span>
            </h1>
            <p className="text-text-secondary text-base md:text-lg leading-relaxed mb-8 max-w-lg">
              Elite operators ranked by Cyber Points. Complete bootcamps, solve CTFs, and climb the board.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="btn-primary flex items-center gap-2">
                <Trophy className="w-4 h-4" /> Join the Board
              </Link>
              <Link to="/bootcamps" className="btn-secondary flex items-center gap-2">
                View Bootcamps <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {!loading && operators.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-10"
            >
              <div className="terminal-card inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-bg-card border border-accent/20">
                <motion.div
                  animate={shouldReduceMotion ? {} : { scale: [1, 1.08, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <CpLogo className="w-6 h-6" />
                </motion.div>
                <div className="text-2xl font-bold text-accent font-mono"><StatCounter end={totalCp} /></div>
                <span className="text-[10px] uppercase tracking-widest text-text-muted">Total Community Points</span>
              </div>
            </motion.div>
          )}
        </div>

        <ScrollHint targetId="lb-list" containerId="lb-scroll" />
      </section>

      {/* ── 2. Leaderboard list ── */}
      <Snap id="lb-list" className="bg-bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-14">
        {/* ── List controls ── */}
        {!loading && operators.length > 0 && (
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative w-full sm:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
              <input
                type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Search operator..."
                className="w-full rounded-lg border border-border bg-bg py-2.5 pl-10 pr-4 text-sm text-text-primary outline-none transition-colors focus:border-border-strong"
              />
            </div>
            <span className="text-[10px] font-bold text-accent uppercase tracking-widest shrink-0">{filtered.length} operators</span>
          </div>
        )}

          {loading && operators.length === 0 ? (
            <div className="space-y-2">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="terminal-card rounded-lg border border-border bg-bg p-3 flex items-center gap-3 animate-pulse">
                  <div className="w-10 h-7 bg-accent-dim/30 rounded flex-none" />
                  <div className="w-9 h-9 rounded-full bg-accent-dim/30 flex-none" />
                  <div className="flex-1 space-y-2"><div className="h-3 bg-accent-dim/30 rounded w-1/3" /><div className="h-2 bg-accent-dim/20 rounded w-1/4" /></div>
                  <div className="w-14 h-5 bg-accent-dim/20 rounded flex-none" />
                </div>
              ))}
            </div>
          ) : operators.length === 0 ? (
            <div className="terminal-card py-16 text-center border border-dashed border-border rounded-lg">
              <Trophy className="w-10 h-10 text-text-muted mx-auto mb-4 opacity-40" />
              <p className="text-text-muted text-sm">No operators on the board yet.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="terminal-card py-12 text-center text-text-muted text-sm border border-border rounded-lg bg-bg">No operators match your search.</div>
          ) : (
            <div className="space-y-2">
              {paged.map((op, i) => {
                const globalRank = (page - 1) * PAGE_SIZE + i + 1;
                const handle = op.handle || op.name || 'Anonymous';
                return (
                  <LeaderboardRow
                    key={op.handle || i} entry={op} rank={globalRank} index={i}
                    onClick={() => navigate(`/u/${handle}`)}
                  />
                );
              })}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between gap-3">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-bold text-text-primary transition-colors hover:border-border-strong hover:text-accent disabled:cursor-not-allowed disabled:opacity-40">
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>
              <span className="text-xs text-text-muted font-mono">Page <span className="text-text-primary font-bold">{page}</span> / {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-bold text-text-primary transition-colors hover:border-border-strong hover:text-accent disabled:cursor-not-allowed disabled:opacity-40">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </Snap>

      {/* ── 3. CTA + Footer ── */}
      <Snap id="lb-cta" className="bg-bg">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-16">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.94, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="terminal-card relative overflow-hidden rounded-lg border border-border-strong bg-accent-dim p-8 text-center md:p-12"
          >
            <motion.div
              className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <span className="ascii-kicker mb-3 block">// Operator access</span>
            <h2 className="mb-3 text-3xl font-black text-text-primary md:text-4xl">Earn CP. Climb the board.</h2>
            <p className="mx-auto mb-8 max-w-md text-base text-text-muted">
              Complete bootcamp rooms and CTF challenges to earn Cyber Points and secure your rank.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link to="/register" className="btn-primary inline-flex items-center gap-2 px-8 py-3 text-sm group">
                Get started <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/bootcamps" className="btn-secondary inline-flex items-center gap-2 px-8 py-3 text-sm">
                View Bootcamps
              </Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </Snap>

    </div>
  );
};

export default PublicLeaderboardPage;
