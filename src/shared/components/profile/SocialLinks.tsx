import React from 'react';
import { BrandGithubIcon, BrandLinkedinIcon, BrandXIcon } from '@/shared/components/icons';
import PortfolioLink, { sanitizePortfolioUrl } from './PortfolioLink';

interface SocialLinksProps {
  github?: string;
  githubConnected?: boolean;
  githubPublic?: boolean;
  githubProfileUrl?: string;
  githubUsername?: string;
  twitter?: string;
  linkedin?: string;
  website?: string;
  className?: string;
}

const normalizeSocialUrl = (value: string, platform: 'github' | 'twitter' | 'linkedin'): string => {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)) return trimmed;
  const clean = trimmed.replace(/^@/, '');
  if (platform === 'github') return `https://github.com/${clean}`;
  if (platform === 'twitter') return `https://x.com/${clean}`;
  if (platform === 'linkedin') return `https://linkedin.com/in/${clean}`;
  return `https://${trimmed}`;
};

export const SocialLinks: React.FC<SocialLinksProps> = ({
  github,
  githubConnected,
  githubPublic,
  githubProfileUrl,
  githubUsername,
  twitter,
  linkedin,
  website,
  className = '',
}) => {
  // Resolve GitHub URL:
  // Show if: explicitly supplied via github URL OR linked via OAuth with public visibility
  const resolvedGithubUrl = (() => {
    if (githubProfileUrl && (githubPublic || githubConnected)) return githubProfileUrl;
    if (github) return normalizeSocialUrl(github, 'github');
    if (githubUsername && githubPublic) return `https://github.com/${githubUsername}`;
    return null;
  })();

  const resolvedTwitterUrl = twitter ? normalizeSocialUrl(twitter, 'twitter') : null;
  const resolvedLinkedinUrl = linkedin ? normalizeSocialUrl(linkedin, 'linkedin') : null;
  const safePortfolio = website ? sanitizePortfolioUrl(website) : null;

  const hasAny = resolvedGithubUrl || resolvedTwitterUrl || resolvedLinkedinUrl || safePortfolio;
  if (!hasAny) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {resolvedGithubUrl && (
        <a
          href={resolvedGithubUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub profile"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-surface-raised text-text-secondary transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <BrandGithubIcon className="h-4 w-4 text-text-primary" />
        </a>
      )}

      {resolvedTwitterUrl && (
        <a
          href={resolvedTwitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X (formerly Twitter) profile"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-surface-raised text-text-secondary transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <BrandXIcon className="h-4 w-4 text-text-primary" />
        </a>
      )}

      {resolvedLinkedinUrl && (
        <a
          href={resolvedLinkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn profile"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-surface-raised text-text-secondary transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <BrandLinkedinIcon className="h-4 w-4 text-text-primary" />
        </a>
      )}

      {safePortfolio && <PortfolioLink url={safePortfolio} />}
    </div>
  );
};

export default SocialLinks;
