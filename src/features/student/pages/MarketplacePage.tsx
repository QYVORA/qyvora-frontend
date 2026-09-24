import React, { useEffect, useMemo, useState } from 'react';
import { ShoppingBag, Search, Loader2, Download, BookOpen, Zap, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import api, { getAccessToken } from '@/core/services/api';
import { useAuth } from '@/core/contexts/AuthContext';
import { useToast } from '@/core/contexts/ToastContext';
import SEO from '@/shared/components/SEO';
import CpLogo from '@/shared/components/CpLogo';
import { AuthImage } from '@/shared/components/ui';
import PageHeader from '@/shared/components/ui/PageHeader';
import EmptyState from '@/shared/components/ui/EmptyState';
import { extractCpBalance } from '@/shared/utils/cpBalance';
import { formatNumber } from '@/shared/utils/formatNumber';
import { MarketplaceSkeleton } from '../components/StudentSkeletons';

const CACHE_KEY = 'qyvora_marketplace_cache_v2';
const PAGE_SIZE = 10;

const Marketplace: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [purchased, setPurchased] = useState<Set<string>>(new Set());
  const [shakePurchase, setShakePurchase] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<'market' | 'history'>('market');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
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
      const txItems = Array.isArray(txRes?.data?.items) ? txRes.data.items : [];
      setTransactions(txItems);
      const dbBalance = extractCpBalance(balRes?.data) ?? user?.cp ?? 0;
      setBalance(dbBalance);
      const purchasedIds = new Set<string>(txItems.filter((tx: any) => tx.type === 'purchase' && tx.productId).map((tx: any) => String(tx.productId)));
      setPurchased(purchasedIds);
    }).catch(() => {
      if (mounted) { addToast("Failed to load marketplace", 'error'); if (products.length === 0) setProducts([]); }
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
      const [balRes, txRes] = await Promise.all([api.get('/cp/balance').catch(() => null), api.get('/cp/transactions?limit=100').catch(() => null)]);
      const dbBalance = extractCpBalance(balRes?.data) ?? 0;
      setBalance(dbBalance);
    } catch (err: any) {
      addToast(err?.response?.data?.error || "Purchase failed.", 'error');
      setShakePurchase(id);
    } finally {
      setPurchasing(null);
    }
  };

  const handleDownload = async (product: any) => {
    const id = String(product.id || '');
    setDownloading(id);
    try {
      const base = String(import.meta.env.VITE_API_BASE_URL || '/api');
      const token = getAccessToken();
      const res = await fetch(`${base}/cp/products/${id}/download`, {
        credentials: 'include',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) { addToast("Download failed.", 'error'); return; }
      const blob = await res.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = product.fileName || `${product.title || 'product'}.pdf`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch { addToast("Download failed.", 'error'); }
    finally { setDownloading(null); }
  };

  const filtered = products.filter((p) => !query || p.title?.toLowerCase().includes(query.toLowerCase()) || p.type?.toLowerCase().includes(query.toLowerCase()));

  const txRows = useMemo(() => {
    return transactions.map((tx: any, idx) => ({
      id: String(tx?._id || tx?.id || `TXN-${idx + 1}`),
      shortId: String(tx?._id || tx?.id || `TXN-${idx + 1}`).slice(-8).toUpperCase(),
      desc: String(tx?.note || tx?.type || 'Points transaction'),
      date: tx?.createdAt ? new Date(tx.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }) : '-',
      value: Number(tx?.points || 0),
    }));
  }, [transactions]);

  const visibleTxRows = txRows.slice(0, visibleCount);
  const hasMore = visibleCount < txRows.length;

  if (loading) return <MarketplaceSkeleton />;

  return (
    <div className="min-h-full bg-canvas">
      <SEO title={"Marketplace"} description={"Redeem your CyberPoints for gear, courses, and rewards."} noindex />
      <div className="w-full space-y-8 px-3 pb-16 md:px-4 md:pb-20 lg:px-6 lg:pb-24">
        <PageHeader
          kicker={"Marketplace"}
          title={"Marketplace"}
          description={"Redeem your CyberPoints."}
          metadata={
            balance !== null ? (
              <span className="type-meta flex items-center gap-1.5">
                <CpLogo className="h-3.5 w-3.5" />
                <span className="font-bold text-accent">{formatNumber(balance)}</span>
                {"CP Balance"}
              </span>
            ) : undefined
          }
        />

        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {tab === 'market' && (
              <div className="relative w-full sm:w-72">
                <input id="marketplace-search" type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={"Search items…"} className="w-full rounded-xl border border-border/40 bg-bg-card py-3 pl-11 pr-4 text-sm text-text-primary transition-colors outline-none focus:border-accent" />
                <label htmlFor="marketplace-search" className="sr-only">{"Search items…"}</label>
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              </div>
            )}

            <div className="flex items-center gap-1">
              <button
                onClick={() => setTab('market')}
                aria-pressed={tab === 'market'}
                className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-xl px-4 text-xs font-black uppercase tracking-widest transition-colors ${
                  tab === 'market'
                    ? 'bg-accent text-on-accent'
                    : 'text-text-muted hover:text-text-primary border border-border/40'
                }`}
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                {"All"}
              </button>
              <button
                onClick={() => setTab('history')}
                aria-pressed={tab === 'history'}
                className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-xl px-4 text-xs font-black uppercase tracking-widest transition-colors ${
                  tab === 'history'
                    ? 'bg-accent text-on-accent'
                    : 'text-text-muted hover:text-text-primary border border-border/40'
                }`}
              >
                <Zap className="h-3.5 w-3.5" />
                {"Market"}
              </button>
            </div>
          </div>

          {tab === 'market' ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {filtered.length === 0 ? (
                <div className="col-span-full">
                  <EmptyState
                    icon={<BookOpen className="h-6 w-6" />}
                    title={query ? "No items found." : "No items found."}
                  />
                </div>
              ) : (
                filtered.map((prod, idx) => {
                  const id = String(prod.id || '');
                  const hasPurchased = purchased.has(id);
                  return (
                    <motion.div key={id || idx} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}>
                      <div className="group flex flex-col overflow-hidden rounded-2xl border border-border-subtle bg-bg-card transition-colors duration-[var(--dur-base)] ease-[var(--ease-smooth)] hover:border-accent/40">
                        <div className="relative aspect-[16/9] overflow-hidden bg-accent/5">
                          <AuthImage
                            src={prod.coverUrl}
                            alt={prod.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                        <div className="flex flex-1 flex-col gap-3 p-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="type-meta inline-flex items-center gap-1 rounded-md border border-accent/20 bg-accent/10 px-2 py-1 text-accent">
                              <ShoppingBag className="h-3 w-3" /> {"Intelligence Asset"}
                            </span>
                            {hasPurchased && <span className="type-meta rounded-md bg-accent px-2 py-1 font-bold uppercase tracking-widest text-on-accent">{"Owned"}</span>}
                            {prod.isFree && !hasPurchased && <span className="type-meta rounded-md bg-accent px-2 py-1 font-bold uppercase tracking-widest text-on-accent">{"Public"}</span>}
                          </div>
                          <h3 className="text-sm font-black leading-snug tracking-tight text-text-primary transition-colors group-hover:text-accent sm:text-base lg:text-lg">
                            {prod.title}
                          </h3>
                          <p className="flex-1 text-xs leading-relaxed text-text-muted line-clamp-3 sm:text-sm">
                            {prod.description || "Secure intelligence report for offensive security operatives."}
                          </p>
                          <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                            <div className="flex items-center gap-1.5">
                              {prod.isFree ? (
                                <span className="type-meta font-bold uppercase tracking-widest text-accent">{"Free Access"}</span>
                              ) : (
                                <>
                                  <CpLogo className="h-4 w-4" />
                                  <span className="type-code font-black text-text-primary">{Number(prod.cpPrice || 0).toLocaleString()}</span>
                                </>
                              )}
                            </div>
                            {(hasPurchased || prod.isFree) ? (
                              <button
                                onClick={() => handleDownload(prod)}
                                disabled={downloading === id}
                                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-accent px-4 text-xs font-black uppercase tracking-widest text-on-accent transition-transform disabled:opacity-50 active:scale-95"
                              >
                                {downloading === id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                                {"Download"}
                              </button>
                            ) : (
                              <button
                                onClick={() => handlePurchase(prod)}
                                disabled={purchasing === id}
                                onAnimationEnd={() => setShakePurchase(null)}
                                className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-accent px-4 text-xs font-black uppercase tracking-widest text-on-accent transition-transform disabled:opacity-50 active:scale-95 ${shakePurchase === id ? 'animate-shake-x' : ''}`}
                              >
                                {purchasing === id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <><ShoppingBag className="h-3.5 w-3.5" /> {"Unlock"}</>}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          ) : (
            <div>
              <div className="overflow-hidden rounded-2xl border border-border-subtle bg-surface">
                <div className="flex items-center gap-2 border-b border-border-subtle px-5 py-4">
                  <Zap className="h-5 w-5 shrink-0 text-accent" />
                  <h3 className="type-h3 font-black uppercase tracking-tight text-text-primary">{"Market"}</h3>
                </div>

                {txRows.length === 0 ? (
                  <div className="px-5 py-12">
                    <EmptyState
                      icon={<Zap className="h-6 w-6" />}
                      title={"No items found."}
                    />
                  </div>
                ) : (
                  <div>
                    {visibleTxRows.map((tx, idx) => (
                      <div key={`${tx.id}-${idx}`} className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-accent-dim/5 sm:gap-4 sm:px-5 sm:py-4">
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${
                          tx.value >= 0
                            ? 'border-accent/20 bg-accent/10 text-accent'
                            : 'border-danger/20 bg-danger/10 text-danger'
                        }`}>
                          {tx.value >= 0
                            ? <ArrowDownLeft className="h-4 w-4" />
                            : <ArrowUpRight className="h-4 w-4" />
                          }
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium text-text-primary">{tx.desc}</div>
                          <div className="type-meta mt-0.5 truncate">{tx.date} · #{tx.shortId}</div>
                        </div>
                        <div className={`type-code shrink-0 font-bold ${tx.value < 0 ? 'text-danger' : 'text-accent'}`}>
                          <span className="inline-flex items-center gap-1">{tx.value > 0 ? '+' : ''}{tx.value} <CpLogo className="h-3.5 w-3.5" /></span>
                        </div>
                      </div>
                    ))}
                    {hasMore && (
                      <div className="flex justify-center px-5 py-4">
                        <button
                          onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                          className="min-h-[44px] rounded-xl border border-border bg-bg px-4 text-xs font-bold text-text-primary transition-colors hover:border-accent/40"
                        >
                          {`Load more (${txRows.length - visibleCount} remaining)`}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;