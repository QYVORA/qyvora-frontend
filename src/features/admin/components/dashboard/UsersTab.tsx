import React, { useState } from 'react';
import { Copy, Ban, Unlock, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { IconShield } from '@/shared/components/icons';
import type { AdminUser } from '../../types/admin.types';
import { isUserBlocked } from '../../types/admin.types';
import CpLogo from '@/shared/components/CpLogo';
import { Tooltip } from '@/shared/components/ui/Tooltip';
import { StatCard, DataTable } from '@/shared/components/dashboard';
import type { Column } from '@/shared/components/dashboard';

interface UsersTabProps {
  users: AdminUser[];
  overview: any;
  addToast: (msg: string, type: string) => void;
  patchUser: (id: string, payload: Record<string, unknown>, msg: string) => Promise<void>;
  handleUserBlockToggle: (target: AdminUser) => Promise<void>;
  handleDeleteUser: (target: AdminUser) => Promise<void>;
}

const UsersTab: React.FC<UsersTabProps> = ({
  users, overview, addToast, patchUser, handleUserBlockToggle, handleDeleteUser,
}) => {
  const { t } = useTranslation();
  const adminsCount = users.filter(u => u.role === 'admin').length;

  const columns: Column<AdminUser>[] = [
    {
      key: 'name',
      header: t('admin.users.user'),
      sortable: true,
      render: (item) => (
        <div>
          <div className="font-black text-base text-text-primary group-hover:text-accent transition-colors">
            {item.hackerHandle || item.name || item.email}
          </div>
          <div className="text-xs text-text-muted/60 font-mono mt-0.5">{item.email}</div>
        </div>
      ),
    },
    {
      key: 'role',
      header: t('admin.users.role'),
      render: (item) => (
        <span className="px-2.5 py-1 rounded-lg bg-accent-dim text-[9px] font-black uppercase tracking-widest text-accent">
          {item.role}
        </span>
      ),
    },
    {
      key: 'cpPoints',
      header: t('admin.users.points'),
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2 text-sm font-mono font-bold text-text-primary">
          <CpLogo className="w-4 h-4 opacity-70" />
          {Number(item.cpPoints || 0).toLocaleString()}
        </div>
      ),
    },
    {
      key: 'bootcampAccessRevoked',
      header: t('admin.users.bootcampAccess'),
      render: (item) => (
        <button
          onClick={() => void patchUser(item.id, { bootcampAccessRevoked: !item.bootcampAccessRevoked }, item.bootcampAccessRevoked ? t('admin.users.accessRestored') : t('admin.users.accessRevoked'))}
          className={`text-[9px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all ${
            item.bootcampAccessRevoked
              ? 'text-red-400 bg-red-500/10'
              : 'btn-primary'
          }`}
        >
          {item.bootcampAccessRevoked ? t('admin.users.revoked') : t('admin.users.allowed')}
        </button>
      ),
    },
    {
      key: 'recoveryToken',
      header: t('admin.users.recovery'),
      render: (item) => (
        item.recoveryToken ? (
          <div className="flex items-center gap-3 group/token">
            <div className="max-w-[120px] truncate font-mono text-[10px] text-accent/70 bg-bg-elevated px-3 py-1.5 rounded-lg shadow-sm">
              {item.recoveryToken}
            </div>
            <button
              onClick={() => { navigator.clipboard.writeText(item.recoveryToken || ''); addToast(t('admin.users.tokenCopied'), 'success'); }}
              className="p-2 rounded-lg hover:bg-bg-elevated text-text-muted hover:text-accent transition-all"
            >
              <Copy className="w-4 h-4" />
            </button>
            {item.recoveryTokenAcknowledgedAt && (
              <Tooltip content={t('admin.users.acknowledgedToken')}>
                <IconShield size={16} className="text-emerald-500" />
              </Tooltip>
            )}
          </div>
        ) : (
          <span className="text-[10px] font-black uppercase text-text-muted/40 tracking-widest">{t('common2.na')}</span>
        )
      ),
    },
    {
      key: 'status',
      header: t('admin.users.status'),
      render: (item) => (
        isUserBlocked(item) ? (
          <span className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-red-400 bg-red-400/10 px-3 py-1.5 rounded-lg">
            <Ban className="w-3.5 h-3.5" /> {t('badge.blocked')}
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-accent bg-accent/10 px-3 py-1.5 rounded-lg">
            <Unlock className="w-3.5 h-3.5" /> {t('badge.active')}
          </span>
        )
      ),
    },
    {
      key: 'actions',
      header: t('admin.users.actions'),
      className: 'text-right',
      headerClassName: 'text-right',
      render: (item) => (
        <div className="flex items-center justify-end gap-3">
          <Tooltip content={isUserBlocked(item) ? t('admin.users.unblockUser') : t('admin.users.blockUser')} side="left">
            <button
              onClick={() => void handleUserBlockToggle(item)}
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-bg-elevated text-text-muted hover:text-accent transition-all active:scale-90 shadow-sm"
            >
              {isUserBlocked(item) ? <Unlock className="w-4.5 h-4.5" /> : <Ban className="w-4.5 h-4.5" />}
            </button>
          </Tooltip>
          <Tooltip content={t('admin.users.permanentlyDelete')} side="left">
            <button
              onClick={() => void handleDeleteUser(item)}
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-red-500/5 text-red-400/60 hover:bg-red-500/10 hover:text-red-400 transition-all active:scale-90 shadow-sm"
            >
              <Trash2 className="w-4.5 h-4.5" />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  const searchFilter = (item: AdminUser, query: string) =>
    `${item.name} ${item.hackerHandle} ${item.email} ${item.role}`.toLowerCase().includes(query);

  const mobileCard = (item: AdminUser) => (
    <div className="bg-transparent space-y-4">
      <div>
        <div className="font-black text-lg text-text-primary">{item.hackerHandle || item.name || item.email}</div>
        <div className="text-xs text-text-muted/60 mt-0.5 break-all font-mono tracking-tight">{item.email}</div>
        <div className="flex flex-wrap items-center gap-3 mt-4">
          <span className="px-2.5 py-1 rounded-lg bg-accent-dim text-[9px] font-black uppercase tracking-widest text-accent">{item.role}</span>
          <span className="font-mono text-sm text-text-secondary inline-flex items-center gap-1.5 font-bold">
            <CpLogo className="w-4 h-4" /> {Number(item.cpPoints || 0).toLocaleString()}
          </span>
          {isUserBlocked(item) && (
              <span className="text-red-400 font-black text-[9px] uppercase tracking-widest bg-red-400/10 px-2.5 py-1 rounded-lg flex items-center gap-1">
              <Ban className="w-3 h-3" /> {t('badge.blocked')}
            </span>
          )}
        </div>
        {item.recoveryToken && (
          <div className="flex items-center gap-3 mt-4 p-3 bg-bg-elevated rounded-xl shadow-sm">
            <IconShield size={16} className="text-accent" />
            <span className="font-mono text-[10px] text-accent/70 truncate flex-1">{item.recoveryToken}</span>
            <button onClick={() => { navigator.clipboard.writeText(item.recoveryToken || ''); addToast(t('admin.users.tokenCopied'), 'success'); }} className="p-1.5 hover:text-accent transition-colors">
              <Copy className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          onClick={() => void patchUser(item.id, { bootcampAccessRevoked: !item.bootcampAccessRevoked }, item.bootcampAccessRevoked ? t('admin.users.accessRestored') : t('admin.users.accessRevoked'))}
          className={`py-3 transition-all ${item.bootcampAccessRevoked ? 'bg-red-500/10 text-red-400 rounded-xl text-[10px] font-black uppercase tracking-widest' : 'btn-primary'}`}
        >
          {item.bootcampAccessRevoked ? t('admin.users.revoked') : t('admin.users.allowed')}
        </button>
        <button
          onClick={() => void handleUserBlockToggle(item)}
          className="btn-secondary py-3 transition-all active:scale-95"
        >
          {isUserBlocked(item) ? t('admin.users.unblock') : t('admin.users.block')}
        </button>
        <button
          onClick={() => void handleDeleteUser(item)}
          className="col-span-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest bg-red-500/5 text-red-400/60 hover:bg-red-500/10 hover:text-red-400 transition-all active:scale-95"
        >
          {t('admin.users.deleteUser')}
        </button>
      </div>
      <div className="h-px w-full bg-border/20 mt-6" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={<IconShield size={20} className="text-text-muted" />} label={t('admin.overview.totalUsers')} value={Number((overview?.users as any)?.total || 0)} />
        <StatCard icon={<IconShield size={20} className="text-accent" />} label={t('admin.overview.active24h')} value={Number((overview?.users as any)?.active24h || 0)} accent />
        <StatCard icon={<IconShield size={20} className="text-text-muted" />} label={t('admin.users.admins')} value={adminsCount} />
      </div>

      <DataTable
        data={users}
        columns={columns}
        keyExtractor={(u) => u.id}
        searchable
        searchPlaceholder={t('admin.users.searchPlaceholder')}
        searchFilter={searchFilter}
        mobileCard={mobileCard}
        emptyTitle={t('admin.users.empty')}
      />
    </div>
  );
};

export default UsersTab;
