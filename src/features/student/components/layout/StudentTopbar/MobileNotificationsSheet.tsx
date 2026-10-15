import React from 'react';
import { IconX } from '@/shared/components/icons';
import { BottomSheet, BottomSheetClose, BottomSheetContent } from '@/shared/components/ui/BottomSheet';
import Button from '@/shared/components/ui/Button';
import NotificationList from '@/shared/components/notifications/NotificationList';
import { NotificationItem } from './types';

interface MobileNotificationsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unreadCount: number;
  notifLoading: boolean;
  notificationsPreview: NotificationItem[];
  markAllNotificationsRead: () => void;
  onMarkRead: (id: string) => void;
}

const MobileNotificationsSheet: React.FC<MobileNotificationsSheetProps> = ({
  open,
  onOpenChange,
  unreadCount,
  notifLoading,
  notificationsPreview,
  markAllNotificationsRead,
  onMarkRead,
}) => {
  return (
    <BottomSheet open={open} onOpenChange={onOpenChange}>
      <BottomSheetContent ariaLabel="Notifications" className="lg:hidden max-h-[82svh] flex flex-col">
        <div className="flex justify-center pt-3 pb-1 flex-none">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        <div className="flex items-center justify-between gap-3 border-b border-border-subtle px-5 py-3 flex-none">
          <div className="min-w-0">
            <h2 className="text-sm font-black uppercase tracking-widest text-text-primary">
              Notifications
            </h2>
            <p className="text-xs text-text-muted">
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllNotificationsRead}
                className="min-h-[44px] px-2 text-xs font-bold text-accent transition-colors hover:text-accent/80"
              >
                Mark all read
              </button>
            )}
            <BottomSheetClose
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-accent-dim/50 hover:text-accent"
              aria-label="Close notifications"
            >
              <IconX size={20} />
            </BottomSheetClose>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <NotificationList
            items={notificationsPreview}
            loading={notifLoading}
            onMarkRead={onMarkRead}
            emptyTitle="Nothing here yet."
            emptyMessage="Mission updates and alerts will land here."
          />
        </div>

        <div className="border-t border-border-subtle px-5 py-4 flex-none">
          <Button
            variant="secondary"
            to="/dashboard/notifications"
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            View all notifications
          </Button>
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
};

export default MobileNotificationsSheet;
