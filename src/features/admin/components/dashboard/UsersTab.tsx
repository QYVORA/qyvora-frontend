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
  <div className="rounded-2xl border border-border/40 bg-bg-card p-5 md:p-6">
    <div className="mb-2 text-xs font-bold uppercase tracking-widest text-text-muted">{label}</div>
    <div className="text-3xl font-black tabular-nums text-text-primary md:text-4xl">{value}</div>
  </div>
);

const UsersTab: React.FC<UsersTabProps> = ({
  users, overview, addToast, patchUser, handleUserBlockToggle, handleDeleteUser,
}) => {
  const [userQuery, setUserQuery] = useState('');
  const [userPage, setUserPage] = useState(1);
  const [userPageSize, setUserPageSize] = useState(25);

  const filteredUsers = useMemo(() => {
    const q = userQuery.trim().toLowerCase();
    if (!q) return users;
    return users.filter(u => `${u.name} ${u.hackerHandle} ${u.email} ${u.role}`.toLowerCase().includes(q));
  }, [users, userQuery]);

  const totalUserPages = useMemo(() => Math.max(1, Math.ceil(filteredUsers.length / Math.max(1, userPageSize))), [filteredUsers.length, userPageSize]);
  const paginatedUsers = useMemo(() => {
    const p = Math.min(Math.max(1, userPage), totalUserPages);
    return filteredUsers.slice((p - 1) * userPageSize, p * userPageSize);
  }, [filteredUsers, userPage, userPageSize, totalUserPages]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Users" value={Number((overview?.users as any)?.total || 0)} />
        <StatCard label="Active 24h" value={Number((overview?.users as any)?.active24h || 0)} />
        <StatCard label="Admins" value={users.filter(u => u.role === 'admin').length} />
      </div>

      <div className="bg-bg-card border border-border/40 rounded-2xl p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
          <input
            type="text" value={userQuery} onChange={e => { setUserQuery(e.target.value); setUserPage(1); }}
            placeholder="Search by name, handle, email…"
            className="w-full bg-bg border border-border/60 rounded-xl pl-12 pr-4 py-3.5 text-sm text-text-primary focus:outline-none focus:border-accent transition-all shadow-sm"
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 text-[10px] font-black uppercase tracking-widest text-text-muted/60">
          <span>{filteredUsers.length} users discovered</span>
          <div className="flex items-center gap-4">
            <select
              value={userPageSize} onChange={e => { setUserPageSize(Number(e.target.value)); setUserPage(1); }}
              className="bg-bg-elevated rounded-lg px-3 py-2 text-[10px] font-black text-text-primary outline-none cursor-pointer"
            >
              {[10,25,50,100].map(n => <option key={n} value={n}>{n} / page</option>)}
            </select>
            <div className="flex items-center gap-2">
              <button onClick={() => setUserPage(p => Math.max(1, p - 1))} disabled={userPage <= 1} className="w-9 h-9 flex items-center justify-center rounded-lg bg-bg-elevated text-text-muted disabled:opacity-30 hover:text-accent transition-all active:scale-90 shadow-sm"><ChevronLeft className="w-5 h-5" /></button>
              <span className="px-2 font-mono font-bold text-xs">{Math.min(userPage, totalUserPages)} / {totalUserPages}</span>
              <button onClick={() => setUserPage(p => Math.min(totalUserPages, p + 1))} disabled={userPage >= totalUserPages} className="w-9 h-9 flex items-center justify-center rounded-lg bg-bg-elevated text-text-muted disabled:opacity-30 hover:text-accent transition-all active:scale-90 shadow-sm"><ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden space-y-6">
        {paginatedUsers.map(item => (
          <div key={item.id} className="bg-transparent space-y-4">
            <div>
              <div className="font-black text-lg text-text-primary">{item.hackerHandle || item.name || item.email}</div>
              <div className="text-xs text-text-muted/60 mt-0.5 break-all font-mono tracking-tight">{item.email}</div>
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <span className="px-2.5 py-1 rounded-lg bg-accent-dim text-[9px] font-black uppercase tracking-widest text-accent">{item.role}</span>
                <span className="font-mono text-sm text-text-secondary inline-flex items-center gap-1.5 font-bold"><CpLogo className="w-4 h-4" /> {Number(item.cpPoints || 0).toLocaleString()}</span>
                {isUserBlocked(item) && <span className="text-red-400 font-black text-[9px] uppercase tracking-widest bg-red-400/10 px-2.5 py-1 rounded-lg">BLOCKED</span>}
              </div>
              {item.recoveryToken && (
                <div className="flex items-center gap-3 mt-4 p-3 bg-bg-elevated rounded-xl shadow-sm">
                  <Shield className="w-4 h-4 text-accent" /><span className="font-mono text-[10px] text-accent/70 truncate flex-1">{item.recoveryToken}</span>
                  <button onClick={() => { navigator.clipboard.writeText(item.recoveryToken || ''); addToast('Token copied', 'success'); }} className="p-1.5 hover:text-accent transition-colors"><Copy className="w-4 h-4" /></button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button onClick={() => void patchUser(item.id, { bootcampAccessRevoked: !item.bootcampAccessRevoked }, item.bootcampAccessRevoked ? 'Access restored' : 'Access revoked')} className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${item.bootcampAccessRevoked ? 'bg-red-500/10 text-red-400' : 'bg-accent/10 text-accent'}`}>{item.bootcampAccessRevoked ? 'Revoked' : 'Allowed'}</button>
              <button onClick={() => void handleUserBlockToggle(item)} className="py-3 rounded-xl text-[10px] font-black uppercase tracking-widest bg-bg-elevated text-text-muted hover:text-accent transition-all active:scale-95">{isUserBlocked(item) ? 'Unblock' : 'Block'}</button>
              <button onClick={() => void handleDeleteUser(item)} className="col-span-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest bg-red-500/5 text-red-400/60 hover:bg-red-500/10 hover:text-red-400 transition-all active:scale-95">Delete User</button>
            </div>
            <div className="h-px w-full bg-border/20 mt-6" />
          </div>
        ))}
      </div>

      <div className="hidden md:block bg-transparent overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[860px]">
            <thead className="bg-bg-elevated/50 backdrop-blur-sm">
              <tr>
                {['User','Role','Points','Bootcamp Access','Recovery','Status','Actions'].map(h => (
                  <th key={h} className={`px-6 py-5 text-[10px] font-black uppercase tracking-[0.25em] text-text-muted/60 ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {paginatedUsers.map(item => (
                <tr key={item.id} className="hover:bg-accent-dim/5 transition-colors group">
                  <td className="px-6 py-6"><div className="font-black text-base text-text-primary group-hover:text-accent transition-colors">{item.hackerHandle || item.name || item.email}</div><div className="text-xs text-text-muted/60 font-mono mt-0.5">{item.email}</div></td>
                  <td className="px-6 py-6"><span className="px-2.5 py-1 rounded-lg bg-accent-dim text-[9px] font-black uppercase tracking-widest text-accent">{item.role}</span></td>
                  <td className="px-6 py-6 text-sm font-mono font-bold text-text-primary"><div className="flex items-center gap-2"><CpLogo className="w-4 h-4 opacity-70" />{Number(item.cpPoints || 0).toLocaleString()}</div></td>
                  <td className="px-6 py-6"><button onClick={() => void patchUser(item.id, { bootcampAccessRevoked: !item.bootcampAccessRevoked }, item.bootcampAccessRevoked ? 'Access restored' : 'Access revoked')} className={`text-[9px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all ${item.bootcampAccessRevoked ? 'text-red-400 bg-red-500/10' : 'text-accent bg-accent/10 hover:bg-accent/20'}`}>{item.bootcampAccessRevoked ? 'Revoked' : 'Allowed'}</button></td>
                  <td className="px-6 py-6">
                    {item.recoveryToken ? (
                      <div className="flex items-center gap-3 group/token">
                        <div className="max-w-[120px] truncate font-mono text-[10px] text-accent/70 bg-bg-elevated px-3 py-1.5 rounded-lg shadow-sm">{item.recoveryToken}</div>
                        <button onClick={() => { navigator.clipboard.writeText(item.recoveryToken || ''); addToast('Token copied', 'success'); }} className="p-2 rounded-lg hover:bg-bg-elevated text-text-muted hover:text-accent transition-all"><Copy className="w-4 h-4" /></button>
                        {item.recoveryTokenAcknowledgedAt && <Tooltip content="User has acknowledged token"><Shield className="w-4 h-4 text-emerald-500" /></Tooltip>}
                      </div>
                    ) : <span className="text-[10px] font-black uppercase text-text-muted/40 tracking-widest">N/A</span>}
                  </td>
                  <td className="px-6 py-6">{isUserBlocked(item) ? <span className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-red-400 bg-red-400/10 px-3 py-1.5 rounded-lg"><Ban className="w-3.5 h-3.5" /> Blocked</span> : <span className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-accent bg-accent/10 px-3 py-1.5 rounded-lg"><Unlock className="w-3.5 h-3.5" /> Active</span>}</td>
                  <td className="px-6 py-6">
                    <div className="flex items-center justify-end gap-3">
                      <Tooltip content={isUserBlocked(item) ? 'Unblock user' : 'Block user'} side="left"><button onClick={() => void handleUserBlockToggle(item)} className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-bg-elevated text-text-muted hover:text-accent transition-all active:scale-90 shadow-sm">{isUserBlocked(item) ? <Unlock className="w-4.5 h-4.5" /> : <Ban className="w-4.5 h-4.5" />}</button></Tooltip>
                      <Tooltip content="Permanently delete user" side="left"><button onClick={() => void handleDeleteUser(item)} className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-red-500/5 text-red-400/60 hover:bg-red-500/10 hover:text-red-400 transition-all active:scale-90 shadow-sm"><Trash2 className="w-4.5 h-4.5" /></button></Tooltip>
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
