import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { IconArrowLeft, IconCheck, IconLock, IconX } from '@/shared/components/icons';
import { useScrollLock } from '@/core/hooks/useScrollLock';

export interface SidebarSection {
  label: string;
  items: SidebarItem[];
}

export interface SidebarItem {
  id: string;
  title: string;
  isActive: boolean;
  isCompleted: boolean;
  isLocked: boolean;
  onClick?: () => void;
  href?: string;
}

export interface WalkthroughSidebarProps {
  sections: SidebarSection[];
  backLabel?: string;
  backHref?: string;
  onBack?: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  title?: string;
  subtitle?: string;
}

export function WalkthroughSidebar({
  sections,
  backLabel = 'Back',
  backHref,
  onBack,
  mobileOpen,
  onMobileClose,
  title = 'Navigation',
  subtitle = 'Navigator',
}: WalkthroughSidebarProps) {
  useScrollLock(mobileOpen);

  const handleItemClick = (item: SidebarItem) => {
    if (item.isLocked) return;
    if (item.onClick) item.onClick();
    onMobileClose();
  };

  const content = (
    <nav className="flex flex-col gap-1 p-3 pb-6">
      <div className="mb-3 px-1">
        {backHref ? (
          <Link
            to={backHref}
            className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-accent transition-colors"
            onClick={onMobileClose}
          >
            <IconArrowLeft size={12} /> {backLabel}
          </Link>
        ) : onBack ? (
          <button
            onClick={() => { onBack(); onMobileClose(); }}
            className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-accent transition-colors"
          >
            <IconArrowLeft size={12} /> {backLabel}
          </button>
        ) : null}
      </div>

      {sections.map((section, sIdx) => (
        <div key={sIdx} className="mb-3">
          <p className="mb-1.5 px-2 text-[9px] font-black uppercase tracking-[0.3em] text-accent">
            {section.label}
          </p>
          <div className="space-y-0.5 border-l border-border/50 ml-2 pl-2">
            {section.items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                disabled={item.isLocked}
                className={`w-full flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors ${
                  item.isActive
                    ? 'text-accent font-semibold bg-accent-dim/20'
                    : item.isLocked
                    ? 'opacity-40 cursor-not-allowed text-text-muted'
                    : 'text-text-secondary hover:text-accent hover:bg-accent-dim/10'
                }`}
              >
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[8px] font-bold font-mono ${
                    item.isCompleted
                      ? 'border-accent/40 text-accent'
                      : item.isActive
                      ? 'border-accent/40 text-accent'
                      : 'border-border text-text-muted'
                  }`}
                >
                  {item.isCompleted ? (
                    <IconCheck size={8} />
                  ) : item.isLocked ? (
                    <IconLock size={8} />
                  ) : null}
                </span>
                <span className="truncate text-xs flex-1">{item.title}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <>
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/65 backdrop-blur-sm md:hidden"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="fixed left-0 top-0 bottom-0 z-[70] w-[92vw] max-w-[360px] flex flex-col bg-bg md:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-border px-4 py-3.5 bg-bg/95 backdrop-blur-md shrink-0">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-accent">{subtitle}</p>
                  <p className="text-xs font-black text-text-primary">{title}</p>
                </div>
                <button
                  onClick={onMobileClose}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:text-accent hover:bg-accent-dim/10 transition-colors"
                  aria-label="Close sidebar"
                >
                  <IconX size={16} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">{content}</div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
