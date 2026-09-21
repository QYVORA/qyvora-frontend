import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, Wrench, FlaskConical, ShieldCheck, CircleUserRound } from 'lucide-react';

interface BottomNavItem {
  key: string;
  label: string;
  icon: React.ElementType;
  to: string;
}

const ITEMS: BottomNavItem[] = [
  { key: 'learn', label: 'Learn', icon: BookOpen, to: '/learn' },
  { key: 'tools', label: 'Tools', icon: Wrench, to: '/tools' },
  { key: 'research', label: 'Research', icon: FlaskConical, to: '/blogs' },
  { key: 'services', label: 'Services', icon: ShieldCheck, to: '/services' },
  { key: 'about', label: 'About', icon: CircleUserRound, to: '/about' },
];

/**
 * PublicBottomNav — mobile-only bottom navigation for the public marketing
 * shell (audit pattern: Learn · Tools · Research · Services · About, mirroring
 * the top PublicNavigation links). fixed, safe-area aware, hidden on md+.
 */
const PublicBottomNav: React.FC = () => (
  <>
    <nav
      aria-label="Primary"
      className="border-t border-border-subtle bg-surface pb-[env(safe-area-inset-bottom)] md:hidden fixed inset-x-0 bottom-0 z-[90]"
    >
      <div className="flex items-stretch justify-around px-2">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.key}
              to={item.to}
              className="flex min-h-[56px] flex-1 items-center justify-center transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
            >
              {({ isActive }) => (
                <span
                  className={`flex h-full w-full flex-col items-center justify-center gap-1 py-2.5 ${
                    isActive ? 'text-accent' : 'text-text-secondary'
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
                  <span className="text-xs font-medium leading-none">{item.label}</span>
                </span>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>

    {/* Spacer so page content clears the fixed bar and safe area */}
    <div className="h-16 md:hidden" aria-hidden="true" />
  </>
);

PublicBottomNav.displayName = 'PublicBottomNav';

export default PublicBottomNav;