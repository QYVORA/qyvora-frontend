import React from 'react';
import { Activity, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { CpTx } from './types';
import { fmt } from './utils';
import CpLogo from '../../../../shared/components/CpLogo';

interface TransactionLedgerProps {
  txs: CpTx[];
  txTotal: number;
  txPage: number;
  txFilter: 'all' | 'credit' | 'purchase' | 'deduct';
  setTxFilter: (f: 'all' | 'credit' | 'purchase' | 'deduct') => void;
  txSearch: string;
  setTxSearch: (s: string) => void;
  loadTxs: (page: number) => Promise<void>;
  loading: boolean;
  totalPages: number;
}

const TransactionLedger: React.FC<TransactionLedgerProps> = ({
  txs,
  txTotal,
  txPage,
  txFilter,
  setTxFilter,
  txSearch,
  setTxSearch,
  loadTxs,
  loading,
  totalPages,
}) => {
  return (
    <div className="rounded-2xl border-2 border-border bg-bg-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-accent" />
          <span className="text-sm font-black uppercase tracking-wide text-text-primary">Transaction Ledger</span>
          <span className="text-[10px] font-mono text-text-muted">{txTotal} total</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={txSearch}
            onChange={e => setTxSearch(e.target.value)}
            placeholder="Search user…"
            className="bg-bg border border-border rounded-xl px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-accent w-36"
          />
          <select
            value={txFilter}
            onChange={e => setTxFilter(e.target.value as any)}
            className="bg-bg border border-border rounded-xl px-2 py-1.5 text-xs text-text-primary focus:outline-none focus:border-accent"
          >
            <option value="all">All types</option>
            <option value="credit">Credit</option>
            <option value="purchase">Purchase</option>
            <option value="deduct">Deduct</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="divide-y divide-border/50">
          {[0,1,2,3,4].map(i => (
            <div key={i} className="px-5 py-3.5 flex items-center gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-lg bg-accent-dim/30 flex-none" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-accent-dim/30 rounded w-1/3" />
                <div className="h-2 bg-accent-dim/20 rounded w-1/2" />
              </div>
              <div className="w-16 h-4 bg-accent-dim/20 rounded flex-none" />
            </div>
          ))}
        </div>
      ) : txs.length === 0 ? (
        <div className="py-12 text-center text-sm text-text-muted">No transactions found.</div>
      ) : (
        <>
          {/* Mobile */}
          <div className="md:hidden divide-y divide-border/50">
            {txs.map(tx => {
              const pts = Number(tx.points || 0);
              const isCredit = pts >= 0;
              return (
                <div key={tx._id} className="px-4 py-3 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-none border ${
                    isCredit ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-red-400/10 border-red-400/20 text-red-400'
                  }`}>
                    {isCredit ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-text-primary truncate">
                      {tx.user?.hackerHandle || tx.user?.name || tx.user?.email || '—'}
                    </div>
                    <div className="text-[10px] text-text-muted truncate">{tx.note || tx.type}</div>
                    <div className="text-[10px] text-text-muted font-mono">
                      {new Date(tx.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}
                    </div>
                  </div>
                  <div className={`text-sm font-mono font-bold flex-none ${isCredit ? 'text-accent' : 'text-red-400'}`}>
                    {isCredit ? '+' : ''}{fmt(pts)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead className="border-b-border bg-bg">
                <tr>
                  {['User','Type','Points','Balance After','Note','Date'].map(h => (
                    <th key={h} className="px-4 py-3 text-[10px] uppercase tracking-widest text-text-muted">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {txs.map(tx => {
                  const pts = Number(tx.points || 0);
                  const isCredit = pts >= 0;
                  return (
                    <tr key={tx._id} className="hover:bg-accent-dim/10 transition-colors">
                      <td className="px-4 py-3">
                        <div className="text-xs font-bold text-text-primary">
                          {tx.user?.hackerHandle || tx.user?.name || '—'}
                        </div>
                        <div className="text-[10px] text-text-muted">{tx.user?.email || ''}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-lg border ${
                          isCredit ? 'text-accent border-accent/20 bg-accent/5' : 'text-red-400 border-red-400/20 bg-red-400/5'
                        }`}>{tx.type || '—'}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-mono font-bold inline-flex items-center gap-1 ${isCredit ? 'text-accent' : 'text-red-400'}`}>
                          {isCredit ? '+' : ''}{fmt(pts)} <CpLogo className="w-3 h-3" />
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-text-secondary">
                        {tx.balanceAfter != null ? fmt(Number(tx.balanceAfter)) : '—'}
                      </td>
                      <td className="px-4 py-3 text-xs text-text-muted max-w-[180px] truncate">{tx.note || '—'}</td>
                      <td className="px-4 py-3 text-[10px] font-mono text-text-muted whitespace-nowrap">
                        {new Date(tx.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-3">
              <span className="text-xs text-text-muted">
                Page {txPage} of {totalPages} · {txTotal} transactions
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => void loadTxs(txPage - 1)}
                  disabled={txPage <= 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-text-muted disabled:opacity-50 hover:border-accent/30 hover:text-accent transition-colors text-xs"
                >‹</button>
                <button
                  onClick={() => void loadTxs(txPage + 1)}
                  disabled={txPage >= totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-text-muted disabled:opacity-50 hover:border-accent/30 hover:text-accent transition-colors text-xs"
                >›</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TransactionLedger;
