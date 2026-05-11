import { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';

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
  keyword: 'text-accent font-bold',
  string:  'text-emerald-400',
  comment: 'text-text-muted italic',
  number:  'text-amber-400',
  flag:    'text-blue-400',
  path:    'text-purple-400',
  plain:   'text-text-primary',
};

// ── Copy button ───────────────────────────────────────────────────────────────
const CopyBtn: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const copy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
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
      {copied ? <><Check className="h-3 w-3" />Copied</> : <><Copy className="h-3 w-3" />Copy</>}
    </button>
  );
};

// ── Fenced code block ─────────────────────────────────────────────────────────
const FencedCodeBlock: React.FC<{ code: string; lang: string }> = ({ code, lang }) => {
  const lines = code.split('\n');
  const isBash = !lang || lang === 'bash' || lang === 'sh' || lang === 'shell';

  return (
    <div className="my-4 rounded-xl border border-border overflow-hidden bg-[#0d0d0d]">
      {/* Header bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/60 bg-bg-card/80">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-accent opacity-70" />
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
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={copy}
      title="Click to copy"
      className={`group/inline inline-flex items-center mx-0.5 px-1 py-0 rounded-[2px] border font-mono text-[11px] leading-none transition-all ${
        copied
          ? 'border-accent/50 bg-accent-dim text-accent'
          : 'border-border bg-[#0d0d0d] text-accent hover:border-accent/40'
      }`}
    >
      {code}
      <span className={`transition-opacity ${copied ? 'opacity-100' : 'opacity-0 group-hover/inline:opacity-60'}`}>
        {copied ? <Check className="h-2 w-2" /> : <Copy className="h-2 w-2" />}
      </span>
    </button>
  );
};

// ── Main renderer ─────────────────────────────────────────────────────────────
// Supports:
//   - Fenced blocks:  ```bash\n...\n```
//   - Inline code:    `command`
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

        // Process inline code within the text segment
        const inlinePattern = /`([^`]+)`/g;
        const boldPattern = /\*\*([^*]+)\*\*/g;
        const parts: Array<{ type: 'text' | 'code' | 'bold'; content: string }> = [];
        let li = 0;
        
        // Combine both patterns
        const combinedPattern = /(`[^`]+`|\*\*[^*]+\*\*)/g;
        let im: RegExpExecArray | null;

        while ((im = combinedPattern.exec(seg.text)) !== null) {
          if (im.index > li) parts.push({ type: 'text', content: seg.text.slice(li, im.index) });
          
          const match = im[0];
          if (match.startsWith('`')) {
            // Inline code
            parts.push({ type: 'code', content: match.slice(1, -1).trim() });
          } else if (match.startsWith('**')) {
            // Bold text
            parts.push({ type: 'bold', content: match.slice(2, -2) });
          }
          
          li = im.index + im[0].length;
        }
        if (li < seg.text.length) parts.push({ type: 'text', content: seg.text.slice(li) });

        if (parts.length === 0) return null;

        return (
          <span key={segIdx}>
            {parts.map((part, partIdx) =>
              part.type === 'code'
                ? <InlineCode key={partIdx} code={part.content} />
                : part.type === 'bold'
                ? <strong key={partIdx} className="font-bold text-text-primary">{part.content}</strong>
                : <span key={partIdx}>{part.content}</span>
            )}
          </span>
        );
      })}
    </>
  );
};

export default CodeBlockRenderer;
