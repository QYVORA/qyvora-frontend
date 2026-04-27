import React, { useEffect, useState } from 'react';
import { Bell, CheckCheck, Trash2, Loader2, BellOff } from 'lucide-react';
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
  cp_earned: 'text-accent border-accent/30 bg-accent/5',
  cp_points_granted: 'text-accent border-accent/30 bg-accent/5',
  cp_points_deducted: 'text-red-400 border-red-400/30 bg-red-400/5',
  cp_points_set: 'text-accent border-accent/30 bg-accent/5',
  rank_change: 'text-purple-400 border-purple-400/30 bg-purple-400/5',
  room_completed: 'text-accent border-accent/30 bg-accent/5',
  payment_confirmed: 'text-green-400 border-green-400/30 bg-green-400/5',
  payment_failed: 'text-red-400 border-red-400/30 bg-red-400/5',
  quiz_available: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/5',
  quiz_result: 'text-blue-400 border-blue-400/30 bg-blue-400/5',
  admin_message: 'text-accent border-accent/30 bg-accent/5',
  landing_reward: 'text-accent border-accent/30 bg-accent/5',
};

const PAGE_SIZE = 12;

const Notifications: React.FC = () => {
  const { addToast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(Array.isArray(res.data) ? res.data : []);
      setVisibleCount(PAGE_SIZE);
    } catch {
      setNotifications([]);
      setVisibleCount(PAGE_SIZE);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markRead = async (id: string) => {
    try {
      await api.post(`/notifications/${id}/read`, {});
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
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
  const visibleItems = notifications.slice(0, visibleCount);
  const hasMore = visibleCount < notifications.length;

  return (
    <div className="min-h-screen bg-bg pb-4">
      <div className="max-w-4xl mx-auto px-4 md:px-8 pt-6 md:pt-8">
        <ScrollReveal className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <span className="text-accent text-xs font-bold uppercase tracking-[0.3em] mb-2 block">// COMMS</span>
              <h1 className="text-2xl sm:text-3xl font-black text-text-primary flex flex-wrap items-center gap-2 sm:gap-3">
                Notifications
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-accent text-bg text-xs font-black rounded-full">
                    {unreadCount}
                  </span>
                )}
              </h1>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                disabled={markingAll}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-bg-card border border-border hover:border-accent/40 rounded-lg text-xs font-bold text-text-primary transition-all disabled:opacity-50 whitespace-nowrap"
              >
                {markingAll ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCheck className="w-3.5 h-3.5" />}
                Mark all read
              </button>
            )}
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="p-5 bg-bg-card border border-border rounded-xl animate-pulse">
                <div className="h-3 bg-accent-dim/30 rounded w-1/4 mb-2" />
                <div className="h-4 bg-accent-dim/30 rounded w-2/3 mb-2" />
                <div className="h-3 bg-accent-dim/20 rounded w-full" />
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-20 text-center">
            <BellOff className="w-10 h-10 text-text-muted mx-auto mb-4 opacity-40" />
            <p className="text-text-muted text-sm">No notifications yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {visibleItems.map((n) => {
              const colorCls = TYPE_COLORS[n.type] || 'text-text-primary border-border bg-bg-card';
              return (
                <ScrollReveal key={n.id}>
                  <div
                    className={`relative p-4 sm:p-5 border rounded-xl transition-all ${
                      n.read ? 'bg-bg-card border-border opacity-60' : `${colorCls} border`
                    }`}
                  >
                    {!n.read && (
                      <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-accent" />
                    )}
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-none ${colorCls}`}>
                        <Bell className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1 pr-4">
                          <span className="text-xs font-black text-text-primary uppercase tracking-wide break-words">{n.title}</span>
                          <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest px-1.5 py-0.5 bg-bg border border-border rounded max-w-full">
                            {n.type.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-text-secondary mb-2 break-words">{n.message}</p>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <span className="text-[10px] text-text-muted font-mono">
                            {n.createdAt ? new Date(n.createdAt).toLocaleString() : '—'}
                          </span>
                          {!n.read && (
                            <button
                              onClick={() => markRead(n.id)}
                              className="text-[10px] font-bold text-accent hover:underline inline-flex items-center gap-1 self-start"
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
              <div className="pt-3 text-center">
                <button
                  onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                  className="px-4 py-2 bg-bg-card border border-border hover:border-accent/40 rounded-lg text-xs font-bold text-text-primary transition-all"
                >
                  Load more ({notifications.length - visibleCount} remaining)
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
