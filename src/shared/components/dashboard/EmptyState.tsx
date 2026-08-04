import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui';
import Dobia from '@/shared/components/Dobia';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    to?: string;
    onClick?: () => void;
  };
}

const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-border/20 py-12 text-center h-full min-h-[220px] flex flex-col items-center justify-center bg-transparent mx-1">
    <div className="mx-auto mb-3">{icon ?? <Dobia expression="confused" size="lg" />}</div>
    <p className="mb-4 text-sm text-text-muted">{title}</p>
    {action && action.to && (
      <Link
        to={action.to}
        className="bg-accent text-on-accent px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:brightness-110 inline-flex items-center gap-1.5"
      >
        {action.label}
      </Link>
    )}
    {action && action.onClick && (
      <Button
        variant="primary"
        size="md"
        onClick={action.onClick}
        className="px-6 py-2.5"
      >
        {action.label}
      </Button>
    )}
  </div>
);

export default EmptyState;
