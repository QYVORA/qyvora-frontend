import React from 'react';
import { useTranslation } from 'react-i18next';
import { SecurityEventItem } from '../../types/admin.types';
import { StatCard, DataTable } from '@/shared/components/dashboard';
import type { Column } from '@/shared/components/dashboard';

interface SecurityTabProps { securitySummary: any; securityEvents: SecurityEventItem[]; }

const SecurityTab: React.FC<SecurityTabProps> = ({ securitySummary, securityEvents }) => {
  const { t } = useTranslation();
  const columns: Column<SecurityEventItem>[] = [
    { key: 'createdAt', header: 'Time', render: (item) => <span className="text-text-muted/60 font-mono whitespace-nowrap text-xs">{item.createdAt ? new Date(item.createdAt).toLocaleString() : '—'}</span> },
    { key: 'eventType', header: 'Type', render: (item) => <span className="px-2.5 py-1 rounded-lg bg-accent-dim text-[9px] font-black uppercase tracking-widest text-accent whitespace-nowrap border border-accent/10">{item.eventType}</span> },
    { key: 'action', header: 'Action', render: (item) => <span className="font-black uppercase tracking-tight text-text-primary text-sm whitespace-nowrap">{item.action}</span> },
    { key: 'path', header: 'Path', render: (item) => <span className="font-mono text-text-muted/70 max-w-[240px] truncate block text-xs">{item.path || '—'}</span> },
    { key: 'statusCode', header: 'Code', render: (item) => <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black font-mono border ${Number(item.statusCode) >= 400 ? 'bg-red-400/10 text-red-400 border-red-400/20' : 'bg-accent/10 text-accent border-accent/20'}`}>{item.statusCode}</span> },
    { key: 'ipAddress', header: 'IP', render: (item) => <span className="font-mono text-text-secondary/80 whitespace-nowrap text-xs">{item.ipAddress || '—'}</span> },
  ];

  const mobileCard = (item: SecurityEventItem) => (
    <div className="bg-bg-card border border-border/40 rounded-2xl p-5 space-y-3 text-xs">
      <div className="flex justify-between items-center">
        <span className="font-black text-accent uppercase tracking-[0.2em] text-[10px]">{item.eventType}</span>
        <span className="text-[9px] text-text-muted/60 font-mono">{item.createdAt ? new Date(item.createdAt).toLocaleString() : '—'}</span>
      </div>
      <div className="font-black text-text-primary uppercase tracking-tighter text-sm">{item.action}</div>
      <div className="bg-bg px-4 py-3 rounded-xl font-mono text-[10px] text-accent/70 border border-border/40 break-all overflow-x-auto whitespace-nowrap shadow-sm">
        {item.path || '—'}
      </div>
      <div className="flex justify-between items-center pt-2 text-[10px] font-black text-text-muted/40 uppercase tracking-widest">
        <span className={Number(item.statusCode) >= 400 ? 'text-red-400' : 'text-accent'}>HTTP {item.statusCode}</span>
        <span className="font-mono">{item.ipAddress || '—'}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label={t('admin.security.events24h')} value={Number(securitySummary?.events24h || 0)} />
        <StatCard label={t('admin.security.uniqueIps24h')} value={Number(securitySummary?.uniqueIps24h || 0)} accent />
        <StatCard label={t('admin.security.authFailures24h')} value={Number(securitySummary?.authFailures24h || 0)} />
      </div>

      <DataTable
        data={securityEvents}
        columns={columns}
        keyExtractor={(item) => item.id}
        mobileCard={mobileCard}
        emptyTitle={t('admin.security.empty')}
        pageSize={25}
        minWidth="min-w-[860px]"
      />
    </div>
  );
};

export default SecurityTab;
