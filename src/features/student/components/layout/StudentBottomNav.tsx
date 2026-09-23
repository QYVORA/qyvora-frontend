import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  Home,
  Swords,
  User,
  Settings,
  BookOpen,
  ShieldCheck,
  Bug,
  ShoppingBag,
  Network,
  ChevronRight,
} from 'lucide-react';
import { BottomSheet, BottomSheetContent } from '@/shared/components/ui/BottomSheet';

type SheetKey = 'learn' | 'practice';

interface BottomNavItem {
  key: string;
  label: string;
  icon: React.ElementType;
  to?: string;
  sheet?: SheetKey;
}

interface SheetLink {
  key: string;
  label: string;
  to: string;
  icon: React.ElementType;
}

const PRIMARY_ITEMS: BottomNavItem[] = [
  { key: 'home', label: 'Home', icon: Home, to: '/dashboard' },
  { key: 'learn', label: 'Learn', icon: BookOpen, sheet: 'learn' },
  { key: 'practice', label: 'Practice', icon: Swords, sheet: 'practice' },
  { key: 'profile', label: 'Profile', icon: User, to: '/dashboard/profile' },
  { key: 'settings', label: 'Settings', icon: Settings, to: '/dashboard/settings' },
];

const LEARN_LINKS: SheetLink[] = [
  { key: 'courses', label: 'My Courses', to: '/dashboard/courses', icon: BookOpen },
  { key: 'bootcamp', label: 'Bootcamp', to: '/dashboard/bootcamps', icon: ShieldCheck },
  { key: 'labs', label: 'Labs', to: '/dashboard/labs', icon: Bug },
  { key: 'marketplace', label: 'Marketplace', to: '/dashboard/marketplace', icon: ShoppingBag },
];

const PRACTICE_LINKS: SheetLink[] = [
  { key: 'competitive', label: 'Competitive', to: '/dashboard/competitive', icon: Swords },
  { key: 'networks', label: 'Networks', to: '/dashboard/networks', icon: Network },
];

const SHEETS: Record<SheetKey, { label: string; links: SheetLink[] }> = {
  learn: { label: 'Learn', links: LEARN_LINKS },
  practice: { label: 'Practice', links: PRACTICE_LINKS },
};

/**
 * StudentBottomNav — fixed bottom navigation for every viewport below `lg`.
 * (The desktop sidebar rail takes over at `lg`.) Audit pattern:
 * Home · Learn · Practice · Profile · Settings. Learn and Practice open bottom
 * sheets with their destinations; safe-area aware.
 */
const StudentBottomNav: React.FC = () => {
  const { pathname } = useLocation();
  const [sheet, setSheet] = useState<SheetKey | null>(null);

  const isRouteActive = (to?: string) => {
    if (!to) return false;
    return to === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(to);
  };

  const isSheetActive = (key: SheetKey) =>
    SHEETS[key].links.some((link) => pathname.startsWith(link.to));

  const activeSheet = sheet ? SHEETS[sheet] : null;

  return (
    <>
      <nav
        aria-label={"Primary"}
        className="fixed inset-x-0 bottom-0 z-[90] border-t border-border-subtle bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        <div className="flex items-stretch justify-around gap-1.5 px-2">
          {PRIMARY_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isRouteActive(item.to) || (item.sheet ? isSheetActive(item.sheet) : false);

            const inner = (
              <span
                className={`flex h-full w-full flex-col items-center justify-center gap-1 py-2.5 ${
                  active ? 'text-accent' : 'text-text-secondary'
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
                <span className="text-xs font-medium leading-none">{item.label}</span>
              </span>
            );

            if (item.sheet) {
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setSheet(item.sheet!)}
                  aria-expanded={sheet === item.sheet}
                  aria-haspopup="dialog"
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

      <BottomSheet open={sheet !== null} onOpenChange={(open) => { if (!open) setSheet(null); }}>
        <BottomSheetContent ariaLabel={activeSheet?.label ?? 'Navigation'}>
          {activeSheet && (
            <div className="px-3 py-4">
              <p className="type-label mb-1 px-2 text-accent uppercase tracking-[0.12em]">
                {activeSheet.label}
              </p>
              <div className="flex flex-col">
                {activeSheet.links.map((link) => {
                  const Icon = link.icon;
                  const active = pathname.startsWith(link.to);
                  return (
                    <Link
                      key={link.key}
                      to={link.to}
                      onClick={() => setSheet(null)}
                      className={`flex min-h-[48px] items-center justify-between border-b border-border-subtle px-2 py-3 first:pt-2 ${
                        active ? 'text-accent' : 'text-text-primary'
                      } transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent`}
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        <span className="text-sm">{link.label}</span>
                      </span>
                      <ChevronRight className="h-4 w-4 text-text-tertiary" aria-hidden="true" />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </BottomSheetContent>
      </BottomSheet>

      {/* Spacer so page content clears the fixed bar and safe area */}
      <div className="h-16 lg:hidden" aria-hidden="true" />
    </>
  );
};

StudentBottomNav.displayName = 'StudentBottomNav';

export default StudentBottomNav;
