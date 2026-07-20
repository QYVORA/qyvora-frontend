import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, CheckCheck, Loader2, BellOff } from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import api from '../../../core/services/api';
import { useToast } from '../../../core/contexts/ToastContext';
import SEO from '../../../shared/components/SEO';
import { NotificationsSkeleton } from '../components/StudentSkeletons';
import LearningOverviewCard from '../components/learning/LearningOverviewCard';

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
  cp_points_deducted:  'text-red-400 border-red-400/30 bg-red-400/5',
  cp_points_set:       'text-accent border-accent/30 bg-accent/5',
  rank_change:         'text-accent border-accent/30 bg-accent/5',
  room_completed:      'text-accent border-accent/30 bg-accent/5',
  payment_confirmed:   'text-accent border-accent/30 bg-accent/5',
  payment_failed:      'text-red-400 border-red-400/30 bg-red-400/5',
  quiz_available:      'text-accent border-accent/30 bg-accent/5',
  quiz_result:         'text-accent border-accent/30 bg-accent/5',
  admin_message:       'text-accent border-accent/30 bg-accent/5',
  landing_reward:      'text-accent border-accent/30 bg-accent/5',
};

const PAGE_SIZE = 15;

const Notifications: React.FC = () => {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading]             = useState(true);
  const [markingAll, setMarkingAll]       = useState(false);
  const [visibleCount, setVisibleCount]   = useState(PAGE_SIZE);
  const [filter, setFilter]               = useState<'all' | 'unread'>('all');

  useEffect(() => {
    api.get('/notifications')
      .then((res) => setNotifications(Array.isArray(res.data) ? res.data : []))
      .catch(() => { setNotifications([]); addToast(t('toast.notificationsLoadFailed'), 'error'); })
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
  const displayed   = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;
  const visible     = displayed.slice(0, visibleCount);
  const hasMore     = visibleCount < displayed.length;

  // Type breakdown for sidebar
  const typeCounts = notifications.reduce<Record<string, number>>((acc, n) => {
    acc[n.type] = (acc[n.type] || 0) + 1;
    return acc;
  }, {});
  const topTypes = Object.entries(typeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (loading) return <NotificationsSkeleton />;

  return (
    <div className="bg-bg">
      <SEO title={t('student.notificationsPage.seoTitle')} description={t('student.notificationsPage.seoDesc')} noindex />

      {/* Fixed two-column container below topbar */}
      <div className=" px-3 md:px-4 lg:px-6 pt-8 pb-20 lg:pb-24 space-y-6">

        {/* RIGHT MAIN */}
        <div className="w-full flex-1 min-w-0">
          <div className="px-2 sm:px-6 md:px-8 pb-16 lg:px-8 lg:py-6 space-y-6">

            {/* Page header */}
            <LearningOverviewCard
              icon={<Bell className="w-6 h-6 text-bg" />}
              title={t('student.notificationsPage.title')}
              description={t('student.notificationsPage.description')}
              stats={[{ label: t('student.notificationsPage.unread'), value: unreadCount }]}
              action={unreadCount > 0 ? {
                label: t('student.notificationsPage.markAllRead'),
                onClick: markAllRead,
                icon: <CheckCheck className="w-4 h-4" />,
              } : undefined}
            />
            {displayed.length === 0 ? (
              <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-border py-16 text-center">
                <BellOff className="mx-auto mb-4 h-12 w-12 text-text-muted opacity-40" />
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
                      <div className={`relative rounded-2xl border p-5 transition-all ${
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
                                {n.createdAt ? new Date(n.createdAt).toLocaleString() : '—'}
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
                      className="px-4 py-2 bg-bg-card border border-border hover:border-accent/40 rounded-lg text-xs font-bold text-text-primary transition-all"
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
  );
};

export default Notifications;
