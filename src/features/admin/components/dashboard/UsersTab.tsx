import React, { useMemo, useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Shield, Copy, Ban, Unlock, Trash2 } from 'lucide-react';
import { AdminUser, isUserBlocked } from '../../types/admin.types';
import CpLogo from '../../../../shared/components/CpLogo';
import { Tooltip } from '../../../../shared/components/ui/Tooltip';

interface UsersTabProps {
  users: AdminUser[];
  overview: any;
  addToast: (msg: string, type: string) => void;
  patchUser: (id: string, payload: Record<string, unknown>, msg: string) => Promise<void>;
  handleUserBlockToggle: (target: AdminUser) => Promise<void>;
  handleDeleteUser: (target: AdminUser) => Promise<void>;
}

const StatCard = ({ label, value }: { label: string; value: number | string }) => (
  <div className="rounded-2xl border-2 border-border bg-bg-card p-5 md:p-6">
    <div className="mb-2 text-xs font-bold uppercase tracking-widest text-text-muted">{label}</div>
    <div className="text-3xl font-black tabular-nums text-text-primary md:text-4xl">{value}</div>
  </div>
);

const UsersTab: React.FC<UsersTabProps> = ({
  users,
  overview,
  addToast,
  patchUser,
  handleUserBlockToggle,
  handleDeleteUser,
}) => {
  const [userQuery, setUserQuery] = useState('');
  const [userPage, setUserPage] = useState(1);
  const [userPageSize, setUserPageSize] = useState(25);

  const filteredUsers = useMemo(() => {
    const q = userQuery.trim().toLowerCase();
    if (!q) return users;
    return users.filter(u =>
      `${u.name} ${u.hackerHandle} ${u.email} ${u.role}`.toLowerCase().includes(q)
    );
  }, [users, userQuery]);

  const totalUserPages = useMemo(
    () => Math.max(1, Math.ceil(filteredUsers.length / Math.max(1, userPageSize))),
    [filteredUsers.length, userPageSize]
  );

  const paginatedUsers = useMemo(() => {
    const p = Math.min(Math.max(1, userPage), totalUserPages);
    return filteredUsers.slice((p - 1) * userPageSize, p * userPageSize);
  }, [filteredUsers, userPage, userPageSize, totalUserPages]);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Users" value={Number((overview?.users as any)?.total || 0)} />
        <StatCard label="Active 24h" value={Number((overview?.users as any)?.active24h || 0)} />
        <StatCard label="Admins" value={users.filter(u => u.role === 'admin').length} />
      </div>

      {/* Search + pagination controls */}
      <div className="bg-bg-card border-2 border-border rounded-2xl p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
          <input
            type="text"
            value={userQuery}
            onChange={e => { setUserQuery(e.target.value); setUserPage(1); }}
            placeholder="Search by name, handle, email…"
            className="w-full bg-bg border-2 border-border rounded-xl pl-12 pr-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
          />
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <span className="text-text-muted font-bold uppercase tracking-widest">{filteredUsers.length} users discovered</span>
          <div className="flex items-center gap-3 ml-auto">
            <select
              value={userPageSize}
              onChange={e => { setUserPageSize(Number(e.target.value)); setUserPage(1); }}
              className="bg-bg border-2 border-border rounded-xl px-3 py-2 text-xs font-bold text-text-primary min-h-[40px] focus:border-accent outline-none"
            >
              {[10,25,50,100].map(n => <option key={n} value={n}>{n} / page</option>)}
            </select>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setUserPage(p => Math.max(1, p - 1))}
                disabled={userPage <= 1}
                className="w-10 h-10 flex items-center justify-center rounded-xl border-2 border-border text-text-muted disabled:opacity-30 hover:border-accent/30 hover:text-accent transition-all active:scale-90"
              ><ChevronLeft className="w-5 h-5" /></button>
              <span className="px-3 text-text-muted font-mono font-bold text-sm">{Math.min(userPage, totalUserPages)} / {totalUserPages}</span>
              <button
                onClick={() => setUserPage(p => Math.min(totalUserPages, p + 1))}
                disabled={userPage >= totalUserPages}
                className="w-10 h-10 flex items-center justify-center rounded-xl border-2 border-border text-text-muted disabled:opacity-30 hover:border-accent/30 hover:text-accent transition-all active:scale-90"
              ><ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-4">
        {paginatedUsers.map(item => (
          <div key={item.id} className="bg-bg-card border-2 border-border rounded-2xl p-5 space-y-4">
            <div>
              <div className="font-black text-lg text-text-primary">{item.hackerHandle || item.name || item.email}</div>
              <div className="text-xs text-text-muted mt-0.5 break-all font-mono">{item.email}</div>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <span className="px-2 py-0.5 rounded bg-accent-dim text-[10px] font-black uppercase tracking-widest text-accent border border-accent/20">{item.role}</span>
                <span className="font-mono text-sm text-text-secondary inline-flex items-center gap-1.5 font-bold">
                  <CpLogo className="w-4 h-4" /> {Number(item.cpPoints || 0).toLocaleString()}
                </span>
                {isUserBlocked(item) && <span className="text-red-400 font-black text-[10px] uppercase tracking-widest bg-red-400/10 px-2.5 py-0.5 rounded border border-red-400/20">BLOCKED</span>}
              </div>
              {item.recoveryToken && (
                <div className="flex items-center gap-2 mt-3 p-2 bg-bg rounded-lg border border-border">
                  <Shield className="w-3 h-3 text-accent" />
                  <span className="font-mono text-[10px] text-accent/70 truncate flex-1">{item.recoveryToken}</span>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(item.recoveryToken || '');
                      addToast('Token copied', 'success');
                    }}
                    className="p-1 hover:text-white"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => void patchUser(item.id, { bootcampAccessRevoked: !item.bootcampAccessRevoked }, item.bootcampAccessRevoked ? 'Access restored' : 'Access revoked')}
                className={`btn-primary py-2.5 text-xs font-black uppercase tracking-widest ${item.bootcampAccessRevoked ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-accent/10 border-accent/30 text-accent'}`}
              >
                {item.bootcampAccessRevoked ? 'Revoked' : 'Allowed'}
              </button>
              <button
                onClick={() => void handleUserBlockToggle(item)}
                className="btn-primary py-2.5 text-xs font-black uppercase tracking-widest border-border text-text-muted hover:border-accent/30 hover:text-accent bg-transparent"
              >
                {isUserBlocked(item) ? <><Unlock className="w-3.5 h-3.5" />Unblock</> : <><Ban className="w-3.5 h-3.5" />Block</>}
              </button>
              <button
                onClick={() => void handleDeleteUser(item)}
                className="col-span-2 btn-primary py-2.5 text-xs font-black uppercase tracking-widest border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete User
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-bg-card border-2 border-border rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[860px]">
            <thead className="border-b-2 border-border bg-bg/50 backdrop-blur-sm">
              <tr>
                {['User','Role','Points','Bootcamp Access','Recovery','Status','Actions'].map(h => (
                  <th key={h} className={`px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {paginatedUsers.map(item => (
                <tr key={item.id} className="hover:bg-accent-dim/10 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="font-black text-base text-text-primary group-hover:text-accent transition-colors">{item.hackerHandle || item.name || item.email}</div>
                    <div className="text-xs text-text-muted font-mono mt-0.5">{item.email}</div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-2 py-1 rounded bg-accent-dim/50 text-[10px] font-black uppercase tracking-widest text-accent border border-accent/20">
                      {item.role}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm font-mono font-bold text-text-primary">
                    <div className="flex items-center gap-2">
                      <CpLogo className="w-4 h-4 opacity-70" />
                      {Number(item.cpPoints || 0).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <button
                      onClick={() => void patchUser(item.id, { bootcampAccessRevoked: !item.bootcampAccessRevoked }, item.bootcampAccessRevoked ? 'Access restored' : 'Access revoked')}
                      className={`text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-xl border-2 transition-all min-h-[36px] ${item.bootcampAccessRevoked ? 'text-red-400 border-red-500/20 bg-red-400/5 hover:border-red-500/40' : 'text-accent border-accent/20 bg-accent/5 hover:border-accent/40'}`}
                    >
                      {item.bootcampAccessRevoked ? 'Revoked' : 'Allowed'}
                    </button>
                  </td>
                  <td className="px-6 py-5">
                    {item.recoveryToken ? (
                      <div className="flex items-center gap-2 group/token">
                        <div className="max-w-[120px] truncate font-mono text-[10px] text-accent/70 bg-bg px-2 py-1 rounded border border-border">
                          {item.recoveryToken}
                        </div>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(item.recoveryToken || '');
                            addToast('Token copied', 'success');
                          }}
                          className="p-1.5 rounded-lg hover:bg-bg border border-transparent hover:border-border text-text-muted hover:text-accent transition-all"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        {item.recoveryTokenAcknowledgedAt && (
                          <Tooltip content="User has acknowledged token">
                            <Shield className="w-3.5 h-3.5 text-emerald-500" />
                          </Tooltip>
                        )}
                      </div>
                    ) : (
                      <span className="text-[10px] font-black uppercase text-text-muted/50 tracking-widest">N/A (Admin)</span>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    {isUserBlocked(item) ? (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-red-400 bg-red-400/10 px-2.5 py-1 rounded-lg border border-red-400/20">
                        <Ban className="w-3 h-3" /> Blocked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-accent bg-accent/10 px-2.5 py-1 rounded-lg border border-accent/20">
                        <Unlock className="w-3 h-3" /> Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-2">
                      <Tooltip content={isUserBlocked(item) ? 'Unblock user' : 'Block user'} side="left">
                      <button
                        onClick={() => void handleUserBlockToggle(item)}
                        className="inline-flex items-center justify-center w-10 h-10 rounded-xl border-2 border-border text-text-muted hover:border-accent/40 hover:text-accent transition-all active:scale-90 bg-bg-card"
                      >
                        {isUserBlocked(item) ? <Unlock className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                      </button>
                      </Tooltip>
                      <Tooltip content="Permanently delete user" side="left">
                      <button
                        onClick={() => void handleDeleteUser(item)}
                        className="inline-flex items-center justify-center w-10 h-10 rounded-xl border-2 border-red-500/20 text-red-400 hover:border-red-500/40 hover:bg-red-500/10 transition-all active:scale-90 bg-bg-card"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersTab;
