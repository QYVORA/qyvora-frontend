import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Bell, CheckCheck, Loader2 } from 'lucide-react';
import ScrollReveal from '@/shared/components/ScrollReveal';
import api from '@/core/services/api';
import { useToast } from '@/core/contexts/ToastContext';
import SEO from '@/shared/components/SEO';
import ErrorState from '@/shared/components/ui/ErrorState';
import EmptyState from '@/shared/components/ui/EmptyState';
import PageHeader from '@/shared/components/ui/PageHeader';
import Button from '@/shared/components/ui/Button';
import { NotificationsSkeleton } from '../components/StudentSkeletons';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  metadata?: Record<string, any>;
}

const TYPE_COLORS: Record<string, string> = {
  cp_earned:           'text-accent border-accent/30 bg-accent/5',
  cp_points_granted:   'text-accent border-accent/30 bg-accent/5',
  cp_points_deducted:  'text-danger border-danger/30 bg-danger/5',
  cp_points_set:       'text-accent border-accent/30 bg-accent/5',
  rank_change:         'text-accent border-accent/30 bg-accent/5',
  room_completed:      'text-accent border-accent/30 bg-accent/5',
  payment_confirmed:   'text-accent border-accent/30 bg-accent/5',
  payment_failed:      'text-danger border-danger/30 bg-danger/5',
  quiz_available:      'text-accent border-accent/30 bg-accent/5',
  quiz_result:         'text-accent border-accent/30 bg-accent/5',
  admin_message:       'text-accent border-accent/30 bg-accent/5',
  landing_reward:      'text-accent border-accent/30 bg-accent/5',
};

const PAGE_SIZE = 15;

type Filter = 'all' | 'unread' | 'system' | 'achievement';

const ACHIEVEMENT_TYPES = new Set([
  'cp_earned',
  'rank_change',
  'room_completed',
  'room_complete',
  'quiz_result',
  'landing_reward',
]);

const FILTER_KEYS: Filter[] = ['all', 'unread', 'system', 'achievement'];

const matchesFilter = (n: Notification, filter: Filter): boolean => {
  switch (filter) {
    case 'all': return true;
    case 'unread': return !n.read;
    case 'achievement': return ACHIEVEMENT_TYPES.has(n.type);
    case 'system': return !ACHIEVEMENT_TYPES.has(n.type);
  }
};

const Notifications: React.FC = () => {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading]             = useState(true);
  const [fetchError, setFetchError]       = useState(false);
  const [markingAll, setMarkingAll]       = useState(false);
  const [visibleCount, setVisibleCount]   = useState(PAGE_SIZE);
  const [searchParams]                    = useSearchParams();

  const filterParam = searchParams.get('filter') || 'all';
  const filter: Filter = (FILTER_KEYS as string[]).includes(filterParam) ? filterParam as Filter : 'all';

  useEffect(() => {
    api.get('/notifications')
      .then((res) => setNotifications(Array.isArray(res.data) ? res.data : []))
      .catch(() => { setNotifications([]); setFetchError(true); addToast(t('toast.notificationsLoadFailed'), 'error'); })
      .finally(() => setLoading(false));
  }, []);

  const markRead = async (id: string) => {
    try {
      await api.post(`/notifications/${id}/read`, {});
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    } catch {
      addToast(t('toast.markReadError'), 'error');
    }
  };

  const markAllRead = async () => {
    setMarkingAll(true);
    try {
      await api.post('/notifications/read-all', {});
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      addToast(t('toast.markAllSuccess'), 'success');
    } catch {
      addToast(t('toast.markAllError'), 'error');
    } finally {
      setMarkingAll(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const displayed   = notifications.filter((n) => matchesFilter(n, filter));
  const visible     = displayed.slice(0, visibleCount);
  const hasMore     = visibleCount < displayed.length;

  if (loading) return <NotificationsSkeleton />;

  if (fetchError) {
    return (
      <div className="min-h-full bg-canvas">
        <SEO title={t('student.notificationsPage.seoTitle', 'Notifications')} description={t('student.notificationsPage.seoDesc', 'Notification inbox.')} />
        <div className="w-full px-3 pb-16 pt-6 md:px-4 md:pb-20 md:pt-8 lg:px-6 lg:pb-24">
          <PageHeader title={t('student.notificationsPage.title', 'Notifications')} />
          <div className="mt-8">
            <ErrorState title={t('student.notificationsPage.fetchError', 'Failed to load notifications.')} message={t('student.notificationsPage.fetchErrorDesc', 'Check your connection and try again.')} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-canvas">
      <SEO title={t('student.notificationsPage.seoTitle')} description={t('student.notificationsPage.seoDesc')} noindex />

      <div className="w-full px-3 pb-16 pt-6 md:px-4 md:pb-20 md:pt-8 lg:px-6 lg:pb-24">
        <PageHeader
          kicker={t('student.notificationsPage.eyebrow', 'Inbox')}
          title={t('student.notificationsPage.title')}
          description={t('student.notificationsPage.description')}
          metadata={
            <span className="type-meta">
              <span className="font-bold text-accent">{unreadCount}</span>
              {' '}{t('student.notificationsPage.unread')}
            </span>
          }
          actions={
            unreadCount > 0 ? (
              <Button variant="secondary" onClick={markAllRead} disabled={markingAll}>
                {markingAll ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCheck className="h-4 w-4" />}
                {t('student.notificationsPage.markAllRead')}
              </Button>
            ) : undefined
          }
        />

        {displayed.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              icon={<Bell className="h-6 w-6" />}
              title={filter === 'unread' ? t('student.notificationsPage.empty.unread') : t('student.notificationsPage.empty.all')}
            />
          </div>
        ) : (
          <div className="mt-8 space-y-3">
            {visible.map((n) => {
              const colorCls = TYPE_COLORS[n.type] || 'text-text-primary border-border bg-bg-card';
              return (
                <ScrollReveal key={n.id}>
                  <div className={`relative rounded-2xl border p-5 transition-[background-color,border-color,opacity] duration-[var(--dur-base)] ease-[var(--ease-smooth)] ${
                    n.read ? 'border-border bg-bg-card opacity-60' : `${colorCls} border`
                  }`}>
                    {!n.read && (
                      <div className="absolute right-4 top-4 h-2 w-2 rounded-full bg-accent" />
                    )}
                    <div className="flex items-start gap-3">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${colorCls}`}>
                        <Bell className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex flex-wrap items-center gap-2 break-words pr-4">
                          <span className="text-xs font-black uppercase tracking-wide text-text-primary">{n.title}</span>
                          <span className="type-meta rounded border border-border bg-bg px-1.5 py-0.5">
                            {n.type.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="mb-2 break-words text-sm text-text-secondary">{n.message}</p>
                        <div className="flex items-center justify-between gap-2">
                          <span className="type-meta font-mono">
                            {n.createdAt ? new Date(n.createdAt).toLocaleString() : '-'}
                          </span>
                          {!n.read && (
                            <button
                              onClick={() => markRead(n.id)}
                              className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline"
                            >
                              <CheckCheck className="h-3 w-3" /> {t('student.notificationsPage.markRead')}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}

            {hasMore && (
              <div className="pt-2 text-center">
                <button
                  onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                  className="min-h-[44px] rounded-xl border border-border bg-bg-card px-4 text-xs font-bold text-text-primary transition-colors hover:border-accent/40"
                >
                  {t('student.notificationsPage.loadMore', { count: displayed.length - visibleCount })}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;