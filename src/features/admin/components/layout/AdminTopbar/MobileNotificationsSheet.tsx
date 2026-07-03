import React from 'react';
import { X } from 'lucide-react';
import { BottomSheet, BottomSheetClose, BottomSheetContent } from '../../../../../shared/components/ui/BottomSheet';
import { NotificationItem } from './types';

interface MobileNotificationsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unreadCount: number;
  notifLoading: boolean;
  notificationsPreview: NotificationItem[];
  markAllNotificationsRead: () => void;
}

const MobileNotificationsSheet: React.FC<MobileNotificationsSheetProps> = ({
  open,
  onOpenChange,
  unreadCount,
  notifLoading,
  notificationsPreview,
  markAllNotificationsRead,
}) => (
  <BottomSheet open={open} onOpenChange={onOpenChange}>
    <BottomSheetContent ariaLabel="Notifications" className="z-[70] md:hidden max-h-[75svh] flex flex-col">
      <div className="flex justify-center pt-3 pb-1 flex-none">
        <div className="w-10 h-1 rounded-full bg-border" />
      </div>
      <div className="px-5 py-3 border-b border-border flex items-center justify-between flex-none">
        <div>
          <div className="text-sm font-black uppercase tracking-widest text-text-primary">Notifications</div>
          <div className="text-[10px] text-text-muted">{unreadCount} unread</div>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button onClick={markAllNotificationsRead} className="text-[10px] font-bold text-accent">Mark all read</button>
          )}
          <BottomSheetClose className="p-1.5 text-text-muted hover:text-accent transition-colors">
            <X className="w-5 h-5" />
          </BottomSheetClose>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto divide-y divide-border/50">
        {notifLoading ? (
          <div className="p-5 text-sm text-text-muted text-center">Loading...</div>
        ) : notificationsPreview.length === 0 ? (
          <div className="p-5 text-sm text-text-muted text-center">No notifications yet.</div>
        ) : notificationsPreview.map((item) => (
          <div key={item.id} className={`px-5 py-4 ${item.read ? 'opacity-60' : ''}`} role="listitem">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-text-primary line-clamp-1">{item.title}</span>
              {!item.read && <span className="w-2 h-2 rounded-full bg-accent flex-none" />}
            </div>
            <p className="text-xs text-text-secondary line-clamp-2 mt-1">{item.message}</p>
            <div className="text-[10px] text-text-muted mt-1">
              {item.createdAt ? new Date(item.createdAt).toLocaleString() : '—'}
            </div>
          </div>
        ))}
      </div>
      <div className="px-5 py-4 border-t border-border flex-none">
        <button
          onClick={() => onOpenChange(false)}
          className="block w-full text-center py-3 rounded-xl border border-accent/30 text-sm font-bold text-accent hover:bg-accent-dim transition-colors"
        >
          Close
        </button>
      </div>
    </BottomSheetContent>
  </BottomSheet>
);

export default MobileNotificationsSheet;
