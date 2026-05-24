import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Ban, Unlock, Search,
  RefreshCw, Trash2, ChevronLeft, ChevronRight, Users, Mail,
} from 'lucide-react';
import { motion } from 'motion/react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import ChainExplorer from '../components/ChainExplorer';
import CpAnalytics from '../components/CpAnalytics';
import BootcampAccessPanel from '../components/BootcampAccessPanel';
import AssignmentManager from '../components/AssignmentManager';
import { useAuth } from '../../../core/contexts/AuthContext';
import { useToast } from '../../../core/contexts/ToastContext';
import CpLogo from '../../../shared/components/CpLogo';
import api from '../../../core/services/api';
import { resolveImg } from '../../../shared/utils/resolveImg';
import { Tooltip } from '../../../shared/components/ui/Tooltip';
import { ConfirmDialog } from '../../../shared/components/ui/Dialog';
import {
  type AdminTab, type AdminUser, type Bootcamp, type CPProduct,
  type ContactMessage, type SecurityEventItem,
  isUserBlocked, INPUT_CLS as inp, BTN_CLS as btn,
} from '../types/admin.types';

// ── Skeleton ──────────────────────────────────────────────────────────────────
const Skeleton = () => (
  <div className="space-y-3 p-1">
    {[0,1,2,3,4].map(i => (
      <div key={i} className="h-14 rounded-xl bg-bg-card border border-border animate-pulse" style={{ opacity: 1 - i * 0.15 }} />
    ))}
  </div>
);

// ── Stat card ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value }: { label: string; value: number | string }) => (
  <div className="rounded-2xl border-2 border-border bg-bg-card p-5 md:p-6">
    <div className="mb-2 text-xs font-bold uppercase tracking-widest text-text-muted">{label}</div>
    <div className="text-3xl font-black tabular-nums text-text-primary md:text-4xl">{value}</div>
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────
const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Tab is driven by ?tab= URL param so topbar links work
  const activeTab = (new URLSearchParams(location.search).get('tab') as AdminTab) || 'users';
  const setActiveTab = (tab: AdminTab) => navigate(`/mr-robot/dashboard?tab=${tab}`, { replace: true });

  const [loading, setLoading] = useState(true);

  const [overview, setOverview] = useState<Record<string, unknown> | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [userQuery, setUserQuery] = useState('');
  const [userPage, setUserPage] = useState(1);
  const [userPageSize, setUserPageSize] = useState(25);

  const [contentVersion, setContentVersion] = useState(1);
  const [bootcamps, setBootcamps] = useState<Bootcamp[]>([]);
  const [selectedBootcampId, setSelectedBootcampId] = useState<string>('');
  const [products, setProducts] = useState<CPProduct[]>([]);
  const [productForm, setProductForm] = useState({
    id: '', title: '', description: '', cpPrice: 0, type: 'book',
    sortOrder: 0, isActive: true, isFree: false,
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [productFile, setProductFile] = useState<File | null>(null);
  const productFormRef = React.useRef<HTMLDivElement>(null);

  const [securitySummary, setSecuritySummary] = useState<Record<string, unknown> | null>(null);
  const [securityEvents, setSecurityEvents] = useState<SecurityEventItem[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [confirmDeleteUser, setConfirmDeleteUser] = useState<AdminUser | null>(null);

  // ── Derived ──────────────────────────────────────────────────────────────────
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

  // ── Data loading ─────────────────────────────────────────────────────────────
  const loadAll = async () => {
    setLoading(true);
    try {
      const [ovRes, usersRes, contentRes, productsRes, summaryRes, eventsRes, contactsRes, appsRes] =
        await Promise.all([
          api.get('/admin/overview').catch(() => null),
          api.get('/admin/users').catch(() => null),
          api.get('/admin/content').catch(() => null),
          api.get('/admin/cp-products').catch(() => null),
          api.get('/admin/security/summary').catch(() => null),
          api.get('/admin/security/events?limit=50').catch(() => null),
          api.get('/admin/contact-messages?limit=50').catch(() => null),
          api.get('/admin/bootcamp-applications').catch(() => null),
        ]);

      setOverview((ovRes?.data as Record<string, unknown>) || null);

      const userItems = Array.isArray(usersRes?.data) ? (usersRes.data as AdminUser[]) : [];
      setUsers(userItems);

      const cd = (contentRes?.data as any) || {};
      setContentVersion(Number(cd.version || 1));
      const cbs: Bootcamp[] = Array.isArray(cd.learn?.bootcamps) ? cd.learn.bootcamps : [];
      setBootcamps(cbs);
      if (cbs[0]?.id) setSelectedBootcampId(prev => prev || String(cbs[0].id));

      setProducts(Array.isArray(productsRes?.data?.items) ? productsRes.data.items : []);
      setSecuritySummary((summaryRes?.data as Record<string, unknown>) || null);
      setSecurityEvents(Array.isArray(eventsRes?.data?.items) ? eventsRes.data.items : []);
      setContactMessages(Array.isArray(contactsRes?.data?.items) ? contactsRes.data.items : []);
      setApplications(Array.isArray(appsRes?.data?.items) ? appsRes.data.items : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadAll(); }, []);
  useEffect(() => { setUserPage(1); }, [userQuery, users.length, userPageSize]);

  // ── Actions ───────────────────────────────────────────────────────────────────

  const patchUser = async (id: string, payload: Record<string, unknown>, msg: string) => {
    try {
      await api.patch(`/admin/users/${encodeURIComponent(id)}`, payload);
      addToast(msg, 'success');
      await loadAll();
    } catch (e: any) { addToast(e?.response?.data?.error || 'Update failed', 'error'); }
  };

  const handleUserBlockToggle = async (target: AdminUser) => {
    try {
      await api.patch(`/admin/users/${encodeURIComponent(target.id)}/block`, { blocked: !isUserBlocked(target) });
      addToast(isUserBlocked(target) ? 'User unblocked' : 'User blocked', 'success');
      await loadAll();
    } catch (e: any) { addToast(e?.response?.data?.error || 'Block action failed', 'error'); }
  };

  const handleDeleteUser = async (target: AdminUser) => {
    setConfirmDeleteUser(target);
  };

  const handleDeleteUserConfirmed = async (target: AdminUser) => {
    try {
      await api.delete(`/admin/users/${encodeURIComponent(target.id)}`);
      addToast('User deleted', 'success');
      await loadAll();
    } catch (e: any) { addToast(e?.response?.data?.error || 'Delete failed', 'error'); }
  };

  const uploadCoverFile = async (): Promise<string> => {
    if (!coverFile) return '';
    const fd = new FormData(); fd.append('file', coverFile);
    const res = await api.post('/admin/uploads/cp-product-images', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    return String(res.data?.relativeUrl || res.data?.url || '');
  };

  const uploadProductFile = async () => {
    if (!productFile) return null;
    const fd = new FormData(); fd.append('file', productFile);
    const res = await api.post('/admin/uploads/cp-products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    return { fileId: String(res.data?.fileId || ''), fileName: String(res.data?.originalName || ''), fileSize: Number(res.data?.size || 0), fileMime: String(res.data?.mime || '') };
  };

  const resetProductForm = () => {
    setProductForm({ id: '', title: '', description: '', cpPrice: 0, type: 'book', sortOrder: 0, isActive: true, isFree: false });
    setCoverFile(null); setProductFile(null);
  };

  const editProduct = (item: CPProduct) => {
    setProductForm({
      id: item._id,
      title: item.title || '',
      description: item.description || '',
      cpPrice: Number(item.cpPrice || 0),
      type: item.type || 'book',
      sortOrder: Number(item.sortOrder || 0),
      isActive: item.isActive !== false,
      isFree: item.isFree === true,
    });
    setCoverFile(null);
    setProductFile(null);
    setTimeout(() => {
      productFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const saveProduct = async () => {
    try {
      const coverUrl = await uploadCoverFile();
      const fileMeta = await uploadProductFile();
      if (!productForm.id && !fileMeta) { addToast('Product PDF is required for new products.', 'error'); return; }
      const payload: Record<string, unknown> = {
        title: productForm.title, description: productForm.description,
        cpPrice: productForm.isFree ? 0 : Number(productForm.cpPrice || 0),
        type: productForm.type, sortOrder: Number(productForm.sortOrder || 0),
        isActive: productForm.isActive, isFree: productForm.isFree,
      };
      if (coverUrl) payload.coverUrl = coverUrl;
      if (fileMeta) Object.assign(payload, fileMeta);
      if (productForm.id) {
        await api.patch(`/admin/cp-products/${encodeURIComponent(productForm.id)}`, payload);
        addToast('Product updated', 'success');
      } else {
        await api.post('/admin/cp-products', payload);
        addToast('Product created', 'success');
      }
      resetProductForm(); await loadAll();
    } catch (e: any) { addToast(e?.response?.data?.error || 'Failed to save product', 'error'); }
  };

  const deleteProduct = async (id: string) => {
    if (!window.confirm('Delete this product?')) return;
    try { await api.delete(`/admin/cp-products/${encodeURIComponent(id)}`); addToast('Product deleted', 'success'); await loadAll(); }
    catch (e: any) { addToast(e?.response?.data?.error || 'Failed to delete', 'error'); }
  };

  const updateContactStatus = async (id: string, status: ContactMessage['status']) => {
    try { await api.patch(`/admin/contact-messages/${encodeURIComponent(id)}`, { status }); addToast('Updated', 'success'); await loadAll(); }
    catch (e: any) { addToast(e?.response?.data?.error || 'Failed to update', 'error'); }
  };

  const deleteContactMessage = async (id: string) => {
    if (!window.confirm('Delete this message?')) return;
    try { await api.delete(`/admin/contact-messages/${encodeURIComponent(id)}`); addToast('Deleted', 'success'); await loadAll(); }
    catch (e: any) { addToast(e?.response?.data?.error || 'Failed to delete', 'error'); }
  };

  // ── Tab label lookup ─────────────────────────────────────────────────────────
  const TAB_LABELS: Record<AdminTab, string> = {
    users: 'Users', bootcamps: 'Bootcamps', applications: 'Applications',
    zero_day: 'Market', cp: 'Points', chain: 'Chain',
    security: 'Security', contacts: 'Contacts', 
    assignments: 'Assignments',
  };
  const activeLabel = TAB_LABELS[activeTab] ?? '';

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <>
    <div className="bg-bg text-text-primary">
      {/*
        scroll-hover  → hides scrollbar at rest, shows a slim one on hover
        scroll-smooth → smooth momentum scrolling
      */}
      <div
        className="scroll-hover lg:fixed lg:left-0 lg:right-20 lg:bottom-0 lg:top-24 lg:overflow-y-auto lg:overscroll-contain"
        style={{
          scrollBehavior: 'smooth',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0px, black 24px)',
          maskImage: 'linear-gradient(to bottom, transparent 0px, black 24px)',
        }}
      >
        <div className="mx-auto max-w-7xl px-4 pt-6 pb-16 md:px-8">

          {/* ── HEADER ───────────────────────────────────────────────────── */}
<ScrollReveal className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
             <div>
               <div className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-accent">
                 Management Protocol
               </div>
               <h1 className="text-4xl font-black text-text-primary md:text-6xl">
                 {activeLabel}
               </h1>
               <p className="mt-1 max-w-lg text-base text-text-muted">
                 {loading ? 'Synchronizing encrypted data…' : `Managing system ${activeLabel.toLowerCase()}.`}
               </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => void loadAll()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border-2 border-accent/25 bg-accent-dim text-accent text-sm font-black uppercase tracking-wider hover:border-accent/40 transition-all active:scale-95"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Syncing' : 'Refresh'}
              </button>
            </div>
          </ScrollReveal>

          {/* ── MAIN CONTENT ────────────────────────────────────────────── */}
          {loading ? (
            <div className="mx-auto w-full max-w-5xl">
              <Skeleton />
            </div>
          ) : (
            <div className="mx-auto w-full max-w-7xl">
              {/* ── USERS ─────────────────────────────────────────────────── */}
              {activeTab === 'users' && (
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
                        onChange={e => setUserQuery(e.target.value)}
                        placeholder="Search by name, handle, email…"
                        className="w-full bg-bg border-2 border-border rounded-xl pl-12 pr-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs">
                      <span className="text-text-muted font-bold uppercase tracking-widest">{filteredUsers.length} users discovered</span>
                      <div className="flex items-center gap-3 ml-auto">
                        <select
                          value={userPageSize}
                          onChange={e => setUserPageSize(Number(e.target.value))}
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
                            {isUserBlocked(item) && <span className="text-red-400 font-black text-[10px] uppercase tracking-widest bg-red-400/10 px-2 py-0.5 rounded border border-red-400/20">BLOCKED</span>}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <button
                            onClick={() => void patchUser(item.id, { bootcampAccessRevoked: !item.bootcampAccessRevoked }, item.bootcampAccessRevoked ? 'Access restored' : 'Access revoked')}
                            className={`btn-primary py-2.5 text-xs font-black uppercase tracking-widest ${item.bootcampAccessRevoked ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'}`}
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
                            {['User','Role','Points','Bootcamp Access','Status','Actions'].map(h => (
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
                                  className={`text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-xl border-2 transition-all min-h-[36px] ${item.bootcampAccessRevoked ? 'text-red-400 border-red-500/20 bg-red-400/5 hover:border-red-500/40' : 'text-emerald-400 border-emerald-500/20 bg-emerald-400/5 hover:border-emerald-500/40'}`}
                                >
                                  {item.bootcampAccessRevoked ? 'Revoked' : 'Allowed'}
                                </button>
                              </td>
                              <td className="px-6 py-5">
                                {isUserBlocked(item) ? (
                                  <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-red-400 bg-red-400/10 px-2.5 py-1 rounded-lg border border-red-400/20">
                                    <Ban className="w-3 h-3" /> Blocked
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-lg border border-emerald-400/20">
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
              )}

              {/* ── BOOTCAMPS ─────────────────────────────────────────────── */}
              {activeTab === 'bootcamps' && (
                <div className="card-hsociety p-6 md:p-8">
                  <BootcampAccessPanel addToast={addToast} />
                </div>
              )}

              {/* ── APPLICATIONS ──────────────────────────────────────────── */}
              {activeTab === 'applications' && (
                <div className="space-y-6">
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-text-muted flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    {applications.length} pending applications
                  </div>

                  {/* Mobile */}
                  <div className="md:hidden space-y-4">
                    {applications.length === 0 ? (
                      <div className="text-center py-20 bg-bg-card border-2 border-dashed border-border rounded-2xl">
                        <Users className="w-12 h-12 text-text-muted/30 mx-auto mb-4" />
                        <p className="text-sm text-text-muted font-bold uppercase tracking-widest">No applications found</p>
                      </div>
                    ) : applications.map(app => (
                      <div key={app.userId} className="bg-bg-card border-2 border-border rounded-2xl p-5 space-y-3">
                        <div className="font-black text-lg text-text-primary">{app.hackerHandle || app.name || app.email}</div>
                        <div className="text-xs text-text-muted font-mono">{app.email}</div>
                        <div className="grid grid-cols-1 gap-2 text-xs mt-3 pt-3 border-t border-border/50">
                          {[
                            ['Bootcamp', app.application.bootcampTitle || app.bootcampId],
                            ['Level', app.application.level],
                            ['Commitment', app.application.commitment],
                            ['Phone', app.application.phone],
                          ].map(([k, v]) => v ? (
                            <div key={k} className="flex justify-between items-center"><span className="text-text-muted font-bold uppercase tracking-widest text-[10px]">{k}</span><span className="text-text-primary font-black uppercase">{v}</span></div>
                          ) : null)}
                        </div>
                        {app.application.motivation && (
                          <div className="text-xs bg-bg p-3 rounded-xl border border-border mt-2">
                            <span className="text-accent font-black uppercase tracking-widest text-[9px] block mb-1">Motivation</span>
                            <p className="text-text-secondary leading-relaxed">{app.application.motivation}</p>
                          </div>
                        )}
                        {app.application.submittedAt && (
                          <div className="text-[10px] text-text-muted font-mono pt-2 text-right">{new Date(app.application.submittedAt).toLocaleString()}</div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Desktop */}
                  <div className="hidden md:block bg-bg-card border-2 border-border rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left min-w-[900px]">
                        <thead className="border-b-2 border-border bg-bg/50 backdrop-blur-sm">
                          <tr>
                            {['Operator','Bootcamp','Why Joining','Level','Commitment','Phone','Date'].map(h => (
                              <th key={h} className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                          {applications.length === 0 ? (
                            <tr><td colSpan={7} className="px-6 py-20 text-center">
                              <Users className="w-12 h-12 text-text-muted/30 mx-auto mb-4" />
                              <p className="text-sm text-text-muted font-bold uppercase tracking-widest">No applications found</p>
                            </td></tr>
                          ) : applications.map(app => (
                            <tr key={app.userId} className="text-xs hover:bg-accent-dim/10 transition-colors group">
                              <td className="px-6 py-5">
                                <div className="font-black text-sm text-text-primary group-hover:text-accent transition-colors">{app.hackerHandle || app.name || '—'}</div>
                                <div className="text-[11px] text-text-muted font-mono">{app.email}</div>
                              </td>
                              <td className="px-6 py-5">
                                <span className="px-2 py-1 rounded bg-accent-dim/30 text-[9px] font-black uppercase tracking-widest text-accent border border-accent/10">
                                  {app.application.bootcampTitle || app.bootcampId || '—'}
                                </span>
                              </td>
                              <td className="px-6 py-5 text-text-secondary max-w-[240px]">
                                <div className="line-clamp-2 leading-relaxed">{app.application.motivation || '—'}</div>
                              </td>
                              <td className="px-6 py-5 font-black uppercase tracking-widest text-[10px] text-text-primary">{app.application.level || '—'}</td>
                              <td className="px-6 py-5 font-black uppercase tracking-widest text-[10px] text-text-primary">{app.application.commitment || '—'}</td>
                              <td className="px-6 py-5 font-mono text-text-muted">{app.application.phone || '—'}</td>
                              <td className="px-6 py-5 text-text-muted font-mono whitespace-nowrap">{app.application.submittedAt ? new Date(app.application.submittedAt).toLocaleDateString() : '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ── ZERO-DAY MARKET ───────────────────────────────────────── */}
              {activeTab === 'zero_day' && (
                <div className="space-y-8">
                  {/* Form */}
                  <div
                    ref={productFormRef}
                    className={`bg-bg-card rounded-2xl p-6 md:p-8 space-y-6 border-2 transition-all duration-300 shadow-xl ${
                      productForm.id ? 'border-accent/40 shadow-accent/5' : 'border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-border/50 pb-4">
                      <div className={`text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2 ${productForm.id ? 'text-accent' : 'text-text-muted'}`}>
                        {productForm.id ? <><RefreshCw className="w-4 h-4 animate-spin-slow" /> Editing: {productForm.title}</> : 'Initialize New Asset'}
                      </div>
                      {productForm.id && (
                        <button onClick={resetProductForm} className="text-[10px] font-black text-text-muted hover:text-accent uppercase tracking-[0.2em] transition-colors border border-border px-3 py-1.5 rounded-lg hover:border-accent/30">
                          ✕ Cancel Protocol
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <label className="block space-y-2">
                          <span className="text-[10px] font-black uppercase text-text-muted tracking-[0.2em]">Asset Title *</span>
                          <input value={productForm.title} onChange={e => setProductForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Linux Hacking Handbook" className="w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-sm text-text-primary focus:border-accent outline-none transition-colors" />
                        </label>
                        <label className="block space-y-2">
                          <span className="text-[10px] font-black uppercase text-text-muted tracking-[0.2em]">Asset Intelligence (Description)</span>
                          <textarea value={productForm.description} onChange={e => setProductForm(p => ({ ...p, description: e.target.value }))} placeholder="Detailed product telemetry…" rows={4} className="w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-sm text-text-primary focus:border-accent outline-none transition-colors resize-none" />
                        </label>
                      </div>

                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <label className="block space-y-2">
                            <span className="text-[10px] font-black uppercase text-text-muted tracking-[0.2em]">
                              CP Valuation {productForm.isFree && <span className="text-emerald-400">(zero cost)</span>}
                            </span>
                            <div className="relative">
                              <input
                                type="number"
                                min={0}
                                value={productForm.isFree ? 0 : productForm.cpPrice}
                                onChange={e => setProductForm(p => ({ ...p, cpPrice: Number(e.target.value || 0) }))}
                                disabled={productForm.isFree}
                                className="w-full bg-bg border-2 border-border rounded-xl pl-4 pr-10 py-3 text-sm text-text-primary focus:border-accent outline-none transition-colors disabled:opacity-40"
                              />
                              <CpLogo className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
                            </div>
                          </label>
                          <label className="block space-y-2">
                            <span className="text-[10px] font-black uppercase text-text-muted tracking-[0.2em]">Sequence Order</span>
                            <input type="number" min={0} value={productForm.sortOrder} onChange={e => setProductForm(p => ({ ...p, sortOrder: Number(e.target.value || 0) }))} placeholder="0" className="w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-sm text-text-primary focus:border-accent outline-none transition-colors" />
                          </label>
                        </div>
                        <label className="block space-y-2">
                          <span className="text-[10px] font-black uppercase text-text-muted tracking-[0.2em]">Classification (Type)</span>
                          <input value={productForm.type} onChange={e => setProductForm(p => ({ ...p, type: e.target.value }))} placeholder="book / tool / guide / network-map" className="w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-sm text-text-primary focus:border-accent outline-none transition-colors" />
                        </label>
                        <div className="flex flex-wrap gap-6 pt-2">
                          <label className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-text-secondary cursor-pointer group">
                            <input type="checkbox" checked={productForm.isActive} onChange={e => setProductForm(p => ({ ...p, isActive: e.target.checked }))} className="accent-accent w-5 h-5 rounded-lg border-2 border-border" />
                            <span className="group-hover:text-accent transition-colors">Deployment Active</span>
                          </label>
                          <label className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-text-secondary cursor-pointer group">
                            <input type="checkbox" checked={productForm.isFree} onChange={e => setProductForm(p => ({ ...p, isFree: e.target.checked, cpPrice: e.target.checked ? 0 : p.cpPrice }))} className="accent-accent w-5 h-5 rounded-lg border-2 border-border" />
                            <span className="group-hover:text-emerald-400 transition-colors">Public Domain (Free)</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border/50">
                      <label className="block space-y-2">
                        <span className="text-[10px] font-black uppercase text-text-muted tracking-[0.2em]">Visual Identification (Cover Image)</span>
                        <div className="relative group">
                          <input type="file" accept="image/*" onChange={e => setCoverFile(e.target.files?.[0] || null)} className="block w-full text-[10px] text-text-muted file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-2 file:border-border file:bg-bg file:text-[10px] file:font-black file:uppercase file:tracking-widest file:text-text-primary file:cursor-pointer hover:file:border-accent/40 file:transition-all" />
                        </div>
                      </label>
                      <label className="block space-y-2">
                        <span className="text-[10px] font-black uppercase text-text-muted tracking-[0.2em]">Data Core (Product PDF) *</span>
                        <div className="relative group">
                          <input type="file" accept="application/pdf" onChange={e => setProductFile(e.target.files?.[0] || null)} className="block w-full text-[10px] text-text-muted file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-2 file:border-border file:bg-bg file:text-[10px] file:font-black file:uppercase file:tracking-widest file:text-text-primary file:cursor-pointer hover:file:border-accent/40 file:transition-all" />
                        </div>
                      </label>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button onClick={() => void saveProduct()} className="btn-primary flex-1 py-4 text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-accent/10 transition-all active:scale-[0.98]">
                        {productForm.id ? 'Authorize Update' : 'Initialize Asset'}
                      </button>
                      <button onClick={resetProductForm} className="px-8 rounded-2xl border-2 border-border text-xs font-black uppercase tracking-[0.2em] text-text-muted hover:border-accent/30 hover:text-accent transition-all active:scale-[0.98]">
                        Purge
                      </button>
                    </div>
                  </div>

                  {/* Product list — mobile */}
                  <div className="md:hidden space-y-4">
                    {products.map(item => (
                      <div key={item._id} className="bg-bg-card border-2 border-border rounded-2xl p-5 space-y-4 shadow-lg">
                        <div className="flex items-start gap-4">
                          <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-border shrink-0 bg-bg shadow-inner">
                            <img
                              src={resolveImg(item.coverUrl, '/assets/sections/backgrounds/cyber-points-visual.webp')}
                              alt={item.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const el = e.currentTarget;
                                if (!el.dataset.fallbackApplied) {
                                  el.dataset.fallbackApplied = '1';
                                  el.src = '/assets/sections/backgrounds/cyber-points-visual.webp';
                                }
                              }}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-black text-base text-text-primary leading-tight">{item.title}</div>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <span className="px-1.5 py-0.5 rounded bg-accent-dim text-[8px] font-black uppercase tracking-widest text-accent border border-accent/10">{item.type}</span>
                              <span className="text-[10px] font-mono font-bold text-text-secondary inline-flex items-center gap-1">
                                {item.isFree ? <span className="text-emerald-400">FREE</span> : <>{item.cpPrice} <CpLogo className="w-3 h-3" /></>}
                              </span>
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${item.isActive ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' : 'bg-red-400/10 text-red-400 border-red-400/20'}`}>
                                {item.isActive ? 'Active' : 'Offline'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <button
                            onClick={() => editProduct(item)}
                            className="btn-primary py-2.5 bg-transparent border-border text-text-muted hover:text-accent hover:border-accent/40 text-[10px] font-black uppercase tracking-widest"
                          >Modify</button>
                          <button onClick={() => void deleteProduct(item._id)} className="btn-primary py-2.5 bg-transparent border-red-500/20 text-red-400 hover:bg-red-400/10 text-[10px] font-black uppercase tracking-widest">Terminate</button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Product list — desktop */}
                  <div className="hidden md:block bg-bg-card border-2 border-border rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left min-w-[640px]">
                        <thead className="border-b-2 border-border bg-bg/50 backdrop-blur-sm">
                          <tr>
                            {['Asset','Title','Valuation','Classification','Status','Actions'].map(h => (
                              <th key={h} className={`px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                          {products.map(item => (
                            <tr key={item._id} className="hover:bg-accent-dim/10 transition-colors group">
                              <td className="px-6 py-5">
                                <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-border bg-bg shrink-0 shadow-lg group-hover:border-accent/40 transition-all">
                                  <img
                                    src={resolveImg(item.coverUrl, '/assets/sections/backgrounds/cyber-points-visual.webp')}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    onError={(e) => {
                                      const el = e.currentTarget;
                                      if (!el.dataset.fallbackApplied) {
                                        el.dataset.fallbackApplied = '1';
                                        el.src = '/assets/sections/backgrounds/cyber-points-visual.webp';
                                      }
                                    }}
                                  />
                                </div>
                              </td>
                              <td className="px-6 py-5">
                                <div className="font-black text-base text-text-primary group-hover:text-accent transition-colors">{item.title}</div>
                                <div className="text-[10px] text-text-muted font-mono mt-0.5 uppercase tracking-widest">ID: {String(item._id).slice(-8)}</div>
                              </td>
                              <td className="px-6 py-5">
                                {item.isFree ? (
                                  <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/20 uppercase tracking-widest">Free Access</span>
                                ) : (
                                  <div className="flex items-center gap-2 font-mono font-bold text-text-primary">
                                    <CpLogo className="w-4 h-4" />
                                    {Number(item.cpPrice || 0).toLocaleString()}
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-5">
                                <span className="px-2 py-1 rounded bg-accent-dim/50 text-[10px] font-black uppercase tracking-widest text-accent border border-accent/10 whitespace-nowrap">
                                  {item.type}
                                </span>
                              </td>
                              <td className="px-6 py-5">
                                <div className="flex items-center gap-2">
                                  <span className={`w-2 h-2 rounded-full ${item.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'}`} />
                                  <span className={`text-[10px] font-black uppercase tracking-widest ${item.isActive ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {item.isActive ? 'Operational' : 'Offline'}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-5 text-right">
                                <div className="inline-flex gap-3">
                                  <button
                                    onClick={() => editProduct(item)}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl border-2 border-border text-text-muted hover:border-accent/40 hover:text-accent transition-all active:scale-90 bg-bg-card shadow-sm"
                                  ><Search className="w-4 h-4" /></button>
                                  <button
                                    onClick={() => void deleteProduct(item._id)}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl border-2 border-red-500/20 text-red-400 hover:border-red-500/40 hover:bg-red-500/10 transition-all active:scale-90 bg-bg-card shadow-sm"
                                  ><Trash2 className="w-4 h-4" /></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ── POINTS / CP ANALYTICS ────────────────────────────────── */}
              {activeTab === 'cp' && (
                <div className="card-hsociety p-6 md:p-8">
                  <CpAnalytics users={users} addToast={addToast} />
                </div>
              )}

              {/* ── SECURITY ──────────────────────────────────────────────── */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <StatCard label="Events 24h" value={Number(securitySummary?.events24h || 0)} />
                    <StatCard label="Unique IPs 24h" value={Number(securitySummary?.uniqueIps24h || 0)} />
                    <StatCard label="Auth Failures 24h" value={Number(securitySummary?.authFailures24h || 0)} />
                  </div>

                  {/* Mobile */}
                  <div className="md:hidden space-y-4">
                    {securityEvents.map(item => (
                      <div key={item.id} className="bg-bg-card border-2 border-border rounded-2xl p-5 space-y-2 text-xs shadow-lg">
                        <div className="flex justify-between items-start">
                          <span className="font-black text-accent uppercase tracking-widest text-[10px]">{item.eventType}</span>
                          <span className="text-[10px] text-text-muted font-mono">{item.createdAt ? new Date(item.createdAt).toLocaleString() : '—'}</span>
                        </div>
                        <div className="font-black text-text-primary uppercase tracking-tight text-sm mt-1">{item.action}</div>
                        <div className="bg-bg p-3 rounded-xl border border-border font-mono text-[10px] text-text-muted break-all mt-2 overflow-x-auto whitespace-nowrap">
                          {item.path || '—'}
                        </div>
                        <div className="flex justify-between items-center pt-2 text-[10px] font-bold text-text-muted uppercase tracking-widest border-t border-border/50">
                          <span>HTTP {item.statusCode}</span>
                          <span className="font-mono">{item.ipAddress || '—'}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop */}
                  <div className="hidden md:block bg-bg-card border-2 border-border rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left min-w-[860px]">
                        <thead className="border-b-2 border-border bg-bg/50 backdrop-blur-sm">
                          <tr>
                            {['Time','Type','Action','Path','Code','IP'].map(h => (
                              <th key={h} className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                          {securityEvents.map(item => (
                            <tr key={item.id} className="text-xs hover:bg-accent-dim/10 transition-colors group">
                              <td className="px-6 py-5 text-text-muted font-mono whitespace-nowrap">{item.createdAt ? new Date(item.createdAt).toLocaleString() : '—'}</td>
                              <td className="px-6 py-5">
                                <span className="px-2 py-1 rounded bg-accent-dim/30 text-[9px] font-black uppercase tracking-widest text-accent border border-accent/10 whitespace-nowrap">
                                  {item.eventType}
                                </span>
                              </td>
                              <td className="px-6 py-5 font-black uppercase tracking-tight text-text-primary text-sm whitespace-nowrap">{item.action}</td>
                              <td className="px-6 py-5 font-mono text-text-muted max-w-[240px] truncate">{item.path || '—'}</td>
                              <td className="px-6 py-5">
                                <span className={`px-2 py-1 rounded text-[10px] font-black font-mono border ${Number(item.statusCode) >= 400 ? 'bg-red-400/10 text-red-400 border-red-400/20' : 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20'}`}>
                                  {item.statusCode}
                                </span>
                              </td>
                              <td className="px-6 py-5 font-mono text-text-secondary whitespace-nowrap">{item.ipAddress || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ── CONTACTS ──────────────────────────────────────────────── */}
              {activeTab === 'contacts' && (
                <div className="space-y-6">
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-text-muted flex items-center gap-2">
                    <Mail className="w-4 h-4 text-accent" />
                    {contactMessages.length} intercept(s) in inbox
                  </div>

                  {/* Mobile */}
                  <div className="md:hidden space-y-4">
                    {contactMessages.length === 0 ? (
                      <div className="text-center py-20 bg-bg-card border-2 border-dashed border-border rounded-2xl">
                        <Mail className="w-12 h-12 text-text-muted/30 mx-auto mb-4" />
                        <p className="text-sm text-text-muted font-bold uppercase tracking-widest">Signal silence (no messages)</p>
                      </div>
                    ) : contactMessages.map(item => (
                      <div key={item.id} className="bg-bg-card border-2 border-border rounded-2xl p-5 space-y-4 shadow-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-black text-lg text-text-primary leading-tight">{item.name}</div>
                            <div className="text-xs text-text-muted font-mono mt-0.5">{item.email}</div>
                          </div>
                          <span className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest border ${item.status === 'new' ? 'bg-accent/10 text-accent border-accent/20' : 'bg-bg border-border text-text-muted'}`}>
                            {item.status}
                          </span>
                        </div>
                        {item.subject && (
                          <div className="text-sm font-black text-text-primary bg-bg/50 px-3 py-2 rounded-lg border border-border/50 uppercase tracking-tight">
                            {item.subject}
                          </div>
                        )}
                        <div className="text-sm text-text-secondary leading-relaxed bg-bg p-4 rounded-xl border border-border shadow-inner italic">
                          "{item.message}"
                        </div>
                        <div className="flex gap-3 pt-2">
                          <select
                            value={item.status}
                            onChange={e => void updateContactStatus(item.id, e.target.value as ContactMessage['status'])}
                            className="flex-1 bg-bg border-2 border-border rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest text-text-primary min-h-[48px] focus:border-accent outline-none"
                          >
                            <option value="new">New Signal</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="archived">Archived</option>
                          </select>
                          <button onClick={() => void deleteContactMessage(item.id)} className="w-12 h-12 flex items-center justify-center rounded-xl border-2 border-red-500/20 text-red-400 hover:bg-red-400/10 transition-all active:scale-90">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop */}
                  <div className="hidden md:block bg-bg-card border-2 border-border rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left min-w-[900px]">
                        <thead className="border-b-2 border-border bg-bg/50 backdrop-blur-sm">
                          <tr>
                            {['From','Subject','Message','Status','Date','Actions'].map((h,i) => (
                              <th key={i} className={`px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ${i === 5 ? 'text-right' : ''}`}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                          {contactMessages.length === 0 ? (
                            <tr><td colSpan={6} className="px-6 py-20 text-center">
                              <Mail className="w-12 h-12 text-text-muted/30 mx-auto mb-4" />
                              <p className="text-sm text-text-muted font-bold uppercase tracking-widest">Signal silence (no messages)</p>
                            </td></tr>
                          ) : contactMessages.map(item => (
                            <tr key={item.id} className="align-top hover:bg-accent-dim/10 transition-colors group">
                              <td className="px-6 py-6 text-sm">
                                <div className="font-black text-text-primary group-hover:text-accent transition-colors leading-tight">{item.name}</div>
                                <div className="text-[11px] text-text-muted font-mono mt-0.5">{item.email}</div>
                              </td>
                              <td className="px-6 py-6 text-xs text-text-primary font-black uppercase tracking-tight max-w-[160px]">{item.subject || '—'}</td>
                              <td className="px-6 py-6 text-xs text-text-secondary max-w-[320px]">
                                <div className="line-clamp-3 leading-relaxed italic">"{item.message}"</div>
                              </td>
                              <td className="px-6 py-6">
                                <select
                                  value={item.status}
                                  onChange={e => void updateContactStatus(item.id, e.target.value as ContactMessage['status'])}
                                  className={`bg-bg border-2 border-border rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest text-text-primary focus:border-accent outline-none transition-all ${item.status === 'new' ? 'border-accent/40 text-accent' : ''}`}
                                >
                                  <option value="new">New Signal</option>
                                  <option value="in_progress">In Progress</option>
                                  <option value="resolved">Resolved</option>
                                  <option value="archived">Archived</option>
                                </select>
                              </td>
                              <td className="px-6 py-6 text-[11px] text-text-muted font-mono whitespace-nowrap">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '—'}</td>
                              <td className="px-6 py-6 text-right">
                                <button
                                  onClick={() => void deleteContactMessage(item.id)}
                                  className="w-10 h-10 flex items-center justify-center rounded-xl border-2 border-red-500/20 text-red-400 hover:border-red-500/40 hover:bg-red-500/10 transition-all active:scale-90 bg-bg-card shadow-sm"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ── CHAIN EXPLORER ────────────────────────────────────────── */}
              {activeTab === 'chain' && (
                <div className="card-hsociety p-6 md:p-8">
                  <ChainExplorer />
                </div>
              )}

              {/* ── ASSIGNMENTS ───────────────────────────────────────────── */}
              {activeTab === 'assignments' && (
                <div className="card-hsociety p-6 md:p-8">
                  <AssignmentManager />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Confirm delete user dialog */}
    <ConfirmDialog
      open={confirmDeleteUser !== null}
      onOpenChange={(open) => { if (!open) setConfirmDeleteUser(null); }}
      title="Authorize User Termination"
      description={`Are you sure you want to permanently delete user ${confirmDeleteUser?.email ?? 'this record'}? This action is irreversible.`}
      confirmLabel="Terminate"
      cancelLabel="Abort"
      destructive
      onConfirm={() => { if (confirmDeleteUser) void handleDeleteUserConfirmed(confirmDeleteUser); }}
    />
    </>
  );
};

export default AdminDashboardPage;
