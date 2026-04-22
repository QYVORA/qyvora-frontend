import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  LogOut,
  Shield,
  Users,
  Database,
  Coins,
  AlertTriangle,
  Mail,
  Save,
  Plus,
  Trash2,
  Ban,
  Unlock,
  Search,
} from 'lucide-react';
import { useAuth } from '../../../core/contexts/AuthContext';
import { useToast } from '../../../core/contexts/ToastContext';
import Logo from '../../../shared/components/brand/Logo';
import api from '../../../core/services/api';

type AdminTab = 'users' | 'bootcamps' | 'zero_day' | 'cp' | 'security' | 'contacts';

type AdminUser = {
  id: string;
  name: string;
  hackerHandle: string;
  email: string;
  role: string;
  cpPoints: number;
  bootcampAccessRevoked: boolean;
  blockedUntil?: string | null;
  createdAt?: string;
};

type Bootcamp = {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  priceLabel: string;
  image: string;
  isActive: boolean;
  sortOrder: number;
  modules: unknown[];
};

type CPProduct = {
  _id: string;
  title: string;
  description: string;
  cpPrice: number;
  coverUrl: string;
  productUrl: string;
  fileName: string;
  fileId?: string;
  fileSize?: number;
  fileMime?: string;
  type: string;
  isActive: boolean;
  sortOrder: number;
};

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved' | 'archived';
  createdAt?: string;
};

type SecurityEventItem = {
  id: string;
  createdAt: string;
  eventType: string;
  action: string;
  path: string;
  statusCode: number;
  ipAddress: string;
};

const emptyBootcamp = (): Bootcamp => ({
  id: `bootcamp-${Date.now()}`,
  title: 'New Bootcamp',
  description: '',
  level: '',
  duration: '',
  priceLabel: '',
  image: '',
  isActive: true,
  sortOrder: 0,
  modules: [],
});

const isUserBlocked = (user: AdminUser) =>
  Boolean(user.blockedUntil && new Date(user.blockedUntil).getTime() > Date.now());

const AdminDashboardPage: React.FC = () => {
  const { logout, user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [overview, setOverview] = useState<Record<string, unknown> | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [userQuery, setUserQuery] = useState('');

  const [contentVersion, setContentVersion] = useState(1);
  const [bootcamps, setBootcamps] = useState<Bootcamp[]>([]);
  const [selectedBootcampId, setSelectedBootcampId] = useState<string>('');
  const [modulesText, setModulesText] = useState('[]');

  const [products, setProducts] = useState<CPProduct[]>([]);
  const [productForm, setProductForm] = useState({
    id: '',
    title: '',
    description: '',
    cpPrice: 0,
    type: 'book',
    sortOrder: 0,
    productUrl: '',
    isActive: true,
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

  const selectedBootcamp = useMemo(
    () => bootcamps.find((b) => b.id === selectedBootcampId) || null,
    [bootcamps, selectedBootcampId]
  );

  const filteredUsers = useMemo(() => {
    const q = userQuery.trim().toLowerCase();
    if (!q) return users;
    return users.filter((item) => {
      const joined = `${item.name} ${item.hackerHandle} ${item.email} ${item.role}`.toLowerCase();
      return joined.includes(q);
    });
  }, [users, userQuery]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [overviewRes, usersRes, contentRes, productsRes, summaryRes, eventsRes, contactsRes] = await Promise.all([
        api.get('/admin/overview').catch(() => null),
        api.get('/admin/users').catch(() => null),
        api.get('/admin/content').catch(() => null),
        api.get('/admin/cp-products').catch(() => null),
        api.get('/admin/security/summary').catch(() => null),
        api.get('/admin/security/events?limit=50').catch(() => null),
        api.get('/admin/contact-messages?limit=50').catch(() => null),
      ]);

      setOverview((overviewRes?.data as Record<string, unknown>) || null);

      const userItems = Array.isArray(usersRes?.data) ? (usersRes?.data as AdminUser[]) : [];
      setUsers(userItems);

      const contentData = (contentRes?.data as { version?: number; learn?: { bootcamps?: Bootcamp[] } }) || {};
      setContentVersion(Number(contentData.version || 1));
      const contentBootcamps = Array.isArray(contentData.learn?.bootcamps) ? contentData.learn?.bootcamps : [];
      setBootcamps(contentBootcamps);
      if (contentBootcamps[0]?.id) {
        setSelectedBootcampId((prev) => prev || String(contentBootcamps[0].id));
      }

      const productItems = Array.isArray(productsRes?.data?.items)
        ? (productsRes?.data.items as CPProduct[])
        : [];
      setProducts(productItems);

      setSecuritySummary((summaryRes?.data as Record<string, unknown>) || null);
      setSecurityEvents(Array.isArray(eventsRes?.data?.items) ? (eventsRes?.data.items as SecurityEventItem[]) : []);

      setContactMessages(
        Array.isArray(contactsRes?.data?.items) ? (contactsRes?.data.items as ContactMessage[]) : []
      );

      if (userItems.length && !cpUserId) setCpUserId(userItems[0].id);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAll();
  }, []);

  useEffect(() => {
    if (!selectedBootcamp) {
      setModulesText('[]');
      return;
    }
    setModulesText(JSON.stringify(selectedBootcamp.modules || [], null, 2));
  }, [selectedBootcamp]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const patchUser = async (id: string, payload: Record<string, unknown>, successMessage: string) => {
    try {
      await api.patch(`/admin/users/${encodeURIComponent(id)}`, payload);
      addToast(successMessage, 'success');
      await loadAll();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Update failed';
      addToast(String(message), 'error');
    }
  };

  const handleUserBlockToggle = async (target: AdminUser) => {
    try {
      await api.patch(`/admin/users/${encodeURIComponent(target.id)}/block`, {
        blocked: !isUserBlocked(target),
      });
      addToast(!isUserBlocked(target) ? 'User blocked' : 'User unblocked', 'success');
      await loadAll();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Block action failed';
      addToast(String(message), 'error');
    }
  };

  const handleDeleteUser = async (target: AdminUser) => {
    const ok = window.confirm(`Delete user ${target.email}? This cannot be undone.`);
    if (!ok) return;
    try {
      await api.delete(`/admin/users/${encodeURIComponent(target.id)}`);
      addToast('User deleted', 'success');
      await loadAll();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Delete failed';
      addToast(String(message), 'error');
    }
  };

  const applyBootcampDraft = (next: Bootcamp) => {
    setBootcamps((prev) => prev.map((item) => (item.id === next.id ? next : item)));
  };

  const saveBootcamps = async () => {
    setSaving(true);
    try {
      await api.patch('/admin/content', {
        version: contentVersion,
        learn: {
          bootcamps,
        },
      });
      addToast('Bootcamps updated', 'success');
      await loadAll();
    } catch (err: unknown) {
      const code = (err as { response?: { data?: { code?: string; error?: string } } })?.response?.data?.code;
      if (code === 'content_version_conflict') {
        addToast('Version conflict detected, reloading latest content.', 'error');
        await loadAll();
      } else {
        const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to save bootcamps';
        addToast(String(message), 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  const uploadCoverFile = async (): Promise<string> => {
    if (!coverFile) return '';
    const formData = new FormData();
    formData.append('file', coverFile);
    const res = await api.post('/admin/uploads/cp-product-images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return String(res.data?.relativeUrl || res.data?.url || '');
  };

  const uploadProductFile = async (): Promise<{ fileId: string; fileName: string; fileSize: number; fileMime: string } | null> => {
    if (!productFile) return null;
    const formData = new FormData();
    formData.append('file', productFile);
    const res = await api.post('/admin/uploads/cp-products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return {
      fileId: String(res.data?.fileId || ''),
      fileName: String(res.data?.originalName || ''),
      fileSize: Number(res.data?.size || 0),
      fileMime: String(res.data?.mime || ''),
    };
  };

  const resetProductForm = () => {
    setProductForm({
      id: '',
      title: '',
      description: '',
      cpPrice: 0,
      type: 'book',
      sortOrder: 0,
      productUrl: '',
      isActive: true,
    });
    setCoverFile(null);
    setProductFile(null);
  };

  const saveProduct = async () => {
    try {
      const coverUrl = await uploadCoverFile();
      const fileMeta = await uploadProductFile();

      if (!productForm.id && !fileMeta) {
        addToast('Product PDF file is required for new products.', 'error');
        return;
      }

      const payload: Record<string, unknown> = {
        title: productForm.title,
        description: productForm.description,
        cpPrice: Number(productForm.cpPrice || 0),
        type: productForm.type,
        sortOrder: Number(productForm.sortOrder || 0),
        productUrl: productForm.productUrl,
        isActive: productForm.isActive,
      };
      if (coverUrl) payload.coverUrl = coverUrl;
      if (fileMeta) {
        payload.fileId = fileMeta.fileId;
        payload.fileName = fileMeta.fileName;
        payload.fileSize = fileMeta.fileSize;
        payload.fileMime = fileMeta.fileMime;
      }

      if (productForm.id) {
        await api.patch(`/admin/cp-products/${encodeURIComponent(productForm.id)}`, payload);
        addToast('Product updated', 'success');
      } else {
        await api.post('/admin/cp-products', payload);
        addToast('Product created', 'success');
      }
      resetProductForm();
      await loadAll();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to save product';
      addToast(String(message), 'error');
    }
  };

  const deleteProduct = async (id: string) => {
    const ok = window.confirm('Delete this product?');
    if (!ok) return;
    try {
      await api.delete(`/admin/cp-products/${encodeURIComponent(id)}`);
      addToast('Product deleted', 'success');
      await loadAll();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to delete product';
      addToast(String(message), 'error');
    }
  };

  const runCpAction = async () => {
    if (!cpUserId) {
      addToast('Select a user first.', 'error');
      return;
    }
    if (cpAction !== 'set' && cpValue <= 0) {
      addToast('Points must be greater than zero.', 'error');
      return;
    }
    if (cpAction === 'set' && cpValue < 0) {
      addToast('Set value cannot be negative.', 'error');
      return;
    }

    try {
      if (cpAction === 'grant') {
        await api.post('/admin/cp/grant', { userIds: [cpUserId], points: cpValue, reason: cpReason });
      } else if (cpAction === 'deduct') {
        await api.post('/admin/cp/deduct', { userIds: [cpUserId], points: cpValue, reason: cpReason });
      } else {
        await api.post('/admin/cp/set', { userIds: [cpUserId], value: cpValue, reason: cpReason });
      }
      addToast('CP operation completed', 'success');
      await loadAll();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'CP operation failed';
      addToast(String(message), 'error');
    }
  };

  const updateContactStatus = async (id: string, status: ContactMessage['status']) => {
    try {
      await api.patch(`/admin/contact-messages/${encodeURIComponent(id)}`, { status });
      addToast('Contact message updated', 'success');
      await loadAll();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to update message';
      addToast(String(message), 'error');
    }
  };

  const deleteContactMessage = async (id: string) => {
    const ok = window.confirm('Delete this contact message?');
    if (!ok) return;
    try {
      await api.delete(`/admin/contact-messages/${encodeURIComponent(id)}`);
      addToast('Message deleted', 'success');
      await loadAll();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to delete message';
      addToast(String(message), 'error');
    }
  };

  const tabs: Array<{ id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'bootcamps', label: 'Bootcamp Management', icon: Shield },
    { id: 'zero_day', label: 'Zero-Day Market', icon: Database },
    { id: 'cp', label: 'CP Management', icon: Coins },
    { id: 'security', label: 'Security Management', icon: AlertTriangle },
    { id: 'contacts', label: 'Contact Messages', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-bg flex flex-col md:flex-row">
      <aside className="w-full md:w-72 border-r border-border bg-bg-card p-6 flex flex-col">
        <div className="mb-8">
          <Link to="/"><Logo size="md" className="mb-2" /></Link>
          <div className="text-[10px] font-bold text-accent font-mono tracking-[0.2em]">ADMIN_CONSOLE // LIVE</div>
        </div>

        <div className="space-y-2 flex-1">
          <Link to="/dashboard" className="w-full flex items-center gap-2 px-3 py-2 rounded border border-border text-xs font-bold uppercase text-text-muted hover:text-accent hover:border-accent/40 transition-colors">
            <LayoutDashboard className="w-4 h-4" /> Operator View
          </Link>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === tab.id
                  ? 'bg-accent-dim text-accent border border-accent/30'
                  : 'text-text-muted border border-transparent hover:border-border hover:text-text-primary'
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        <div className="pt-6 mt-6 border-t border-border">
          <div className="text-xs text-text-muted mb-3">Signed in as <span className="text-text-primary font-bold">{user?.email || user?.username || 'admin'}</span></div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-red-400 border border-red-400/30 rounded hover:bg-red-400/10 transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-black text-text-primary uppercase tracking-tight">{tabs.find((t) => t.id === activeTab)?.label}</h1>
          <button onClick={() => void loadAll()} className="btn-secondary text-xs !py-2 !px-4">Refresh</button>
        </div>

        {loading ? (
          <div className="text-sm text-text-muted">Loading admin data...</div>
        ) : (
          <>
            {activeTab === 'users' && (
              <section className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-bg-card border border-border rounded p-4">
                    <div className="text-[10px] uppercase text-text-muted">Total Users</div>
                    <div className="text-lg font-black text-text-primary">{Number((overview?.users as { total?: number })?.total || 0)}</div>
                  </div>
                  <div className="bg-bg-card border border-border rounded p-4">
                    <div className="text-[10px] uppercase text-text-muted">Active 24h</div>
                    <div className="text-lg font-black text-text-primary">{Number((overview?.users as { active24h?: number })?.active24h || 0)}</div>
                  </div>
                  <div className="bg-bg-card border border-border rounded p-4">
                    <div className="text-[10px] uppercase text-text-muted">Admins</div>
                    <div className="text-lg font-black text-text-primary">{users.filter((u) => u.role === 'admin').length}</div>
                  </div>
                </div>

                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    placeholder="Search users"
                    className="w-full bg-bg-card border border-border rounded pl-10 pr-3 py-2 text-sm"
                  />
                </div>

                <div className="bg-bg-card border border-border rounded overflow-auto">
                  <table className="w-full text-left min-w-[900px]">
                    <thead className="border-b border-border bg-bg">
                      <tr>
                        <th className="px-4 py-3 text-[10px] uppercase text-text-muted">User</th>
                        <th className="px-4 py-3 text-[10px] uppercase text-text-muted">Role</th>
                        <th className="px-4 py-3 text-[10px] uppercase text-text-muted">CP</th>
                        <th className="px-4 py-3 text-[10px] uppercase text-text-muted">Bootcamp Access</th>
                        <th className="px-4 py-3 text-[10px] uppercase text-text-muted">Account</th>
                        <th className="px-4 py-3 text-[10px] uppercase text-text-muted text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((item) => (
                        <tr key={item.id} className="border-b border-border/70">
                          <td className="px-4 py-3">
                            <div className="font-bold text-sm">{item.hackerHandle || item.name || item.email}</div>
                            <div className="text-[11px] text-text-muted">{item.email}</div>
                          </td>
                          <td className="px-4 py-3 text-xs uppercase">{item.role}</td>
                          <td className="px-4 py-3 text-sm font-mono">{Number(item.cpPoints || 0).toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => void patchUser(item.id, { bootcampAccessRevoked: !item.bootcampAccessRevoked }, item.bootcampAccessRevoked ? 'Bootcamp access restored' : 'Bootcamp access revoked')}
                              className={`text-[11px] px-2 py-1 rounded border ${item.bootcampAccessRevoked ? 'text-red-300 border-red-400/30' : 'text-green-300 border-green-400/30'}`}
                            >
                              {item.bootcampAccessRevoked ? 'Revoked' : 'Allowed'}
                            </button>
                          </td>
                          <td className="px-4 py-3 text-[11px]">
                            {isUserBlocked(item) ? (
                              <span className="text-red-300">Blocked</span>
                            ) : (
                              <span className="text-green-300">Active</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => void handleUserBlockToggle(item)}
                                className="px-2 py-1 text-[11px] rounded border border-border hover:border-accent/40"
                              >
                                {isUserBlocked(item) ? <span className="inline-flex items-center gap-1"><Unlock className="w-3 h-3" />Unblock</span> : <span className="inline-flex items-center gap-1"><Ban className="w-3 h-3" />Block</span>}
                              </button>
                              <button
                                onClick={() => void handleDeleteUser(item)}
                                className="px-2 py-1 text-[11px] rounded border border-red-400/30 text-red-300 hover:bg-red-400/10"
                              >
                                <span className="inline-flex items-center gap-1"><Trash2 className="w-3 h-3" />Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {activeTab === 'bootcamps' && (
              <section className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      const next = emptyBootcamp();
                      setBootcamps((prev) => [...prev, next]);
                      setSelectedBootcampId(next.id);
                    }}
                    className="btn-secondary text-xs !py-2 !px-4 inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Bootcamp
                  </button>
                  <button
                    onClick={() => void saveBootcamps()}
                    disabled={saving}
                    className="btn-primary text-xs !py-2 !px-4 inline-flex items-center gap-2 disabled:opacity-60"
                  >
                    <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Bootcamp Content'}
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="bg-bg-card border border-border rounded p-3 space-y-2 max-h-[560px] overflow-auto">
                    {bootcamps.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedBootcampId(item.id)}
                        className={`w-full text-left p-3 rounded border transition-colors ${selectedBootcampId === item.id ? 'border-accent/40 bg-accent-dim/20' : 'border-border hover:border-accent/20'}`}
                      >
                        <div className="text-xs font-bold uppercase text-text-primary">{item.title || 'Untitled bootcamp'}</div>
                        <div className="text-[11px] text-text-muted">ID: {item.id}</div>
                      </button>
                    ))}
                  </div>

                  <div className="lg:col-span-2 bg-bg-card border border-border rounded p-4 space-y-3">
                    {selectedBootcamp ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input value={selectedBootcamp.id} onChange={(e) => applyBootcampDraft({ ...selectedBootcamp, id: e.target.value })} className="bg-bg border border-border rounded px-3 py-2 text-sm" placeholder="Bootcamp ID" />
                          <input value={selectedBootcamp.title} onChange={(e) => applyBootcampDraft({ ...selectedBootcamp, title: e.target.value })} className="bg-bg border border-border rounded px-3 py-2 text-sm" placeholder="Title" />
                          <input value={selectedBootcamp.level} onChange={(e) => applyBootcampDraft({ ...selectedBootcamp, level: e.target.value })} className="bg-bg border border-border rounded px-3 py-2 text-sm" placeholder="Level" />
                          <input value={selectedBootcamp.duration} onChange={(e) => applyBootcampDraft({ ...selectedBootcamp, duration: e.target.value })} className="bg-bg border border-border rounded px-3 py-2 text-sm" placeholder="Duration" />
                          <input value={selectedBootcamp.priceLabel} onChange={(e) => applyBootcampDraft({ ...selectedBootcamp, priceLabel: e.target.value })} className="bg-bg border border-border rounded px-3 py-2 text-sm" placeholder="Price label" />
                          <input value={selectedBootcamp.image} onChange={(e) => applyBootcampDraft({ ...selectedBootcamp, image: e.target.value })} className="bg-bg border border-border rounded px-3 py-2 text-sm" placeholder="Image URL" />
                        </div>
                        <textarea value={selectedBootcamp.description} onChange={(e) => applyBootcampDraft({ ...selectedBootcamp, description: e.target.value })} className="w-full min-h-[90px] bg-bg border border-border rounded px-3 py-2 text-sm" placeholder="Description" />

                        <div>
                          <div className="text-[11px] font-bold uppercase text-text-muted mb-1">Modules JSON (sections/rooms/videos metadata)</div>
                          <textarea
                            value={modulesText}
                            onChange={(e) => setModulesText(e.target.value)}
                            className="w-full min-h-[180px] bg-bg border border-border rounded px-3 py-2 text-xs font-mono"
                          />
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => {
                                try {
                                  const parsed = JSON.parse(modulesText) as unknown[];
                                  applyBootcampDraft({ ...selectedBootcamp, modules: Array.isArray(parsed) ? parsed : [] });
                                  addToast('Modules JSON applied', 'success');
                                } catch {
                                  addToast('Invalid JSON in modules field', 'error');
                                }
                              }}
                              className="btn-secondary text-xs !py-2 !px-4"
                            >
                              Apply Modules JSON
                            </button>
                            <label className="text-xs inline-flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={selectedBootcamp.isActive}
                                onChange={(e) => applyBootcampDraft({ ...selectedBootcamp, isActive: e.target.checked })}
                              />
                              Active
                            </label>
                            <button
                              onClick={() => {
                                const ok = window.confirm('Remove this bootcamp from content?');
                                if (!ok) return;
                                setBootcamps((prev) => prev.filter((item) => item.id !== selectedBootcamp.id));
                                setSelectedBootcampId('');
                              }}
                              className="ml-auto px-3 py-2 rounded border border-red-400/30 text-red-300 text-xs hover:bg-red-400/10"
                            >
                              Delete Bootcamp
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-sm text-text-muted">Select a bootcamp to edit.</div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'zero_day' && (
              <section className="space-y-4">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  <div className="bg-bg-card border border-border rounded p-4 space-y-3">
                    <div className="text-xs font-bold uppercase text-text-muted">Create / Edit Product</div>
                    <input value={productForm.title} onChange={(e) => setProductForm((p) => ({ ...p, title: e.target.value }))} placeholder="Title" className="w-full bg-bg border border-border rounded px-3 py-2 text-sm" />
                    <textarea value={productForm.description} onChange={(e) => setProductForm((p) => ({ ...p, description: e.target.value }))} placeholder="Description" className="w-full min-h-[90px] bg-bg border border-border rounded px-3 py-2 text-sm" />
                    <div className="grid grid-cols-2 gap-2">
                      <input type="number" value={productForm.cpPrice} onChange={(e) => setProductForm((p) => ({ ...p, cpPrice: Number(e.target.value || 0) }))} placeholder="CP price" className="bg-bg border border-border rounded px-3 py-2 text-sm" />
                      <input type="number" value={productForm.sortOrder} onChange={(e) => setProductForm((p) => ({ ...p, sortOrder: Number(e.target.value || 0) }))} placeholder="Sort order" className="bg-bg border border-border rounded px-3 py-2 text-sm" />
                    </div>
                    <input value={productForm.type} onChange={(e) => setProductForm((p) => ({ ...p, type: e.target.value }))} placeholder="Type (book/tool/etc)" className="w-full bg-bg border border-border rounded px-3 py-2 text-sm" />
                    <input value={productForm.productUrl} onChange={(e) => setProductForm((p) => ({ ...p, productUrl: e.target.value }))} placeholder="Optional external product URL" className="w-full bg-bg border border-border rounded px-3 py-2 text-sm" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <label className="space-y-1">
                        <span className="text-text-muted uppercase">Cover image</span>
                        <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} className="block w-full" />
                      </label>
                      <label className="space-y-1">
                        <span className="text-text-muted uppercase">Product PDF</span>
                        <input type="file" accept="application/pdf" onChange={(e) => setProductFile(e.target.files?.[0] || null)} className="block w-full" />
                      </label>
                    </div>
                    <label className="text-xs inline-flex items-center gap-2">
                      <input type="checkbox" checked={productForm.isActive} onChange={(e) => setProductForm((p) => ({ ...p, isActive: e.target.checked }))} /> Active
                    </label>
                    <div className="flex items-center gap-2">
                      <button onClick={() => void saveProduct()} className="btn-primary text-xs !py-2 !px-4">{productForm.id ? 'Update Product' : 'Create Product'}</button>
                      <button onClick={resetProductForm} className="btn-secondary text-xs !py-2 !px-4">Clear</button>
                    </div>
                  </div>

                  <div className="bg-bg-card border border-border rounded overflow-auto max-h-[620px]">
                    <table className="w-full text-left min-w-[700px]">
                      <thead className="border-b border-border bg-bg">
                        <tr>
                          <th className="px-4 py-3 text-[10px] uppercase text-text-muted">Title</th>
                          <th className="px-4 py-3 text-[10px] uppercase text-text-muted">Price</th>
                          <th className="px-4 py-3 text-[10px] uppercase text-text-muted">Type</th>
                          <th className="px-4 py-3 text-[10px] uppercase text-text-muted">Status</th>
                          <th className="px-4 py-3 text-[10px] uppercase text-text-muted text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((item) => (
                          <tr key={item._id} className="border-b border-border/70">
                            <td className="px-4 py-3 text-sm font-bold">{item.title}</td>
                            <td className="px-4 py-3 text-sm font-mono">{item.cpPrice}</td>
                            <td className="px-4 py-3 text-xs uppercase">{item.type}</td>
                            <td className="px-4 py-3 text-xs">{item.isActive ? 'Active' : 'Inactive'}</td>
                            <td className="px-4 py-3 text-right">
                              <div className="inline-flex gap-2">
                                <button
                                  onClick={() => {
                                    setProductForm({
                                      id: item._id,
                                      title: item.title || '',
                                      description: item.description || '',
                                      cpPrice: Number(item.cpPrice || 0),
                                      type: item.type || 'book',
                                      sortOrder: Number(item.sortOrder || 0),
                                      productUrl: item.productUrl || '',
                                      isActive: item.isActive !== false,
                                    });
                                  }}
                                  className="px-2 py-1 rounded border border-border text-xs"
                                >
                                  Edit
                                </button>
                                <button onClick={() => void deleteProduct(item._id)} className="px-2 py-1 rounded border border-red-400/30 text-red-300 text-xs">Delete</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'cp' && (
              <section className="space-y-4 max-w-2xl">
                <div className="bg-bg-card border border-border rounded p-4 space-y-3">
                  <div className="text-xs font-bold uppercase text-text-muted">Cyber Points Control</div>
                  <select value={cpUserId} onChange={(e) => setCpUserId(e.target.value)} className="w-full bg-bg border border-border rounded px-3 py-2 text-sm">
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>{u.hackerHandle || u.name || u.email} ({u.email})</option>
                    ))}
                  </select>
                  <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => setCpAction('grant')} className={`px-3 py-2 rounded border text-xs ${cpAction === 'grant' ? 'border-accent/50 text-accent' : 'border-border'}`}>Grant</button>
                    <button onClick={() => setCpAction('deduct')} className={`px-3 py-2 rounded border text-xs ${cpAction === 'deduct' ? 'border-accent/50 text-accent' : 'border-border'}`}>Deduct</button>
                    <button onClick={() => setCpAction('set')} className={`px-3 py-2 rounded border text-xs ${cpAction === 'set' ? 'border-accent/50 text-accent' : 'border-border'}`}>Set</button>
                  </div>
                  <input type="number" value={cpValue} onChange={(e) => setCpValue(Number(e.target.value || 0))} className="w-full bg-bg border border-border rounded px-3 py-2 text-sm" placeholder={cpAction === 'set' ? 'Target CP value' : 'Points'} />
                  <input value={cpReason} onChange={(e) => setCpReason(e.target.value)} className="w-full bg-bg border border-border rounded px-3 py-2 text-sm" placeholder="Reason (optional)" />
                  <button onClick={() => void runCpAction()} className="btn-primary text-xs !py-2 !px-4">Execute CP Action</button>
                </div>
              </section>
            )}

            {activeTab === 'security' && (
              <section className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-bg-card border border-border rounded p-4">
                    <div className="text-[10px] uppercase text-text-muted">Events 24h</div>
                    <div className="text-lg font-black">{Number(securitySummary?.events24h || 0)}</div>
                  </div>
                  <div className="bg-bg-card border border-border rounded p-4">
                    <div className="text-[10px] uppercase text-text-muted">Unique IPs 24h</div>
                    <div className="text-lg font-black">{Number(securitySummary?.uniqueIps24h || 0)}</div>
                  </div>
                  <div className="bg-bg-card border border-border rounded p-4">
                    <div className="text-[10px] uppercase text-text-muted">Auth Failures 24h</div>
                    <div className="text-lg font-black">{Number(securitySummary?.authFailures24h || 0)}</div>
                  </div>
                </div>

                <div className="bg-bg-card border border-border rounded overflow-auto">
                  <table className="w-full text-left min-w-[900px]">
                    <thead className="border-b border-border bg-bg">
                      <tr>
                        <th className="px-4 py-3 text-[10px] uppercase text-text-muted">Time</th>
                        <th className="px-4 py-3 text-[10px] uppercase text-text-muted">Type</th>
                        <th className="px-4 py-3 text-[10px] uppercase text-text-muted">Action</th>
                        <th className="px-4 py-3 text-[10px] uppercase text-text-muted">Path</th>
                        <th className="px-4 py-3 text-[10px] uppercase text-text-muted">Code</th>
                        <th className="px-4 py-3 text-[10px] uppercase text-text-muted">IP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {securityEvents.map((item) => (
                        <tr key={item.id} className="border-b border-border/70 text-xs">
                          <td className="px-4 py-3">{item.createdAt ? new Date(item.createdAt).toLocaleString() : '-'}</td>
                          <td className="px-4 py-3 uppercase">{item.eventType}</td>
                          <td className="px-4 py-3">{item.action}</td>
                          <td className="px-4 py-3 font-mono">{item.path || '-'}</td>
                          <td className="px-4 py-3">{item.statusCode}</td>
                          <td className="px-4 py-3 font-mono">{item.ipAddress || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {activeTab === 'contacts' && (
              <section className="space-y-4">
                <div className="bg-bg-card border border-border rounded overflow-auto">
                  <table className="w-full text-left min-w-[980px]">
                    <thead className="border-b border-border bg-bg">
                      <tr>
                        <th className="px-4 py-3 text-[10px] uppercase text-text-muted">From</th>
                        <th className="px-4 py-3 text-[10px] uppercase text-text-muted">Subject</th>
                        <th className="px-4 py-3 text-[10px] uppercase text-text-muted">Message</th>
                        <th className="px-4 py-3 text-[10px] uppercase text-text-muted">Status</th>
                        <th className="px-4 py-3 text-[10px] uppercase text-text-muted">Date</th>
                        <th className="px-4 py-3 text-[10px] uppercase text-text-muted text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contactMessages.map((item) => (
                        <tr key={item.id} className="border-b border-border/70 align-top">
                          <td className="px-4 py-3 text-sm">
                            <div className="font-bold">{item.name}</div>
                            <div className="text-[11px] text-text-muted">{item.email}</div>
                          </td>
                          <td className="px-4 py-3 text-xs">{item.subject || '-'}</td>
                          <td className="px-4 py-3 text-xs max-w-[360px] whitespace-pre-wrap">{item.message}</td>
                          <td className="px-4 py-3">
                            <select
                              value={item.status}
                              onChange={(e) => void updateContactStatus(item.id, e.target.value as ContactMessage['status'])}
                              className="bg-bg border border-border rounded px-2 py-1 text-xs"
                            >
                              <option value="new">new</option>
                              <option value="in_progress">in_progress</option>
                              <option value="resolved">resolved</option>
                              <option value="archived">archived</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 text-[11px] text-text-muted">{item.createdAt ? new Date(item.createdAt).toLocaleString() : '-'}</td>
                          <td className="px-4 py-3 text-right">
                            <button onClick={() => void deleteContactMessage(item.id)} className="px-2 py-1 rounded border border-red-400/30 text-red-300 text-xs">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboardPage;
