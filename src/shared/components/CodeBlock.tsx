import React from 'react';
import { Check, Copy } from 'lucide-react';

/**
 * CodeBlock — dependency-free syntax highlighting for Go and shell snippets.
 *
 * Uses a small regex tokenizer instead of a highlighter library so tool pages
 * stay self-contained. Palette mirrors the existing IDE/terminal mocks
 * (SimulationsPage) and the site accent, so highlighted code reads as part of
 * the same design system.
 */

type TokenClass =
  | 'comment'
  | 'string'
  | 'number'
  | 'keyword'
  | 'type'
  | 'builtin'
  | 'func'
  | 'cmd'
  | 'flag'
  | 'op'
  | 'prompt'
  | 'plain';

const TOKEN_CLASSES: Record<TokenClass, string> = {
  comment: 'text-text-muted italic',
  string: 'text-[#e5c07b]',
  number: 'text-[#d19a66]',
  keyword: 'text-[#c678dd]',
  type: 'text-[#56b6c2]',
  builtin: 'text-[#61afef]',
  func: 'text-accent',
  cmd: 'text-accent',
  flag: 'text-[#56b6c2]',
  op: 'text-text-muted',
  prompt: 'text-text-muted',
  plain: 'text-text-secondary',
};

interface Token {
  text: string;
  cls: TokenClass;
}

// ── Go ───────────────────────────────────────────────────────────────────────
const GO_KEYWORDS = new Set([
  'break', 'case', 'chan', 'const', 'continue', 'default', 'defer', 'else',
  'fallthrough', 'for', 'func', 'go', 'goto', 'if', 'import', 'interface',
  'map', 'package', 'range', 'return', 'select', 'struct', 'switch', 'type', 'var',
]);
const GO_TYPES = new Set([
  'bool', 'byte', 'complex64', 'complex128', 'error', 'float32', 'float64',
  'int', 'int8', 'int16', 'int32', 'int64', 'rune', 'string', 'uint', 'uint8',
  'uint16', 'uint32', 'uint64', 'uintptr',
]);
const GO_BUILTINS = new Set([
  'append', 'cap', 'clear', 'close', 'complex', 'copy', 'delete', 'imag',
  'len', 'make', 'max', 'min', 'new', 'panic', 'print', 'println', 'real', 'recover',
]);

const GO_RE =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|(`[^`]*`)|("[^"\n\\]*(?:\\.[^"\n\\]*)*")|('(?:[^'\\\n]|\\.)*')|(0[xX][0-9a-fA-F_]+|\d[\d_]*(?:\.\d[\d_]*)?(?:[eE][+-]?\d+)?)|(\b[A-Za-z_][A-Za-z0-9_]*\b)/g;

function tokenizeGo(code: string): Token[] {
  const out: Token[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  GO_RE.lastIndex = 0;
  while ((m = GO_RE.exec(code)) !== null) {
    const start = m.index;
    if (start > last) out.push({ text: code.slice(last, start), cls: 'plain' });
    const [, comment, raw, str, char, num, ident] = m;
    if (comment) out.push({ text: m[0], cls: 'comment' });
    else if (raw) out.push({ text: m[0], cls: 'string' });
    else if (str) out.push({ text: m[0], cls: 'string' });
    else if (char) out.push({ text: m[0], cls: 'string' });
    else if (num) out.push({ text: m[0], cls: 'number' });
    else if (ident) {
      let cls: TokenClass = 'plain';
      if (GO_KEYWORDS.has(ident)) cls = 'keyword';
      else if (GO_TYPES.has(ident)) cls = 'type';
      else if (GO_BUILTINS.has(ident)) cls = 'builtin';
      else if (/^\s*\(/.test(code.slice(GO_RE.lastIndex))) cls = 'func';
      out.push({ text: m[0], cls });
    }
    last = GO_RE.lastIndex;
  }
  if (last < code.length) out.push({ text: code.slice(last), cls: 'plain' });
  return out;
}

// ── Shell ────────────────────────────────────────────────────────────────────
const SH_TOK_RE =
  /(#[^\n]*)|("(?:[^"\\\n]|\\.)*"|'[^'\n]*')|(\|\||&&|\||;)|(--?[A-Za-z][A-Za-z0-9-]*)|(\b[A-Za-z_][A-Za-z0-9_./+:]*\b)|(\s+)/g;

function tokenizeShellRest(text: string, out: Token[]): void {
  let last = 0;
  let atCmdStart = true;
  let m: RegExpExecArray | null;
  SH_TOK_RE.lastIndex = 0;
  while ((m = SH_TOK_RE.exec(text)) !== null) {
    const start = m.index;
    if (start > last) out.push({ text: text.slice(last, start), cls: 'plain' });
    const [, comment, str, op, flag, word, ws] = m;
    if (comment) out.push({ text: m[0], cls: 'comment' });
    else if (str) out.push({ text: m[0], cls: 'string' });
    else if (op) {
      out.push({ text: m[0], cls: 'op' });
      atCmdStart = true;
    } else if (flag) {
      out.push({ text: m[0], cls: 'flag' });
      atCmdStart = false;
    } else if (word) {
      out.push({ text: m[0], cls: atCmdStart ? 'cmd' : 'plain' });
      if (word === 'sudo') atCmdStart = true;
      else atCmdStart = false;
    } else if (ws) {
      out.push({ text: m[0], cls: 'plain' });
    }
    last = SH_TOK_RE.lastIndex;
  }
  if (last < text.length) out.push({ text: text.slice(last), cls: 'plain' });
}

function tokenizeShell(code: string): Token[] {
  const out: Token[] = [];
  const lines = code.split('\n');
  for (const line of lines) {
    const dollarPrompt = line.match(/^(\$)\s+/);
    const replPrompt = line.match(/^(\S+\s+>\s+)/);
    const commentLine = line.match(/^(\s*#.*)$/);
    if (dollarPrompt) {
      out.push({ text: dollarPrompt[1], cls: 'prompt' });
      tokenizeShellRest(line.slice(dollarPrompt[0].length), out);
    } else if (replPrompt) {
      out.push({ text: replPrompt[1], cls: 'prompt' });
      tokenizeShellRest(line.slice(replPrompt[0].length), out);
    } else if (commentLine) {
      out.push({ text: commentLine[1], cls: 'comment' });
    } else {
      tokenizeShellRest(line, out);
    }
    out.push({ text: '\n', cls: 'plain' });
  }
  if (out.length > 0 && out[out.length - 1].text === '\n') out.pop();
  return out;
}

// ── Component ────────────────────────────────────────────────────────────────
export interface CodeBlockProps {
  code: string;
  lang?: 'go' | 'sh' | 'text';
  filename?: string;
  /** Small label shown in the header, e.g. "Go" or "shell". */
  badge?: string;
  className?: string;
  copyable?: boolean;
  maxHeight?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  lang = 'text',
  filename,
  badge,
  className,
  copyable = false,
  maxHeight,
}) => {
  const [copied, setCopied] = React.useState(false);
  const tokens = React.useMemo<Token[]>(() => {
    if (lang === 'go') return tokenizeGo(code);
    if (lang === 'sh') return tokenizeShell(code);
    return [{ text: code, cls: 'plain' as TokenClass }];
  }, [code, lang]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard unavailable (non-secure context) — ignore.
    }
  };

  const hasHeader = Boolean(filename || badge || copyable);

  return (
    <div className={`wc-code overflow-hidden rounded-xl border border-border/30 bg-bg ${className ?? ''}`}>
      {hasHeader && (
        <div className="flex items-center justify-between gap-2 border-b border-border/20 bg-bg-elevated px-3 py-2">
          {filename ? (
            <span className="min-w-0 truncate font-mono text-[10px] text-text-muted">{filename}</span>
          ) : (
            <span />
          )}
          <div className="flex shrink-0 items-center gap-2">
            {badge && <span className="text-[9px] font-black uppercase tracking-widest text-accent">{badge}</span>}
            {copyable && (
              <button
                type="button"
                onClick={copy}
                aria-label="Copy command"
                className="inline-flex items-center gap-1 rounded-lg border border-border/20 bg-bg px-2 py-1 text-[9px] font-black uppercase tracking-widest text-text-muted transition-colors hover:border-accent/40 hover:text-accent"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>
        </div>
      )}
      <pre className={`whitespace-pre-wrap break-words p-4 font-mono text-[11px] leading-relaxed sm:text-xs ${maxHeight ?? ''}`}>
        <code>
          {tokens.map((token, i) => (
            <span key={i} className={TOKEN_CLASSES[token.cls]}>
              {token.text}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
};

export default CodeBlock;
