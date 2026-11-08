import { describe, expect, it } from 'vitest';
import { extractShellComments, isShellLanguage } from '../shellComments';

describe('extractShellComments', () => {
  it('removes full-line comments and keeps commands copyable', () => {
    const result = extractShellComments([
      '# Inspect the host',
      'uname -a',
      '',
      '# Check who is logged in',
      'users',
    ].join('\n'));

    expect(result.code).toBe('uname -a\n\nusers');
    expect(result.comments.map((comment) => comment.text)).toEqual([
      'Inspect the host',
      'Check who is logged in',
    ]);
  });

  it('removes inline comments without touching quoted hashes', () => {
    const result = extractShellComments([
      'dig target.com A          # IPv4 addresses',
      'echo "# not a comment"',
      "printf '%s' '#also-not-a-comment'",
      'echo ${#PATH} $#',
      'curl https://example.com/page#section',
    ].join('\n'));

    expect(result.code).toBe([
      'dig target.com A',
      'echo "# not a comment"',
      "printf '%s' '#also-not-a-comment'",
      'echo ${#PATH} $#',
      'curl https://example.com/page#section',
    ].join('\n'));
    expect(result.comments.map((comment) => comment.text)).toEqual(['IPv4 addresses']);
  });

  it('preserves shebang lines as executable code', () => {
    const result = extractShellComments([
      '#!/bin/bash',
      '# Qyvora Recon Script v1.0',
      'echo "Starting"',
    ].join('\n'));

    expect(result.code).toBe('#!/bin/bash\necho "Starting"');
    expect(result.comments.map((comment) => comment.text)).toEqual(['Qyvora Recon Script v1.0']);
  });

  it('returns only prose when a block contains comments only', () => {
    const result = extractShellComments('# site: example.com\n# inurl: admin');
    expect(result.code).toBe('');
    expect(result.comments).toHaveLength(2);
  });
});

describe('isShellLanguage', () => {
  it.each(['bash', 'sh', 'shell', 'zsh', 'console', '', undefined])(
    'treats %s as shell',
    (language) => expect(isShellLanguage(language)).toBe(true),
  );

  it('does not treat python or sql as shell', () => {
    expect(isShellLanguage('python')).toBe(false);
    expect(isShellLanguage('sql')).toBe(false);
  });
});
