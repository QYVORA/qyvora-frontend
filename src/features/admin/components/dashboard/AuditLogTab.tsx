import { useEffect, useState } from 'react';
import { Filter } from 'lucide-react';
import { IconClock } from '@/shared/components/icons';
import api from '@/core/services/api';
import { Skeleton } from '@/shared/components/ui';
import type { AuditLogEntry } from '@/features/admin/types/admin.types';

const AuditLogTab = () => {
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [actionFilter, setActionFilter] = useState('');
  const [availableActions, setAvailableActions] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const limit = 30;

  const fetchLogs = async (p = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: String(limit), page: String(p) });
      if (actionFilter) params.set('action', actionFilter);
      if (dateFrom) params.set('dateFrom', dateFrom);
      if (dateTo) params.set('dateTo', dateTo);
      const res = await api.get(`/admin/audit-log?${params}`);
      setEntries(res.data?.items || []);
      setTotal(res.data?.total || 0);
      if (res.data?.availableActions) setAvailableActions(res.data.availableActions);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(page); }, [page, actionFilter]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
          <select
            value={actionFilter}
            onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
            className="w-full bg-bg border border-border rounded-xl pl-9 pr-3 py-2 text-xs text-text-primary focus:border-accent outline-none transition-colors appearance-none"
          >
            <option value="">All Actions</option>
            {availableActions.map((a) => (
              <option key={a} value={a}>{a.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="bg-bg border border-border rounded-xl px-3 py-2 text-xs text-text-primary focus:border-accent outline-none"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="bg-bg border border-border rounded-xl px-3 py-2 text-xs text-text-primary focus:border-accent outline-none"
        />
        <button
          onClick={() => fetchLogs(1)}
          className="btn-primary px-3 py-2"
        >
          Filter
        </button>
        <span className="text-xs text-text-muted font-mono">{total} entries</span>
      </div>

      {loading ? (
        <div className="space-y-2">{Array.from({ length: 10 }).map((_, i) => <div key={i} className="h-12 rounded-xl bg-bg-card border border-border animate-pulse" />)}</div>
      ) : entries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/30 py-12 text-center">
          <IconClock size={40} className="mx-auto mb-3 text-text-muted opacity-30" />
          <p className="text-sm text-text-muted font-bold">No audit log entries</p>
        </div>
      ) : (
        <div className="space-y-1">
          {entries.map((entry) => (
            <div key={entry.id} className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-border bg-bg-card text-xs">
              <div className="w-2 h-2 rounded-full bg-accent/60 shrink-0" />
              <div className="flex-1 min-w-0 grid grid-cols-[120px_100px_1fr_auto] gap-3 items-center">
                <span className="font-mono text-text-muted">{new Date(entry.createdAt).toLocaleString()}</span>
                <span className="font-bold text-text-primary truncate">{entry.admin?.name || 'Unknown'}</span>
                <span className="text-text-secondary truncate">
                  <span className="font-bold text-accent">{entry.action.replace(/_/g, ' ')}</span>
                  <span className="text-text-muted/60 mx-1">→</span>
                  <span className="font-mono">{entry.targetType}:{entry.targetId?.slice(0, 20)}</span>
                </span>
                <span className="text-[10px] font-mono text-text-muted/60">{entry.ipAddress}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                page === i + 1 ? 'btn-primary' : 'btn-secondary'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuditLogTab;
