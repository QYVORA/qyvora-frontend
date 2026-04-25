import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Zap, Trophy, Shield, Terminal, ArrowRight, Wallet, ShoppingBag, Bell, Settings } from 'lucide-react';
import { useAuth } from '../../../core/contexts/AuthContext';
import api from '../../../core/services/api';
import CpLogo from '../../../shared/components/CpLogo';
import { resolveImg } from '../../../shared/utils/resolveImg';

const SkeletonRow = () => (
  <div className="p-4 bg-bg-card border border-border rounded-lg flex items-center gap-4 animate-pulse">
    <div className="w-16 h-12 rounded bg-accent-dim/30 flex-none" />
    <div className="flex-1 space-y-2">
      <div className="h-3 bg-accent-dim/30 rounded w-3/4" />
      <div className="h-2 bg-accent-dim/20 rounded w-1/2" />
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [overview, setOverview] = useState<any>(null);
  const [bootcamps, setBootcamps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [overviewRes, bootcampsRes] = await Promise.all([
          api.get('/student/overview'),
          api.get('/public/bootcamps'),
        ]);
        if (!mounted) return;
        setOverview(overviewRes.data || null);
        setBootcamps(Array.isArray(bootcampsRes.data?.items) ? bootcampsRes.data.items : []);
      } catch {
        // silently fall through
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Build progress map keyed by bootcamp ID (not index)
  const moduleProgressById = new Map<string, any>(
    (Array.isArray(overview?.modules) ? overview.modules : []).map((m: any) => [
      String(m.bootcampId || m.id || ''),
      m,
    ])
  );

  // Also handle single-bootcamp enrollment via overview.bootcampId
  if (
    overview?.bootcampStatus &&
    overview.bootcampStatus !== 'not_enrolled' &&
    overview?.bootcampId &&
    !moduleProgressById.has(String(overview.bootcampId))
  ) {
    moduleProgressById.set(String(overview.bootcampId), {
      bootcampId: overview.bootcampId,
      progress: 0,
      title: '',
    });
  }

  // Enrolled bootcamps: only those with actual progress data
  const enrolledBootcamps = bootcamps
    .map((item: any) => {
      const prog = moduleProgressById.get(String(item.id || ''));
      return { item, prog };
    })
    .filter(({ prog }) => prog !== undefined)
    .slice(0, 3)
    .map(({ item, prog }) => ({
      id: String(item.id || ''),
      title: item.title || 'Bootcamp',
      module: prog?.title ? `Current: ${prog.title}` : 'Not started',
      progress: Number(prog?.progress || 0),
      img: resolveImg(item.image, '/images/Curriculum-images/phase1.webp'),
    }));

  // Active bootcamp for "Continue Learning" — first enrolled one with progress
  const activeBootcamp = bootcamps.find((bc: any) => {
    const prog = moduleProgressById.get(String(bc.id || ''));
    return prog !== undefined;
  });
  const continuePath = activeBootcamp ? `/bootcamps/${activeBootcamp.id}` : '/bootcamps';

  const progressValue = overview?.snapshot?.find((item: any) => item?.id === 'progress')?.value || '0%';
  const streakDays = Number(overview?.xpSummary?.streakDays || 0);
  const bootcampStatus = overview?.bootcampStatus || 'not_enrolled';
  const isEnrolled = bootcampStatus !== 'not_enrolled';

  // Fixed stat order — no dynamic sorting
  const summaryStats = [
    { label: 'Rank',     value: user?.rank || '—',                        icon: Shield  },
    { label: 'Balance',  value: `${user?.cp?.toLocaleString() ?? '0'} CP`, icon: Wallet  },
    { label: 'Progress', value: progressValue,                             icon: Zap     },
    { label: 'Streak',   value: `${streakDays}d`,                         icon: Trophy  },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-5 md:py-8">

      {/* ── HERO CARD ── */}
      <section className="mb-5 md:mb-8">
        <div className="relative p-5 md:p-8 bg-bg-card border border-border rounded-xl overflow-hidden">
          <div className="absolute inset-0 dot-grid opacity-[0.05] pointer-events-none" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">
            {/* Left: greeting + progress */}
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold text-text-muted uppercase tracking-[0.3em] mb-1">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-accent font-mono flex items-center gap-2 mb-1 break-words">
                WELCOME BACK, {user?.username || '—'} <span className="w-2 h-6 bg-accent animate-pulse flex-none" />
              </h1>
              <p className="text-xs text-text-muted mb-5">
                {overview?.progressMeta?.currentPhase?.roleTitle || 'Continue your operator training.'}
              </p>

              {/* Progress bar */}
              <div className="max-w-lg">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-text-primary uppercase tracking-tight truncate pr-4">
                    {overview?.progressMeta?.currentPhase?.title || (isEnrolled ? 'Active Bootcamp' : 'No active bootcamp')}
                  </span>
                  <span className="text-xs font-mono text-accent flex-none">{progressValue}</span>
                </div>
                <div className="h-2 w-full bg-accent-dim rounded-full mb-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: progressValue }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-accent rounded-full shadow-[0_0_10px_rgba(136,173,124,0.5)]"
                  />
                </div>
                <Link to={continuePath} className="btn-primary inline-flex items-center gap-3 text-sm">
                  <span>{isEnrolled ? 'CONTINUE LEARNING' : 'BROWSE BOOTCAMPS'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right: badges */}
            <div className="flex lg:flex-col gap-3 flex-wrap lg:flex-nowrap flex-none">
              <div className="px-4 py-2.5 bg-accent text-bg rounded-lg font-black text-xs inline-flex items-center gap-2">
                <Zap className="w-3.5 h-3.5" /> {streakDays}-DAY STREAK
              </div>
              <div className="px-4 py-2.5 bg-bg border border-border rounded-lg font-mono font-bold text-xs text-accent inline-flex items-center gap-2">
                {user?.cp?.toLocaleString() ?? 0} <CpLogo className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STAT PILLS — fixed order ── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-5 md:mb-8">
        {summaryStats.map((stat, idx) => (
          <div key={idx} className="p-3 md:p-4 bg-bg border border-border rounded-lg flex items-center gap-3 md:gap-4">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-md bg-accent-dim flex items-center justify-center text-accent flex-none">
              <stat.icon className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] md:text-[10px] font-bold text-text-muted uppercase tracking-widest">{stat.label}</span>
              <span className="text-sm md:text-base font-bold text-text-primary truncate">{stat.value}</span>
            </div>
          </div>
        ))}
      </section>

      {/* ── MAIN GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-8">

        {/* Left: enrolled bootcamps */}
        <div className="lg:col-span-2 space-y-5 md:space-y-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base md:text-lg font-bold text-text-primary flex items-center gap-2">
                <Terminal className="w-4 h-4 text-accent" /> MY BOOTCAMPS
              </h2>
              <Link to="/bootcamps" className="text-xs font-bold text-accent hover:underline">View all →</Link>
            </div>
            <div className="space-y-3">
              {loading ? (
                <><SkeletonRow /><SkeletonRow /></>
              ) : enrolledBootcamps.length === 0 ? (
                <div className="p-6 bg-bg-card border border-border rounded-lg text-center">
                  <Terminal className="w-8 h-8 text-text-muted mx-auto mb-3 opacity-40" />
                  <p className="text-sm text-text-muted mb-4">You haven't enrolled in any bootcamps yet.</p>
                  <Link to="/bootcamps" className="btn-primary text-xs !py-2 !px-5 inline-flex items-center gap-2">
                    Browse Bootcamps <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                enrolledBootcamps.map((item) => (
                  <Link
                    to={`/bootcamps/${item.id}`}
                    key={item.id}
                    className="group p-3 md:p-4 bg-bg-card border border-border rounded-lg flex items-center justify-between hover:border-accent/30 hover:bg-accent-dim/10 transition-all min-h-[76px]"
                  >
                    <div className="flex items-center gap-3 md:gap-4 min-w-0">
                      <img src={item.img} alt="" className="w-14 h-10 md:w-16 md:h-12 object-cover rounded border border-border flex-none" />
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors truncate">{item.title}</h4>
                        <p className="text-xs text-text-muted truncate">{item.module}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-none ml-2">
                      <div className="hidden sm:block text-right">
                        <div className="text-[10px] font-bold text-text-muted uppercase mb-1">{item.progress}%</div>
                        <div className="w-16 md:w-20 h-1.5 bg-bg rounded-full overflow-hidden">
                          <div className="h-full bg-accent rounded-full" style={{ width: `${item.progress}%` }} />
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-accent group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: quick actions */}
        <div className="space-y-5 md:space-y-6">
          {/* Primary actions */}
          <div>
            <h2 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Wallet',      sub: 'Manage CP',      icon: Wallet,    path: '/wallet',      primary: true  },
                { label: 'Marketplace', sub: 'Spend points',   icon: ShoppingBag, path: '/marketplace', primary: true  },
              ].map((link, i) => (
                <Link
                  to={link.path}
                  key={i}
                  className="p-4 bg-bg-card border border-border rounded-xl flex flex-col gap-2 hover:border-accent/30 hover:bg-accent-dim/10 transition-all group"
                >
                  <div className="w-9 h-9 rounded-lg bg-accent-dim flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                    <link.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-text-primary">{link.label}</div>
                    <div className="text-[10px] text-text-muted uppercase tracking-tighter">{link.sub}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Secondary actions */}
          <div className="p-1 bg-bg border border-border rounded-lg overflow-hidden">
            {[
              { label: 'Notifications', sub: 'Comms & alerts',   icon: Bell,     path: '/notifications' },
              { label: 'Settings',      sub: 'Security & account', icon: Settings, path: '/settings'      },
            ].map((link, i) => (
              <Link
                to={link.path}
                key={i}
                className="w-full p-3 md:p-4 flex items-center justify-between group hover:bg-bg-card rounded transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-accent-dim/50 border border-accent/20 flex items-center justify-center text-accent">
                    <link.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-text-primary">{link.label}</div>
                    <div className="text-[10px] text-text-muted uppercase tracking-tighter">{link.sub}</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
              </Link>
            ))}
          </div>

          {/* Next step nudge */}
          <div className="card-hsociety p-5 border-accent/20">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3 flex items-center gap-2">
              <Trophy className="w-3.5 h-3.5 text-accent" /> NEXT RANK
            </h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-mono font-bold text-accent">{user?.rank?.toUpperCase() || 'CANDIDATE'}</span>
              <span className="text-[10px] text-text-muted">→ NEXT TIER</span>
            </div>
            <div className="h-1.5 w-full bg-accent-dim rounded-full mb-3">
              <div className="h-full bg-accent rounded-full" style={{ width: progressValue }} />
            </div>
            <p className="text-[10px] text-text-muted">
              Complete modules and earn <CpLogo className="w-3 h-3 mx-0.5" /> to advance your rank.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
