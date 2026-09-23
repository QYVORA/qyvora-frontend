import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';
import { BottomSheet, BottomSheetContent } from '@/shared/components/ui/BottomSheet';
import { NAV_GROUPS, ADMIN_QUICK_TABS } from './AdminTopbar/navGroups';
import type { AdminNavItem } from './AdminTopbar/navGroups';

const linkStateClass = (active: boolean) =>
  active ? 'text-accent' : 'text-text-secondary';

/**
 * AdminBottomNav — fixed bottom navigation for every viewport below `lg`,
 * mirroring the student dashboard pattern. Renders the four primary admin
 * modules plus a "More" sheet exposing the full NAV_GROUPS catalogue so every
 * module is reachable on phone and tablet (the topbar tabs are lg+ only).
 */
const AdminBottomNav = () => {
  const location = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);
  const currentTab = new URLSearchParams(location.search).get('tab') || 'overview';

  const isActive = (item: AdminNavItem) => item.tab === currentTab;

  return (
    <>
      <nav
        aria-label={"Admin"}
        className="fixed inset-x-0 bottom-0 z-[90] border-t border-border-subtle bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        <div className="flex items-stretch justify-around gap-1.5 px-2">
          {ADMIN_QUICK_TABS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex min-h-[56px] flex-1 items-center justify-center transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
              >
                <span className={`flex h-full w-full flex-col items-center justify-center gap-1 py-2.5 ${linkStateClass(active)}`}>
                  <Icon size={20} strokeWidth={2} aria-hidden="true" />
                  <span className="text-xs font-medium leading-none">{item.label}</span>
                </span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            aria-expanded={moreOpen}
            aria-haspopup="dialog"
            className="flex min-h-[56px] flex-1 items-center justify-center transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
          >
            <span className="flex h-full w-full flex-col items-center justify-center gap-1 py-2.5 text-text-secondary">
              <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
              <span className="text-xs font-medium leading-none">{"More"}</span>
            </span>
          </button>
        </div>
      </nav>

      <BottomSheet open={moreOpen} onOpenChange={setMoreOpen}>
        <BottomSheetContent ariaLabel={"Admin navigation"}>
          <div className="px-3 py-4">
            {NAV_GROUPS.map((group) => (
              <section key={group.title} className="mb-4 last:mb-0">
                <p className="type-label mb-1 px-2 text-accent uppercase tracking-[0.12em]">
                  {group.title}
                </p>
                <div className="flex flex-col">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMoreOpen(false)}
                        className={`flex min-h-[48px] items-center gap-3 border-b border-border-subtle px-2 py-3 first:pt-2 ${
                          active ? 'text-accent' : 'text-text-primary'
                        } transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent`}
                      >
                        <Icon size={16} aria-hidden="true" />
                        <span className="flex-1 text-sm">{item.label}</span>
                        <span className="hidden truncate text-xs text-text-muted sm:block">{item.desc}</span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </BottomSheetContent>
      </BottomSheet>

      {/* Spacer so page content clears the fixed bar and safe area */}
      <div className="h-16 lg:hidden" aria-hidden="true" />
    </>
  );
};

AdminBottomNav.displayName = 'AdminBottomNav';

export default AdminBottomNav;
