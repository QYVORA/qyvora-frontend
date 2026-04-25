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
  Ban,
  Unlock,
  Search,
  Menu,
  X,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import BootcampManager from '../components/BootcampManager';
import { useAuth } from '../../../core/contexts/AuthContext';
import { useToast } from '../../../core/contexts/ToastContext';
import Logo from '../../../shared/components/brand/Logo';
import CpLogo from '../../../shared/components/CpLogo';
import api from '../../../core/services/api';

type AdminTab = 'users' | 'bootcamps' | 'zero_day' | 'cp' | 'security' | 'contacts' | 'applications';

type AdminUser = {
  id: string;
  name: string;
  hackerHandle: string;
  email: string;
  role: string;
  cpPoints: number;
  bootcampAccessRevoked: boolean;
  blockedUntil?: string | null;
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
  modules: any[];
};

type CPProduct = {
  _id: string;
  title: string;
  description: string;
  cpPrice: number;
  coverUrl: string;
  productUrl: string;
  type: string;
  isActive: boolean;
  isFree: boolean;
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

const isUserBlocked = (user: AdminUser) =>
  Boolean(user.blockedUntil && new Date(user.blockedUntil).getTime() > Date.now());

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
    id: '',
    title: '',
    description: '',
    cpPrice: 0,
    type: 'book',
    sortOrder: 0,
    productUrl: '',
    isActive: true,
    isFree: false,
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

  const filteredUsers = useMemo(() => {
    const q = userQuery.trim().toLowerCase();
    if (!q) return users;
    return users.filter((item) => {
      const joined = `${item.name} ${item.hackerHandle} ${item.email} ${item.role}`.toLowerCase();
      return joined.includes(q);
    });
  }, [users, userQuery]);

  const totalUserPages = useMemo(
    () => Math.max(1, Math.ceil(filteredUsers.length / Math.max(1, userPageSize))),
    [filteredUsers.length, userPageSize]
  );

  const paginatedUsers = useMemo(() => {
    const page = Math.min(Math.max(1, userPage), totalUserPages);
    const start = (page - 1) * userPageSize;
    return filteredUsers.slice(start, start + userPageSize);
  }, [filteredUsers, userPage, userPageSize, totalUserPages]);

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

      const appsRes = await api.get('/admin/bootcamp-applications').catch(() => null);
      setApplications(Array.isArray(appsRes?.data?.items) ? appsRes.data.items : []);

      if (userItems.length && !cpUserId) setCpUserId(userItems[0].id);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAll();
  }, []);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [activeTab]);

  useEffect(() => {
    if (!mobileNavOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileNavOpen]);

  useEffect(() => {
    setUserPage(1);
  }, [userQuery, users.length, userPageSize]);

  const handleLogout = async () => {
    await logout();
    navigate('/mr-robot');
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
      isFree: false,
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
        cpPrice: productForm.isFree ? 0 : Number(productForm.cpPrice || 0),
        type: productForm.type,
        sortOrder: Number(productForm.sortOrder || 0),
        productUrl: productForm.productUrl,
        isActive: productForm.isActive,
        isFree: productForm.isFree,
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
      addToast('Points operation completed', 'success');
      await loadAll();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Points operation failed';
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

  const tabs: Array<{ id: AdminTab; label: string; short: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'users', label: 'User Management', short: 'Users', icon: Users },
    { id: 'bootcamps', label: 'Bootcamp Management', short: 'Bootcamps', icon: Shield },
    { id: 'applications', label: 'Enrollment Applications', short: 'Applications', icon: Users },
    { id: 'zero_day', label: 'Zero-Day Market', short: 'Market', icon: Database },
    { id: 'cp', label: 'Points Management', short: 'Points', icon: Coins },
    { id: 'security', label: 'Security Management', short: 'Security', icon: AlertTriangle },
    { id: 'contacts', label: 'Contact Messages', short: 'Contacts', icon: Mail },
  ];

  return (
    <div className="h-screen bg-black text-zinc-100 flex overflow-hidden">
      <aside className="hidden md:flex md:w-72 h-screen sticky top-0 border-r border-zinc-800 bg-zinc-950 p-6 flex-col">
        <div className="mb-8">
          <Link to="/"><Logo size="md" className="mb-2" /></Link>
          <div className="text-[10px] font-bold text-zinc-500 font-mono tracking-[0.2em]">ADMIN_CONSOLE // BLACK</div>
        </div>

        <div className="space-y-2 flex-1">
          <Link to="/dashboard" className="w-full flex items-center gap-2 px-3 py-2 rounded border border-zinc-800 text-xs font-bold uppercase text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition-colors">
            <LayoutDashboard className="w-4 h-4" /> Operator View
          </Link>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === tab.id
                  ? 'bg-zinc-900 text-red-300 border border-red-800/50'
                  : 'text-zinc-400 border border-transparent hover:border-zinc-800 hover:text-zinc-200'
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        <div className="pt-6 mt-6 border-t border-zinc-800">
          <div className="text-xs text-zinc-400 mb-3">Signed in as <span className="text-zinc-200 font-bold">{user?.email || user?.username || 'admin'}</span></div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-red-300 border border-red-800/50 rounded hover:bg-red-950/40 transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 h-screen overflow-hidden flex flex-col">
        <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800">
          <div className="h-16 px-4 flex items-center justify-between gap-3">
            <button onClick={() => setMobileNavOpen(true)} className="min-h-11 min-w-11 inline-flex items-center justify-center rounded-lg border border-zinc-700 text-zinc-200">
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-sm font-bold uppercase tracking-wide text-zinc-100">{tabs.find((t) => t.id === activeTab)?.short}</div>
            <button onClick={() => void loadAll()} className="min-h-11 min-w-11 inline-flex items-center justify-center rounded-lg border border-zinc-700 text-zinc-200">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </header>

        {mobileNavOpen && (
          <div className="md:hidden fixed inset-0 z-50">
            <button className="absolute inset-0 bg-black/70" onClick={() => setMobileNavOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-[86vw] max-w-xs bg-zinc-950 border-r border-zinc-800 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Logo size="sm" />
                <button onClick={() => setMobileNavOpen(false)} className="min-h-11 min-w-11 inline-flex items-center justify-center rounded-lg border border-zinc-700 text-zinc-200">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-2 pt-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-3 py-3 rounded text-xs font-bold uppercase tracking-wider border ${
                      activeTab === tab.id ? 'border-red-800/60 bg-zinc-900 text-red-300' : 'border-zinc-800 text-zinc-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto px-4 md:px-8 pt-20 md:pt-8 pb-16 md:pb-12">
          <div className="mb-6 hidden md:flex items-center justify-between gap-3">
            <h1 className="text-xl md:text-2xl font-black text-zinc-100 uppercase tracking-tight">{tabs.find((t) => t.id === activeTab)?.label}</h1>
            <button onClick={() => void loadAll()} className="px-3 py-2 border border-zinc-700 rounded text-xs font-bold uppercase text-zinc-200 hover:border-zinc-500">Refresh</button>
          </div>

          {loading ? (
            <div className="text-sm text-zinc-400">Loading admin data...</div>
          ) : (
            <>
              {activeTab === 'users' && (
                <section className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-zinc-950 border border-zinc-800 rounded p-4">
                      <div className="text-[10px] uppercase text-zinc-500">Total Users</div>
                      <div className="text-lg font-black text-zinc-100">{Number((overview?.users as { total?: number })?.total || 0)}</div>
                    </div>
                    <div className="bg-zinc-950 border border-zinc-800 rounded p-4">
                      <div className="text-[10px] uppercase text-zinc-500">Active 24h</div>
                      <div className="text-lg font-black text-zinc-100">{Number((overview?.users as { active24h?: number })?.active24h || 0)}</div>
                    </div>
                    <div className="bg-zinc-950 border border-zinc-800 rounded p-4">
                      <div className="text-[10px] uppercase text-zinc-500">Admins</div>
                      <div className="text-lg font-black text-zinc-100">{users.filter((u) => u.role === 'admin').length}</div>
                    </div>
                  </div>

                  <div className="bg-zinc-950 border border-zinc-800 rounded p-3 md:p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                      <div className="relative max-w-md w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                          type="text"
                          value={userQuery}
                          onChange={(e) => setUserQuery(e.target.value)}
                          placeholder="Search users"
                          className="w-full bg-black border border-zinc-800 rounded pl-10 pr-3 py-2 text-sm text-zinc-100"
                        />
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="text-zinc-400">Users: <span className="font-bold text-zinc-100">{filteredUsers.length}</span></span>
                        <select
                          value={userPageSize}
                          onChange={(e) => setUserPageSize(Number(e.target.value || 25))}
                          className="bg-black border border-zinc-800 rounded px-2 py-2 text-xs text-zinc-100"
                        >
                          <option value={10}>10 / page</option>
                          <option value={25}>25 / page</option>
                          <option value={50}>50 / page</option>
                          <option value={100}>100 / page</option>
                        </select>
                        <button
                          onClick={() => setUserPage((prev) => Math.max(1, prev - 1))}
                          disabled={userPage <= 1}
                          className="px-2 py-2 rounded border border-zinc-700 disabled:opacity-40"
                        >
                          Prev
                        </button>
                        <span className="text-zinc-400">Page <span className="font-bold text-zinc-100">{Math.min(userPage, totalUserPages)}</span> / {totalUserPages}</span>
                        <button
                          onClick={() => setUserPage((prev) => Math.min(totalUserPages, prev + 1))}
                          disabled={userPage >= totalUserPages}
                          className="px-2 py-2 rounded border border-zinc-700 disabled:opacity-40"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="md:hidden space-y-3 max-h-[56vh] overflow-auto pr-1">
                    {paginatedUsers.map((item) => (
                      <div key={item.id} className="bg-zinc-950 border border-zinc-800 rounded p-3 space-y-3">
                        <div>
                          <div className="font-bold text-sm text-zinc-100">{item.hackerHandle || item.name || item.email}</div>
                          <div className="text-[11px] text-zinc-500">{item.email}</div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="uppercase text-zinc-400">{item.role}</span>
                          <span className="font-mono text-zinc-200 inline-flex items-center gap-1"><CpLogo className="w-3.5 h-3.5" /> {Number(item.cpPoints || 0).toLocaleString()}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => void patchUser(item.id, { bootcampAccessRevoked: !item.bootcampAccessRevoked }, item.bootcampAccessRevoked ? 'Bootcamp access restored' : 'Bootcamp access revoked')}
                            className={`px-2 py-2 text-[11px] rounded border ${item.bootcampAccessRevoked ? 'text-red-300 border-red-800/60' : 'text-emerald-300 border-emerald-800/60'}`}
                          >
                            {item.bootcampAccessRevoked ? 'Access Revoked' : 'Access Allowed'}
                          </button>
                          <button
                            onClick={() => void handleUserBlockToggle(item)}
                            className="px-2 py-2 text-[11px] rounded border border-zinc-700"
                          >
                            {isUserBlocked(item) ? 'Unblock' : 'Block'}
                          </button>
                          <button
                            onClick={() => void handleDeleteUser(item)}
                            className="col-span-2 px-2 py-2 text-[11px] rounded border border-red-800/60 text-red-300"
                          >
                            Delete User
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="hidden md:block bg-zinc-950 border border-zinc-800 rounded max-h-[62vh] overflow-auto">
                    <table className="w-full text-left min-w-[900px]">
                      <thead className="border-b border-zinc-800 bg-black sticky top-0 z-10">
                        <tr>
                          <th className="px-4 py-3 text-[10px] uppercase text-zinc-500">User</th>
                          <th className="px-4 py-3 text-[10px] uppercase text-zinc-500">Role</th>
                          <th className="px-4 py-3 text-[10px] uppercase text-zinc-500">Points</th>
                          <th className="px-4 py-3 text-[10px] uppercase text-zinc-500">Bootcamp Access</th>
                          <th className="px-4 py-3 text-[10px] uppercase text-zinc-500">Account</th>
                          <th className="px-4 py-3 text-[10px] uppercase text-zinc-500 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedUsers.map((item) => (
                          <tr key={item.id} className="border-b border-zinc-800/80">
                            <td className="px-4 py-3">
                              <div className="font-bold text-sm text-zinc-100">{item.hackerHandle || item.name || item.email}</div>
                              <div className="text-[11px] text-zinc-500">{item.email}</div>
                            </td>
                            <td className="px-4 py-3 text-xs uppercase text-zinc-300">{item.role}</td>
                            <td className="px-4 py-3 text-sm font-mono text-zinc-100">{Number(item.cpPoints || 0).toLocaleString()}</td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => void patchUser(item.id, { bootcampAccessRevoked: !item.bootcampAccessRevoked }, item.bootcampAccessRevoked ? 'Bootcamp access restored' : 'Bootcamp access revoked')}
                                className={`text-[11px] px-2 py-1 rounded border ${item.bootcampAccessRevoked ? 'text-red-300 border-red-800/60' : 'text-emerald-300 border-emerald-800/60'}`}
                              >
                                {item.bootcampAccessRevoked ? 'Revoked' : 'Allowed'}
                              </button>
                            </td>
                            <td className="px-4 py-3 text-[11px] text-zinc-300">{isUserBlocked(item) ? 'Blocked' : 'Active'}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => void handleUserBlockToggle(item)}
                                  className="px-2 py-1 text-[11px] rounded border border-zinc-700 hover:border-zinc-500"
                                >
                                  {isUserBlocked(item) ? <span className="inline-flex items-center gap-1"><Unlock className="w-3 h-3" />Unblock</span> : <span className="inline-flex items-center gap-1"><Ban className="w-3 h-3" />Block</span>}
                                </button>
                                <button
                                  onClick={() => void handleDeleteUser(item)}
                                  className="px-2 py-1 text-[11px] rounded border border-red-800/60 text-red-300 hover:bg-red-950/40"
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
                <section className="h-[calc(100vh-12rem)]">
                  <BootcampManager
                    bootcamps={bootcamps}
                    selectedBootcampId={selectedBootcampId}
                    setSelectedBootcampId={setSelectedBootcampId}
                    contentVersion={contentVersion}
                    onSave={async (updated) => {
                      setSaving(true);
                      try {
                        await api.patch('/admin/content', {
                          version: contentVersion,
                          learn: { bootcamps: updated },
                        });
                        addToast('Bootcamps saved', 'success');
                        await loadAll();
                      } catch (err: unknown) {
                        const code = (err as { response?: { data?: { code?: string } } })?.response?.data?.code;
                        if (code === 'content_version_conflict') {
                          addToast('Version conflict — reloading latest.', 'error');
                          await loadAll();
                        } else {
                          addToast('Failed to save bootcamps', 'error');
                        }
                      } finally {
                        setSaving(false);
                      }
                    }}
                    saving={saving}
                    addToast={addToast}
                    api={api}
                  />
                </section>
              )}

              {activeTab === 'zero_day' && (
                <section className="space-y-4">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    <div className="bg-zinc-950 border border-zinc-800 rounded p-4 space-y-3">
                      <div className="text-xs font-bold uppercase text-zinc-500">Create / Edit Product</div>
                      <input value={productForm.title} onChange={(e) => setProductForm((p) => ({ ...p, title: e.target.value }))} placeholder="Title" className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-100" />
                      <textarea value={productForm.description} onChange={(e) => setProductForm((p) => ({ ...p, description: e.target.value }))} placeholder="Description" className="w-full min-h-[90px] bg-black border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-100" />
                      <div className="grid grid-cols-2 gap-2">
                        <input type="number" value={productForm.isFree ? 0 : productForm.cpPrice} onChange={(e) => setProductForm((p) => ({ ...p, cpPrice: Number(e.target.value || 0) }))} placeholder="Points price" disabled={productForm.isFree} className="bg-black border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-100 disabled:opacity-40" />
                        <input type="number" value={productForm.sortOrder} onChange={(e) => setProductForm((p) => ({ ...p, sortOrder: Number(e.target.value || 0) }))} placeholder="Sort order" className="bg-black border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-100" />
                      </div>
                      <input value={productForm.type} onChange={(e) => setProductForm((p) => ({ ...p, type: e.target.value }))} placeholder="Type (book/tool/etc)" className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-100" />
                      <input value={productForm.productUrl} onChange={(e) => setProductForm((p) => ({ ...p, productUrl: e.target.value }))} placeholder="Optional external product URL" className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-100" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-zinc-300">
                        <label className="space-y-1">
                          <span className="text-zinc-500 uppercase">Cover image</span>
                          <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} className="block w-full" />
                        </label>
                        <label className="space-y-1">
                          <span className="text-zinc-500 uppercase">Product PDF</span>
                          <input type="file" accept="application/pdf" onChange={(e) => setProductFile(e.target.files?.[0] || null)} className="block w-full" />
                        </label>
                      </div>
                      <label className="text-xs inline-flex items-center gap-2 text-zinc-300">
                        <input type="checkbox" checked={productForm.isActive} onChange={(e) => setProductForm((p) => ({ ...p, isActive: e.target.checked }))} /> Active
                      </label>
                      <label className="text-xs inline-flex items-center gap-2 text-zinc-300">
                        <input type="checkbox" checked={productForm.isFree} onChange={(e) => setProductForm((p) => ({ ...p, isFree: e.target.checked, cpPrice: e.target.checked ? 0 : p.cpPrice }))} /> Free (no CP required)
                      </label>
                      <div className="flex items-center gap-2">
                        <button onClick={() => void saveProduct()} className="px-3 py-2 border border-red-800/60 rounded text-xs font-bold uppercase text-red-300">{productForm.id ? 'Update Product' : 'Create Product'}</button>
                        <button onClick={resetProductForm} className="px-3 py-2 border border-zinc-700 rounded text-xs font-bold uppercase">Clear</button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="md:hidden space-y-3 max-h-[620px] overflow-auto">
                        {products.map((item) => (
                          <div key={item._id} className="bg-zinc-950 border border-zinc-800 rounded p-3 space-y-2">
                            <div className="font-bold text-sm text-zinc-100">{item.title}</div>
                            <div className="text-xs text-zinc-400 inline-flex items-center gap-1">{item.type} • {item.cpPrice} <CpLogo className="w-3.5 h-3.5" /> • {item.isActive ? 'Active' : 'Inactive'}</div>
                            <div className="grid grid-cols-2 gap-2">
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
                                    isFree: item.isFree === true,
                                  });
                                }}
                                className="px-2 py-2 rounded border border-zinc-700 text-xs"
                              >
                                Edit
                              </button>
                              <button onClick={() => void deleteProduct(item._id)} className="px-2 py-2 rounded border border-red-800/60 text-red-300 text-xs">Delete</button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="hidden md:block bg-zinc-950 border border-zinc-800 rounded overflow-auto max-h-[620px]">
                        <table className="w-full text-left min-w-[700px]">
                          <thead className="border-b border-zinc-800 bg-black">
                            <tr>
                              <th className="px-4 py-3 text-[10px] uppercase text-zinc-500">Title</th>
                              <th className="px-4 py-3 text-[10px] uppercase text-zinc-500">Price</th>
                              <th className="px-4 py-3 text-[10px] uppercase text-zinc-500">Type</th>
                              <th className="px-4 py-3 text-[10px] uppercase text-zinc-500">Status</th>
                              <th className="px-4 py-3 text-[10px] uppercase text-zinc-500 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {products.map((item) => (
                              <tr key={item._id} className="border-b border-zinc-800/80">
                                <td className="px-4 py-3 text-sm font-bold text-zinc-100">{item.title}</td>
                                <td className="px-4 py-3 text-sm font-mono text-zinc-200">{item.isFree ? <span className="text-emerald-300">FREE</span> : item.cpPrice}</td>
                                <td className="px-4 py-3 text-xs uppercase text-zinc-300">{item.type}</td>
                                <td className="px-4 py-3 text-xs text-zinc-300">{item.isActive ? 'Active' : 'Inactive'}</td>
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
                                          isFree: item.isFree === true,
                                        });
                                      }}
                                      className="px-2 py-1 rounded border border-zinc-700 text-xs"
                                    >
                                      Edit
                                    </button>
                                    <button onClick={() => void deleteProduct(item._id)} className="px-2 py-1 rounded border border-red-800/60 text-red-300 text-xs">Delete</button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {activeTab === 'cp' && (
                <section className="space-y-4 max-w-2xl">
                  <div className="bg-zinc-950 border border-zinc-800 rounded p-4 space-y-3">
                    <div className="text-xs font-bold uppercase text-zinc-500">Points Control</div>
                    <select value={cpUserId} onChange={(e) => setCpUserId(e.target.value)} className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-100">
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>{u.hackerHandle || u.name || u.email} ({u.email})</option>
                      ))}
                    </select>
                    <div className="grid grid-cols-3 gap-2">
                      <button onClick={() => setCpAction('grant')} className={`px-3 py-2 rounded border text-xs font-bold uppercase ${cpAction === 'grant' ? 'border-red-800/60 text-red-300' : 'border-zinc-800 text-zinc-300'}`}>Grant</button>
                      <button onClick={() => setCpAction('deduct')} className={`px-3 py-2 rounded border text-xs font-bold uppercase ${cpAction === 'deduct' ? 'border-red-800/60 text-red-300' : 'border-zinc-800 text-zinc-300'}`}>Deduct</button>
                      <button onClick={() => setCpAction('set')} className={`px-3 py-2 rounded border text-xs font-bold uppercase ${cpAction === 'set' ? 'border-red-800/60 text-red-300' : 'border-zinc-800 text-zinc-300'}`}>Set</button>
                    </div>
                    <input type="number" value={cpValue} onChange={(e) => setCpValue(Number(e.target.value || 0))} className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-100" placeholder={cpAction === 'set' ? 'Target value' : 'Points'} />
                    <input value={cpReason} onChange={(e) => setCpReason(e.target.value)} className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-100" placeholder="Reason (optional)" />
                    <button onClick={() => void runCpAction()} className="px-3 py-2 border border-red-800/60 rounded text-xs font-bold uppercase text-red-300">Execute Points Action</button>
                  </div>
                </section>
              )}

              {activeTab === 'security' && (
                <section className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-zinc-950 border border-zinc-800 rounded p-4">
                      <div className="text-[10px] uppercase text-zinc-500">Events 24h</div>
                      <div className="text-lg font-black text-zinc-100">{Number(securitySummary?.events24h || 0)}</div>
                    </div>
                    <div className="bg-zinc-950 border border-zinc-800 rounded p-4">
                      <div className="text-[10px] uppercase text-zinc-500">Unique IPs 24h</div>
                      <div className="text-lg font-black text-zinc-100">{Number(securitySummary?.uniqueIps24h || 0)}</div>
                    </div>
                    <div className="bg-zinc-950 border border-zinc-800 rounded p-4">
                      <div className="text-[10px] uppercase text-zinc-500">Auth Failures 24h</div>
                      <div className="text-lg font-black text-zinc-100">{Number(securitySummary?.authFailures24h || 0)}</div>
                    </div>
                  </div>

                  <div className="md:hidden space-y-3">
                    {securityEvents.map((item) => (
                      <div key={item.id} className="bg-zinc-950 border border-zinc-800 rounded p-3 text-xs space-y-1">
                        <div className="text-zinc-400">{item.createdAt ? new Date(item.createdAt).toLocaleString() : '-'}</div>
                        <div className="font-bold text-zinc-100 uppercase">{item.eventType}</div>
                        <div className="text-zinc-300">{item.action}</div>
                        <div className="font-mono text-zinc-500">{item.path || '-'}</div>
                        <div className="text-zinc-300">HTTP {item.statusCode} • {item.ipAddress || '-'}</div>
                      </div>
                    ))}
                  </div>

                  <div className="hidden md:block bg-zinc-950 border border-zinc-800 rounded overflow-auto">
                    <table className="w-full text-left min-w-[900px]">
                      <thead className="border-b border-zinc-800 bg-black">
                        <tr>
                          <th className="px-4 py-3 text-[10px] uppercase text-zinc-500">Time</th>
                          <th className="px-4 py-3 text-[10px] uppercase text-zinc-500">Type</th>
                          <th className="px-4 py-3 text-[10px] uppercase text-zinc-500">Action</th>
                          <th className="px-4 py-3 text-[10px] uppercase text-zinc-500">Path</th>
                          <th className="px-4 py-3 text-[10px] uppercase text-zinc-500">Code</th>
                          <th className="px-4 py-3 text-[10px] uppercase text-zinc-500">IP</th>
                        </tr>
                      </thead>
                      <tbody>
                        {securityEvents.map((item) => (
                          <tr key={item.id} className="border-b border-zinc-800/80 text-xs">
                            <td className="px-4 py-3 text-zinc-300">{item.createdAt ? new Date(item.createdAt).toLocaleString() : '-'}</td>
                            <td className="px-4 py-3 uppercase text-zinc-200">{item.eventType}</td>
                            <td className="px-4 py-3 text-zinc-300">{item.action}</td>
                            <td className="px-4 py-3 font-mono text-zinc-500">{item.path || '-'}</td>
                            <td className="px-4 py-3 text-zinc-300">{item.statusCode}</td>
                            <td className="px-4 py-3 font-mono text-zinc-300">{item.ipAddress || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {activeTab === 'applications' && (
                <section className="space-y-4">
                  <div className="text-xs text-zinc-400 mb-2">
                    {applications.length} enrollment application{applications.length !== 1 ? 's' : ''} submitted
                  </div>

                  {/* Mobile */}
                  <div className="md:hidden space-y-3 max-h-[70vh] overflow-auto">
                    {applications.length === 0 ? (
                      <div className="text-sm text-zinc-500 py-8 text-center">No applications yet.</div>
                    ) : applications.map((app) => (
                      <div key={app.userId} className="bg-zinc-950 border border-zinc-800 rounded p-3 space-y-2">
                        <div className="font-bold text-sm text-zinc-100">{app.hackerHandle || app.name || app.email}</div>
                        <div className="text-[11px] text-zinc-500">{app.email}</div>
                        <div className="text-[11px] text-zinc-400">Bootcamp: <span className="text-zinc-200">{app.application.bootcampTitle || app.bootcampId || '—'}</span></div>
                        <div className="text-[11px] text-zinc-400">Why: <span className="text-zinc-200">{app.application.motivation || '—'}</span></div>
                        <div className="text-[11px] text-zinc-400">Level: <span className="text-zinc-200">{app.application.level || '—'}</span></div>
                        <div className="text-[11px] text-zinc-400">Goal: <span className="text-zinc-200">{app.application.goal || '—'}</span></div>
                        <div className="text-[11px] text-zinc-400">Commitment: <span className="text-zinc-200">{app.application.commitment || '—'}</span></div>
                        <div className="text-[11px] text-zinc-400">Phone: <span className="text-zinc-200">{app.application.phone || '—'}</span></div>
                        {app.application.submittedAt && (
                          <div className="text-[10px] text-zinc-600">{new Date(app.application.submittedAt).toLocaleString()}</div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Desktop */}
                  <div className="hidden md:block bg-zinc-950 border border-zinc-800 rounded overflow-auto max-h-[70vh]">
                    <table className="w-full text-left min-w-[900px]">
                      <thead className="border-b border-zinc-800 bg-black sticky top-0 z-10">
                        <tr>
                          <th className="px-4 py-3 text-[10px] uppercase text-zinc-500">Operator</th>
                          <th className="px-4 py-3 text-[10px] uppercase text-zinc-500">Bootcamp</th>
                          <th className="px-4 py-3 text-[10px] uppercase text-zinc-500">Why Joining</th>
                          <th className="px-4 py-3 text-[10px] uppercase text-zinc-500">Level</th>
                          <th className="px-4 py-3 text-[10px] uppercase text-zinc-500">Goal</th>
                          <th className="px-4 py-3 text-[10px] uppercase text-zinc-500">Commitment</th>
                          <th className="px-4 py-3 text-[10px] uppercase text-zinc-500">Phone</th>
                          <th className="px-4 py-3 text-[10px] uppercase text-zinc-500">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applications.length === 0 ? (
                          <tr><td colSpan={8} className="px-4 py-8 text-center text-zinc-500 text-sm">No applications yet.</td></tr>
                        ) : applications.map((app) => (
                          <tr key={app.userId} className="border-b border-zinc-800/80 text-xs">
                            <td className="px-4 py-3">
                              <div className="font-bold text-zinc-100">{app.hackerHandle || app.name || '—'}</div>
                              <div className="text-zinc-500">{app.email}</div>
                            </td>
                            <td className="px-4 py-3 text-zinc-300">{app.application.bootcampTitle || app.bootcampId || '—'}</td>
                            <td className="px-4 py-3 text-zinc-300 max-w-[180px] truncate">{app.application.motivation || '—'}</td>
                            <td className="px-4 py-3 text-zinc-300">{app.application.level || '—'}</td>
                            <td className="px-4 py-3 text-zinc-300 max-w-[160px] truncate">{app.application.goal || '—'}</td>
                            <td className="px-4 py-3 text-zinc-300">{app.application.commitment || '—'}</td>
                            <td className="px-4 py-3 text-zinc-300 font-mono">{app.application.phone || '—'}</td>
                            <td className="px-4 py-3 text-zinc-500">
                              {app.application.submittedAt ? new Date(app.application.submittedAt).toLocaleDateString() : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {activeTab === 'contacts' && (
                <section className="space-y-4">
                  <div className="md:hidden space-y-3">
                    {contactMessages.map((item) => (
                      <div key={item.id} className="bg-zinc-950 border border-zinc-800 rounded p-3 space-y-2">
                        <div>
                          <div className="font-bold text-sm text-zinc-100">{item.name}</div>
                          <div className="text-[11px] text-zinc-500">{item.email}</div>
                        </div>
                        <div className="text-xs text-zinc-300">{item.subject || '-'}</div>
                        <div className="text-xs text-zinc-400 whitespace-pre-wrap">{item.message}</div>
                        <div className="grid grid-cols-2 gap-2">
                          <select
                            value={item.status}
                            onChange={(e) => void updateContactStatus(item.id, e.target.value as ContactMessage['status'])}
                            className="bg-black border border-zinc-800 rounded px-2 py-2 text-xs text-zinc-100"
                          >
                            <option value="new">new</option>
                            <option value="in_progress">in_progress</option>
                            <option value="resolved">resolved</option>
                            <option value="archived">archived</option>
                          </select>
                          <button onClick={() => void deleteContactMessage(item.id)} className="px-2 py-2 rounded border border-red-800/60 text-red-300 text-xs">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="hidden md:block bg-zinc-950 border border-zinc-800 rounded overflow-auto">
                    <table className="w-full text-left min-w-[980px]">
                      <thead className="border-b border-zinc-800 bg-black">
                        <tr>
                          <th className="px-4 py-3 text-[10px] uppercase text-zinc-500">From</th>
                          <th className="px-4 py-3 text-[10px] uppercase text-zinc-500">Subject</th>
                          <th className="px-4 py-3 text-[10px] uppercase text-zinc-500">Message</th>
                          <th className="px-4 py-3 text-[10px] uppercase text-zinc-500">Status</th>
                          <th className="px-4 py-3 text-[10px] uppercase text-zinc-500">Date</th>
                          <th className="px-4 py-3 text-[10px] uppercase text-zinc-500 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contactMessages.map((item) => (
                          <tr key={item.id} className="border-b border-zinc-800/80 align-top">
                            <td className="px-4 py-3 text-sm">
                              <div className="font-bold text-zinc-100">{item.name}</div>
                              <div className="text-[11px] text-zinc-500">{item.email}</div>
                            </td>
                            <td className="px-4 py-3 text-xs text-zinc-300">{item.subject || '-'}</td>
                            <td className="px-4 py-3 text-xs text-zinc-300 max-w-[360px] whitespace-pre-wrap">{item.message}</td>
                            <td className="px-4 py-3">
                              <select
                                value={item.status}
                                onChange={(e) => void updateContactStatus(item.id, e.target.value as ContactMessage['status'])}
                                className="bg-black border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-100"
                              >
                                <option value="new">new</option>
                                <option value="in_progress">in_progress</option>
                                <option value="resolved">resolved</option>
                                <option value="archived">archived</option>
                              </select>
                            </td>
                            <td className="px-4 py-3 text-[11px] text-zinc-500">{item.createdAt ? new Date(item.createdAt).toLocaleString() : '-'}</td>
                            <td className="px-4 py-3 text-right">
                              <button onClick={() => void deleteContactMessage(item.id)} className="px-2 py-1 rounded border border-red-800/60 text-red-300 text-xs">Delete</button>
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

        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950 border-t border-zinc-800 pb-[calc(env(safe-area-inset-bottom)+0.35rem)]">
          <div className="grid grid-cols-6 gap-1 px-1 pt-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`min-h-14 rounded-md text-[10px] font-bold uppercase tracking-tight flex flex-col items-center justify-center gap-1 ${
                  activeTab === tab.id ? 'text-red-300 bg-zinc-900' : 'text-zinc-400'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.short}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
