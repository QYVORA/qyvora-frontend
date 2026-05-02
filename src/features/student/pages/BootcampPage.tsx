import React, { useEffect, useState } from 'react';
import { BookOpen, Lock, X, Users, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import api from '../../../core/services/api';
import EnrollmentModal from '../components/EnrollmentModal';
import StudentBootcampCard, { type StudentBootcampCardData } from '../components/StudentBootcampCard';
import { resolveImg } from '../../../shared/utils/resolveImg';
import { getConfiguredCommunityLink } from '../constants/communityLinks';
import { formatSyncLabel, getLastSync, setLastSyncNow } from '../utils/studentExperience';

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
    <div className="min-h-screen bg-bg pb-12 overflow-x-hidden">
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

      <div className="mx-auto max-w-7xl px-4 pt-8 md:px-8 md:pt-10">
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
          <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-border py-20 text-center">
            <img
              src="/assets/illustrations/bootcamp-operator.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute right-0 bottom-0 h-full w-auto object-contain object-right-bottom opacity-[0.06] select-none"
            />
            <BookOpen className="mx-auto mb-4 h-12 w-12 text-text-muted opacity-40" />
            <p className="text-text-muted md:text-lg">No bootcamps available yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
            {bootcamps.map((bc, i) => {
              const prog = moduleProgressById.get(String(bc.id || ''));
              const card: StudentBootcampCardData = {
                id:          String(bc.id || ''),
                title:       bc.title || 'Bootcamp',
                description: String(bc.description || '').trim(),
                level:       String(bc.level || '').trim(),
                duration:    String(bc.duration || '').trim(),
                priceLabel:  String(bc.priceLabel || '').trim(),
                progress:    Number(prog?.progress || 0),
                img:         resolveImg(bc.image, BOOTCAMP_COVER_IMGS[String(bc.id || '')] ?? PHASE_IMGS[i % PHASE_IMGS.length]),
                isEnrolled:  enrolledIds.has(String(bc.id || '')),
                isLocked:    bc.isActive === false,
              };
              return (
                <StudentBootcampCard
                  key={bc.id || i}
                  data={card}
                  index={i}
                  onEnroll={() => setEnrollTarget({ id: String(bc.id || i), title: bc.title })}
                  onLocked={() => setLockedBootcamp(bc)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bootcamp;
