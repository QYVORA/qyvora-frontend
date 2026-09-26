import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

interface DocNoteProps {
  variant?: 'warning' | 'info';
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

/**
 * DocNote — an inline constraint or caveat.
 *
 * A flat left-ruled block, not a card: notes interrupt the reading flow
 * without competing with the prose around them.
 */
const DocNote: React.FC<DocNoteProps> = ({
  variant = 'info',
  title,
  children,
  className,
}) => {
  const warning = variant === 'warning';
  const Icon = warning ? AlertTriangle : Info;

  return (
    <aside
      role={warning ? 'note' : undefined}
      className={cn(
        'border-l-2 py-1 pl-4',
        warning ? 'border-warning/60' : 'border-accent/60',
        className,
      )}
    >
      <div className="flex items-start gap-2.5">
        <Icon
          className={cn(
            'mt-0.5 h-4 w-4 shrink-0',
            warning ? 'text-warning' : 'text-accent',
          )}
          aria-hidden="true"
        />
        <div className="min-w-0 flex-1">
          {title && (
            <p className="text-xs font-black uppercase tracking-[0.16em] text-text-primary">
              {title}
            </p>
          )}
          <div className="text-sm leading-[1.9] text-text-secondary">{children}</div>
        </div>
      </div>
    </aside>
  );
};

export default DocNote;
