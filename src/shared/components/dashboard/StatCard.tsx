import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Skeleton } from '@/shared/components/ui';

export interface TrendData {
  direction: 'up' | 'down' | 'flat';
  value: string;
  label?: string;
}

export interface StatCardProps {
  icon?: ReactNode;
  label: string;
  value: ReactNode;
  trend?: TrendData;
  accent?: boolean;
  loading?: boolean;
  className?: string;
  onClick?: () => void;
  href?: string;
}

const TrendIcon = ({ direction }: { direction: TrendData['direction'] }) => {
  switch (direction) {
    case 'up':
      return <TrendingUp className="w-3 h-3 text-emerald-400" />;
    case 'down':
      return <TrendingDown className="w-3 h-3 text-red-400" />;
    default:
      return <Minus className="w-3 h-3 text-text-muted" />;
  }
};

export const StatCardSkeleton = () => (
  <div className="rounded-2xl border border-border/30 bg-bg-card p-5 space-y-3">
    <Skeleton className="h-4 w-24 bg-border/30" />
    <Skeleton className="h-8 w-20 bg-border/30" />
    <Skeleton className="h-3 w-32 bg-border/30" />
  </div>
);

const StatCard = ({
  icon, label, value, trend, accent, loading, className, onClick, href,
}: StatCardProps) => {
  if (loading) return <StatCardSkeleton />;

  const Tag = href ? 'a' : onClick ? 'button' : 'div';
  const hrefProps = href ? { href } : {};
  const clickProps = onClick ? { onClick, type: 'button' as const } : {};

  return (
    <Tag
      className={`rounded-2xl border bg-bg-card p-5 transition-all duration-200 ${
        accent ? 'border-accent/30' : 'border-border/40'
      } ${onClick || href ? 'cursor-pointer hover:border-accent/40 hover:shadow-sm active:scale-[0.98]' : ''} ${className ?? ''}`}
      {...hrefProps}
      {...clickProps}
    >
      <div className="flex items-center gap-3 mb-3">
        {icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            accent ? 'bg-accent/10' : 'bg-bg-elevated'
          }`}>
            {icon}
          </div>
        )}
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">{label}</span>
      </div>
      <div className="flex items-end gap-3">
        <div className={`font-mono text-2xl font-black leading-none tabular-nums ${
          accent ? 'text-accent' : 'text-text-primary'
        }`}>
          {value}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-[11px] font-bold font-mono ${
            trend.direction === 'up' ? 'text-emerald-400' : trend.direction === 'down' ? 'text-red-400' : 'text-text-muted'
          }`}>
            <TrendIcon direction={trend.direction} />
            {trend.value}
            {trend.label && <span className="text-text-muted/60 text-[9px]">({trend.label})</span>}
          </div>
        )}
      </div>
    </Tag>
  );
};

export default StatCard;
