import { useMemo, useState } from 'react';
import { Copy } from 'lucide-react';
import { IconCheck, IconTerminal } from '@/shared/components/icons';
import { CommandExplanation } from '@/shared/components/learning/CommandExplanation';
import { ShellCode } from './ShellCode';
import { CommandNotes } from './CommandNotes';
import { extractShellComments, isShellLanguage } from './shellComments';

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
  const isShell = isShellLanguage(lang);
  const { code: cleanCode, comments } = useMemo(
    () => (isShell ? extractShellComments(code) : { code, comments: [] }),
    [code, isShell],
  );

  if (!cleanCode.trim() && comments.length > 0) {
    return (
      <div className="my-6 rounded-xl border border-border/50 bg-bg-card px-4 py-4 md:my-8">
        <CommandNotes comments={comments} />
      </div>
    );
  }

  return (
    <div className="wc-code my-6 overflow-hidden rounded-xl border border-border bg-code-bg md:my-8">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-border/60 bg-bg-card/80 px-3 py-2">
        <div className="flex items-center gap-2">
          <IconTerminal size={14} className="text-accent opacity-70" />
          <span className="text-[10px] font-black uppercase tracking-[0.22em] text-text-muted sm:text-xs">
            {lang || 'bash'}
          </span>
        </div>
        <CopyBtn text={cleanCode} />
      </div>

      <ShellCode code={cleanCode} language={lang} showLineNumbers />

      {isShell && comments.length > 0 && (
        <div className="border-t border-border/60 bg-bg-card/60 px-4 py-3">
          <CommandNotes comments={comments} />
        </div>
      )}

      {isShell && <CommandExplanation command={cleanCode} collapsible />}
    </div>
  );
};

export default FencedCodeBlock;