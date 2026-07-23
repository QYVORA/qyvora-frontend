import { useState } from 'react';
import { Copy, Terminal, FileCode, FolderTree } from 'lucide-react';
import { IconCheck } from '@/shared/components/icons';
import { cn } from '@/shared/utils/cn';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showCopy?: boolean;
  className?: string;
}

export function CodeBlock({ code, language, title, showCopy = true, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn('rounded-xl border border-border/30 bg-bg-card overflow-hidden', className)}>
      {(title || language) && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-border/20 bg-bg-elevated">
          <div className="flex items-center gap-2">
            <FileCode size={12} className="text-accent" />
            <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">
              {title || language}
            </span>
          </div>
          {showCopy && (
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-lg p-1.5 text-text-muted hover:text-text-primary hover:bg-bg-card transition-colors"
              aria-label="Copy"
            >
              {copied ? <IconCheck size={12} className="text-accent" /> : <Copy size={12} />}
            </button>
          )}
        </div>
      )}
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm font-mono text-text-secondary whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}

interface DirectoryTreeProps {
  structure: string;
  title?: string;
  className?: string;
}

export function DirectoryTree({ structure, title = 'Directory Structure', className }: DirectoryTreeProps) {
  return (
    <div className={cn('rounded-xl border border-border/30 bg-bg-card overflow-hidden', className)}>
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border/20 bg-bg-elevated">
        <FolderTree size={12} className="text-accent" />
        <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">
          {title}
        </span>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm font-mono text-text-secondary whitespace-pre">{structure}</code>
      </pre>
    </div>
  );
}

interface TerminalBlockProps {
  command: string;
  output?: string;
  title?: string;
  className?: string;
}

export function TerminalBlock({ command, output, title = 'Terminal', className }: TerminalBlockProps) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn('rounded-xl border border-border/30 bg-bg-card overflow-hidden', className)}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/20 bg-bg-elevated">
        <div className="flex items-center gap-2">
          <Terminal size={12} className="text-accent" />
          <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">
            {title}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-lg p-1.5 text-text-muted hover:text-text-primary hover:bg-bg-card transition-colors"
          aria-label="Copy"
        >
          {copied ? <IconCheck size={12} className="text-accent" /> : <Copy size={12} />}
        </button>
      </div>
      <div className="p-4 font-mono text-sm">
        <div className="flex items-center gap-2">
          <span className="text-accent">$</span>
          <code className="text-text-primary">{command}</code>
        </div>
        {output && (
          <pre className="mt-2 text-text-muted whitespace-pre-wrap">{output}</pre>
        )}
      </div>
    </div>
  );
}
