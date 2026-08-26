import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IconMenu, IconX, IconChevronRight } from '@/shared/components/icons';
import { LogIn, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useScrollLock } from '@/core/hooks/useScrollLock';
import { useAuth } from '@/core/contexts/AuthContext';
import { Logo } from '@/shared/components/brand';
import { SITE_CONFIG } from '@/features/marketing/content/siteConfig';
import { ContactTrigger } from '@/features/marketing/components/ContactModal';
import LanguageSwitcher from '@/shared/components/LanguageSwitcher';
import Identicon from '@/shared/components/Identicon';

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
  jabari: 'nav.jabari',
  services: 'nav.services',
};

const Navbar: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen]             = useState(false);
  const [openDropdown, setOpenDropdown]         = useState<string | null>(null);
  const [openMobileGroup, setOpenMobileGroup]   = useState<string | null>(null);
  const location                                 = useLocation();
  const hoverTimeoutRef                          = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close menu/dropdowns on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setOpenDropdown(null);
    setOpenMobileGroup(null);
  }, [location.pathname]);

  useScrollLock(isMenuOpen);

  const isActive = useCallback((path: string) => location.pathname === path, [location.pathname]);

  const handleMenuToggle = useCallback(() => setIsMenuOpen((prev) => !prev), []);

  const handleDropdownEnter = useCallback((key: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setOpenDropdown(key);
  }, []);

  const handleDropdownLeave = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => setOpenDropdown(null), 150);
  }, []);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const closeDropdown = useCallback(() => setOpenDropdown(null), []);

  const toggleMobileGroup = useCallback((key: string, isOpen: boolean) => {
    setOpenMobileGroup(isOpen ? null : key);
  }, []);

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
          'transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
          isMenuOpen ? 'bg-bg/95 backdrop-blur-xl' : 'bg-transparent',
        ].join(' ')}
      >
        <div className="w-full px-3 md:px-4 lg:px-6 flex items-center justify-between">

          {/* ── Logo ─────────────────────────────────────────────── */}
          <Link to="/" aria-label="QYVORA - Africa's Offensive Security Platform" className="flex items-center shrink-0 transition-transform hover:scale-105 duration-300 relative z-[110]">
            <Logo size="md" className="hidden md:block" color="#06B66F" />
            <Logo size="md" variant="mark" className="md:hidden" color="#06B66F" />
          </Link>

          {/* ── Desktop Navigation (centered, hover dropdowns) ──── */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-2 lg:gap-3 overflow-visible">
            {SITE_CONFIG.nav.groups.map((group) => (
              <div
                key={group.key}
                className="relative"
                onMouseEnter={() => handleDropdownEnter(group.key)}
                onMouseLeave={handleDropdownLeave}
              >
                <button
                  className={`flex items-center gap-1.5 px-4 py-2 text-xs font-black uppercase tracking-widest transition-colors rounded-xl ${
                    group.items.some((item) => isActive(item.path))
                      ? 'text-accent bg-accent/5'
                      : 'text-text-primary/80 hover:text-accent'
                  }`}
                  aria-expanded={openDropdown === group.key}
                  aria-haspopup="true"
                  onClick={() => setOpenDropdown(prev => prev === group.key ? null : group.key)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setOpenDropdown(null);
                    } else if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      setOpenDropdown(group.key);
                    }
                  }}
                >
                  {t(NAV_GROUP_LABELS[group.key] || group.label)}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      openDropdown === group.key ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {openDropdown === group.key && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-fit min-w-[320px] rounded-2xl border border-border/20 bg-bg-card shadow-xl overflow-hidden"
                      onKeyDown={(e) => { if (e.key === 'Escape') setOpenDropdown(null); }}
                      role="menu"
                    >
                      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border/20">
                        <h3 className="text-[9px] font-black uppercase tracking-widest text-text-muted">
                          {t(NAV_GROUP_LABELS[group.key] || group.label)}
                        </h3>
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                      </div>
                      <div className="p-2 grid grid-cols-2 gap-1.5">
                        {group.items.map((item) => {
                          const linkClasses = `flex flex-col gap-1 px-4 py-3 rounded-xl text-left transition-colors ${
                            isActive(item.path)
                              ? 'bg-accent/5 text-accent'
                              : 'text-text-primary hover:bg-bg-elevated hover:text-accent'
                          }`;

                          if ((item as any).modal) {
                            return (
                              <div key={item.key}>
                                <ContactTrigger
                                  className={linkClasses}
                                  onOpen={closeDropdown}
                                >
                                  <span className="text-xs font-black uppercase tracking-widest">
                                    {t(NAV_ITEM_LABELS[item.key] || item.label)}
                                  </span>
                                  {(item as any).desc && (
                                    <span className="text-[10px] font-mono text-text-muted leading-snug">
                                      {(item as any).desc}
                                    </span>
                                  )}
                                </ContactTrigger>
                              </div>
                            );
                          }

                          return (
                            <div key={item.key}>
                              <Link
                                to={item.path}
                                onClick={closeDropdown}
                                className={linkClasses}
                              >
                                <span className="text-xs font-black uppercase tracking-widest">
                                  {t(NAV_ITEM_LABELS[item.key] || item.label)}
                                </span>
                                {(item as any).desc && (
                                  <span className="text-[10px] font-mono text-text-muted leading-snug">
                                    {(item as any).desc}
                                  </span>
                                )}
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

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

            {/* ── Mobile hamburger (far right edge) ────────────── */}
            <button
              onClick={handleMenuToggle}
              className={`md:hidden p-2 -mr-2 transition-colors relative z-[110] text-text-primary hover:text-accent`}
              aria-label={isMenuOpen ? t('aria.closeMenu') : t('aria.openMenu')}
            >
              {isMenuOpen ? <IconX size={24} /> : <IconMenu size={24} />}
            </button>
          </div>

        </div>
      </nav>

      {/* ── Mobile Menu Overlay ─────────────────────────────────── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[90] md:hidden bg-bg/95 backdrop-blur-xl"
          >
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col h-full pt-24 px-6 pb-10 overflow-y-auto"
            >
              {/* Home link */}
              <Link
                to="/"
                onClick={closeMenu}
                className={`relative pl-4 py-3 text-sm font-black uppercase tracking-[0.25em] transition-colors border-l-2 ${
                  isActive('/') ? 'text-accent border-accent' : 'text-text-primary/70 border-transparent hover:text-accent hover:border-accent/50'
                }`}
              >
                {t('nav.home')}
              </Link>

              {/* Grouped nav links */}
              {SITE_CONFIG.nav.groups.map((group) => {
                const isOpen = openMobileGroup === group.key;
                return (
                  <div key={group.key} className="border-b border-border/10 last:border-b-0">
                    <button
                      onClick={() => toggleMobileGroup(group.key, isOpen)}
                      className="w-full flex items-center justify-between pl-4 pr-2 py-3 text-sm font-black uppercase tracking-[0.25em] transition-colors text-text-primary/70 hover:text-accent"
                    >
                      {t(NAV_GROUP_LABELS[group.key] || group.label)}
                      <IconChevronRight
                        size={16}
                        className={`transition-transform duration-200 ${
                          isOpen ? 'rotate-90' : ''
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-6 pb-2 flex flex-col gap-1">
                            {group.items.map((item) => {
                              const linkClasses = `relative pl-4 py-2.5 text-xs font-bold uppercase tracking-[0.2em] transition-colors border-l-2 ${
                                isActive(item.path)
                                  ? 'text-accent border-accent'
                                  : 'text-text-secondary border-transparent hover:text-accent hover:border-accent/50'
                              }`;

                              if ((item as any).modal) {
                                return (
                                  <ContactTrigger
                                    key={item.key}
                                    className={linkClasses}
                                    onOpen={closeMenu}
                                  >
                                    {t(NAV_ITEM_LABELS[item.key] || item.label)}
                                  </ContactTrigger>
                                );
                              }

                              return (
                                <Link
                                  key={item.key}
                                  to={item.path}
                                  onClick={closeMenu}
                                  className={linkClasses}
                                >
                                  {t(NAV_ITEM_LABELS[item.key] || item.label)}
                                </Link>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              {/* Auth buttons */}
              <div className="flex flex-col gap-3">
                {user ? (
                  <>
                    <Link
                      to="/dashboard/profile"
                      onClick={closeMenu}
                      className="w-full flex items-center justify-center gap-3 bg-accent text-on-accent font-bold uppercase tracking-widest rounded-xl px-6 py-3.5 text-sm transition-[filter,transform] duration-200 hover:brightness-110 active:scale-[0.98]"
                    >
                      <Identicon value={user.username || '?'} size={20} className="w-5 h-5 rounded-lg bg-black border-black" />
                      {user.username}
                    </Link>
                    <ContactTrigger
                      className="w-full flex items-center justify-center gap-2.5 border border-accent/50 text-accent font-bold uppercase tracking-widest rounded-xl px-6 py-3.5 text-sm transition-[background-color,color] duration-200 hover:bg-accent/10 active:scale-[0.98]"
                      onOpen={closeMenu}
                    >
                      {t('nav.contact')}
                    </ContactTrigger>
                  </>
                ) : (
                  <>
                    <ContactTrigger
                      className="w-full flex items-center justify-center gap-2.5 bg-accent text-on-accent font-bold uppercase tracking-widest rounded-xl px-6 py-3.5 text-sm transition-[filter,transform] duration-200 hover:brightness-110 active:scale-[0.98]"
                      onOpen={closeMenu}
                    >
                      {t('nav.contact')}
                    </ContactTrigger>
                    <Link
                      to="/login"
                      onClick={closeMenu}
                      className="w-full flex items-center justify-center gap-2.5 border border-accent/50 text-accent font-bold uppercase tracking-widest rounded-xl px-6 py-3.5 text-sm transition-[background-color,color] duration-200 hover:bg-accent/10 active:scale-[0.98]"
                    >
                      <LogIn className="w-4 h-4" /> {t('button.logIn')}
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
