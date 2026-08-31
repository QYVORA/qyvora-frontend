import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'motion/react';
import { LogOut, ArrowRightLeft } from 'lucide-react';
import { IconChevronRight } from '@/shared/components/icons';
import { NAV_GROUPS, type AdminNavItem } from './navGroups';
import { useScrollLock } from '@/core/hooks/useScrollLock';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';

interface AdminNavPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  handleLogout: () => void;
}

const AdminNavPanel: React.FC<AdminNavPanelProps> = ({ open, onOpenChange, handleLogout }) => {
  const { t } = useTranslation();
  const prefersReduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useScrollLock(open);

  const close = () => onOpenChange(false);

  // Escape to close + focus the first link while open (mirrors public Navbar).
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeyDown);
    const tId = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>('a,button')?.focus();
    }, 50);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      window.clearTimeout(tId);
    };
  }, [open]);

  const currentTab = new URLSearchParams(location.search).get('tab') || 'overview';

  const renderItem = (item: AdminNavItem) => {
    const Icon = item.icon;
    const active = item.tab === currentTab;
    return (
      <Link
        key={item.path}
        to={item.path}
        onClick={close}
        aria-current={active ? 'page' : undefined}
        className={`group flex items-start gap-3 rounded-2xl border border-border/50 p-4 text-left transition-colors focus:outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-accent active:scale-[0.99] ${
          active
            ? 'border-accent/40 bg-accent-dim/30'
            : 'bg-bg-card text-text-primary hover:border-accent/50 hover:bg-accent-dim/10'
        }`}
      >
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
          active ? 'bg-accent text-on-accent' : 'bg-bg-elevated text-accent group-hover:bg-accent/10'
        }`}>
          <Icon size={20} strokeWidth={2.25} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-black uppercase tracking-widest text-text-primary">{t(item.labelKey)}</span>
          <span className="mt-1 block text-xs leading-relaxed text-text-muted">{t(item.descKey)}</span>
        </span>
        <IconChevronRight size={14} className="shrink-0 text-text-muted/30 transition-colors group-hover:text-accent" />
      </Link>
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[95] bg-black/50"
            onClick={close}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            id="admin-nav-panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={t('nav.more')}
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 1 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 top-20 bottom-0 z-[96] overflow-y-auto bg-bg-alt md:top-24"
          >
            <div className="w-full px-3 pb-10 pt-3 md:px-4 md:pt-4 lg:px-6">
              <div className="space-y-6 md:space-y-8">
                {NAV_GROUPS.map((group) => (
                  <section key={group.titleKey}>
                    <h3 className="mb-2.5 text-[10px] font-black uppercase tracking-[0.25em] text-accent md:mb-3">
                      {t(group.titleKey)}
                    </h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {group.items.map(renderItem)}
                    </div>
                  </section>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-col gap-3 md:mt-8 sm:flex-row">
                <Link
                  to="/dashboard"
                  onClick={close}
                  className="flex flex-1 items-center justify-center gap-2.5 rounded-2xl border border-accent/50 px-6 py-3.5 text-sm font-bold uppercase tracking-widest text-accent transition-colors hover:bg-accent/10 active:scale-[0.98]"
                >
                  <ArrowRightLeft className="h-4 w-4" /> {t('nav.operator')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex flex-1 items-center justify-center gap-2.5 rounded-2xl border border-danger/20 px-6 py-3.5 text-sm font-bold uppercase tracking-widest text-danger transition-colors hover:bg-danger/10 active:scale-[0.98]"
                >
                  <LogOut className="h-4 w-4" /> {t('button.logOut')}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AdminNavPanel;