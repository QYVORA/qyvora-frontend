import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Menu, X, LogIn, UserPlus, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useScrollY } from '@/core/hooks/useScrollY';
import { useScrollLock } from '@/core/hooks/useScrollLock';
import { useAuth } from '@/core/contexts/AuthContext';
import { Logo } from '@/shared/components/brand';
import { SITE_CONFIG } from '@/features/marketing/content/siteConfig';

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const [isVisible, setIsVisible]               = useState(true);
  const [isMenuOpen, setIsMenuOpen]             = useState(false);
  const [openDropdown, setOpenDropdown]         = useState<string | null>(null);
  const [openMobileGroup, setOpenMobileGroup]   = useState<string | null>(null);
  const lastScrollY                              = useRef(0);
  const scrollY                                  = useScrollY();
  const location                                 = useLocation();
  const hoverTimeoutRef                          = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isAnansiPage = location.pathname === '/anansi';

  // Hide on scroll-down, reveal on scroll-up
  useEffect(() => {
    if (scrollY < 10) {
      setIsVisible(true);
      lastScrollY.current = scrollY;
      return;
    }
    const diff = scrollY - lastScrollY.current;
    if (Math.abs(diff) > 5) {
      setIsVisible(diff <= 0);
      lastScrollY.current = scrollY;
    }
  }, [scrollY]);

  // Close menu/dropdowns on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setOpenDropdown(null);
    setOpenMobileGroup(null);
  }, [location.pathname]);

  useScrollLock(isMenuOpen);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-accent focus:text-bg focus:font-bold focus:rounded-sm"
      >
        Skip to content
      </a>
      <nav
        className={[
          'fixed top-0 left-0 w-full z-[100] overflow-visible',
          'h-[80px] flex items-center',
          'transition-all duration-300',
          !isVisible && !isMenuOpen ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100',
          isMenuOpen ? 'bg-bg/95 backdrop-blur-xl' : (isAnansiPage ? 'bg-transparent' : 'bg-transparent'),
        ].join(' ')}
      >
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 xl:px-16 flex items-center justify-between">

          {/* ── Logo ─────────────────────────────────────────────── */}
          <Link to="/" aria-label="QYVORA - Africa's Offensive Security Platform" className="flex items-center shrink-0 transition-transform hover:scale-105 duration-300 relative z-[110]">
            <Logo size="md" className="hidden md:block" />
            <Logo size="md" variant="mark" className="md:hidden" />
          </Link>

          {/* ── Desktop Navigation (centered, hover dropdowns) ──── */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-2 lg:gap-3 overflow-visible">
            {SITE_CONFIG.nav.groups.map((group) => (
              <div
                key={group.key}
                className="relative"
                onMouseEnter={() => {
                  if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                  setOpenDropdown(group.key);
                }}
                onMouseLeave={() => {
                  hoverTimeoutRef.current = setTimeout(() => setOpenDropdown(null), 150);
                }}
              >
                <button
                  className={`flex items-center gap-1.5 px-4 py-2 text-sm font-black uppercase tracking-[0.2em] transition-colors hover:text-accent rounded-sm ${
                    group.items.some((item) => isActive(item.path))
                      ? 'text-accent'
                      : 'text-text-primary/70'
                  }`}
                >
                  {group.label}
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
                          return (
                            <Link
                              key={item.key}
                              to={item.path}
                              className={`text-center px-4 py-4 text-sm font-black uppercase tracking-[0.15em] transition-colors ${
                                isActive(item.path)
                                  ? 'text-accent bg-accent/5'
                                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                              } ${idx % 2 === 0 ? 'border-r border-accent/20' : ''} ${hasBottomBorder ? 'border-b border-accent/20' : ''}`}
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
          <div className="flex items-center gap-4 shrink-0 relative z-[110]">
            <div className="hidden md:flex items-center">
              {user ? (
                <Link
                  to="/dashboard"
                  className="bg-accent text-bg font-bold uppercase tracking-[0.08em] rounded-sm px-5 py-3.5 transition-all hover:brightness-110 active:scale-95 flex items-center justify-center gap-2 text-sm"
                >
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="bg-accent text-bg font-bold uppercase tracking-[0.12em] rounded-sm px-9 py-3.5 transition-all hover:brightness-110 active:scale-95 flex items-center justify-center gap-2.5 text-sm"
                >
                  START
                </Link>
              )}
            </div>

            {/* ── Mobile hamburger (far right edge) ────────────── */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 -mr-2 text-text-primary hover:text-accent transition-colors relative z-[110]"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
                onClick={() => setIsMenuOpen(false)}
                className={`relative pl-4 py-3 text-sm font-black uppercase tracking-[0.25em] transition-colors border-l-2 ${
                  isActive('/') ? 'text-accent border-accent' : 'text-text-primary/70 border-transparent hover:text-accent hover:border-accent/50'
                }`}
              >
                Home
              </Link>

              {/* Grouped nav links */}
              {SITE_CONFIG.nav.groups.map((group) => {
                const isOpen = openMobileGroup === group.key;
                return (
                  <div key={group.key} className="border-b border-border/10 last:border-b-0">
                    <button
                      onClick={() => setOpenMobileGroup(isOpen ? null : group.key)}
                      className="w-full flex items-center justify-between pl-4 pr-2 py-3 text-sm font-black uppercase tracking-[0.25em] transition-colors text-text-primary/70 hover:text-accent"
                    >
                      {group.label}
                      <ChevronRight
                        className={`w-4 h-4 transition-transform duration-200 ${
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
                            {group.items.map((item) => (
                              <Link
                                key={item.key}
                                to={item.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={`relative pl-4 py-2.5 text-xs font-bold uppercase tracking-[0.2em] transition-colors border-l-2 ${
                                  isActive(item.path)
                                    ? 'text-accent border-accent'
                                    : 'text-text-secondary border-transparent hover:text-accent hover:border-accent/50'
                                }`}
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              {/* Separator */}
              <div className="my-6 h-px bg-border/20" />

              {/* Auth buttons */}
              <div className="flex flex-col gap-3">
                {user ? (
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2.5 bg-accent text-bg font-bold uppercase tracking-[0.15em] rounded-sm px-6 py-3.5 text-sm transition-all hover:brightness-110 active:scale-[0.98]"
                  >
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2.5 bg-accent text-bg font-bold uppercase tracking-[0.15em] rounded-sm px-6 py-3.5 text-sm transition-all hover:brightness-110 active:scale-[0.98]"
                    >
                      <UserPlus className="w-4 h-4" /> Start Training
                    </Link>
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2.5 border border-accent/50 text-accent font-bold uppercase tracking-[0.15em] rounded-sm px-6 py-3.5 text-sm transition-all hover:bg-accent/10 active:scale-[0.98]"
                    >
                      <LogIn className="w-4 h-4" /> Log In
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
};

export default Navbar;
