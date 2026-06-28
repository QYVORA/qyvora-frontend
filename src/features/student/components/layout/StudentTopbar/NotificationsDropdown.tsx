import React from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { NotificationItem } from './types';

interface NotificationsDropdownProps {
  open: boolean;
  onClose: () => void;
  unreadCount: number;
  notifLoading: boolean;
  notificationsPreview: NotificationItem[];
  markAllNotificationsRead: () => void;
  onMarkRead: (id: string) => void;
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  open,
  onClose,
  unreadCount,
  notifLoading,
  notificationsPreview,
  markAllNotificationsRead,
  onMarkRead,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="hidden md:block absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-bg-card shadow-2xl z-[80] overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-text-primary">Notifications</div>
              <div className="text-[10px] text-text-muted">{unreadCount} unread</div>
            </div>
            {unreadCount > 0 && (
              <button onClick={markAllNotificationsRead} className="text-[10px] font-bold text-accent hover:underline whitespace-nowrap">
                Mark all read
              </button>
            )}
          </div>
          {notifLoading ? (
            <div className="p-4 text-xs text-text-muted"><Loader2 className="h-5 w-5 animate-spin inline-block mr-2" />Loading...</div>
          ) : notificationsPreview.length === 0 ? (
            <div className="p-4 text-xs text-text-muted">No notifications yet.</div>
          ) : (
            <div className="max-h-80 overflow-auto divide-y divide-border/50">
              {notificationsPreview.map((item) => (
                <div
                  key={item.id}
                  className={`px-4 py-3 cursor-pointer transition-colors ${item.read ? 'opacity-60' : 'hover:bg-accent-dim/30'}`}
                  onClick={() => { if (!item.read) onMarkRead(item.id); }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-text-primary line-clamp-1">{item.title}</span>
                    {!item.read && <span className="w-1.5 h-1.5 rounded-full bg-accent flex-none" />}
                  </div>
                  <p className="text-[11px] text-text-secondary line-clamp-2 mt-0.5">{item.message}</p>
                  <div className="text-[10px] text-text-muted mt-1">
                    {item.createdAt ? new Date(item.createdAt).toLocaleString() : '—'}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="px-4 py-3 border-t border-border">
            <Link to="/dashboard/notifications" onClick={onClose} className="block w-full text-center text-xs font-bold text-accent hover:underline">
              View all notifications
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationsDropdown;
