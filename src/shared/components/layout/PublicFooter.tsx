import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/shared/components/brand';
import { IconArrowRight, IconMail } from '@/shared/components/icons';
import PwaInstallButton from '@/shared/components/ui/PwaInstallButton';
import Button from '@/shared/components/ui/Button';
import { SOCIAL_LINKS } from './socialLinks';
import { PUBLIC_FOOTER_COLUMNS } from './publicNav';

const CURRENT_YEAR = new Date().getFullYear();

/**
 * PublicFooter — structured brand footer. Brand + mission in the identity
 * column, grouped link columns (including every legal/trust page), socials,
 * and a quiet bottom bar that ties the tagline back to the platform. Remains
 * compact — this is wayfinding, not a brochure.
 */
const PublicFooter: React.FC = React.memo(() => {
  return (
    <footer className="border-t border-border-subtle bg-canvas" data-theme-persist="dark">
      <div className="px-3 py-10 md:px-4 lg:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,280px)_1fr]">
          <div>
            <Link to="/" aria-label="QYVORA" className="inline-block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
              <Logo size="md" />
            </Link>
            <p className="mt-3 max-w-xs text-body-sm">
              {"Building Africa's strongest cybersecurity ecosystem - one trained professional at a time."}
            </p>
            <div className="mt-8 flex flex-col gap-2">
              <a
                href="mailto:qyvorasec@gmail.com"
                className="inline-flex min-h-[44px] items-center gap-1.5 text-type-body text-text-secondary transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <IconMail size={14} aria-hidden="true" />
                {"qyvorasec@gmail.com"}
              </a>
              <Button to="/register" size="sm" className="mt-1 w-fit">
                {"Join the platform"} <IconArrowRight size={14} aria-hidden="true" />
              </Button>
              <PwaInstallButton 
                variant="ghost" 
                size="sm"
                label="Download App"
                className="mt-1 w-fit justify-start"
              />
              <div className="mt-2 flex flex-wrap gap-2">
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
          </div>

          <nav aria-label="Footer" className="grid min-w-0 grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-6">
            {PUBLIC_FOOTER_COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="type-label text-accent">{col.title}</h3>
                <ul className="mt-3 space-y-1">
                  {col.links.map((link) => (
                    <li key={link.key}>
                      <Link
                        to={link.to}
                        className="inline-flex py-1 text-[15px] text-text-secondary transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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
          <div className="flex flex-wrap items-center gap-4">
            <p className="type-label text-text-tertiary">
              {"Train like a hacker, become a hacker."}
            </p>
            <Link
              to="/sitemap"
              className="type-label text-text-tertiary transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {"Sitemap"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
});

PublicFooter.displayName = 'PublicFooter';

export default PublicFooter;