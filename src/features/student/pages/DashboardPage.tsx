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
  const multipleEnrolledBootcamps = enrolledBootcamps.length > 1;

  return (
    <div className="w-full min-h-[calc(100svh-5rem)] md:min-h-[calc(100svh-6rem)] bg-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 py-8 md:py-12">
        <div className="flex gap-6 lg:gap-10 items-start">

          {/* ── MAIN COLUMN ──────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0 space-y-8 md:space-y-10">

            {/* ══ HUB CARD — single hero: stats, rank, progress, CTA (no duplicate metrics below) ══ */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative"
            >
              <div
                className="relative overflow-hidden rounded-3xl border-2 border-border bg-bg-card p-6 sm:p-8 md:p-10"
                style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.25), inset 0 1px 0 rgba(183,255,153,0.06)' }}
              >
                {/* Playful watermark illustrations (subtle, THM-style energy without clutter) */}
                <img
                  src="/images/metrics/cp-points-badge.svg"
                  alt=""
                  className="pointer-events-none absolute -right-6 -top-6 h-36 w-36 opacity-[0.07] select-none sm:h-44 sm:w-44 md:-right-4 md:-top-4 md:h-52 md:w-52 md:opacity-[0.1]"
                  aria-hidden
                />
                <img
                  src="/images/metrics/streak-badge.svg"
                  alt=""
                  className="pointer-events-none absolute -bottom-8 -left-6 h-32 w-32 opacity-[0.08] select-none sm:h-40 sm:w-40 md:opacity-[0.11]"
                  aria-hidden
                />

                <div className="relative z-10">
                  <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-10 mb-8 md:mb-10">
                    <Link
                      to="/profile"
                      aria-label="Profile"
                      className="relative mx-auto flex h-24 w-24 shrink-0 select-none items-center justify-center rounded-2xl text-3xl font-black text-accent transition-transform hover:scale-[1.03] sm:mx-0 md:h-32 md:w-32 md:text-4xl"
                      style={{
                        background: 'var(--color-accent-dim)',
                        boxShadow: '0 0 0 2px var(--color-border), 0 0 32px var(--color-accent-glow)',
                      }}
                    >
                      <span aria-hidden className="absolute left-2 top-2 h-3 w-3 rounded-tl border-l-2 border-t-2 border-accent/60" />
                      <span aria-hidden className="absolute right-2 top-2 h-3 w-3 rounded-tr border-r-2 border-t-2 border-accent/60" />
                      <span aria-hidden className="absolute bottom-2 left-2 h-3 w-3 rounded-bl border-b-2 border-l-2 border-accent/60" />
                      <span aria-hidden className="absolute bottom-2 right-2 h-3 w-3 rounded-br border-b-2 border-r-2 border-accent/60" />
                      {initials}
                    </Link>

                    <div className="min-w-0 flex-1 space-y-4 text-center sm:text-left">
                      <div>
                        <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-text-muted md:text-sm">
                          {loading ? 'Loading…' : getRankGreeting(rankInfo.name, handle)}
                        </p>
                        <h1 className="flex items-center justify-center gap-3 font-mono text-4xl font-black leading-none text-accent sm:justify-start sm:text-5xl md:text-6xl">
                          {handle}
                          <motion.span
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="hidden h-10 w-1 bg-accent sm:block md:h-14"
                          />
                        </h1>
                      </div>

                      <div className="flex flex-wrap items-center justify-center gap-6 sm:justify-start md:gap-8">
                        <div className="flex items-center gap-2.5">
                          <CpLogo className="h-8 w-8 md:h-9 md:w-9" />
                          <span className="font-mono text-2xl font-black leading-none text-text-primary md:text-4xl">
                            {loading ? '—' : <AnimatedNumber value={cpBalance} />}
                          </span>
                          <span className="text-xs font-bold uppercase tracking-widest text-text-muted">CP</span>
                        </div>
                        <span className="hidden h-8 w-px bg-border sm:block" />
                        <div className="flex items-center gap-2.5">
                          <motion.div
                            animate={streakDays > 0 ? { scale: [1, 1.15, 1] } : {}}
                            transition={{ duration: 0.6, repeat: streakDays > 0 ? Infinity : 0, repeatDelay: 3 }}
                          >
                            <Flame className={`h-8 w-8 md:h-9 md:w-9 ${streakDays > 0 ? 'text-orange-400' : 'text-text-muted'}`} />
                          </motion.div>
                          <span className={`text-2xl font-black leading-none md:text-4xl ${streakDays > 0 ? 'text-orange-400' : 'text-text-muted'}`}>
                            {loading ? '—' : <AnimatedNumber value={streakDays} />}
                          </span>
                          <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Day streak</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {!loading && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-bg/80 p-4 backdrop-blur-sm md:p-5"
                    >
                      <div className={`flex items-center gap-2 rounded-xl px-3 py-2 md:px-4 md:py-2.5 ${rankInfo.bg}`}>
                        <span className="text-xl md:text-2xl">{rankInfo.emoji}</span>
                        <span className={`text-sm font-black uppercase tracking-widest md:text-base ${rankInfo.color}`}>{rankInfo.name}</span>
                      </div>
                      {nextRank && (
                        <div className="min-w-[200px] flex-1">
                          <div className="mb-2 flex items-center justify-between gap-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-text-muted">
                              {nextRank.min - cpBalance} CP to {nextRank.name}
                            </span>
                            <span className="font-mono text-sm font-bold text-accent">{rankProgress}%</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-accent-dim">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${rankProgress}%` }}
                              transition={{ duration: 1, ease: 'easeOut', delay: 0.25 }}
                              className="h-full rounded-full bg-accent"
                            />
                          </div>
                        </div>
                      )}
                      {!nextRank && (
                        <span className="text-sm font-bold text-accent md:text-base">Max rank achieved 🏆</span>
                      )}
                    </motion.div>
                  )}

                  {!loading && streakDays > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.25 }}
                      className="mb-6 flex flex-wrap items-center justify-center gap-2 text-sm font-bold text-orange-400 sm:justify-start md:text-base"
                    >
                      <Flame className="h-4 w-4 shrink-0 md:h-5 md:w-5" />
                      {getStreakMessage(streakDays)}
                      {isStreakMilestone && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                          className="ml-1 rounded-full border border-orange-500/30 bg-orange-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest"
                        >
                          Milestone!
                        </motion.span>
                      )}
                    </motion.div>
                  )}

                  <div className="space-y-5">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-end justify-between gap-2">
                        <span className="max-w-[85%] text-base font-black uppercase tracking-tight text-text-primary md:text-lg">
                          {overview?.progressMeta?.currentPhase?.title ||
                            (isEnrolled ? 'Active bootcamp' : 'Pick a bootcamp to begin')}
                        </span>
                        <span className="font-mono text-lg font-black text-accent md:text-2xl">{progressValue}</span>
                      </div>
                      <div
                        className="relative h-3 w-full overflow-hidden rounded-full md:h-3.5"
                        style={{ background: 'var(--color-accent-dim)' }}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progressNum}%` }}
                          transition={{ duration: 1.2, ease: 'easeOut' }}
                          className="absolute inset-y-0 left-0 rounded-full"
                          style={{ background: 'var(--color-accent)', boxShadow: '0 0 16px var(--color-accent-glow)' }}
                        />
                      </div>
                    </div>

                    <Link
                      to={continuePath}
                      className="btn-primary inline-flex w-full items-center justify-center gap-3 py-4 text-base font-black uppercase tracking-wide sm:w-auto md:px-10 md:text-lg"
                    >
                      {isEnrolled ? 'Continue learning' : 'Browse bootcamps'}
                      <ArrowRight className="h-6 w-6" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* ══ NEXT MISSION (module-level — not a repeat of overall % above) ══ */}
            {!loading && isEnrolled && nextMission && (
              <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <div className="mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-accent md:h-6 md:w-6" />
                  <h2 className="text-sm font-black uppercase tracking-[0.2em] text-text-primary md:text-base">
                    Next up
                  </h2>
                </div>
                <Link
                  to={continuePath}
                  className="group flex items-center gap-5 rounded-2xl border-2 border-border bg-bg-card p-5 transition-all hover:border-accent/50 md:gap-6 md:p-6"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-accent/25 bg-accent-dim md:h-16 md:w-16">
                    <motion.div
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <Star className="h-7 w-7 text-accent md:h-8 md:w-8" />
                    </motion.div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 text-xs font-black uppercase tracking-widest text-accent">
                      {nextMission.status === 'in-progress' ? 'In progress' : 'Up next'}
                    </div>
                    <div className="truncate text-base font-black text-text-primary transition-colors group-hover:text-accent md:text-lg">
                      {nextMission.title}
                    </div>
                    {nextMission.progress > 0 && (
                      <div className="mt-3 h-1.5 max-w-xs overflow-hidden rounded-full bg-accent-dim">
                        <div className="h-full rounded-full bg-accent" style={{ width: `${nextMission.progress}%` }} />
                      </div>
                    )}
                  </div>
                  <ChevronRight className="h-6 w-6 shrink-0 text-text-muted transition-colors group-hover:text-accent md:h-7 md:w-7" />
                </Link>
              </motion.section>
            )}

            {/* ══ PROGRAMS — one enrolled: quick jump only (overall % lives in hub card). Several: per-card progress. ══ */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.25, ease: 'easeOut' }}
            >
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-text-primary md:text-base">
                  <Terminal className="h-5 w-5 text-accent md:h-6 md:w-6" />
                  {multipleEnrolledBootcamps ? 'Your programs' : 'Your program'}
                </h2>
                <Link
                  to="/bootcamps"
                  className="text-xs font-black uppercase tracking-widest text-accent hover:underline md:text-sm"
                >
                  View all →
                </Link>
              </div>

              <div className={multipleEnrolledBootcamps ? 'grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6' : ''}>
                {loading ? (
                  multipleEnrolledBootcamps ? (
                    [0, 1].map((i) => (
                      <div key={i} className="animate-pulse overflow-hidden rounded-2xl border-2 border-border bg-bg-card">
                        <div className="h-40 bg-accent-dim/30" />
                        <div className="space-y-2 p-5">
                          <div className="h-4 w-3/4 rounded bg-accent-dim/30" />
                          <div className="h-3 w-1/2 rounded bg-accent-dim/20" />
                          <div className="mt-4 h-2 w-full rounded-full bg-accent-dim/20" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="animate-pulse overflow-hidden rounded-2xl border-2 border-border bg-bg-card">
                      <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center md:p-8">
                        <div className="mx-auto h-28 w-28 shrink-0 rounded-2xl bg-accent-dim/40 sm:mx-0" />
                        <div className="flex-1 space-y-3">
                          <div className="mx-auto h-4 w-48 rounded bg-accent-dim/30 sm:mx-0" />
                          <div className="mx-auto h-3 w-full max-w-md rounded bg-accent-dim/20 sm:mx-0" />
                        </div>
                      </div>
                    </div>
                  )
                ) : enrolledBootcamps.length === 0 ? (
                  <div className="rounded-2xl border-2 border-dashed border-border bg-bg-card/50 p-10 text-center md:p-14">
                    <BookOpen className="mx-auto mb-4 h-12 w-12 text-text-muted opacity-50 md:h-14 md:w-14" />
                    <p className="mb-6 text-base text-text-muted md:text-lg">No bootcamps enrolled yet.</p>
                    <Link to="/bootcamps" className="btn-primary inline-flex items-center gap-2 px-8 py-3 text-sm font-black uppercase md:text-base">
                      Browse bootcamps <ArrowRight className="h-5 w-5" />
                    </Link>
                  </div>
                ) : !multipleEnrolledBootcamps ? (
                  enrolledBootcamps.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.2 }}
                    >
                      <Link
                        to={`/bootcamps/${item.id}`}
                        className="group flex flex-col items-center gap-5 rounded-2xl border-2 border-border bg-bg-card p-6 transition-all hover:border-accent/40 sm:flex-row sm:items-stretch md:gap-8 md:p-8"
                        style={{ boxShadow: 'inset 0 1px 0 rgba(183,255,153,0.05)' }}
                      >
                        <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-2xl bg-accent-dim/25 sm:h-auto sm:w-44 md:w-52">
                          <img
                            src={item.img}
                            alt=""
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div aria-hidden className="scanlines pointer-events-none absolute inset-0" />
                          {item.level && (
                            <div className="absolute left-3 top-3 rounded-lg border border-border bg-bg/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-text-muted backdrop-blur-sm">
                              {item.level}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1 text-center sm:text-left">
                          <p className="mb-1 text-xs font-black uppercase tracking-widest text-text-muted">Resume</p>
                          <h3 className="mb-2 text-xl font-black text-text-primary transition-colors group-hover:text-accent md:text-2xl">
                            {item.title}
                          </h3>
                          {item.description && (
                            <p className="mb-3 line-clamp-2 text-sm text-text-muted md:text-base">{item.description}</p>
                          )}
                          <div className="mb-3 flex flex-wrap items-center justify-center gap-3 text-xs font-bold uppercase text-text-muted sm:justify-start">
                            {item.duration && <span>{item.duration}</span>}
                            {item.priceLabel && (
                              <>
                                <span className="opacity-40">·</span>
                                <span className="text-accent">{item.priceLabel}</span>
                              </>
                            )}
                          </div>
                          {item.currentModule && (
                            <p className="text-sm font-bold text-text-secondary md:text-base">
                              <span className="text-accent">▶</span> {item.currentModule}
                            </p>
                          )}
                        </div>
                        <ArrowRight className="h-8 w-8 shrink-0 text-text-muted transition-colors group-hover:translate-x-1 group-hover:text-accent sm:self-center" />
                      </Link>
                    </motion.div>
                  ))
                ) : (
                  enrolledBootcamps.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.2 + idx * 0.06 }}
                    >
                      <Link
                        to={`/bootcamps/${item.id}`}
                        className="group flex flex-col overflow-hidden rounded-2xl border-2 border-border bg-bg-card transition-all hover:border-accent/40"
                        style={{ boxShadow: 'inset 0 1px 0 rgba(183,255,153,0.04)' }}
                      >
                        <div className="relative h-40 overflow-hidden bg-accent-dim/20 md:h-44">
                          <img
                            src={item.img}
                            alt={item.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div aria-hidden className="scanlines pointer-events-none absolute inset-0" />
                          <div
                            aria-hidden
                            className="pointer-events-none absolute bottom-0 left-0 right-0 h-20"
                            style={{ background: 'linear-gradient(to top, var(--color-bg-card), transparent)' }}
                          />
                          <div className="absolute right-3 top-3 rounded-lg border border-border bg-bg/85 px-2.5 py-1 font-mono text-xs font-black text-accent backdrop-blur-sm">
                            {item.progress}%
                          </div>
                          {item.level && (
                            <div className="absolute left-3 top-3 rounded-lg border border-border bg-bg/85 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-text-muted backdrop-blur-sm">
                              {item.level}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col gap-2 p-5 md:p-6">
                          <h4 className="text-base font-black leading-snug text-text-primary transition-colors group-hover:text-accent md:text-lg">
                            {item.title}
                          </h4>
                          {item.description && (
                            <p className="line-clamp-2 text-sm leading-relaxed text-text-muted">{item.description}</p>
                          )}
                          <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] font-bold uppercase text-text-muted">
                            {item.duration && <span>{item.duration}</span>}
                            {item.priceLabel && (
                              <>
                                <span className="opacity-40">·</span>
                                <span className="text-accent">{item.priceLabel}</span>
                              </>
                            )}
                          </div>
                          {item.currentModule && (
                            <div className="truncate text-xs text-text-muted">
                              <span className="font-black text-accent">▶</span> {item.currentModule}
                            </div>
                          )}
                          <div className="mt-auto pt-4">
                            <div className="relative h-2 overflow-hidden rounded-full" style={{ background: 'var(--color-accent-dim)' }}>
                              <div
                                className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                                style={{
                                  width: `${item.progress}%`,
                                  background: 'var(--color-accent)',
                                  boxShadow: '0 0 10px var(--color-accent-glow)',
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
          <aside className="hidden w-16 shrink-0 flex-col items-center justify-center gap-4 self-stretch lg:flex">
            {RAIL_LINKS.map(({ icon: Icon, path, label }) => (
              <Link
                key={path}
                to={path}
                aria-label={label}
                title={label}
                className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-border bg-bg-card text-text-muted transition-all hover:border-accent/40 hover:bg-accent-dim/30 hover:text-accent"
                style={{ boxShadow: 'inset 0 1px 0 rgba(183,255,153,0.05)' }}
              >
                <Icon className="h-6 w-6" />
              </Link>
            ))}
          </aside>

        </div>
      </div>
    </div>
  );
};


export default Dashboard;
