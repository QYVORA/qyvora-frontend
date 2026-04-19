import React, { useEffect, useMemo, useState } from 'react';
import { Wallet as WalletIcon, Zap, Shield, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import api from '../../../core/services/api';
import { useAuth } from '../../../core/contexts/AuthContext';

const Wallet: React.FC = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [balanceRes, txRes] = await Promise.all([
          api.get('/cp/balance'),
          api.get('/cp/transactions?limit=20'),
        ]);
        if (!mounted) return;
        setBalance(Number(balanceRes.data?.balance || 0));
        setTransactions(Array.isArray(txRes.data?.items) ? txRes.data.items : []);
      } catch {
        if (!mounted) return;
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const txRows = useMemo(() => {
    return transactions.slice(0, 20).map((tx: any, idx) => ({
      id: String(tx?._id || tx?.id || `TXN-${idx + 1}`),
      shortId: String(tx?._id || tx?.id || `TXN-${idx + 1}`).slice(-8).toUpperCase(),
      desc: String(tx?.note || tx?.type || 'CP transaction'),
      date: tx?.createdAt ? new Date(tx.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }) : '—',
      value: Number(tx?.points || 0),
    }));
  }, [transactions]);

  const totalEarned = txRows.filter((t) => t.value > 0).reduce((a, t) => a + t.value, 0);
  const totalSpent = Math.abs(txRows.filter((t) => t.value < 0).reduce((a, t) => a + t.value, 0));

  return (
    <div className="min-h-screen bg-bg pb-4">
      <div className="max-w-4xl mx-auto px-4 md:px-8 pt-6 md:pt-8">

        {/* Header */}
        <ScrollReveal className="mb-6 md:mb-10">
          <span className="text-accent text-xs font-bold uppercase tracking-[0.3em] mb-2 block">// ECONOMY</span>
          <h1 className="text-3xl md:text-4xl font-black text-text-primary">Operator Wallet</h1>
        </ScrollReveal>

        {/* Balance card — full width on mobile */}
        <ScrollReveal className="mb-4 md:mb-6">
          <div className="relative p-6 md:p-8 bg-accent-dim border border-accent/20 rounded-2xl overflow-hidden">
            <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
              <WalletIcon className="w-40 h-40 md:w-56 md:h-56" />
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2">Available Balance</div>
            <div className="text-4xl md:text-5xl font-black text-accent font-mono mb-6">
              {loading ? '—' : balance.toLocaleString()}
              <span className="text-base md:text-lg ml-2 opacity-60">CP</span>
            </div>
            {/* Stats row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 bg-bg/50 border border-border rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center flex-none">
                  <ArrowDownLeft className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <div className="text-[9px] uppercase font-bold text-text-muted tracking-widest">Earned</div>
                  <div className="text-sm font-mono font-bold text-text-primary">{totalEarned.toLocaleString()} CP</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-bg/50 border border-border rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-red-400/10 border border-red-400/20 flex items-center justify-center flex-none">
                  <ArrowUpRight className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <div className="text-[9px] uppercase font-bold text-text-muted tracking-widest">Spent</div>
                  <div className="text-sm font-mono font-bold text-text-primary">{totalSpent.toLocaleString()} CP</div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Rank pill */}
        <ScrollReveal className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 p-4 bg-bg-card border border-border rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-accent-dim border border-accent/30 flex items-center justify-center text-accent flex-none">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Active Rank</div>
              <div className="text-base font-bold text-text-primary font-mono">{user?.rank?.toUpperCase() || 'CANDIDATE'}</div>
            </div>
          </div>
        </ScrollReveal>

        {/* Transaction list */}
        <ScrollReveal>
          <div className="bg-bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent" />
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest">Transaction History</h3>
            </div>

            {loading ? (
              <div className="divide-y divide-border/50">
                {[0,1,2,3].map((i) => (
                  <div key={i} className="px-5 py-4 flex items-center gap-4 animate-pulse">
                    <div className="w-9 h-9 rounded-lg bg-accent-dim/30 flex-none" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-accent-dim/30 rounded w-2/3" />
                      <div className="h-2 bg-accent-dim/20 rounded w-1/3" />
                    </div>
                    <div className="h-4 bg-accent-dim/30 rounded w-16" />
                  </div>
                ))}
              </div>
            ) : txRows.length === 0 ? (
              <div className="py-12 text-center text-text-muted text-sm">No transactions yet.</div>
            ) : (
              <div className="divide-y divide-border/50">
                {txRows.map((tx, idx) => (
                  <div key={idx} className="px-5 py-4 flex items-center gap-4 hover:bg-accent-dim/5 transition-colors">
                    {/* Icon */}
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-none border ${
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
                      <div className="text-[10px] text-text-muted font-mono">{tx.date} · #{tx.shortId}</div>
                    </div>
                    {/* Value */}
                    <div className={`text-sm font-mono font-bold flex-none ${tx.value < 0 ? 'text-red-400' : 'text-accent'}`}>
                      {tx.value > 0 ? '+' : ''}{tx.value} CP
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
};

export default Wallet;
