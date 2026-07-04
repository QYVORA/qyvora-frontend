import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Menu, X, LogIn, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useScrollY } from '@/core/hooks/useScrollY';
import { useScrollLock } from '@/core/hooks/useScrollLock';
import { useAuth } from '@/core/contexts/AuthContext';
import { Logo } from '@/shared/components/brand';
import { SITE_CONFIG } from '@/features/marketing/content/siteConfig';

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const [isVisible, setIsVisible]           = useState(true);
  const [isMenuOpen, setIsMenuOpen]         = useState(false);
  const lastScrollY                          = React.useRef(0);
  const scrollY                              = useScrollY();
  const location                             = useLocation();

  const isAnansiPage = location.pathname === '/anansi';
  const isScrolled = scrollY > 20;

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

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useScrollLock(isMenuOpen);

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
        style={{ outline: 'none', border: 'none' }}
      >
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 xl:px-16 flex items-center">

          {/* ── Logo ─────────────────────────────────────────────────────────── */}
          <Link to="/" aria-label="QYVORA - Africa's Offensive Security Platform" className="flex items-center transition-transform hover:scale-105 duration-300 relative z-[110]">
            <Logo size="lg" className="hidden md:block" />
            <Logo size="md" variant="mark" className="md:hidden" />
          </Link>

          {/* ── Desktop Navigation ───────────────────────────────────────────── */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-5 xl:space-x-7 ml-0 lg:ml-4 xl:ml-8 mr-8 lg:mr-12 xl:mr-16">
            {SITE_CONFIG.nav.platform.filter((item) => item.key !== 'contact').map((item) => (
              <Link
                key={item.key}
                to={item.path}
                className={`text-[11px] lg:text-xs font-black uppercase tracking-[0.15em] lg:tracking-[0.2em] transition-all hover:text-accent relative group ${
                  location.pathname === item.path ? 'text-accent' : 'text-text-primary/70'
                }`}
              >
                {item.label}
                <span className={`absolute -bottom-1 left-0 w-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full ${
                  location.pathname === item.path ? 'w-full' : ''
                }`} />
              </Link>
            ))}
          </div>

          {/* ── Right controls ───────────────────────────────────────────────── */}
          <div className="flex items-center gap-4 ml-auto relative z-[110]">
            <div className="hidden md:flex items-center">
              {user ? (
                <Link
                  to="/dashboard"
                  className="bg-accent text-bg font-bold uppercase tracking-[0.08em] rounded-sm px-5 py-3.5 transition-all hover:brightness-110 active:scale-95 hover:shadow-[0_0_20px_var(--color-accent-glow)] flex items-center justify-center gap-2 text-sm"
                >
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="bg-accent text-bg font-bold uppercase tracking-[0.12em] rounded-sm px-9 py-3.5 transition-all hover:brightness-110 active:scale-95 hover:shadow-[0_0_20px_var(--color-accent-glow)] flex items-center justify-center gap-2.5 text-sm"
                >
                  START 
                </Link>
              )}
            </div>

            {/* Hamburger Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-text-primary hover:text-accent transition-colors"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </nav>

      {/* ── Mobile Menu Overlay ────────────────────────────────────────────── */}
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
              {/* Nav links */}
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-[0.35em] text-text-muted/50 mb-5 pl-1">
                  — Pages
                </span>

                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className={`relative pl-4 py-3 text-sm font-black uppercase tracking-[0.25em] transition-colors border-l-2 ${
                    location.pathname === '/' ? 'text-accent border-accent' : 'text-text-primary/70 border-transparent hover:text-accent hover:border-accent/50'
                  }`}
                >
                  Home
                </Link>

                {SITE_CONFIG.nav.platform.filter((item) => item.key !== 'contact').map((item) => {
                  const active = location.pathname === item.path;
                  return (
                    <Link
                      key={item.key}
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`relative pl-4 py-3 text-sm font-black uppercase tracking-[0.25em] transition-colors border-l-2 ${
                        active ? 'text-accent border-accent' : 'text-text-primary/70 border-transparent hover:text-accent hover:border-accent/50'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {/* Separator */}
              <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

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
