import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Zap, Terminal, Monitor, ShoppingBag, User, LogOut, Bell, Settings, MoreHorizontal, X, BookOpen, Wallet, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../../../core/contexts/AuthContext';
import { useToast } from '../../../../core/contexts/ToastContext';
import { useTheme } from '../../../../core/contexts/ThemeContext';
import Logo from '../../../../shared/components/brand/Logo';
import { useEffect, useRef, useState } from 'react';
import api from '../../../../core/services/api';
import { AnimatePresence, motion } from 'motion/react';

const NAV = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Learn', path: '/learn' },
  { label: 'Bootcamp', path: '/bootcamps' },
  { label: 'Rooms', path: '/rooms' },
  { label: 'Wallet', path: '/wallet' },
  { label: 'Market', path: '/marketplace' },
  { label: 'Profile', path: '/profile' },
];

// Primary 4 shown in bottom bar; rest go in "More" sheet
const MOBILE_PRIMARY = [
  { label: 'Home', icon: Zap, path: '/dashboard' },
  { label: 'Learn', icon: Terminal, path: '/learn' },
  { label: 'Rooms', icon: Monitor, path: '/rooms' },
  { label: 'Market', icon: ShoppingBag, path: '/marketplace' },
];

const MOBILE_MORE = [
  { label: 'Bootcamp', icon: BookOpen, path: '/bootcamps' },
  { label: 'Wallet', icon: Wallet, path: '/wallet' },
  { label: 'Profile', icon: User, path: '/profile' },
  { label: 'Notifications', icon: Bell, path: '/notifications' },
  { label: 'Settings', icon: Settings, path: '/settings' },
];

const StudentTopbar = () => {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [moreOpen, setMoreOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get('/notifications')
      .then((res) => {
        const items = Array.isArray(res.data) ? res.data : [];
        setUnreadCount(items.filter((n: any) => !n.read).length);
      })
      .catch(() => {});
  }, [location.pathname]);

  // Close sheet on route change
  useEffect(() => { setMoreOpen(false); }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    addToast('Security session terminated.', 'info');
    navigate('/login');
  };

  return (
    <>
      {/* ── Desktop / tablet topbar ── */}
      <header className="fixed top-0 left-0 w-full z-40 bg-bg/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          {/* Logo + nav */}
          <div className="flex items-center gap-6">
            <Link to="/"><Logo size="md" /></Link>
            <nav className="hidden lg:flex items-center gap-1 overflow-x-auto no-scrollbar">
              {NAV.map((item) => {
                const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                      active
                        ? 'text-accent bg-accent-dim'
                        : 'text-text-muted hover:text-text-primary hover:bg-accent-dim/50'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User info + actions */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs font-bold text-text-primary font-mono tracking-tighter">
                {user?.username || '—'}
              </span>
              <span className="text-[10px] text-accent font-mono">{user?.rank || '—'}</span>
            </div>
            <div className="w-9 h-9 rounded-full border border-border bg-accent-dim flex items-center justify-center text-accent font-bold text-sm flex-none">
              {user?.username?.substring(0, 2).toUpperCase() || 'OP'}
            </div>

            {/* Notifications — visible on all sizes */}
            <Link
              to="/notifications"
              className="relative p-2.5 text-text-muted hover:text-accent transition-colors rounded-lg hover:bg-accent-dim/50"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-accent text-bg text-[9px] font-black rounded-full flex items-center justify-center leading-none">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            {/* Settings — desktop only */}
            <Link
              to="/settings"
              className="hidden md:flex p-2.5 text-text-muted hover:text-accent transition-colors rounded-lg hover:bg-accent-dim/50"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </Link>

            {/* Theme toggle — desktop only */}
            <button
              onClick={toggleTheme}
              className="hidden md:flex p-2.5 text-text-muted hover:text-accent transition-colors rounded-lg hover:bg-accent-dim/50"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={handleLogout}
              className="hidden md:flex p-2.5 text-text-muted hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10"
              aria-label="Log out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile bottom nav ── */}
      <nav className="fixed bottom-0 left-0 w-full bg-bg-card/95 backdrop-blur-md border-t border-border flex md:hidden z-50"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {MOBILE_PRIMARY.map((item) => {
          const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-3 min-h-[56px] active:bg-accent-dim/30 transition-colors"
            >
              <item.icon className={`w-5 h-5 transition-colors ${active ? 'text-accent' : 'text-text-muted'}`} />
              <span className={`text-[10px] font-bold uppercase tracking-wide transition-colors ${active ? 'text-accent' : 'text-text-muted'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* More button */}
        <button
          onClick={() => setMoreOpen(true)}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-3 min-h-[56px] active:bg-accent-dim/30 transition-colors relative"
          aria-label="More navigation"
        >
          <MoreHorizontal className="w-5 h-5 text-text-muted" />
          <span className="text-[10px] font-bold uppercase tracking-wide text-text-muted">More</span>
          {unreadCount > 0 && (
            <span className="absolute top-2 right-[calc(50%-14px)] w-4 h-4 bg-accent text-bg text-[9px] font-black rounded-full flex items-center justify-center leading-none">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </nav>

      {/* ── Mobile "More" bottom sheet ── */}
      <AnimatePresence>
        {moreOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
              onClick={() => setMoreOpen(false)}
            />
            {/* Sheet */}
            <motion.div
              ref={sheetRef}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[70] md:hidden bg-bg-card border-t border-border rounded-t-2xl"
              style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-border" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-border/50">
                <div>
                  <div className="text-xs font-black text-text-primary uppercase tracking-widest">{user?.username || 'Operator'}</div>
                  <div className="text-[10px] text-accent font-mono">{user?.rank || 'Candidate'} · {user?.cp?.toLocaleString() ?? 0} CP</div>
                </div>
                <button onClick={() => setMoreOpen(false)} className="p-2 text-text-muted hover:text-accent transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nav grid */}
              <div className="grid grid-cols-3 gap-3 p-4">
                {MOBILE_MORE.map((item) => {
                  const active = location.pathname === item.path;
                  const isNotif = item.path === '/notifications';
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all active:scale-95 ${
                        active
                          ? 'bg-accent-dim border-accent/30 text-accent'
                          : 'bg-bg border-border text-text-muted hover:border-accent/30 hover:text-accent'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="text-[10px] font-bold uppercase tracking-wide text-center leading-tight">{item.label}</span>
                      {isNotif && unreadCount > 0 && (
                        <span className="absolute top-2 right-2 w-4 h-4 bg-accent text-bg text-[9px] font-black rounded-full flex items-center justify-center leading-none">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Logout */}
              <div className="px-4 pb-4 space-y-3">
                {/* Theme toggle */}
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-text-muted text-sm font-bold uppercase tracking-widest hover:border-accent/40 hover:text-accent transition-all active:scale-95"
                >
                  {theme === 'dark' ? <><Sun className="w-4 h-4" /> Light Mode</> : <><Moon className="w-4 h-4" /> Dark Mode</>}
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-400/20 text-red-400 text-sm font-bold uppercase tracking-widest hover:bg-red-400/10 transition-all active:scale-95"
                >
                  <LogOut className="w-4 h-4" /> Log Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default StudentTopbar;
