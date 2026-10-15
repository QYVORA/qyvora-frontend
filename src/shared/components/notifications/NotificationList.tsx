import React from 'react';
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Coins,
  Info,
  ShieldCheck,
  Trophy,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import EmptyState from '@/shared/components/ui/EmptyState';
import Skeleton from '@/shared/components/ui/Skeleton';

/** Minimal shape every notifications surface (dialog, sheet, dropdown) renders. */
export interface NotificationListEntry {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt?: string;
  type?: string;
}

/**
 * Canonical type → tone map. Mirrors `NotificationsPage` so a notification looks
 * identical everywhere it appears.
 */
export const NOTIFICATION_TYPE_STYLES: Record<string, string> = {
  cp_earned: 'text-accent border-accent/30 bg-accent/5',
  cp_points_granted: 'text-accent border-accent/30 bg-accent/5',
  cp_points_deducted: 'text-danger border-danger/30 bg-danger/5',
  cp_points_set: 'text-accent border-accent/30 bg-accent/5',
  rank_change: 'text-accent border-accent/30 bg-accent/5',
  room_completed: 'text-accent border-accent/30 bg-accent/5',
  payment_confirmed: 'text-accent border-accent/30 bg-accent/5',
  payment_failed: 'text-danger border-danger/30 bg-danger/5',
  quiz_available: 'text-info border-info/30 bg-info/5',
  quiz_result: 'text-accent border-accent/30 bg-accent/5',
  admin_message: 'text-text-secondary border-border-subtle bg-surface-raised',
  landing_reward: 'text-accent border-accent/30 bg-accent/5',
};

const DEFAULT_TYPE_STYLE = 'text-text-tertiary border-border-subtle bg-surface-raised';

export const notificationTypeStyle = (type?: string): string =>
  (type && NOTIFICATION_TYPE_STYLES[type]) || DEFAULT_TYPE_STYLE;

export const notificationTypeLabel = (type?: string): string =>
  type ? type.replace(/_/g, ' ') : '';

const TYPE_ICONS: Record<string, LucideIcon> = {
  cp_earned: Coins,
  cp_points_granted: Coins,
  cp_points_set: Coins,
  landing_reward: Coins,
  cp_points_deducted: AlertTriangle,
  payment_failed: AlertTriangle,
  payment_confirmed: CheckCircle2,
  rank_change: Trophy,
  room_completed: Trophy,
  quiz_result: Trophy,
  quiz_available: Info,
  admin_message: ShieldCheck,
};

const NEGATIVE_TYPES = new Set(['cp_points_deducted', 'payment_failed']);

export const notificationTypeIcon = (type?: string): LucideIcon =>
  (type && TYPE_ICONS[type]) || Bell;

const formatDate = (value?: string): string => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleString();
};

interface NotificationRowProps {
  notification: NotificationListEntry;
  /** When provided, rows become actionable and mark themselves read on activation. */
  onMarkRead?: (id: string) => void;
  /** Tighter rhythm for the desktop dropdown. */
  dense?: boolean;
}

export const NotificationRow: React.FC<NotificationRowProps> = ({
  notification,
  onMarkRead,
  dense = false,
}) => {
  const { id, title, message, read, createdAt, type } = notification;
  const Icon = notificationTypeIcon(type);
  const negative = type ? NEGATIVE_TYPES.has(type) : false;
  // Only unread items on a surface that supports marking become interactive.
  const actionable = Boolean(onMarkRead) && !read;

  const surface = read
    ? 'border-border-subtle bg-surface/40'
    : negative
      ? 'border-danger/20 bg-danger/[0.04]'
      : 'border-accent/20 bg-accent/[0.04]';

  return (
    <div
      role={actionable ? 'button' : undefined}
      tabIndex={actionable ? 0 : undefined}
      aria-label={actionable ? `${title} - unread` : undefined}
      onClick={actionable ? () => onMarkRead?.(id) : undefined}
      onKeyDown={
        actionable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onMarkRead?.(id);
              }
            }
          : undefined
      }
      className={cn(
        'group relative flex w-full items-start gap-3 rounded-xl border text-left transition-colors duration-[var(--dur-base)] ease-[var(--ease-smooth)]',
        dense ? 'p-3' : 'p-3.5',
        surface,
        actionable && 'cursor-pointer hover:border-accent/40',
        read && 'opacity-70',
        actionable && 'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent',
      )}
    >
      <span
        className={cn(
          'flex shrink-0 items-center justify-center rounded-lg border',
          dense ? 'h-8 w-8' : 'h-9 w-9',
          read ? DEFAULT_TYPE_STYLE : notificationTypeStyle(type),
        )}
        aria-hidden="true"
      >
        <Icon className={dense ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <span
            className={cn(
              'min-w-0 flex-1 truncate font-bold text-text-primary',
              dense ? 'text-xs' : 'text-sm',
            )}
          >
            {title}
          </span>
          {!read && (
            <span
              className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent"
              aria-hidden="true"
            />
          )}
        </div>

        {message && (
          <p
            className={cn(
              'mt-1 line-clamp-2 text-xs leading-relaxed',
              read ? 'text-text-muted' : 'text-text-secondary',
            )}
          >
            {message}
          </p>
        )}

        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          {createdAt && <span className="type-meta">{formatDate(createdAt)}</span>}
          {type && (
            <span className="type-meta rounded border border-border-subtle bg-surface-raised px-1.5 py-0.5">
              {notificationTypeLabel(type)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const NotificationSkeleton: React.FC<{ count?: number; dense?: boolean }> = ({
  count = 4,
  dense = false,
}) => (
  <div className="space-y-2" aria-hidden="true">
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        className={cn(
          'flex items-start gap-3 rounded-xl border border-border-subtle bg-surface/40',
          dense ? 'p-3' : 'p-3.5',
        )}
      >
        <Skeleton variant="icon" className={cn('rounded-lg', dense ? 'h-8 w-8' : 'h-9 w-9')} />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton variant="text" className="h-3.5 w-2/3" />
          <Skeleton variant="text" className="h-3 w-full" />
        </div>
      </div>
    ))}
  </div>
);

interface NotificationListProps {
  items: NotificationListEntry[];
  loading?: boolean;
  onMarkRead?: (id: string) => void;
  dense?: boolean;
  className?: string;
  emptyTitle?: string;
  emptyMessage?: string;
}

/**
 * Shared notification list used by the topbar dialog, bottom sheet and dropdown.
 * Loading → skeleton rows, empty → shared EmptyState, otherwise canonical rows.
 */
const NotificationList: React.FC<NotificationListProps> = ({
  items,
  loading = false,
  onMarkRead,
  dense = false,
  className,
  emptyTitle = 'No notifications yet.',
  emptyMessage,
}) => {
  if (loading) return <NotificationSkeleton dense={dense} />;

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<Bell className="h-5 w-5" />}
        title={emptyTitle}
        description={emptyMessage}
        className={cn(dense ? 'px-4 py-8' : undefined, className)}
      />
    );
  }

  return (
    <div className={cn('space-y-2', className)} role="list">
      {items.map((item) => (
        <div key={item.id} role="listitem">
          <NotificationRow notification={item} onMarkRead={onMarkRead} dense={dense} />
        </div>
      ))}
    </div>
  );
};

export default NotificationList;
