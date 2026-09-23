import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/shared/components/brand';
import { IconArrowRight, IconMail } from '@/shared/components/icons';
import { SOCIAL_LINKS } from './socialLinks';

interface FooterCol {
  title: string;
  links: { key: string; label: string; to: string }[];
}

const COLS: FooterCol[] = [
  {
    title: 'Learning',
    links: [
      { key: 'courses', label: 'Courses', to: '/courses' },
      { key: 'bootcamp', label: 'Bootcamp', to: '/hpb' },
      { key: 'labs', label: 'Labs', to: '/labs' },
      { key: 'tools', label: 'All tools', to: '/tools' },
    ],
  },
  {
    title: 'Tools',
    links: [
      { key: 'anansi', label: 'anansi', to: '/anansi' },
      { key: 'shaka', label: 'shaka', to: '/shaka' },
      { key: 'nzinga', label: 'nzinga', to: '/nzinga' },
      { key: 'imhotep', label: 'imhotep', to: '/imhotep' },
    ],
  },
  {
    title: 'Company',
    links: [
      { key: 'team', label: 'Team', to: '/team' },
      { key: 'services', label: 'Services', to: '/services' },
      { key: 'about', label: 'About', to: '/about' },
      { key: 'contact', label: 'Contact', to: '/contact' },
      { key: 'terms', label: 'Terms of Service', to: '/terms' },
    ],
  },
];

const CURRENT_YEAR = new Date().getFullYear();

/**
 * PublicFooter — structured brand footer. Brand + mission in the identity
 * column, grouped link columns, socials, and a quiet bottom bar that ties the
 * tagline back to the platform. Remains compact — this is wayfinding, not a
 * brochure.
 */
const PublicFooter: React.FC = React.memo(() => {
  return (
    <footer className="border-t border-border-subtle bg-canvas" data-theme-persist="dark">
      <div className="px-3 py-10 md:px-4 lg:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,340px)_1fr]">
          <div>
            <Link to="/" aria-label="QYVORA" className="inline-block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
              <Logo size="md" />
            </Link>
            <p className="mt-3 max-w-xs text-body-sm">
              {"Building Africa's strongest cybersecurity ecosystem - one trained professional at a time."}
            </p>
            <a
              href="mailto:qyvorasec@gmail.com"
              className="mt-2 inline-flex min-h-[44px] items-center gap-1.5 text-type-body text-text-secondary transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <IconMail size={14} aria-hidden="true" />
              {"qyvorasec@gmail.com"}
            </a>
            <Link
              to="/register"
              className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-accent/40 px-3 text-xs font-black uppercase tracking-widest text-accent transition-colors hover:bg-accent/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {"Join the platform"} <IconArrowRight size={12} aria-hidden="true" />
            </Link>
            <div className="mt-5 flex flex-wrap gap-2">
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
                <h3 className="type-label text-accent">{col.title}</h3>
                <ul className="mt-3 space-y-1">
                  {col.links.map((link) => (
                    <li key={link.key}>
                      <Link
                        to={link.to}
                        className="inline-flex min-h-[44px] items-center text-sm text-text-secondary transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-border-subtle pt-6 md:flex-row md:items-center md:justify-between">
          <p className="type-label text-text-tertiary">
            {"QYVORA · GHANA, TAMALE · "}{CURRENT_YEAR}
          </p>
          <p className="type-label text-text-tertiary">
            {"Train like a hacker, become a hacker."}
          </p>
        </div>
      </div>
    </footer>
  );
});

PublicFooter.displayName = 'PublicFooter';

export default PublicFooter;