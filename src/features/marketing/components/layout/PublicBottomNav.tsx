import React, { useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home,
  Terminal,
  Flag,
  ShoppingBag,
  Trophy,
  Zap,
  Link2,
  Wrench,
  Mail,
  LogIn,
  UserPlus,
  LayoutDashboard,
  Lock,
  X,
  Maximize,
  Minimize,
} from 'lucide-react';
import { useAuth } from '../../../../core/contexts/AuthContext';

/* ── Primary tabs (always visible) ─────────────────────────────────────────── */
const PRIMARY = [
  { label: 'Home',      icon: Home,     path: '/'           },
  { label: 'Bootcamps', icon: Terminal, path: '/bootcamps'  },
  { label: 'CTF',       icon: Flag,     path: '/ctf'        },
  { label: 'Market',    icon: ShoppingBag, path: '/zero-day-market' },
];

/* ── More sheet items ───────────────────────────────────────────────────────── */
const MORE_ITEMS = [
  { label: 'Leaderboard',    icon: Trophy,   path: '/leaderboard'  },
  { label: 'Cyber Points',   icon: Zap,      path: '/cyber-points' },
  { label: 'HSOCIETY Chain', icon: Link2,    path: '/chain'        },
  { label: 'Services',       icon: Wrench,   path: '/services'     },
  { label: 'Contact',        icon: Mail,     path: '/contact'      },
];

const PublicBottomNav: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  // Sync state if user exits fullscreen via browser gesture (e.g. swipe down)
  React.useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  return (
    <>
      {/* ── Bottom bar ─────────────────────────────────────────────────────── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-[100] md:hidden bg-bg-card/95 backdrop-blur-md border-t border-border flex items-stretch"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        aria-label="Mobile navigation"
      >
        {PRIMARY.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex-1 flex flex-col items-center justify-center gap-1 py-3 min-h-[60px] active:bg-accent-dim/30 transition-colors"
              aria-current={active ? 'page' : undefined}
            >
              {active && (
                <motion.div
                  layoutId="public-nav-indicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-accent rounded-full"
                />
              )}
              <item.icon
                className={`w-5 h-5 transition-colors ${active ? 'text-accent' : 'text-text-muted'}`}
                strokeWidth={active ? 2.5 : 1.8}
              />
              <span
                className={`text-[10px] font-bold uppercase tracking-wide transition-colors ${
                  active ? 'text-accent' : 'text-text-muted'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* More button */}
        <button
          onClick={() => setMoreOpen(true)}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-3 min-h-[60px] active:bg-accent-dim/30 transition-colors"
          aria-label="More navigation options"
          aria-expanded={moreOpen}
        >
          <Zap className="w-5 h-5 text-text-muted" strokeWidth={1.8} />
          <span className="text-[10px] font-bold uppercase tracking-wide text-text-muted">More</span>
        </button>

        {/* Fullscreen toggle */}
        <button
          onClick={toggleFullscreen}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-3 min-h-[60px] active:bg-accent-dim/30 transition-colors"
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullscreen
            ? <Minimize className="w-5 h-5 text-accent" strokeWidth={1.8} />
            : <Maximize className="w-5 h-5 text-text-muted" strokeWidth={1.8} />
          }
          <span className={`text-[10px] font-bold uppercase tracking-wide transition-colors ${isFullscreen ? 'text-accent' : 'text-text-muted'}`}>
            {isFullscreen ? 'Exit' : 'Full'}
          </span>
        </button>
      </nav>

      {/* ── More bottom sheet ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {moreOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] md:hidden"
              onClick={() => setMoreOpen(false)}
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[120] md:hidden bg-bg-card border-t border-border rounded-t-2xl max-h-[82svh] overflow-y-auto"
              style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-border" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-border/50">
                <span className="text-xs font-black uppercase tracking-widest text-text-muted">
                  More
                </span>
                <button
                  onClick={() => setMoreOpen(false)}
                  className="p-2 text-text-muted hover:text-accent transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nav grid */}
              <div className="grid grid-cols-2 gap-3 p-4">
                {MORE_ITEMS.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMoreOpen(false)}
                      className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all active:scale-95 ${
                        active
                          ? 'bg-accent-dim border-accent/30 text-accent'
                          : 'bg-bg border-border text-text-muted hover:border-accent/30 hover:text-accent'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="text-[11px] font-bold uppercase tracking-wide text-center leading-tight">
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>

              {/* Auth actions */}
              <div className="px-4 pb-4 space-y-3 border-t border-border/50 pt-4">
                {user ? (
                  <>
                    {user.isAdmin && (
                      <Link
                        to="/mr-robot/dashboard"
                        onClick={() => setMoreOpen(false)}
                        className="w-full flex items-center justify-center gap-2 border border-accent text-accent rounded-xl py-3.5 text-sm font-bold uppercase tracking-widest hover:bg-accent-dim transition-all active:scale-95"
                      >
                        <Lock className="w-4 h-4" /> Admin Console
                      </Link>
                    )}
                    <Link
                      to="/dashboard"
                      onClick={() => setMoreOpen(false)}
                      className="w-full flex items-center justify-center gap-2 bg-accent text-bg rounded-xl py-3.5 text-sm font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-accent/20 active:scale-95"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      to="/login"
                      onClick={() => setMoreOpen(false)}
                      className="flex items-center justify-center gap-2 border border-accent text-accent rounded-xl py-3.5 text-sm font-bold uppercase tracking-widest hover:bg-accent-dim transition-all active:scale-95"
                    >
                      <LogIn className="w-4 h-4" /> Log In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMoreOpen(false)}
                      className="flex items-center justify-center gap-2 bg-accent text-bg rounded-xl py-3.5 text-sm font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-accent/20 active:scale-95"
                    >
                      <UserPlus className="w-4 h-4" /> Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default PublicBottomNav;
