import React, { useEffect, useState } from 'react';
import { BookOpen, Clock, ArrowRight, CheckCircle2, Lock, X, Users, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
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
  bc_1775270338500: '/images/HPB-image.png',
};
// Fallback order for unknown bootcamps (index-based)
const PHASE_IMGS = [
  '/images/bootcamp-room-images/hackermindset.png',
  '/images/bootcamp-room-images/LinuxFoundations.png',
  '/images/bootcamp-room-images/networking.png',
  '/images/bootcamp-room-images/webandbackendsystems.png',
  '/images/bootcamp-room-images/socialengineering.png',
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
    <div className="min-h-screen bg-bg pb-8">
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

      <div className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 md:px-8 md:pt-24">
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
            <div className="relative z-10 max-w-3xl">
              <span className="mb-3 block text-xs font-black uppercase tracking-[0.35em] text-accent md:text-sm">Arsenal</span>
              <h1 className="mb-4 text-4xl font-black uppercase tracking-tight text-text-primary sm:text-5xl md:text-6xl">
                Bootcamp programs
              </h1>
              <p className="text-base leading-relaxed text-text-secondary md:text-lg">
                Pick a track with clear outcomes, enroll, and grind through phased labs with mission-based checkpoints.
              </p>
              <p className="mt-3 text-sm text-text-muted">
                {syncError || formatSyncLabel(lastSync)}
              </p>
            </div>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {[0, 1, 2, 3].map((i) => (
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {bootcamps.map((bc, i) => {
              const prog = moduleProgressById.get(String(bc.id || ''));
              const progress = Number(prog?.progress || 0);
              const isEnrolled = enrolledIds.has(String(bc.id || ''));
              const isComplete = progress === 100;
              const isLocked = bc.isActive === false;

              return (
                <ScrollReveal key={bc.id || i} delay={i * 0.08}>
                  <div
                    className={`group relative flex flex-col overflow-hidden rounded-2xl border-2 border-border bg-bg-card transition-all ${
                      isLocked ? 'opacity-75' : 'hover:border-accent/45'
                    }`}
                    style={{ boxShadow: 'inset 0 1px 0 rgba(183,255,153,0.04)' }}
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={resolveImg(bc.image, BOOTCAMP_COVER_IMGS[String(bc.id || '')] ?? PHASE_IMGS[i % PHASE_IMGS.length])}
                        alt={bc.title}
                        loading="lazy"
                        className={`w-full h-full object-cover transition-all duration-500 ${isLocked ? 'grayscale brightness-50' : ''}`}
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-2 flex-wrap">
                        {bc.level && (
                          <span className="px-2 py-0.5 bg-bg/80 backdrop-blur-sm border border-border rounded text-[9px] font-bold uppercase text-accent tracking-widest">
                            {bc.level}
                          </span>
                        )}
                        {isLocked && (
                          <span className="px-2 py-0.5 bg-black/70 border border-border rounded text-[9px] font-bold uppercase text-text-muted tracking-widest flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" /> Locked
                          </span>
                        )}
                        {isComplete && !isLocked && (
                          <span className="px-2 py-0.5 bg-accent text-bg rounded text-[9px] font-bold uppercase tracking-widest flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5" /> Done
                          </span>
                        )}
                        {isEnrolled && !isComplete && !isLocked && (
                          <span className="px-2 py-0.5 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded text-[9px] font-bold uppercase tracking-widest">
                            Enrolled
                          </span>
                        )}
                      </div>
                      {progress > 0 && !isLocked && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-bg/50">
                          <div className="h-full bg-accent transition-all" style={{ width: `${progress}%` }} />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-5 md:p-6">
                      <h3 className={`mb-2 text-lg font-black transition-colors md:text-xl ${isLocked ? 'text-text-muted' : 'text-text-primary group-hover:text-accent'}`}>
                        {bc.title}
                      </h3>
                      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-accent">
                        Outcome: Build practical offensive security execution skill
                      </p>
                      {bc.description && (
                        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-text-muted">{bc.description}</p>
                      )}
                      <div className="mb-5 flex flex-wrap items-center gap-3 text-[11px] font-bold uppercase text-text-muted">
                        {bc.duration && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {bc.duration}</span>}
                        {bc.priceLabel && <span>{bc.priceLabel}</span>}
                        {progress > 0 && !isLocked && <span className="text-accent ml-auto">{progress}% done</span>}
                      </div>

                      {isLocked ? (
                        <button
                          onClick={() => setLockedBootcamp(bc)}
                          className="btn-secondary mt-auto flex w-full items-center justify-center gap-2 py-3 text-sm font-black uppercase opacity-90"
                        >
                          <Lock className="h-4 w-4" /> Coming soon
                        </button>
                      ) : isEnrolled ? (
                        <Link
                          to={`/bootcamps/${bc.id || i}`}
                          className="btn-primary mt-auto flex w-full items-center justify-center gap-2 py-3 text-sm font-black uppercase"
                        >
                          {isComplete ? 'Review' : 'Continue'} <ArrowRight className="h-4 w-4" />
                        </Link>
                      ) : (
                        <button
                          onClick={() => setEnrollTarget({ id: String(bc.id || i), title: bc.title })}
                          className="btn-primary mt-auto flex w-full items-center justify-center gap-2 py-3 text-sm font-black uppercase"
                        >
                          Enroll now <ArrowRight className="h-4 w-4" />
                        </button>
                      )}
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(`I'm joining ${bc.title} on HSOCIETY OFFSEC. Join my squad and let's build together.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center justify-center gap-2 text-xs font-bold text-accent hover:underline"
                      >
                        Invite your squad on WhatsApp
                      </a>
                    </div>
                  </div>
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
