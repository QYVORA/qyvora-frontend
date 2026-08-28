import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  EducationalMarkdownRenderer,
  isSafeUrl,
} from '@/shared/components/courses/CodeBlockRenderer';

const renderMd = (text: string) =>
  render(<EducationalMarkdownRenderer text={text} />);

describe('EducationalMarkdownRenderer', () => {
  it('renders headings with QYVORA typography', () => {
    renderMd('# Level One\n\n## Level Two\n\n### Level Three');
    expect(screen.getByRole('heading', { name: 'Level One' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 3, name: 'Level Three' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 2, name: 'Level Two' })).toBeTruthy();
  });

  it('renders paragraphs and inline emphasis', () => {
    renderMd('Run **nmap** and *observe* the result.');
    expect(screen.getByText('nmap')).toBeTruthy();
    expect(screen.getByText('observe')).toBeTruthy();
  });

  it('renders inline code as a copy button', () => {
    renderMd('Type `whoami` to continue.');
    const chip = screen.getByTitle('Click to copy');
    expect(chip).toBeTruthy();
  });

  it('renders fenced code as a terminal block with language header', () => {
    renderMd('```bash\nwhoami\nls -la\n```');
    expect(screen.getByText('bash')).toBeTruthy();
    expect(screen.getByText('Copy')).toBeTruthy();
  });

  it('renders GFM pipe tables', () => {
    renderMd('| Port | Service |\n|------|---------|\n| 22   | SSH     |\n| 80   | HTTP    |');
    expect(screen.getByText('Port')).toBeTruthy();
    expect(screen.getByText('Service')).toBeTruthy();
    expect(screen.getByText('SSH')).toBeTruthy();
    expect(screen.getByText('HTTP')).toBeTruthy();
  });

  it('renders unordered and ordered lists', () => {
    renderMd('- alpha\n- beta\n\n1. one\n2. two');
    expect(screen.getByText('alpha')).toBeTruthy();
    expect(screen.getByText('beta')).toBeTruthy();
    expect(screen.getByText('one')).toBeTruthy();
    expect(screen.getByText('two')).toBeTruthy();
  });

  it('renders blockquote and horizontal rule', () => {
    const { container } = renderMd('> quoted insight\n\n---');
    expect(screen.getByText('quoted insight')).toBeTruthy();
    expect(container.querySelector('blockquote')).toBeTruthy();
    expect(container.querySelector('hr')).toBeTruthy();
  });

  it('renders safe http links with target blank', () => {
    renderMd('[docs](https://example.com)');
    const link = screen.getByRole('link', { name: 'docs' });
    expect(link.getAttribute('href')).toBe('https://example.com');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toContain('noopener');
  });

  it('does not render dangerous javascript: protocols as links', () => {
    renderMd('[click](javascript:alert(1))');
    expect(screen.queryByRole('link', { name: 'click' })).toBeNull();
  });

  it('escapes raw HTML instead of executing it', () => {
    renderMd('hello <script>alert(1)</script> world');
    expect(document.querySelector('script')).toBeNull();
    expect(screen.getByText(/alert\(1\)/)).toBeTruthy();
  });

  it('strips on* event handlers from raw HTML', () => {
    renderMd('<img src="https://example.com/x.png" onerror="alert(1)">');
    const img = document.querySelector('img');
    if (img) {
      expect(img.hasAttribute('onerror')).toBe(false);
    }
  });
});

describe('isSafeUrl', () => {
  it.each([
    ['https://example.com', true],
    ['http://example.com', true],
    ['mailto:a@b.com', true],
    ['javascript:alert(1)', false],
    ['data:text/html;base64,xyz', false],
    ['vbscript:msgbox(1)', false],
    ['', false],
    [null, false],
  ])('rejects/accepts %s', (url, expected) => {
    expect(isSafeUrl(url as string | null)).toBe(expected);
  });
});
