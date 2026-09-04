import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import {
  IconChevronRight,
  IconCode,
  IconTerminal,
  IconLabs,
  IconLeaderboard,
  IconMarketplace,
  IconShield,
  IconRank,
  IconNetwork,
  IconCTF,
} from '@/shared/components/icons';
import {
  LogIn,
  BookOpen,
  FileText,
  Users,
  Newspaper,
  ShoppingBag,
  Bug,
  Rocket,
  Building2,
  Radar,
  Contact,
  Crosshair,
} from 'lucide-react';
import { useScrollLock } from '@/core/hooks/useScrollLock';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import { useAuth } from '@/core/contexts/AuthContext';
import { Logo } from '@/shared/components/brand';
import { SITE_CONFIG } from '@/features/marketing/content/siteConfig';
import { ContactTrigger } from '@/features/marketing/components/ContactModal';
import LanguageSwitcher from '@/shared/components/LanguageSwitcher';
import Identicon from '@/shared/components/Identicon';
import { NavMenuTrigger } from '@/features/student/components/layout/StudentNavPanel/StudentNavPanel';

const NAV_GROUP_LABELS: Record<string, string> = {
  learning: 'nav.learning',
  community: 'nav.community',
  company: 'nav.company',
  platform: 'nav.platform',
};

const NAV_ITEM_LABELS: Record<string, string> = {
  courses: 'nav.courses',
  bootcamp: 'nav.bootcamp',
  labs: 'nav.labs',
  cp: 'nav.cp',
  simulations: 'nav.simulations',
  blogs: 'nav.blogs',
  leaderboard: 'nav.leaderboard',
  market: 'nav.market',
  team: 'nav.team',
  quiteroot: 'nav.quiteroot',
  terms: 'footer.termsOfService',
  anansi: 'nav.anansi',
  toha3ee: 'nav.toha3ee',
  shaka: 'nav.shaka',
  nzinga: 'nav.nzinga',
  jabari: 'nav.jabari',
  aksum: 'nav.aksum',
  sekhmet: 'nav.sekhmet',
  services: 'nav.services',
};

type NavItemIcon = React.ElementType<{ className?: string; size?: number }>;

const ITEM_ICONS: Record<string, NavItemIcon> = {
  courses: BookOpen,
  bootcamp: IconTerminal,
  labs: IconLabs,
  simulations: IconCTF,
  blogs: Newspaper,
  leaderboard: IconLeaderboard,
  market: IconMarketplace,
  team: Users,
  quiteroot: IconShield,
  terms: FileText,
  anansi: IconNetwork,
  toha3ee: IconCode,
  shaka: Building2,
  nzinga: Radar,
  jabari: Bug,
  aksum: IconRank,
  sekhmet: Crosshair,
  services: Rocket,
  cp: Contact,
  contact: Contact,
};

const Navbar: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const prefersReduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  // Close the panel on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useScrollLock(isMenuOpen);

  // Escape to close + focus the first link while open.
  useEffect(() => {
    if (!isMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    const tId = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>('a,button')?.focus();
    }, 50);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      window.clearTimeout(tId);
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  const groups = SITE_CONFIG.nav.groups;

  const renderItem = (item: (typeof groups)[number]['items'][number]) => {
    const Icon = ITEM_ICONS[item.key] ?? IconChevronRight;
    const label = t(NAV_ITEM_LABELS[item.key] || item.label);
    const desc = (item as { desc?: string }).desc;
    const inner = (
      <>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-bg-elevated text-accent transition-colors group-hover:bg-accent/10">
          <Icon size={20} strokeWidth={2.25} />
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-sm font-black uppercase tracking-widest text-text-primary">
            {label}
          </span>
          {desc && (
            <span className="mt-1 block text-xs leading-relaxed text-text-muted">{desc}</span>
          )}
        </span>
        <IconChevronRight size={14} className="shrink-0 text-text-muted/30 transition-colors group-hover:text-accent" />
      </>
    );

    const cls =
      'group flex items-start gap-3 rounded-2xl border border-border/50 bg-bg-card p-4 text-left transition-colors focus:outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-accent active:scale-[0.99] hover:border-accent/50 hover:bg-accent-dim/10';

    if ((item as { modal?: boolean }).modal) {
      return (
        <ContactTrigger key={item.key} className={cls} onOpen={closeMenu}>
          {inner}
        </ContactTrigger>
      );
    }
    return (
      <Link key={item.key} to={item.path} onClick={closeMenu} className={cls}>
        {inner}
      </Link>
    );
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-accent focus:text-on-accent focus:font-bold focus:rounded-sm"
      >
        {t('aria.skipToContent')}
      </a>
      <nav
        className={[
          'fixed top-0 left-0 w-full z-[100] overflow-visible',
          'h-[80px] flex items-center',
          'transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
          isMenuOpen ? 'bg-bg/95 backdrop-blur-xl' : 'bg-transparent',
        ].join(' ')}
      >
        <div className="w-full px-3 md:px-4 lg:px-6 flex items-center justify-between">

          {/* ── Logo ─────────────────────────────────────────────── */}
          <Link to="/" aria-label="QYVORA - Africa's Offensive Security Platform" className="flex items-center shrink-0 transition-transform hover:scale-105 duration-300 relative z-[110]">
            <Logo size="md" className="hidden md:block" color="#06B66F" />
            <Logo size="md" variant="mark" className="md:hidden" color="#06B66F" />
          </Link>

          {/* ── Right controls ──────────────────────────────────── */}
          <div className="flex items-center gap-3 shrink-0 relative z-[110]">
            <LanguageSwitcher inverted={false} />
            <div className="hidden md:flex items-center gap-3">
              <ContactTrigger
                className={`font-bold uppercase tracking-widest rounded-xl px-5 py-3.5 transition-[filter,transform] duration-200 active:scale-95 flex items-center justify-center gap-2 text-sm bg-accent text-on-accent hover:brightness-110`}
              >
                {t('nav.contact')}
              </ContactTrigger>
              {user && (
                <Link
                  to="/dashboard/profile"
                  className={`w-11 h-11 flex-none rounded-xl overflow-hidden bg-black border border-accent/40 transition-colors`}
                  aria-label={t('nav.profile')}
                >
                  <Identicon
                    value={user.username || '?'}
                    size={44}
                    className="w-full h-full"
                  />
                </Link>
              )}
            </div>

            {/* Single menu trigger — opens the full navigation panel on all
                breakpoints (mirrors the student dashboard dropdown). */}
            <NavMenuTrigger open={isMenuOpen} onClick={() => setIsMenuOpen((v) => !v)} />
          </div>

        </div>
      </nav>

      {/* ── Full-viewport navigation panel ──────────────────────── */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[95] bg-black/50"
              onClick={closeMenu}
              aria-hidden="true"
            />

            {/* Panel */}
            <motion.div
              id="public-nav-panel"
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label={t('nav.menu', 'Navigation')}
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReduced ? { opacity: 1 } : { opacity: 0, y: -12 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-0 top-[80px] bottom-0 z-[96] overflow-y-auto bg-bg-alt"
            >
              <div className="w-full px-3 py-6 md:px-4 lg:px-6">
                <div className="space-y-8">
                  {groups.map((group) => (
                    <section key={group.key}>
                      <h3 className="mb-3 text-[10px] font-black uppercase tracking-[0.25em] text-accent">
                        {t(NAV_GROUP_LABELS[group.key] || group.label)}
                      </h3>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {group.items.map(renderItem)}
                      </div>
                    </section>
                  ))}
                </div>

                {/* Auth actions */}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  {user ? (
                    <Link
                      to="/dashboard/profile"
                      onClick={closeMenu}
                      className="flex flex-1 items-center justify-center gap-3 bg-accent text-on-accent font-bold uppercase tracking-widest rounded-xl px-6 py-3.5 text-sm transition-[filter,transform] duration-200 hover:brightness-110 active:scale-[0.98]"
                    >
                      <Identicon value={user.username || '?'} size={20} className="w-5 h-5 rounded-lg bg-black border-black" />
                      {user.username}
                    </Link>
                  ) : (
                    <>
                      <ContactTrigger
                        className="flex flex-1 items-center justify-center gap-2.5 bg-accent text-on-accent font-bold uppercase tracking-widest rounded-xl px-6 py-3.5 text-sm transition-[filter,transform] duration-200 hover:brightness-110 active:scale-[0.98]"
                        onOpen={closeMenu}
                      >
                        {t('nav.contact')}
                      </ContactTrigger>
                      <Link
                        to="/login"
                        onClick={closeMenu}
                        className="flex flex-1 items-center justify-center gap-2.5 border border-accent/50 text-accent font-bold uppercase tracking-widest rounded-xl px-6 py-3.5 text-sm transition-[background-color,color] duration-200 hover:bg-accent/10 active:scale-[0.98]"
                      >
                        <LogIn className="w-4 h-4" /> {t('button.logIn')}
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
});

// Keep the memoised component lean — no route-change re-renders from a helper callback.
Navbar.displayName = 'Navbar';

export default Navbar;
