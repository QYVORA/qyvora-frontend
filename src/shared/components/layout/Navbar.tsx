import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IconDashboard, IconMenu, IconX, IconChevronRight } from '@/shared/components/icons';
import { LogIn, UserPlus, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useScrollLock } from '@/core/hooks/useScrollLock';
import { useAuth } from '@/core/contexts/AuthContext';
import { Logo } from '@/shared/components/brand';
import { SITE_CONFIG } from '@/features/marketing/content/siteConfig';
import { ContactTrigger } from '@/features/marketing/components/ContactModal';
import { useNavInvert } from '@/shared/hooks/useNavInvert';
import LanguageSwitcher from '@/shared/components/LanguageSwitcher';

const NAV_GROUP_LABELS: Record<string, string> = {
  learn: 'nav.learn',
  research: 'nav.research',
  resources: 'nav.resources',
  company: 'nav.company',
};

const NAV_ITEM_LABELS: Record<string, string> = {
  courses: 'nav.courses',
  hpb: 'nav.hpb',
  events: 'nav.events',
  services: 'nav.services',
  anansi: 'nav.anansi',
  quiteroot: 'nav.quiteroot',
  market: 'nav.market',
  blogs: 'nav.blogs',
  news: 'nav.news',
  leaderboard: 'nav.leaderboard',
  team: 'nav.team',
  contact: 'nav.contact',
};

const Navbar: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen]             = useState(false);
  const [openDropdown, setOpenDropdown]         = useState<string | null>(null);
  const [openMobileGroup, setOpenMobileGroup]   = useState<string | null>(null);
  const [hidden, setHidden]                     = useState(false);
  const location                                 = useLocation();
  const hoverTimeoutRef                          = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScrollY                              = useRef(0);
  const inverted                                 = useNavInvert();

  const isAnansiPage = location.pathname === '/anansi';

  // Hide navbar on scroll down, show on scroll up (desktop only, public pages)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    if (!mq.matches) return;

    const handleScroll = () => {
      const y = window.scrollY;
      if (y < 80) {
        setHidden(false);
      } else if (y > lastScrollY.current + 5) {
        setHidden(true);
      } else if (y < lastScrollY.current - 5) {
        setHidden(false);
      }
      lastScrollY.current = y;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-accent focus:text-bg focus:font-bold focus:rounded-sm"
      >
        {t('aria.skipToContent')}
      </a>
      <nav
        className={[
          'fixed top-0 left-0 w-full z-[100] overflow-visible',
          'h-[80px] flex items-center',
          'transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
          hidden ? '-translate-y-full' : 'translate-y-0',
          isMenuOpen ? 'bg-bg/95 backdrop-blur-xl' : 'bg-transparent',
        ].join(' ')}
      >
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 xl:px-16 flex items-center justify-between">

          {/* ── Logo ─────────────────────────────────────────────── */}
          <Link to="/" aria-label="QYVORA - Africa's Offensive Security Platform" className="flex items-center shrink-0 transition-transform hover:scale-105 duration-300 relative z-[110]">
            <Logo size="md" className="hidden md:block" color={inverted ? '#000000' : '#06B66F'} />
            <Logo size="md" variant="mark" className="md:hidden" color={inverted ? '#000000' : '#06B66F'} />
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
                  className={`flex items-center gap-1.5 px-4 py-2 text-sm font-black uppercase tracking-widest transition-colors rounded-xl ${
                    group.items.some((item) => isActive(item.path))
                      ? inverted ? 'text-bg hover:text-bg/80' : 'text-accent hover:text-accent/80'
                      : inverted ? 'text-bg/70 hover:text-bg' : 'text-text-primary/70 hover:text-accent'
                  }`}
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
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-[400px] bg-bg-card border border-border rounded-xl shadow-xl overflow-hidden"
                    >
                      <div className="grid grid-cols-2">
                        {group.items.map((item, idx) => {
                          const n = group.items.length;
                          const hasBottomBorder = idx < n - (2 - n % 2);
                          const linkClasses = `text-center px-4 py-4 text-sm font-black uppercase tracking-[0.15em] transition-colors ${
                            isActive(item.path)
                              ? 'text-accent bg-accent/5'
                              : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                          } ${idx % 2 === 0 ? 'border-r border-accent/20' : ''} ${hasBottomBorder ? 'border-b border-accent/20' : ''}`;

                          if ((item as any).modal) {
                            return (
                              <ContactTrigger
                                key={item.key}
                                className={linkClasses}
                                onOpen={closeDropdown}
                              >
                                {t(NAV_ITEM_LABELS[item.key] || item.label)}
                              </ContactTrigger>
                            );
                          }

                          return (
                            <Link
                              key={item.key}
                              to={item.path}
                              onClick={closeDropdown}
                              className={linkClasses}
                            >
                              {item.label}
                            </Link>
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
            <LanguageSwitcher inverted={inverted} />
            <div className="hidden md:flex items-center">
              {user ? (
                <Link
                  to="/dashboard"
                  className={`font-bold uppercase tracking-widest rounded-xl px-5 py-3.5 transition-[filter,transform] duration-200 active:scale-95 flex items-center justify-center gap-2 text-sm ${
                    inverted
                      ? 'bg-bg text-text-primary hover:brightness-110'
                      : 'bg-accent text-bg hover:brightness-110'
                  }`}
                >
                  <IconDashboard className="w-4 h-4" /> {t('nav.dashboard')}
                </Link>
              ) : (
                <Link
                  to="/register"
                  className={`font-bold uppercase tracking-widest rounded-xl px-9 py-3.5 transition-[filter,transform] duration-200 active:scale-95 flex items-center justify-center gap-2.5 text-sm ${
                    inverted
                      ? 'bg-bg text-text-primary hover:brightness-110'
                      : 'bg-accent text-bg hover:brightness-110'
                  }`}
                >
                  {t('nav.start')}
                </Link>
              )}
            </div>

            {/* ── Mobile hamburger (far right edge) ────────────── */}
            <button
              onClick={handleMenuToggle}
              className={`md:hidden p-2 -mr-2 transition-colors relative z-[110] ${inverted ? 'text-bg hover:text-bg/70' : 'text-text-primary hover:text-accent'}`}
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

              {/* Separator */}
              <div className="my-6 h-px bg-border/20" />

              {/* Language switcher */}
              <div className="mb-4">
                <LanguageSwitcher inverted={false} />
              </div>

              {/* Auth buttons */}
              <div className="flex flex-col gap-3">
                {user ? (
                  <Link
                    to="/dashboard"
                    onClick={closeMenu}
                    className="w-full flex items-center justify-center gap-2.5 bg-accent text-bg font-bold uppercase tracking-widest rounded-xl px-6 py-3.5 text-sm transition-[filter,transform] duration-200 hover:brightness-110 active:scale-[0.98]"
                  >
                  <IconDashboard size={16} /> Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      onClick={closeMenu}
                      className="w-full flex items-center justify-center gap-2.5 bg-accent text-bg font-bold uppercase tracking-widest rounded-xl px-6 py-3.5 text-sm transition-[filter,transform] duration-200 hover:brightness-110 active:scale-[0.98]"
                    >
                      <UserPlus className="w-4 h-4" /> {t('button.startTraining')}
                    </Link>
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
