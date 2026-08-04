import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IconArrowLeft } from '@/shared/components/icons';
import { GridBoxedBackground } from '@/shared/components/backgrounds';
import AuthHero from '@/features/auth/components/AuthHero';

interface AuthFormLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const AuthFormLayout: React.FC<AuthFormLayoutProps> = ({ children }) => {
  const { t } = useTranslation();
  return (
    <>
      {/* Mobile background layer */}
      <div className="md:hidden fixed inset-0 bg-bg -z-10">
        <GridBoxedBackground blur={0} mask="right" />
      </div>

      <div className="min-h-dvh relative md:grid md:grid-cols-2">
        <AuthHero />

        {/* Mobile: hero + form stacked — translucent so the backdrop shows through */}
        <div className="md:hidden relative w-full min-h-dvh flex flex-col" data-nav-invert>
          <div className="absolute top-6 left-6 z-20">
            <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 text-text-primary rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:opacity-70 active:scale-95">
              <IconArrowLeft size={16} /> {t('button.backToHome')}
            </Link>
          </div>

          <div className="relative z-10 w-full flex-1 flex flex-col items-start justify-start px-3 pt-20 sm:pt-20 pb-12 sm:pb-14">
            <div className="w-full">
              {children}
            </div>
          </div>
        </div>

        {/* Desktop: form column — natural height (no forced scroll), translucent */}
        <div className="hidden md:flex flex-col items-center px-3 md:px-4 lg:px-6 py-12 md:py-16 relative min-h-dvh">
          <div className="w-full max-w-lg relative z-10 my-auto">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthFormLayout;
