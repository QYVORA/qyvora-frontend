import React, { useEffect, useMemo, useState } from 'react';
import { Zap, Shield, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import api from '../../../core/services/api';
import { useAuth } from '../../../core/contexts/AuthContext';
import CpLogo from '../../../shared/components/CpLogo';
import OptionalDecorImage from '../../../shared/components/OptionalDecorImage';
import { STUDENT_DECOR } from '../constants/studentDecorPaths';

const PAGE_SIZE = 10;

const Wallet: React.FC = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [balanceRes, txRes] = await Promise.all([
          api.get('/cp/balance'),
          api.get('/cp/transactions?limit=100'),
        ]);
        if (!mounted) return;
        setBalance(Number(balanceRes.data?.balance || 0));
        setTransactions(Array.isArray(txRes.data?.items) ? txRes.data.items : []);
        setVisibleCount(PAGE_SIZE);
      } catch {
        if (!mounted) return;
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
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
    <div className="min-h-screen bg-bg pb-8">
      <div className="mx-auto max-w-7xl px-4 pt-8 md:px-8 md:pt-10">

        <ScrollReveal className="mb-8 md:mb-12">
          <span className="mb-2 block text-xs font-black uppercase tracking-[0.3em] text-accent md:text-sm">Economy</span>
          <h1 className="text-4xl font-black text-text-primary md:text-5xl">Operator wallet</h1>
          <p className="mt-2 max-w-xl text-base text-text-muted md:text-lg">Your CP balance and ledger — same energy as the dashboard hub.</p>
        </ScrollReveal>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          {/* LEFT COLUMN — balance + stats */}
          <div className="w-full lg:w-80 xl:w-96 flex-none space-y-4">

        {/* Balance card */}
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-3xl border-2 border-accent/25 bg-accent-dim p-6 md:p-8">
            <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-accent/20 blur-3xl" aria-hidden />
            <OptionalDecorImage
              src={STUDENT_DECOR.walletMascot}
              className="pointer-events-none absolute -right-2 top-1/2 z-[1] max-h-[120px] w-auto -translate-y-1/2 object-contain opacity-95 md:max-h-[140px]"
            />
            <div className="relative z-10 mb-1 text-xs font-black uppercase tracking-widest text-text-muted">Available balance</div>
            <div className="relative z-10 mb-6 inline-flex items-center gap-2 font-mono text-4xl font-black text-accent md:text-5xl">
              {loading ? '—' : balance.toLocaleString()}
              <CpLogo className="w-7 h-7 md:w-8 md:h-8 opacity-75" />
            </div>
            {/* Stats row */}
            <div className="relative z-10 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2.5 rounded-xl border border-border bg-bg/60 p-3">
                <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center flex-none shrink-0">
                  <ArrowDownLeft className="w-4 h-4 text-accent" />
                </div>
                <div className="min-w-0">
                  <div className="text-[9px] uppercase font-bold text-text-muted tracking-widest">Earned</div>
                  <div className="text-sm font-mono font-bold text-text-primary inline-flex items-center gap-1 flex-wrap">{totalEarned.toLocaleString()} <CpLogo className="w-3.5 h-3.5 shrink-0" /></div>
                </div>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl border border-border bg-bg/60 p-3">
                <div className="w-8 h-8 rounded-lg bg-red-400/10 border border-red-400/20 flex items-center justify-center flex-none shrink-0">
                  <ArrowUpRight className="w-4 h-4 text-red-400" />
                </div>
                <div className="min-w-0">
                  <div className="text-[9px] uppercase font-bold text-text-muted tracking-widest">Spent</div>
                  <div className="text-sm font-mono font-bold text-text-primary inline-flex items-center gap-1 flex-wrap">{totalSpent.toLocaleString()} <CpLogo className="w-3.5 h-3.5 shrink-0" /></div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Rank pill */}
        <ScrollReveal>
          <div className="flex items-center gap-4 rounded-2xl border-2 border-border bg-bg-card p-4 md:p-5">
            <div className="w-10 h-10 rounded-lg bg-accent-dim border border-accent/30 flex items-center justify-center text-accent flex-none shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Active Rank</div>
              <div className="text-base font-bold text-text-primary font-mono">{user?.rank?.toUpperCase() || 'CANDIDATE'}</div>
            </div>
          </div>
        </ScrollReveal>

          </div>{/* end left column */}

          {/* RIGHT COLUMN — transactions */}
          <div className="w-full flex-1 min-w-0">
        <ScrollReveal>
          <div className="overflow-hidden rounded-3xl border-2 border-border bg-bg-card">
            <div className="flex items-center gap-2 border-b border-border px-5 py-4">
              <Zap className="h-5 w-5 text-accent shrink-0" />
              <h3 className="text-base font-black uppercase tracking-widest text-text-primary">Transactions</h3>
            </div>

            {loading ? (
              <div className="divide-y divide-border/50">
                {[0,1,2,3].map((i) => (
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

          </div>{/* end right column */}
        </div>{/* end two-col */}
      </div>
    </div>
  );
};

export default Wallet;
