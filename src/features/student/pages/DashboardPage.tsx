import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Wallet, ShoppingBag, Bell, Settings, Terminal,
  Flame, BookOpen,
} from 'lucide-react';
import { useAuth } from '../../../core/contexts/AuthContext';
import api from '../../../core/services/api';
import CpLogo from '../../../shared/components/CpLogo';
import { resolveImg } from '../../../shared/utils/resolveImg';

// ── Sidebar nav items ────────────────────────────────────────────────────────
const RAIL_LINKS = [
  { icon: Wallet,      path: '/wallet',        label: 'Wallet'        },
  { icon: ShoppingBag, path: '/marketplace',   label: 'Marketplace'   },
  { icon: Bell,        path: '/notifications', label: 'Notifications' },
  { icon: Settings,    path: '/settings',      label: 'Settings'      },
];

// ── Animated counter ─────────────────────────────────────────────────────────
function AnimatedNumber({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    const from = 0;
    const to = value;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value, duration]);
  return <>{display.toLocaleString()}</>;
}

// ── Component ─────────────────────────────────────────────────────────────────
const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [overview, setOverview] = useState<any>(null);
  const [bootcamps, setBootcamps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [ovRes, bcRes] = await Promise.all([
          api.get('/student/overview'),
          api.get('/public/bootcamps'),
        ]);
        if (!mounted) return;
        setOverview(ovRes.data || null);
        setBootcamps(Array.isArray(bcRes.data?.items) ? bcRes.data.items : []);
      } catch { /* silent */ }
      finally { if (mounted) setLoading(false); }
    })();
    return () => { mounted = false; };
  }, []);

  // ── Derived data ─────────────────────────────────────────────────────────
  const moduleProgressById = new Map<string, any>(
    (Array.isArray(overview?.modules) ? overview.modules : []).map((m: any) => [
      String(m.bootcampId || m.id || ''), m,
    ])
  );
  if (
    overview?.bootcampStatus && overview.bootcampStatus !== 'not_enrolled' &&
    overview?.bootcampId && !moduleProgressById.has(String(overview.bootcampId))
  ) {
    moduleProgressById.set(String(overview.bootcampId), {
      bootcampId: overview.bootcampId, progress: 0, title: '',
    });
  }

  const enrolledBootcamps = bootcamps
    .map((item: any) => ({ item, prog: moduleProgressById.get(String(item.id || '')) }))
    .filter(({ prog }) => prog !== undefined)
    .slice(0, 4)
    .map(({ item, prog }) => ({
      id: String(item.id || ''),
      title: item.title || 'Bootcamp',
      module: prog?.title ? `${prog.title}` : 'Not started',
      progress: Number(prog?.progress || 0),
      img: resolveImg(item.image, '/images/Curriculum-images/phase1.webp'),
    }));

  const activeBootcamp = bootcamps.find((bc: any) =>
    moduleProgressById.get(String(bc.id || '')) !== undefined
  );
  const continuePath = activeBootcamp ? `/bootcamps/${activeBootcamp.id}` : '/bootcamps';
  const isEnrolled = (overview?.bootcampStatus || 'not_enrolled') !== 'not_enrolled';
  const progressValue = overview?.snapshot?.find((s: any) => s?.id === 'progress')?.value || '0%';
  const progressNum = parseInt(progressValue, 10) || 0;
  const streakDays = Number(overview?.xpSummary?.streakDays || 0);
  const cpBalance = user?.cp ?? 0;
  const handle = user?.username || 'OPERATOR';
  const initials = handle.substring(0, 2).toUpperCase();

  return (
    <div className="min-h-[calc(100svh-5rem)] md:min-h-[calc(100svh-6rem)]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
        <div className="flex gap-6 lg:gap-8 items-start">

          {/* ── MAIN COLUMN ──────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0 space-y-6 md:space-y-8">

            {/* ══════════════════════════════════════════════════════════════
                HERO / OVERVIEW CARD
                Full-bleed card with ambient glow, dot grid, scanlines
            ══════════════════════════════════════════════════════════════ */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative rounded-2xl border border-border bg-bg-card overflow-hidden"
            >
              {/* Ambient glow blob — top-left */}
              <div
                aria-hidden
                className="pointer-events-none absolute -top-16 -left-16 w-72 h-72 rounded-full"
                style={{ background: 'radial-gradient(circle, var(--color-accent-glow) 0%, transparent 70%)' }}
              />
              {/* Ambient glow blob — bottom-right */}
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-20 -right-10 w-56 h-56 rounded-full"
                style={{ background: 'radial-gradient(circle, var(--color-accent-glow) 0%, transparent 70%)' }}
              />

              {/* Dot grid texture */}
              <div aria-hidden className="dot-grid absolute inset-0 opacity-60 pointer-events-none" />

              {/* Scanline overlay */}
              <div aria-hidden className="scanlines absolute inset-0 pointer-events-none" />

              {/* Top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: 'linear-gradient(90deg, transparent, var(--color-accent), transparent)' }}
              />

              {/* Card content */}
              <div className="relative z-10 p-6 md:p-8">

                {/* Row 1 — avatar + name + stats */}
                <div className="flex items-center gap-5 md:gap-8 mb-7">

                  {/* Avatar — glowing border */}
                  <Link
                    to="/profile"
                    aria-label="Profile"
                    className="relative flex-none w-20 h-20 md:w-28 md:h-28 rounded-xl flex items-center justify-center text-accent font-black text-2xl md:text-4xl select-none transition-transform hover:scale-105"
                    style={{
                      background: 'var(--color-accent-dim)',
                      boxShadow: '0 0 0 1.5px var(--color-border), 0 0 24px var(--color-accent-glow)',
                    }}
                  >
                    {/* Corner brackets */}
                    <span aria-hidden className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-accent/60 rounded-tl" />
                    <span aria-hidden className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-accent/60 rounded-tr" />
                    <span aria-hidden className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-accent/60 rounded-bl" />
                    <span aria-hidden className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-accent/60 rounded-br" />
                    {initials}
                  </Link>

                  {/* Name + stats */}
                  <div className="flex-1 min-w-0 space-y-3">
                    <div>
                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.4em] mb-1.5">
                        Welcome back
                      </p>
                      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-accent font-mono flex items-center gap-3 leading-none">
                        {handle}
                        <motion.span
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-[3px] h-9 md:h-11 bg-accent flex-none"
                        />
                      </h1>
                    </div>

                    {/* CP + streak — icon + number only, no labels */}
                    <div className="flex items-center gap-5 flex-wrap">
                      <div className="flex items-center gap-2">
                        <CpLogo className="w-6 h-6 md:w-7 md:h-7" />
                        <span className="text-xl md:text-2xl font-mono font-black text-text-primary leading-none">
                          {loading ? '—' : <AnimatedNumber value={cpBalance} />}
                        </span>
                      </div>

                      <span className="w-px h-6 bg-border flex-none" />

                      <div className="flex items-center gap-2">
                        <Flame className="w-6 h-6 md:w-7 md:h-7 text-emerald-400" />
                        <span className="text-xl md:text-2xl font-black text-emerald-400 leading-none">
                          {loading ? '—' : <AnimatedNumber value={streakDays} />}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 2 — progress bar + CTA */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-text-primary uppercase tracking-tight truncate pr-4">
                        {overview?.progressMeta?.currentPhase?.title ||
                          (isEnrolled ? 'Active Bootcamp' : 'No active bootcamp')}
                      </span>
                      <span className="text-sm font-mono font-bold text-accent flex-none">{progressValue}</span>
                    </div>

                    {/* Progress track */}
                    <div className="relative h-2 w-full rounded-full overflow-hidden"
                      style={{ background: 'var(--color-accent-dim)' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressNum}%` }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{
                          background: 'var(--color-accent)',
                          boxShadow: '0 0 12px var(--color-accent-glow)',
                        }}
                      />
                    </div>
                  </div>

                  <Link
                    to={continuePath}
                    className="btn-primary inline-flex items-center gap-3 text-base"
                  >
                    {isEnrolled ? 'CONTINUE LEARNING' : 'BROWSE BOOTCAMPS'}
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>

              </div>
            </motion.section>

            {/* ══════════════════════════════════════════════════════════════
                MY BOOTCAMPS
            ══════════════════════════════════════════════════════════════ */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.18, ease: 'easeOut' }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold text-text-muted uppercase tracking-[0.25em] flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-accent" /> My Bootcamps
                </h2>
                <Link to="/bootcamps" className="text-[10px] font-bold text-accent hover:underline uppercase tracking-widest">
                  View all →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {loading ? (
                  [0, 1].map((i) => (
                    <div key={i} className="rounded-xl border border-border bg-bg-card animate-pulse overflow-hidden">
                      <div className="h-36 bg-accent-dim/30" />
                      <div className="p-4 space-y-2">
                        <div className="h-3 bg-accent-dim/30 rounded w-3/4" />
                        <div className="h-2 bg-accent-dim/20 rounded w-1/2" />
                        <div className="h-1.5 bg-accent-dim/20 rounded-full w-full mt-3" />
                      </div>
                    </div>
                  ))
                ) : enrolledBootcamps.length === 0 ? (
                  <div className="col-span-full p-10 bg-bg-card border border-border rounded-xl text-center">
                    <BookOpen className="w-8 h-8 text-text-muted mx-auto mb-3 opacity-40" />
                    <p className="text-sm text-text-muted mb-4">No bootcamps enrolled yet.</p>
                    <Link to="/bootcamps" className="btn-primary text-xs !py-2 !px-5 inline-flex items-center gap-2">
                      Browse Bootcamps <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ) : (
                  enrolledBootcamps.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.22 + idx * 0.07 }}
                    >
                      <Link
                        to={`/bootcamps/${item.id}`}
                        className="group flex flex-col bg-bg-card border border-border rounded-xl overflow-hidden hover:border-accent/30 transition-all"
                        style={{ boxShadow: 'inset 0 1px 0 rgba(183,255,153,0.04)' }}
                      >
                        {/* Cover image */}
                        <div className="relative h-36 md:h-40 overflow-hidden bg-accent-dim/20">
                          <img
                            src={item.img}
                            alt=""
                            className="w-full h-full object-cover transition-all duration-500"
                          />
                          {/* Scanline on image */}
                          <div aria-hidden className="scanlines absolute inset-0 pointer-events-none" />
                          {/* Bottom gradient fade */}
                          <div aria-hidden className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
                            style={{ background: 'linear-gradient(to top, var(--color-bg-card), transparent)' }}
                          />
                          {/* Progress badge */}
                          <div className="absolute top-3 right-3 px-2 py-1 bg-bg/80 backdrop-blur-sm border border-border rounded-md text-[10px] font-mono font-bold text-accent">
                            {item.progress}%
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 flex flex-col gap-2 flex-1">
                          <h4 className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors leading-snug">
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-text-muted truncate">{item.module}</p>

                          {/* Progress bar */}
                          <div className="mt-auto pt-3">
                            <div className="relative h-1 w-full rounded-full overflow-hidden"
                              style={{ background: 'var(--color-accent-dim)' }}>
                              <div
                                className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                                style={{
                                  width: `${item.progress}%`,
                                  background: 'var(--color-accent)',
                                  boxShadow: '0 0 8px var(--color-accent-glow)',
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.section>

          </div>

          {/* ── RIGHT RAIL — desktop only ─────────────────────────────────── */}
          <aside className="hidden lg:flex flex-col items-center justify-center gap-3 flex-none w-14 self-stretch">
            {RAIL_LINKS.map(({ icon: Icon, path, label }) => (
              <Link
                key={path}
                to={path}
                aria-label={label}
                title={label}
                className="w-11 h-11 rounded-xl border border-border bg-bg-card flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/40 hover:bg-accent-dim/30 transition-all"
                style={{ boxShadow: 'inset 0 1px 0 rgba(183,255,153,0.05)' }}
              >
                <Icon className="w-5 h-5" />
              </Link>
            ))}
          </aside>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
