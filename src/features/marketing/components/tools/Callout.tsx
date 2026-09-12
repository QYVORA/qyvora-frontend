import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

export type CalloutVariant = 'warning' | 'info';

interface CalloutProps {
  variant?: CalloutVariant;
  icon?: React.ElementType;
  eyebrow?: string;
  title?: string;
  className?: string;
  children: React.ReactNode;
}

const VARIANT_STYLES: Record<CalloutVariant, { accent: string; tile: string; text: string }> = {
  warning: {
    accent: 'border-warning/30 bg-warning/5',
    tile: 'bg-warning/10 border border-warning/20 text-warning',
    text: 'text-text-secondary',
  },
  info: {
    accent: 'border-accent/30 bg-accent/5',
    tile: 'bg-accent/10 border border-accent/20 text-accent',
    text: 'text-text-secondary',
  },
};

/**
 * Callout — inline reading-note for documentation pages.
 * Used for authorization reminders, constraints, and caveats that should
 * interrupt the flow before a user runs a command.
 */
const Callout: React.FC<CalloutProps> = ({
  variant = 'info',
  icon: Icon,
  eyebrow,
  title,
  className,
  children,
}) => {
  const styles = VARIANT_STYLES[variant];
  const IconCmp = Icon ?? (variant === 'warning' ? AlertTriangle : Info);

  return (
    <div
      role={variant === 'warning' ? 'note' : undefined}
      className={cn('rounded-2xl border px-5 md:px-6 py-5 flex gap-4 items-start', styles.accent, className)}
    >
      <div className={cn('w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0', styles.tile)}>
        <IconCmp className="w-5 h-5 md:w-6 md:h-6" />
      </div>
      <div className="min-w-0 flex flex-col gap-2">
        {eyebrow && (
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-text-muted">{eyebrow}</p>
        )}
        {title && (
          <p className="text-sm font-black text-text-primary uppercase tracking-wide">{title}</p>
        )}
        <div className={cn('text-xs md:text-sm font-mono leading-relaxed', styles.text)}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Callout;