import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Menu, X, Home, LogIn, UserPlus, Sun, Moon, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/core/contexts/AuthContext';
import { useTheme } from '@/core/contexts/ThemeContext';
import { Logo } from '@/shared/components/brand';

const BLOG_NAV_ITEMS = [
  { key: 'home', label: 'Home', path: '/', icon: Home },
  { key: 'learn', label: 'Learn', path: '/learn', icon: BookOpen },
  { key: 'anansi', label: 'Anansi CLI', path: '/anansi' },
  { key: 'team', label: 'Team', path: '/team' },
];

const BlogsNavbar: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

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
        className="fixed top-0 left-0 w-full z-[100] overflow-visible h-[80px] flex items-center"
        style={{ outline: 'none', border: 'none' }}
      >
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 xl:px-16 flex items-center justify-between">

          <Link to="/" aria-label="QYVORA - Home" className="flex items-center transition-transform hover:scale-105 duration-300 relative z-[110]">
            <Logo size="xl" className="hidden md:block" />
            <Logo size="md" variant="mark" className="md:hidden" />
          </Link>

          <div className="hidden md:flex items-center space-x-10">
            {BLOG_NAV_ITEMS.map((item) => {
              const isActive = item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.key}
                  to={item.path}
                  className={`text-[11px] font-black uppercase tracking-[0.3em] transition-all hover:text-accent relative group ${
                    isActive ? 'text-accent' : 'text-text-primary/70'
                  }`}
                >
                  {item.label}
                  <span className={`absolute -bottom-1 left-0 w-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full ${
                    isActive ? 'w-full' : ''
                  }`} />
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4 relative z-[110]">
            <button
              onClick={toggleTheme}
              className="p-2 text-text-primary/70 hover:text-accent hover:bg-white/5 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
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
                Blogs Navigation
              </span>

              {BLOG_NAV_ITEMS.map((item) => {
                const isActive = item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.key}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-4 text-xl font-black uppercase tracking-widest transition-colors ${
                      isActive ? 'text-accent' : 'text-text-primary'
                    }`}
                  >
                    {Icon ? <Icon className="w-5 h-5 text-accent" /> : (
                      <div className="w-5 h-5 flex items-center justify-center">
                        <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-accent' : 'bg-border'}`} />
                      </div>
                    )}
                    {item.label}
                  </Link>
                );
              })}

              <div className="mt-auto pt-10 flex flex-col gap-4">
                {user ? (
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full bg-accent text-bg font-bold uppercase tracking-[0.12em] rounded-xl px-10 py-4 text-sm hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <LayoutDashboard className="w-5 h-5" /> Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full bg-accent text-bg font-bold uppercase tracking-[0.12em] rounded-xl px-10 py-4 text-sm hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <UserPlus className="w-5 h-5" /> Start Training
                    </Link>
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full border border-accent/30 text-accent font-bold uppercase tracking-[0.12em] rounded-xl px-10 py-4 text-sm hover:bg-accent/5 active:scale-95 transition-all flex items-center justify-center gap-2"
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

export default BlogsNavbar;
