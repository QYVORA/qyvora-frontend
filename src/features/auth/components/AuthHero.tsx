import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Terminal, Shield, Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const authBullets = [
  { icon: Terminal, key: 'labs' },
  { icon: Shield, key: 'scenarios' },
  { icon: Trophy, key: 'ctf' },
];

/**
 * AuthHero — the calm left-hand value statement on desktop auth screens.
 * No globe, no grid, no pulsing accents. Just copy and a few quiet features.
 */
const AuthHero: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="relative hidden min-h-dvh w-full flex-col overflow-hidden md:flex">
      <div className="shrink-0 pt-10 pl-6">
        <Link
          to="/"
          className="inline-flex min-h-[44px] items-center gap-2 px-2 text-sm font-bold text-text-secondary transition-colors hover:text-text-primary"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {t('button.backToHome')}
        </Link>
      </div>

      <div className="flex w-full flex-1 flex-col justify-center px-3 py-16 md:px-4 lg:px-6">
        <div className="w-full max-w-xl">
          <h1 className="type-display mb-6 font-black uppercase tracking-tight text-text-primary">
            {t('hero.welcomeTo')} <span className="text-accent">QYVORA</span>
          </h1>
          <p className="type-body mt-2 max-w-xl">{t('hero.description')}</p>

          <ul className="mt-10 grid gap-4">
            {authBullets.map(({ icon: Icon, key }) => (
              <li key={key} className="flex items-center gap-3 text-sm text-text-secondary">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border-subtle bg-surface text-accent">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                {t(`auth.bullets.${key}`)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AuthHero;