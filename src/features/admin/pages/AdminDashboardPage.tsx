import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { RefreshCw, Shield } from 'lucide-react';

import CpAnalytics from '../components/CpAnalytics';
import BootcampAccessPanel from '../components/BootcampAccessPanel';
import UsersTab from '../components/dashboard/UsersTab';
import ZeroDayMarketTab from '../components/dashboard/ZeroDayMarketTab';
import SecurityTab from '../components/dashboard/SecurityTab';
import OverviewTab from '../components/dashboard/OverviewTab';
import InboxTab from '../components/dashboard/InboxTab';
import BroadcastTab from '../components/dashboard/BroadcastTab';
import AuditLogTab from '../components/dashboard/AuditLogTab';
import ADMIN_PATH from '@/shared/utils/adminPath';
import { useAuth } from '@/core/contexts/AuthContext';
import { useToast } from '@/core/contexts/ToastContext';
import api from '@/core/services/api';
import { ConfirmDialog } from '@/shared/components/ui/Dialog';
import { SyncIndicator } from '@/shared/components/dashboard';
import LearningOverviewCard from '@/features/student/components/learning/LearningOverviewCard';
import {
  type AdminTab, type AdminUser, type CPProduct,
  type SecurityEventItem,
  isUserBlocked,
} from '../types/admin.types';

const LOADING_SUBTITLE = 'Synchronizing encrypted data…';

// ── Main component ────────────────────────────────────────────────────────────
const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Tab is driven by ?tab= URL param so topbar links work
  const activeTab = (new URLSearchParams(location.search).get('tab') as AdminTab) || 'overview';
  const setActiveTab = (tab: AdminTab) => navigate(`${ADMIN_PATH}/dashboard?tab=${tab}`, { replace: true });

  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [syncError, setSyncError] = useState('');

  const [overview, setOverview] = useState<Record<string, unknown> | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [products, setProducts] = useState<CPProduct[]>([]);
  const [securitySummary, setSecuritySummary] = useState<Record<string, unknown> | null>(null);
  const [securityEvents, setSecurityEvents] = useState<SecurityEventItem[]>([]);
  const [confirmDeleteUser, setConfirmDeleteUser] = useState<AdminUser | null>(null);
  const [confirmDeleteProduct, setConfirmDeleteProduct] = useState<string | null>(null);

  const loadAll = async () => {
    setLoading(true);
    setSyncError('');
    try {
      const [ovRes, usersRes, productsRes, summaryRes, eventsRes] =
        await Promise.all([
          api.get('/admin/overview').catch(() => null),
          api.get('/admin/users').catch(() => null),
          api.get('/admin/cp-products').catch(() => null),
          api.get('/admin/security/summary').catch(() => null),
          api.get('/admin/security/events?limit=50').catch(() => null),
        ]);

      setOverview((ovRes?.data as Record<string, unknown>) || null);
      const userItems = Array.isArray(usersRes?.data) ? (usersRes.data as AdminUser[]) : [];
      setUsers(userItems);
      setProducts(Array.isArray(productsRes?.data?.items) ? productsRes.data.items : []);
      setSecuritySummary((summaryRes?.data as Record<string, unknown>) || null);
      setSecurityEvents(Array.isArray(eventsRes?.data?.items) ? eventsRes.data.items : []);
      setLastSync(new Date().toLocaleTimeString());
    } catch {
      setSyncError('Failed to sync. Some data may be stale.');
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
    setConfirmDeleteProduct(id);
  };

  const handleDeleteProductConfirmed = async () => {
    if (!confirmDeleteProduct) return;
    try { await api.delete(`/admin/cp-products/${encodeURIComponent(confirmDeleteProduct)}`); addToast('Product deleted', 'success'); await loadAll(); }
    catch (e: any) { addToast(e?.response?.data?.error || 'Failed to delete', 'error'); }
    finally { setConfirmDeleteProduct(null); }
  };

  // ── Tab label lookup ─────────────────────────────────────────────────────────
  const TAB_LABELS: Record<AdminTab, string> = {
    overview: 'Overview',
    users: 'Users', bootcamps: 'Bootcamps',
    zero_day: 'Market', cp: 'Points',
    inbox: 'Inbox', broadcast: 'Broadcast', audit: 'Audit',
    security: 'Security',
  };
  const activeLabel = TAB_LABELS[activeTab] ?? '';

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <>
    <div className="bg-bg text-text-primary">
      <div
        className="scroll-hover lg:fixed lg:left-0 lg:right-20 lg:bottom-0 lg:top-24 lg:overflow-y-auto lg:overscroll-contain"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="mx-auto max-w-6xl px-4 md:px-12 lg:px-16 pt-8 pb-20 lg:pb-24 space-y-6">

          <LearningOverviewCard
            icon={<Shield className="w-6 h-6 text-bg" />}
            title={activeLabel}
            description={loading ? LOADING_SUBTITLE : `Managing system ${activeLabel.toLowerCase()}.`}
            stats={overview ? [
              { label: 'Users', value: String((overview as Record<string, unknown>)?.totalUsers ?? 0) },
              { label: 'Products', value: String(products.length) },
            ] : undefined}
            action={{
              label: loading ? 'Syncing' : 'Refresh',
              onClick: () => void loadAll(),
              icon: <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />,
            }}
          />

          {/* ── MAIN CONTENT ────────────────────────────────────────────── */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[0,1,2,3].map(i => (
                <div key={i} className="rounded-2xl border border-border/30 bg-bg-card p-5 space-y-3">
                  <div className="h-4 w-24 bg-border/30 rounded animate-pulse" />
                  <div className="h-8 w-20 bg-border/30 rounded animate-pulse" />
                  <div className="h-3 w-32 bg-border/30 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div>
              {/* ── OVERVIEW ──────────────────────────────────────────────── */}
              {activeTab === 'overview' && <OverviewTab />}

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
                <div className="card-qyvora p-6 md:p-8 border border-border">
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
                <div className="card-qyvora p-6 md:p-8 border border-border">
                  <CpAnalytics users={users} addToast={addToast} />
                </div>
              )}

              {/* ── INBOX (Contacts + Service Requests) ──────────────────── */}
              {activeTab === 'inbox' && <InboxTab />}

              {/* ── BROADCAST ─────────────────────────────────────────────── */}
              {activeTab === 'broadcast' && <BroadcastTab />}

              {/* ── AUDIT LOG ─────────────────────────────────────────────── */}
              {activeTab === 'audit' && <AuditLogTab />}

              {/* ── SECURITY ──────────────────────────────────────────────── */}
              {activeTab === 'security' && (
                <SecurityTab
                  securitySummary={securitySummary}
                  securityEvents={securityEvents}
                />
              )}
            </div>
          )}

          <div className="mt-6">
            <SyncIndicator lastSync={lastSync} error={syncError} onRetry={() => void loadAll()} />
          </div>
        </div>
      </div>
    </div>

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

    <ConfirmDialog
      open={confirmDeleteProduct !== null}
      onOpenChange={(open) => { if (!open) setConfirmDeleteProduct(null); }}
      title="Delete Product"
      description="Are you sure you want to permanently delete this product? This action is irreversible."
      confirmLabel="Delete"
      cancelLabel="Cancel"
      destructive
      onConfirm={handleDeleteProductConfirmed}
    />
    </>
  );
};

export default AdminDashboardPage;
