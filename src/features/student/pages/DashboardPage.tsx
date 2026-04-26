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

// ── Sidebar nav items (desktop right rail) ──────────────────────────────────
const RAIL_LINKS = [
  { icon: Wallet,    path: '/wallet',        label: 'Wallet'        },
  { icon: ShoppingBag, path: '/marketplace', label: 'Marketplace'   },
  { icon: Bell,      path: '/notifications', label: 'Notifications' },
  { icon: Settings,  path: '/settings',      label: 'Settings'      },
];

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

  // ── Derived data ────────────────────────────────────────────────────────────
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
  const streakDays = Number(overview?.xpSummary?.streakDays || 0);
  const cpBalance = user?.cp ?? 0;
  const handle = user?.username || 'OPERATOR';
  const initials = handle.substring(0, 2).toUpperCase();

  return (
    /* Outer wrapper — leaves room for topbar (pt-20/pt-24 from layout) */
    <div className="min-h-[calc(100svh-5rem)] md:min-h-[calc(100svh-6rem)]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">

        {/* ── Two-column shell on desktop ─────────────────────────────────── */}
        <div className="flex gap-6 lg:gap-8 items-start">

          {/* ── MAIN COLUMN ─────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0 space-y-6 md:space-y-8">

            {/* ── PROFILE + WELCOME HERO ──────────────────────────────── */}
            <section className="pb-8 md:pb-10 border-b border-border">

              {/* Row 1 — avatar + name + stats */}
              <div className="flex items-center gap-6 md:gap-8 mb-7">

                {/* Avatar */}
                <Link
                  to="/profile"
                  aria-label="Profile"
                  className="w-24 h-24 md:w-32 md:h-32 rounded-xl border-2 border-border bg-accent-dim flex items-center justify-center text-accent font-black text-3xl md:text-4xl flex-none hover:border-accent/60 transition-colors select-none"
                >
                  {initials}
                </Link>

                {/* Name + stats stacked */}
                <div className="flex-1 min-w-0 space-y-3">
                  <div>
                    <p className="text-xs font-bold text-text-muted uppercase tracking-[0.35em] mb-1.5">
                      Welcome back
                    </p>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-accent font-mono flex items-center gap-3 leading-none">
                      {handle}
                      <span className="w-[3px] h-9 md:h-11 bg-accent animate-pulse flex-none" />
                    </h1>
                  </div>

                  {/* CP + streak — icon and number only */}
                  <div className="flex items-center gap-6 flex-wrap">
                    {/* CP */}
                    <div className="flex items-center gap-2">
                      <CpLogo className="w-6 h-6 md:w-7 md:h-7" />
                      <span className="text-xl md:text-2xl font-mono font-black text-text-primary leading-none">
                        {cpBalance.toLocaleString()}
                      </span>
                    </div>

                    {/* Divider */}
                    <span className="w-px h-6 bg-border flex-none" />

                    {/* Streak */}
                    <div className="flex items-center gap-2">
                      <Flame className="w-6 h-6 md:w-7 md:h-7 text-emerald-400" />
                      <span className="text-xl md:text-2xl font-black text-emerald-400 leading-none">
                        {streakDays}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2 — progress + CTA, full width */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-text-primary uppercase tracking-tight truncate pr-4">
                      {overview?.progressMeta?.currentPhase?.title ||
                        (isEnrolled ? 'Active Bootcamp' : 'No active bootcamp')}
                    </span>
                    <span className="text-sm font-mono font-bold text-accent flex-none">{progressValue}</span>
                  </div>
                  <div className="h-2 w-full bg-accent-dim rounded-full">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: progressValue }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-accent rounded-full shadow-[0_0_10px_rgba(136,173,124,0.5)]"
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

            </section>

            {/* ── MY BOOTCAMPS ────────────────────────────────────────── */}
            <section>
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
                  <>
                    {[0, 1].map((i) => (
                      <div key={i} className="rounded-xl border border-border bg-bg-card animate-pulse overflow-hidden">
                        <div className="h-36 bg-accent-dim/30" />
                        <div className="p-4 space-y-2">
                          <div className="h-3 bg-accent-dim/30 rounded w-3/4" />
                          <div className="h-2 bg-accent-dim/20 rounded w-1/2" />
                          <div className="h-1.5 bg-accent-dim/20 rounded-full w-full mt-3" />
                        </div>
                      </div>
                    ))}
                  </>
                ) : enrolledBootcamps.length === 0 ? (
                  <div className="col-span-full p-10 bg-bg-card border border-border rounded-xl text-center">
                    <BookOpen className="w-8 h-8 text-text-muted mx-auto mb-3 opacity-40" />
                    <p className="text-sm text-text-muted mb-4">No bootcamps enrolled yet.</p>
                    <Link to="/bootcamps" className="btn-primary text-xs !py-2 !px-5 inline-flex items-center gap-2">
                      Browse Bootcamps <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ) : (
                  enrolledBootcamps.map((item) => (
                    <Link
                      to={`/bootcamps/${item.id}`}
                      key={item.id}
                      className="group flex flex-col bg-bg-card border border-border rounded-xl overflow-hidden hover:border-accent/30 hover:bg-accent-dim/10 transition-all"
                    >
                      {/* Cover image */}
                      <div className="relative h-36 md:h-40 overflow-hidden bg-accent-dim/20">
                        <img
                          src={item.img}
                          alt=""
                          className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-90 transition-all duration-500"
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
                          <div className="h-1 w-full bg-accent-dim rounded-full overflow-hidden">
                            <div
                              className="h-full bg-accent rounded-full transition-all duration-700"
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </section>

          </div>

          {/* ── RIGHT RAIL — desktop only ────────────────────────────────── */}
          <aside className="hidden lg:flex flex-col items-center justify-center gap-3 flex-none w-14 self-stretch">
            {RAIL_LINKS.map(({ icon: Icon, path, label }) => (
              <Link
                key={path}
                to={path}
                aria-label={label}
                title={label}
                className="w-11 h-11 rounded-xl border border-border bg-bg-card flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/40 hover:bg-accent-dim/30 transition-all"
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
