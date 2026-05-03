import React, { useEffect, useState } from 'react';
import { BookOpen, Lock, X, ChevronRight, Play, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import api from '../../../core/services/api';
import EnrollmentModal from '../components/EnrollmentModal';
import { resolveImg } from '../../../shared/utils/resolveImg';
import { formatSyncLabel, getLastSync, setLastSyncNow } from '../utils/studentExperience';
import type { BootcampLevel } from '../components/BootcampCard';

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
        Check back soon — this program will be available shortly.
      </p>
      <button onClick={onClose} className="btn-secondary text-sm text-center w-full">Got it</button>
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
    <div className="bg-bg overflow-x-hidden">
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

      <div
        className="lg:fixed lg:inset-x-0 lg:bottom-0 lg:top-24 lg:overflow-y-auto lg:overscroll-contain overflow-x-hidden"
        style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent 0px, black 24px)', maskImage: 'linear-gradient(to bottom, transparent 0px, black 24px)' }}
      >
        <div className="mx-auto max-w-7xl px-4 pt-6 pb-16 md:px-8">
        <ScrollReveal className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="mb-3 block text-xs font-black uppercase tracking-[0.35em] text-accent md:text-sm">Arsenal</span>
            <h1 className="text-4xl font-black text-text-primary md:text-6xl">Bootcamps</h1>
            <p className="mt-2 max-w-lg text-base text-text-muted">
              Phased training tracks with mission-based checkpoints. Pick a program and execute.
            </p>
          </div>
          <p className={`text-xs shrink-0 ${syncError ? 'text-red-400' : 'text-text-muted'}`}>
            {syncError || formatSyncLabel(lastSync)}
          </p>
        </ScrollReveal>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
            {[0].map((i) => (
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
          <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-border py-20 text-center">
            <img
              src="/assets/illustrations/bootcamp-operator.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute right-0 bottom-0 h-full w-auto object-contain object-right-bottom opacity-[0.10] select-none"
            />
            <BookOpen className="mx-auto mb-4 h-12 w-12 text-text-muted opacity-40" />
            <p className="text-text-muted md:text-lg">No bootcamps available yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
            {bootcamps.map((bc, i) => {
              const prog = moduleProgressById.get(String(bc.id || ''));
              const isEnrolled = enrolledIds.has(String(bc.id || ''));
              const isLocked = bc.isActive === false;
              const progress = Number(prog?.progress || 0);
              const isComplete = progress === 100;
              const image = resolveImg(bc.image, BOOTCAMP_COVER_IMGS[String(bc.id || '')] ?? PHASE_IMGS[i % PHASE_IMGS.length]);
              const level: BootcampLevel = (['Novice','Operator','Specialist','Elite'] as BootcampLevel[]).includes(bc.level) ? bc.level : 'Operator';

              return (
                <motion.div
                  key={bc.id || i}
                  initial={{ opacity: 0, y: 32, scale: 0.94, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={isLocked ? {} : { y: -6, scale: 1.01 }}
                  className={isLocked ? 'opacity-70' : ''}
                >
                  <div
                    className={`card-hsociety group overflow-hidden flex flex-col ${
                      isLocked ? 'cursor-default' : 'hover:border-accent/40 transition-all'
                    }`}
                    onClick={isLocked ? () => setLockedBootcamp(bc) : undefined}
                    role={isLocked ? 'button' : undefined}
                    tabIndex={isLocked ? 0 : undefined}
                    onKeyDown={isLocked ? (e) => e.key === 'Enter' && setLockedBootcamp(bc) : undefined}
                  >
                    {/* Cover image */}
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={image}
                        alt={bc.title}
                        className={`w-full h-full object-cover transition-transform duration-500 ${
                          isLocked ? 'grayscale brightness-50' : 'group-hover:scale-105'
                        }`}
                        onError={(e) => {
                          const el = e.currentTarget;
                          if (!el.dataset.fallbackApplied) {
                            el.dataset.fallbackApplied = '1';
                            el.src = '/assets/bootcamp/hpb-cover.png';
                          }
                        }}
                      />
                      {/* Level badge */}
                      <div className="absolute top-4 left-4">
                        <span className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase border tracking-widest ${
                          level === 'Elite' ? 'bg-accent text-bg border-accent' : 'bg-bg/80 text-accent border-accent/30 backdrop-blur-sm'
                        }`}>
                          {isLocked ? 'Coming soon' : level}
                        </span>
                      </div>
                      {/* Enrolled / complete badge */}
                      {!isLocked && isComplete && (
                        <div className="absolute top-4 right-4">
                          <span className="px-2 py-1 bg-accent text-bg rounded-sm text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Complete
                          </span>
                        </div>
                      )}
                      {!isLocked && isEnrolled && !isComplete && (
                        <div className="absolute top-4 right-4">
                          <span className="px-2 py-1 bg-accent/20 border border-accent/35 text-accent rounded-sm text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 backdrop-blur-sm">
                            <Play className="w-2.5 h-2.5 fill-current" /> Active
                          </span>
                        </div>
                      )}
                      {/* Progress bar */}
                      {progress > 0 && !isLocked && (
                        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-bg/40">
                          <div className="h-full bg-accent transition-all duration-700" style={{ width: `${progress}%` }} />
                        </div>
                      )}
                    </div>

                    {/* Card body */}
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-accent transition-colors">
                        {bc.title || 'Bootcamp'}
                      </h3>
                      {bc.description && (
                        <p className="text-xs text-text-muted line-clamp-2 mb-3">{bc.description}</p>
                      )}
                      <div className="flex items-center justify-between text-xs text-text-muted mb-6 mt-auto">
                        <span>{bc.duration || ''}</span>
                        <span className="text-text-secondary font-mono">{bc.priceLabel || 'Free'}</span>
                      </div>

                      {/* CTA */}
                      {isLocked ? (
                        <button className="w-full btn-secondary !py-2.5 text-xs flex items-center justify-center gap-2 opacity-80">
                          <Lock className="w-3.5 h-3.5" /> Coming soon
                        </button>
                      ) : isEnrolled ? (
                        <Link
                          to={`/dashboard/bootcamps/${bc.id}`}
                          className="w-full btn-primary !py-2.5 text-xs flex items-center justify-center gap-2"
                        >
                          {isComplete
                            ? <><CheckCircle2 className="w-3.5 h-3.5" /> Review curriculum</>
                            : <><Play className="w-3.5 h-3.5 fill-current" /> Continue training</>}
                        </Link>
                      ) : (
                        <button
                          onClick={() => setEnrollTarget({ id: String(bc.id || i), title: bc.title })}
                          className="w-full btn-primary !py-2.5 text-xs flex items-center justify-center gap-2"
                        >
                          Enroll Now <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Bootcamp;
