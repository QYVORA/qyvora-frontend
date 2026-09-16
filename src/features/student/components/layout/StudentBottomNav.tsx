import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Home,
  Sparkles,
  Swords,
  Trophy,
  User,
  BookOpen,
  Terminal,
  FlaskConical,
  ShoppingBag,
  ChevronRight,
} from 'lucide-react';
import { BottomSheet, BottomSheetContent } from '@/shared/components/ui/BottomSheet';

interface BottomNavItem {
  key: string;
  label: string;
  icon: React.ElementType;
  to?: string;
  sheet?: 'learn';
}

const PRIMARY_ITEMS: BottomNavItem[] = [
  { key: 'home', label: 'student.bottomNav.home', icon: Home, to: '/dashboard' },
  { key: 'learn', label: 'student.bottomNav.learn', icon: Sparkles, sheet: 'learn' },
  { key: 'practice', label: 'student.bottomNav.practice', icon: Swords, to: '/dashboard/competitive' },
  { key: 'progress', label: 'student.bottomNav.progress', icon: Trophy, to: '/dashboard/profile' },
  { key: 'profile', label: 'student.bottomNav.profile', icon: User, to: '/dashboard/settings' },
];

const LEARN_LINKS = [
  { key: 'courses', label: 'nav.myCourses', to: '/dashboard/courses', icon: BookOpen },
  { key: 'bootcamp', label: 'nav.bootcamp', to: '/dashboard/bootcamps', icon: Terminal },
  { key: 'labs', label: 'nav.labs', to: '/dashboard/labs', icon: FlaskConical },
  { key: 'marketplace', label: 'nav.marketplace', to: '/dashboard/marketplace', icon: ShoppingBag },
];

/**
 * StudentBottomNav — mobile-only bottom navigation (audit pattern:
 * Home · Learn · Practice · Progress · Profile). Learn opens a bottom sheet
 * with the learning destinations. fixed, safe-area aware, hidden on md+.
 */
const StudentBottomNav: React.FC = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [sheetOpen, setSheetOpen] = useState(false);

  const isActive = (to?: string) => Boolean(to && pathname === to);
  const isLearnActive = (to?: string) => Boolean(to && pathname.startsWith(to));

  return (
    <>
      <nav
        aria-label={t('student.bottomNav.label', 'Primary')}
        className="fixed inset-x-0 bottom-0 z-[90] border-t border-border-subtle bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        <div className="flex items-stretch justify-around px-2">
          {PRIMARY_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = item.to ? isActive(item.to) : false;
            const learnActive = item.sheet ? isLearnActive('/dashboard/courses') || isLearnActive('/dashboard/bootcamps') || isLearnActive('/dashboard/labs') : false;

            const inner = (
              <span
                className={`flex h-full w-full flex-col items-center justify-center gap-1 py-2.5 ${
                  active || learnActive ? 'text-accent' : 'text-text-secondary'
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
                <span className="text-xs font-medium leading-none">{t(item.label)}</span>
              </span>
            );

            if (item.sheet) {
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setSheetOpen(true)}
                  aria-expanded={sheetOpen}
                  className="flex min-h-[56px] flex-1 items-center justify-center transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
                >
                  {inner}
                </button>
              );
            }
            return (
              <NavLink
                key={item.key}
                to={item.to!}
                className="flex min-h-[56px] flex-1 items-center justify-center transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
              >
                {inner}
              </NavLink>
            );
          })}
        </div>
      </nav>

      <BottomSheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <BottomSheetContent ariaLabel={t('student.bottomNav.learn', 'Learn')}>
          <div className="px-3 py-4">
            <p className="type-label mb-1 px-2 text-accent uppercase tracking-[0.12em]">
              {t('student.bottomNav.learn', 'Learn')}
            </p>
            <div className="flex flex-col">
              {LEARN_LINKS.map((link) => {
                const Icon = link.icon;
                const active = isLearnActive(link.to);
                return (
                  <Link
                    key={link.key}
                    to={link.to}
                    onClick={() => setSheetOpen(false)}
                    className={`flex min-h-[48px] items-center justify-between border-b border-border-subtle px-2 py-3 first:pt-2 ${
                      active ? 'text-accent' : 'text-text-primary'
                    } transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      <span className="text-sm">{t(link.label)}</span>
                    </span>
                    <ChevronRight className="h-4 w-4 text-text-tertiary" aria-hidden="true" />
                  </Link>
                );
              })}
            </div>
          </div>
        </BottomSheetContent>
      </BottomSheet>

      {/* Spacer so page content clears the fixed bar and safe area */}
      <div className="h-16 md:hidden" aria-hidden="true" />
    </>
  );
};

StudentBottomNav.displayName = 'StudentBottomNav';

export default StudentBottomNav;