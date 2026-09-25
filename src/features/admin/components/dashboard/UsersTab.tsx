import React, { useState } from 'react';
import { Copy, Ban, Unlock, Trash2, Globe } from 'lucide-react';
import { IconShield } from '@/shared/components/icons';
import type { AdminUser } from '../../types/admin.types';
import { isUserBlocked } from '../../types/admin.types';
import type { SectionStatus } from '../../pages/AdminDashboardPage';
import CpLogo from '@/shared/components/CpLogo';
import { Tooltip } from '@/shared/components/ui/Tooltip';
import { StatCard, DataTable } from '@/shared/components/dashboard';
import type { Column } from '@/shared/components/dashboard';
import { ErrorState } from '@/shared/components/ui';

interface UsersTabProps {
  users: AdminUser[];
  overview: any;
  status?: SectionStatus;
  onRetry?: () => void;
  addToast: (msg: string, type: string) => void;
  patchUser: (id: string, payload: Record<string, unknown>, msg: string) => Promise<void>;
  handleUserBlockToggle: (target: AdminUser) => Promise<void>;
  handleDeleteUser: (target: AdminUser) => Promise<void>;
}

const UsersTab: React.FC<UsersTabProps> = ({
  users, overview, status = 'loaded', onRetry, addToast, patchUser, handleUserBlockToggle, handleDeleteUser,
}) => {
  const adminsCount = users.filter(u => u.role === 'admin').length;

  if (status === 'error') {
    return <ErrorState message={"User list could not be loaded."} title={"Data currently unavailable"} />;
  }

  const columns: Column<AdminUser>[] = [
    {
      key: 'name',
      header: "User",
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
      header: "Role",
      render: (item) => (
        <span className="px-2.5 py-1 rounded-lg bg-accent-dim text-xs font-black uppercase tracking-widest text-accent">
          {item.role}
        </span>
      ),
    },
    {
      key: 'lastLoginIp',
      header: "Last Login",
      sortable: true,
      render: (item) => (
        item.lastLoginAt ? (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-text-primary">
              <Globe className="w-3 h-3 text-accent/60" />
              {item.lastLoginIp || '-'}
            </div>
            <div className="text-xs text-text-muted/50 font-mono">
              {new Date(item.lastLoginAt).toLocaleString()}
            </div>
            {item.lastLoginUserAgent && (
              <Tooltip content={item.lastLoginUserAgent}>
                <div className="text-xs text-text-muted/40 font-mono max-w-[140px] truncate cursor-help">
                  {item.lastLoginUserAgent}
                </div>
              </Tooltip>
            )}
          </div>
        ) : (
          <span className="text-xs font-black uppercase text-text-muted/40 tracking-widest">{"Never"}</span>
        )
      ),
    },
    {
      key: 'cpPoints',
      header: "Points",
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
      header: "Bootcamp Access",
      render: (item) => (
        <button
          onClick={() => void patchUser(item.id, { bootcampAccessRevoked: !item.bootcampAccessRevoked }, item.bootcampAccessRevoked ? "Access restored" : "Access revoked")}
          className={`text-xs font-black uppercase tracking-widest px-4 py-2.5 rounded-xl transition-[background-color,color,border-color,transform] duration-[var(--dur-base)] ease-[var(--ease-smooth)] ${
            item.bootcampAccessRevoked
              ? 'text-danger bg-danger/10'
              : 'btn-primary'
          }`}
        >
          {item.bootcampAccessRevoked ? "Revoked" : "Allowed"}
        </button>
      ),
    },
    {
      key: 'recoveryToken',
      header: "Recovery",
      render: (item) => (
        item.recoveryToken ? (
          <div className="flex items-center gap-3 group/token">
            <div className="max-w-[120px] truncate font-mono text-xs text-accent/70 bg-surface-raised px-3 py-1.5 rounded-lg shadow-sm">
              {item.recoveryToken}
            </div>
            <button
              onClick={() => { navigator.clipboard.writeText(item.recoveryToken || ''); addToast("Token copied to clipboard", 'success'); }}
              className="p-2 rounded-lg hover:bg-surface-raised text-text-muted hover:text-accent transition-[background-color,color] duration-[var(--dur-fast)] ease-[var(--ease-smooth)]"
            >
              <Copy className="w-4 h-4" />
            </button>
            {item.recoveryTokenAcknowledgedAt && (
              <Tooltip content={"Token acknowledged"}>
                <IconShield size={16} className="text-accent" />
              </Tooltip>
            )}
          </div>
        ) : (
          <span className="text-xs font-black uppercase text-text-muted/40 tracking-widest">{"N/A"}</span>
        )
      ),
    },
    {
      key: 'status',
      header: "Status",
      render: (item) => (
        isUserBlocked(item) ? (
          <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-danger bg-danger/10 px-3 py-1.5 rounded-lg">
            <Ban className="w-3.5 h-3.5" /> {"Blocked"}
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-accent bg-accent/10 px-3 py-1.5 rounded-lg">
            <Unlock className="w-3.5 h-3.5" /> {"Active"}
          </span>
        )
      ),
    },
    {
      key: 'actions',
      header: "Actions",
      className: 'text-right',
      headerClassName: 'text-right',
      render: (item) => (
        <div className="flex items-center justify-end gap-3">
          <Tooltip content={isUserBlocked(item) ? "Unblock User" : "Block User"} side="left">
            <button
              onClick={() => void handleUserBlockToggle(item)}
              className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-surface-raised text-text-muted hover:text-accent transition-[color,transform] duration-[var(--dur-fast)] ease-[var(--ease-smooth)] active:scale-90 shadow-sm"
            >
              {isUserBlocked(item) ? <Unlock className="w-4.5 h-4.5" /> : <Ban className="w-4.5 h-4.5" />}
            </button>
          </Tooltip>
          <Tooltip content={"Permanently delete user"} side="left">
            <button
              onClick={() => void handleDeleteUser(item)}
              className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-danger/5 text-danger/60 hover:bg-danger/10 hover:text-danger transition-[background-color,color,transform] duration-[var(--dur-fast)] ease-[var(--ease-smooth)] active:scale-90 shadow-sm"
            >
              <Trash2 className="w-4.5 h-4.5" />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  const searchFilter = (item: AdminUser, query: string) =>
    `${item.name} ${item.hackerHandle} ${item.email} ${item.role} ${item.lastLoginIp || ''}`.toLowerCase().includes(query);

  const mobileCard = (item: AdminUser) => (
    <div className="bg-transparent space-y-4">
      <div>
        <div className="font-black text-lg text-text-primary">{item.hackerHandle || item.name || item.email}</div>
        <div className="text-xs text-text-muted/60 mt-0.5 break-all font-mono tracking-tight">{item.email}</div>
        <div className="flex flex-wrap items-center gap-3 mt-4">
          <span className="px-2.5 py-1 rounded-lg bg-accent-dim text-xs font-black uppercase tracking-widest text-accent">{item.role}</span>
          <span className="font-mono text-sm text-text-secondary inline-flex items-center gap-1.5 font-bold">
            <CpLogo className="w-4 h-4" /> {Number(item.cpPoints || 0).toLocaleString()}
          </span>
          {isUserBlocked(item) && (
              <span className="text-danger font-black text-xs uppercase tracking-widest bg-danger/10 px-2.5 py-1 rounded-lg flex items-center gap-1">
              <Ban className="w-3 h-3" /> {"Blocked"}
            </span>
          )}
        </div>
        {item.lastLoginAt ? (
          <div className="flex items-center gap-2 mt-3 text-xs font-mono text-text-muted/60">
            <Globe className="w-3 h-3 text-accent/60" />
            <span className="font-bold text-text-primary">{item.lastLoginIp || '-'}</span>
            <span>·</span>
            <span>{new Date(item.lastLoginAt).toLocaleString()}</span>
          </div>
        ) : (
          <div className="mt-3 text-xs font-black uppercase text-text-muted/40 tracking-widest">{"Never"}</div>
        )}
        {item.recoveryToken && (
          <div className="flex items-center gap-3 mt-4 p-3 bg-surface-raised rounded-xl shadow-sm">
            <IconShield size={16} className="text-accent" />
            <span className="font-mono text-xs text-accent/70 truncate flex-1">{item.recoveryToken}</span>
            <button onClick={() => { navigator.clipboard.writeText(item.recoveryToken || ''); addToast("Token copied to clipboard", 'success'); }} className="p-1.5 hover:text-accent transition-colors">
              <Copy className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          onClick={() => void patchUser(item.id, { bootcampAccessRevoked: !item.bootcampAccessRevoked }, item.bootcampAccessRevoked ? "Access restored" : "Access revoked")}
          className={`py-3 transition-[background-color,color,border-color,transform] duration-[var(--dur-base)] ease-[var(--ease-smooth)] ${item.bootcampAccessRevoked ? 'bg-danger/10 text-danger rounded-xl text-xs font-black uppercase tracking-widest' : 'btn-primary'}`}
        >
          {item.bootcampAccessRevoked ? "Revoked" : "Allowed"}
        </button>
        <button
          onClick={() => void handleUserBlockToggle(item)}
          className="btn-secondary py-3 transition-[background-color,border-color,color,transform] duration-[var(--dur-base)] ease-[var(--ease-smooth)] active:scale-95"
        >
          {isUserBlocked(item) ? "Unblock" : "Block"}
        </button>
        <button
          onClick={() => void handleDeleteUser(item)}
          className="col-span-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest bg-danger/5 text-danger/60 hover:bg-danger/10 hover:text-danger transition-[background-color,color,transform] duration-[var(--dur-fast)] ease-[var(--ease-smooth)] active:scale-95"
        >
          {"Delete User"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={<IconShield size={20} className="text-text-muted" />} label={"Total Users"} value={Number((overview?.users as any)?.total || 0)} />
        <StatCard icon={<IconShield size={20} className="text-accent" />} label={"Active 24h"} value={Number((overview?.users as any)?.active24h || 0)} accent />
        <StatCard icon={<IconShield size={20} className="text-text-muted" />} label={"Admins"} value={adminsCount} />
      </div>

      <DataTable
        data={users}
        columns={columns}
        keyExtractor={(u) => u.id}
        searchable
        searchPlaceholder={"Search by name, handle, email…"}
        searchFilter={searchFilter}
        mobileCard={mobileCard}
        emptyTitle={"No users found"}
      />
    </div>
  );
};

export default UsersTab;
