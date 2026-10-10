import React from 'react';
import { Globe, ExternalLink } from 'lucide-react';

interface PortfolioLinkProps {
  url?: string;
  className?: string;
}

/**
 * Validates and normalizes portfolio URLs.
 * Rejects dangerous schemes like javascript:, data:, vbscript:.
 * Requires http or https.
 */
export function sanitizePortfolioUrl(raw?: string): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  try {
    const withProto = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
    const parsed = new URL(withProto);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.toString();
    }
  } catch {
    return null;
  }
  return null;
}

export function formatUrlHost(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, '') + (parsed.pathname !== '/' ? parsed.pathname.slice(0, 16) : '');
  } catch {
    return url;
  }
}

export const PortfolioLink: React.FC<PortfolioLinkProps> = ({ url, className = '' }) => {
  const safeUrl = sanitizePortfolioUrl(url);
  if (!safeUrl) return null;

  const display = formatUrlHost(safeUrl);

  return (
    <a
      href={safeUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Portfolio website: ${safeUrl}`}
      className={`inline-flex items-center gap-1.5 rounded-lg border border-border bg-bg-card px-2.5 py-1 font-mono text-xs text-text-secondary transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent ${className}`}
    >
      <Globe className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
      <span className="truncate max-w-[140px] sm:max-w-[200px]">{display}</span>
      <ExternalLink className="h-3 w-3 shrink-0 text-text-muted" aria-hidden="true" />
    </a>
  );
};

export default PortfolioLink;
