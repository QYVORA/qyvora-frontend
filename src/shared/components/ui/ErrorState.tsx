import type { ReactNode } from 'react';
import Dobia from '@/shared/components/Dobia';

interface ErrorStateProps {
  message: string;
  title?: string;
  icon?: ReactNode;
  className?: string;
  severity?: 'warning' | 'error';
  /**
   * Render just the error avatar — no card, no red background, no text.
   * Used in marketing sections where a clean, minimal placeholder is wanted.
   */
  bare?: boolean;
}

const ErrorState = ({ message, title, icon, className = '', severity = 'warning', bare = false }: ErrorStateProps) => {
  if (bare) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <Dobia
          expression={severity === 'error' ? 'angry' : 'confused'}
          size="hero"
          animated={false}
        />
      </div>
    );
  }
  return (
    <div className={`flex items-start gap-3 p-4 rounded-2xl border border-danger/30 bg-danger/5 ${className}`}>
      <div className="shrink-0 mt-0.5">{icon ?? <Dobia expression={severity === 'error' ? 'angry' : 'confused'} size="lg" />}</div>
      <div>
        {title && <p className="text-sm font-bold text-danger">{title}</p>}
        <p className={`text-sm text-danger/70 ${title ? 'mt-1' : ''}`}>{message}</p>
      </div>
    </div>
  );
};

export default ErrorState;
