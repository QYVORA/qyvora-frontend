import React, { useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import {
  Home,
  Wrench,
  Mail,
  Radar,
  Calendar,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { IconLeaderboard, IconMarketplace, IconDashboard, IconLock, IconX } from '@/shared/components/icons';
import { useAuth } from '@/core/contexts/AuthContext';
import { BottomSheet, BottomSheetClose, BottomSheetContent } from '@/shared/components/ui';
import { ContactTrigger } from '@/features/marketing/components/ContactModal';

import ADMIN_PATH from '@/shared/utils/adminPath';

/* ── Primary tabs (always visible) ─────────────────────────────────────────── */
const PRIMARY = [
  { key: 'home',        icon: Home,   path: '/'           },
  { key: 'leaderboard', icon: IconLeaderboard, path: '/leaderboard' },
  { key: 'contact',     icon: Mail,   path: '/contact'    },
];

/* ── More sheet items ───────────────────────────────────────────────────────── */
const MORE_ITEMS: { key: string; icon: any; path: string }[] = [
  { key: 'events', icon: Calendar, path: '/events' },
  { key: 'market', icon: IconMarketplace, path: '/zero-day-market' },
];

const BOTTOM_NAV_KEYS: Record<string, string> = {
  home: 'components.bottomNav.home',
  leaderboard: 'components.bottomNav.leaderboard',
  contact: 'components.bottomNav.contact',
  events: 'components.bottomNav.events',
  market: 'components.bottomNav.market',
};

const PublicBottomNav: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const location = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const closeMore = useCallback(() => setMoreOpen(false), []);

  return (
    <>
      {/* ── Bottom bar ─────────────────────────────────────────────────────── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-[100] md:hidden bg-bg-card/95 backdrop-blur-md flex items-stretch"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        aria-label="Mobile navigation"
      >
        {PRIMARY.map((item) => {
          const active = isActive(item.path);
          const content = (
            <>
              {active && (
                <span className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-accent rounded-full" />
              )}
              <item.icon
                className={`w-5 h-5 transition-all ${active ? 'text-accent drop-shadow-[0_0_6px_rgba(6,182,111,0.4)]' : 'text-text-muted'}`}
              />
              <span
                className={`text-[10px] font-bold uppercase tracking-wide transition-colors ${
                  active ? 'text-accent' : 'text-text-muted'
                }`}
              >
                {t(BOTTOM_NAV_KEYS[item.key] || item.key)}
              </span>
            </>
          );

          if (item.path === '/contact') {
            return (
              <ContactTrigger
                key={item.path}
                className="relative flex-1 flex flex-col items-center justify-center gap-1 py-3 min-h-[60px] active:bg-accent-dim/30 transition-colors"
              >
                {content}
              </ContactTrigger>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex-1 flex flex-col items-center justify-center gap-1 py-3 min-h-[60px] active:bg-accent-dim/30 transition-colors"
              aria-current={active ? 'page' : undefined}
            >
              {content}
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
          <Wrench className="w-5 h-5 text-text-muted" strokeWidth={1.8} />
          <span className="text-[10px] font-bold uppercase tracking-wide text-text-muted">{t('components.bottomNav.more')}</span>
        </button>
       </nav>

      {/* ── More bottom sheet ───────────────────────────────────────────────── */}
      <BottomSheet open={moreOpen} onOpenChange={setMoreOpen}>
        <BottomSheetContent ariaLabel="More navigation options">
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-border" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3">
                <span className="text-xs font-black uppercase tracking-widest text-text-muted">
                  {t('components.bottomNav.more')}
                </span>
                <BottomSheetClose
                  className="p-2 text-text-muted hover:text-accent transition-colors"
                  aria-label="Close"
                >
                  <IconX size={20} />
                </BottomSheetClose>
              </div>

               {/* Nav grid - only show if there are items */}
               {MORE_ITEMS.length > 0 && (
                 <div className="grid grid-cols-2 gap-3 p-4">
                   {MORE_ITEMS.map((item) => {
                     const active = isActive(item.path);
                     return (
                       <Link
                         key={item.path}
                         to={item.path}
                         onClick={closeMore}
                         className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all active:scale-95 ${
                           active
                             ? 'bg-accent-dim border-accent/30 text-accent'
                             : 'bg-bg border-border text-text-muted hover:border-accent/30 hover:text-accent'
                         }`}
                       >
                         <item.icon className="w-5 h-5" />
                         <span className="text-[11px] font-black uppercase tracking-wide text-center leading-tight">
                           {t(BOTTOM_NAV_KEYS[item.key] || item.key)}
                         </span>
                       </Link>
                     );
                   })}
                 </div>
               )}

              <div className="px-4 pb-4 space-y-3 pt-4">
                {user ? (
                  <>
                    {user.isAdmin && (
                      <Link
                        to={`${ADMIN_PATH}/dashboard`}
                        onClick={closeMore}
                        className="w-full flex items-center justify-center gap-2 border border-accent text-accent rounded-xl py-3.5 text-sm font-bold uppercase tracking-widest hover:bg-accent-dim transition-all active:scale-95"
                      >
                        <IconLock size={16} /> {t('components.bottomNav.adminConsole')}
                      </Link>
                    )}
                    <Link
                      to="/dashboard"
                      onClick={closeMore}
                      className="w-full flex items-center justify-center gap-2 bg-accent text-bg rounded-xl py-3.5 text-sm font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-black/10 active:scale-95"
                    >
                      <IconDashboard size={16} /> {t('components.bottomNav.dashboard')}
                    </Link>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      to="/login"
                      onClick={closeMore}
                      className="flex items-center justify-center gap-2 border border-accent text-accent rounded-xl py-3.5 text-sm font-bold uppercase tracking-widest hover:bg-accent-dim transition-all active:scale-95"
                    >
                      <LogIn className="w-4 h-4" /> {t('components.bottomNav.logIn')}
                    </Link>
                    <Link
                      to="/register"
                      onClick={closeMore}
                      className="flex items-center justify-center gap-2 bg-accent text-bg rounded-xl py-3.5 text-sm font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-black/10 active:scale-95"
                    >
                      <UserPlus className="w-4 h-4" /> {t('components.bottomNav.signUp')}
                    </Link>
                  </div>
                )}
              </div>
        </BottomSheetContent>
      </BottomSheet>
    </>
  );
};

export default PublicBottomNav;
