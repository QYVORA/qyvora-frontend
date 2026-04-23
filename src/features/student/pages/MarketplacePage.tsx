import React, { useEffect, useState } from 'react';
import { ShoppingBag, Search, Loader2, Download, CheckCircle2 } from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import api from '../../../core/services/api';
import { useToast } from '../../../core/contexts/ToastContext';

const resolveImg = (value?: string, fallback = '') => {
  const src = String(value || '').trim();
  if (!src) return fallback;
  if (/^https?:\/\//i.test(src)) return src;
  const apiBase = String(import.meta.env.VITE_API_BASE_URL || '').trim();

  if (src.startsWith('/uploads/')) {
    if (/^https?:\/\//i.test(apiBase)) {
      const origin = apiBase.replace(/\/api\/?$/, '');
      return `${origin}${src}`;
    }
    if (apiBase.startsWith('/api')) {
      return `/api${src}`;
    }
  }

  const base = apiBase.replace(/\/api\/?$/, '');
  return `${base}${src.startsWith('/') ? '' : '/'}${src}`;
};

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
    let mounted = true;
    Promise.all([
      api.get('/public/cp-products'),
      api.get('/cp/balance').catch(() => null),
      api.get('/cp/transactions?limit=100').catch(() => null),
    ]).then(([prodRes, balRes, txRes]) => {
      if (!mounted) return;
      setProducts(Array.isArray(prodRes.data?.items) ? prodRes.data.items : []);
      if (balRes?.data?.balance !== undefined) setBalance(Number(balRes.data.balance));
      // Build set of purchased product IDs from transactions
      const txItems = Array.isArray(txRes?.data?.items) ? txRes.data.items : [];
      const purchasedIds = new Set<string>(
        txItems
          .filter((tx: any) => tx.type === 'purchase' && tx.productId)
          .map((tx: any) => String(tx.productId))
      );
      setPurchased(purchasedIds);
    }).catch(() => {
      if (mounted) setProducts([]);
    }).finally(() => {
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  const handlePurchase = async (product: any) => {
    const id = String(product._id || product.id || '');
    setPurchasing(id);
    try {
      await api.post('/cp/purchase', { productId: id });
      addToast(`${product.title} purchased successfully.`, 'success');
      setPurchased((prev) => new Set([...prev, id]));
      const balRes = await api.get('/cp/balance').catch(() => null);
      if (balRes?.data?.balance !== undefined) setBalance(Number(balRes.data.balance));
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Purchase failed. Check your CP balance.';
      addToast(msg, 'error');
    } finally {
      setPurchasing(null);
    }
  };

  const handleDownload = async (product: any) => {
    const id = String(product._id || product.id || '');
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
    <div className="min-h-screen bg-bg pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8">

        {/* Header */}
        <ScrollReveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-accent text-xs font-bold uppercase tracking-[0.3em] mb-3 block">// THE ECONOMY</span>
            <h1 className="text-4xl md:text-5xl font-black text-text-primary">Zero-Day Market</h1>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {balance !== null && (
              <div className="px-4 py-2 bg-accent-dim border border-accent/20 rounded-lg">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">Your Balance</span>
                <span className="text-lg font-black text-accent font-mono">{balance.toLocaleString()} CP</span>
              </div>
            )}
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="bg-bg-card border border-border rounded-lg py-2.5 pl-10 pr-4 text-sm text-text-primary focus:border-accent outline-none w-full md:w-56 transition-colors"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
            </div>
          </div>
        </ScrollReveal>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            [0,1,2,3,4,5].map((i) => <SkeletonCard key={i} />)
          ) : filtered.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <ShoppingBag className="w-10 h-10 text-text-muted mx-auto mb-4 opacity-40" />
              <p className="text-text-muted text-sm">
                {query ? 'No products match your search.' : 'No products available yet.'}
              </p>
            </div>
          ) : (
            filtered.map((prod, idx) => {
              const id = String(prod._id || prod.id || '');
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
                        className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-500"
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
                    </div>
                    <h3 className="text-sm font-bold text-text-primary mb-1 line-clamp-2 flex-1">{prod.title}</h3>
                    {prod.description && (
                      <p className="text-[11px] text-text-muted line-clamp-2 mb-3">{prod.description}</p>
                    )}
                    <div className="mb-4">
                      <span className="text-sm font-mono font-bold text-accent">{Number(prod.cpPrice || 0).toLocaleString()} CP</span>
                    </div>

                    {hasPurchased ? (
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
