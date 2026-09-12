import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import ScrollReveal from '@/shared/components/ScrollReveal';
import Button from '@/shared/components/ui/Button';

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
            <Button
              key={action.label}
              onClick={action.onClick}
              disabled={action.loading}
              loading={action.loading}
              variant={action.variant ?? 'primary'}
              size="md"
              icon={action.icon}
            >
              {action.loading ? t('components.common.loading') : action.label}
            </Button>
          ))}
        </div>
      )}
    </ScrollReveal>
  );
};

export default PageHeader;