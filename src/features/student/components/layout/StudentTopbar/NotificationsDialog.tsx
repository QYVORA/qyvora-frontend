import React from 'react';
import { CheckCheck } from 'lucide-react';
import { Dialog, DialogContent } from '@/shared/components/ui/Dialog';
import Button from '@/shared/components/ui/Button';
import NotificationList from '@/shared/components/notifications/NotificationList';
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
      <DialogContent title="Notifications" maxWidth="max-w-lg">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-bold uppercase tracking-widest text-text-muted">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </span>
          {unreadCount > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={markAllNotificationsRead}
              icon={<CheckCheck className="h-4 w-4" />}
              className="text-accent hover:text-accent"
            >
              Mark all read
            </Button>
          )}
        </div>

        <NotificationList
          className="mt-4"
          items={notificationsPreview}
          loading={notifLoading}
          onMarkRead={onMarkRead}
          emptyTitle="Nothing here yet."
          emptyMessage="Mission updates and alerts will land here."
        />

        <Button
          variant="secondary"
          to="/dashboard/notifications"
          onClick={() => onOpenChange(false)}
          className="mt-5 w-full"
        >
          View all notifications
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationsDialog;
