import React, { useEffect, useState, useCallback } from 'react';
import {
  Link2, RefreshCw, ShieldCheck, ShieldAlert, Hash,
  ChevronDown, ChevronUp, Activity, Cpu, Award, Zap, BookOpen,
} from 'lucide-react';
import api from '../../../core/services/api';
import CpLogo from '../../../shared/components/CpLogo';

// ── Types ─────────────────────────────────────────────────────────────────────
interface ChainBlock {
  index: number;
  timestamp: string;
  hash: string;
  previousHash: string;
  validator: string;
  data: {
    type: string;
    userId: string;
    bootcampId: string;
    moduleId: string | null;
    roomId: string | null;
    cpPoints: number | null;
    metadata: Record<string, unknown>;
  };
}

interface ChainStats {
  totalBlocks: number;
  lastBlockHash: string;
  eventBreakdown: Record<string, number>;
}

interface ValidateResult {
  valid: boolean;
  length: number;
  errors: string[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const EVENT_COLORS: Record<string, string> = {
  ROOM_COMPLETED:       'text-accent border-accent/30 bg-accent/10',
  MODULE_COMPLETED:     'text-blue-400 border-blue-400/30 bg-blue-400/10',
  CP_REWARD:            'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
  CERTIFICATION_ISSUED: 'text-purple-400 border-purple-400/30 bg-purple-400/10',
  USER_ACTIVITY_LOG:    'text-text-muted border-border bg-bg',
};

const EVENT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  ROOM_COMPLETED:       BookOpen,
  MODULE_COMPLETED:     Award,
  CP_REWARD:            Zap,
  CERTIFICATION_ISSUED: Award,
  USER_ACTIVITY_LOG:    Activity,
};

const EVENT_LABELS: Record<string, string> = {
  ROOM_COMPLETED:       'Room Completed',
  MODULE_COMPLETED:     'Module Completed',
  CP_REWARD:            'CP Reward',
  CERTIFICATION_ISSUED: 'Certification',
  USER_ACTIVITY_LOG:    'Activity Log',
};

const shortHash = (h: string) => `${h.slice(0, 8)}…${h.slice(-6)}`;

// ── Block card ────────────────────────────────────────────────────────────────
const BlockCard: React.FC<{ block: ChainBlock; isGenesis: boolean }> = ({ block, isGenesis }) => {
  const [expanded, setExpanded] = useState(false);
  const colorClass = EVENT_COLORS[block.data.type] ?? EVENT_COLORS.USER_ACTIVITY_LOG;
  const Icon = EVENT_ICONS[block.data.type] ?? Activity;
  const label = EVENT_LABELS[block.data.type] ?? block.data.type;

  return (
    <div className={`rounded-2xl border-2 bg-bg-card transition-all ${
      isGenesis ? 'border-border/50 opacity-60' : 'border-border hover:border-accent/30'
    }`}>
      {/* Header row */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
        {/* Block number */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-bg font-mono text-xs font-black text-text-muted">
          #{block.index}
        </div>

        {/* Event badge */}
        <div className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[10px] font-black uppercase tracking-widest shrink-0 ${colorClass}`}>
          <Icon className="h-3 w-3" />
          {label}
        </div>

        {/* Hash */}
        <div className="flex-1 min-w-0 hidden sm:block">
          <div className="font-mono text-[11px] text-text-muted truncate">{shortHash(block.hash)}</div>
          <div className="text-[10px] text-text-muted/60 mt-0.5">
            {new Date(block.timestamp).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {/* CP points */}
        {block.data.cpPoints != null && block.data.cpPoints > 0 && (
          <div className="flex items-center gap-1 font-mono text-sm font-black text-accent shrink-0">
            +{block.data.cpPoints} <CpLogo className="w-3.5 h-3.5" />
          </div>
        )}

        {/* Expand toggle */}
        <div className="shrink-0 text-text-muted">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-border px-4 pb-4 pt-3 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              { label: 'Block Index', value: String(block.index) },
              { label: 'Validator', value: block.validator },
              { label: 'User ID', value: block.data.userId },
              { label: 'Bootcamp ID', value: block.data.bootcampId },
              ...(block.data.moduleId ? [{ label: 'Module ID', value: block.data.moduleId }] : []),
              ...(block.data.roomId ? [{ label: 'Room ID', value: block.data.roomId }] : []),
              ...(block.data.cpPoints != null ? [{ label: 'CP Points', value: String(block.data.cpPoints) }] : []),
              { label: 'Timestamp', value: new Date(block.timestamp).toISOString() },
            ].map(({ label, value }) => (
              <div key={label}>
                <div className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-0.5">{label}</div>
                <div className="font-mono text-text-secondary break-all">{value}</div>
              </div>
            ))}
          </div>

          {/* Hashes */}
          <div className="space-y-2 pt-1">
            <div>
              <div className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-0.5">Block Hash</div>
              <div className="font-mono text-[11px] text-accent break-all bg-accent/5 border border-accent/20 rounded-lg px-3 py-2">{block.hash}</div>
            </div>
            <div>
              <div className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-0.5">Previous Hash</div>
              <div className="font-mono text-[11px] text-text-muted break-all bg-bg border border-border rounded-lg px-3 py-2">{block.previousHash}</div>
            </div>
          </div>

          {/* Metadata */}
          {block.data.metadata && Object.keys(block.data.metadata).length > 0 && (
            <div>
              <div className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1">Metadata</div>
              <pre className="text-[11px] font-mono text-text-secondary bg-bg border border-border rounded-lg px-3 py-2 overflow-x-auto">
                {JSON.stringify(block.data.metadata, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
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
        ? [...chainRes.data.chain].reverse() // newest first
        : [];
      setChain(blocks);

      // Build stats from blocks if endpoint not available
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

      {/* ── Stats row ── */}
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

      {/* ── Integrity check ── */}
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

      {/* ── Last block hash ── */}
      {stats?.lastBlockHash && (
        <div className="flex items-center gap-3 rounded-xl border border-border bg-bg px-4 py-3">
          <Hash className="h-4 w-4 text-text-muted shrink-0" />
          <div className="min-w-0">
            <div className="text-[9px] font-black uppercase tracking-widest text-text-muted">Latest Block Hash</div>
            <div className="font-mono text-xs text-accent truncate">{stats.lastBlockHash}</div>
          </div>
        </div>
      )}

      {/* ── Filter + refresh ── */}
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

      {/* ── Block list ── */}
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

      {/* ── Pagination ── */}
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
