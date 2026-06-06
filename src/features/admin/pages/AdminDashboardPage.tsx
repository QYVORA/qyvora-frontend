import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import ChainExplorer from '../components/ChainExplorer';
import CpAnalytics from '../components/CpAnalytics';
import BootcampAccessPanel from '../components/BootcampAccessPanel';
import UsersTab from '../components/dashboard/UsersTab';
import ZeroDayMarketTab from '../components/dashboard/ZeroDayMarketTab';
import SecurityTab from '../components/dashboard/SecurityTab';
import ContactsTab from '../components/dashboard/ContactsTab';
import { useAuth } from '../../../core/contexts/AuthContext';
import { useToast } from '../../../core/contexts/ToastContext';
import api from '../../../core/services/api';
import { ConfirmDialog } from '../../../shared/components/ui/Dialog';
import {
  type AdminTab, type AdminUser, type Bootcamp, type CPProduct,
  type ContactMessage, type SecurityEventItem,
  isUserBlocked,
} from '../types/admin.types';

// ── Skeleton ──────────────────────────────────────────────────────────────────
const Skeleton = () => (
  <div className="space-y-3 p-1">
    {[0,1,2,3,4].map(i => (
      <div key={i} className="h-14 rounded-xl bg-bg-card border border-border animate-pulse" style={{ opacity: 1 - i * 0.15 }} />
    ))}
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

  const [contentVersion, setContentVersion] = useState(1);
  const [bootcamps, setBootcamps] = useState<Bootcamp[]>([]);
  const [selectedBootcampId, setSelectedBootcampId] = useState<string>('');
  const [products, setProducts] = useState<CPProduct[]>([]);

  const [securitySummary, setSecuritySummary] = useState<Record<string, unknown> | null>(null);
  const [securityEvents, setSecurityEvents] = useState<SecurityEventItem[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [confirmDeleteUser, setConfirmDeleteUser] = useState<AdminUser | null>(null);

  // ── Data loading ─────────────────────────────────────────────────────────────
  const loadAll = async () => {
    setLoading(true);
    try {
      const [ovRes, usersRes, contentRes, productsRes, summaryRes, eventsRes, contactsRes] =
        await Promise.all([
          api.get('/admin/overview').catch(() => null),
          api.get('/admin/users').catch(() => null),
          api.get('/admin/content').catch(() => null),
          api.get('/admin/cp-products').catch(() => null),
          api.get('/admin/security/summary').catch(() => null),
          api.get('/admin/security/events?limit=50').catch(() => null),
          api.get('/admin/contact-messages?limit=50').catch(() => null),
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadAll(); }, []);

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

  const handleDeleteUserConfirmed = async (target: AdminUser) => {
    try {
      await api.delete(`/admin/users/${encodeURIComponent(target.id)}`);
      addToast('User deleted', 'success');
      await loadAll();
    } catch (e: any) { addToast(e?.response?.data?.error || 'Delete failed', 'error'); }
  };

  const saveProduct = async (form: any, coverFile: File | null, productFile: File | null) => {
    try {
      let coverUrl = '';
      if (coverFile) {
        const fd = new FormData(); fd.append('file', coverFile);
        const res = await api.post('/admin/uploads/cp-product-images', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        coverUrl = String(res.data?.relativeUrl || res.data?.url || '');
      }

      let fileMeta = null;
      if (productFile) {
        const fd = new FormData(); fd.append('file', productFile);
        const res = await api.post('/admin/uploads/cp-products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        fileMeta = { fileId: String(res.data?.fileId || ''), fileName: String(res.data?.originalName || ''), fileSize: Number(res.data?.size || 0), fileMime: String(res.data?.mime || '') };
      }

      if (!form.id && !fileMeta) { addToast('Product PDF is required for new products.', 'error'); return; }
      
      const payload: Record<string, unknown> = {
        title: form.title, description: form.description,
        cpPrice: form.isFree ? 0 : Number(form.cpPrice || 0),
        type: form.type, sortOrder: Number(form.sortOrder || 0),
        isActive: form.isActive, isFree: form.isFree,
      };
      if (coverUrl) payload.coverUrl = coverUrl;
      if (fileMeta) Object.assign(payload, fileMeta);

      if (form.id) {
        await api.patch(`/admin/cp-products/${encodeURIComponent(form.id)}`, payload);
        addToast('Product updated', 'success');
      } else {
        await api.post('/admin/cp-products', payload);
        addToast('Product created', 'success');
      }
      await loadAll();
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
    users: 'Users', bootcamps: 'Bootcamps',
    zero_day: 'Market', cp: 'Points', chain: 'Chain',
    security: 'Security', contacts: 'Contacts', 
    quizzes: 'Quizzes',
  };
  const activeLabel = TAB_LABELS[activeTab] ?? '';

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <>
    <div className="bg-bg text-text-primary">
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
                <UsersTab
                  users={users}
                  overview={overview}
                  addToast={addToast}
                  patchUser={patchUser}
                  handleUserBlockToggle={handleUserBlockToggle}
                  handleDeleteUser={(target) => { setConfirmDeleteUser(target); return Promise.resolve(); }}
                />
              )}

              {/* ── BOOTCAMPS ─────────────────────────────────────────────── */}
              {activeTab === 'bootcamps' && (
                <div className="card-hsociety p-6 md:p-8">
                  <BootcampAccessPanel addToast={addToast} />
                </div>
              )}

              {/* ── ZERO-DAY MARKET ───────────────────────────────────────── */}
              {activeTab === 'zero_day' && (
                <ZeroDayMarketTab
                  products={products}
                  saveProduct={saveProduct}
                  deleteProduct={deleteProduct}
                />
              )}

              {/* ── POINTS / CP ANALYTICS ────────────────────────────────── */}
              {activeTab === 'cp' && (
                <div className="card-hsociety p-6 md:p-8">
                  <CpAnalytics users={users} addToast={addToast} />
                </div>
              )}

              {/* ── SECURITY ──────────────────────────────────────────────── */}
              {activeTab === 'security' && (
                <SecurityTab
                  securitySummary={securitySummary}
                  securityEvents={securityEvents}
                />
              )}

              {/* ── CONTACTS ──────────────────────────────────────────────── */}
              {activeTab === 'contacts' && (
                <ContactsTab
                  contactMessages={contactMessages}
                  updateContactStatus={updateContactStatus}
                  deleteContactMessage={deleteContactMessage}
                />
              )}

              {/* ── CHAIN EXPLORER ────────────────────────────────────────── */}
              {activeTab === 'chain' && (
                <div className="card-hsociety p-6 md:p-8">
                  <ChainExplorer />
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
