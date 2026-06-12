import React, { useEffect, useState } from 'react';
import { BookOpen, Lock, X, ChevronRight, Play, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import api from '../../../core/services/api';
import { resolveImg } from '../../../shared/utils/resolveImg';
import { formatSyncLabel, getLastSync, setLastSyncNow } from '../utils/studentExperience';
import { useScrollLock } from '../../../core/hooks/useScrollLock';
import PageLoader from '../../../shared/components/PageLoader';

// Bootcamp ID → cover image mapping (matches backend HACKER_PROTOCOL_BOOTCAMP_ID)
const BOOTCAMP_COVER_IMGS: Record<string, string> = {
  bc_1775270338500: '/assets/bootcamp/hpb-cover.webp',
};
// Fallback order for unknown bootcamps (index-based)
const PHASE_IMGS = [
  '/assets/bootcamp/rooms/hacker-mindset.webp',
  '/assets/bootcamp/rooms/linux-foundations.webp',
  '/assets/bootcamp/rooms/networking.webp',
  '/assets/bootcamp/rooms/web-and-backend-systems.webp',
  '/assets/bootcamp/rooms/social-engineering.webp',
];

interface LockedModalProps {
  bootcamp: any;
  onClose: () => void;
}

const LockedModal: React.FC<LockedModalProps> = ({ bootcamp, onClose }) => {
  useScrollLock();
  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />
    <div className="relative bg-transparent p-6 md:p-8 max-w-md w-full">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-bg-elevated text-text-muted hover:text-text-primary transition-all active:scale-90"
      >
        <X className="w-5 h-5" />
      </button>
      <div className="flex items-center justify-center w-20 h-20 rounded-3xl bg-accent-dim/10 mx-auto mb-8 shadow-sm">
        <Lock className="w-8 h-8 text-accent" />
      </div>
      <h3 className="text-2xl font-black text-text-primary text-center mb-3 uppercase tracking-tight">{bootcamp.title}</h3>
      <p className="text-text-muted text-sm text-center mb-2">Program not yet initialized.</p>
      <p className="text-accent text-xs font-black text-center mb-8 uppercase tracking-[0.2em]">
        Launch Sequence: {bootcamp.launchDate
          ? new Date(bootcamp.launchDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
          : 'Pending Authorization'}
      </p>
      <p className="text-text-muted/60 text-xs text-center mb-10 font-mono leading-relaxed px-4">
        This operation is currently classified. Our operatives are finalizing the deployment environment.
      </p>
      <button onClick={onClose} className="w-full bg-bg-elevated text-text-primary py-4 rounded-xl text-xs font-black uppercase tracking-widest active:scale-[0.98] transition-all">Understood</button>
    </div>
  </div>
);
};

const Bootcamp: React.FC = () => {
  const [bootcamps, setBootcamps] = useState<any[]>([]);
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lockedBootcamp, setLockedBootcamp] = useState<any>(null);
  const [syncError, setSyncError] = useState('');
  const [lastSync, setLastSync] = useState<string | null>(getLastSync('bootcamps'));

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

  const enrolledIds = new Set<string>(
    (Array.isArray(overview?.modules) ? overview.modules : []).map((m: any) =>
      String(m.bootcampId || m.id || '')
    )
  );

  if (overview?.bootcampStatus && overview.bootcampStatus !== 'not_enrolled' && overview?.bootcampId) {
    enrolledIds.add(String(overview.bootcampId));
  }

  const moduleProgressById = new Map<string, any>(
    (Array.isArray(overview?.modules) ? overview.modules : []).map((m: any) => [
      String(m.bootcampId || m.id || ''),
      m,
    ])
  );

  if (loading) return <PageLoader />;

  return (
    <div className="bg-bg overflow-x-hidden">
      <AnimatePresence>
        {lockedBootcamp && (
          <LockedModal bootcamp={lockedBootcamp} onClose={() => setLockedBootcamp(null)} />
        )}
      </AnimatePresence>

      <div className="lg:fixed lg:left-0 lg:right-0 lg:bottom-0 lg:top-24 lg:overflow-y-auto lg:overscroll-contain overflow-x-hidden scroll-hover">
        <div className="mx-auto max-w-7xl px-0 pt-6 pb-16 md:px-8">
          <ScrollReveal className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end px-1 md:px-0">
             <div>
               <div className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-accent">Arsenal</div>
               <h1 className="text-4xl font-black text-text-primary md:text-6xl">Bootcamps</h1>
               <p className="mt-2 max-w-lg text-base text-text-muted">
                 Phased training tracks with mission-based checkpoints. Pick a program and execute.
               </p>
             </div>
             <p className={`text-xs shrink-0 ${syncError ? 'text-red-400' : 'text-text-muted'}`}>
               {syncError || formatSyncLabel(lastSync)}
             </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 px-1 md:px-0">
            {bootcamps.map((bc, i) => {
              const prog = moduleProgressById.get(String(bc.id || ''));
              const isEnrolled = enrolledIds.has(String(bc.id || ''));
              const isLocked = bc.isActive === false;
              const progress = Number(prog?.progress || 0);
              const isComplete = progress === 100;
              const image = resolveImg(bc.image, BOOTCAMP_COVER_IMGS[String(bc.id || '')] ?? PHASE_IMGS[i % PHASE_IMGS.length]);
              const level = bc.level || 'Operator';

              return (
                <motion.div
                  key={bc.id || i}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className={`w-full ${isLocked ? 'opacity-40' : ''}`}
                >
                  <div
                    className="group overflow-hidden flex flex-col w-full border border-border/40 bg-bg-card rounded-2xl transition-all duration-300 hover:border-accent/30 hover:scale-[1.01]"
                    onClick={isLocked ? () => setLockedBootcamp(bc) : undefined}
                  >
                    <div className="relative aspect-video overflow-hidden rounded-t-2xl shadow-sm">
                      <img
                        src={image} alt={bc.title}
                        className={`w-full h-full object-cover transition-transform duration-500 ${isLocked ? 'grayscale brightness-50' : 'group-hover:scale-105'}`}
                      />
                      <div className="absolute top-4 left-4">
                        <span className={`px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest shadow-sm ${level === 'Elite' ? 'bg-accent text-bg' : 'bg-bg/85 text-accent backdrop-blur-sm'}`}>
                          {isLocked ? 'Coming soon' : level}
                        </span>
                      </div>
                      {!isLocked && isComplete && (
                        <div className="absolute top-4 right-4">
                          <span className="px-2.5 py-1 bg-accent text-bg rounded text-[9px] font-black uppercase tracking-widest flex items-center gap-1 shadow-md">
                            <CheckCircle2 className="w-3 w-3" /> Complete
                          </span>
                        </div>
                      )}
                      {!isLocked && isEnrolled && !isComplete && (
                        <div className="absolute top-4 right-4">
                          <span className="px-2.5 py-1 bg-accent/20 text-accent rounded text-[9px] font-black uppercase tracking-widest flex items-center gap-1 backdrop-blur-sm shadow-sm">
                            <Play className="w-2.5 w-2.5 fill-current" /> Active
                          </span>
                        </div>
                      )}
                      {progress > 0 && !isLocked && (
                        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-bg/40">
                          <div className="h-full bg-accent transition-all duration-700 shadow-[0_0_8px_var(--color-accent)]" style={{ width: `${progress}%` }} />
                        </div>
                      )}
                    </div>

                    <div className="pt-5 pb-2 px-1 flex flex-col flex-1">
                      <h3 className="text-lg font-black text-text-primary mb-1.5 group-hover:text-accent transition-colors tracking-tight">
                        {bc.title || 'Bootcamp'}
                      </h3>
                      {bc.description && (
                        <p className="text-xs text-text-muted/70 line-clamp-2 mb-4 font-mono leading-relaxed">{bc.description}</p>
                      )}
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-text-muted/60 mt-auto mb-6">
                        <span>{bc.duration || 'Flexible'}</span>
                        <span className="text-accent">{bc.priceLabel || 'Free Access'}</span>
                      </div>

                      {isLocked ? (
                        <button className="w-full bg-bg-elevated text-text-muted rounded-xl py-3.5 text-xs font-black uppercase tracking-widest opacity-60 cursor-default flex items-center justify-center gap-2">
                          <Lock className="h-4 w-4" /> Coming soon
                        </button>
                      ) : (
                        <Link
                          to={`/dashboard/bootcamps/${bc.id}`}
                          className="w-full bg-accent text-bg rounded-xl py-3.5 text-xs font-black uppercase tracking-widest shadow-lg shadow-accent/20 transition-all hover:brightness-110 active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                          {isComplete ? <><CheckCircle2 className="h-4 w-4" /> Review curriculum</> : isEnrolled ? <><Play className="h-4 w-4 fill-current" /> Continue training</> : <>Start Training <ChevronRight className="h-4 w-4" /></>}
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bootcamp;
