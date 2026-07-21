import type { ReactNode } from 'react';
import { IconWarning } from '@/shared/components/icons';

interface ErrorStateProps {
  message: string;
  title?: string;
  icon?: ReactNode;
  className?: string;
}

const ErrorState = ({ message, title, icon, className = '' }: ErrorStateProps) => (
  <div className={`flex items-start gap-3 p-4 rounded-2xl border border-red-400/30 bg-red-400/5 ${className}`}>
    {icon ?? <IconWarning size={20} className="text-red-400 shrink-0 mt-0.5" />}
    <div>
      {title && <p className="text-sm font-bold text-red-400">{title}</p>}
      <p className={`text-sm text-red-400 ${title ? 'text-text-secondary mt-1' : ''}`}>{message}</p>
    </div>
  </div>
);

export default ErrorState;
