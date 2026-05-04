import React, { useEffect, useState } from 'react';
import { ShoppingBag, Search, Lock, ArrowRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import api from '../../../core/services/api';
import CpLogo from '../../../shared/components/CpLogo';
import { resolveImg } from '../../../shared/utils/resolveImg';
import Footer from '../components/layout/Footer';

const CACHE_KEY = 'hsociety_marketplace_public_cache_v2';

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

const SkeletonCard = () => (
  <div className="card-hsociety p-4 animate-pulse">
    <div className="aspect-square rounded bg-accent-dim/30 mb-4" />
    <div className="h-4 bg-accent-dim/30 rounded w-3/4 mb-2" />
    <div className="h-3 bg-accent-dim/20 rounded w-1/2 mb-6" />
    <div className="h-9 bg-accent-dim/20 rounded w-full" />
  </div>
);

const cardVariant = (i: number) => {
  const patterns = [
    { y: 50, x: -20, rotate: -3 },
    { y: 60, x: 0,   rotate:  0 },
    { y: 50, x: 20,  rotate:  3 },
    { y: 40, x: -10, rotate: -2 },
  ];
  const p = patterns[i % patterns.length];
  return {
    hidden: { opacity: 0, y: p.y, x: p.x, rotate: p.rotate, scale: 0.88, filter: 'blur(8px)' },
    visible: { opacity: 1, y: 0, x: 0, rotate: 0, scale: 1, filter: 'blur(0px)' },
  };
};

const PublicMarketplace: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) { const c = JSON.parse(raw); if (Array.isArray(c)) setProducts(c); }
    } catch { /* ignore */ }
    let mounted = true;
    api.get('/public/cp-products')
      .then((res) => {
        if (!mounted) return;
        const items = Array.isArray(res.data?.items) ? res.data.items : [];
        setProducts(items);
        try { localStorage.setItem(CACHE_KEY, JSON.stringify(items)); } catch { /* ignore */ }
      })
      .catch(() => { if (mounted && products.length === 0) setProducts([]); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const filtered = products.filter((p) =>
    !query ||
    p.title?.toLowerCase().includes(query.toLowerCase()) ||
    p.type?.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div
      id="mkt-scroll"
      className="w-full overflow-x-hidden md:h-full md:overflow-y-scroll md:snap-y md:snap-mandatory"
      style={{ scrollSnapType: undefined }}
    >

      {/* ── 1. Hero ── */}
      <section
        id="mkt-hero"
        className="md:snap-start md:h-full md:flex-shrink-0 relative flex items-center md:overflow-hidden scanlines bg-bg min-h-[85vh] md:min-h-0"
      >
        <div className="absolute inset-0 bg-bg z-0 light-theme-hide-bg-base" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute inset-0 dot-grid hero-dot-grid opacity-20 z-0" />
        <div className="absolute inset-0 bg-radial-vignette opacity-70 z-10" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-20 w-full py-16">
          <motion.div
            initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-5 px-3 py-1 border border-border bg-accent-dim rounded-sm w-fit">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">// ZERO-DAY VAULT</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-text-primary leading-tight mb-4">
              The Hacker{' '}
              <span className="text-accent">Economy.</span>
            </h1>
            <p className="text-text-secondary text-base md:text-lg leading-relaxed mb-8 max-w-2xl">
              Operator tooling, guides, and resources — earn Cyber Points and unlock the vault.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/login" className="btn-primary flex items-center gap-2">
                Sign in to purchase <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/cyber-points" className="btn-secondary flex items-center gap-2">
                Learn about CP
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-3 mt-10"
          >
            {['Operator Tools', 'Security Guides', 'CP Powered', 'Instant Access'].map((label) => (
              <div key={label} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-card border border-border text-xs font-bold text-text-secondary">
                {label}
              </div>
            ))}
          </motion.div>
        </div>

        <ScrollHint targetId="mkt-grid" containerId="mkt-scroll" />
      </section>

      {/* ── 2. Product grid ── */}
      <Snap id="mkt-grid" className="bg-bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-14">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4"
          >
            <div>
              <span className="text-accent text-[11px] font-bold uppercase tracking-[0.3em] mb-1 block">// PRODUCTS</span>
              <h2 className="text-2xl md:text-3xl font-bold text-text-primary">Zero-Day Market</h2>
              <p className="mt-1 text-sm text-text-muted">Earn CP and unlock the vault.</p>
            </div>
            <div className="relative w-full sm:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
              <input
                type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-xl border-2 border-border bg-bg py-2 pl-10 pr-4 text-sm text-text-primary transition-colors focus:border-accent focus:outline-none"
              />
            </div>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {[0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <ShoppingBag className="w-10 h-10 text-text-muted mx-auto mb-4 opacity-40" />
              <p className="text-text-muted text-sm">{query ? 'No products match your search.' : 'No products available yet.'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((prod, idx) => {
                const id = String(prod.id || '');
                const v = cardVariant(idx);
                return (
                  <motion.div
                    key={id || idx}
                    initial={shouldReduceMotion ? false : v.hidden}
                    whileInView={v.visible}
                    viewport={{ once: false, amount: 0.08 }}
                    transition={{ duration: 0.65, delay: Math.min(idx * 0.07, 0.5), ease: [0.16, 1, 0.3, 1], filter: { duration: 0.4 } }}
                    whileHover={shouldReduceMotion ? {} : { y: -8, scale: 1.03, transition: { duration: 0.22 } }}
                  >
                    <div className="card-hsociety p-4 flex flex-col h-full group">
                      <div className="relative aspect-square overflow-hidden rounded mb-3">
                        <img
                          src={resolveImg(prod.coverUrl, '/assets/sections/backgrounds/cyber-points-visual.jpeg')}
                          alt={prod.title}
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                        {prod.type && (
                          <div className="absolute top-2 right-2">
                            <span className="bg-bg/80 backdrop-blur-md border border-border rounded-sm px-1.5 py-0.5 text-[8px] font-bold uppercase text-accent tracking-widest">{prod.type}</span>
                          </div>
                        )}
                        {prod.isFree && (
                          <div className="absolute top-2 left-2">
                            <span className="bg-emerald-500/80 text-white rounded-sm px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest">FREE</span>
                          </div>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-text-primary mb-1 line-clamp-2 flex-1 group-hover:text-accent transition-colors duration-300">{prod.title}</h3>
                      {prod.description && <p className="text-[11px] text-text-muted line-clamp-2 mb-2">{prod.description}</p>}
                      <div className="mb-3">
                        {prod.isFree ? (
                          <span className="text-sm font-mono font-bold text-emerald-400 uppercase tracking-wider">FREE</span>
                        ) : (
                          <span className="text-sm font-mono font-bold text-accent inline-flex items-center gap-1">
                            {Number(prod.cpPrice || 0).toLocaleString()} <CpLogo className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                      <Link to="/login" className="w-full btn-secondary !py-2 text-xs flex items-center justify-center gap-2">
                        <Lock className="w-3 h-3" />
                        {prod.isFree ? 'Sign in to download' : 'Sign in to purchase'}
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </Snap>

      {/* ── 3. CTA + Footer ── */}
      <Snap id="mkt-cta" className="bg-bg">
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
            <h2 className="mb-3 text-3xl font-black text-text-primary md:text-4xl">Earn CP. Unlock the vault.</h2>
            <p className="mx-auto mb-8 max-w-md text-base text-text-muted">
              Complete bootcamp rooms to earn Cyber Points, then spend them on tools and guides in the market.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link to="/login" className="btn-primary inline-flex items-center gap-2 px-8 py-3 text-sm group">
                Get started <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/cyber-points" className="btn-secondary inline-flex items-center gap-2 px-8 py-3 text-sm">
                Learn about CP
              </Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </Snap>

    </div>
  );
};

export default PublicMarketplace;
