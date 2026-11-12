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
  <div className="flex h-[78px] min-w-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border border-border-subtle bg-surface px-2 animate-pulse">
    <div className="flex min-w-0 max-w-full items-center gap-1.5">
      <Skeleton className="h-4 w-4 shrink-0 rounded" />
      <Skeleton className="h-5 w-10 rounded" />
    </div>
    <Skeleton className="h-3 w-3/4 rounded" />
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
  const longRank = isRank && valueString.length > 10;

  const Tag = href ? 'a' : onClick ? 'button' : 'div';
  const hrefProps = href ? { href } : {};
  const clickProps = onClick ? { onClick, type: 'button' as const } : {};

  const valueClasses = cn(
    'min-w-0 truncate whitespace-nowrap font-bold leading-none tabular-nums text-text-primary',
    longRank ? 'text-[14px]' : 'text-[clamp(14px,4.4vw,18px)]',
  );

  const iconClasses = cn(
    'h-4 w-4 shrink-0',
    accent ? 'text-accent' : 'text-text-muted',
  );

  return (
    <Tag
      className={cn(
        'flex h-[78px] flex-col items-center justify-center gap-1 rounded-xl border border-border-subtle bg-surface px-2 min-w-0 overflow-hidden',
        className,
      )}
      {...hrefProps}
      {...clickProps}
    >
      <span className="flex min-w-0 max-w-full items-center gap-1.5">
        {icon && <span className={iconClasses} aria-hidden="true">{icon}</span>}
        <span className={valueClasses} title={isRank ? valueString : undefined}>
          {valueString}
        </span>
      </span>
      <span className="min-w-0 max-w-full truncate whitespace-nowrap text-[12px] leading-none text-text-muted">{label}</span>
    </Tag>
  );
};

export default CompactStatCard;