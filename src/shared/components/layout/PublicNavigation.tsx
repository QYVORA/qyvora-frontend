import React, { useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { User } from 'lucide-react';
import { Logo } from '@/shared/components/brand';
import { useAuth } from '@/core/contexts/AuthContext';
import { useScrollLock } from '@/core/hooks/useScrollLock';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import Button from '@/shared/components/ui/Button';
import IconButton from '@/shared/components/ui/IconButton';

interface NavLinkDef {
  key: string;
  label: string;
  to: string;
}

const LINKS: NavLinkDef[] = [
  { key: 'learn', label: 'Learn', to: '/learn' },
  { key: 'tools', label: 'Tools', to: '/tools' },
  { key: 'research', label: 'Research', to: '/blogs' },
  { key: 'services', label: 'Services', to: '/services' },
  { key: 'about', label: 'About', to: '/about' },
];

/**
 * PublicNavigation — calm public nav. Five sections and one contextual CTA.
 * Desktop shows the section links inline; mobile relies on PublicBottomNav for
 * primary navigation, so the mobile trigger is an account-only menu (Dashboard
 * or Log In / Start learning) — never a second copy of the section links.
 * No glow, no border on links — borders stay on badges/status indicators only.
 */
const PublicNavigation: React.FC = React.memo(() => {
  const { user } = useAuth();
  const [open, setOpen] = React.useState(false);
  const location = useLocation();
  const prefersReduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => setOpen(false), [location.pathname]);
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    const id = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>('a,button')?.focus();
    }, 50);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      window.clearTimeout(id);
    };
  }, [open]);

  const ctx = prefersReduced ? { opacity: 1 } : { opacity: 0, y: -8 };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent"
      >
        {"Skip to content"}
      </a>

      <nav
        aria-label="Primary"
        className={[
          'fixed inset-x-0 top-0 z-[100] flex h-[80px] items-center',
          open ? 'bg-surface' : 'bg-transparent',
          'transition-colors duration-300',
        ].join(' ')}
      >
        <div className="flex w-full items-center justify-between px-3 md:px-4 lg:px-6">
          <Link to="/" aria-label="QYVORA home" className="relative z-[110] flex shrink-0 items-center">
            <Logo size="md" variant="full" className="hidden md:block" />
            <Logo size="md" variant="mark" className="md:hidden" />
          </Link>

          <div className="hidden items-center md:flex">
            {LINKS.map((link) => (
              <NavLink
                key={link.key}
                to={link.to}
                className={({ isActive }) =>
                  [
                    'group flex min-h-[48px] items-center px-4 py-2 text-sm font-medium',
                    'transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                    isActive ? 'text-accent' : 'text-text-secondary hover:text-text-primary',
                  ].join(' ')
                }
              >
                {({ isActive }) => (
                  <span className="flex flex-col items-center gap-1">
                    <span>{link.label}</span>
                    <span
                      aria-hidden="true"
                      className={`h-px w-full transition-colors ${isActive ? 'bg-accent' : 'bg-transparent group-hover:bg-border'}`}
                    />
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          <div className="relative z-[110] flex shrink-0 items-center gap-3">
            <div className="hidden items-center gap-2 md:flex">
              {user ? (
                <Button to="/dashboard" size="sm">
                  {"Dashboard"}
                </Button>
              ) : (
                <>
                  <Button to="/login" variant="secondary" size="sm">
                    {"Log In"}
                  </Button>
                  <Button to="/register" size="sm">
                    {"Start learning"}
                  </Button>
                </>
              )}
            </div>
            <IconButton
              label={"Account"}
              tooltip={false}
              variant="default"
              className="md:hidden"
              onClick={() => setOpen((v) => !v)}
              icon={<User className="h-5 w-5" aria-hidden="true" />}
              active={open}
            />
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-[95] bg-black/60"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              id="public-nav-drawer"
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label={"Account"}
              initial={ctx}
              animate={{ opacity: 1, y: 0 }}
              exit={ctx}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-0 top-[80px] z-[96] max-h-[calc(100dvh-80px)] overflow-y-auto border-t border-border-subtle bg-surface"
            >
              <nav aria-label={"Account"} className="flex flex-col gap-2 px-3 py-4 md:px-4">
                {user ? (
                  <Button to="/dashboard" className="w-full">
                    {"Dashboard"}
                  </Button>
                ) : (
                  <>
                    <Button to="/register" className="w-full">
                      {"Start learning"}
                    </Button>
                    <Button to="/login" variant="secondary" className="w-full">
                      {"Log In"}
                    </Button>
                  </>
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
});

PublicNavigation.displayName = 'PublicNavigation';

export default PublicNavigation;