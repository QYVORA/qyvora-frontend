import React from 'react';
import { Link } from 'react-router-dom';
import { IconArrowLeft, IconTerminal, IconShield, IconTarget } from '@/shared/components/icons';
import { GridBoxedBackground } from '@/shared/components/backgrounds';
import AuthHero from '@/features/auth/components/AuthHero';
import { Logo } from '@/shared/components/brand';

const bullets = [
  { icon: IconTerminal, text: 'Hands-on penetration testing labs' },
  { icon: IconShield, text: 'Real-world offensive security scenarios' },
  { icon: IconTarget, text: 'Capture the flag challenges & rankings' },
];

interface AuthFormLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const AuthFormLayout: React.FC<AuthFormLayoutProps> = ({ children }) => (
  <>
    {/* Mobile background layer */}
    <div className="md:hidden fixed inset-0 bg-bg -z-10">
      <GridBoxedBackground opacity={0.5} blur={0} mask="none" />
    </div>

    <div className="min-h-screen relative md:grid md:grid-cols-2">
      <AuthHero />

      {/* Mobile: hero + form stacked */}
      <div className="md:hidden flex flex-col px-3 py-12 relative min-h-screen overflow-y-auto">
        <div className="absolute top-6 left-6 z-20">
          <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 text-text-primary rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:opacity-70 active:scale-95">
            <IconArrowLeft size={16} /> Back to Home
          </Link>
        </div>

        <div className="relative z-10 flex flex-col gap-8 pt-16 w-full">
          <div className="flex flex-col gap-5">
            <Logo size="md" variant="full" />
            <p className="text-text-secondary text-sm font-bold leading-relaxed max-w-sm">
              Africa&apos;s offensive security platform built to sharpen your skills from the ground up.
            </p>
            <ul className="flex flex-col gap-3">
              {bullets.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <span className="flex-none w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-accent" />
                  </span>
                  <span className="text-text-primary text-xs font-bold">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full">
            {children}
          </div>
        </div>
      </div>

      {/* Desktop: form column */}
      <div className="hidden md:flex flex-col items-center px-3 md:px-4 lg:px-6 py-12 md:py-16 relative md:backdrop-blur-xl min-h-screen md:h-screen md:overflow-y-auto">
        <div className="w-full max-w-lg relative z-10 py-12 md:py-16 my-auto">
          {children}
        </div>
      </div>
    </div>
  </>
);

export default AuthFormLayout;
