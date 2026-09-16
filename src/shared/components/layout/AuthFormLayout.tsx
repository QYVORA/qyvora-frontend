import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import AuthHero from '@/features/auth/components/AuthHero';

interface AuthFormLayoutProps {
  children: React.ReactNode;
}

/**
 * AuthFormLayout — quiet authentication shell. One split: a calm value
 * statement on the left (desktop), the form on the right. No globe, no grid
 * background — just surfaces, borders, and readable type.
 */
const AuthFormLayout: React.FC<AuthFormLayoutProps> = ({ children }) => {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-dvh bg-canvas">
      <div className="relative h-dvh md:grid md:grid-cols-2">
        <AuthHero />

        {/* Mobile: back link + form, stacked */}
        <div className="md:hidden relative flex min-h-dvh w-full flex-col overflow-y-auto">
          <div className="shrink-0 pt-6 pl-3 md:pl-4">
            <Link
              to="/"
              className="inline-flex min-h-[44px] items-center gap-2 px-4 text-sm font-bold text-text-secondary transition-colors hover:text-text-primary"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {t('button.backToHome')}
            </Link>
          </div>
          <div className="flex w-full flex-1 flex-col justify-center px-3 pb-12 md:px-4">
            {children}
          </div>
        </div>

        {/* Desktop: form column */}
        <div className="hidden md:flex flex-col items-center px-3 py-16 md:px-4 lg:px-6">
          <div className="my-auto w-full max-w-lg">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthFormLayout;