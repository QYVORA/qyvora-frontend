import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { createPortal } from 'react-dom';
import { Menu, X, ChevronDown, Shield, ShoppingBag, Terminal, Mail, Trophy, LayoutDashboard, Lock, ArrowRight, Sun, Moon, Zap } from 'lucide-react';
import { useScrollY } from '../../../../core/hooks/useScrollY';
import { useAuth } from '../../../../core/contexts/AuthContext';
import { useTheme } from '../../../../core/contexts/ThemeContext';
import Logo from '../../../../shared/components/brand/Logo';
import { SITE_CONFIG } from '../../content/siteConfig';

const ICON_BY_KEY = {
  bootcamps: Terminal,
  marketplace: ShoppingBag,
  leaderboard: Trophy,
  zero_day_market: Shield,
  cyber_points: Zap,
  contact: Mail,
} as const;

const NAV_GROUPS = [
  {
    label: 'Platform',
    items: SITE_CONFIG.nav.platform.map((item) => ({
      ...item,
      icon: ICON_BY_KEY[item.key],
    })),
  },
  {
    label: SITE_CONFIG.nav.services.label,
    path: SITE_CONFIG.nav.services.path,
  },
  {
    label: 'Company',
    items: SITE_CONFIG.nav.company.map((item) => ({
      ...item,
      icon: ICON_BY_KEY[item.key],
    })),
  },
];

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const mobileDrawerRef = useRef<HTMLDivElement | null>(null);
  const scrollY = useScrollY();
  const location = useLocation();
  const isScrolled = scrollY > 80;

  useEffect(() => { setIsOpen(false); setActiveDropdown(null); setMobileExpanded(null); }, [location]);
  useEffect(() => {
    if (!isOpen) return undefined;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);
  useEffect(() => {
    if (!isOpen) return undefined;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (mobileDrawerRef.current && !mobileDrawerRef.current.contains(target)) {
        setIsOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  const mobileDrawer = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/72 backdrop-blur-sm z-[190] md:hidden"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            ref={mobileDrawerRef}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            id="mobile-nav-drawer"
            className="fixed top-0 right-0 h-[100dvh] w-[92vw] max-w-sm bg-bg-card border-l border-border shadow-2xl shadow-black/40 z-[200] flex flex-col md:hidden overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-bg-card/95 backdrop-blur-md">
              <Logo size="md" />
              <button onClick={() => setIsOpen(false)} className="p-2 min-h-11 min-w-11 flex items-center justify-center text-text-muted hover:text-accent transition-colors" aria-label="Close menu">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav items — scrollable */}
            <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar py-4 px-4 space-y-2">
              {NAV_GROUPS.map((group) => (
                <div key={group.label}>
                  {group.path ? (
                    /* Direct link (Services) */
                    <Link
                      to={group.path}
                      className="flex items-center justify-between w-full px-3 py-3 rounded-lg text-sm font-bold uppercase tracking-wider text-text-primary hover:bg-accent-dim hover:text-accent transition-colors"
                    >
                      {group.label}
                      <ArrowRight className="w-4 h-4 text-text-muted" />
                    </Link>
                  ) : (
                    /* Accordion group */
                    <div>
                      <button
                        onClick={() => setMobileExpanded(mobileExpanded === group.label ? null : group.label)}
                        className="flex items-center justify-between w-full px-3 py-3 rounded-lg text-sm font-bold uppercase tracking-wider text-text-primary hover:bg-accent-dim hover:text-accent transition-colors"
                      >
                        <span>{group.label}</span>
                        <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 ${mobileExpanded === group.label ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {mobileExpanded === group.label && group.items && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="grid grid-cols-1 gap-2 px-2 pb-3 pt-1">
                              {group.items.map((item) => (
                                <Link
                                  key={item.label}
                                  to={item.path}
                                  className="flex flex-col gap-1.5 p-3 rounded-lg bg-bg border border-border hover:border-accent/40 hover:bg-accent-dim transition-all active:scale-95"
                                >
                                  <div className="flex items-center gap-2">
                                    <item.icon className="w-3.5 h-3.5 text-accent flex-none" />
                                    <span className="text-xs font-bold uppercase tracking-tight text-text-primary leading-tight">{item.label}</span>
                                  </div>
                                  <span className="text-[10px] text-text-muted leading-tight">{item.desc}</span>
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Auth buttons pinned to bottom */}
            <div className="px-4 pt-4 border-t border-border bg-bg-card/95 backdrop-blur-md space-y-3 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-center gap-2 border border-border rounded-lg py-3 text-sm font-bold uppercase tracking-widest text-text-muted hover:border-accent/40 hover:text-accent transition-all"
              >
                {theme === 'dark' ? <><Sun className="w-4 h-4" /> Light Mode</> : <><Moon className="w-4 h-4" /> Dark Mode</>}
              </button>
              {user ? (
                <>
                  {user.isAdmin && (
                    <Link to="/mr-robot/dashboard" className="w-full flex items-center justify-center gap-2 border border-accent text-accent rounded-lg py-3 text-sm font-bold uppercase tracking-widest hover:bg-accent-dim transition-all">
                      <Lock className="w-4 h-4" /> Admin Console
                    </Link>
                  )}
                  <Link to="/cyber-points" className="w-full flex items-center justify-center gap-2 border border-border text-text-muted rounded-lg py-3 text-sm font-bold uppercase tracking-widest hover:border-accent/40 hover:text-accent transition-all">
                    <Zap className="w-4 h-4" /> Cyber Points
                  </Link>
                  <Link to="/dashboard" className="w-full flex items-center justify-center gap-2 bg-accent text-bg rounded-lg py-3 text-sm font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-accent/20">
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                </>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  <Link to="/cyber-points" className="flex items-center justify-center gap-2 border border-border text-text-muted rounded-lg py-3 text-sm font-bold uppercase tracking-widest hover:border-accent/40 hover:text-accent transition-all">
                    <Zap className="w-4 h-4" /> Cyber Points
                  </Link>
                  <Link to="/login" className="flex items-center justify-center border border-accent text-accent rounded-lg py-3 text-sm font-bold uppercase tracking-widest hover:bg-accent-dim transition-all">
                    Log In
                  </Link>
                  <Link to="/register" className="flex items-center justify-center bg-accent text-bg rounded-lg py-3 text-sm font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-accent/20">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 overflow-visible transition-all duration-300 h-[72px] flex items-center px-4 md:px-8 ${
        isScrolled ? 'bg-bg/85 backdrop-blur-md' : 'bg-transparent'
      }`}
      style={{ boxShadow: 'none', outline: 'none', borderBottom: 'none' }}
    >
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <Logo size="lg" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-1">
          {NAV_GROUPS.map((group) => (
            <div 
              key={group.label}
              className="relative group h-[72px] flex items-center overflow-visible"
              onMouseEnter={() => group.items && setActiveDropdown(group.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              {group.path ? (
                <Link 
                  to={group.path}
                  className="px-4 py-2 text-sm font-medium uppercase tracking-wider text-text-primary hover:text-accent transition-colors"
                >
                  {group.label}
                </Link>
              ) : (
                <button 
                  className="px-4 py-2 text-sm font-medium uppercase tracking-wider text-text-primary hover:text-accent transition-colors flex items-center gap-1"
                >
                  {group.label}
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === group.label ? 'rotate-180' : ''}`} />
                </button>
              )}

              {/* Dropdown Desktop */}
              <AnimatePresence>
                {activeDropdown === group.label && group.items && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-[80] top-[72px] left-1/2 -translate-x-1/2 w-[520px] bg-bg-card border border-border rounded-lg shadow-2xl p-5"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      {group.items.map((item) => (
                        <Link
                          key={item.label}
                          to={item.path}
                          className="flex items-start gap-4 p-3 rounded-md hover:bg-accent-dim transition-colors group/item"
                        >
                          <div className="p-2 rounded bg-bg border border-border group-hover/item:border-accent group-hover/item:text-accent transition-colors flex-none">
                            <item.icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-bold uppercase tracking-wider text-text-primary mb-0.5">
                              {item.label}
                            </div>
                            <div className="text-xs text-text-muted">
                              {item.desc}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center space-x-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-border text-text-muted hover:text-accent hover:border-accent/40 transition-all"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              {user.isAdmin && (
                <Link to="/mr-robot/dashboard" className="text-sm font-bold uppercase tracking-wider text-accent border border-accent/30 rounded-md px-4 py-2 hover:bg-accent-dim transition-all flex items-center gap-2">
                   <Lock className="w-3.5 h-3.5" /> Admin Console
                </Link>
              )}
              <Link to="/cyber-points" className="text-sm font-bold uppercase tracking-wider text-text-muted hover:text-accent transition-colors flex items-center gap-1.5">
                <Zap className="w-4 h-4" /> Cyber Points
              </Link>
              <Link to="/dashboard" className="btn-primary !px-5 !py-2 text-sm flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
              </Link>
            </div>
          ) : (
            <>
              <Link to="/cyber-points" className="text-sm font-bold uppercase tracking-wider text-text-muted hover:text-accent transition-colors flex items-center gap-1.5">
                <Zap className="w-4 h-4" /> Cyber Points
              </Link>
              <Link to="/login" className="text-sm font-bold uppercase tracking-wider text-accent border border-accent rounded-md px-5 py-2 hover:bg-accent-dim transition-all">
                Log In
              </Link>
              <Link to="/register" className="btn-primary !px-5 !py-2 text-sm">
                Start Training
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-text-primary p-2 min-h-11 min-w-11 flex items-center justify-center"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          aria-controls="mobile-nav-drawer"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {typeof document !== 'undefined' ? createPortal(mobileDrawer, document.body) : mobileDrawer}
    </nav>
  );
};

export default Navbar;
