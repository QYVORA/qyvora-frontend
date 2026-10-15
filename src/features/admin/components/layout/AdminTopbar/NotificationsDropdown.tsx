import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Button from '@/shared/components/ui/Button';
import NotificationList from '@/shared/components/notifications/NotificationList';
import { NotificationItem } from './types';

interface NotificationsDropdownProps {
  open: boolean;
  onClose: () => void;
  unreadCount: number;
  notifLoading: boolean;
  notificationsPreview: NotificationItem[];
  markAllNotificationsRead: () => void;
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  open,
  onClose,
  unreadCount,
  notifLoading,
  notificationsPreview,
  markAllNotificationsRead,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-label="Notifications"
          className="hidden md:block absolute right-0 top-full z-[80] mt-2 w-96 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--elevation-raised)]"
        >
          <div className="flex items-center justify-between gap-3 border-b border-border-subtle px-4 py-3">
            <div className="min-w-0">
              <h3 className="text-xs font-black uppercase tracking-widest text-text-primary">
                Notifications
              </h3>
              <p className="text-xs text-text-muted">
                {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllNotificationsRead}
                className="whitespace-nowrap text-xs font-bold text-accent transition-colors hover:text-accent/80"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto p-3">
            <NotificationList
              dense
              items={notificationsPreview}
              loading={notifLoading}
              emptyTitle="No new notifications"
              emptyMessage="You're all caught up."
            />
          </div>

          <div className="border-t border-border-subtle px-3 py-2">
            <Button variant="ghost" size="sm" onClick={onClose} className="w-full">
              Close
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationsDropdown;
