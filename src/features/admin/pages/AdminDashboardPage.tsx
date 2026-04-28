import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, LogOut, Shield, Users, Database, Coins,
  AlertTriangle, Mail, Ban, Unlock, Search, Menu, X,
  RefreshCw, Trash2, BookOpen, ChevronLeft, ChevronRight, CheckCircle2,
} from 'lucide-react';
import QuizManager from '../components/QuizManager';
import { useAuth } from '../../../core/contexts/AuthContext';
import { useToast } from '../../../core/contexts/ToastContext';
import Logo from '../../../shared/components/brand/Logo';
import CpLogo from '../../../shared/components/CpLogo';
import api from '../../../core/services/api';

const HACKER_PROTOCOL_ID = 'bc_1775270338500';

// ── MVP Bootcamp Control Panel ────────────────────────────────────────────────
const BOOTCAMP_MODULES = [
  { moduleId: 1, title: 'Hacker Mindset', rooms: 3 },
  { moduleId: 2, title: 'Linux Foundations', rooms: 4 },
  { moduleId: 3, title: 'Networking', rooms: 4 },
  { moduleId: 4, title: 'Web & Backend Systems', rooms: 5 },
  { moduleId: 5, title: 'Social Engineering', rooms: 3 },
];

const BootcampAccessPanel: React.FC<{ addToast: (msg: string, type: string) => void; api: typeof import('../../../core/services/api').default }> = ({ addToast }) => {
  const [panel, setPanel] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  const load = () => {
    setLoading(true);
    api.get(`/admin/bootcamp/control-panel?bootcampId=${HACKER_PROTOCOL_ID}`)
      .then(res => setPanel(res.data || null))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  React.useEffect(() => { load(); }, []);

  const patch = async (body: Record<string, unknown>, msg: string) => {
    setSaving(true);
    try {
      const res = await api.patch('/admin/bootcamp/access', { bootcampId: HACKER_PROTOCOL_ID, ...body });
      setPanel((p: any) => ({ ...p, ...res.data?.controlPanel, bootcampStarted: res.data?.access?.started, unlockedModules: res.data?.access?.unlockedModules }));
      addToast(msg, 'success');
    } catch (e: any) {
      addToast(e?.response?.data?.error || 'Failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-text-muted text-sm animate-pulse">Loading control panel…</div>;

  const started = Boolean(panel?.bootcampStarted);
  const unlockedModules: number[] = Array.isArray(panel?.unlockedModules) ? panel.unlockedModules : [];
  const enrolledStudents = Number(panel?.enrolledStudents || 0);
  const currentModule = panel?.currentModule || null;
  const nextModule = panel?.nextModule || null;
  const engagement = Number(panel?.engagement?.studentsInCurrentModule || 0);

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Enrolled', value: enrolledStudents },
          { label: 'Modules Unlocked', value: `${unlockedModules.length} / ${BOOTCAMP_MODULES.length}` },
          { label: 'In Current Module', value: engagement },
          { label: 'Status', value: started ? 'LIVE' : 'PAUSED' },
        ].map(({ label, value }) => (
          <div key={label} className="bg-bg-card border border-border rounded-xl p-4">
            <div className="text-[10px] uppercase tracking-widest text-text-muted mb-1">{label}</div>
            <div className={`text-xl font-black ${label === 'Status' ? (started ? 'text-accent' : 'text-text-muted') : 'text-text-primary'}`}>{value}</div>
          </div>
        ))}
      </div>

      {/* Start / Stop toggle */}
      <div className="flex items-center justify-between p-5 bg-bg-card border border-border rounded-xl">
        <div>
          <div className="text-sm font-black text-text-primary uppercase tracking-wide mb-1">Bootcamp Started</div>
          <div className="text-xs text-text-muted">Students can access content only when this is on</div>
        </div>
        <button
          onClick={() => void patch({ started: !started }, started ? 'Bootcamp paused' : 'Bootcamp started!')}
          disabled={saving}
          className={`w-14 h-7 rounded-full transition-colors relative flex-none disabled:opacity-50 ${started ? 'bg-accent' : 'bg-border'}`}
        >
          <span className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${started ? 'translate-x-8' : 'translate-x-1'}`} />
        </button>
      </div>

      {/* Unlock next module — 1-click */}
      <div className="p-5 bg-bg-card border border-border rounded-xl space-y-4">
        <div>
          <div className="text-sm font-black text-text-primary uppercase tracking-wide mb-1">Module Control</div>
          <div className="text-xs text-text-muted">Unlocking a module automatically unlocks all its rooms</div>
        </div>

        {currentModule && (
          <div className="flex items-center gap-3 p-3 bg-accent-dim/40 border border-accent/20 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse flex-none" />
            <div>
              <div className="text-[10px] uppercase tracking-widest text-accent font-bold mb-0.5">Current Module</div>
              <div className="text-sm font-bold text-text-primary">{currentModule.title}</div>
              <div className="text-[10px] text-text-muted">{currentModule.roomCount} rooms · {engagement} students active</div>
            </div>
          </div>
        )}

        {nextModule ? (
          <button
            onClick={() => void patch({ unlockNext: true }, `Module "${nextModule.title}" unlocked`)}
            disabled={saving || !started}
            className="w-full flex items-center justify-between gap-3 p-4 bg-bg border border-border rounded-xl hover:border-accent/40 hover:bg-accent-dim/20 transition-all disabled:opacity-40 group"
          >
            <div className="text-left">
              <div className="text-[10px] uppercase tracking-widest text-text-muted mb-0.5">Unlock Next Module</div>
              <div className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors">{nextModule.title}</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-accent-dim border border-accent/30 flex items-center justify-center flex-none">
              <Unlock className="w-4 h-4 text-accent" />
            </div>
          </button>
        ) : (
          <div className="p-4 border border-border rounded-xl text-sm text-text-muted text-center">
            All modules are unlocked
          </div>
        )}

        {/* Module list */}
        <div className="space-y-2 pt-2">
          <div className="text-[10px] uppercase tracking-widest text-text-muted font-bold">All Modules</div>
          {BOOTCAMP_MODULES.map(mod => {
            const unlocked = unlockedModules.includes(mod.moduleId);
            const isCurrent = currentModule?.moduleId === mod.moduleId;
            return (
              <div key={mod.moduleId} className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors ${
                isCurrent ? 'border-accent/30 bg-accent-dim/30' : unlocked ? 'border-border bg-bg-card' : 'border-border/50 bg-bg opacity-50'
              }`}>
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-none text-xs font-black ${
                  unlocked ? 'bg-accent text-bg' : 'bg-bg border border-border text-text-muted'
                }`}>
                  {unlocked ? <CheckCircle2 className="w-3.5 h-3.5" /> : String(mod.moduleId).padStart(2, '0')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-text-primary truncate">{mod.title}</div>
                  <div className="text-[10px] text-text-muted">{mod.rooms} rooms</div>
                </div>
                {unlocked && <span className="text-[9px] font-bold text-accent uppercase tracking-widest">Unlocked</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ── Types ─────────────────────────────────────────────────────────────────────
type AdminTab = 'users' | 'bootcamps' | 'zero_day' | 'cp' | 'security' | 'contacts' | 'applications' | 'quizzes';

type AdminUser = {
  id: string; name: string; hackerHandle: string; email: string;
  role: string; cpPoints: number; bootcampAccessRevoked: boolean; blockedUntil?: string | null;
};
type Bootcamp = {
  id: string; title: string; description: string; level: string; duration: string;
  priceLabel: string; image: string; isActive: boolean; sortOrder: number; modules: any[];
};
type CPProduct = {
  _id: string; title: string; description: string; cpPrice: number; coverUrl: string;
  productUrl: string; type: string; isActive: boolean; isFree: boolean; sortOrder: number;
};
type ContactMessage = {
  id: string; name: string; email: string; subject: string; message: string;
  status: 'new' | 'in_progress' | 'resolved' | 'archived'; createdAt?: string;
};
type SecurityEventItem = {
  id: string; createdAt: string; eventType: string; action: string;
  path: string; statusCode: number; ipAddress: string;
};

const isUserBlocked = (u: AdminUser) =>
  Boolean(u.blockedUntil && new Date(u.blockedUntil).getTime() > Date.now());

// ── Shared input class ────────────────────────────────────────────────────────
const inp = 'w-full bg-bg border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors placeholder:text-text-muted';
const btn = 'inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wide transition-colors min-h-[44px]';

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
  <div className="bg-bg-card border border-border rounded-xl p-4">
    <div className="text-[10px] uppercase tracking-widest text-text-muted mb-1">{label}</div>
    <div className="text-2xl font-black text-text-primary">{value}</div>
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────
const AdminDashboardPage: React.FC = () => {
  const { logout, user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
    sortOrder: 0, productUrl: '', isActive: true, isFree: false,
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [productFile, setProductFile] = useState<File | null>(null);

  const [cpAction, setCpAction] = useState<'grant' | 'deduct' | 'set'>('grant');
  const [cpUserId, setCpUserId] = useState('');
  const [cpValue, setCpValue] = useState(0);
  const [cpReason, setCpReason] = useState('');

  const [securitySummary, setSecuritySummary] = useState<Record<string, unknown> | null>(null);
  const [securityEvents, setSecurityEvents] = useState<SecurityEventItem[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [applications, setApplications] = useState<any[]>([]);

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
      if (userItems.length && !cpUserId) setCpUserId(userItems[0].id);

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
  useEffect(() => { setMobileNavOpen(false); }, [activeTab]);
  useEffect(() => { setUserPage(1); }, [userQuery, users.length, userPageSize]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [mobileNavOpen]);

  // ── Actions ───────────────────────────────────────────────────────────────────
  const handleLogout = async () => { await logout(); navigate('/mr-robot'); };

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
    if (!window.confirm(`Delete ${target.email}? This cannot be undone.`)) return;
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
    setProductForm({ id: '', title: '', description: '', cpPrice: 0, type: 'book', sortOrder: 0, productUrl: '', isActive: true, isFree: false });
    setCoverFile(null); setProductFile(null);
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
        productUrl: productForm.productUrl, isActive: productForm.isActive, isFree: productForm.isFree,
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

  const runCpAction = async () => {
    if (!cpUserId) { addToast('Select a user first.', 'error'); return; }
    if (cpAction !== 'set' && cpValue <= 0) { addToast('Points must be > 0.', 'error'); return; }
    if (cpAction === 'set' && cpValue < 0) { addToast('Value cannot be negative.', 'error'); return; }
    try {
      if (cpAction === 'grant') await api.post('/admin/cp/grant', { userIds: [cpUserId], points: cpValue, reason: cpReason });
      else if (cpAction === 'deduct') await api.post('/admin/cp/deduct', { userIds: [cpUserId], points: cpValue, reason: cpReason });
      else await api.post('/admin/cp/set', { userIds: [cpUserId], value: cpValue, reason: cpReason });
      addToast('Points operation completed', 'success'); await loadAll();
    } catch (e: any) { addToast(e?.response?.data?.error || 'Points operation failed', 'error'); }
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

  // ── Tab config ────────────────────────────────────────────────────────────────
  const tabs: Array<{ id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'users',        label: 'Users',        icon: Users        },
    { id: 'bootcamps',    label: 'Bootcamps',    icon: Shield       },
    { id: 'applications', label: 'Applications', icon: Users        },
    { id: 'zero_day',     label: 'Market',       icon: Database     },
    { id: 'cp',           label: 'Points',       icon: Coins        },
    { id: 'security',     label: 'Security',     icon: AlertTriangle},
    { id: 'contacts',     label: 'Contacts',     icon: Mail         },
    { id: 'quizzes',      label: 'Quizzes',      icon: BookOpen     },
  ];

  const activeLabel = tabs.find(t => t.id === activeTab)?.label ?? '';

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-svh bg-bg text-text-primary overflow-hidden">

      {/* ── Desktop sidebar ─────────────────────────────────────────────────── */}
      <aside className="hidden md:flex w-56 lg:w-64 shrink-0 border-r border-border bg-bg-card flex-col h-full">
        <div className="p-4 border-b border-border">
          <Link to="/"><Logo size="sm" /></Link>
          <div className="text-[9px] font-bold text-text-muted font-mono tracking-[0.2em] mt-1">ADMIN_CONSOLE</div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          <Link
            to="/dashboard"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide text-text-muted hover:text-text-primary hover:bg-accent-dim/50 transition-colors"
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" /> Operator View
          </Link>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors text-left ${
                activeTab === tab.id
                  ? 'bg-accent-dim text-accent border border-accent/30'
                  : 'text-text-muted hover:text-text-primary hover:bg-accent-dim/50'
              }`}
            >
              <tab.icon className="w-4 h-4 shrink-0" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <div className="text-[10px] text-text-muted truncate">
            {user?.email || user?.username || 'admin'}
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold uppercase text-text-muted border border-border rounded-xl hover:text-text-primary hover:border-accent/30 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* ── Main area ───────────────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden">

        {/* Mobile topbar */}
        <header className="md:hidden flex items-center justify-between gap-3 px-4 h-14 border-b border-border bg-bg-card shrink-0">
          <button
            onClick={() => setMobileNavOpen(true)}
            className="w-11 h-11 flex items-center justify-center rounded-xl border border-border text-text-muted hover:text-accent hover:border-accent/30 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold uppercase tracking-wide text-text-primary truncate">{activeLabel}</span>
          <button
            onClick={() => void loadAll()}
            className="w-11 h-11 flex items-center justify-center rounded-xl border border-border text-text-muted hover:text-accent hover:border-accent/30 transition-colors"
            aria-label="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </header>

        {/* Mobile drawer */}
        {mobileNavOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <button
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileNavOpen(false)}
              aria-label="Close menu"
            />
            {/* Drawer */}
            <div className="relative w-72 max-w-[85vw] bg-bg-card border-r border-border flex flex-col h-full"
              style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
              <div className="flex items-center justify-between p-4 border-b border-border">
                <Logo size="sm" />
                <button
                  onClick={() => setMobileNavOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl border border-border text-text-muted hover:text-accent transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm font-bold uppercase tracking-wide text-text-muted hover:text-text-primary hover:bg-accent-dim/50 transition-colors"
                >
                  <LayoutDashboard className="w-5 h-5 shrink-0" /> Operator View
                </Link>
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-3 rounded-lg text-sm font-bold uppercase tracking-wide transition-colors text-left ${
                      activeTab === tab.id
                        ? 'bg-accent-dim text-accent border border-accent/30'
                        : 'text-text-secondary hover:bg-accent-dim/50'
                    }`}
                  >
                    <tab.icon className="w-5 h-5 shrink-0" />
                    {tab.label}
                  </button>
                ))}
              </nav>
              <div className="p-4 border-t border-border">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-3 py-3 text-sm font-bold uppercase text-text-muted border border-border rounded-xl hover:text-text-primary hover:border-accent/30 transition-colors"
                >
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Desktop page header */}
        <div className="hidden md:flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h1 className="text-base font-black text-text-primary uppercase tracking-tight">{activeLabel}</h1>
          <button
            onClick={() => void loadAll()}
            className="flex items-center gap-1.5 px-3 py-2 border border-border rounded-xl text-xs font-bold uppercase text-text-muted hover:text-accent hover:border-accent/30 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>

        {/* Scrollable content */}
        <main className="flex-1 min-h-0 overflow-y-auto p-4 md:p-8 lg:p-10">
          {loading ? <Skeleton /> : (
            <>

              {/* ── USERS ─────────────────────────────────────────────────── */}
              {activeTab === 'users' && (
                <div className="space-y-4">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <StatCard label="Total Users" value={Number((overview?.users as any)?.total || 0)} />
                    <StatCard label="Active 24h" value={Number((overview?.users as any)?.active24h || 0)} />
                    <StatCard label="Admins" value={users.filter(u => u.role === 'admin').length} />
                  </div>

                  {/* Search + pagination controls */}
                  <div className="bg-bg-card border border-border rounded-xl p-3 space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                      <input
                        type="text"
                        value={userQuery}
                        onChange={e => setUserQuery(e.target.value)}
                        placeholder="Search by name, handle, email…"
                        className="w-full bg-bg border border-border rounded-xl pl-10 pr-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-text-muted">{filteredUsers.length} users</span>
                      <select
                        value={userPageSize}
                        onChange={e => setUserPageSize(Number(e.target.value))}
                        className="bg-bg border border-border rounded-xl px-2 py-2 text-xs text-text-primary min-h-[36px]"
                      >
                        {[10,25,50,100].map(n => <option key={n} value={n}>{n} / page</option>)}
                      </select>
                      <div className="flex items-center gap-1 ml-auto">
                        <button
                          onClick={() => setUserPage(p => Math.max(1, p - 1))}
                          disabled={userPage <= 1}
                          className="w-9 h-9 flex items-center justify-center rounded-xl border border-border text-text-muted disabled:opacity-40 hover:border-accent/30 hover:text-accent transition-colors"
                        ><ChevronLeft className="w-4 h-4" /></button>
                        <span className="px-2 text-text-muted text-xs">{Math.min(userPage, totalUserPages)} / {totalUserPages}</span>
                        <button
                          onClick={() => setUserPage(p => Math.min(totalUserPages, p + 1))}
                          disabled={userPage >= totalUserPages}
                          className="w-9 h-9 flex items-center justify-center rounded-xl border border-border text-text-muted disabled:opacity-40 hover:border-accent/30 hover:text-accent transition-colors"
                        ><ChevronRight className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>

                  {/* Mobile cards */}
                  <div className="md:hidden space-y-3">
                    {paginatedUsers.map(item => (
                      <div key={item.id} className="bg-bg-card border border-border rounded-xl p-4 space-y-3">
                        <div>
                          <div className="font-bold text-sm text-text-primary">{item.hackerHandle || item.name || item.email}</div>
                          <div className="text-xs text-text-muted mt-0.5">{item.email}</div>
                          <div className="flex items-center gap-3 mt-1.5 text-xs">
                            <span className="uppercase text-text-muted">{item.role}</span>
                            <span className="font-mono text-text-secondary inline-flex items-center gap-1">
                              <CpLogo className="w-3.5 h-3.5" /> {Number(item.cpPoints || 0).toLocaleString()}
                            </span>
                            {isUserBlocked(item) && <span className="text-red-400 font-bold">BLOCKED</span>}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => void patchUser(item.id, { bootcampAccessRevoked: !item.bootcampAccessRevoked }, item.bootcampAccessRevoked ? 'Access restored' : 'Access revoked')}
                            className={`${btn} ${item.bootcampAccessRevoked ? 'border-red-500/30 text-red-400' : 'border-emerald-500/30 text-emerald-400'}`}
                          >
                            {item.bootcampAccessRevoked ? 'Revoked' : 'Allowed'}
                          </button>
                          <button
                            onClick={() => void handleUserBlockToggle(item)}
                            className={`${btn} border-border text-text-muted hover:border-accent/30 hover:text-accent`}
                          >
                            {isUserBlocked(item) ? <><Unlock className="w-3.5 h-3.5" />Unblock</> : <><Ban className="w-3.5 h-3.5" />Block</>}
                          </button>
                          <button
                            onClick={() => void handleDeleteUser(item)}
                            className={`col-span-2 ${btn} border-red-500/30 text-red-400 hover:bg-red-500/10`}
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete User
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop table */}
                  <div className="hidden md:block bg-bg-card border border-border rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left min-w-[860px]">
                        <thead className="border-b border-border bg-bg">
                          <tr>
                            {['User','Role','Points','Bootcamp Access','Status','Actions'].map(h => (
                              <th key={h} className={`px-4 py-3 text-[10px] uppercase tracking-widest text-text-muted ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {paginatedUsers.map(item => (
                            <tr key={item.id} className="hover:bg-accent-dim/20 transition-colors">
                              <td className="px-4 py-3">
                                <div className="font-bold text-sm text-text-primary">{item.hackerHandle || item.name || item.email}</div>
                                <div className="text-[11px] text-text-muted">{item.email}</div>
                              </td>
                              <td className="px-4 py-3 text-xs uppercase text-text-secondary">{item.role}</td>
                              <td className="px-4 py-3 text-sm font-mono text-text-primary">{Number(item.cpPoints || 0).toLocaleString()}</td>
                              <td className="px-4 py-3">
                                <button
                                  onClick={() => void patchUser(item.id, { bootcampAccessRevoked: !item.bootcampAccessRevoked }, item.bootcampAccessRevoked ? 'Access restored' : 'Access revoked')}
                                  className={`text-[11px] px-2.5 py-1.5 rounded-lg border min-h-[32px] ${item.bootcampAccessRevoked ? 'text-red-400 border-red-500/30' : 'text-emerald-400 border-emerald-500/30'}`}
                                >
                                  {item.bootcampAccessRevoked ? 'Revoked' : 'Allowed'}
                                </button>
                              </td>
                              <td className="px-4 py-3 text-xs text-text-secondary">{isUserBlocked(item) ? <span className="text-red-400">Blocked</span> : 'Active'}</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => void handleUserBlockToggle(item)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] rounded-xl border border-border hover:border-accent/30 hover:text-accent min-h-[32px] transition-colors"
                                  >
                                    {isUserBlocked(item) ? <><Unlock className="w-3 h-3" />Unblock</> : <><Ban className="w-3 h-3" />Block</>}
                                  </button>
                                  <button
                                    onClick={() => void handleDeleteUser(item)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 min-h-[32px] transition-colors"
                                  >
                                    <Trash2 className="w-3 h-3" />Delete
                                  </button>
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
                <BootcampAccessPanel addToast={addToast} api={api} />
              )}

              {/* ── APPLICATIONS ──────────────────────────────────────────── */}
              {activeTab === 'applications' && (
                <div className="space-y-4">
                  <div className="text-xs text-text-muted">{applications.length} application{applications.length !== 1 ? 's' : ''}</div>

                  {/* Mobile */}
                  <div className="md:hidden space-y-3">
                    {applications.length === 0 ? (
                      <div className="text-sm text-text-muted py-10 text-center">No applications yet.</div>
                    ) : applications.map(app => (
                      <div key={app.userId} className="bg-bg-card border border-border rounded-xl p-4 space-y-2">
                        <div className="font-bold text-sm text-text-primary">{app.hackerHandle || app.name || app.email}</div>
                        <div className="text-xs text-text-muted">{app.email}</div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mt-2">
                          {[
                            ['Bootcamp', app.application.bootcampTitle || app.bootcampId],
                            ['Level', app.application.level],
                            ['Commitment', app.application.commitment],
                            ['Phone', app.application.phone],
                          ].map(([k, v]) => v ? (
                            <div key={k}><span className="text-text-muted">{k}: </span><span className="text-text-primary">{v}</span></div>
                          ) : null)}
                        </div>
                        {app.application.motivation && (
                          <div className="text-xs text-text-muted mt-1 line-clamp-3">
                            <span className="text-text-muted">Why: </span>{app.application.motivation}
                          </div>
                        )}
                        {app.application.submittedAt && (
                          <div className="text-[10px] text-text-muted">{new Date(app.application.submittedAt).toLocaleString()}</div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Desktop */}
                  <div className="hidden md:block bg-bg-card border border-border rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left min-w-[900px]">
                        <thead className="border-b border-border bg-bg">
                          <tr>
                            {['Operator','Bootcamp','Why Joining','Level','Commitment','Phone','Date'].map(h => (
                              <th key={h} className="px-4 py-3 text-[10px] uppercase tracking-widest text-text-muted">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {applications.length === 0 ? (
                            <tr><td colSpan={7} className="px-4 py-10 text-center text-zinc-500 text-sm">No applications yet.</td></tr>
                          ) : applications.map(app => (
                            <tr key={app.userId} className="text-xs hover:bg-accent-dim/20 transition-colors">
                              <td className="px-4 py-3">
                                <div className="font-bold text-text-primary">{app.hackerHandle || app.name || '—'}</div>
                                <div className="text-text-muted">{app.email}</div>
                              </td>
                              <td className="px-4 py-3 text-text-secondary">{app.application.bootcampTitle || app.bootcampId || '—'}</td>
                              <td className="px-4 py-3 text-text-secondary max-w-[200px]">
                                <div className="line-clamp-2">{app.application.motivation || '—'}</div>
                              </td>
                              <td className="px-4 py-3 text-text-secondary">{app.application.level || '—'}</td>
                              <td className="px-4 py-3 text-text-secondary">{app.application.commitment || '—'}</td>
                              <td className="px-4 py-3 text-text-secondary font-mono">{app.application.phone || '—'}</td>
                              <td className="px-4 py-3 text-text-muted">{app.application.submittedAt ? new Date(app.application.submittedAt).toLocaleDateString() : '—'}</td>
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
                <div className="space-y-4">
                  {/* Form */}
                  <div className="bg-bg-card border border-border rounded-xl p-4 space-y-3">
                    <div className="text-xs font-bold uppercase text-text-muted tracking-widest">
                      {productForm.id ? 'Edit Product' : 'New Product'}
                    </div>
                    <input value={productForm.title} onChange={e => setProductForm(p => ({ ...p, title: e.target.value }))} placeholder="Title *" className={inp} />
                    <textarea value={productForm.description} onChange={e => setProductForm(p => ({ ...p, description: e.target.value }))} placeholder="Description" rows={3} className={`${inp} resize-y`} />
                    <div className="grid grid-cols-2 gap-3">
                      <input type="number" value={productForm.isFree ? 0 : productForm.cpPrice} onChange={e => setProductForm(p => ({ ...p, cpPrice: Number(e.target.value || 0) }))} placeholder="CP Price" disabled={productForm.isFree} className={`${inp} disabled:opacity-40`} />
                      <input type="number" value={productForm.sortOrder} onChange={e => setProductForm(p => ({ ...p, sortOrder: Number(e.target.value || 0) }))} placeholder="Sort order" className={inp} />
                    </div>
                    <input value={productForm.type} onChange={e => setProductForm(p => ({ ...p, type: e.target.value }))} placeholder="Type (book / tool / etc)" className={inp} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label className="space-y-1.5">
                        <span className="text-[10px] uppercase text-text-muted tracking-widest">Cover image</span>
                        <input type="file" accept="image/*" onChange={e => setCoverFile(e.target.files?.[0] || null)} className="block w-full text-xs text-text-secondary file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border file:border-border file:text-xs file:bg-bg-card file:text-text-primary" />
                      </label>
                      <label className="space-y-1.5">
                        <span className="text-[10px] uppercase text-text-muted tracking-widest">Product PDF *</span>
                        <input type="file" accept="application/pdf" onChange={e => setProductFile(e.target.files?.[0] || null)} className="block w-full text-xs text-text-secondary file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border file:border-border file:text-xs file:bg-bg-card file:text-text-primary" />
                      </label>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                        <input type="checkbox" checked={productForm.isActive} onChange={e => setProductForm(p => ({ ...p, isActive: e.target.checked }))} className="accent-accent w-4 h-4" /> Active
                      </label>
                      <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                        <input type="checkbox" checked={productForm.isFree} onChange={e => setProductForm(p => ({ ...p, isFree: e.target.checked, cpPrice: e.target.checked ? 0 : p.cpPrice }))} className="accent-accent w-4 h-4" /> Free
                      </label>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button onClick={() => void saveProduct()} className={`${btn} border-red-800/60 text-red-300 hover:bg-red-950/40`}>
                        {productForm.id ? 'Update' : 'Create'}
                      </button>
                      <button onClick={resetProductForm} className={`${btn} border-zinc-700 text-zinc-300 hover:bg-zinc-800`}>Clear</button>
                    </div>
                  </div>

                  {/* Product list — mobile */}
                  <div className="md:hidden space-y-3">
                    {products.map(item => (
                      <div key={item._id} className="bg-bg-card border border-border rounded-xl p-4 space-y-2">
                        <div className="font-bold text-sm text-text-primary">{item.title}</div>
                        <div className="text-xs text-text-muted flex items-center gap-2">
                          <span className="uppercase">{item.type}</span>
                          <span>·</span>
                          {item.isFree ? <span className="text-emerald-400">FREE</span> : <span className="inline-flex items-center gap-1">{item.cpPrice} <CpLogo className="w-3 h-3" /></span>}
                          <span>·</span>
                          <span>{item.isActive ? 'Active' : 'Inactive'}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            onClick={() => setProductForm({ id: item._id, title: item.title || '', description: item.description || '', cpPrice: Number(item.cpPrice || 0), type: item.type || 'book', sortOrder: Number(item.sortOrder || 0), productUrl: item.productUrl || '', isActive: item.isActive !== false, isFree: item.isFree === true })}
                            className={`${btn} border-border text-text-muted hover:border-accent/30 hover:text-accent`}
                          >Edit</button>
                          <button onClick={() => void deleteProduct(item._id)} className={`${btn} border-red-800/60 text-red-300`}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Product list — desktop */}
                  <div className="hidden md:block bg-bg-card border border-border rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left min-w-[640px]">
                        <thead className="border-b border-border bg-bg">
                          <tr>
                            {['Title','Price','Type','Status','Actions'].map(h => (
                              <th key={h} className={`px-4 py-3 text-[10px] uppercase tracking-widest text-text-muted ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {products.map(item => (
                            <tr key={item._id} className="hover:bg-accent-dim/20 transition-colors">
                              <td className="px-4 py-3 text-sm font-bold text-text-primary">{item.title}</td>
                              <td className="px-4 py-3 text-sm font-mono">{item.isFree ? <span className="text-emerald-400">FREE</span> : <span className="text-text-primary inline-flex items-center gap-1">{item.cpPrice} <CpLogo className="w-3.5 h-3.5" /></span>}</td>
                              <td className="px-4 py-3 text-xs uppercase text-text-secondary">{item.type}</td>
                              <td className="px-4 py-3 text-xs text-text-secondary">{item.isActive ? 'Active' : 'Inactive'}</td>
                              <td className="px-4 py-3 text-right">
                                <div className="inline-flex gap-2">
                                  <button
                                    onClick={() => setProductForm({ id: item._id, title: item.title || '', description: item.description || '', cpPrice: Number(item.cpPrice || 0), type: item.type || 'book', sortOrder: Number(item.sortOrder || 0), productUrl: item.productUrl || '', isActive: item.isActive !== false, isFree: item.isFree === true })}
                                    className="px-2.5 py-1.5 rounded-xl border border-border text-xs text-text-muted hover:border-accent/30 hover:text-accent min-h-[32px] transition-colors"
                                  >Edit</button>
                                  <button onClick={() => void deleteProduct(item._id)} className="px-2.5 py-1.5 rounded-xl border border-red-500/30 text-red-400 text-xs hover:bg-red-500/10 min-h-[32px] transition-colors">Delete</button>
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

              {/* ── POINTS ────────────────────────────────────────────────── */}
              {activeTab === 'cp' && (
                <div className="max-w-lg space-y-4">
                  <div className="bg-bg-card border border-border rounded-xl p-4 space-y-3">
                    <div className="text-xs font-bold uppercase text-text-muted tracking-widest">Points Control</div>
                    <div>
                      <label className="text-[10px] uppercase text-text-muted tracking-widest block mb-1.5">User</label>
                      <select value={cpUserId} onChange={e => setCpUserId(e.target.value)} className={inp}>
                        {users.map(u => (
                          <option key={u.id} value={u.id}>{u.hackerHandle || u.name || u.email}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {(['grant','deduct','set'] as const).map(a => (
                        <button key={a} onClick={() => setCpAction(a)} className={`${btn} ${cpAction === a ? 'border-accent/40 text-accent bg-accent-dim' : 'border-border text-text-muted'}`}>
                          {a}
                        </button>
                      ))}
                    </div>
                    <input type="number" value={cpValue} onChange={e => setCpValue(Number(e.target.value || 0))} placeholder={cpAction === 'set' ? 'Target value' : 'Points'} className={inp} />
                    <input value={cpReason} onChange={e => setCpReason(e.target.value)} placeholder="Reason (optional)" className={inp} />
                    <button onClick={() => void runCpAction()} className={`${btn} border-accent/40 text-accent hover:bg-accent-dim w-full`}>
                      Execute
                    </button>
                  </div>
                </div>
              )}

              {/* ── SECURITY ──────────────────────────────────────────────── */}
              {activeTab === 'security' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <StatCard label="Events 24h" value={Number(securitySummary?.events24h || 0)} />
                    <StatCard label="Unique IPs 24h" value={Number(securitySummary?.uniqueIps24h || 0)} />
                    <StatCard label="Auth Failures 24h" value={Number(securitySummary?.authFailures24h || 0)} />
                  </div>

                  {/* Mobile */}
                  <div className="md:hidden space-y-3">
                    {securityEvents.map(item => (
                      <div key={item.id} className="bg-bg-card border border-border rounded-xl p-4 space-y-1.5 text-xs">
                        <div className="text-text-muted">{item.createdAt ? new Date(item.createdAt).toLocaleString() : '—'}</div>
                        <div className="font-bold text-text-primary uppercase">{item.eventType}</div>
                        <div className="text-text-secondary">{item.action}</div>
                        <div className="font-mono text-text-muted break-all">{item.path || '—'}</div>
                        <div className="text-text-muted">HTTP {item.statusCode} · {item.ipAddress || '—'}</div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop */}
                  <div className="hidden md:block bg-bg-card border border-border rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left min-w-[860px]">
                        <thead className="border-b border-border bg-bg">
                          <tr>
                            {['Time','Type','Action','Path','Code','IP'].map(h => (
                              <th key={h} className="px-4 py-3 text-[10px] uppercase tracking-widest text-text-muted">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {securityEvents.map(item => (
                            <tr key={item.id} className="text-xs hover:bg-accent-dim/20 transition-colors">
                              <td className="px-4 py-3 text-text-muted whitespace-nowrap">{item.createdAt ? new Date(item.createdAt).toLocaleString() : '—'}</td>
                              <td className="px-4 py-3 uppercase text-text-primary">{item.eventType}</td>
                              <td className="px-4 py-3 text-text-secondary">{item.action}</td>
                              <td className="px-4 py-3 font-mono text-text-muted max-w-[200px] truncate">{item.path || '—'}</td>
                              <td className="px-4 py-3 text-text-secondary">{item.statusCode}</td>
                              <td className="px-4 py-3 font-mono text-text-secondary">{item.ipAddress || '—'}</td>
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
                <div className="space-y-4">
                  {/* Mobile */}
                  <div className="md:hidden space-y-3">
                    {contactMessages.length === 0 ? (
                      <div className="text-sm text-text-muted py-10 text-center">No messages yet.</div>
                    ) : contactMessages.map(item => (
                      <div key={item.id} className="bg-bg-card border border-border rounded-xl p-4 space-y-2">
                        <div>
                          <div className="font-bold text-sm text-text-primary">{item.name}</div>
                          <div className="text-xs text-text-muted">{item.email}</div>
                        </div>
                        {item.subject && <div className="text-xs font-bold text-text-primary">{item.subject}</div>}
                        <div className="text-xs text-text-muted line-clamp-4">{item.message}</div>
                        <div className="flex gap-2 pt-1">
                          <select
                            value={item.status}
                            onChange={e => void updateContactStatus(item.id, e.target.value as ContactMessage['status'])}
                            className="flex-1 bg-bg border border-border rounded-xl px-2 py-2.5 text-xs text-text-primary min-h-[44px]"
                          >
                            <option value="new">New</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="archived">Archived</option>
                          </select>
                          <button onClick={() => void deleteContactMessage(item.id)} className={`${btn} border-red-800/60 text-red-300`}>
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop */}
                  <div className="hidden md:block bg-bg-card border border-border rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left min-w-[900px]">
                        <thead className="border-b border-border bg-bg">
                          <tr>
                            {['From','Subject','Message','Status','Date',''].map((h,i) => (
                              <th key={i} className={`px-4 py-3 text-[10px] uppercase tracking-widest text-text-muted ${i === 5 ? 'text-right' : ''}`}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {contactMessages.length === 0 ? (
                            <tr><td colSpan={6} className="px-4 py-10 text-center text-zinc-500 text-sm">No messages yet.</td></tr>
                          ) : contactMessages.map(item => (
                            <tr key={item.id} className="align-top hover:bg-accent-dim/20 transition-colors">
                              <td className="px-4 py-3 text-sm">
                                <div className="font-bold text-text-primary">{item.name}</div>
                                <div className="text-[11px] text-text-muted">{item.email}</div>
                              </td>
                              <td className="px-4 py-3 text-xs text-text-secondary">{item.subject || '—'}</td>
                              <td className="px-4 py-3 text-xs text-text-secondary max-w-[300px]">
                                <div className="line-clamp-3">{item.message}</div>
                              </td>
                              <td className="px-4 py-3">
                                <select
                                  value={item.status}
                                  onChange={e => void updateContactStatus(item.id, e.target.value as ContactMessage['status'])}
                                  className="bg-bg border border-border rounded-xl px-2 py-1.5 text-xs text-text-primary min-h-[32px]"
                                >
                                  <option value="new">New</option>
                                  <option value="in_progress">In Progress</option>
                                  <option value="resolved">Resolved</option>
                                  <option value="archived">Archived</option>
                                </select>
                              </td>
                              <td className="px-4 py-3 text-[11px] text-text-muted whitespace-nowrap">{item.createdAt ? new Date(item.createdAt).toLocaleString() : '—'}</td>
                              <td className="px-4 py-3 text-right">
                                <button onClick={() => void deleteContactMessage(item.id)} className="px-2.5 py-1.5 rounded-xl border border-red-500/30 text-red-400 text-xs hover:bg-red-500/10 min-h-[32px] transition-colors">Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ── QUIZZES ───────────────────────────────────────────────── */}
              {activeTab === 'quizzes' && (
                <QuizManager bootcamps={bootcamps} addToast={addToast} api={api} />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
