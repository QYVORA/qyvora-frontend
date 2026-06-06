import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ArrowRight, Menu, X, Home, Mail, LogIn, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useScrollY } from '../../../../core/hooks/useScrollY';
import { useAuth } from '../../../../core/contexts/AuthContext';
import Logo from '../../../../shared/components/brand/Logo';
import { SITE_CONFIG } from '../../content/siteConfig';
import { ContactTrigger } from '../ContactModal';

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const [isVisible, setIsVisible]           = useState(true);
  const [isMenuOpen, setIsMenuOpen]         = useState(false);
  const lastScrollY                          = React.useRef(0);
  const scrollY                              = useScrollY();
  const location                             = useLocation();

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
      <nav
        className={[
          'fixed top-0 left-0 w-full z-[100] overflow-visible',
          'h-[80px] flex items-center',
          'transition-all duration-500',
          !isVisible && !isMenuOpen ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100',
          isScrolled || isMenuOpen ? 'bg-bg/80 backdrop-blur-lg' : 'bg-transparent',
        ].join(' ')}
        style={{ outline: 'none', border: 'none' }}
      >
        <div className="w-full max-w-[100vw] mx-auto px-4 md:px-8 lg:px-12 xl:px-16 flex items-center justify-between">

          {/* ── Logo ─────────────────────────────────────────────────────────── */}
          <Link to="/" className="flex items-center transition-transform hover:scale-105 duration-300 relative z-[110]">
            <Logo size="lg" />
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
                  START <ArrowRight className="w-4 h-4" />
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
            className="fixed inset-0 z-[90] md:hidden bg-bg/95 backdrop-blur-xl flex flex-col pt-24 px-6 pb-10"
          >
            <div className="flex-1 flex flex-col gap-6 overflow-y-auto pt-4">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted mb-2">
                Navigation
              </span>
              
              <Link
                to="/"
                className="flex items-center gap-4 text-xl font-black uppercase tracking-widest text-text-primary hover:text-accent transition-colors"
              >
                <Home className="w-5 h-5 text-accent" /> Home
              </Link>

              {SITE_CONFIG.nav.platform.map((item) => (
                <Link
                  key={item.key}
                  to={item.path}
                  className={`flex items-center gap-4 text-xl font-black uppercase tracking-widest transition-colors ${
                    location.pathname === item.path ? 'text-accent' : 'text-text-primary'
                  }`}
                >
                   <div className="w-5 h-5 flex items-center justify-center">
                     <div className={`w-1.5 h-1.5 rounded-full ${location.pathname === item.path ? 'bg-accent' : 'bg-border'}`} />
                   </div>
                  {item.label}
                </Link>
              ))}

              <ContactTrigger className="flex items-center gap-4 text-xl font-black uppercase tracking-widest text-text-primary hover:text-accent transition-colors">
                <Mail className="w-5 h-5 text-accent" /> Contact
              </ContactTrigger>

              <div className="mt-auto pt-10 flex flex-col gap-4">
                {user ? (
                  <Link
                    to="/dashboard"
                    className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-sm font-black uppercase tracking-[0.2em]"
                  >
                    <LayoutDashboard className="w-5 h-5" /> Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-sm font-black uppercase tracking-[0.2em]"
                    >
                      <UserPlus className="w-5 h-5" /> Start Training
                    </Link>
                    <Link
                      to="/login"
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
