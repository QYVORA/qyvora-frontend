import React from 'react';
import { ExternalLink } from 'lucide-react';
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
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-bg-card px-2.5 py-1 font-mono text-xs text-text-secondary transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
        >
          <BrandGithubIcon className="h-3.5 w-3.5 text-text-primary" />
          <span>GitHub</span>
          <ExternalLink className="h-2.5 w-2.5 text-text-muted" aria-hidden="true" />
        </a>
      )}

      {resolvedTwitterUrl && (
        <a
          href={resolvedTwitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X (formerly Twitter) profile"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-bg-card px-2.5 py-1 font-mono text-xs text-text-secondary transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
        >
          <BrandXIcon className="h-3.5 w-3.5 text-text-primary" />
          <span>X</span>
          <ExternalLink className="h-2.5 w-2.5 text-text-muted" aria-hidden="true" />
        </a>
      )}

      {resolvedLinkedinUrl && (
        <a
          href={resolvedLinkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn profile"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-bg-card px-2.5 py-1 font-mono text-xs text-text-secondary transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
        >
          <BrandLinkedinIcon className="h-3.5 w-3.5 text-text-primary" />
          <span>LinkedIn</span>
          <ExternalLink className="h-2.5 w-2.5 text-text-muted" aria-hidden="true" />
        </a>
      )}

      {safePortfolio && <PortfolioLink url={safePortfolio} />}
    </div>
  );
};

export default SocialLinks;
