import React from 'react';
import { useTranslation } from 'react-i18next';
import { Activity, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { CpTx } from './types';
import { fmt } from './utils';
import CpLogo from '@/shared/components/CpLogo';

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
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-border/50 bg-bg-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-accent" />
          <span className="text-sm font-black uppercase tracking-wide text-text-primary">{t('admin.cp.ledger')}</span>
          <span className="text-[10px] font-mono text-text-muted">{t('admin.cp.totalTransactions', { count: txTotal })}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={txSearch}
            onChange={e => setTxSearch(e.target.value)}
            placeholder={t('admin.cp.searchUser')}
            className="bg-bg border border-border rounded-xl px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-accent w-36"
          />
          <select
            value={txFilter}
            onChange={e => setTxFilter(e.target.value as any)}
            className="bg-bg border border-border rounded-xl px-2 py-1.5 text-xs text-text-primary focus:outline-none focus:border-accent"
          >
            <option value="all">{t('admin.cp.filterAll')}</option>
            <option value="credit">{t('admin.cp.filterCredit')}</option>
            <option value="purchase">{t('admin.cp.filterPurchase')}</option>
            <option value="deduct">{t('admin.cp.filterDeduct')}</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div>
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
        <div className="py-12 text-center text-sm text-text-muted">{t('admin.cp.noTransactions')}</div>
      ) : (
        <>
          {/* Mobile */}
          <div className="md:hidden">
            {txs.map(tx => {
              const pts = Number(tx.points || 0);
              const isCredit = pts >= 0;
              return (
                <div key={tx._id} className="px-4 py-3 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-none border ${
                    isCredit ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-danger/10 border-danger/20 text-danger'
                  }`}>
                    {isCredit ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-text-primary truncate">
                      {tx.user?.hackerHandle || tx.user?.name || tx.user?.email || '-'}
                    </div>
                    <div className="text-[10px] text-text-muted truncate">{tx.note || tx.type}</div>
                    <div className="text-[10px] text-text-muted font-mono">
                      {new Date(tx.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}
                    </div>
                  </div>
                  <div className={`text-sm font-mono font-bold flex-none ${isCredit ? 'text-accent' : 'text-danger'}`}>
                    {isCredit ? '+' : ''}{fmt(pts)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead className="bg-bg-elevated/50">
                <tr>
                  {[t('admin.cp.colUser'), t('admin.cp.colType'), t('admin.cp.colPoints'), t('admin.cp.colBalanceAfter'), t('admin.cp.colNote'), t('admin.cp.colDate')].map(h => (
                    <th key={h} className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.25em] text-text-muted/60">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {txs.map(tx => {
                  const pts = Number(tx.points || 0);
                  const isCredit = pts >= 0;
                  return (
                    <tr key={tx._id} className="hover:bg-accent-dim/5 transition-colors">
                      <td className="px-4 py-3">
                        <div className="text-xs font-bold text-text-primary">
                          {tx.user?.hackerHandle || tx.user?.name || '-'}
                        </div>
                        <div className="text-[10px] text-text-muted">{tx.user?.email || ''}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-lg border ${
                          isCredit ? 'text-accent border-accent/20 bg-accent/5' : 'text-danger border-danger/20 bg-danger/5'
                        }`}>{tx.type || '-'}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-mono font-bold inline-flex items-center gap-1 ${isCredit ? 'text-accent' : 'text-danger'}`}>
                          {isCredit ? '+' : ''}{fmt(pts)} <CpLogo className="w-3 h-3" />
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-text-secondary">
                        {tx.balanceAfter != null ? fmt(Number(tx.balanceAfter)) : '-'}
                      </td>
                      <td className="px-4 py-3 text-xs text-text-muted max-w-[180px] truncate">{tx.note || '-'}</td>
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
                {t('admin.cp.pageOf', { page: txPage, total: totalPages, count: txTotal })}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => void loadTxs(txPage - 1)}
                  disabled={txPage <= 1}
                  className="btn-secondary w-11 h-11 flex items-center justify-center disabled:opacity-50"
                >&#8249;</button>
                <button
                  onClick={() => void loadTxs(txPage + 1)}
                  disabled={txPage >= totalPages}
                  className="btn-secondary w-11 h-11 flex items-center justify-center disabled:opacity-50"
                >&#8250;</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TransactionLedger;
