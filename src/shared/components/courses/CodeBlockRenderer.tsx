import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import { Copy } from 'lucide-react';
import { IconCheck, IconTerminal } from '@/shared/components/icons';

// ─────────────────────────────────────────────────────────────────────────────
// EducationalMarkdownRenderer — canonical Markdown renderer for QYVORA learning
// content (Courses, Labs/Walkthroughs, HPB/Bootcamp).
//
// Backed by `react-markdown` + `remark-gfm` (tables, strikethrough, autolinks,
// task lists) + `rehype-sanitize` (strict allow-list — no raw HTML, safe URL
// protocols, no event-handler attributes). Typography is centralised here in
// the `components` map so every QYVORA surface renders the same grammar.
//
// QYVORA-specific interactive pieces (fenced terminal blocks with a bash
// tokeniser + copy button, click-to-copy inline code) are provided as React
// components mapped onto `code`/`pre`, exactly as before.
// ─────────────────────────────────────────────────────────────────────────────

// ── Sanitisation ──────────────────────────────────────────────────────────────
// Base: the rehype-sanitize default schema (blocks `script`/`iframe`, strips
// `on*`/`style` event handlers and unknown attributes). We tighten URL
// protocols and restrict attributes to keep the Markdown surface small.
const SANITIZE_SCHEMA = {
  ...defaultSchema,
  protocols: {
    ...defaultSchema.protocols,
    href: ['http', 'https', 'mailto'],
    src: ['http', 'https'],
  },
  attributes: {
    ...defaultSchema.attributes,
    a: ['href', 'title', ['ariaLabel', 'aria-label']],
    img: ['src', 'alt', 'title'],
    code: [['className', /^language-[\w-]+$/]],
  },
};

// Belt-and-suspenders: refuse dangerous URL schemes even if the sanitise schema
// ever lets one through.
function isSafeUrl(value: string | undefined | null): boolean {
  if (!value) return false;
  try {
    const protocol = new URL(value, 'https://qyvora.invalid').protocol.toLowerCase();
    return protocol === 'http:' || protocol === 'https:' || protocol === 'mailto:';
  } catch {
    return false;
  }
}

// ── Syntax token types ────────────────────────────────────────────────────────
type TokenType = 'keyword' | 'string' | 'comment' | 'number' | 'flag' | 'path' | 'plain';

interface Token { type: TokenType; value: string; }

// ── Simple tokeniser for bash/shell commands ──────────────────────────────────
function tokeniseBash(line: string): Token[] {
  const tokens: Token[] = [];

  // Comments
  if (line.trimStart().startsWith('#')) {
    tokens.push({ type: 'comment', value: line });
    return tokens;
  }

  const KEYWORDS = /^(sudo|apt|apt-get|pip|pip3|python|python3|bash|sh|chmod|chown|mkdir|rm|cp|mv|ls|cat|grep|find|echo|export|source|cd|pwd|whoami|id|ps|kill|netstat|ss|ping|traceroute|curl|wget|nmap|sqlmap|hydra|nc|ncat|netcat|ssh|scp|git|docker|service|systemctl|useradd|usermod|passwd|su|env|set|unset|read|exit|return|if|then|else|fi|for|do|done|while|case|esac|function|local|declare|eval|exec|trap|wait|jobs|bg|fg|alias|unalias|history|man|help|which|type|file|stat|du|df|mount|umount|lsof|strace|ltrace|gdb|objdump|strings|xxd|hexdump|base64|openssl|gpg|tar|gzip|zip|unzip|awk|sed|sort|uniq|wc|head|tail|tee|xargs|cut|tr|diff|patch|make|gcc|g\+\+|javac|java|node|npm|yarn|php|ruby|perl|go|cargo|rustc)\b/;

  // Tokenise word by word
  const parts = line.split(/(\s+|"[^"]*"|'[^']*'|`[^`]*`|--?[\w-]+=?[\w./]*|-[\w]+|\/[\w./~-]+|\d+)/g);

  for (const part of parts) {
    if (!part) continue;
    if (/^\s+$/.test(part)) {
      tokens.push({ type: 'plain', value: part });
    } else if (/^["'`]/.test(part)) {
      tokens.push({ type: 'string', value: part });
    } else if (/^--?[\w-]+=?/.test(part)) {
      tokens.push({ type: 'flag', value: part });
    } else if (/^\/[\w./~-]+/.test(part)) {
      tokens.push({ type: 'path', value: part });
    } else if (/^\d+$/.test(part)) {
      tokens.push({ type: 'number', value: part });
    } else if (KEYWORDS.test(part)) {
      tokens.push({ type: 'keyword', value: part });
    } else {
      tokens.push({ type: 'plain', value: part });
    }
  }

  return tokens;
}

// ── Token colour map ──────────────────────────────────────────────────────────
const TOKEN_CLASS: Record<TokenType, string> = {
  keyword: 'text-code-keyword font-bold',
  string:  'text-code-string',
  comment: 'text-text-muted italic',
  number:  'text-code-number',
  flag:    'text-code-flag',
  path:    'text-code-path',
  plain:   'text-text-primary',
};

// ── Copy button ───────────────────────────────────────────────────────────────
const CopyBtn: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const copy = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      navigator.clipboard.writeText(text);
    } catch {
      // Clipboard API unavailable (HTTP, mobile WebView)
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={copy}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-widest transition-[border-color,background-color,color] ${
        copied
          ? 'border-accent/50 bg-accent-dim text-accent'
          : 'border-border bg-bg text-text-muted hover:border-accent/40 hover:text-accent'
      }`}
      title="Copy to clipboard"
    >
      {copied ? <><IconCheck size={12} />Copied</> : <><Copy className="h-3 w-3" />Copy</>}
    </button>
  );
};

// ── Fenced code block ─────────────────────────────────────────────────────────
const FencedCodeBlock: React.FC<{ code: string; lang: string }> = ({ code, lang }) => {
  const lines = code.split('\n');
  const isBash = !lang || lang === 'bash' || lang === 'sh' || lang === 'shell';

  return (
    <div className="wc-code my-10 md:my-14 rounded-xl border border-border overflow-hidden bg-code-bg">
      {/* Header bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/60 bg-bg-card/80">
        <div className="flex items-center gap-2">
          <IconTerminal size={14} className="text-accent opacity-70" />
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-text-muted">
            {lang || 'bash'}
          </span>
        </div>
        <CopyBtn text={code} />
      </div>

      {/* Code area */}
      <div className="overflow-x-auto">
        <pre className="px-3 py-3 text-sm font-mono leading-relaxed">
          {lines.map((line, lineIdx) => (
            <div key={lineIdx} className="flex">
              {/* Line number */}
              <span className="select-none mr-3 text-[11px] text-text-muted/30 w-4 shrink-0 text-right">
                {lineIdx + 1}
              </span>
              {/* Tokenised line */}
              <span>
                {isBash
                  ? tokeniseBash(line).map((tok, tokIdx) => (
                      <span key={tokIdx} className={TOKEN_CLASS[tok.type]}>
                        {tok.value}
                      </span>
                    ))
                  : <span className="text-text-primary">{line}</span>
                }
              </span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
};

// ── Inline code span ──────────────────────────────────────────────────────────
const InlineCode: React.FC<{ code: string }> = ({ code }) => {
  const [copied, setCopied] = useState(false);
  const copy = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      navigator.clipboard.writeText(code);
    } catch {
      // Clipboard API unavailable (HTTP, mobile WebView)
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      type="button"
      onClick={copy}
      title="Click to copy"
      className={`group/inline inline-flex items-center gap-1 mx-0.5 px-1.5 py-px rounded-[4px] border font-mono text-[10px] leading-snug transition-[border-color,background-color,color] align-middle whitespace-nowrap ${
        copied
          ? 'border-accent/50 bg-accent-dim text-accent'
          : 'border-border bg-code-bg text-accent hover:border-accent/40'
      }`}
    >
      <span className="truncate max-w-[240px]">{code}</span>
      <span className={`flex-shrink-0 transition-opacity ${copied ? 'opacity-100' : 'opacity-0 group-hover/inline:opacity-60'}`}>
        {copied ? <IconCheck size={10} /> : <Copy className="h-2.5 w-2.5" />}
      </span>
    </button>
  );
};

// ── Typography (centralised QYVORA grammar) ───────────────────────────────────
const PARA_CLASS = 'text-sm md:text-base text-text-secondary font-mono leading-[2] md:leading-[2.2] mb-6 md:mb-8 max-w-none';
const LIST_CLASS = 'list-outside pl-5 space-y-3 md:space-y-4 text-sm md:text-base text-text-secondary font-mono leading-[2] md:leading-[2.2] mb-6 md:mb-8 max-w-none';

const headingClass = (level: number): string => {
  const size =
    level === 1 ? 'text-2xl md:text-4xl mb-6 md:mb-8' :
    level === 2 ? 'text-2xl md:text-4xl mb-6 md:mb-8' :
    level === 3 ? 'text-xl md:text-2xl text-accent mb-5 md:mb-6' :
                  'text-base md:text-lg mb-4 mt-4';
  const color = level === 3 ? 'text-accent' : 'text-text-primary';
  return `font-black uppercase tracking-tight ${size} ${color}`;
};

const Heading = ({ level, children }: { level: number; children?: React.ReactNode }) => {
  const Tag = (`h${Math.min(Math.max(1, level), 4)}`) as 'h1' | 'h2' | 'h3' | 'h4';
  return <Tag className={headingClass(level)}>{children}</Tag>;
};

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

// ── Prose normalisation ────────────────────────────────────────────────────────
// Lab narratives are authored with rich structure: `##`/`###` headings, `>`
// Valkyrie blockquote dialogue, and fenced command blocks. Course and Bootcamp
// lessons historically used flatter prose (long paragraphs with `**bold**`
// lead-ins and plain `Valkyrie:` dialogue). To bring every surface up to the
// same standard — without touching the already-clean Lab data or the shared
// renderer grammar — this normaliser upgrades that flat prose into the same
// headings/blockquotes the renderer already styles beautifully.
//
// Safe, targeted transforms (all idempotent against content that already uses
// the Labs form; plain paragraphs and inline bold are preserved):
//
//   1. `Valkyrie: "…"` / `Valkyrie "…"` dialogue ->  `> **Valkyrie:** "…"`
//   2. Standalone `**Label:**`-style heading lines   ->  `### Label`
//   3. Leading `**Label:**` heading + paragraph text ->  `### Label` + paragraph
//   4. Teaches code fences to only become line-numbered when a language is set
function normalizeProse(input: string): string {
  // Guard against fence-stripping: only operate line-by-line outside fenced blocks
  const lines = input.split('\n');
  const out: string[] = [];
  let inFence = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const fenceMatch = line.match(/^\s*(```+|~~~+)/);
    if (fenceMatch) {
      inFence = !inFence;
      out.push(line);
      continue;
    }
    if (inFence) { out.push(line); continue; }

    out.push(normalizeProseLine(line));
  }
  return out.join('\n');
}

const BOLD_PHRASE = /^\s*\*\*(.+?)\*\*/;
const BOLD_ONLY_HEADING = /^\s*\*\*(.+?)\*\*:?\s*$/;
// Valkyrie dialogue — matches `Valkyrie: "..."`, `Valkyrie: "..."`, or a bare
// `Valkyrie "..."`/`Valkyrie:` opening, at the start of the line.
const DIALOGUE = /^\s*(Valkyrie|Valkyria|Valkyrie AI)(?::|,)?\s+"(.*)"/;

function normalizeProseLine(line: string): string {
  const trimmed = line.trim();
  if (!trimmed) return line;

  // 1. Already a blockquote / heading / other block construct? Leave untouched.
  if (trimmed.startsWith('>') || trimmed.startsWith('#') || trimmed.startsWith('|')) return line;
  if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\./.test(trimmed)) return line;

  // 2. Dialogue -> blockquote (matching the Labs `> **Valkyrie:**` pattern)
  const dialogue = trimmed.match(DIALOGUE);
  if (dialogue) {
    const speaker = dialogue[1];
    const quote = dialogue[2];
    return `> **${speaker}:** "${quote}"`;
  }

  // 3. Standalone bold heading line: `**Label:**` with no trailing prose
  const standalone = trimmed.match(BOLD_ONLY_HEADING);
  if (standalone && standalone[1].trim().length > 0 && standalone[1].trim().length <= 60) {
    return `### ${standalone[1].trim().replace(/[:\-—–]+$/, '').trim()}`;
  }

  // 4. Leading bold heading + paragraph: `**Core Fields:** the following…`
  //    Convert the leading short bold label into a `###` heading, keep the rest.
  const lead = trimmed.match(BOLD_PHRASE);
  if (lead) {
    const label = lead[1].trim();
    if (label.length > 0 && label.length <= 40 && /[:\-—-]?\s+/.test(trimmed.slice(lead[0].length))) {
      const rest = trimmed.slice(lead[0].length).replace(/^\s*[:：\-—–·]\s*/, '').trim();
      if (rest) {
        return `### ${label.replace(/[:：\-—–]+$/, '').trim()}\n\n${rest}`;
      }
      return `### ${label.replace(/[:：\-—–]+$/, '').trim()}`;
    }
  }

  return line;
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
          <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-accent whitespace-nowrap">
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