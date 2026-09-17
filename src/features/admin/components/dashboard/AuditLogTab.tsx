import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Filter, Link2 } from 'lucide-react';
import { IconChevronRight, IconClock } from '@/shared/components/icons';
import api from '@/core/services/api';
import { Skeleton, ErrorState } from '@/shared/components/ui';
import type { AuditLogEntry } from '@/features/admin/types/admin.types';

const AuditLogTab = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [actionFilter, setActionFilter] = useState('');
  const [availableActions, setAvailableActions] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [correlationFilter, setCorrelationFilter] = useState('');
  const limit = 30;

  const fetchLogs = async (p = 1) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ limit: String(limit), page: String(p) });
      if (actionFilter) params.set('action', actionFilter);
      if (dateFrom) params.set('dateFrom', dateFrom);
      if (dateTo) params.set('dateTo', dateTo);
      if (correlationFilter.trim()) params.set('correlationId', correlationFilter.trim());
      const res = await api.get(`/admin/audit-log?${params}`);
      setEntries(res.data?.items || []);
      setTotal(Number(res.data?.total || 0));
      setTotalPages(Math.max(1, Number(res.data?.pages || 1)));
      setPage(Math.max(1, Number(res.data?.page || p)));
      if (res.data?.availableActions) setAvailableActions(res.data.availableActions);
    } catch {
      setError("Audit log could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(page); }, [page, actionFilter]);

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
            <option value="">{"All Actions"}</option>
            {availableActions.map((a) => (
              <option key={a} value={a}>{a.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          aria-label={"From date"}
          className="bg-bg border border-border rounded-xl px-3 py-2 text-xs text-text-primary focus:border-accent outline-none"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          aria-label={"To date"}
          className="bg-bg border border-border rounded-xl px-3 py-2 text-xs text-text-primary focus:border-accent outline-none"
        />
        <input
          type="text"
          value={correlationFilter}
          onChange={(e) => setCorrelationFilter(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') fetchLogs(1); }}
          placeholder={"Correlation ID"}
          aria-label={"Correlation ID"}
          className="w-44 bg-bg border border-border rounded-xl px-3 py-2 text-xs font-mono text-text-primary focus:border-accent outline-none"
        />
        <button
          onClick={() => fetchLogs(1)}
          className="btn-primary px-3 py-2"
        >
          {"Filter"}
        </button>
        <span className="text-xs text-text-muted font-mono">{`${total} entries`}</span>
      </div>

      {loading ? (
        <div className="space-y-2" role="status">{Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} variant="card" className="h-12 rounded-xl bg-bg-card border border-border" />)}</div>
      ) : error ? (
        <ErrorState message={error} title={"Audit log unavailable"} />
      ) : entries.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border py-12 text-center">
          <IconClock size={40} className="mx-auto mb-3 text-text-muted opacity-30" />
          <p className="text-sm text-text-muted font-bold">{"No audit log entries"}</p>
        </div>
      ) : (
        <div className="space-y-1">
          {entries.map((entry) => (
            <div key={entry.id} className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-border bg-bg-card text-xs">
              <div className="w-2 h-2 rounded-full bg-accent/60 shrink-0" />
              <div className="flex-1 min-w-0 grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-1 items-center sm:grid-cols-[120px_100px_minmax(0,1fr)_auto] sm:gap-y-0">
                <span className="font-mono text-text-muted min-w-0 truncate col-start-1 row-start-1 sm:col-start-1 sm:row-start-auto">{new Date(entry.createdAt).toLocaleString()}</span>
                <span className="font-bold text-text-primary truncate col-start-2 row-start-1 sm:col-start-2 sm:row-start-auto">{entry.admin?.name || "Unknown"}</span>
                <span className="text-text-secondary truncate col-start-1 min-w-0 row-start-2 sm:col-start-3 sm:row-start-auto">
                  <span className="font-bold text-accent">{entry.action.replace(/_/g, ' ')}</span>
                  <span className="text-text-muted/60 mx-1">→</span>
                  <span className="font-mono">{entry.targetType}:{entry.targetId?.slice(0, 20)}</span>
                </span>
                <span className="flex flex-col items-end gap-0.5 col-start-2 row-start-2 sm:col-start-4 sm:row-start-auto">
                  <span className="text-xs font-mono text-text-muted/60">{entry.ipAddress}</span>
                  {entry.correlationId ? (
                    <button
                      onClick={() => navigate(`?tab=security&requestId=${encodeURIComponent(entry.correlationId!)}`)}
                      title={"View related security events"}
                      aria-label={"View related security events"}
                      className="inline-flex items-center gap-1 text-xs font-mono text-accent/80 hover:text-accent transition-colors min-h-[44px]"
                    >
                      <Link2 size={10} />
                      {entry.correlationId.slice(0, 8)}
                    </button>
                  ) : (
                    <span className="text-xs font-mono text-text-muted/30">—</span>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            aria-label={"Previous page"}
            className="w-11 h-11 flex items-center justify-center rounded-lg bg-bg-elevated text-text-muted disabled:opacity-50 hover:text-accent transition-[color,transform] duration-[var(--dur-fast)] ease-[var(--ease-smooth)] active:scale-90"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-mono text-text-muted px-2">{`Page ${page} of ${totalPages}`}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            aria-label={"Next page"}
            className="w-11 h-11 flex items-center justify-center rounded-lg bg-bg-elevated text-text-muted disabled:opacity-50 hover:text-accent transition-[color,transform] duration-[var(--dur-fast)] ease-[var(--ease-smooth)] active:scale-90"
          >
            <IconChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default AuditLogTab;
