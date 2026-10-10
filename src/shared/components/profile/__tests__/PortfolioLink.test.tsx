import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PortfolioLink, { sanitizePortfolioUrl, formatUrlHost } from '../PortfolioLink';

describe('PortfolioLink and URL Sanitizer', () => {
  it('sanitizes valid https URLs', () => {
    expect(sanitizePortfolioUrl('https://example.com/portfolio')).toBe('https://example.com/portfolio');
    expect(sanitizePortfolioUrl('example.com')).toBe('https://example.com/');
    expect(sanitizePortfolioUrl('sub.domain.org/work')).toBe('https://sub.domain.org/work');
  });

  it('rejects malicious or dangerous schemes', () => {
    expect(sanitizePortfolioUrl('javascript:alert(1)')).toBeNull();
    expect(sanitizePortfolioUrl('data:text/html,<script></script>')).toBeNull();
    expect(sanitizePortfolioUrl('vbscript:msgbox')).toBeNull();
    expect(sanitizePortfolioUrl('')).toBeNull();
    expect(sanitizePortfolioUrl('   ')).toBeNull();
    expect(sanitizePortfolioUrl(undefined)).toBeNull();
  });

  it('formats clean hostnames for display', () => {
    expect(formatUrlHost('https://www.github.com/')).toBe('github.com');
    expect(formatUrlHost('https://portfolio.dev/projects')).toBe('portfolio.dev/projects');
  });

  it('renders a valid link with accessible rel and target', () => {
    render(<PortfolioLink url="https://security.dev" />);
    const link = screen.getByRole('link', { name: /portfolio website/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://security.dev/');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('does not render if URL is invalid', () => {
    const { container } = render(<PortfolioLink url="javascript:void(0)" />);
    expect(container.firstChild).toBeNull();
  });
});
