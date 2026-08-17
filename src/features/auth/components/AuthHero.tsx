import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Shield, Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { IconArrowLeft } from '@/shared/components/icons';

const authBullets = [
  { icon: Terminal, key: 'labs' },
  { icon: Shield, key: 'scenarios' },
  { icon: Trophy, key: 'ctf' },
];

const AuthHero: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="hidden md:flex relative w-full min-h-dvh lg:h-dvh flex-col overflow-hidden">
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-text-primary rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:opacity-70 active:scale-95"
        >
          <IconArrowLeft size={16} /> {t('button.backToHome')}
        </Link>
      </div>

      <div className="relative z-10 w-full flex-1 flex flex-col items-start justify-center px-3 md:px-4 lg:px-6 py-24 lg:py-32">
        <div className="w-full max-w-xl space-y-10 lg:space-y-12">
          <div className="inline-flex items-center gap-2 px-4 py-2.5 border border-border/30 bg-bg-elevated/50 rounded-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse flex-none" />
            <span className="font-mono text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-text-muted">
              {t('hero.tagline')}
            </span>
          </div>

          <div>
            <h2 className="text-4xl md:text-5xl font-black text-text-primary tracking-tighter leading-none">
              {t('hero.welcomeTo')} <span className="text-accent">QYVORA</span>
            </h2>
            <p className="text-base text-text-muted mt-6 max-w-xl leading-relaxed">
              {t('hero.description')}
            </p>
          </div>

          <ul className="grid gap-4">
            {authBullets.map(({ icon: Icon, key }) => (
              <li key={key} className="flex items-center gap-3 text-sm text-text-muted font-mono leading-tight">
                <Icon className="w-4 h-4 text-accent flex-none" /> {t(`auth.bullets.${key}`)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AuthHero;
