import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ArrowRight, Menu, X, Home, Mail, LogIn, UserPlus, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useScrollY } from '@/core/hooks/useScrollY';
import { useAuth } from '@/core/contexts/AuthContext';
import { useTheme } from '@/core/contexts/ThemeContext';
import { Logo } from '@/shared/components/brand';
import { SITE_CONFIG } from '@/features/marketing/content/siteConfig';
import { ContactTrigger } from '@/features/marketing/components/ContactModal';

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
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

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

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
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 xl:px-16 flex items-center justify-between">

          {/* ── Logo ─────────────────────────────────────────────────────────── */}
          <Link to="/" aria-label="QYVORA - Africa's Offensive Security Platform" className="flex items-center transition-transform hover:scale-105 duration-300 relative z-[110]">
            <Logo size="xl" className="hidden md:block" />
            <Logo size="md" variant="mark" className="md:hidden" />
          </Link>

          {/* ── Desktop Navigation ───────────────────────────────────────────── */}
          <div className="hidden md:flex items-center space-x-10">
            {SITE_CONFIG.nav.platform.map((item) => (
              item.key === 'contact' ? (
                <ContactTrigger
                  key={item.key}
                  type="link"
                  className={`text-[11px] font-black uppercase tracking-[0.3em] transition-all hover:text-accent relative group ${
                    location.pathname === item.path ? 'text-accent' : 'text-text-primary/70'
                  }`}
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full" />
                </ContactTrigger>
              ) : (
                <Link
                  key={item.key}
                  to={item.path}
                  className={`text-[11px] font-black uppercase tracking-[0.3em] transition-all hover:text-accent relative group ${
                    location.pathname === item.path ? 'text-accent' : 'text-text-primary/70'
                  }`}
                >
                  {item.label}
                  <span className={`absolute -bottom-1 left-0 w-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full ${
                    location.pathname === item.path ? 'w-full' : ''
                  }`} />
                </Link>
              )
            ))}
          </div>

          {/* ── Right controls ───────────────────────────────────────────────── */}
          <div className="flex items-center gap-4 relative z-[110]">
            {/* Subtle Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-text-primary/70 hover:text-accent hover:bg-white/5 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            <div className="hidden md:flex items-center">
              {user ? (
                <Link
                  to="/dashboard"
                  className="bg-accent text-bg font-bold uppercase tracking-[0.08em] rounded-sm px-8 py-3.5 transition-all hover:brightness-110 active:scale-95 hover:shadow-[0_0_20px_var(--color-accent-glow)] flex items-center justify-center gap-2.5 text-sm"
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 z-[90] md:hidden bg-bg/95 backdrop-blur-xl flex flex-col pt-24 px-6 pb-10 overflow-x-hidden"
          >
            <div className="flex-1 flex flex-col gap-6 overflow-y-auto pt-4">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted mb-2">
                Navigation
              </span>
              
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-4 text-xl font-black uppercase tracking-widest text-text-primary hover:text-accent transition-colors"
              >
                <Home className="w-5 h-5 text-accent" /> Home
              </Link>

              {SITE_CONFIG.nav.platform.map((item) => {
                const active = location.pathname === item.path;
                const content = (
                  <>
                    <div className="w-5 h-5 flex items-center justify-center">
                      {item.key === 'contact' ? (
                        <Mail className="w-5 h-5 text-accent" />
                      ) : (
                        <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-accent' : 'bg-border'}`} />
                      )}
                    </div>
                    {item.label}
                  </>
                );

                if (item.key === 'contact') {
                  return (
                    <ContactTrigger
                      key={item.key}
                      onOpen={() => setIsMenuOpen(false)}
                      className="flex items-center gap-4 text-xl font-black uppercase tracking-widest text-text-primary hover:text-accent transition-colors"
                    >
                      {content}
                    </ContactTrigger>
                  );
                }

                return (
                  <Link
                    key={item.key}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-4 text-xl font-black uppercase tracking-widest transition-colors ${
                      active ? 'text-accent' : 'text-text-primary'
                    }`}
                  >
                    {content}
                  </Link>
                );
              })}

              <div className="mt-auto pt-10 flex flex-col gap-4">
                {user ? (
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-sm font-black uppercase tracking-[0.2em]"
                  >
                    <LayoutDashboard className="w-5 h-5" /> Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-sm font-black uppercase tracking-[0.2em]"
                    >
                      <UserPlus className="w-5 h-5" /> Start Training
                    </Link>
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full btn-secondary flex items-center justify-center gap-2 py-4 text-sm font-black uppercase tracking-[0.2em]"
                    >
                      <LogIn className="w-5 h-5" /> Log In
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
