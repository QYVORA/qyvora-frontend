import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { IconX } from '@/shared/components/icons';
import { BottomSheet, BottomSheetClose, BottomSheetContent } from '../../../../../shared/components/ui/BottomSheet';
import { MOBILE_MORE } from './mobileNav';

interface MobileMoreSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
  unreadCount: number;
  handleLogout: () => void;
}

const MobileMoreSheet: React.FC<MobileMoreSheetProps> = ({
  open,
  onOpenChange,
  user,
  unreadCount,
  handleLogout,
}) => {
  const location = useLocation();

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange}>
      <BottomSheetContent ariaLabel="Account and navigation options">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl border border-border bg-accent-dim flex items-center justify-center text-accent font-black text-sm">
              {user?.username?.substring(0, 2).toUpperCase() || user?.email?.substring(0, 2).toUpperCase() || '??'}
            </div>
            <div>
              <div className="text-sm font-black text-text-primary uppercase tracking-widest">{user?.username || user?.email?.split('@')[0] || '—'}</div>
              <div className="text-[10px] text-text-muted">{user?.rank || 'Candidate'}</div>
            </div>
          </div>
          <BottomSheetClose className="p-2 text-text-muted hover:text-accent transition-colors">
            <IconX size={20} />
          </BottomSheetClose>
        </div>

        {/* Nav grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4">
          {MOBILE_MORE.map((item) => {
            const active = location.pathname === item.path;
            const isNotif = item.path === '/dashboard/notifications';
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => onOpenChange(false)}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all active:scale-95 ${
                  active ? 'bg-accent-dim border-accent/30 text-accent' : 'bg-bg border-border text-text-muted hover:border-accent/30 hover:text-accent'
                }`}
              >
                <item.icon className="w-6 h-6" />
                <span className="text-[11px] font-bold uppercase tracking-wide text-center leading-tight">{item.label}</span>
                {isNotif && unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-4 h-4 bg-accent text-bg text-[9px] font-black rounded-full flex items-center justify-center leading-none">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Bottom actions */}
        <div className="px-4 pb-4 space-y-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-red-400/20 text-red-400 text-sm font-bold uppercase tracking-widest hover:bg-red-400/10 transition-all active:scale-95"
          >
            <LogOut className="w-4 h-4" /> Log Out
          </button>
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
};

export default MobileMoreSheet;
