import React from 'react';
import { Link } from 'react-router-dom';
import { IconArrowLeft } from '@/shared/components/icons';
import { GridBoxedBackground } from '@/shared/components/backgrounds';
import AuthHero from '@/features/auth/components/AuthHero';

interface AuthFormLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const AuthFormLayout: React.FC<AuthFormLayoutProps> = ({ children }) => (
  <>
    {/* Mobile background layer */}
    <div className="md:hidden fixed inset-0 bg-accent -z-10">
      <GridBoxedBackground opacity={0.5} blur={0} mask="none" />
    </div>

    <div className="min-h-screen relative md:grid md:grid-cols-2">
      <AuthHero />
      <div className="flex flex-col items-center px-4 py-8 md:p-12 relative md:backdrop-blur-xl min-h-screen md:h-screen md:overflow-y-auto">
        {/* Back to Home button - Mobile only (desktop has it in AuthHero) */}
        <div className="absolute top-6 left-6 z-20 md:hidden">
          <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 text-text-primary rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:opacity-70 active:scale-95">
            <IconArrowLeft size={16} /> Back to Home
          </Link>
        </div>

        {/* Scrollable form container */}
        <div className="w-full max-w-lg relative z-10 py-12 md:py-16 my-auto">
          {children}
        </div>
      </div>
    </div>
  </>
);

export default AuthFormLayout;
