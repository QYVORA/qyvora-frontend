import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Link2, OctagonAlert, Plus } from 'lucide-react';
import { IconChevronRight } from '@/shared/components/icons';
import api from '@/core/services/api';
import { useToast } from '@/core/contexts/ToastContext';
import { Badge, ErrorState, Skeleton } from '@/shared/components/ui';
import { INPUT_CLS, BTN_CLS, type IncidentItem, type IncidentStatus, type IncidentSeverity } from '../../types/admin.types';

const STATUS_VARIANT: Record<IncidentStatus, 'danger' | 'warning' | 'success'> = {
  open: 'danger',
  monitoring: 'warning',
  resolved: 'success',
};

const SEVERITY_VARIANT: Record<IncidentSeverity, 'default' | 'accent' | 'warning' | 'danger'> = {
  low: 'default',
  medium: 'accent',
  high: 'warning',
  critical: 'danger',
};

const IncidentsTab = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [incidents, setIncidents] = useState<IncidentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const limit = 20;

  // Create form
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', severity: 'medium', correlationId: '' });

  const fetchIncidents = async (p = 1) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ limit: String(limit), page: String(p) });
      if (statusFilter) params.set('status', statusFilter);
      if (severityFilter) params.set('severity', severityFilter);
      const res = await api.get(`/admin/incidents?${params}`);
      setIncidents(Array.isArray(res.data?.items) ? res.data.items : []);
      setTotalPages(Math.max(1, Number(res.data?.pages || 1)));
      setPage(Math.max(1, Number(res.data?.page || p)));
    } catch {
      setError("Incidents could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchIncidents(page); }, [page, statusFilter, severityFilter]);

  const handleCreate = async () => {
    if (!form.title.trim()) return;
    setCreating(true);
    try {
      const res = await api.post('/admin/incidents', {
        title: form.title.trim(),
        description: form.description.trim(),
        severity: form.severity,
        correlationId: form.correlationId.trim(),
      });
      if (res?.data?.audited === false) {
        addToast("Action applied, but its audit entry could not be written. Please verify and retry.", 'warning');
      } else {
        addToast("Incident created", 'success');
      }
      setForm({ title: '', description: '', severity: 'medium', correlationId: '' });
      setShowForm(false);
      await fetchIncidents(1);
    } catch (e: any) {
      addToast(e?.response?.data?.error || "Could not create incident", 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleStatusChange = async (incident: IncidentItem, status: IncidentStatus) => {
    try {
      const res = await api.patch(`/admin/incidents/${encodeURIComponent(incident.id)}/status`, { status });
      if (res?.data?.audited === false) {
        addToast("Action applied, but its audit entry could not be written. Please verify and retry.", 'warning');
      } else {
        addToast("Incident status updated", 'success');
      }
      await fetchIncidents(page);
    } catch (e: any) {
      addToast(e?.response?.data?.error || "Could not update incident status", 'error');
    }
  };

  const nextActions = (incident: IncidentItem): Array<{ label: string; status: IncidentStatus }> => {
    switch (incident.status) {
      case 'open': return [{ label: "Monitor", status: 'monitoring' }, { label: "Resolve", status: 'resolved' }];
      case 'monitoring': return [{ label: "Resolve", status: 'resolved' }];
      default: return [{ label: "Reopen", status: 'open' }];
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          aria-label={"Filter by status"}
          className="bg-surface border border-border-subtle rounded-xl px-3 py-2 text-xs text-text-primary focus:border-accent outline-none appearance-none"
        >
          <option value="">{"All statuses"}</option>
          <option value="open">{"Open"}</option>
          <option value="monitoring">{"Monitoring"}</option>
          <option value="resolved">{"Resolved"}</option>
        </select>
        <select
          value={severityFilter}
          onChange={(e) => { setSeverityFilter(e.target.value); setPage(1); }}
          aria-label={"Filter by severity"}
          className="bg-surface border border-border-subtle rounded-xl px-3 py-2 text-xs text-text-primary focus:border-accent outline-none appearance-none"
        >
          <option value="">{"All severities"}</option>
          <option value="low">{"Low"}</option>
          <option value="medium">{"Medium"}</option>
          <option value="high">{"High"}</option>
          <option value="critical">{"Critical"}</option>
        </select>
        <button
          onClick={() => setShowForm((v) => !v)}
          className={`${BTN_CLS} ${showForm ? 'btn-secondary' : 'btn-primary'} px-4`}
        >
          <Plus className="w-4 h-4" />
          {"New incident"}
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-border-subtle bg-surface p-5 space-y-4" aria-label={"New incident"}>
          <div>
            <label htmlFor="incident-title" className="block text-xs font-black uppercase tracking-widest text-text-muted mb-1.5">
              {"Title"}
            </label>
            <input
              id="incident-title"
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className={INPUT_CLS}
              placeholder={"Short incident summary"}
            />
          </div>
          <div>
            <label htmlFor="incident-description" className="block text-xs font-black uppercase tracking-widest text-text-muted mb-1.5">
              {"Description"}
            </label>
            <textarea
              id="incident-description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              className={`${INPUT_CLS} resize-none`}
              placeholder={"What happened, scope, and current impact"}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="incident-severity" className="block text-xs font-black uppercase tracking-widest text-text-muted mb-1.5">
                {"Severity"}
              </label>
              <select
                id="incident-severity"
                value={form.severity}
                onChange={(e) => setForm((f) => ({ ...f, severity: e.target.value }))}
                className={INPUT_CLS}
              >
                <option value="low">{"Low"}</option>
                <option value="medium">{"Medium"}</option>
                <option value="high">{"High"}</option>
                <option value="critical">{"Critical"}</option>
              </select>
            </div>
            <div>
              <label htmlFor="incident-correlation" className="block text-xs font-black uppercase tracking-widest text-text-muted mb-1.5">
                {"Correlation ID (optional)"}
              </label>
              <input
                id="incident-correlation"
                type="text"
                value={form.correlationId}
                onChange={(e) => setForm((f) => ({ ...f, correlationId: e.target.value }))}
                className={`${INPUT_CLS} font-mono text-xs`}
                placeholder={"Request ID from audit or security events"}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowForm(false)} className={`${BTN_CLS} btn-secondary px-4`}>
              {"Cancel"}
            </button>
            <button
              onClick={() => void handleCreate()}
              disabled={creating || !form.title.trim()}
              className={`${BTN_CLS} btn-primary px-5 disabled:opacity-50`}
            >
              {creating ? "Synchronizing encrypted data…" : "Create incident"}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-2" role="status">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} variant="card" className="h-16 rounded-xl bg-surface border border-border-subtle" />)}</div>
      ) : error ? (
        <ErrorState message={error} title={"Incident tracker unavailable"} />
      ) : incidents.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border py-12 text-center">
          <OctagonAlert size={40} className="mx-auto mb-3 text-text-muted opacity-30" />
          <p className="text-sm text-text-muted font-bold">{"No incidents recorded."}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {incidents.map((incident) => (
            <div key={incident.id} className="rounded-xl border border-border-subtle bg-surface p-4 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={SEVERITY_VARIANT[incident.severity]}>{incident.severity}</Badge>
                <Badge variant={STATUS_VARIANT[incident.status]}>{incident.status}</Badge>
                <span className="font-bold text-sm text-text-primary truncate">{incident.title}</span>
                <span className="ml-auto text-xs font-mono text-text-muted/60 whitespace-nowrap">
                  {new Date(incident.createdAt).toLocaleString()}
                </span>
              </div>
              {incident.description && (
                <p className="text-xs text-text-secondary break-words">{incident.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono text-text-muted/70">
                <span>{"Created by"}: {incident.createdBy?.name || "Unknown"}</span>
                {incident.resolvedAt && (
                  <span>{"Resolved"}: {new Date(incident.resolvedAt).toLocaleString()}</span>
                )}
                {incident.correlationId && (
                  <button
                    onClick={() => navigate(`?tab=security&requestId=${encodeURIComponent(incident.correlationId)}`)}
                    aria-label={"View related security events"}
                    className="inline-flex items-center gap-1 text-accent/80 hover:text-accent transition-colors min-h-[44px]"
                  >
                    <Link2 size={11} />
                    {incident.correlationId.slice(0, 8)}
                  </button>
                )}
                <span className="ml-auto flex items-center gap-2">
                  {nextActions(incident).map((action) => (
                    <button
                      key={action.status}
                      onClick={() => void handleStatusChange(incident, action.status)}
                      className={`${BTN_CLS} ${action.status === 'resolved' ? 'btn-primary' : 'btn-secondary'} px-3 py-1.5`}
                    >
                      {action.label}
                    </button>
                  ))}
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
            className="w-11 h-11 flex items-center justify-center rounded-lg bg-surface-raised text-text-muted disabled:opacity-50 hover:text-accent transition-[color,transform] duration-[var(--dur-fast)] ease-[var(--ease-smooth)] active:scale-90"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-mono text-text-muted px-2">{`Page ${page} of ${totalPages}`}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            aria-label={"Next page"}
            className="w-11 h-11 flex items-center justify-center rounded-lg bg-surface-raised text-text-muted disabled:opacity-50 hover:text-accent transition-[color,transform] duration-[var(--dur-fast)] ease-[var(--ease-smooth)] active:scale-90"
          >
            <IconChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default IncidentsTab;
