import React, { useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Maximize, Minimize, User } from 'lucide-react';
import { Logo } from '@/shared/components/brand';
import { useAuth } from '@/core/contexts/AuthContext';
import { useScrollLock } from '@/core/hooks/useScrollLock';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import Button from '@/shared/components/ui/Button';
import IconButton from '@/shared/components/ui/IconButton';
import PwaInstallButton from '@/shared/components/ui/PwaInstallButton';
import { PUBLIC_PRIMARY_LINKS } from './publicNav';

/**
 * PublicNavigation — calm public nav. Six sections and one contextual CTA.
 * Desktop shows icon-over-label links at lg+; tablets and phones rely on
 * PublicBottomNav for primary navigation, so the mobile trigger is an
 * account-only menu (Dashboard or Log In / Start learning) — never a second
 * copy of the section links.
 * No glow, no border on links — borders stay on badges/status indicators only.
 */
const PublicNavigation: React.FC = React.memo(() => {
  const { user } = useAuth();
  const [open, setOpen] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const location = useLocation();
  const prefersReduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => setOpen(false), [location.pathname]);
  useScrollLock(open);

  useEffect(() => {
    const updateScrollState = () => {
      const scrolled = window.scrollY > 8;
      setIsScrolled((current) => (current === scrolled ? current : scrolled));
    };

    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollState);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      document.documentElement.requestFullscreen?.().catch(() => {});
    }
  };

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
          'chrome-fixed fixed inset-x-0 top-0 z-[100] flex h-16 items-center lg:h-20',
          // Keep the hero visible at the top; add a blurred surface once content
          // scrolls beneath the navbar. The open mobile menu stays opaque.
          open
            ? 'bg-surface'
            : isScrolled
              ? 'bg-bg/75 backdrop-blur-md'
              : 'bg-transparent',
          'transition-all duration-300',
        ].join(' ')}
      >
        <div className="flex w-full items-center justify-between gap-3 px-3 md:px-4 lg:px-6">
          <Link to="/" aria-label="QYVORA home" className="relative z-[110] flex shrink-0 items-center">
            <Logo size="md" variant="full" className="hidden md:block" />
            <Logo size="md" variant="mark" className="md:hidden" />
          </Link>

          {/* Desktop primary nav: icon above label keeps six sections compact. */}
          <div className="hidden items-stretch gap-1 lg:flex xl:gap-1.5">
            {PUBLIC_PRIMARY_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.key}
                  to={link.to}
                  className={({ isActive }) =>
                    [
                      'group relative flex h-[52px] w-[70px] flex-col items-center justify-center gap-1 rounded-xl px-2 py-1.5 text-[10px] font-bold uppercase tracking-wide xl:w-[80px] xl:text-[11px] xl:tracking-wider',
                      'transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                      isActive
                        ? 'bg-accent/10 text-accent'
                        : 'text-text-secondary hover:bg-surface-raised hover:text-text-primary',
                    ].join(' ')
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
                  <span className="whitespace-nowrap">{link.label}</span>
                </NavLink>
              );
            })}
          </div>

          <div className="relative z-[110] flex shrink-0 items-center gap-2 sm:gap-3">
            <IconButton
              label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              tooltip={false}
              variant="default"
              onClick={toggleFullscreen}
              icon={isFullscreen ? <Minimize className="h-5 w-5" aria-hidden="true" /> : <Maximize className="h-5 w-5" aria-hidden="true" />}
              active={isFullscreen}
            />
            {/* Auth CTAs are visible from sm+; below that the account menu owns them. */}
            <div className="hidden items-center gap-2 sm:flex">
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
              className="sm:hidden"
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
              className="fixed inset-x-0 top-16 z-[96] max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-border-subtle bg-surface lg:top-20 lg:max-h-[calc(100dvh-5rem)]"
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
                <PwaInstallButton 
                  variant="ghost" 
                  size="md"
                  label="Install App"
                  className="w-full"
                />
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
