import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { SecurityEventItem } from '../../types/admin.types';
import type { SectionStatus } from '../../pages/AdminDashboardPage';
import { StatCard, DataTable } from '@/shared/components/dashboard';
import type { Column } from '@/shared/components/dashboard';
import { ErrorState } from '@/shared/components/ui';

interface SecurityTabProps {
  securitySummary: any;
  securityEvents: SecurityEventItem[];
  summaryStatus?: SectionStatus;
  eventsStatus?: SectionStatus;
  onRetry?: () => void;
}

const SecurityTab: React.FC<SecurityTabProps> = ({ securitySummary, securityEvents, summaryStatus = 'loaded', eventsStatus = 'loaded', onRetry }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Audit pivot: /dashboard?tab=security&requestId=<correlationId> filters the
  // event stream down to the exact request that produced an audit entry.
  const requestIdFilter = new URLSearchParams(location.search).get('requestId') || '';

  const filteredEvents = useMemo(
    () => (requestIdFilter ? securityEvents.filter((e) => e.requestId === requestIdFilter) : securityEvents),
    [securityEvents, requestIdFilter],
  );

  const clearRequestFilter = () => navigate('?', { replace: true });
  const columns: Column<SecurityEventItem>[] = [
    { key: 'createdAt', header: "Time", render: (item) => <span className="text-text-muted/60 font-mono whitespace-nowrap text-xs">{item.createdAt ? new Date(item.createdAt).toLocaleString() : '-'}</span> },
    { key: 'eventType', header: "Type", render: (item) => <span className="px-2.5 py-1 rounded-lg bg-accent-dim text-xs font-black uppercase tracking-widest text-accent whitespace-nowrap border border-accent/10">{item.eventType}</span> },
    { key: 'action', header: "Action", render: (item) => <span className="font-black uppercase tracking-tight text-text-primary text-sm whitespace-nowrap">{item.action}</span> },
    { key: 'path', header: "Path", render: (item) => <span className="font-mono text-text-muted/70 max-w-[240px] truncate block text-xs">{item.path || '-'}</span> },
    { key: 'statusCode', header: "Code", render: (item) => <span className={`px-2.5 py-1 rounded-lg text-xs font-black font-mono border ${Number(item.statusCode) >= 400 ? 'bg-danger/10 text-danger border-danger/20' : 'bg-accent/10 text-accent border-accent/20'}`}>{item.statusCode}</span> },
    { key: 'ipAddress', header: "IP", render: (item) => <span className="font-mono text-text-secondary/80 whitespace-nowrap text-xs">{item.ipAddress || '-'}</span> },
  ];

  const mobileCard = (item: SecurityEventItem) => (
    <div className="bg-surface border border-border-subtle rounded-2xl p-5 space-y-3 text-xs">
      <div className="flex justify-between items-center">
        <span className="font-black text-accent uppercase tracking-[0.2em] text-xs">{item.eventType}</span>
        <span className="text-xs text-text-muted/60 font-mono">{item.createdAt ? new Date(item.createdAt).toLocaleString() : '-'}</span>
      </div>
      <div className="font-black text-text-primary uppercase tracking-tighter text-sm">{item.action}</div>
      <div className="bg-surface-raised px-4 py-3 rounded-xl font-mono text-xs text-accent/70 border border-border-subtle whitespace-nowrap overflow-x-auto no-scrollbar">
        {item.path || '-'}
      </div>
      <div className="flex justify-between items-center pt-2 text-xs font-black text-text-muted/40 uppercase tracking-widest">
        <span className={Number(item.statusCode) >= 400 ? 'text-danger' : 'text-accent'}>HTTP {item.statusCode}</span>
        <span className="font-mono">{item.ipAddress || '-'}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {summaryStatus === 'error' ? (
        <ErrorState message={"Security summary could not be loaded."} title={"Data currently unavailable"} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label={"Events 24h"} value={Number(securitySummary?.events24h || 0)} />
          <StatCard label={"Unique IPs 24h"} value={Number(securitySummary?.uniqueIps24h || 0)} accent />
          <StatCard label={"Auth Failures 24h"} value={Number(securitySummary?.authFailures24h || 0)} />
        </div>
      )}

      {eventsStatus === 'error' ? (
        <ErrorState message={"Security events could not be loaded."} title={"Data currently unavailable"} />
      ) : (
        <>
          {requestIdFilter && (
            <div className="flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/5 px-4 py-2.5">
              <span className="text-xs font-black uppercase tracking-widest text-text-muted">{"Filtered by request"}</span>
              <span className="font-mono text-xs text-accent break-all">{requestIdFilter}</span>
              <button
                onClick={clearRequestFilter}
                aria-label={"Clear request filter"}
                className="ml-auto min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-text-muted hover:text-accent transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          )}
          <DataTable
            data={filteredEvents}
            columns={columns}
            keyExtractor={(item) => item.id}
            mobileCard={mobileCard}
            emptyTitle={"No security events"}
            pageSize={25}
            minWidth="min-w-[720px]"
          />
        </>
      )}
    </div>
  );
};

export default SecurityTab;
