import { useState } from 'react';
import { Copy } from 'lucide-react';
import { IconCheck, IconTerminal } from '@/shared/components/icons';

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
      onClick={copy}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-widest transition-all ${
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
    <div className="my-10 md:my-14 rounded-xl border border-border overflow-hidden bg-code-bg">
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
      onClick={copy}
      title="Click to copy"
      className={`group/inline inline-flex items-center gap-1.5 mx-1 px-1.5 h-[1.1rem] rounded-[4px] border font-mono text-[10px] leading-none transition-all align-middle whitespace-nowrap ${
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

// ── Inline content renderer ────────────────────────────────────────────────────
type InlinePart =
  | { type: 'text'; content: string }
  | { type: 'code'; content: string }
  | { type: 'bold'; content: string }
  | { type: 'italic'; content: string }
  | { type: 'boldItalic'; content: string };

function renderInline(text: string): React.ReactNode[] {
  const pattern = /(`[^`]+`|\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  const parts: InlinePart[] = [];
  let li = 0;
  let m: RegExpExecArray | null;

  while ((m = pattern.exec(text)) !== null) {
    if (m.index > li) parts.push({ type: 'text', content: text.slice(li, m.index) });
    const match = m[0];
    if (match.startsWith('`')) {
      parts.push({ type: 'code', content: match.slice(1, -1).trim() });
    } else if (match.startsWith('***')) {
      parts.push({ type: 'boldItalic', content: match.slice(3, -3) });
    } else if (match.startsWith('**')) {
      parts.push({ type: 'bold', content: match.slice(2, -2) });
    } else {
      parts.push({ type: 'italic', content: match.slice(1, -1) });
    }
    li = m.index + match.length;
  }
  if (li < text.length) parts.push({ type: 'text', content: text.slice(li) });

  return parts.map((part, i) => {
    switch (part.type) {
      case 'code':
        return <InlineCode key={i} code={part.content} />;
      case 'bold':
        return <strong key={i} className="font-bold text-text-primary">{part.content}</strong>;
      case 'italic':
        return <em key={i} className="italic text-text-primary">{part.content}</em>;
      case 'boldItalic':
        return <strong key={i} className="font-bold italic text-text-primary">{part.content}</strong>;
      default:
        return <span key={i}>{part.content}</span>;
    }
  });
}

// ── Block types for non-fenced content ─────────────────────────────────────────
type InlineBlock =
  | { kind: 'paragraph'; lines: string[] }
  | { kind: 'ul'; items: string[] }
  | { kind: 'ol'; items: string[] }
  | { kind: 'heading'; level: number; text: string }
  | { kind: 'hr' }
  | { kind: 'blockquote'; text: string };

const PARA_CLASS = 'leading-[1.8] sm:leading-[1.85] max-w-prose sm:max-w-[85ch] lg:max-w-3xl px-1 sm:px-0';

function parseBlocks(text: string): InlineBlock[] {
  const rawBlocks = text.split(/\n\n+/);
  const blocks: InlineBlock[] = [];

  for (const raw of rawBlocks) {
    const trimmed = raw.trim();
    if (!trimmed) continue;

    const lines = trimmed.split('\n');

    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      blocks.push({ kind: 'hr' });
      continue;
    }

    if (lines.length === 1) {
      const hMatch = lines[0].match(/^(#{1,6})\s+(.+)$/);
      if (hMatch) {
        blocks.push({ kind: 'heading', level: hMatch[1].length, text: hMatch[2] });
        continue;
      }
    }

    if (lines.every(l => /^\s*[-*+]\s/.test(l))) {
      blocks.push({ kind: 'ul', items: lines.map(l => l.replace(/^\s*[-*+]\s+/, '')) });
      continue;
    }

    if (lines.every(l => /^\s*\d+\.\s/.test(l))) {
      blocks.push({ kind: 'ol', items: lines.map(l => l.replace(/^\s*\d+\.\s+/, '')) });
      continue;
    }

    if (lines.every(l => /^\s*>/.test(l))) {
      blocks.push({ kind: 'blockquote', text: lines.map(l => l.replace(/^\s*> ?/, '')).join('\n') });
      continue;
    }

    blocks.push({ kind: 'paragraph', lines });
  }

  return blocks;
}

function renderBlock(block: InlineBlock, key: number): React.ReactNode {
  switch (block.kind) {
    case 'paragraph':
      return (
        <p key={key} className={PARA_CLASS}>
          {renderInline(block.lines.join('\n'))}
        </p>
      );
    case 'ul':
      return (
        <ul key={key} className="list-disc list-inside space-y-3 leading-[1.8] sm:leading-[1.85] max-w-prose sm:max-w-[85ch] lg:max-w-3xl px-1 sm:px-0">
          {block.items.map((item, j) => (
            <li key={j}>{renderInline(item)}</li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol key={key} className="list-decimal list-inside space-y-3 leading-[1.8] sm:leading-[1.85] max-w-prose sm:max-w-[85ch] lg:max-w-3xl px-1 sm:px-0">
          {block.items.map((item, j) => (
            <li key={j}>{renderInline(item)}</li>
          ))}
        </ol>
      );
    case 'heading': {
      const level = Math.min(block.level, 4);
      const size =
        level === 1 ? 'text-2xl mt-6 mb-4' :
        level === 2 ? 'text-xl mt-5 mb-3' :
        level === 3 ? 'text-lg mt-4 mb-2' :
                      'text-base mt-3 mb-2';
      const cls = `font-bold text-text-primary leading-snug ${size} px-1 sm:px-0 max-w-prose sm:max-w-[85ch] lg:max-w-3xl`;
      switch (level) {
        case 1: return <h1 key={key} className={cls}>{renderInline(block.text)}</h1>;
        case 2: return <h2 key={key} className={cls}>{renderInline(block.text)}</h2>;
        case 3: return <h3 key={key} className={cls}>{renderInline(block.text)}</h3>;
        default: return <h4 key={key} className={cls}>{renderInline(block.text)}</h4>;
      }
    }
    case 'blockquote':
      return (
        <blockquote key={key} className="border-l-2 border-accent/40 pl-4 italic text-text-secondary leading-[1.8] sm:leading-[1.85] max-w-prose sm:max-w-[85ch] lg:max-w-3xl px-1 sm:px-0">
          {renderInline(block.text)}
        </blockquote>
      );
    case 'hr':
      return <hr key={key} className="border-border my-12 md:my-16" />;
  }
}

// ── Main renderer ─────────────────────────────────────────────────────────────
// Supports:
//   - Fenced blocks:  ```bash\n...\n```
//   - Inline code:    `command`
//   - Bold:           **text**
//   - Italic:         *text*
//   - Bold+Italic:    ***text***
//   - Lists:          - item / 1. item
//   - Headings:       # text
//   - Blockquotes:    > text
//   - Horizontal rule:--- / *** / ___
//   - Plain text:     everything else
const CodeBlockRenderer: React.FC<{ text: string }> = ({ text }) => {
  // Split on fenced code blocks first
  const fencedPattern = /```(\w*)\n([\s\S]*?)```/g;
  const segments: Array<
    | { kind: 'fenced'; lang: string; code: string }
    | { kind: 'inline'; text: string }
  > = [];

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = fencedPattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ kind: 'inline', text: text.slice(lastIndex, match.index) });
    }
    segments.push({ kind: 'fenced', lang: match[1] || 'bash', code: match[2].trimEnd() });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    segments.push({ kind: 'inline', text: text.slice(lastIndex) });
  }

  if (segments.length === 0) {
    segments.push({ kind: 'inline', text });
  }

  return (
    <>
      {segments.map((seg, segIdx) => {
        if (seg.kind === 'fenced') {
          return <FencedCodeBlock key={segIdx} code={seg.code} lang={seg.lang} />;
        }

        // Parse inline text into blocks (paragraphs, lists, headings, etc.)
        const blocks = parseBlocks(seg.text);

        return (
          <div key={segIdx} className="space-y-8 md:space-y-10">
            {blocks.map((block, blockIdx) => renderBlock(block, blockIdx))}
          </div>
        );
      })}
    </>
  );
};

export default CodeBlockRenderer;
