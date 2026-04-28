import React, { useEffect, useState } from 'react';
import { BookOpen, Clock, ArrowRight, CheckCircle2, Lock, X, Users, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import api from '../../../core/services/api';
import EnrollmentModal from '../components/EnrollmentModal';

import { resolveImg } from '../../../shared/utils/resolveImg';

const PHASE_IMGS = [
  '/HPB-image.png',
  '/HPB-image.png',
  '/HPB-image.png',
  '/HPB-image.png',
  '/HPB-image.png',
];

const COMMUNITY_LINK = 'https://chat.whatsapp.com/hsociety';

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
          : '1st May 2025'}
      </p>
      <p className="text-text-secondary text-xs text-center mb-6">
        Join the community to get notified when this bootcamp opens.
      </p>
      <div className="flex flex-col gap-3">
        <a href={COMMUNITY_LINK} target="_blank" rel="noopener noreferrer"
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

  const load = async () => {
    try {
      const [bcRes, ovRes] = await Promise.all([
        api.get('/public/bootcamps'),
        api.get('/student/overview').catch(() => null),
      ]);
      setBootcamps(Array.isArray(bcRes.data?.items) ? bcRes.data.items : []);
      if (ovRes?.data) setOverview(ovRes.data);
    } catch {
      setBootcamps([]);
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
      })
      .catch(() => { if (mounted) setBootcamps([]); })
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

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-20 md:pt-24">
        <ScrollReveal className="mb-10">
          <span className="text-accent text-xs font-bold uppercase tracking-[0.3em] mb-3 block">// ARSENAL</span>
          <h1 className="text-4xl md:text-5xl font-black text-text-primary mb-3">Bootcamp Programs</h1>
          <p className="text-text-secondary max-w-2xl text-sm">
            Phased bootcamp modules building practical offensive security skills from fundamentals to advanced operations.
          </p>
        </ScrollReveal>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="card-hsociety overflow-hidden animate-pulse">
                <div className="aspect-video bg-accent-dim/30" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-accent-dim/30 rounded w-1/4" />
                  <div className="h-4 bg-accent-dim/30 rounded w-3/4" />
                  <div className="h-3 bg-accent-dim/20 rounded w-1/2" />
                  <div className="h-10 bg-accent-dim/20 rounded w-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : bootcamps.length === 0 ? (
          <div className="py-20 text-center">
            <BookOpen className="w-10 h-10 text-text-muted mx-auto mb-4 opacity-40" />
            <p className="text-text-muted text-sm">No bootcamps available yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bootcamps.map((bc, i) => {
              const prog = moduleProgressById.get(String(bc.id || ''));
              const progress = Number(prog?.progress || 0);
              const isEnrolled = enrolledIds.has(String(bc.id || ''));
              const isComplete = progress === 100;
              const isLocked = bc.isActive === false;

              return (
                <ScrollReveal key={bc.id || i} delay={i * 0.08}>
                  <div className={`card-hsociety overflow-hidden flex flex-col group transition-all ${isLocked ? 'opacity-75' : 'hover:border-accent/40'}`}>
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={resolveImg(bc.image, PHASE_IMGS[i % PHASE_IMGS.length])}
                        alt={bc.title}
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

                    <div className="p-5 flex flex-col flex-1">
                      <h3 className={`text-base font-bold mb-2 transition-colors ${isLocked ? 'text-text-muted' : 'text-text-primary group-hover:text-accent'}`}>
                        {bc.title}
                      </h3>
                      {bc.description && (
                        <p className="text-xs text-text-muted line-clamp-2 mb-3">{bc.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-[10px] font-bold text-text-muted uppercase mb-4">
                        {bc.duration && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {bc.duration}</span>}
                        {bc.priceLabel && <span>{bc.priceLabel}</span>}
                        {progress > 0 && !isLocked && <span className="text-accent ml-auto">{progress}% done</span>}
                      </div>

                      {isLocked ? (
                        <button
                          onClick={() => setLockedBootcamp(bc)}
                          className="mt-auto w-full btn-secondary !py-2.5 text-xs flex items-center justify-center gap-2 opacity-80"
                        >
                          <Lock className="w-3.5 h-3.5" /> Coming Soon
                        </button>
                      ) : isEnrolled ? (
                        <Link
                          to={`/bootcamps/${bc.id || i}`}
                          className="mt-auto w-full btn-primary !py-2.5 text-xs flex items-center justify-center gap-2"
                        >
                          {isComplete ? 'Review' : 'Continue'} <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      ) : (
                        <button
                          onClick={() => setEnrollTarget({ id: String(bc.id || i), title: bc.title })}
                          className="mt-auto w-full btn-primary !py-2.5 text-xs flex items-center justify-center gap-2"
                        >
                          Enroll Now <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
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
