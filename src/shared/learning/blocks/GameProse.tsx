/**
 * GAME PROSE
 * ==========
 * Tight, high-contrast inline text for the card deck. Unlike the blog
 * markdown renderer it never promotes inline bold into headings or lists
 * (those already exist as their own semantic cards) and it uses a compact
 * reading rhythm so a card fits the screen instead of reading like an article.
 *
 * Only inline semantics are rendered: bold, italic, inline code, links, del.
 */

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { SANITIZE_SCHEMA, isSafeUrl } from '@/shared/components/courses/markdown/sanitize';
import { cn } from '@/shared/utils/cn';

interface Props {
  text: string;
  className?: string;
}

export const GameProse: React.FC<Props> = ({ text, className }) => {
  return (
    <div
      className={cn(
        'w-full max-w-none space-y-3 font-mono text-sm leading-6 text-text-secondary',
        'sm:text-[15px] sm:leading-7 md:text-base md:leading-8',
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeSanitize, SANITIZE_SCHEMA]]}
        allowedElements={['p', 'strong', 'em', 'code', 'a', 'del', 'br']}
        unwrapDisallowed
        components={{
          p: ({ children }) => <p className="m-0">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold text-text-primary">{children}</strong>,
          em: ({ children }) => <em className="italic text-text-primary">{children}</em>,
          code: ({ children }) => (
            <code className="mx-0.5 rounded-[4px] border border-border/70 bg-code-bg px-1.5 py-px font-mono text-[0.9em] text-accent">
              {children}
            </code>
          ),
          a: ({ href, children }) => {
            const safe = isSafeUrl(href);
            return safe ? (
              <a
                href={href}
                target={href?.startsWith('http') ? '_blank' : undefined}
                rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
              >
                {children}
              </a>
            ) : (
              <span className="text-accent">{children}</span>
            );
          },
          del: ({ children }) => <del className="text-text-muted">{children}</del>,
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
};

export default GameProse;
