import { useState } from 'react';
import { Copy } from 'lucide-react';
import { IconCheck } from '@/shared/components/icons';
import { cn } from '@/shared/utils/cn';

export function CommandBlock({ command, labId }: { command: string; labId: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="space-y-2">
      <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Run in terminal</span>
      <div className="flex items-center gap-2 rounded-xl border border-border/30 bg-bg-card px-4 py-3">
        <code className="flex-1 text-base font-mono text-accent break-all">$ {command}</code>
        <button type="button" onClick={handleCopy} className="shrink-0 rounded-lg p-1.5 text-text-muted hover:text-text-primary hover:bg-bg-elevated" aria-label="Copy">
          {copied ? <IconCheck size={16} className="text-accent" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
      <p className="text-sm text-text-muted font-mono">Terminal: <span className="text-accent">qyvora connect {labId}</span></p>
    </div>
  );
}

interface FlagInputProps {
  flagId: string;
  disabled: boolean;
  onFlagSubmit: (stepId: string, flag: string) => Promise<{ correct: boolean }>;
  onCorrect: () => void;
}

export function FlagInput({ flagId, disabled, onFlagSubmit, onCorrect }: FlagInputProps) {
  const [flag, setFlag] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async () => {
    if (!flag.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const result = await onFlagSubmit(flagId, flag.trim());
      if (result.correct) { onCorrect(); } else { setError('Incorrect flag. Try again.'); }
    } catch { setError('Submission failed.'); }
    finally { setSubmitting(false); }
  };
  return (
    <div className="space-y-2">
      <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Submit flag</span>
      <div className="flex items-center gap-2">
        <input type="text" value={flag} onChange={(e) => { setFlag(e.target.value); setError(''); }}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} placeholder="QYVORA{...}" disabled={disabled || submitting}
          className={cn('flex-1 rounded-xl border bg-bg px-4 py-3 font-mono text-base text-text-primary placeholder:text-text-muted outline-none transition-colors',
            error ? 'border-red-500/50 focus:border-red-500' : 'border-border focus:border-accent', 'disabled:opacity-50')} />
        <button type="button" onClick={handleSubmit} disabled={disabled || submitting || !flag.trim()}
          className="btn-primary !rounded-xl !text-xs !px-5 !py-3 disabled:opacity-50">
          {submitting ? '...' : 'Submit'}
        </button>
      </div>
      {error && <p className="text-sm font-mono text-red-400">{error}</p>}
    </div>
  );
}

export function StepComplete() {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-accent/20 bg-accent-dim px-4 py-3">
      <IconCheck size={16} className="text-accent shrink-0" />
      <span className="text-sm font-mono font-bold text-accent">Step completed!</span>
    </div>
  );
}
