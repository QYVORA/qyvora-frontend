import type { ReactNode } from 'react';
import Dobia from '@/shared/components/Dobia';

interface ErrorStateProps {
  message: string;
  title?: string;
  icon?: ReactNode;
  className?: string;
}

const ErrorState = ({ message, title, icon, className = '' }: ErrorStateProps) => (
  <div className={`flex items-start gap-3 p-4 rounded-2xl border border-red-400/30 bg-red-400/5 ${className}`}>
    <div className="shrink-0 mt-0.5">{icon ?? <Dobia expression="confused" size="sm" />}</div>
    <div>
      {title && <p className="text-sm font-bold text-red-400">{title}</p>}
      <p className={`text-sm text-red-400 ${title ? 'text-text-secondary mt-1' : ''}`}>{message}</p>
    </div>
  </div>
);

export default ErrorState;
