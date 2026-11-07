import React from 'react';
import { NavLink } from 'react-router-dom';
import { PUBLIC_PRIMARY_LINKS } from './publicNav';

/**
 * PublicBottomNav — tablet/mobile bottom navigation for the public marketing
 * shell. Reads the same PRIMARY_LINKS as PublicNavigation. Fixed, safe-area
 * aware, hidden once the desktop top nav appears at lg+.
 */
const PublicBottomNav: React.FC = () => (
  <>
    <nav
      aria-label="Primary"
      className="chrome-fixed fixed inset-x-0 bottom-0 z-[90] border-t border-border-subtle bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <div className="flex items-stretch justify-around gap-1.5 px-2">
        {PUBLIC_PRIMARY_LINKS.map((item) => {
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
                  <span className="whitespace-nowrap text-[10px] font-medium leading-none sm:text-xs">{item.label}</span>
                </span>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>

    {/* Spacer so page content clears the fixed bar and safe area */}
    <div className="h-16 lg:hidden" aria-hidden="true" />
  </>
);

PublicBottomNav.displayName = 'PublicBottomNav';

export default PublicBottomNav;