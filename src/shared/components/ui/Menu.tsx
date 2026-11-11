import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/shared/utils/cn';

interface MenuProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  labelledBy?: string;
  id?: string;
}

/**
 * Popover menu surface. Parent owns open state + positioning (absolute).
 * Handles Escape, outside click, first-item focus and Up/Down/Home/End.
 */
const Menu = React.forwardRef<HTMLDivElement, MenuProps>(
  ({ open, onClose, children, className, labelledBy, id }, ref) => {
    const internalRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      if (!open) return;
      const items = internalRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]');
      items?.[0]?.focus();

      const onPointerDown = (event: PointerEvent) => {
        const target = event.target as Node;
        if (internalRef.current && !internalRef.current.contains(target) &&
            !(target instanceof Element && target.closest('[data-menu-trigger]'))) {
          onClose();
        }
      };
      const onKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          onClose();
        }
      };
      document.addEventListener('pointerdown', onPointerDown);
      document.addEventListener('keydown', onKey);
      return () => {
        document.removeEventListener('pointerdown', onPointerDown);
        document.removeEventListener('keydown', onKey);
      };
    }, [open, onClose]);

    if (!open) return null;

    const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      const items = Array.from(
        internalRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])') ?? [],
      );
      if (items.length === 0) return;
      const current = items.indexOf(document.activeElement as HTMLElement);
      const focus = (index: number) => {
        const next = (index + items.length) % items.length;
        items[next].focus();
      };
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        focus(current + 1);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        focus(current - 1);
      } else if (event.key === 'Home') {
        event.preventDefault();
        focus(0);
      } else if (event.key === 'End') {
        event.preventDefault();
        focus(items.length - 1);
      }
    };

    return (
      <div
        ref={(node) => {
          internalRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        id={id}
        role="menu"
        aria-labelledby={labelledBy}
        onKeyDown={onKeyDown}
        className={cn(
          'z-[300] min-w-[240px] rounded-2xl border border-border-subtle bg-surface-raised p-1.5 shadow-none',
          'motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-95',
          className,
        )}
      >
        {children}
      </div>
    );
  },
);

Menu.displayName = 'Menu';

interface MenuItemProps {
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  to?: string;
  href?: string;
  danger?: boolean;
  disabled?: boolean;
  trailing?: React.ReactNode;
}

const itemClass = (danger?: boolean) =>
  cn(
    'flex w-full min-h-[40px] items-center gap-3 rounded-lg px-3 py-2 text-left text-[15px] transition-colors',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
    danger
      ? 'text-danger hover:bg-danger/10 focus:bg-danger/10'
      : 'text-text-primary hover:bg-surface focus:bg-surface',
  );

export const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  children,
  onClick,
  to,
  href,
  danger,
  disabled,
  trailing,
}) => {
  const content = (
    <>
      {icon && <span className={cn('[&_svg]:h-4 [&_svg]:w-4', danger ? 'text-danger' : 'text-text-muted')}>{icon}</span>}
      <span className="flex-1 truncate">{children}</span>
      {trailing && <span className="shrink-0 text-sm text-text-muted">{trailing}</span>}
    </>
  );

  if (to) {
    return (
      <Link to={to} role="menuitem" onClick={onClick} className={itemClass(danger)}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} role="menuitem" onClick={onClick} className={itemClass(danger)}>
        {content}
      </a>
    );
  }
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={onClick}
      className={cn(itemClass(danger), disabled && 'cursor-not-allowed opacity-45')}
    >
      {content}
    </button>
  );
};

export const MenuSeparator: React.FC = () => (
  <div role="separator" className="my-1.5 h-px bg-border-subtle" />
);

export const MenuLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="px-3 pb-1 pt-2 text-xs font-medium text-text-muted">{children}</div>
);

export default Menu;
