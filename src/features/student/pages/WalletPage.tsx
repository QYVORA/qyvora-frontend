import React, { useEffect, useMemo, useState } from 'react';
import { Zap, Shield, ArrowUpRight, ArrowDownLeft, Link2, CheckCircle2 } from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import api from '../../../core/services/api';
import { useAuth } from '../../../core/contexts/AuthContext';
import CpLogo from '../../../shared/components/CpLogo';
import OptionalDecorImage from '../../../shared/components/OptionalDecorImage';
import { STUDENT_DECOR } from '../constants/studentDecorPaths';
import { getChainHistory, CHAIN_EVENT_LABELS, type ChainBlock } from '../services/chain.service';
import { extractCpBalance } from '../../../shared/utils/cpBalance';
import { getTokenBalanceForUser } from '../services/tokenBalance.service';

const PAGE_SIZE = 10;

const Wallet: React.FC = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [chainHistory, setChainHistory] = useState<ChainBlock[]>([]);
  const [chainLoading, setChainLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [balanceRes, txRes, tokenBalance] = await Promise.all([
          api.get('/cp/balance').catch(() => null),
          api.get('/cp/transactions?limit=100').catch(() => null),
          getTokenBalanceForUser(user?.uid || ''),
        ]);
        if (!mounted) return;

        const dbBalance = extractCpBalance(balanceRes?.data) ?? 0;
        const onChainBalance = typeof tokenBalance === 'number' ? tokenBalance : 0;
        
        const txItems = Array.isArray(txRes?.data?.items) ? txRes.data.items : [];
        const txSum = txItems.reduce((acc: number, tx: any) => acc + Number(tx.points || tx.value || 0), 0);
        
        // Final balance resolution:
        // We take the maximum of:
        // 1. The backend balance (DB)
        // 2. The direct chain balance
        // 3. The sum of the last 100 transactions
        // 4. The user's CP from their authentication session
        const resolvedBalance = Math.max(dbBalance, onChainBalance, txSum, user?.cp ?? 0);
        
        setBalance(resolvedBalance);
        setTransactions(txItems);
        setVisibleCount(PAGE_SIZE);
      } catch {
        if (!mounted) return;
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [user?.uid]);

  // Load chain history separately (degrades silently if chain is offline)
  useEffect(() => {
    const timeout = new Promise<ChainBlock[]>((resolve) => setTimeout(() => resolve([]), 6000));
    Promise.race([getChainHistory(), timeout])
      .then(setChainHistory)
      .catch(() => setChainHistory([]))
      .finally(() => setChainLoading(false));
  }, []);

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
  const totalEarned = txRows.filter((t) => t.value > 0).reduce((a, t) => a + t.value, 0);
  const totalSpent = Math.abs(txRows.filter((t) => t.value < 0).reduce((a, t) => a + t.value, 0));

  return (
    <div className="bg-bg">
      {/* Mobile-first header (right section header shown before sidebar content) */}
<div className="px-4 sm:px-6 md:px-8 pt-6 lg:hidden">
         <ScrollReveal className="mb-8">
          <h1 className="text-4xl font-black text-text-primary md:text-6xl">Wallet</h1>
           <p className="mt-2 max-w-lg text-base text-text-muted">Your CP balance and full transaction ledger.</p>
         </ScrollReveal>
       </div>

      {/* Fixed two-column container below topbar */}
      <div className="lg:fixed lg:left-0 lg:right-20 lg:bottom-0 lg:top-24 lg:flex lg:flex-row lg:overflow-hidden">

        {/* LEFT SIDEBAR */}
        <div
          className="w-full lg:w-72 xl:w-80 2xl:w-96 lg:flex-none lg:h-full lg:overflow-y-auto lg:overscroll-contain lg:border-r lg:border-border lg:bg-bg scroll-hover"
          style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent 0px, black 24px)', maskImage: 'linear-gradient(to bottom, transparent 0px, black 24px)' }}
        >
          <div className="px-4 sm:px-6 md:px-8 pb-6 pt-6 lg:p-6 space-y-4">

            {/* Balance card */}
            <ScrollReveal>
              <div className="relative overflow-hidden rounded-3xl border-2 border-accent/25 bg-accent-dim p-6 md:p-8">
                <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-accent/20 blur-3xl" aria-hidden />
                <OptionalDecorImage
                  src={STUDENT_DECOR.walletMascot}
                  className="pointer-events-none absolute -right-2 top-1/2 z-[1] max-h-[120px] w-auto -translate-y-1/2 object-contain opacity-95 md:max-h-[140px]"
                />
                <div className="relative z-10 mb-6 flex items-center gap-3 font-mono text-4xl font-black text-accent md:text-5xl">
                  <CpLogo className="w-8 h-8 md:w-10 md:h-10 opacity-90 shrink-0" />
                  <span className="truncate">{loading ? '—' : balance.toLocaleString()}</span>
                </div>
                {/* Stats row */}
                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5 rounded-xl border border-border bg-bg/60 p-3 min-w-0">
                    <div className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Total Earned</div>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center flex-none shrink-0">
                        <ArrowDownLeft className="w-3.5 h-3.5 text-accent" />
                      </div>
                      <div className="font-mono text-sm font-bold text-text-primary inline-flex items-center gap-1 min-w-0 flex-1">
                        <span className="truncate">{totalEarned.toLocaleString()}</span>
                        <CpLogo className="w-3 h-3 shrink-0 opacity-70" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 rounded-xl border border-border bg-bg/60 p-3 min-w-0">
                    <div className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Total Spent</div>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-red-400/10 border border-red-400/20 flex items-center justify-center flex-none shrink-0">
                        <ArrowUpRight className="w-3.5 h-3.5 text-red-400" />
                      </div>
                      <div className="font-mono text-sm font-bold text-text-primary inline-flex items-center gap-1 min-w-0 flex-1">
                        <span className="truncate">{totalSpent.toLocaleString()}</span>
                        <CpLogo className="w-3 h-3 shrink-0 opacity-70" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Rank pill */}
            <ScrollReveal>
              <div className="flex items-center gap-3 rounded-2xl border-2 border-border bg-bg-card p-4 md:p-5">
                <div className="w-10 h-10 rounded-lg bg-accent-dim border border-accent/30 flex items-center justify-center text-accent flex-none shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="text-base font-bold text-text-primary font-mono">{user?.rank?.toUpperCase() || 'CANDIDATE'}</div>
              </div>
            </ScrollReveal>

          </div>
        </div>{/* end left sidebar */}

        {/* RIGHT MAIN */}
        <div
          className="w-full flex-1 min-w-0 lg:h-full lg:overflow-y-auto lg:overscroll-contain scroll-hover"
          style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent 0px, black 24px)', maskImage: 'linear-gradient(to bottom, transparent 0px, black 24px)' }}
        >
          <div className="px-4 sm:px-6 md:px-8 pb-16 lg:px-8 lg:py-6">

            {/* Page header */}
<ScrollReveal className="mb-10 md:mb-12 hidden lg:block">
               <div className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-accent">
                 Economy
               </div>
               <h1 className="text-4xl font-black text-text-primary md:text-6xl">Wallet</h1>
               <p className="mt-2 max-w-lg text-base text-text-muted">Your CP balance and full transaction ledger.</p>
             </ScrollReveal>

            <ScrollReveal>
            <div className="overflow-hidden rounded-3xl border-2 border-border bg-bg-card">
            <div className="flex items-center gap-2 border-b border-border px-5 py-4">
              <Zap className="h-5 w-5 text-accent shrink-0" />
              <h3 className="text-base font-black uppercase tracking-widest text-text-primary">Transactions</h3>
            </div>

            {loading ? (
              <div className="divide-y divide-border/50">
                {[0,1,2,3,4,5,6,7,8,9].map((i) => (
                  <div key={i} className="px-4 py-4 flex items-center gap-3 animate-pulse sm:px-5">
                    <div className="w-9 h-9 rounded-lg bg-accent-dim/30 flex-none shrink-0" />
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="h-3 bg-accent-dim/30 rounded w-2/3" />
                      <div className="h-2 bg-accent-dim/20 rounded w-1/3" />
                    </div>
                    <div className="h-4 bg-accent-dim/30 rounded w-14 flex-none" />
                  </div>
                ))}
              </div>
            ) : txRows.length === 0 ? (
              <div className="py-12 text-center text-text-muted text-sm">No transactions yet.</div>
            ) : (
              <div className="divide-y divide-border/50">
                {visibleTxRows.map((tx, idx) => (
                  <div key={idx} className="px-4 py-3.5 flex items-center gap-3 hover:bg-accent-dim/5 transition-colors sm:px-5 sm:py-4 sm:gap-4">
                    {/* Icon */}
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
                    {/* Description */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-text-primary truncate">{tx.desc}</div>
                      <div className="text-[10px] text-text-muted font-mono mt-0.5 truncate">{tx.date} · #{tx.shortId}</div>
                    </div>
                    {/* Value */}
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
        </ScrollReveal>

            {/* CHAIN LEDGER — verifiable audit trail */}
            <ScrollReveal className="mt-8">
              <div className="overflow-hidden rounded-3xl border-2 border-border bg-bg-card">
                <div className="flex items-center gap-2 border-b border-border px-5 py-4">
                  <Link2 className="h-5 w-5 text-accent shrink-0" />
                  <h3 className="text-base font-black uppercase tracking-widest text-text-primary">Chain Ledger</h3>
                  <span className="ml-auto text-[10px] font-bold uppercase tracking-widest text-text-muted hidden sm:block">
                    HSOCIETY CHAIN — tamper-proof
                  </span>
                </div>

                {chainLoading ? (
                  <div className="divide-y divide-border/50">
                    {[0,1,2,3,4].map((i) => (
                      <div key={i} className="px-5 py-4 flex items-center gap-3 animate-pulse">
                        <div className="w-8 h-8 rounded-lg bg-accent-dim/30 flex-none" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-accent-dim/30 rounded w-1/3" />
                          <div className="h-2 bg-accent-dim/20 rounded w-2/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : chainHistory.length === 0 ? (
                  <div className="py-10 px-5 text-center space-y-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-accent-dim border border-accent/20 mx-auto">
                      <Link2 className="w-5 h-5 text-accent" />
                    </div>
                    <p className="text-sm font-bold text-text-primary">No chain records yet</p>
                    <p className="text-xs text-text-muted max-w-xs mx-auto leading-relaxed">
                      Complete bootcamp rooms to generate tamper-proof blocks on the HSOCIETY chain.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-border/50">
                    {chainHistory.slice(0, 20).map((block) => (
                      <div key={block.hash} className="px-5 py-3.5 flex items-center gap-3 hover:bg-accent-dim/5 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center flex-none shrink-0">
                          <CheckCircle2 className="w-4 h-4 text-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-text-primary">
                            {CHAIN_EVENT_LABELS[block.data.type] ?? block.data.type}
                          </div>
                          <div className="text-[10px] font-mono text-text-muted mt-0.5 truncate">
                            #{block.index} · {new Date(block.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })} · {block.hash.slice(0, 20)}…
                          </div>
                        </div>
                        {block.data.cpPoints != null && block.data.cpPoints > 0 && (
                          <div className="text-sm font-mono font-bold text-accent flex-none shrink-0 inline-flex items-center gap-1">
                            +{block.data.cpPoints} <CpLogo className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollReveal>

          </div>{/* end right main inner */}
        </div>{/* end right main */}
      </div>{/* end two-col */}
    </div>
  );
};

export default Wallet;
