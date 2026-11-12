import React, { useRef } from 'react';
import type { LucideIcon } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import Menu, { MenuItem } from '@/shared/components/ui/Menu';

export interface NavChild {
  label: string;
  to: string;
  description?: string;
  icon?: LucideIcon;
}

export interface NavItem {
  key: string;
  label: string;
  to?: string;
  icon: LucideIcon;
  children?: NavChild[];
}

interface NavDropdownProps {
  item: NavItem;
  active: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * NavDropdown — shared topbar dropdown. One surface for the dashboard
 * Practice/Develop groups and the public Learn/Services/Tools groups.
 * Hover opens on fine pointers; click/Enter/Space/ArrowDown toggles.
 */
const NavDropdown: React.FC<NavDropdownProps> = ({ item, active, open, onOpenChange }) => {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const hoverTimer = useRef<number | undefined>(undefined);
  const id = `site-nav-${item.key}-menu`;
  const Icon = item.icon;

  const canHover = () =>
    typeof window !== 'undefined' &&
    window.matchMedia?.('(hover: hover) and (pointer: fine)').matches;

  const openOnHover = () => {
    if (!canHover()) return;
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => onOpenChange(true), 120);
  };

  const closeOnHover = () => {
    if (!canHover()) return;
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => onOpenChange(false), 160);
  };

  return (
    <div className="relative" onMouseEnter={openOnHover} onMouseLeave={closeOnHover}>
      <button
        ref={triggerRef}
        id={`${id}-trigger`}
        type="button"
        data-menu-trigger
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => onOpenChange(!open)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            onOpenChange(true);
          }
        }}
        className={cn(
          'flex h-14 min-w-[84px] flex-col items-center justify-center gap-2 rounded-md px-3 text-base font-medium transition-colors',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
          active ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary',
        )}
      >
        <Icon
          className={cn(
            'h-6 w-6 shrink-0 text-accent transition-transform duration-200',
            active && 'scale-110',
          )}
          strokeWidth={2}
          aria-hidden="true"
        />
        <span className="flex items-center gap-1.5 whitespace-nowrap">
          {item.label}
          <ChevronDown
            className={cn('h-3.5 w-3.5 text-accent transition-transform', open && 'rotate-180')}
            aria-hidden="true"
          />
        </span>
      </button>

      <Menu
        id={id}
        open={open}
        onClose={() => onOpenChange(false)}
        className="absolute left-0 top-full mt-2 min-w-[240px]"
        labelledBy={`${id}-trigger`}
      >
        {item.children?.map((child) => {
          const ChildIcon = child.icon;
          return (
            <MenuItem
              key={child.to}
              to={child.to}
              icon={ChildIcon ? <ChildIcon /> : undefined}
              onClick={() => onOpenChange(false)}
            >
              <span className="block">
                <span className="block">{child.label}</span>
                {child.description && (
                  <span className="mt-0.5 block text-xs font-normal text-text-muted">
                    {child.description}
                  </span>
                )}
              </span>
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
};

export default NavDropdown;
