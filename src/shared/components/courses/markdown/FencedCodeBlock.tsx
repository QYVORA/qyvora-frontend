import { useState } from 'react';
import { Copy } from 'lucide-react';
import { IconCheck, IconTerminal } from '@/shared/components/icons';
import { tokeniseBash, TOKEN_CLASS } from './bashTokenizer';

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
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-widest transition-[border-color,background-color,color] ${
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
          <span className="text-xs font-black uppercase tracking-[0.25em] text-text-muted">
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
              <span className="select-none mr-3 text-xs text-text-muted/30 w-4 shrink-0 text-right">
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

export default FencedCodeBlock;