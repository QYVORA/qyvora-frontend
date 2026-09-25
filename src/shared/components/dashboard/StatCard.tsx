import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { IconMinus } from '@/shared/components/icons';
import { Skeleton } from '@/shared/components/ui';

export interface TrendData {
  direction: 'up' | 'down' | 'flat';
  value: string;
  label?: string;
}

export interface StatCardProps extends React.HTMLAttributes<HTMLElement> {
  icon?: ReactNode;
  label: string;
  value: ReactNode;
  trend?: TrendData;
  accent?: boolean;
  loading?: boolean;
  onClick?: () => void;
  href?: string;
}

const TrendIcon = ({ direction }: { direction: TrendData['direction'] }) => {
  switch (direction) {
    case 'up':
      return <TrendingUp className="w-3 h-3 text-accent" />;
    case 'down':
      return <TrendingDown className="w-3 h-3 text-danger" />;
    default:
      return <IconMinus size={12} className="text-text-muted" />;
  }
};

export const StatCardSkeleton = () => (
  <div className="rounded-2xl border border-border-subtle bg-surface p-5 space-y-4">
    <div className="flex items-center gap-3">
      <Skeleton className="w-10 h-10 rounded-xl bg-surface-raised shrink-0" />
      <Skeleton className="h-3 w-24 bg-border/30 rounded" />
    </div>
    <Skeleton className="h-8 w-16 bg-border/30 rounded" />
  </div>
);

const StatCard = ({
  icon, label, value, trend, accent, loading, className, onClick, href,
  ...rest
}: StatCardProps) => {
  if (loading) return <StatCardSkeleton />;

  const Tag = href ? 'a' : onClick ? 'button' : 'div';
  const hrefProps = href ? { href } : {};
  const clickProps = onClick ? { onClick, type: 'button' as const } : {};

  return (
    <Tag
      className={`rounded-2xl border border-border-subtle bg-surface p-5 transition-[border-color,box-shadow,transform] duration-[var(--dur-base)] ease-[var(--ease-smooth)] ${
        accent ? 'border-accent/55' : ''
      } ${onClick || href ? 'cursor-pointer hover:border-accent/40 active:scale-[0.98]' : ''} ${className ?? ''}`}
      {...hrefProps}
      {...clickProps}
      {...rest}
    >
      <div className="flex items-center gap-3 mb-3">
        {icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            accent ? 'bg-accent/10' : 'bg-surface-raised'
          }`}>
            {icon}
          </div>
        )}
        <span className="text-xs font-black uppercase tracking-widest text-text-tertiary">{label}</span>
      </div>
      <div className="flex items-end gap-3">
        <div className={`font-mono text-2xl font-black leading-none tabular-nums ${
          accent ? 'text-accent' : 'text-text-primary'
        }`}>
          {value}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-bold font-mono ${
            trend.direction === 'up' ? 'text-accent' : trend.direction === 'down' ? 'text-danger' : 'text-text-muted'
          }`}>
            <TrendIcon direction={trend.direction} />
            {trend.value}
            {trend.label && <span className="text-text-muted/60 text-xs">({trend.label})</span>}
          </div>
        )}
      </div>
    </Tag>
  );
};

export default StatCard;
