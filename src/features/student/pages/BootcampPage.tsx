import React, { useEffect, useState } from 'react';
import { BookOpen, Clock, ArrowRight, CheckCircle2, Lock, X, Users, ExternalLink, Layers, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import api from '../../../core/services/api';
import EnrollmentModal from '../components/EnrollmentModal';

import { resolveImg } from '../../../shared/utils/resolveImg';
import OptionalDecorImage from '../../../shared/components/OptionalDecorImage';
import { STUDENT_DECOR } from '../constants/studentDecorPaths';
import { getConfiguredCommunityLink } from '../constants/communityLinks';
import { formatSyncLabel, getDataSaverEnabled, getLastSync, setLastSyncNow } from '../utils/studentExperience';

// Bootcamp ID → cover image mapping (matches backend HACKER_PROTOCOL_BOOTCAMP_ID)
const BOOTCAMP_COVER_IMGS: Record<string, string> = {
  bc_1775270338500: '/assets/bootcamp/hpb-cover.png',
};
// Fallback order for unknown bootcamps (index-based)
const PHASE_IMGS = [
  '/assets/bootcamp/rooms/hacker-mindset.png',
  '/assets/bootcamp/rooms/linux-foundations.png',
  '/assets/bootcamp/rooms/networking.png',
  '/assets/bootcamp/rooms/web-and-backend-systems.png',
  '/assets/bootcamp/rooms/social-engineering.png',
];

interface LockedModalProps {
  bootcamp: any;
  onClose: () => void;
}

const LockedModal: React.FC<LockedModalProps> = ({ bootcamp, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
    <div className="relative bg-bg-card border border-border rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full border border-border hover:border-accent/50 text-text-muted hover:text-text-primary transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-accent-dim border border-accent/20 mx-auto mb-5">
        <Lock className="w-6 h-6 text-accent" />
      </div>
      <h3 className="text-lg font-black text-text-primary text-center mb-2 uppercase">{bootcamp.title}</h3>
      <p className="text-text-muted text-sm text-center mb-1">This bootcamp is not open yet.</p>
      <p className="text-accent text-xs font-bold text-center mb-5 uppercase tracking-wider">
        Launching: {bootcamp.launchDate
          ? new Date(bootcamp.launchDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
          : 'To be announced'}
      </p>
      <p className="text-text-secondary text-xs text-center mb-6">
        Join the community to get notified when this bootcamp opens.
      </p>
      <div className="flex flex-col gap-3">
        <a href={getConfiguredCommunityLink(String(bootcamp?.id || ''))} target="_blank" rel="noopener noreferrer"
          className="btn-primary text-sm text-center flex items-center justify-center gap-2">
          <Users className="w-4 h-4" /> Join the Community <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <button onClick={onClose} className="btn-secondary text-sm text-center">Got it</button>
      </div>
    </div>
  </div>
);

const Bootcamp: React.FC = () => {
  const [bootcamps, setBootcamps] = useState<any[]>([]);
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lockedBootcamp, setLockedBootcamp] = useState<any>(null);
  const [enrollTarget, setEnrollTarget] = useState<any>(null);
  const [syncError, setSyncError] = useState('');
  const [lastSync, setLastSync] = useState<string | null>(getLastSync('bootcamps'));
  const [dataSaver] = useState(getDataSaverEnabled());

  const load = async () => {
    try {
      const [bcRes, ovRes] = await Promise.all([
        api.get('/public/bootcamps'),
        api.get('/student/overview').catch(() => null),
      ]);
      setBootcamps(Array.isArray(bcRes.data?.items) ? bcRes.data.items : []);
      if (ovRes?.data) setOverview(ovRes.data);
      setLastSync(setLastSyncNow('bootcamps'));
      setSyncError('');
    } catch {
      setBootcamps([]);
      setSyncError('Could not refresh bootcamps. Showing the last available state.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    Promise.all([
      api.get('/public/bootcamps'),
      api.get('/student/overview').catch(() => null),
    ])
      .then(([bcRes, ovRes]) => {
        if (!mounted) return;
        setBootcamps(Array.isArray(bcRes.data?.items) ? bcRes.data.items : []);
        if (ovRes?.data) setOverview(ovRes.data);
        setLastSync(setLastSyncNow('bootcamps'));
        setSyncError('');
      })
      .catch(() => {
        if (mounted) setBootcamps([]);
        if (mounted) setSyncError('Could not refresh bootcamps. Showing the last available state.');
      })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  // Build enrolled set from overview — check both bootcampId and id fields
  const enrolledIds = new Set<string>(
    (Array.isArray(overview?.modules) ? overview.modules : []).map((m: any) =>
      String(m.bootcampId || m.id || '')
    )
  );

  // Also treat any non-'not_enrolled' bootcampStatus + bootcampId as enrolled
  if (overview?.bootcampStatus && overview.bootcampStatus !== 'not_enrolled' && overview?.bootcampId) {
    enrolledIds.add(String(overview.bootcampId));
  }

  const moduleProgressById = new Map<string, any>(
    (Array.isArray(overview?.modules) ? overview.modules : []).map((m: any) => [
      String(m.bootcampId || m.id || ''),
      m,
    ])
  );

  const handleEnrolled = async () => {
    // Re-fetch overview so the card state updates immediately without needing a page refresh
    try {
      const ovRes = await api.get('/student/overview');
      if (ovRes?.data) setOverview(ovRes.data);
    } catch {
      // silently ignore — the card will update on next load
    }
    setEnrollTarget(null);
  };

  return (
    <div className="min-h-screen bg-bg pb-8 overflow-x-hidden">
      <AnimatePresence>
        {lockedBootcamp && (
          <LockedModal bootcamp={lockedBootcamp} onClose={() => setLockedBootcamp(null)} />
        )}
        {enrollTarget && (
          <EnrollmentModal
            bootcamp={enrollTarget}
            onClose={() => setEnrollTarget(null)}
            onEnrolled={() => { void handleEnrolled(); }}
          />
        )}
      </AnimatePresence>

      <div className="mx-auto w-full max-w-[1400px] px-3.5 pt-20 sm:px-5 md:px-8 md:pt-24">
        <ScrollReveal className="mb-10 md:mb-12">
          <div className="relative overflow-hidden rounded-3xl border-2 border-border bg-bg-card p-6 sm:p-8 md:p-10">
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl" aria-hidden>
              <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-accent/14 blur-3xl" />
              <div className="absolute -bottom-20 right-0 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl" />
            </div>
            <OptionalDecorImage
              src={dataSaver ? undefined : STUDENT_DECOR.bootcampListMascot}
              className="pointer-events-none absolute bottom-0 right-0 z-[1] hidden max-h-[160px] w-auto opacity-95 sm:block md:max-h-[200px]"
            />
            <div className="relative z-10 max-w-5xl">
              <span className="mb-3 block text-xs font-black uppercase tracking-[0.35em] text-accent md:text-sm">// Arsenal</span>
              <h1 className="mb-3 text-3xl font-black uppercase tracking-tight text-text-primary sm:text-4xl md:text-5xl">
                Bootcamp Programs
              </h1>
              <p className="text-sm leading-relaxed text-text-secondary md:text-base">
                Structured, phased training tracks with mission-based checkpoints. Pick a program, enroll, and execute.
              </p>
              <p className={`mt-3 text-xs ${syncError ? 'text-red-400' : 'text-text-muted'}`}>
                {syncError || formatSyncLabel(lastSync)}
              </p>
            </div>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="overflow-hidden rounded-2xl border-2 border-border bg-bg-card animate-pulse">
                <div className="aspect-video bg-accent-dim/30" />
                <div className="space-y-3 p-6">
                  <div className="h-3 w-1/4 rounded bg-accent-dim/30" />
                  <div className="h-5 w-3/4 rounded bg-accent-dim/30" />
                  <div className="h-3 w-1/2 rounded bg-accent-dim/20" />
                  <div className="mt-4 h-11 w-full rounded-xl bg-accent-dim/20" />
                </div>
              </div>
            ))}
          </div>
        ) : bootcamps.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-border py-20 text-center">
            <BookOpen className="mx-auto mb-4 h-12 w-12 text-text-muted opacity-40" />
            <p className="text-text-muted md:text-lg">No bootcamps available yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
            {bootcamps.map((bc, i) => {
              const prog = moduleProgressById.get(String(bc.id || ''));
              const progress = Number(prog?.progress || 0);
              const isEnrolled = enrolledIds.has(String(bc.id || ''));
              const isComplete = progress === 100;
              const isLocked = bc.isActive === false;

              return (
                <ScrollReveal key={bc.id || i} delay={i * 0.07}>
                  <motion.div
                    whileHover={isLocked ? {} : { y: -2 }}
                    transition={{ duration: 0.18 }}
                    className={`group relative flex flex-col overflow-hidden rounded-2xl border-2 bg-bg-card transition-colors duration-200 ${
                      isLocked
                        ? 'border-border opacity-70'
                        : isEnrolled
                        ? 'border-accent/25 hover:border-accent/55'
                        : 'border-border hover:border-accent/40'
                    }`}
                    style={{ boxShadow: 'var(--card-shimmer)' }}
                  >
                    {/* Cover image */}
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={resolveImg(bc.image, BOOTCAMP_COVER_IMGS[String(bc.id || '')] ?? PHASE_IMGS[i % PHASE_IMGS.length])}
                        alt={bc.title}
                        loading="lazy"
                        className={`w-full h-full object-cover transition-all duration-500 ${
                          isLocked ? 'grayscale brightness-40' : 'group-hover:scale-[1.03]'
                        }`}
                        onError={(e) => {
                          const el = e.currentTarget;
                          if (!el.dataset.fallbackApplied) {
                            el.dataset.fallbackApplied = '1';
                            el.src = BOOTCAMP_COVER_IMGS[String(bc.id || '')] ?? PHASE_IMGS[i % PHASE_IMGS.length];
                          }
                        }}
                      />
                      {/* Bottom gradient for readability */}
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0"
                        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)' }}
                      />

                      {/* Top-left badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                        {bc.level && (
                          <span className="px-2 py-0.5 bg-bg/85 backdrop-blur-sm border border-border/80 rounded text-[9px] font-black uppercase text-accent tracking-widest">
                            {bc.level}
                          </span>
                        )}
                        {isLocked && (
                          <span className="px-2 py-0.5 bg-black/75 border border-border rounded text-[9px] font-black uppercase text-text-muted tracking-widest flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" /> Coming soon
                          </span>
                        )}
                        {isComplete && !isLocked && (
                          <span className="px-2 py-0.5 bg-accent text-bg rounded text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5" /> Complete
                          </span>
                        )}
                        {isEnrolled && !isComplete && !isLocked && (
                          <span className="px-2 py-0.5 bg-accent/20 border border-accent/35 text-accent rounded text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                            <Play className="w-2 h-2 fill-current" /> Active
                          </span>
                        )}
                      </div>

                      {/* Progress bar at bottom of image */}
                      {progress > 0 && !isLocked && (
                        <div className="absolute bottom-0 left-0 right-0">
                          <div className="h-[3px] bg-bg/40">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                              className="h-full bg-accent"
                              style={{ boxShadow: '0 0 6px var(--color-accent-glow)' }}
                            />
                          </div>
                          <div className="absolute bottom-2 right-3 font-mono text-[10px] font-black text-white/90">
                            {progress}%
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Card body */}
                    <div className="flex flex-1 flex-col p-5">
                      {/* Title */}
                      <h3 className={`mb-1.5 text-base font-black leading-snug transition-colors md:text-lg ${
                        isLocked ? 'text-text-muted' : 'text-text-primary group-hover:text-accent'
                      }`}>
                        {bc.title}
                      </h3>

                      {/* Description */}
                      {bc.description && (
                        <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-text-muted">{bc.description}</p>
                      )}

                      {/* Meta row */}
                      <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-bold uppercase text-text-muted">
                        {bc.duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 opacity-60" /> {bc.duration}
                          </span>
                        )}
                        {bc.duration && bc.priceLabel && <span className="opacity-30">·</span>}
                        {bc.priceLabel && <span className="text-accent">{bc.priceLabel}</span>}
                        <span className="flex items-center gap-1 ml-auto opacity-60">
                          <Layers className="w-3 h-3" /> 5 phases
                        </span>
                      </div>

                      {/* CTA */}
                      <div className="mt-auto space-y-2">
                        {isLocked ? (
                          <button
                            onClick={() => setLockedBootcamp(bc)}
                            className="btn-secondary flex w-full items-center justify-center gap-2 py-2.5 text-sm font-black uppercase opacity-80"
                          >
                            <Lock className="h-3.5 w-3.5" /> Coming soon
                          </button>
                        ) : isEnrolled ? (
                          <Link
                            to={`/bootcamps/${bc.id || i}`}
                            className="btn-primary flex w-full items-center justify-center gap-2 py-2.5 text-sm font-black uppercase"
                          >
                            {isComplete ? (
                              <><CheckCircle2 className="h-3.5 w-3.5" /> Review curriculum</>
                            ) : (
                              <><Play className="h-3.5 w-3.5 fill-current" /> Continue training</>
                            )}
                          </Link>
                        ) : (
                          <button
                            onClick={() => setEnrollTarget({ id: String(bc.id || i), title: bc.title })}
                            className="btn-primary flex w-full items-center justify-center gap-2 py-2.5 text-sm font-black uppercase"
                          >
                            Enroll now <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {!isLocked && (
                          <a
                            href={`https://wa.me/?text=${encodeURIComponent(`I'm joining ${bc.title} on HSOCIETY OFFSEC. Join my squad and let's build together.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex w-full items-center justify-center gap-1.5 text-[11px] font-bold text-text-muted hover:text-accent transition-colors py-1"
                          >
                            <Users className="w-3 h-3" /> Invite squad on WhatsApp
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bootcamp;
