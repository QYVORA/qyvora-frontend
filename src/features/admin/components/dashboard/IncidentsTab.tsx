import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Link2, OctagonAlert, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
      setError(t('admin.incidents.loadFailed'));
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
        addToast(t('admin.audit.unauditedWarning'), 'warning');
      } else {
        addToast(t('admin.incidents.created'), 'success');
      }
      setForm({ title: '', description: '', severity: 'medium', correlationId: '' });
      setShowForm(false);
      await fetchIncidents(1);
    } catch (e: any) {
      addToast(e?.response?.data?.error || t('admin.incidents.createFailed'), 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleStatusChange = async (incident: IncidentItem, status: IncidentStatus) => {
    try {
      const res = await api.patch(`/admin/incidents/${encodeURIComponent(incident.id)}/status`, { status });
      if (res?.data?.audited === false) {
        addToast(t('admin.audit.unauditedWarning'), 'warning');
      } else {
        addToast(t('admin.incidents.statusUpdated'), 'success');
      }
      await fetchIncidents(page);
    } catch (e: any) {
      addToast(e?.response?.data?.error || t('admin.incidents.statusUpdateFailed'), 'error');
    }
  };

  const nextActions = (incident: IncidentItem): Array<{ label: string; status: IncidentStatus }> => {
    switch (incident.status) {
      case 'open': return [{ label: t('admin.incidents.startMonitoring'), status: 'monitoring' }, { label: t('admin.incidents.resolve'), status: 'resolved' }];
      case 'monitoring': return [{ label: t('admin.incidents.resolve'), status: 'resolved' }];
      default: return [{ label: t('admin.incidents.reopen'), status: 'open' }];
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          aria-label={t('admin.incidents.filterStatus')}
          className="bg-bg border border-border rounded-xl px-3 py-2 text-xs text-text-primary focus:border-accent outline-none appearance-none"
        >
          <option value="">{t('admin.incidents.allStatuses')}</option>
          <option value="open">{t('admin.incidents.statusOpen')}</option>
          <option value="monitoring">{t('admin.incidents.statusMonitoring')}</option>
          <option value="resolved">{t('admin.incidents.statusResolved')}</option>
        </select>
        <select
          value={severityFilter}
          onChange={(e) => { setSeverityFilter(e.target.value); setPage(1); }}
          aria-label={t('admin.incidents.filterSeverity')}
          className="bg-bg border border-border rounded-xl px-3 py-2 text-xs text-text-primary focus:border-accent outline-none appearance-none"
        >
          <option value="">{t('admin.incidents.allSeverities')}</option>
          <option value="low">{t('admin.incidents.severityLow')}</option>
          <option value="medium">{t('admin.incidents.severityMedium')}</option>
          <option value="high">{t('admin.incidents.severityHigh')}</option>
          <option value="critical">{t('admin.incidents.severityCritical')}</option>
        </select>
        <button
          onClick={() => setShowForm((v) => !v)}
          className={`${BTN_CLS} ${showForm ? 'btn-secondary' : 'btn-primary'} px-4`}
        >
          <Plus className="w-4 h-4" />
          {t('admin.incidents.newIncident')}
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-border/40 bg-bg-card p-5 space-y-4" aria-label={t('admin.incidents.newIncident')}>
          <div>
            <label htmlFor="incident-title" className="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-1.5">
              {t('admin.incidents.titleLabel')}
            </label>
            <input
              id="incident-title"
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className={INPUT_CLS}
              placeholder={t('admin.incidents.titlePlaceholder')}
            />
          </div>
          <div>
            <label htmlFor="incident-description" className="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-1.5">
              {t('admin.incidents.descriptionLabel')}
            </label>
            <textarea
              id="incident-description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              className={`${INPUT_CLS} resize-none`}
              placeholder={t('admin.incidents.descriptionPlaceholder')}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="incident-severity" className="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-1.5">
                {t('admin.incidents.severityLabel')}
              </label>
              <select
                id="incident-severity"
                value={form.severity}
                onChange={(e) => setForm((f) => ({ ...f, severity: e.target.value }))}
                className={INPUT_CLS}
              >
                <option value="low">{t('admin.incidents.severityLow')}</option>
                <option value="medium">{t('admin.incidents.severityMedium')}</option>
                <option value="high">{t('admin.incidents.severityHigh')}</option>
                <option value="critical">{t('admin.incidents.severityCritical')}</option>
              </select>
            </div>
            <div>
              <label htmlFor="incident-correlation" className="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-1.5">
                {t('admin.incidents.correlationLabel')}
              </label>
              <input
                id="incident-correlation"
                type="text"
                value={form.correlationId}
                onChange={(e) => setForm((f) => ({ ...f, correlationId: e.target.value }))}
                className={`${INPUT_CLS} font-mono text-xs`}
                placeholder={t('admin.incidents.correlationPlaceholder')}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowForm(false)} className={`${BTN_CLS} btn-secondary px-4`}>
              {t('button.cancel')}
            </button>
            <button
              onClick={() => void handleCreate()}
              disabled={creating || !form.title.trim()}
              className={`${BTN_CLS} btn-primary px-5 disabled:opacity-50`}
            >
              {creating ? t('admin.syncing') : t('admin.incidents.createButton')}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-2" role="status">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} variant="card" className="h-16 rounded-xl bg-bg-card border border-border" />)}</div>
      ) : error ? (
        <ErrorState message={error} title={t('admin.incidents.unavailable')} />
      ) : incidents.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border py-12 text-center">
          <OctagonAlert size={40} className="mx-auto mb-3 text-text-muted opacity-30" />
          <p className="text-sm text-text-muted font-bold">{t('admin.incidents.empty')}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {incidents.map((incident) => (
            <div key={incident.id} className="rounded-xl border border-border bg-bg-card p-4 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={SEVERITY_VARIANT[incident.severity]}>{incident.severity}</Badge>
                <Badge variant={STATUS_VARIANT[incident.status]}>{incident.status}</Badge>
                <span className="font-bold text-sm text-text-primary truncate">{incident.title}</span>
                <span className="ml-auto text-[10px] font-mono text-text-muted/60 whitespace-nowrap">
                  {new Date(incident.createdAt).toLocaleString()}
                </span>
              </div>
              {incident.description && (
                <p className="text-xs text-text-secondary break-words">{incident.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-mono text-text-muted/70">
                <span>{t('admin.incidents.createdBy')}: {incident.createdBy?.name || t('common2.unknown')}</span>
                {incident.resolvedAt && (
                  <span>{t('admin.incidents.resolvedAt')}: {new Date(incident.resolvedAt).toLocaleString()}</span>
                )}
                {incident.correlationId && (
                  <button
                    onClick={() => navigate(`?tab=security&requestId=${encodeURIComponent(incident.correlationId)}`)}
                    aria-label={t('admin.audit.viewSecurityEvents')}
                    className="inline-flex items-center gap-1 text-accent/80 hover:text-accent transition-colors min-h-[24px]"
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
                      className={`${BTN_CLS} ${action.status === 'resolved' ? 'btn-primary' : 'btn-secondary'} px-3 py-1.5 min-h-[32px]`}
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
            aria-label={t('components.dataTable.prevPage')}
            className="w-11 h-11 flex items-center justify-center rounded-lg bg-bg-elevated text-text-muted disabled:opacity-50 hover:text-accent transition-[color,transform] duration-[var(--dur-fast)] ease-[var(--ease-smooth)] active:scale-90"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-[10px] font-mono text-text-muted px-2">{t('components.dataTable.pageOf', { page, total: totalPages })}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            aria-label={t('components.dataTable.nextPage')}
            className="w-11 h-11 flex items-center justify-center rounded-lg bg-bg-elevated text-text-muted disabled:opacity-50 hover:text-accent transition-[color,transform] duration-[var(--dur-fast)] ease-[var(--ease-smooth)] active:scale-90"
          >
            <IconChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default IncidentsTab;
