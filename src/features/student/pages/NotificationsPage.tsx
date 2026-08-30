import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Bell, CheckCheck, Loader2 } from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import api from '../../../core/services/api';
import { useToast } from '../../../core/contexts/ToastContext';
import SEO from '../../../shared/components/SEO';
import FadeIn from '../../../shared/components/ui/FadeIn';
import ErrorState from '../../../shared/components/ui/ErrorState';
import { NotificationsSkeleton } from '../components/StudentSkeletons';
import StudentHeroSection from '@/shared/components/StudentHeroSection';
import Dobia from '@/shared/components/Dobia';

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
      <div className="min-h-full">
        <SEO title={t('student.notificationsPage.seoTitle', 'Notifications')} description={t('student.notificationsPage.seoDesc', 'Notification inbox.')} />
        <div className="bg-bg px-3 md:px-4 lg:px-6 pt-8 pb-10">
          <h1 className="text-3xl font-black uppercase tracking-tight text-text-primary">{t('student.notificationsPage.title', 'Notifications')}</h1>
        </div>
        <div className="bg-bg-alt px-3 md:px-4 lg:px-6 py-10 pb-20 lg:pb-24">
          <ErrorState title={t('student.notificationsPage.fetchError', 'Failed to load notifications.')} message={t('student.notificationsPage.fetchErrorDesc', 'Check your connection and try again.')} />
        </div>
      </div>
    );
  }

  return (
    <FadeIn>
    <div className="min-h-full">
      <SEO title={t('student.notificationsPage.seoTitle')} description={t('student.notificationsPage.seoDesc')} noindex />

      <div className="bg-bg px-3 md:px-4 lg:px-6 pt-8 pb-10">
        <StudentHeroSection
          fullHeight={false}
          title={t('student.notificationsPage.title')}
          description={t('student.notificationsPage.description')}
          stats={[{ label: t('student.notificationsPage.unread'), value: unreadCount }]}
        >
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="btn-primary inline-flex items-center gap-2 px-6 py-2.5"
            >
              <CheckCheck className="w-4 h-4" />
              {t('student.notificationsPage.markAllRead')}
            </button>
          )}
        </StudentHeroSection>
      </div>

      <div className="bg-bg-alt px-3 md:px-4 lg:px-6 py-10 pb-20 lg:pb-24">
        <div className="w-full flex-1 min-w-0">
          <div className="px-2 sm:px-6 md:px-8 lg:px-8 space-y-6">
            {displayed.length === 0 ? (
              <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-border py-16 text-center">
                <div className="mx-auto mb-4">
                  <Dobia expression="confused" size="lg" />
                </div>
                <p className="text-base text-text-muted">
                  {filter === 'unread' ? t('student.notificationsPage.empty.unread') : t('student.notificationsPage.empty.all')}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {visible.map((n) => {
                  const colorCls = TYPE_COLORS[n.type] || 'text-text-primary border-border bg-bg-card';
                  return (
                    <ScrollReveal key={n.id}>
                      <div className={`relative rounded-2xl border p-5 transition-[background-color,border-color,opacity] duration-[var(--dur-base)] ease-[var(--ease-smooth)] ${
                        n.read ? 'bg-bg-card border-border opacity-60' : `${colorCls} border`
                      }`}>
                        {!n.read && (
                          <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-accent" />
                        )}
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-none shrink-0 ${colorCls}`}>
                            <Bell className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1 pr-4">
                              <span className="text-xs font-black text-text-primary uppercase tracking-wide break-words">{n.title}</span>
                              <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest px-1.5 py-0.5 bg-bg border border-border rounded">
                                {n.type.replace(/_/g, ' ')}
                              </span>
                            </div>
                            <p className="text-sm text-text-secondary mb-2 break-words">{n.message}</p>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] text-text-muted font-mono">
                                {n.createdAt ? new Date(n.createdAt).toLocaleString() : '-'}
                              </span>
                              {!n.read && (
                                <button
                                  onClick={() => markRead(n.id)}
                                  className="text-[10px] font-bold text-accent hover:underline inline-flex items-center gap-1"
                                >
                                  <CheckCheck className="w-3 h-3" /> {t('student.notificationsPage.markRead')}
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
                      className="px-4 py-2 bg-bg-card border border-border hover:border-accent/40 rounded-lg text-xs font-bold text-text-primary transition-[border-color] duration-[var(--dur-base)] ease-[var(--ease-smooth)]"
                    >
                      {t('student.notificationsPage.loadMore', { count: displayed.length - visibleCount })}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>{/* end right main inner */}
        </div>{/* end right main */}
      </div>{/* end two-col */}
    </div>
    </FadeIn>
  );
};

export default Notifications;
