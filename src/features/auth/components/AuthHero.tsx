import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Terminal, Shield, Trophy } from 'lucide-react';
import authDobiaBg from '@/assets/backgrounds/auth-dobia.webp';

const authBullets = [
  { icon: Terminal, text: 'Hands-on penetration testing labs' },
  { icon: Shield, text: 'Real-world offensive security scenarios' },
  { icon: Trophy, text: 'Capture the flag challenges & rankings' },
];

/**
 * AuthHero — the calm left-hand value statement on desktop auth screens.
 * No globe, no grid, no pulsing accents. Just copy and a few quiet features.
 */
const AuthHero: React.FC = () => {
  return (
    <div className="relative hidden h-full w-full flex-col overflow-hidden md:flex">
      <img
        src={authDobiaBg}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
      />
      <div className="relative shrink-0 pt-10 pl-6">
        <Link
          to="/"
          className="inline-flex min-h-[44px] items-center gap-2 px-2 text-sm font-bold text-text-secondary transition-colors hover:text-text-primary"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {"Back to Home"}
        </Link>
      </div>

      <div className="relative flex w-full flex-1 flex-col justify-center px-3 py-16 md:px-4 lg:px-6">
        <div className="w-full max-w-xl">
          <h1 className="type-display mb-6 font-black uppercase tracking-tight text-text-primary">
            {"Welcome to"} <span className="text-accent">QYVORA</span>
          </h1>
          <p className="type-body mt-2 max-w-xl">{"Building a strong cybersecurity ecosystem in Africa."}</p>

          <ul className="mt-10 grid gap-4">
            {authBullets.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-text-secondary">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border-subtle bg-surface text-accent">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AuthHero;