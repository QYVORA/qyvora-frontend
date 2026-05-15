import React, { useEffect, useState } from 'react';
import { BookOpen, Lock, ArrowRight, Terminal, Flag, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import api from '../../../core/services/api';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import { CardMedia } from '../../../shared/components/ui/Card';
import { resolveImg } from '../../../shared/utils/resolveImg';
import Footer from '../components/layout/Footer';
import BinaryStreamBackground from '../../../shared/components/BinaryStreamBackground';

const CACHE_KEY = 'hsociety_bootcamps_public_cache_v1';

const BOOTCAMP_COVER_IMGS: Record<string, string> = {
  bc_1775270338500: '/assets/bootcamp/hpb-cover.webp',
};
const PHASE_IMGS = [
  '/assets/bootcamp/rooms/hacker-mindset.webp',
  '/assets/bootcamp/rooms/linux-foundations.webp',
  '/assets/bootcamp/rooms/networking.webp',
  '/assets/bootcamp/rooms/web-and-backend-systems.webp',
  '/assets/bootcamp/rooms/social-engineering.webp',
];

type BootcampLevel = 'Novice' | 'Operator' | 'Specialist' | 'Elite';
const VALID_LEVELS: BootcampLevel[] = ['Novice', 'Operator', 'Specialist', 'Elite'];
const LEVEL_COLORS: Record<BootcampLevel, string> = {
  Novice:     'bg-accent-dim text-accent border-border-strong backdrop-blur-sm',
  Operator:   'bg-accent-dim text-accent border-border-strong backdrop-blur-sm',
  Specialist: 'bg-accent-dim text-accent border-border-strong backdrop-blur-sm',
  Elite:      'bg-accent-dim text-accent border-border-strong backdrop-blur-sm',
};

// Each snap section fills the full container height and scrolls its own content
const Snap: React.FC<{ id: string; children: React.ReactNode; className?: string }> = ({
  id, children, className = '',
}) => {
  const shouldReduceMotion = useReducedMotion();
  return (
    <section
      id={id}
      className={`ascii-section md:snap-start md:h-full md:flex-shrink-0 md:overflow-hidden flex flex-col justify-center ${className}`}
    >
      <BinaryStreamBackground />
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 40, filter: 'blur(6px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], filter: { duration: 0.45 } }}
        className="w-full md:h-full md:overflow-y-auto md:overflow-x-hidden"
        style={{ scrollbarWidth: 'none' }}
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
    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1.5 text-text-muted hover:text-accent transition-colors"
  >
    <span className="text-[10px] font-bold uppercase tracking-[0.25em]">Scroll</span>
    <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}>
      <ChevronDown className="w-6 h-6" />
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
        className="ascii-section md:snap-start md:h-full md:flex-shrink-0 relative flex items-center md:overflow-hidden scanlines bg-bg min-h-[85vh] md:min-h-0"
      >
        <BinaryStreamBackground />
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
            <span className="ascii-kicker mb-3 block md:text-sm">
              // ARSENAL
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-text-primary leading-tight mb-4">
              Bootcamps Built{' '}
              <span className="text-accent">For Operators.</span>
            </h1>
            <p className="text-text-secondary text-base md:text-lg leading-relaxed mb-8 max-w-lg">
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
          </div>

          <ScrollHint targetId="bc-grid" containerId="bc-scroll" />
        </section>

        <Snap id="bc-grid" className="bg-bg-card border-y border-border">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
            {loading ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="terminal-card card-hsociety p-4 animate-pulse overflow-hidden">
                    <div className="aspect-video rounded bg-accent-dim/30 mb-4" />
                    <div className="h-3 bg-accent-dim/30 rounded w-1/4 mb-2" />
                    <div className="h-4 bg-accent-dim/30 rounded w-3/4 mb-3" />
                    <div className="h-3 bg-accent-dim/20 rounded w-1/2 mb-4" />
                    <div className="h-9 bg-accent-dim/20 rounded w-full" />
                  </div>
                ))}
              </div>
            ) : bootcamps.length === 0 ? (
              <div className="terminal-card relative overflow-hidden rounded-lg border border-dashed border-border py-20 text-center">
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
                  return (
                    <ScrollReveal key={bc.id || i} delay={i * 0.08}>
                      <CardMedia
                        image={image}
                        imageAlt={bc.title}
                        imageAspect="aspect-video"
                        imageBadges={
                          <div className="absolute top-2 right-2">
                            <span className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase border tracking-widest ${LEVEL_COLORS[level]}`}>
                              {isLocked ? 'Coming soon' : level}
                            </span>
                          </div>
                        }
                        imageClassName="opacity-75 group-hover:opacity-90 transition-all duration-700"
                        className="h-full border-border bg-bg-card hover:border-border-strong"
                      >
                        <div className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-accent">
                          <BookOpen className="h-3.5 w-3.5" />
                          Operator training
                        </div>
                        <h3 className="mb-2 text-base font-black leading-snug text-text-primary transition-colors duration-300 group-hover:text-accent">
                          {bc.title || 'Bootcamp'}
                        </h3>
                        {bc.description && (
                          <p className="mb-4 line-clamp-3 text-xs leading-relaxed text-text-secondary">
                            {bc.description}
                          </p>
                        )}
                        <div className="mt-auto grid grid-cols-2 gap-2 border-t border-border pt-4 text-xs">
                          <div>
                            <span className="block text-[10px] font-bold uppercase tracking-widest text-text-muted">Duration</span>
                            <span className="mt-1 block font-mono text-text-primary">{bc.duration || 'Self-paced'}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] font-bold uppercase tracking-widest text-text-muted">Access</span>
                            <span className="mt-1 block font-mono text-text-primary">{bc.priceLabel || 'Free'}</span>
                          </div>
                        </div>
                        {isLocked ? (
                          <div className="mt-4 flex w-full cursor-default items-center justify-center gap-2 btn-secondary !py-2 text-xs opacity-80">
                            <Lock className="w-3.5 h-3.5" /> Coming soon
                          </div>
                        ) : (
                          <Link to="/register" className="mt-4 flex w-full items-center justify-center gap-2 btn-primary !py-2 text-xs group/btn">
                            Enroll Now <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                          </Link>
                        )}
                      </CardMedia>
                    </ScrollReveal>
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
            className="terminal-card relative overflow-hidden rounded-lg border border-border-strong bg-accent-dim p-8 text-center md:p-12"
          >
            <motion.div
              className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <span className="ascii-kicker mb-3 block"> // Operator access</span>
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
