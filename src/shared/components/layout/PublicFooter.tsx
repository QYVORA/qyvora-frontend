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
 * PublicFooter — inverted brand footer. Links and actions lead on the left,
 * the identity block anchors the right, and social channels sit as bare icons
 * on the bottom rule.
 */
const PublicFooter: React.FC = React.memo(() => {
  return (
    <footer className="border-t border-border-subtle bg-canvas" data-theme-persist="dark">
      <div className="px-3 py-10 md:px-4 lg:px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,280px)] lg:items-start">
          <div className="order-2 min-w-0 lg:order-1">
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

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button to="/register" size="sm">
                {"Join the platform"} <IconArrowRight size={14} aria-hidden="true" />
              </Button>
              <PwaInstallButton
                variant="ghost"
                size="sm"
                label="Download App"
                className="justify-start"
              />
              <a
                href="mailto:qyvorasec@gmail.com"
                className="inline-flex min-h-[44px] items-center gap-1.5 text-type-body text-text-secondary transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <IconMail size={14} aria-hidden="true" />
                {"qyvorasec@gmail.com"}
              </a>
            </div>
          </div>

          <div className="order-1 flex flex-col items-start lg:order-2">
            <Link to="/" aria-label="QYVORA" className="inline-block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
              <Logo size="md" />
            </Link>
            <p className="mt-4 max-w-[234px] text-body-sm">
              {"Building Africa's strongest cybersecurity ecosystem - one trained professional at a time."}
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-5 border-t border-border-subtle pt-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-1" aria-label="QYVORA on social media">
            {SOCIAL_LINKS.map(({ key, label, href, Icon }) => (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="group inline-flex h-11 w-11 items-center justify-center rounded-md text-text-secondary transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <Icon className="h-5 w-5 transition-transform duration-200 ease-out group-hover:scale-125 motion-reduce:transition-none" />
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5 lg:justify-end">
            <p className="type-label text-text-tertiary">
              {"QYVORA · GHANA, TAMALE · "}{CURRENT_YEAR}
            </p>
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
