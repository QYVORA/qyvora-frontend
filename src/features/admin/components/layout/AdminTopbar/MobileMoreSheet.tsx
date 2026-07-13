import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { IconX } from '@/shared/components/icons';
import { MOBILE_MORE } from './navGroups';
import { AnimatePresence, motion } from 'motion/react';

interface MobileMoreSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
  handleLogout: () => void;
}

const MobileMoreSheet: React.FC<MobileMoreSheetProps> = ({
  open,
  onOpenChange,
  user,
  handleLogout,
}) => {
  const location = useLocation();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="md:hidden fixed bottom-0 left-0 right-0 z-[70] bg-bg-card border-t border-border rounded-t-2xl"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 5rem)' }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <span className="text-sm font-black uppercase tracking-widest text-text-primary">More</span>
              <button
                onClick={() => onOpenChange(false)}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-border text-text-muted hover:text-accent transition-colors"
                aria-label="Close"
              >
                <IconX size={16} />
              </button>
            </div>
            <nav className="grid grid-cols-3 gap-2 p-4">
              {MOBILE_MORE.map((item) => {
                const active = location.pathname === item.path || new URLSearchParams(location.search).get('tab') === item.path.split('tab=')[1]?.split('&')[0];
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => onOpenChange(false)}
                    className={`flex flex-col items-center gap-1.5 rounded-2xl border px-3 py-4 transition-colors ${
                      active
                        ? 'border-accent/30 bg-accent-dim text-accent'
                        : 'border-border bg-bg text-text-muted hover:border-accent/20 hover:text-text-primary'
                    }`}
                  >
                    <item.icon size={20} />
                    <span className="text-[10px] font-bold uppercase tracking-wide">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="px-4 pb-2 border-t border-border pt-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-dim text-xs font-black text-accent">
                  {(user?.email || user?.username || 'A').substring(0, 1).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-xs font-bold text-text-primary">{user?.username || 'Admin'}</div>
                  <div className="truncate text-[10px] text-text-muted">{user?.email || ''}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase text-text-muted border border-border rounded-xl hover:text-red-400 hover:border-red-500/30 transition-colors shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMoreSheet;
