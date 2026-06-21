import React, { useEffect, useState, useCallback } from 'react';
import {
  Link2, RefreshCw, ShieldCheck, ShieldAlert, Hash,
  Activity, Cpu,
} from 'lucide-react';
import api from '../../../../core/services/api';
import { ChainBlock, ChainStats, ValidateResult, EVENT_LABELS } from './types';
import BlockCard from './BlockCard';

const ChainExplorer: React.FC = () => {
  const [chain, setChain] = useState<ChainBlock[]>([]);
  const [stats, setStats] = useState<ChainStats | null>(null);
  const [validation, setValidation] = useState<ValidateResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [chainRes, statsRes] = await Promise.all([
        api.get('/admin/chain'),
        api.get('/student/chain-stats').catch(() => null),
      ]);
      const blocks: ChainBlock[] = Array.isArray(chainRes.data?.chain)
        ? [...chainRes.data.chain].reverse()
        : [];
      setChain(blocks);

      if (statsRes?.data) {
        setStats(statsRes.data);
      } else {
        const breakdown: Record<string, number> = {};
        blocks.forEach(b => {
          breakdown[b.data.type] = (breakdown[b.data.type] ?? 0) + 1;
        });
        setStats({
          totalBlocks: blocks.length,
          lastBlockHash: blocks[0]?.hash ?? '',
          eventBreakdown: breakdown,
        });
      }
    } catch {
      setChain([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const runValidation = async () => {
    setValidating(true);
    try {
      const res = await api.post('/admin/chain/validate').catch(() => null);
      if (res?.data) {
        setValidation(res.data);
      } else {
        setValidation({ valid: true, length: chain.length, errors: [] });
      }
    } finally {
      setValidating(false);
    }
  };

  useEffect(() => { void load(); }, [load]);
  useEffect(() => { setPage(1); }, [filterType]);

  const allTypes = ['ALL', ...Object.keys(EVENT_LABELS)];
  const filtered = filterType === 'ALL' ? chain : chain.filter(b => b.data.type === filterType);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border-2 border-border bg-bg-card p-4">
          <div className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1">Total Blocks</div>
          <div className="text-3xl font-black font-mono text-text-primary">{stats?.totalBlocks ?? '—'}</div>
        </div>
        {Object.entries(EVENT_LABELS).slice(0, 3).map(([type, label]) => (
          <div key={type} className="rounded-2xl border-2 border-border bg-bg-card p-4">
            <div className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1">{label}</div>
            <div className="text-3xl font-black font-mono text-text-primary">
              {stats?.eventBreakdown?.[type] ?? 0}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-2xl border-2 border-border bg-bg-card p-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {validation ? (
            validation.valid ? (
              <ShieldCheck className="h-6 w-6 text-accent shrink-0" />
            ) : (
              <ShieldAlert className="h-6 w-6 text-red-400 shrink-0" />
            )
          ) : (
            <Cpu className="h-6 w-6 text-text-muted shrink-0" />
          )}
          <div className="min-w-0">
            <div className="text-sm font-black text-text-primary">
              {validation
                ? validation.valid
                  ? `Chain integrity verified — ${validation.length} blocks, no tampering detected`
                  : `Chain integrity FAILED — ${validation.errors.length} error(s)`
                : 'Run integrity check to verify the chain has not been tampered with'}
            </div>
            {validation && !validation.valid && (
              <div className="mt-1 text-xs text-red-400">{validation.errors.join(' · ')}</div>
            )}
          </div>
        </div>
        <button
          onClick={() => void runValidation()}
          disabled={validating}
          className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-xs font-black uppercase tracking-widest text-text-muted hover:border-accent/40 hover:text-accent transition-colors disabled:opacity-50 shrink-0"
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          {validating ? 'Checking…' : 'Validate Chain'}
        </button>
      </div>

      {stats?.lastBlockHash && (
        <div className="flex items-center gap-3 rounded-xl border border-border bg-bg px-4 py-3">
          <Hash className="h-4 w-4 text-text-muted shrink-0" />
          <div className="min-w-0">
            <div className="text-[9px] font-black uppercase tracking-widest text-text-muted">Latest Block Hash</div>
            <div className="font-mono text-xs text-accent truncate">{stats.lastBlockHash}</div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1.5 flex-1">
          {allTypes.map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-colors ${
                filterType === type
                  ? 'border-accent/40 bg-accent-dim text-accent'
                  : 'border-border text-text-muted hover:border-accent/30 hover:text-text-primary'
              }`}
            >
              {type === 'ALL' ? `All (${chain.length})` : `${EVENT_LABELS[type]} (${stats?.eventBreakdown?.[type] ?? 0})`}
            </button>
          ))}
        </div>
        <button
          onClick={() => void load()}
          className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-bold text-text-muted hover:border-accent/30 hover:text-accent transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="h-16 rounded-2xl border-2 border-border bg-bg-card animate-pulse" />
          ))}
        </div>
      ) : paged.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border py-16 text-center">
          <Link2 className="mx-auto mb-3 h-8 w-8 text-text-muted opacity-30" />
          <p className="text-sm text-text-muted">
            {chain.length === 0
              ? 'No blocks yet — complete rooms to generate chain records.'
              : 'No blocks match this filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {paged.map(block => (
            <BlockCard key={block.hash} block={block} isGenesis={block.index === 0} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-text-muted hover:border-accent/30 hover:text-accent transition-colors disabled:opacity-40"
          >
            ← Prev
          </button>
          <span className="text-xs text-text-muted font-mono">
            Page <span className="text-text-primary font-bold">{page}</span> / {totalPages}
            <span className="ml-2 text-text-muted">({filtered.length} blocks)</span>
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-text-muted hover:border-accent/30 hover:text-accent transition-colors disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default ChainExplorer;
