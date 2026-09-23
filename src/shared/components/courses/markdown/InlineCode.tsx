import { useState } from 'react';
import { Copy } from 'lucide-react';
import { IconCheck } from '@/shared/components/icons';

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
      className={`group/inline inline-flex items-center gap-1 mx-0.5 px-1.5 py-px rounded-[4px] border font-mono text-xs leading-snug transition-[border-color,background-color,color] align-middle whitespace-nowrap ${
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

export default InlineCode;