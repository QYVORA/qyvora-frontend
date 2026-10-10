import React from 'react';
import type { ReactNode } from 'react';

interface ProfileEmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export const ProfileEmptyState: React.FC<ProfileEmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border border-border bg-bg-card p-6 text-center ${className}`}
    >
      {icon && <div className="mb-3 text-text-muted">{icon}</div>}
      <h3 className="font-mono text-sm font-black uppercase tracking-wider text-text-primary">
        {title}
      </h3>
      {description && (
        <p className="mt-1 max-w-sm font-mono text-xs leading-relaxed text-text-muted">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default ProfileEmptyState;
