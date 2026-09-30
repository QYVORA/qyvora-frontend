import React from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent } from '@/shared/components/ui/Dialog';
import { NotificationItem } from './types';

interface NotificationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unreadCount: number;
  notifLoading: boolean;
  notificationsPreview: NotificationItem[];
  markAllNotificationsRead: () => void;
  onMarkRead: (id: string) => void;
}

const NotificationsDialog: React.FC<NotificationsDialogProps> = ({
  open,
  onOpenChange,
  unreadCount,
  notifLoading,
  notificationsPreview,
  markAllNotificationsRead,
  onMarkRead,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title={"Notifications"}>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-text-muted">{`${unreadCount} unread`}</span>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllNotificationsRead}
              className="min-h-[44px] px-2 text-xs font-bold text-accent hover:text-accent/80 transition-colors"
            >
              {"Mark all as read"}
            </button>
          )}
        </div>

        <div className="mt-2">
          {notifLoading ? (
            <div className="p-5 text-sm text-text-muted text-center">
              <Loader2 className="h-6 w-6 animate-spin inline-block" /> {" Loading…"}
            </div>
          ) : notificationsPreview.length === 0 ? (
            <div className="p-5 text-sm text-text-muted text-center">{"No notifications yet."}</div>
          ) : (
            <ul className="divide-y divide-border-subtle">
              {notificationsPreview.map((item) => (
                <li
                  key={item.id}
                  onClick={() => { if (!item.read) onMarkRead(item.id); }}
                  onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && !item.read) { e.preventDefault(); onMarkRead(item.id); } }}
                  role="button"
                  tabIndex={0}
                  aria-label={item.read ? `${item.title} - read` : `${item.title} - unread`}
                  className={`cursor-pointer py-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent ${item.read ? 'opacity-60' : 'hover:bg-accent-dim/20'}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-text-primary line-clamp-1">{item.title}</span>
                    {!item.read && <span className="w-2 h-2 rounded-full bg-accent flex-none" />}
                  </div>
                  <p className="text-xs text-text-secondary line-clamp-2 mt-1">{item.message}</p>
                  <div className="text-xs text-text-muted mt-1">
                    {item.createdAt ? new Date(item.createdAt).toLocaleString() : '-'}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Link
          to="/dashboard/notifications"
          onClick={() => onOpenChange(false)}
          className="mt-4 block w-full text-center py-3 rounded-xl border border-accent/30 text-sm font-bold text-accent hover:bg-accent-dim transition-colors"
        >
          {"View all notifications"}
        </Link>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationsDialog;