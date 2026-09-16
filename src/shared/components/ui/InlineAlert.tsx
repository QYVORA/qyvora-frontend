import React from 'react';
import { Info, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

export type InlineAlertVariant = 'info' | 'success' | 'warning' | 'danger';

interface InlineAlertProps {
  variant?: InlineAlertVariant;
  title?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const VARIANT_STYLES: Record<InlineAlertVariant, { icon: React.ReactNode; classes: string; iconClasses: string }> = {
  info: {
    icon: <Info className="h-4 w-4" aria-hidden="true" />,
    classes: 'border-semantic-info/30 bg-semantic-info/5 text-text-secondary',
    iconClasses: 'text-semantic-info',
  },
  success: {
    icon: <CheckCircle2 className="h-4 w-4" aria-hidden="true" />,
    classes: 'border-accent/40 bg-accent/10 text-text-secondary',
    iconClasses: 'text-accent',
  },
  warning: {
    icon: <AlertTriangle className="h-4 w-4" aria-hidden="true" />,
    classes: 'border-semantic-warning/30 bg-semantic-warning/5 text-text-secondary',
    iconClasses: 'text-semantic-warning',
  },
  danger: {
    icon: <AlertOctagon className="h-4 w-4" aria-hidden="true" />,
    classes: 'border-semantic-danger/30 bg-semantic-danger/5 text-text-primary',
    iconClasses: 'text-semantic-danger',
  },
};

/**
 * Inline alert for form/server/side effects. Always pairs icon + text so the
 * semantic colour is never the only feedback channel.
 */
const InlineAlert: React.FC<InlineAlertProps> = ({ variant = 'info', title, children, className }) => {
  const v = VARIANT_STYLES[variant];
  return (
    <div
      role={variant === 'danger' ? 'alert' : 'status'}
      className={cn('flex items-start gap-3 rounded-xl border px-4 py-3', v.classes, className)}
    >
      <span className={cn('mt-0.5 shrink-0', v.iconClasses)}>{v.icon}</span>
      <div className="min-w-0">
        {title && <p className="text-sm font-semibold text-text-primary">{title}</p>}
        {children && <div className="type-body-sm mt-0.5">{children}</div>}
      </div>
    </div>
  );
};

export default InlineAlert;