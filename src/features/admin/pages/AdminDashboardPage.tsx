import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { RefreshCw, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SEO from '@/shared/components/SEO';

import CpAnalytics from '../components/CpAnalytics';
import BootcampAccessPanel from '../components/BootcampAccessPanel';
import UsersTab from '../components/dashboard/UsersTab';
import ZeroDayMarketTab from '../components/dashboard/ZeroDayMarketTab';
import SecurityTab from '../components/dashboard/SecurityTab';
import OverviewTab from '../components/dashboard/OverviewTab';
import InboxTab from '../components/dashboard/InboxTab';
import BroadcastTab from '../components/dashboard/BroadcastTab';
import AuditLogTab from '../components/dashboard/AuditLogTab';
import IncidentsTab from '../components/dashboard/IncidentsTab';
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

export type SectionStatus = 'loading' | 'loaded' | 'error';

export interface OverviewData {
  users: { total: number; active24h: number; byRole: Record<string, number> };
  recentSignups: Array<{ id: string; name: string; email: string; createdAt: string }>;
  newSignupsWeek: number;
  totalCpMinted: number;
  bootcampEnrollmentRate: number;
  chainReachable: boolean | string;
  systemHealth?: {
    mongodb: boolean;
    blockedAccounts: number;
    incidentsOpen: number;
    incidentsCriticalOpen: number;
    authFailures24h: number;
    serverErrors24h: number;
    bootcamp?: { enrolled: number; active: number; engagementCurrentModule: number; currentModuleId: number | null };
  };
}

const INITIAL_STATUSES: Record<'overview' | 'users' | 'cp' | 'securitySummary' | 'securityEvents', SectionStatus> = {
  overview: 'loading',
  users: 'loading',
  cp: 'loading',
  securitySummary: 'loading',
  securityEvents: 'loading',
};

// ── Main component ────────────────────────────────────────────────────────────
const AdminDashboardPage: React.FC = () => {
  const { t } = useTranslation();
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
  const [statuses, setStatuses] = useState(INITIAL_STATUSES);

  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [products, setProducts] = useState<CPProduct[]>([]);
  const [securitySummary, setSecuritySummary] = useState<Record<string, unknown> | null>(null);
  const [securityEvents, setSecurityEvents] = useState<SecurityEventItem[]>([]);
  const [confirmDeleteUser, setConfirmDeleteUser] = useState<AdminUser | null>(null);
  const [confirmDeleteProduct, setConfirmDeleteProduct] = useState<string | null>(null);

  const loadAll = async () => {
    setLoading(true);
    setSyncError('');
    setStatuses(INITIAL_STATUSES);

    // Each section tracks its own outcome — a failed request renders an
    // explicit "data unavailable" state instead of silently becoming empty.
    const [ovRes, usersRes, productsRes, summaryRes, eventsRes] = await Promise.allSettled([
      api.get('/admin/overview'),
      api.get('/admin/users'),
      api.get('/admin/cp-products'),
      api.get('/admin/security/summary'),
      api.get('/admin/security/events?limit=50'),
    ]);

    const outcomes: Record<string, SectionStatus> = {
      overview: ovRes.status === 'fulfilled' ? 'loaded' : 'error',
      users: usersRes.status === 'fulfilled' ? 'loaded' : 'error',
      cp: productsRes.status === 'fulfilled' ? 'loaded' : 'error',
      securitySummary: summaryRes.status === 'fulfilled' ? 'loaded' : 'error',
      securityEvents: eventsRes.status === 'fulfilled' ? 'loaded' : 'error',
    };
    setStatuses(outcomes as typeof INITIAL_STATUSES);

    if (ovRes.status === 'fulfilled') {
      const ov: any = ovRes.value?.data || {};
      const signups: any[] = Array.isArray(ov.recentSignups) ? ov.recentSignups : [];
      setOverview({
        users: { total: ov.users?.total || 0, active24h: ov.users?.active24h || 0, byRole: ov.users?.byRole || {} },
        recentSignups: signups.slice(0, 5),
        newSignupsWeek: Number(ov.newSignupsWeek ?? 0),
        totalCpMinted: Number(ov.totalCpMinted ?? 0),
        bootcampEnrollmentRate: Number(ov.bootcampEnrollmentRate ?? 0),
        chainReachable: ov.chainReachable ?? true,
        systemHealth: ov.systemHealth,
      });
    }

    if (usersRes.status === 'fulfilled') {
      setUsers(Array.isArray(usersRes.value?.data) ? (usersRes.value.data as AdminUser[]) : []);
    }

    if (productsRes.status === 'fulfilled') {
      setProducts(Array.isArray(productsRes.value?.data?.items) ? productsRes.value.data.items : []);
    }

    if (summaryRes.status === 'fulfilled') {
      setSecuritySummary((summaryRes.value?.data as Record<string, unknown>) || null);
    }

    if (eventsRes.status === 'fulfilled') {
      setSecurityEvents(Array.isArray(eventsRes.value?.data?.items) ? eventsRes.value.data.items : []);
    }

    if (Object.values(outcomes).some((s) => s === 'error')) setSyncError(t('admin.syncError'));
    setLastSync(new Date().toLocaleTimeString());
    setLoading(false);
  };

  useEffect(() => { void loadAll(); }, []);

  // ── Actions ───────────────────────────────────────────────────────────────────

  const patchUser = async (id: string, payload: Record<string, unknown>, msg: string) => {
    try {
      await api.patch(`/admin/users/${encodeURIComponent(id)}`, payload);
      addToast(msg, 'success');
      await loadAll();
    } catch (e: any) { addToast(e?.response?.data?.error || t('admin.updateFailed'), 'error'); }
  };

  const handleUserBlockToggle = async (target: AdminUser) => {
    const wasBlocked = isUserBlocked(target);
    try {
      const res = await api.patch(`/admin/users/${encodeURIComponent(target.id)}/block`, { blocked: !wasBlocked });
      // The action succeeds even when the audit write failed — surface that
      // as a warning instead of reporting silent success.
      if (res?.data?.audited === false) {
        addToast(t('admin.audit.unauditedWarning'), 'warning');
      } else {
        addToast(wasBlocked ? t('admin.users.unblocked') : t('admin.users.blockedToast'), 'success');
      }
      await loadAll();
    } catch (e: any) {
      addToast(e?.response?.data?.error || t('admin.users.blockFailed'), 'error');
      await loadAll();
    }
  };

  const handleDeleteUserConfirmed = async (target: AdminUser) => {
    try {
      await api.delete(`/admin/users/${encodeURIComponent(target.id)}`);
      addToast(t('admin.users.deletedToast'), 'success');
      await loadAll();
    } catch (e: any) { addToast(e?.response?.data?.error || t('admin.users.deleteFailed'), 'error'); }
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

      if (!form.id && !fileMeta) { addToast(t('admin.market.pdfRequired'), 'error'); return; }

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
        addToast(t('admin.market.productUpdated'), 'success');
      } else {
        await api.post('/admin/cp-products', payload);
        addToast(t('admin.market.productCreated'), 'success');
      }
      await loadAll();
    } catch (e: any) { addToast(e?.response?.data?.error || t('admin.market.productSaveFailed'), 'error'); }
  };

  const deleteProduct = async (id: string) => {
    setConfirmDeleteProduct(id);
  };

  const handleDeleteProductConfirmed = async () => {
    if (!confirmDeleteProduct) return;
    try { await api.delete(`/admin/cp-products/${encodeURIComponent(confirmDeleteProduct)}`); addToast(t('admin.market.productDeleted'), 'success'); await loadAll(); }
    catch (e: any) { addToast(e?.response?.data?.error || t('admin.market.productDeleteFailed'), 'error'); }
    finally { setConfirmDeleteProduct(null); }
  };

  // ── Tab label lookup ─────────────────────────────────────────────────────────
  const TAB_LABELS: Record<AdminTab, string> = {
    overview: 'Overview',
    users: 'Users', bootcamps: 'Bootcamps',
    zero_day: 'Market', cp: 'Points',
    inbox: 'Inbox', broadcast: 'Broadcast', audit: 'Audit',
    security: 'Security', incidents: 'Incidents',
  };
  const activeLabel = TAB_LABELS[activeTab] ?? '';

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <>
    <SEO title="Admin Dashboard" description="QYVORA administrator control panel." noindex />
    <div className="bg-bg text-text-primary">
      <div
        className="scroll-hover lg:fixed lg:left-0 lg:right-20 lg:bottom-0 lg:top-24 lg:overflow-y-auto lg:overscroll-contain"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="px-3 md:px-4 lg:px-6 pt-8 pb-20 lg:pb-24 space-y-6">

          <LearningOverviewCard
            icon={<Shield className="w-6 h-6 text-on-accent" />}
            title={activeLabel}
            description={loading ? t('admin.syncing') : t('admin.managingDescription', { section: activeLabel.toLowerCase() })}
            stats={overview ? [
              { label: t('admin.tabs.users'), value: String(overview.users.total) },
              { label: t('admin.tabs.market'), value: String(products.length) },
            ] : undefined}
            action={{
              label: loading ? t('admin.syncing') : t('button.refresh'),
              onClick: () => void loadAll(),
              icon: <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />,
            }}
          />

          {/* ── MAIN CONTENT ────────────────────────────────────────────── */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[0,1,2,3].map(i => (
                <div key={i} className="rounded-2xl border border-border/50 bg-bg-card p-5 space-y-3">
                  <div className="h-4 w-24 bg-border/30 rounded animate-pulse" />
                  <div className="h-8 w-20 bg-border/30 rounded animate-pulse" />
                  <div className="h-3 w-32 bg-border/30 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div>
              {/* ── OVERVIEW ──────────────────────────────────────────────── */}
              {activeTab === 'overview' && <OverviewTab data={overview} status={statuses.overview} onRetry={() => void loadAll()} />}

              {/* ── USERS ─────────────────────────────────────────────────── */}
              {activeTab === 'users' && (
                <UsersTab
                  users={users}
                  overview={overview}
                  status={statuses.users}
                  onRetry={() => void loadAll()}
                  addToast={addToast}
                  patchUser={patchUser}
                  handleUserBlockToggle={handleUserBlockToggle}
                  handleDeleteUser={(target) => { setConfirmDeleteUser(target); return Promise.resolve(); }}
                />
              )}

              {/* ── BOOTCAMPS ─────────────────────────────────────────────── */}
              {activeTab === 'bootcamps' && <BootcampAccessPanel addToast={addToast} />}

              {/* ── ZERO-DAY MARKET ───────────────────────────────────────── */}
              {activeTab === 'zero_day' && (
                <ZeroDayMarketTab
                  products={products}
                  status={statuses.cp}
                  onRetry={() => void loadAll()}
                  saveProduct={saveProduct}
                  deleteProduct={deleteProduct}
                />
              )}

              {/* ── POINTS / CP ANALYTICS ────────────────────────────────── */}
              {activeTab === 'cp' && <CpAnalytics users={users} addToast={addToast} />}

              {/* ── INBOX (Contacts + Service Requests) ──────────────────── */}
              {activeTab === 'inbox' && <InboxTab />}

              {/* ── BROADCAST ─────────────────────────────────────────────── */}
              {activeTab === 'broadcast' && <BroadcastTab />}

              {/* ── AUDIT LOG ─────────────────────────────────────────────── */}
              {activeTab === 'audit' && <AuditLogTab />}

              {/* ── INCIDENTS ─────────────────────────────────────────────── */}
              {activeTab === 'incidents' && <IncidentsTab />}

              {/* ── SECURITY ──────────────────────────────────────────────── */}
              {activeTab === 'security' && (
                <SecurityTab
                  securitySummary={securitySummary}
                  securityEvents={securityEvents}
                  summaryStatus={statuses.securitySummary}
                  eventsStatus={statuses.securityEvents}
                  onRetry={() => void loadAll()}
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
      title={t('admin.users.authorizeTermination')}
      description={t('admin.users.deleteConfirm')}
      confirmLabel={t('admin.users.terminate')}
      cancelLabel={t('admin.users.abort')}
      destructive
      onConfirm={() => { if (confirmDeleteUser) void handleDeleteUserConfirmed(confirmDeleteUser); }}
    />

    <ConfirmDialog
      open={confirmDeleteProduct !== null}
      onOpenChange={(open) => { if (!open) setConfirmDeleteProduct(null); }}
      title={t('admin.market.deleteProduct')}
      description={t('admin.market.deleteProductConfirm')}
      confirmLabel={t('button.delete')}
      cancelLabel={t('button.cancel')}
      destructive
      onConfirm={handleDeleteProductConfirmed}
    />
    </>
  );
};

export default AdminDashboardPage;
