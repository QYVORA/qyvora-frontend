import React, { useEffect, useState } from 'react';
import { Bell, CheckCheck, Loader2, BellOff } from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import api from '../../../core/services/api';
import { useToast } from '../../../core/contexts/ToastContext';
import SEO from '../../../shared/components/SEO';
import PageLoader from '../../../shared/components/PageLoader';

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
  const { addToast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading]             = useState(true);
  const [markingAll, setMarkingAll]       = useState(false);
  const [visibleCount, setVisibleCount]   = useState(PAGE_SIZE);
  const [filter, setFilter]               = useState<'all' | 'unread'>('all');

  useEffect(() => {
    api.get('/notifications')
      .then((res) => setNotifications(Array.isArray(res.data) ? res.data : []))
      .catch(() => { setNotifications([]); addToast('Failed to load notifications', 'error'); })
      .finally(() => setLoading(false));
  }, []);

  const markRead = async (id: string) => {
    try {
      await api.post(`/notifications/${id}/read`, {});
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    } catch {
      addToast('Could not mark as read.', 'error');
    }
  };

  const markAllRead = async () => {
    setMarkingAll(true);
    try {
      await api.post('/notifications/read-all', {});
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      addToast('All notifications marked as read.', 'success');
    } catch {
      addToast('Could not mark all as read.', 'error');
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

  if (loading) return <PageLoader />;

  return (
    <div className="bg-bg">
      <SEO title="Notifications" description="System alerts, mission updates, and activity notifications on QYVORA." />
      {/* Mobile-first header (right section header shown before sidebar content) */}
<div className="px-2 sm:px-6 md:px-8 pt-6 lg:hidden">
         <ScrollReveal className="mb-8">
           <div className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-accent">
             Inbox
           </div>
           <h1 className="text-4xl font-black text-text-primary md:text-6xl">Notifications</h1>
           <p className="mt-2 max-w-lg text-base text-text-muted">System alerts and mission updates.</p>
         </ScrollReveal>
       </div>

      {/* Fixed two-column container below topbar */}
      <div className="mx-auto max-w-5xl px-4 md:px-6 lg:px-8 pt-8 pb-20 lg:pb-24 space-y-6">

        {/* RIGHT MAIN */}
        <div
          className="w-full flex-1 min-w-0 lg:h-full lg:overflow-y-auto lg:overscroll-contain scroll-hover"
          style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent 0px, black 24px)', maskImage: 'linear-gradient(to bottom, transparent 0px, black 24px)' }}
        >
          <div className="px-2 sm:px-6 md:px-8 pb-16 lg:px-8 lg:py-6">

            {/* Page header */}
<ScrollReveal className="mb-10 md:mb-12 hidden lg:block">
               <div className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-accent">
                 Notifications
               </div>
               <h1 className="text-4xl font-black text-text-primary md:text-6xl">Notifications</h1>
               <p className="mt-2 max-w-lg text-base text-text-muted">System alerts and mission updates.</p>
             </ScrollReveal>
            {loading ? (
              <div className="space-y-3">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((i) => (
                  <div key={i} className="animate-pulse rounded-2xl border border-border bg-bg-card p-5">
                    <div className="h-3 bg-accent-dim/30 rounded w-1/4 mb-2" />
                    <div className="h-4 bg-accent-dim/30 rounded w-2/3 mb-2" />
                    <div className="h-3 bg-accent-dim/20 rounded w-full" />
                  </div>
                ))}
              </div>
            ) : displayed.length === 0 ? (
              <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-border py-16 text-center">
                <BellOff className="mx-auto mb-4 h-12 w-12 text-text-muted opacity-40" />
                <p className="text-base text-text-muted">
                  {filter === 'unread' ? 'No unread notifications.' : 'No notifications yet — you\'re clear.'}
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
                              <span className="text-xs font-black text-text-primary uppercase tracking-wide">{n.title}</span>
                              <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest px-1.5 py-0.5 bg-bg border border-border rounded">
                                {n.type.replace(/_/g, ' ')}
                              </span>
                            </div>
                            <p className="text-sm text-text-secondary mb-2">{n.message}</p>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] text-text-muted font-mono">
                                {n.createdAt ? new Date(n.createdAt).toLocaleString() : '—'}
                              </span>
                              {!n.read && (
                                <button
                                  onClick={() => markRead(n.id)}
                                  className="text-[10px] font-bold text-accent hover:underline inline-flex items-center gap-1"
                                >
                                  <CheckCheck className="w-3 h-3" /> Mark read
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
                      Load more ({displayed.length - visibleCount} remaining)
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
