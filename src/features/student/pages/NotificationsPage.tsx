import React, { useEffect, useState } from 'react';
import { Bell, CheckCheck, Loader2, BellOff } from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import api from '../../../core/services/api';
import { useToast } from '../../../core/contexts/ToastContext';

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
  rank_change:         'text-purple-400 border-purple-400/30 bg-purple-400/5',
  room_completed:      'text-accent border-accent/30 bg-accent/5',
  payment_confirmed:   'text-green-400 border-green-400/30 bg-green-400/5',
  payment_failed:      'text-red-400 border-red-400/30 bg-red-400/5',
  quiz_available:      'text-yellow-400 border-yellow-400/30 bg-yellow-400/5',
  quiz_result:         'text-blue-400 border-blue-400/30 bg-blue-400/5',
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
      .catch(() => setNotifications([]))
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

  return (
    <div className="min-h-screen bg-bg pb-12">
      <div className="mx-auto max-w-7xl px-4 pt-8 md:px-8 md:pt-10">

        <ScrollReveal className="mb-10 md:mb-12">
          <span className="mb-3 block text-xs font-black uppercase tracking-[0.35em] text-accent md:text-sm">Comms</span>
          <h1 className="text-4xl font-black text-text-primary md:text-6xl">Notifications</h1>
          <p className="mt-2 max-w-lg text-base text-text-muted">System alerts and mission updates.</p>
        </ScrollReveal>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

          {/* ── LEFT COLUMN ── */}
          <div className="w-full lg:w-72 xl:w-80 flex-none space-y-4">

            {/* Unread badge */}
            <ScrollReveal>
              <div className="relative overflow-hidden rounded-3xl border-2 border-accent/25 bg-accent-dim p-6">
                <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-accent/20 blur-3xl" aria-hidden />
                <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-1">Unread</p>
                  <div className="text-5xl font-black text-accent font-mono mb-4">
                    {loading ? '—' : unreadCount}
                  </div>
                  <p className="text-xs text-text-secondary">
                    {notifications.length} total notification{notifications.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Filter */}
            <ScrollReveal>
              <div className="rounded-2xl border-2 border-border bg-bg-card overflow-hidden">
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Filter</p>
                </div>
                <div className="p-2 space-y-1">
                  {(['all', 'unread'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => { setFilter(f); setVisibleCount(PAGE_SIZE); }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                        filter === f
                          ? 'bg-accent-dim border border-accent/30 text-accent'
                          : 'text-text-secondary hover:bg-accent-dim/30 hover:text-text-primary'
                      }`}
                    >
                      <span>{f === 'all' ? 'All' : 'Unread only'}</span>
                      <span className="font-mono text-[10px]">
                        {f === 'all' ? notifications.length : unreadCount}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Mark all read */}
            {unreadCount > 0 && (
              <ScrollReveal>
                <button
                  onClick={markAllRead}
                  disabled={markingAll}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-bg-card border-2 border-border hover:border-accent/40 rounded-2xl text-xs font-bold text-text-primary transition-all disabled:opacity-50"
                >
                  {markingAll
                    ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Marking...</>
                    : <><CheckCheck className="w-3.5 h-3.5" /> Mark all read</>}
                </button>
              </ScrollReveal>
            )}

            {/* Type breakdown */}
            {topTypes.length > 0 && (
              <ScrollReveal>
                <div className="rounded-2xl border-2 border-border bg-bg-card overflow-hidden">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">By Type</p>
                  </div>
                  <div className="p-3 space-y-1.5">
                    {topTypes.map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between px-2 py-1.5">
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider truncate">
                          {type.replace(/_/g, ' ')}
                        </span>
                        <span className="text-[10px] font-mono font-black text-accent ml-2 shrink-0">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

          </div>{/* end left */}

          {/* ── RIGHT COLUMN ── */}
          <div className="w-full flex-1 min-w-0">
            {loading ? (
              <div className="space-y-3">
                {[0, 1, 2, 3].map((i) => (
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
          </div>{/* end right */}

        </div>
      </div>
    </div>
  );
};

export default Notifications;
