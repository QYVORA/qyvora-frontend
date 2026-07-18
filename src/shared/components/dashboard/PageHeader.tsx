import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import ScrollReveal from '@/shared/components/ScrollReveal';

export interface PageHeaderAction {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

export interface PageHeaderProps {
  pretitle?: string;
  title: string;
  subtitle?: string;
  actions?: PageHeaderAction[];
  loading?: boolean;
}

const variantStyles: Record<string, string> = {
  primary: 'bg-accent text-bg hover:brightness-110 shadow-lg shadow-accent/20',
  secondary: 'bg-bg-elevated text-text-muted hover:text-accent border border-border/60',
  danger: 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20',
};

const PageHeader = ({ pretitle, title, subtitle, actions, loading }: PageHeaderProps) => {
  const { t } = useTranslation();
  return (
    <ScrollReveal className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div>
        {pretitle && (
          <div className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-accent">
            {pretitle}
          </div>
        )}
        <h1 className="text-4xl font-black text-text-primary md:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 max-w-lg text-base text-text-muted">
            {loading ? t('components.common.loading') : subtitle}
          </p>
        )}
      </div>
      {actions && actions.length > 0 && (
        <div className="flex items-center gap-3">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              disabled={action.loading}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all active:scale-95 disabled:opacity-50 ${variantStyles[action.variant ?? 'primary']}`}
            >
              {action.icon && <span className={`w-4 h-4 ${action.loading ? 'animate-spin' : ''}`}>{action.icon}</span>}
              {action.loading ? t('components.common.loading') : action.label}
            </button>
          ))}
        </div>
      )}
    </ScrollReveal>
  );
};

export default PageHeader;
