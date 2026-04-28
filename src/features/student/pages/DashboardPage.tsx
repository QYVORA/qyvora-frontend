import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Wallet, ShoppingBag, Bell, Settings, Terminal,
  Flame, BookOpen, Target, ChevronRight, Star,
} from 'lucide-react';
import { useAuth } from '../../../core/contexts/AuthContext';
import api from '../../../core/services/api';
import CpLogo from '../../../shared/components/CpLogo';

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

// ── Rank config ───────────────────────────────────────────────────────────────
const RANKS = [
  { name: 'Candidate',    min: 0,    max: 149,  color: 'text-zinc-400',   bg: 'bg-zinc-800',    emoji: '🔰' },
  { name: 'Contributor',  min: 150,  max: 449,  color: 'text-blue-400',   bg: 'bg-blue-900/40', emoji: '⚡' },
  { name: 'Specialist',   min: 450,  max: 899,  color: 'text-purple-400', bg: 'bg-purple-900/40', emoji: '🎯' },
  { name: 'Architect',    min: 900,  max: 1499, color: 'text-amber-400',  bg: 'bg-amber-900/40', emoji: '🏗️' },
  { name: 'Vanguard',     min: 1500, max: Infinity, color: 'text-accent', bg: 'bg-accent-dim',   emoji: '🔥' },
];

function getRankInfo(cp: number) {
  const rank = RANKS.find(r => cp >= r.min && cp <= r.max) ?? RANKS[0];
  const next = RANKS[RANKS.indexOf(rank) + 1] ?? null;
  const progress = next ? Math.round(((cp - rank.min) / (next.min - rank.min)) * 100) : 100;
  return { rank, next, progress };
}

// ── Streak milestone messages ─────────────────────────────────────────────────
function getStreakMessage(days: number): string {
  if (days === 0) return 'Start your streak today';
  if (days === 1) return 'Day 1 — keep it going!';
  if (days < 3) return `${days} days — warming up`;
  if (days < 7) return `${days} days — building momentum`;
  if (days === 7) return '7 days — one week strong! 🎉';
  if (days < 14) return `${days} days — on a roll`;
  if (days === 14) return '2 weeks — you\'re unstoppable! 🔥';
  if (days < 30) return `${days} days — elite consistency`;
  return `${days} days — legendary streak 🏆`;
}

// ── Rank greeting ─────────────────────────────────────────────────────────────
function getRankGreeting(rankName: string, handle: string): string {
  const greetings: Record<string, string[]> = {
    Candidate:   [`${handle}, your mission starts now.`, `Ready to level up, ${handle}?`, `The path begins here, ${handle}.`],
    Contributor: [`Good work, ${handle}. Keep pushing.`, `${handle} — you're making progress.`, `Stay sharp, ${handle}.`],
    Specialist:  [`${handle}, you're in the zone.`, `Solid work, ${handle}. Keep executing.`, `${handle} — specialist mode activated.`],
    Architect:   [`${handle}, you're building something real.`, `Elite operator, ${handle}. Keep going.`, `${handle} — the system bends to your will.`],
    Vanguard:    [`${handle} — you lead the way.`, `Vanguard status confirmed, ${handle}.`, `${handle}, the community looks up to you.`],
  };
  const list = greetings[rankName] ?? greetings['Candidate'];
  return list[Math.floor(Date.now() / 86400000) % list.length];
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
      description: String(item.description || '').trim(),
      level: String(item.level || '').trim(),
      duration: String(item.duration || '').trim(),
      priceLabel: String(item.priceLabel || '').trim(),
      currentModule: prog?.title ? String(prog.title) : null,
      progress: Number(prog?.progress || 0),
      img: '/HPB-image.png',
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

  // Rank info
  const { rank: rankInfo, next: nextRank, progress: rankProgress } = getRankInfo(cpBalance);

  // Next mission — first unlocked, incomplete module
  const nextMission = (overview?.learningPath || []).find(
    (m: any) => m.status === 'in-progress' || m.status === 'next'
  );

  // Streak milestone celebration
  const isStreakMilestone = [7, 14, 30, 60, 100].includes(streakDays);

  return (
    <div className="w-full min-h-[calc(100svh-5rem)] md:min-h-[calc(100svh-6rem)] bg-bg">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
        <div className="flex gap-6 lg:gap-8 items-start">

          {/* ── MAIN COLUMN ──────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0 space-y-6 md:space-y-8">

            {/* ══ HERO — greeting + rank + streak ══ */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative py-2"
            >
              <div className="relative z-10">

                {/* Row 1 — avatar + name + stats */}
                <div className="flex items-center gap-5 md:gap-8 mb-7">

                  {/* Avatar */}
                  <Link
                    to="/profile"
                    aria-label="Profile"
                    className="relative flex-none w-20 h-20 md:w-28 md:h-28 rounded-xl flex items-center justify-center text-accent font-black text-2xl md:text-4xl select-none transition-transform hover:scale-105"
                    style={{
                      background: 'var(--color-accent-dim)',
                      boxShadow: '0 0 0 1.5px var(--color-border), 0 0 24px var(--color-accent-glow)',
                    }}
                  >
                    <span aria-hidden className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-accent/60 rounded-tl" />
                    <span aria-hidden className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-accent/60 rounded-tr" />
                    <span aria-hidden className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-accent/60 rounded-bl" />
                    <span aria-hidden className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-accent/60 rounded-br" />
                    {initials}
                  </Link>

                  {/* Name + greeting + stats */}
                  <div className="flex-1 min-w-0 space-y-3">
                    <div>
                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.4em] mb-1.5">
                        {loading ? 'Loading…' : getRankGreeting(rankInfo.name, handle)}
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

                    {/* CP + streak */}
                    <div className="flex items-center gap-5 flex-wrap">
                      <div className="flex items-center gap-2">
                        <CpLogo className="w-6 h-6 md:w-7 md:h-7" />
                        <span className="text-xl md:text-2xl font-mono font-black text-text-primary leading-none">
                          {loading ? '—' : <AnimatedNumber value={cpBalance} />}
                        </span>
                      </div>
                      <span className="w-px h-6 bg-border flex-none" />
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={streakDays > 0 ? { scale: [1, 1.2, 1] } : {}}
                          transition={{ duration: 0.6, repeat: streakDays > 0 ? Infinity : 0, repeatDelay: 3 }}
                        >
                          <Flame className={`w-6 h-6 md:w-7 md:h-7 ${streakDays > 0 ? 'text-orange-400' : 'text-text-muted'}`} />
                        </motion.div>
                        <span className={`text-xl md:text-2xl font-black leading-none ${streakDays > 0 ? 'text-orange-400' : 'text-text-muted'}`}>
                          {loading ? '—' : <AnimatedNumber value={streakDays} />}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rank badge + progress to next rank */}
                {!loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6 p-4 bg-bg-card border border-border rounded-xl flex flex-wrap items-center gap-4"
                  >
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${rankInfo.bg}`}>
                      <span className="text-lg">{rankInfo.emoji}</span>
                      <span className={`text-sm font-black uppercase tracking-widest ${rankInfo.color}`}>{rankInfo.name}</span>
                    </div>
                    {nextRank && (
                      <div className="flex-1 min-w-[160px]">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">
                            {nextRank.min - cpBalance} CP to {nextRank.name}
                          </span>
                          <span className="text-[10px] font-mono text-accent">{rankProgress}%</span>
                        </div>
                        <div className="h-1.5 bg-accent-dim rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${rankProgress}%` }}
                            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                            className="h-full bg-accent rounded-full"
                          />
                        </div>
                      </div>
                    )}
                    {!nextRank && (
                      <span className="text-xs text-accent font-bold">Max rank achieved 🏆</span>
                    )}
                  </motion.div>
                )}

                {/* Streak message */}
                {!loading && streakDays > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    className="mb-5 flex items-center gap-2 text-xs text-orange-400 font-bold"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    {getStreakMessage(streakDays)}
                    {isStreakMilestone && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                        className="ml-1 px-2 py-0.5 bg-orange-500/20 border border-orange-500/30 rounded-full text-[9px] uppercase tracking-widest"
                      >
                        Milestone!
                      </motion.span>
                    )}
                  </motion.div>
                )}

                {/* Progress bar + CTA */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-text-primary uppercase tracking-tight truncate pr-4">
                        {overview?.progressMeta?.currentPhase?.title ||
                          (isEnrolled ? 'Active Bootcamp' : 'No active bootcamp')}
                      </span>
                      <span className="text-sm font-mono font-bold text-accent flex-none">{progressValue}</span>
                    </div>
                    <div className="relative h-2 w-full rounded-full overflow-hidden"
                      style={{ background: 'var(--color-accent-dim)' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressNum}%` }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{ background: 'var(--color-accent)', boxShadow: '0 0 12px var(--color-accent-glow)' }}
                      />
                    </div>
                  </div>

                  <Link to={continuePath} className="btn-primary inline-flex items-center gap-3 text-base">
                    {isEnrolled ? 'CONTINUE LEARNING' : 'BROWSE BOOTCAMPS'}
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </motion.section>

            {/* ══ NEXT MISSION ══ */}
            {!loading && isEnrolled && nextMission && (
              <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xs font-bold text-text-muted uppercase tracking-[0.25em] flex items-center gap-2">
                    <Target className="w-3.5 h-3.5 text-accent" /> Next Mission
                  </h2>
                </div>
                <Link
                  to={continuePath}
                  className="group flex items-center gap-4 p-5 bg-bg-card border border-border rounded-xl hover:border-accent/40 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent-dim border border-accent/20 flex items-center justify-center flex-none">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <Star className="w-5 h-5 text-accent" />
                    </motion.div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1">
                      {nextMission.status === 'in-progress' ? '// In Progress' : '// Up Next'}
                    </div>
                    <div className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors truncate">
                      {nextMission.title}
                    </div>
                    {nextMission.progress > 0 && (
                      <div className="mt-2 h-1 bg-accent-dim rounded-full overflow-hidden w-32">
                        <div className="h-full bg-accent rounded-full" style={{ width: `${nextMission.progress}%` }} />
                      </div>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors flex-none" />
                </Link>
              </motion.section>
            )}

            {/* ══ MY BOOTCAMPS ══ */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.3, ease: 'easeOut' }}
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
                      transition={{ duration: 0.35, delay: 0.35 + idx * 0.07 }}
                    >
                      <Link
                        to={`/bootcamps/${item.id}`}
                        className="group flex flex-col bg-bg-card border border-border rounded-xl overflow-hidden hover:border-accent/30 transition-all"
                        style={{ boxShadow: 'inset 0 1px 0 rgba(183,255,153,0.04)' }}
                      >
                        <div className="relative h-36 md:h-40 overflow-hidden bg-accent-dim/20">
                          <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          <div aria-hidden className="scanlines absolute inset-0 pointer-events-none" />
                          <div aria-hidden className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
                            style={{ background: 'linear-gradient(to top, var(--color-bg-card), transparent)' }}
                          />
                          {/* Progress badge */}
                          <div className="absolute top-3 right-3 px-2 py-1 bg-bg/80 backdrop-blur-sm border border-border rounded-md text-[10px] font-mono font-bold text-accent">
                            {item.progress}%
                          </div>
                          {/* Level badge */}
                          {item.level && (
                            <div className="absolute top-3 left-3 px-2 py-1 bg-bg/80 backdrop-blur-sm border border-border rounded-md text-[9px] font-bold uppercase tracking-widest text-text-muted">
                              {item.level}
                            </div>
                          )}
                        </div>
                        <div className="p-4 flex flex-col gap-2 flex-1">
                          <h4 className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors leading-snug">
                            {item.title}
                          </h4>
                          {item.description && (
                            <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">{item.description}</p>
                          )}
                          <div className="flex items-center gap-3 text-[10px] text-text-muted font-bold uppercase mt-1">
                            {item.duration && <span>{item.duration}</span>}
                            {item.priceLabel && <><span className="opacity-40">·</span><span className="text-accent">{item.priceLabel}</span></>}
                          </div>
                          {item.currentModule && (
                            <div className="text-[10px] text-text-muted truncate">
                              <span className="text-accent font-bold">▶</span> {item.currentModule}
                            </div>
                          )}
                          <div className="mt-auto pt-3">
                            <div className="relative h-1 w-full rounded-full overflow-hidden"
                              style={{ background: 'var(--color-accent-dim)' }}>
                              <div
                                className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                                style={{ width: `${item.progress}%`, background: 'var(--color-accent)', boxShadow: '0 0 8px var(--color-accent-glow)' }}
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
