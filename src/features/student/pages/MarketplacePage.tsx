import React, { useEffect, useMemo, useState } from 'react';
import { ShoppingBag, Search, Loader2, Download, BookOpen, Zap, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import api from '../../../core/services/api';
import { useToast } from '../../../core/contexts/ToastContext';
import SEO from '../../../shared/components/SEO';
import CpLogo from '../../../shared/components/CpLogo';
import { resolveImg } from '../../../shared/utils/resolveImg';
import productFallbackImg from '@/assets/sections/stats/cp-earned-bg.webp';
import { extractCpBalance } from '../../../shared/utils/cpBalance';
import { formatNumber } from '../../../shared/utils/formatNumber';
import PageLoader from '../../../shared/components/PageLoader';

const CACHE_KEY = 'qyvora_marketplace_cache_v2';
const PAGE_SIZE = 10;

const Marketplace: React.FC = () => {
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
      const dbBalance = extractCpBalance(balRes?.data) ?? 0;
      setBalance(dbBalance);
      const purchasedIds = new Set<string>(txItems.filter((tx: any) => tx.type === 'purchase' && tx.productId).map((tx: any) => String(tx.productId)));
      setPurchased(purchasedIds);
    }).catch(() => {
      if (mounted) { addToast('Failed to load marketplace', 'error'); if (products.length === 0) setProducts([]); }
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
      addToast(err?.response?.data?.error || 'Purchase failed.', 'error');
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
      const res = await fetch(`${base}/cp/products/${id}/download`, { credentials: 'include' });
      if (!res.ok) { addToast('Download failed.', 'error'); return; }
      const blob = await res.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = product.fileName || `${product.title || 'product'}.pdf`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch { addToast('Download failed.', 'error'); }
    finally { setDownloading(null); }
  };

  const filtered = products.filter((p) => !query || p.title?.toLowerCase().includes(query.toLowerCase()) || p.type?.toLowerCase().includes(query.toLowerCase()));

  const txRows = useMemo(() => {
    return transactions.map((tx: any, idx) => ({
      id: String(tx?._id || tx?.id || `TXN-${idx + 1}`),
      shortId: String(tx?._id || tx?.id || `TXN-${idx + 1}`).slice(-8).toUpperCase(),
      desc: String(tx?.note || tx?.type || 'Points transaction'),
      date: tx?.createdAt ? new Date(tx.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }) : '—',
      value: Number(tx?.points || 0),
    }));
  }, [transactions]);

  const visibleTxRows = txRows.slice(0, visibleCount);
  const hasMore = visibleCount < txRows.length;

  if (loading) return <PageLoader />;

  return (
    <div className="bg-bg">
      <SEO title="Zero-Day Market" description="High-value intelligence reports, tools, and mission guides for operators." />
      <div className="lg:fixed lg:left-0 lg:right-20 lg:bottom-0 lg:top-24 lg:overflow-y-auto lg:overscroll-contain scroll-hover">
        <div className="mx-auto max-w-[1600px] px-0 pt-6 pb-16 md:px-6 lg:px-10">
          <ScrollReveal className="mb-8 flex flex-col justify-between gap-8 md:flex-row md:items-end px-4 md:px-0">
             <div>
               <div className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-accent">Zero-Day Vault</div>
               <h1 className="text-4xl font-black text-text-primary md:text-6xl">Intelligence Market</h1>
               <p className="mt-2 max-w-lg text-base text-text-muted">High-value research papers, tools, and mission guides for operators.</p>
             </div>
             <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center flex-wrap max-w-full">
               {balance !== null && (
                 <div className="rounded-2xl bg-accent-dim/10 px-6 py-3 inline-flex items-center gap-3 shadow-sm">
                   <CpLogo className="h-7 w-7 shrink-0" />
                   <span className="font-mono text-3xl font-black text-text-primary tracking-tighter">{formatNumber(balance)}</span>
                 </div>
               )}
               {tab === 'market' && (
                 <div className="relative w-full sm:w-auto">
                   <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search vault..." className="w-full sm:w-64 rounded-xl border border-border/40 bg-bg-card py-3 pl-12 pr-4 text-sm text-text-primary transition-all focus:border-accent outline-none shadow-sm" />
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted pointer-events-none" />
                 </div>
               )}
             </div>
          </ScrollReveal>

          {/* Tabs */}
          <div className="flex items-center gap-1 px-4 md:px-0 mb-8">
            <button
              onClick={() => setTab('market')}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                tab === 'market'
                  ? 'bg-accent text-bg shadow-lg shadow-accent/20'
                  : 'text-text-muted hover:text-text-primary border border-border/40'
              }`}
            >
              <ShoppingBag className="inline-block w-3.5 h-3.5 mr-1.5" />
              Market
            </button>
            <button
              onClick={() => setTab('history')}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                tab === 'history'
                  ? 'bg-accent text-bg shadow-lg shadow-accent/20'
                  : 'text-text-muted hover:text-text-primary border border-border/40'
              }`}
            >
              <Zap className="inline-block w-3.5 h-3.5 mr-1.5" />
              History
            </button>
          </div>

          {tab === 'market' ? (
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 px-1 md:px-0">
              {filtered.length === 0 ? (
                <div className="col-span-full relative overflow-hidden py-20 text-center rounded-3xl border-2 border-dashed border-border/20 bg-transparent">
                  <BookOpen className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-40" />
                  <p className="text-text-muted text-base">{query ? 'No matching assets found.' : 'Marketplace is currently empty.'}</p>
                </div>
              ) : (
                filtered.map((prod, idx) => {
                  const id = String(prod.id || '');
                  const hasPurchased = purchased.has(id);
                  return (
                    <motion.div key={id || idx} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}>
                      <div className="group overflow-hidden flex flex-col w-full border border-border/40 bg-bg-card rounded-2xl transition-all duration-300 hover:border-accent/30 hover:scale-[1.01]">
                        <div className="relative aspect-video overflow-hidden rounded-t-2xl shadow-sm">
                          <img src={resolveImg(prod.coverUrl, productFallbackImg)} alt={prod.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          <div className="absolute top-4 left-4 flex items-center gap-2">
                            {hasPurchased && <span className="px-2.5 py-1 bg-accent text-bg rounded text-[9px] font-black uppercase tracking-widest shadow-md">Owned</span>}
                            {prod.isFree && !hasPurchased && <span className="px-2.5 py-1 bg-accent text-bg rounded text-[9px] font-black uppercase tracking-widest shadow-md">Public</span>}
                          </div>
                          <div className="absolute bottom-4 left-4"><span className="inline-flex items-center gap-2 px-3 py-1 bg-bg/85 backdrop-blur-md rounded-lg text-[9px] font-black uppercase text-text-primary tracking-widest shadow-sm"><ShoppingBag className="h-3 w-3 text-accent" /> Intelligence Asset</span></div>
                        </div>
                        <div className="flex flex-1 flex-col p-8 sm:p-10">
                          <h3 className="mb-2 text-xl font-black leading-snug text-text-primary group-hover:text-accent transition-colors tracking-tight line-clamp-1">{prod.title}</h3>
                          <p className="text-xs text-text-muted/70 mb-8 line-clamp-2 leading-relaxed font-mono">{prod.description || 'Secure intelligence report for offensive security operatives.'}</p>
                          <div className="mt-auto flex items-center justify-between gap-6">
                            <div className="flex items-center gap-2">
                               {prod.isFree ? <span className="text-sm font-black text-accent uppercase tracking-widest">Free Access</span> : <><CpLogo className="h-5 w-5" /><span className="font-mono text-xl font-black text-text-primary">{Number(prod.cpPrice || 0).toLocaleString()}</span></>}
                            </div>
                            {(hasPurchased || prod.isFree) ? (
                              <button onClick={() => handleDownload(prod)} disabled={downloading === id} className="bg-accent text-bg px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-accent/20 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60 flex items-center gap-2">{downloading === id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} Download</button>
                            ) : (
                              <button onClick={() => handlePurchase(prod)} disabled={purchasing === id} className={`bg-accent text-bg px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-accent/20 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60 flex items-center gap-2 ${shakePurchase === id ? 'animate-shake-x' : ''}`} onAnimationEnd={() => setShakePurchase(null)}>{purchasing === id ? <Loader2 className="h-4 w-4 animate-spin" /> : <><ShoppingBag className="h-4 w-4" /> Unlock</>}</button>
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
            <div className="px-1 md:px-0">
              <div className="overflow-hidden rounded-3xl border-2 border-border bg-bg-card">
                <div className="flex items-center gap-2 border-b border-border px-5 py-4">
                  <Zap className="h-5 w-5 text-accent shrink-0" />
                  <h3 className="text-base font-black uppercase tracking-widest text-text-primary">Transactions</h3>
                </div>

                {txRows.length === 0 ? (
                  <div className="py-12 text-center text-text-muted text-sm">No transactions yet.</div>
                ) : (
                  <div className="divide-y divide-border/50">
                    {visibleTxRows.map((tx, idx) => (
                      <div key={idx} className="px-4 py-3.5 flex items-center gap-3 hover:bg-accent-dim/5 transition-colors sm:px-5 sm:py-4 sm:gap-4">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-none shrink-0 border ${
                          tx.value >= 0
                            ? 'bg-accent/10 border-accent/20 text-accent'
                            : 'bg-red-400/10 border-red-400/20 text-red-400'
                        }`}>
                          {tx.value >= 0
                            ? <ArrowDownLeft className="w-4 h-4" />
                            : <ArrowUpRight className="w-4 h-4" />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-text-primary truncate">{tx.desc}</div>
                          <div className="text-[10px] text-text-muted font-mono mt-0.5 truncate">{tx.date} · #{tx.shortId}</div>
                        </div>
                        <div className={`text-sm font-mono font-bold flex-none shrink-0 ${tx.value < 0 ? 'text-red-400' : 'text-accent'}`}>
                          <span className="inline-flex items-center gap-1">{tx.value > 0 ? '+' : ''}{tx.value} <CpLogo className="w-3.5 h-3.5" /></span>
                        </div>
                      </div>
                    ))}
                    {hasMore && (
                      <div className="px-5 py-4 flex justify-center">
                        <button
                          onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                          className="px-4 py-2 bg-bg border border-border hover:border-accent/40 rounded-lg text-xs font-bold text-text-primary transition-all"
                        >
                          Load more ({txRows.length - visibleCount} remaining)
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
