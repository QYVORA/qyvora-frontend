import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AuthHero from '@/features/auth/components/AuthHero';

interface AuthFormLayoutProps {
  children: React.ReactNode;
}

/**
 * AuthFormLayout — quiet authentication shell. One split: a calm value
 * statement on the left (desktop), the form on the right. No globe, no grid
 * background — just surfaces, borders, and readable type. The page never
 * scrolls: the form column owns the scroll so the shell always fills the
 * viewport edge-to-edge with one consistent background.
 */
const AuthFormLayout: React.FC<AuthFormLayoutProps> = ({ children }) => {

  return (
    <div
      className="relative h-dvh w-full overflow-hidden bg-canvas md:grid md:grid-cols-2"
      data-theme-persist="dark"
    >
      <AuthHero />

      {/* Form column — owns the scroll; the shell itself never scrolls */}
      <div className="relative h-full w-full overflow-y-auto bg-canvas">
        <div className="flex min-h-full w-full flex-col px-3 pb-12 md:items-center md:px-4 lg:px-6">
          <div className="shrink-0 pt-6 pl-3 md:hidden md:pl-4">
            <Link
              to="/"
              className="inline-flex min-h-[44px] items-center gap-2 px-4 text-sm font-bold text-text-secondary transition-colors hover:text-text-primary"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {"Back to Home"}
            </Link>
          </div>
          <div className="my-auto w-full py-8 md:max-w-lg md:py-10">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthFormLayout;