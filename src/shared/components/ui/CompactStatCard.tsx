import React from 'react';
import { cn } from '@/shared/utils/cn';
import { formatCompact } from '@/shared/utils/formatCompact';
import Skeleton from '@/shared/components/ui/Skeleton';

export interface CompactStatCardProps {
  icon?: React.ReactNode;
  label: string;
  value: string | number;
  accent?: boolean;
  loading?: boolean;
  className?: string;
  /** If the value is a rank string (not numeric), it will be truncated with title attribute */
  isRank?: boolean;
  onClick?: () => void;
  href?: string;
}

const CompactStatCardSkeleton = () => (
  <div className="flex h-[76px] min-w-0 flex-col justify-center gap-1.5 overflow-hidden rounded-xl border border-border-subtle bg-surface px-2.5 animate-pulse">
    <div className="flex min-w-0 max-w-full items-center gap-1.5">
      <Skeleton className="h-3.5 w-3.5 shrink-0 rounded" />
      <Skeleton className="h-4 w-10 rounded" />
    </div>
    <Skeleton className="h-px w-full rounded-none" />
    <Skeleton className="h-2.5 w-3/4 rounded" />
  </div>
);

export const CompactStatCard: React.FC<CompactStatCardProps> = ({
  icon,
  label,
  value,
  accent = false,
  loading,
  className,
  isRank = false,
  onClick,
  href,
}) => {
  if (loading) return <CompactStatCardSkeleton />;

  const valueString =
    isRank && typeof value === 'number' && Number.isFinite(value)
      ? `#${formatCompact(value)}`
      : String(value);
  const longRank = isRank && valueString.length > 8;

  const Tag = href ? 'a' : onClick ? 'button' : 'div';
  const hrefProps = href ? { href } : {};
  const clickProps = onClick ? { onClick, type: 'button' as const } : {};

  const valueClasses = cn(
    'min-w-0 flex-1 truncate whitespace-nowrap font-bold leading-none tabular-nums text-text-primary',
    longRank ? 'text-[12px]' : 'text-[clamp(13px,4vw,17px)]',
  );

  const iconClasses = cn(
    'h-3.5 w-3.5 shrink-0',
    accent ? 'text-accent' : 'text-text-muted',
  );

  return (
    <Tag
      className={cn(
        'flex h-[76px] min-w-0 flex-col justify-center gap-1.5 overflow-hidden rounded-xl border border-border-subtle bg-surface px-2.5 text-left',
        className,
      )}
      {...hrefProps}
      {...clickProps}
    >
      <span className="flex w-full min-w-0 items-center gap-1.5">
        {icon && <span className={iconClasses} aria-hidden="true">{icon}</span>}
        <span className={valueClasses} title={isRank ? valueString : undefined}>
          {valueString}
        </span>
      </span>
      <span className="h-px w-full shrink-0 bg-border-subtle" aria-hidden="true" />
      <span className="w-full truncate whitespace-nowrap text-[11px] leading-none text-text-muted">{label}</span>
    </Tag>
  );
};

export default CompactStatCard;