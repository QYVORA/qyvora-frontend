import { useMemo, useState } from 'react';
import { Copy, Terminal } from 'lucide-react';
import { IconCheck } from '@/shared/components/icons';
import { CommandExplanation } from '@/shared/components/learning/CommandExplanation';
import { CommandNotes } from '@/shared/components/courses/markdown/CommandNotes';
import { ShellCode } from '@/shared/components/courses/markdown/ShellCode';
import { extractShellComments } from '@/shared/components/courses/markdown/shellComments';
import { cn } from '@/shared/utils/cn';

export function CommandBlock({ command, labId, showConnect = true }: { command: string; labId: string; showConnect?: boolean }) {
  const [copied, setCopied] = useState(false);
  const { code, comments } = useMemo(() => extractShellComments(command), [command]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Terminal size={12} className="text-accent" />
        <span className="text-[12px] font-medium uppercase tracking-[0.12em] text-text-muted">Run in terminal</span>
      </div>
      <div className="overflow-hidden rounded-lg border border-border-subtle bg-surface">
        <div className="flex items-center justify-between border-b border-border-subtle bg-surface-raised px-3 py-1.5">
          <span className="text-[12px] font-medium uppercase tracking-[0.12em] text-accent">Terminal</span>
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-surface hover:text-text-primary"
            aria-label="Copy"
          >
            {copied ? <IconCheck size={12} className="text-accent" /> : <Copy size={12} />}
          </button>
        </div>
        <ShellCode code={code} language="bash" prompt />
        {comments.length > 0 && (
          <div className="border-t border-border-subtle px-3 py-3">
            <CommandNotes comments={comments} />
          </div>
        )}
      </div>
      <CommandExplanation command={code} />
      {showConnect && (
        <p className="text-xs text-text-muted">
          Connect: <span className="text-accent">qyvora connect {labId}</span>
        </p>
      )}
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
      <label htmlFor={`flag-input-${flagId}`} className="text-[13px] font-medium text-text-muted">Submit flag</label>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <input id={`flag-input-${flagId}`} type="text" value={flag} onChange={(e) => { setFlag(e.target.value); setError(''); }}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} placeholder="QYVORA{...}" disabled={disabled || submitting}
          className={cn('w-full rounded-md border bg-canvas px-4 py-3 font-mono text-base text-text-primary placeholder:text-text-muted outline-none transition-colors sm:flex-1',
            error ? 'border-danger/50 focus:border-danger' : 'border-border focus:border-accent', 'disabled:opacity-50')} />
        <button type="button" onClick={handleSubmit} disabled={disabled || submitting || !flag.trim()}
          className="btn-primary min-h-[44px] w-full disabled:opacity-50 sm:w-auto">
          {submitting ? '...' : 'Submit'}
        </button>
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}

export function StepComplete() {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-accent/20 bg-accent/10 px-4 py-3">
      <IconCheck size={16} className="shrink-0 text-accent" />
      <span className="text-sm font-medium text-accent">Step completed</span>
    </div>
  );
}
