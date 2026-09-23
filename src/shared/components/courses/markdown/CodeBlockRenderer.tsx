import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { SANITIZE_SCHEMA, isSafeUrl } from './sanitize';
import FencedCodeBlock from './FencedCodeBlock';
import InlineCode from './InlineCode';
import { Heading, PARA_CLASS, LIST_CLASS } from './typography';
import { normalizeProse } from './normalizeProse';

// Extract the raw text of a Markdown node (used to read code content before we
// replace it with our own rendering).
function nodeText(node: any): string {
  if (!node) return '';
  if (node.type === 'text') return node.value;
  if (Array.isArray(node.children)) {
    return node.children.map(nodeText).join('');
  }
  return '';
}

// ── Canonical renderer ─────────────────────────────────────────────────────────
// Renders Markdown through React Markdown. QYVORA-specific components are wired
// into `components` so the semantics come from a standards parser while the
// visual language stays on-brand.
const CodeBlockRenderer: React.FC<{ text: string }> = ({ text }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[[rehypeSanitize, SANITIZE_SCHEMA]]}
      components={{
        // Fenced code: react-markdown wraps the code node in <pre>. We unwrap
        // <pre> so our FencedCodeBlock (which owns its own <pre>) is not nested
        // inside another <pre>. Language-less / indented code blocks fall back
        // to a plain bash-styled block.
        pre: ({ node, children }) => {
          const codeNode = (node?.children ?? []).find(
            (c: any) => c && c.type === 'element' && c.tagName === 'code',
          ) as any;
          const hasLanguage = /language-[\w-]+/.test(String(codeNode?.properties?.className || ''));
          if (!hasLanguage) {
            return <FencedCodeBlock code={nodeText(codeNode).replace(/\n$/, '')} lang="bash" />;
          }
          return <>{children}</>;
        },
        code: ({ className, children }) => {
          const lang = (className || '').match(/language-([\w-]+)/)?.[1];
          if (lang) {
            return <FencedCodeBlock code={String(children).replace(/\n$/, '')} lang={lang} />;
          }
          return <InlineCode code={String(children)} />;
        },
        h1: ({ children }) => <Heading level={1}>{children}</Heading>,
        h2: ({ children }) => <Heading level={2}>{children}</Heading>,
        h3: ({ children }) => <Heading level={3}>{children}</Heading>,
        h4: ({ children }) => <Heading level={4}>{children}</Heading>,
        p: ({ children }) => <p className={PARA_CLASS}>{children}</p>,
        ul: ({ children }) => <ul className={LIST_CLASS}>{children}</ul>,
        ol: ({ children }) => <ol className={LIST_CLASS}>{children}</ol>,
        li: ({ children }) => (
          <li className="leading-[2] md:leading-[2.2]">{children}</li>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-accent/40 pl-4 md:pl-6 italic text-text-secondary font-mono leading-[2] md:leading-[2.2] mb-6 md:mb-8 max-w-none">
            {children}
          </blockquote>
        ),
        hr: () => <hr className="my-10 md:my-12 border-border/30" />,
        table: ({ children }) => (
          <div className="wc-table my-8 md:my-10 overflow-x-auto rounded-xl border border-border/50 bg-bg-card">
            <table className="w-full min-w-[520px] border-collapse text-left text-sm md:text-base font-mono">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="border-b border-border/60 bg-bg-elevated">{children}</thead>
        ),
        tr: ({ children }) => <tr className="border-b border-border/30 last:border-b-0 even:bg-bg-elevated/40">{children}</tr>,
        th: ({ children }) => (
          <th className="px-4 py-3 text-xs font-black uppercase tracking-widest text-accent whitespace-nowrap">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-3 align-top text-text-secondary leading-[1.9]">{children}</td>
        ),
        a: ({ node, href, children }) => {
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
        img: ({ node, src, alt, title }) => {
          if (!isSafeUrl(src)) return null;
          return (
            <img
              src={src}
              alt={alt ?? ''}
              title={title}
              className="my-6 md:my-8 max-w-full rounded-xl border border-border/50"
            />
          );
        },
        strong: ({ children }) => <strong className="font-bold text-text-primary">{children}</strong>,
        em: ({ children }) => <em className="italic text-text-primary">{children}</em>,
        del: ({ children }) => <del className="text-text-muted">{children}</del>,
      }}
    >
      {normalizeProse(text)}
    </ReactMarkdown>
  );
};

// Backwards-compatible alias: this IS the shared walkthrough/lesson renderer.
const EducationalMarkdownRenderer = CodeBlockRenderer;

export default CodeBlockRenderer;
export { EducationalMarkdownRenderer, isSafeUrl };