import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Logo } from '@/shared/components/brand';
import LanguageSwitcher from '@/shared/components/LanguageSwitcher';
import { SOCIAL_LINKS } from './socialLinks';

interface FooterCol {
  title: string;
  links: { key: string; label: string; to: string }[];
}

const COLS: FooterCol[] = [
  {
    title: 'footer.learning',
    links: [
      { key: 'courses', label: 'nav.courses', to: '/courses' },
      { key: 'bootcamp', label: 'nav.bootcamp', to: '/hpb' },
      { key: 'labs', label: 'nav.labs', to: '/labs' },
    ],
  },
  {
    title: 'footer.tools',
    links: [
      { key: 'anansi', label: 'nav.anansi', to: '/anansi' },
      { key: 'shaka', label: 'nav.shaka', to: '/shaka' },
      { key: 'nzinga', label: 'nav.nzinga', to: '/nzinga' },
    ],
  },
  {
    title: 'footer.company',
    links: [
      { key: 'team', label: 'nav.team', to: '/team' },
      { key: 'services', label: 'nav.services', to: '/services' },
      { key: 'terms', label: 'footer.termsOfService', to: '/terms' },
    ],
  },
];

const CURRENT_YEAR = new Date().getFullYear();

/**
 * PublicFooter — compact calm footer. Brand + tagline, three columns, socials,
 * language and copyright line. Not a full-viewport showpiece.
 */
const PublicFooter: React.FC = React.memo(() => {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-border-subtle bg-canvas">
      <div className="px-3 py-12 md:px-4 lg:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,320px)_1fr]">
          <div>
            <Logo size="md" />
            <p className="mt-4 max-w-xs text-body-sm">{t('body.footerDesc')}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {SOCIAL_LINKS.map(({ key, label, href, Icon }) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-subtle text-text-secondary transition-colors hover:border-accent/40 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {COLS.map((col) => (
              <div key={col.title}>
                <h3 className="type-label text-text-tertiary">{t(col.title)}</h3>
                <ul className="mt-4 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.key}>
                      <Link
                        to={link.to}
                        className="min-h-[44px] text-sm text-text-secondary transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                      >
                        {t(link.label)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-6 border-t border-border-subtle pt-6 md:flex-row md:items-center md:justify-between">
          <p className="type-label text-text-tertiary">
            QYVORA — GHANA, TAMALE · {CURRENT_YEAR}
          </p>
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  );
});

PublicFooter.displayName = 'PublicFooter';

export default PublicFooter;