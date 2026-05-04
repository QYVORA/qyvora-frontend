import React, { useEffect, useState } from 'react';
import { BookOpen, Lock, ArrowRight, Terminal, Flag, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import api from '../../../core/services/api';
import { resolveImg } from '../../../shared/utils/resolveImg';
import Footer from '../components/layout/Footer';

const CACHE_KEY = 'hsociety_bootcamps_public_cache_v1';

const BOOTCAMP_COVER_IMGS: Record<string, string> = {
  bc_1775270338500: '/assets/bootcamp/hpb-cover.png',
};
const PHASE_IMGS = [
  '/assets/bootcamp/rooms/hacker-mindset.png',
  '/assets/bootcamp/rooms/linux-foundations.png',
  '/assets/bootcamp/rooms/networking.png',
  '/assets/bootcamp/rooms/web-and-backend-systems.png',
  '/assets/bootcamp/rooms/social-engineering.png',
];

type BootcampLevel = 'Novice' | 'Operator' | 'Specialist' | 'Elite';
const VALID_LEVELS: BootcampLevel[] = ['Novice', 'Operator', 'Specialist', 'Elite'];
const LEVEL_COLORS: Record<BootcampLevel, string> = {
  Novice:     'bg-bg/80 text-accent border-accent/30 backdrop-blur-sm',
  Operator:   'bg-bg/80 text-accent border-accent/30 backdrop-blur-sm',
  Specialist: 'bg-bg/80 text-accent border-accent/30 backdrop-blur-sm',
  Elite:      'bg-accent text-bg border-accent',
};

const CARD_VARIANTS = [
  { hidden: { opacity: 0, y: 60, x: -30, rotate: -4, scale: 0.88, filter: 'blur(8px)' } },
  { hidden: { opacity: 0, y: 80, x: 0,   rotate:  0, scale: 0.85, filter: 'blur(8px)' } },
  { hidden: { opacity: 0, y: 60, x: 30,  rotate:  4, scale: 0.88, filter: 'blur(8px)' } },
];
const CARD_VISIBLE = { opacity: 1, y: 0, x: 0, rotate: 0, scale: 1, filter: 'blur(0px)' };

const SkeletonCard = () => (
  <div className="overflow-hidden rounded-2xl border-2 border-border bg-bg-card animate-pulse">
    <div className="aspect-video bg-accent-dim/30" />
    <div className="space-y-3 p-6">
      <div className="h-3 w-1/4 rounded bg-accent-dim/30" />
      <div className="h-5 w-3/4 rounded bg-accent-dim/30" />
      <div className="h-3 w-1/2 rounded bg-accent-dim/20" />
      <div className="mt-4 h-11 w-full rounded-xl bg-accent-dim/20" />
    </div>
  </div>
);

// Each snap section fills the full container height and scrolls its own content
const Snap: React.FC<{ id: string; children: React.ReactNode; className?: string }> = ({
  id, children, className = '',
}) => {
  const shouldReduceMotion = useReducedMotion();
  return (
    <section
      id={id}
      className={`md:snap-start md:h-full md:flex-shrink-0 md:overflow-hidden flex flex-col justify-center ${className}`}
    >
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 40, filter: 'blur(6px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], filter: { duration: 0.45 } }}
        className="w-full"
      >
        {children}
      </motion.div>
    </section>
  );
};

const ScrollHint: React.FC<{ targetId: string; containerId: string }> = ({ targetId, containerId }) => (
  <motion.button
    onClick={() => {
      const container = document.getElementById(containerId);
      const target = document.getElementById(targetId);
      if (container && target) container.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
    }}
    aria-label="Scroll down"
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.6 }}
    className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1 text-text-muted hover:text-accent transition-colors"
  >
    <span className="text-[9px] font-bold uppercase tracking-[0.25em]">Scroll</span>
    <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}>
      <ChevronDown className="w-4 h-4" />
    </motion.div>
  </motion.button>
);

const PublicBootcampsPage: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [bootcamps, setBootcamps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) { const c = JSON.parse(raw); if (Array.isArray(c)) setBootcamps(c); }
    } catch { /* ignore */ }
    let mounted = true;
    api.get('/public/bootcamps')
      .then((res) => {
        if (!mounted) return;
        const items = Array.isArray(res.data?.items) ? res.data.items : [];
        setBootcamps(items);
        try { localStorage.setItem(CACHE_KEY, JSON.stringify(items)); } catch { /* ignore */ }
      })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  return (
    // This div fills the <main> flex child (h-full from PublicLayout)
    <div
      id="bc-scroll"
      className="w-full overflow-x-hidden md:h-full md:overflow-y-scroll md:snap-y md:snap-mandatory"
      style={{ scrollSnapType: undefined }}
    >

      {/* ── 1. Hero ── */}
      <section
        id="bc-hero"
        className="md:snap-start md:h-full md:flex-shrink-0 relative flex items-center md:overflow-hidden scanlines bg-bg min-h-[85vh] md:min-h-0"
      >
        <div className="absolute inset-0 bg-bg z-0 light-theme-hide-bg-base" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-accent/5 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute inset-0 dot-grid hero-dot-grid opacity-20 z-0" />
        <div className="absolute inset-0 bg-radial-vignette opacity-70 z-10" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-20 w-full py-16">
          <motion.div
            initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-5 px-3 py-1 border border-border bg-accent-dim rounded-sm w-fit">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">// ARSENAL</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-text-primary leading-tight mb-4">
              Bootcamps Built{' '}
              <span className="text-accent">For Operators.</span>
            </h1>
            <p className="text-text-secondary text-base md:text-lg leading-relaxed mb-8 max-w-2xl">
              Phased training tracks with mission-based checkpoints. Pick a program, enroll, and execute.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="btn-primary flex items-center gap-2">
                <Terminal className="w-4 h-4" /> Enroll Now
              </Link>
              <Link to="/ctf" className="btn-secondary flex items-center gap-2">
                <Flag className="w-4 h-4" /> CTF Arena
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-3 mt-10"
          >
            {['Hands-on Labs', 'CTF Challenges', 'CP Rewards', 'Operator Ranking'].map((label) => (
              <div key={label} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-card border border-border text-xs font-bold text-text-secondary">
                {label}
              </div>
            ))}
          </motion.div>
        </div>

        <ScrollHint targetId="bc-grid" containerId="bc-scroll" />
      </section>

      {/* ── 2. Bootcamp grid ── */}
      <Snap id="bc-grid" className="bg-bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 md:mb-12"
          >
            <span className="text-accent text-[11px] font-bold uppercase tracking-[0.3em] mb-2 block">// PROGRAMS</span>
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary">Choose Your Track</h2>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
              {[0, 1, 2].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : bootcamps.length === 0 ? (
            <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-border py-20 text-center">
              <BookOpen className="mx-auto mb-4 h-12 w-12 text-text-muted opacity-40" />
              <p className="text-text-muted md:text-lg">No bootcamps available yet. Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {bootcamps.map((bc, i) => {
                const isLocked = bc.isActive === false;
                const level: BootcampLevel = VALID_LEVELS.includes(bc.level) ? bc.level : 'Operator';
                const image = resolveImg(
                  bc.image,
                  BOOTCAMP_COVER_IMGS[String(bc.id || '')] ?? PHASE_IMGS[i % PHASE_IMGS.length],
                );
                const variant = CARD_VARIANTS[i % CARD_VARIANTS.length];
                return (
                  <motion.div
                    key={bc.id || i}
                    initial={shouldReduceMotion ? false : variant.hidden}
                    whileInView={CARD_VISIBLE}
                    viewport={{ once: false, amount: 0.1 }}
                    transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1], filter: { duration: 0.45 } }}
                    whileHover={shouldReduceMotion || isLocked ? {} : { y: -8, scale: 1.02, transition: { duration: 0.22 } }}
                    className={isLocked ? 'opacity-70' : ''}
                  >
                    <div className="card-hsociety group overflow-hidden flex flex-col hover:border-accent/40 transition-all h-full">
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={image} alt={bc.title}
                          className={`w-full h-full object-cover transition-transform duration-700 ${isLocked ? 'grayscale brightness-50' : 'group-hover:scale-110'}`}
                          onError={(e) => { const el = e.currentTarget; if (!el.dataset.fallbackApplied) { el.dataset.fallbackApplied = '1'; el.src = '/assets/bootcamp/hpb-cover.png'; } }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute top-3 left-3">
                          <span className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase border tracking-widest ${LEVEL_COLORS[level]}`}>
                            {isLocked ? 'Coming soon' : level}
                          </span>
                        </div>
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="text-base font-bold text-text-primary mb-1.5 group-hover:text-accent transition-colors duration-300">{bc.title || 'Bootcamp'}</h3>
                        {bc.description && <p className="text-xs text-text-muted line-clamp-2 mb-3">{bc.description}</p>}
                        <div className="flex items-center justify-between text-xs text-text-muted mb-4 mt-auto">
                          <span>{bc.duration || ''}</span>
                          <span className="text-text-secondary font-mono">{bc.priceLabel || 'Free'}</span>
                        </div>
                        {isLocked ? (
                          <div className="w-full btn-secondary !py-2 text-xs flex items-center justify-center gap-2 opacity-80 cursor-default">
                            <Lock className="w-3.5 h-3.5" /> Coming soon
                          </div>
                        ) : (
                          <Link to="/register" className="w-full btn-primary !py-2 text-xs flex items-center justify-center gap-2 group/btn">
                            Enroll Now <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </Snap>

      {/* ── 3. CTA + Footer ── */}
      <Snap id="bc-cta" className="bg-bg">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-16">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.94, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl border-2 border-accent/25 bg-accent-dim p-8 text-center md:p-12 relative overflow-hidden"
          >
            <motion.div
              className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <span className="mb-3 block text-xs font-black uppercase tracking-[0.35em] text-accent">Operator access</span>
            <h2 className="mb-3 text-3xl font-black text-text-primary md:text-4xl">Train. Earn. Rank up.</h2>
            <p className="mx-auto mb-8 max-w-md text-base text-text-muted">
              Enroll in a bootcamp, complete missions, earn Cyber Points, and climb the leaderboard.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link to="/register" className="btn-primary inline-flex items-center gap-2 px-8 py-3 text-sm group">
                Get started <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/leaderboard" className="btn-secondary inline-flex items-center gap-2 px-8 py-3 text-sm">
                View Leaderboard
              </Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </Snap>

    </div>
  );
};

export default PublicBootcampsPage;
