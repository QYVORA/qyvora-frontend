import React, { useEffect, useState } from 'react';
import { ShoppingBag, Search, Loader2, Download, CheckCircle2 } from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import api from '../../../core/services/api';
import { useToast } from '../../../core/contexts/ToastContext';
import CpLogo from '../../../shared/components/CpLogo';

import { resolveImg } from '../../../shared/utils/resolveImg';

const CACHE_KEY = 'hsociety_marketplace_cache_v2';

const SkeletonCard = () => (
  <div className="card-hsociety p-4 animate-pulse">
    <div className="aspect-square rounded bg-accent-dim/30 mb-4" />
    <div className="h-4 bg-accent-dim/30 rounded w-3/4 mb-2" />
    <div className="h-3 bg-accent-dim/20 rounded w-1/2 mb-6" />
    <div className="h-9 bg-accent-dim/20 rounded w-full" />
  </div>
);

const Marketplace: React.FC = () => {
  const { addToast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [purchased, setPurchased] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState('');

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
    Promise.all([
      api.get('/public/cp-products'),
      api.get('/cp/balance').catch(() => null),
      api.get('/cp/transactions?limit=100').catch(() => null),
    ]).then(([prodRes, balRes, txRes]) => {
      if (!mounted) return;
      const items = Array.isArray(prodRes.data?.items) ? prodRes.data.items : [];
      setProducts(items);
      try { localStorage.setItem(CACHE_KEY, JSON.stringify(items)); } catch { /* ignore */ }
      if (balRes?.data?.balance !== undefined) setBalance(Number(balRes.data.balance));
      const txItems = Array.isArray(txRes?.data?.items) ? txRes.data.items : [];
      const purchasedIds = new Set<string>(
        txItems
          .filter((tx: any) => tx.type === 'purchase' && tx.productId)
          .map((tx: any) => String(tx.productId))
      );
      setPurchased(purchasedIds);
    }).catch(() => {
      if (mounted && products.length === 0) setProducts([]);
    }).finally(() => {
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  const handlePurchase = async (product: any) => {
    const id = String(product.id || '');
    setPurchasing(id);
    try {
      await api.post('/cp/purchase', { productId: id });
      addToast(`${product.title} purchased successfully.`, 'success');
      setPurchased((prev) => new Set([...prev, id]));
      const balRes = await api.get('/cp/balance').catch(() => null);
      if (balRes?.data?.balance !== undefined) setBalance(Number(balRes.data.balance));
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Purchase failed. Check your points balance.';
      addToast(msg, 'error');
    } finally {
      setPurchasing(null);
    }
  };

  const handleDownload = async (product: any) => {
    const id = String(product.id || '');
    setDownloading(id);
    try {
      const base = String(import.meta.env.VITE_API_BASE_URL || '/api');
      const url = `${base}/cp/products/${id}/download`;
      // Fetch with credentials so auth cookie is sent
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        addToast(data?.error || 'Download failed.', 'error');
        return;
      }
      const blob = await res.blob();
      const filename = product.fileName || `${product.title || 'product'}.pdf`;
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch {
      addToast('Download failed.', 'error');
    } finally {
      setDownloading(null);
    }
  };

  const filtered = products.filter((p) =>
    !query || p.title?.toLowerCase().includes(query.toLowerCase()) || p.type?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-bg pb-12">
      <div className="mx-auto max-w-7xl px-4 pt-8 md:px-8 md:pt-10">

        {/* Header */}
        <ScrollReveal className="mb-12 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <span className="mb-3 block text-xs font-black uppercase tracking-[0.35em] text-accent md:text-sm">Zero-day vault</span>
            <h1 className="text-4xl font-black text-text-primary md:text-6xl">Market</h1>
            <p className="mt-2 max-w-lg text-base text-text-muted">Spend CP on tooling and guides — loot for operators.</p>
          </div>
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            {balance !== null && (
              <div className="rounded-2xl border-2 border-accent/25 bg-accent-dim px-5 py-3">
                <span className="mb-1 block text-xs font-black uppercase tracking-widest text-text-muted">Balance</span>
                <span className="inline-flex items-center gap-2 font-mono text-2xl font-black text-accent md:text-3xl">
                  <CpLogo className="h-7 w-7" />
                  {balance.toLocaleString()}
                </span>
              </div>
            )}
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
            [0,1,2,3,4,5,6,7].map((i) => <SkeletonCard key={i} />)
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
              const isBuying = purchasing === id;
              const isDownloading = downloading === id;
              const hasPurchased = purchased.has(id);
              return (
                <ScrollReveal key={id || idx} delay={idx * 0.04}>
                  <div className="card-hsociety p-4 flex flex-col h-full group">
                    <div className="relative aspect-square overflow-hidden rounded mb-4">
                      <img
                        src={resolveImg(prod.coverUrl, '/images/how-it-works-section/Engagements-4Completed.webp')}
                        alt={prod.title}
                        className="w-full h-full object-cover transition-all duration-500"
                      />
                      {prod.type && (
                        <div className="absolute top-2 right-2">
                          <span className="bg-bg/80 backdrop-blur-md border border-border rounded-sm px-1.5 py-0.5 text-[8px] font-bold uppercase text-accent tracking-widest">
                            {prod.type}
                          </span>
                        </div>
                      )}
                      {hasPurchased && (
                        <div className="absolute top-2 left-2">
                          <span className="bg-accent text-bg rounded-sm px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5" /> Owned
                          </span>
                        </div>
                      )}
                      {prod.isFree && !hasPurchased && (
                        <div className="absolute top-2 left-2">
                          <span className="bg-emerald-500/80 text-white rounded-sm px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest">
                            FREE
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-text-primary mb-1 line-clamp-2 flex-1">{prod.title}</h3>
                    {prod.description && (
                      <p className="text-[11px] text-text-muted line-clamp-2 mb-3">{prod.description}</p>
                    )}
                    <div className="mb-4">
                      {prod.isFree ? (
                        <span className="text-sm font-mono font-bold text-emerald-400 uppercase tracking-wider">FREE</span>
                      ) : (
                        <span className="text-sm font-mono font-bold text-accent inline-flex items-center gap-1">{Number(prod.cpPrice || 0).toLocaleString()} <CpLogo className="w-3.5 h-3.5" /></span>
                      )}
                    </div>

                    {(hasPurchased || prod.isFree) ? (
                      <button
                        onClick={() => handleDownload(prod)}
                        disabled={isDownloading}
                        className="w-full btn-primary !py-2.5 text-xs flex items-center justify-center gap-2 disabled:opacity-60 !bg-accent/20 !border-accent/40 hover:!bg-accent/30"
                      >
                        {isDownloading ? (
                          <><Loader2 className="w-3 h-3 animate-spin" /> Downloading...</>
                        ) : (
                          <><Download className="w-3 h-3" /> Download</>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePurchase(prod)}
                        disabled={isBuying}
                        className="w-full btn-primary !py-2.5 text-xs flex items-center justify-center gap-2 disabled:opacity-60"
                      >
                        {isBuying ? (
                          <><Loader2 className="w-3 h-3 animate-spin" /> Processing...</>
                        ) : (
                          'Purchase Access'
                        )}
                      </button>
                    )}
                  </div>
                </ScrollReveal>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
