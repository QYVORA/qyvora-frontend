import React, { useCallback, useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Clock, RefreshCw } from 'lucide-react';
import SEO from '@/shared/components/SEO';
import PageHeader from '@/shared/components/ui/PageHeader';
import PublicContainer from '@/shared/components/layout/PublicContainer';
import Button from '@/shared/components/ui/Button';
import Badge from '@/shared/components/ui/Badge';
import { Card } from '@/shared/components/ui/Card';
import api from '@/core/services/api';

type StatusLevel = 'operational' | 'degraded' | 'outage' | 'unknown';
type IncidentStatus = 'open' | 'monitoring' | 'resolved';
type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';

interface StatusComponent {
  id: string;
  name: string;
  status: StatusLevel;
  detail: string;
}

interface StatusIncident {
  id: string;
  title: string;
  description: string;
  status: IncidentStatus;
  severity: IncidentSeverity;
  createdAt: string;
  resolvedAt: string | null;
}

interface StatusResponse {
  status: StatusLevel;
  checkedAt: string;
  components: StatusComponent[];
  incidents: StatusIncident[];
}

const LEVEL_LABEL: Record<StatusLevel, string> = {
  operational: 'Operational',
  degraded: 'Degraded performance',
  outage: 'Service outage',
  unknown: 'Unknown',
};

const LEVEL_VARIANT: Record<StatusLevel, 'success' | 'warning' | 'danger' | 'default'> = {
  operational: 'success',
  degraded: 'warning',
  outage: 'danger',
  unknown: 'default',
};

const SEVERITY_VARIANT: Record<IncidentSeverity, 'default' | 'accent' | 'warning' | 'danger'> = {
  low: 'default',
  medium: 'accent',
  high: 'warning',
  critical: 'danger',
};

const INCIDENT_VARIANT: Record<IncidentStatus, 'danger' | 'warning' | 'success'> = {
  open: 'danger',
  monitoring: 'warning',
  resolved: 'success',
};

const formatDateTime = (value: string | null) => {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

const StatusPage: React.FC = () => {
  const [data, setData] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadStatus = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError('');
    try {
      const response = await api.get<StatusResponse>('/public/status');
      setData(response.data);
    } catch {
      setError('Status data is unavailable right now. The API may be unreachable.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadStatus();
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') void loadStatus(true);
    }, 60_000);
    return () => window.clearInterval(timer);
  }, [loadStatus]);

  const currentStatus = data?.status ?? 'unknown';
  const CurrentStatusIcon = currentStatus === 'operational' ? CheckCircle2 : AlertCircle;
  const currentStatusTone =
    currentStatus === 'operational'
      ? 'border-accent/30 bg-accent/10 text-accent'
      : currentStatus === 'degraded'
        ? 'border-semantic-warning/30 bg-semantic-warning/10 text-semantic-warning'
        : 'border-semantic-danger/30 bg-semantic-danger/10 text-semantic-danger';

  const activeIncidents = (data?.incidents ?? []).filter(
    (incident) => incident.status !== 'resolved',
  );
  const resolvedIncidents = (data?.incidents ?? []).filter(
    (incident) => incident.status === 'resolved',
  );

  return (
    <div className="w-full bg-canvas">
      <SEO
        title="System Status | QYVORA"
        description="Live status for the QYVORA API, database and chain, plus published incident updates."
      />
      <PublicContainer className="pb-20 pt-24 md:pb-24 md:pt-28 lg:pt-32">
        <PageHeader
          kicker={"QYVORA · Status"}
          title={"System status"}
          description={"Live health for the platform services, plus incident updates published by the operations desk. This page refreshes every 60 seconds."}
          actions={
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={() => void loadStatus(true)}
              loading={refreshing}
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Refresh status
            </Button>
          }
        />

        <div className="mt-8" role="status" aria-live="polite">
          {loading && !data ? (
            <Card className="flex flex-col gap-3 p-6 md:p-8">
              <p className="type-label uppercase tracking-[0.12em] text-accent">
                {"Checking services"}
              </p>
              <p className="type-body-sm text-text-secondary">
                {"Reading the latest health check and incident feed…"}
              </p>
            </Card>
          ) : error ? (
            <Card className="flex flex-col items-start gap-3 p-6 md:p-8">
              <AlertCircle className="h-6 w-6 text-semantic-danger" aria-hidden="true" />
              <h2 className="type-h3 font-black uppercase tracking-tight text-text-primary">
                {"Status unavailable"}
              </h2>
              <p className="type-body-sm max-w-xl text-text-secondary">{error}</p>
              <Button type="button" onClick={() => void loadStatus(true)} loading={refreshing}>
                Try again
              </Button>
            </Card>
          ) : data ? (
            <>
              <Card className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between md:p-8">
                <div className="flex items-start gap-4">
                  <span className={`mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${currentStatusTone}`}>
                    <CurrentStatusIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="type-label uppercase tracking-[0.12em] text-text-tertiary">
                      {"Current status"}
                    </p>
                    <h2 className="mt-1 text-2xl font-black uppercase tracking-tight text-text-primary">
                      {LEVEL_LABEL[data.status]}
                    </h2>
                    <p className="type-body-sm mt-1 flex items-center gap-1.5 text-text-muted">
                      <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                      {`Last checked ${formatDateTime(data.checkedAt)}`}
                    </p>
                  </div>
                </div>
                <Badge variant={LEVEL_VARIANT[data.status]} size="md">
                  {data.status}
                </Badge>
              </Card>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {data.components.map((component) => (
                  <Card key={component.id} className="flex flex-col gap-3 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-black uppercase tracking-tight text-text-primary">
                        {component.name}
                      </h3>
                      <Badge variant={LEVEL_VARIANT[component.status]} size="sm">
                        {component.status}
                      </Badge>
                    </div>
                    <p className="type-body-sm text-text-secondary">{component.detail}</p>
                  </Card>
                ))}
              </div>
            </>
          ) : null}
        </div>

        <section aria-labelledby="active-incidents-title" className="mt-12">
          <div className="mb-4">
            <h2
              id="active-incidents-title"
              className="type-h3 font-black uppercase tracking-tight text-text-primary"
            >
              {"Active incidents"}
            </h2>
            <p className="type-body-sm mt-1 text-text-muted">
              {"Published by the operations desk. Internal incidents are not listed here."}
            </p>
          </div>

          {activeIncidents.length === 0 ? (
            <Card className="flex items-center gap-3 p-5">
              <CheckCircle2 className="h-5 w-5 text-accent" aria-hidden="true" />
              <p className="type-body-sm text-text-secondary">
                {"No active incidents. All published services are operating normally."}
              </p>
            </Card>
          ) : (
            <div className="flex flex-col gap-3">
              {activeIncidents.map((incident) => (
                <Card key={incident.id} className="flex flex-col gap-3 p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={SEVERITY_VARIANT[incident.severity]} size="sm">
                      {incident.severity}
                    </Badge>
                    <Badge variant={INCIDENT_VARIANT[incident.status]} size="sm">
                      {incident.status}
                    </Badge>
                    <h3 className="text-sm font-black uppercase tracking-tight text-text-primary">
                      {incident.title}
                    </h3>
                    <span className="type-meta ml-auto text-text-muted">
                      {formatDateTime(incident.createdAt)}
                    </span>
                  </div>
                  {incident.description && (
                    <p className="type-body-sm text-text-secondary">{incident.description}</p>
                  )}
                </Card>
              ))}
            </div>
          )}
        </section>

        {resolvedIncidents.length > 0 && (
          <section aria-labelledby="resolved-incidents-title" className="mt-10">
            <div className="mb-4">
              <h2
                id="resolved-incidents-title"
                className="type-h3 font-black uppercase tracking-tight text-text-primary"
              >
                {"Recently resolved"}
              </h2>
            </div>
            <div className="flex flex-col gap-3">
              {resolvedIncidents.map((incident) => (
                <Card key={incident.id} className="flex flex-col gap-2 p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={INCIDENT_VARIANT[incident.status]} size="sm">
                      {incident.status}
                    </Badge>
                    <h3 className="text-sm font-black uppercase tracking-tight text-text-primary">
                      {incident.title}
                    </h3>
                    <span className="type-meta ml-auto text-text-muted">
                      {`Resolved ${formatDateTime(incident.resolvedAt)}`}
                    </span>
                  </div>
                  {incident.description && (
                    <p className="type-body-sm text-text-secondary">{incident.description}</p>
                  )}
                </Card>
              ))}
            </div>
          </section>
        )}

        <Card className="mt-12 flex flex-col items-start gap-4 p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <p className="type-label uppercase tracking-[0.12em] text-accent">
              {"Seeing a problem?"}
            </p>
            <p className="type-body-sm mt-1 max-w-xl text-text-secondary">
              {"If something looks wrong and it is not listed here, report it to the operations desk."}
            </p>
          </div>
          <Button to="/contact" size="lg">
            Contact the desk
          </Button>
        </Card>
      </PublicContainer>
    </div>
  );
};

export default StatusPage;
