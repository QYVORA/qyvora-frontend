import React, { useEffect, useState } from 'react';
import { ShoppingBag, Search, Lock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import api from '../../../core/services/api';
import CpLogo from '../../../shared/components/CpLogo';
import { resolveImg } from '../../../shared/utils/resolveImg';

const CACHE_KEY = 'hsociety_marketplace_public_cache_v2';

const SkeletonCard = () => (
  <div className="card-hsociety p-4 animate-pulse">
    <div className="aspect-square rounded bg-accent-dim/30 mb-4" />
    <div className="h-4 bg-accent-dim/30 rounded w-3/4 mb-2" />
    <div className="h-3 bg-accent-dim/20 rounded w-1/2 mb-6" />
    <div className="h-9 bg-accent-dim/20 rounded w-full" />
  </div>
);

const PublicMarketplace: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [query, setQuery]       = useState('');

  useEffect(() => {
    // Hydrate from cache immediately
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const cached = JSON.parse(raw);
        if (Array.isArray(cached)) setProducts(cached);
      }
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
    p.type?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-bg pb-12">
      <div className="mx-auto max-w-7xl px-4 pt-8 md:px-8 md:pt-10">

        {/* Header */}
        <ScrollReveal className="mb-12 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <span className="mb-3 block text-xs font-black uppercase tracking-[0.35em] text-accent md:text-sm">
              Zero-day vault
            </span>
            <h1 className="text-4xl font-black text-text-primary md:text-6xl">Market</h1>
            <p className="mt-2 max-w-lg text-base text-text-muted">
              Operator tooling and guides — earn CP and unlock the vault.
            </p>
          </div>

          {/* Sign-in CTA + search */}
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Link
              to="/login"
              className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm whitespace-nowrap"
            >
              Sign in to purchase <ArrowRight className="h-4 w-4" />
            </Link>
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-xl border-2 border-border bg-bg-card py-2.5 pl-10 pr-4 text-sm text-text-primary transition-colors focus:border-accent focus:outline-none md:w-64"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
            </div>
          </div>
        </ScrollReveal>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            [0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)
          ) : filtered.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <ShoppingBag className="w-10 h-10 text-text-muted mx-auto mb-4 opacity-40" />
              <p className="text-text-muted text-sm">
                {query ? 'No products match your search.' : 'No products available yet.'}
              </p>
            </div>
          ) : (
            filtered.map((prod, idx) => {
              const id = String(prod.id || '');
              return (
                <ScrollReveal key={id || idx} delay={idx * 0.04}>
                  <div className="card-hsociety p-4 flex flex-col h-full group">
                    {/* Cover image */}
                    <div className="relative aspect-square overflow-hidden rounded mb-4">
                      <img
                        src={resolveImg(prod.coverUrl, '/assets/sections/backgrounds/cyber-points-visual.jpeg')}
                        alt={prod.title}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.03]"
                      />
                      {prod.type && (
                        <div className="absolute top-2 right-2">
                          <span className="bg-bg/80 backdrop-blur-md border border-border rounded-sm px-1.5 py-0.5 text-[8px] font-bold uppercase text-accent tracking-widest">
                            {prod.type}
                          </span>
                        </div>
                      )}
                      {prod.isFree && (
                        <div className="absolute top-2 left-2">
                          <span className="bg-emerald-500/80 text-white rounded-sm px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest">
                            FREE
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Title + description */}
                    <h3 className="text-sm font-bold text-text-primary mb-1 line-clamp-2 flex-1">
                      {prod.title}
                    </h3>
                    {prod.description && (
                      <p className="text-[11px] text-text-muted line-clamp-2 mb-3">
                        {prod.description}
                      </p>
                    )}

                    {/* Price */}
                    <div className="mb-4">
                      {prod.isFree ? (
                        <span className="text-sm font-mono font-bold text-emerald-400 uppercase tracking-wider">
                          FREE
                        </span>
                      ) : (
                        <span className="text-sm font-mono font-bold text-accent inline-flex items-center gap-1">
                          {Number(prod.cpPrice || 0).toLocaleString()}
                          <CpLogo className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>

                    {/* Locked CTA — sign in to unlock */}
                    <Link
                      to="/login"
                      className="w-full btn-secondary !py-2.5 text-xs flex items-center justify-center gap-2"
                    >
                      <Lock className="w-3 h-3" />
                      {prod.isFree ? 'Sign in to download' : 'Sign in to purchase'}
                    </Link>
                  </div>
                </ScrollReveal>
              );
            })
          )}
        </div>

        {/* Bottom CTA banner */}
        {!loading && filtered.length > 0 && (
          <ScrollReveal className="mt-16">
            <div className="rounded-3xl border-2 border-accent/25 bg-accent-dim p-8 text-center md:p-12">
              <span className="mb-3 block text-xs font-black uppercase tracking-[0.35em] text-accent">
                Operator access
              </span>
              <h2 className="mb-3 text-3xl font-black text-text-primary md:text-4xl">
                Earn CP. Unlock the vault.
              </h2>
              <p className="mx-auto mb-8 max-w-md text-base text-text-muted">
                Complete bootcamp rooms to earn Cyber Points, then spend them on tools and guides in the market.
              </p>
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link to="/login" className="btn-primary inline-flex items-center gap-2 px-8 py-3 text-sm">
                  Get started <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/cyber-points" className="btn-secondary inline-flex items-center gap-2 px-8 py-3 text-sm">
                  Learn about CP
                </Link>
              </div>
            </div>
          </ScrollReveal>
        )}

      </div>
    </div>
  );
};

export default PublicMarketplace;
