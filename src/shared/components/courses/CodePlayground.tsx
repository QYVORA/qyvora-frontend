import React, { useState } from 'react';
import { RotateCcw, Copy } from 'lucide-react';
import { IconPlay, IconCheck, IconTerminal } from '@/shared/components/icons';

interface CodePlaygroundProps {
  initialCode: string;
  language?: string;
  expectedOutput?: string;
  title?: string;
  className?: string;
}

const RUNNERS: Record<string, (code: string) => string> = {
  python: (code) => {
    if (code.includes('print')) {
      const match = code.match(/print\(['"](.+?)['"]\)/);
      return match ? match[1] : '';
    }
    return '';
  },
  bash: (code) => {
    if (code.startsWith('echo ')) return code.slice(5).replace(/['"]/g, '');
    if (code.startsWith('ls')) return 'Desktop  Documents  Downloads  Pictures  Projects';
    if (code.startsWith('pwd')) return '/home/user';
    if (code.startsWith('whoami')) return 'user';
    return '';
  },
  javascript: (code) => {
    if (code.includes('console.log')) {
      const match = code.match(/console\.log\(['"](.+?)['"]\)/);
      return match ? match[1] : '';
    }
    return '';
  },
};

const CodePlayground: React.FC<CodePlaygroundProps> = ({
  initialCode,
  language = 'python',
  expectedOutput,
  title = 'Code Playground',
  className = '',
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleRun = () => {
    setError(null);
    setOutput(null);

    const runner = RUNNERS[language];
    if (!runner) {
      setError(`Language "${language}" is not supported in this sandbox.`);
      return;
    }

    try {
      const result = runner(code);
      setOutput(result || '(no output)');

      if (expectedOutput !== undefined && result !== expectedOutput) {
        setError(`Expected output: "${expectedOutput}" but got: "${result}"`);
      } else if (expectedOutput !== undefined) {
        setOutput(`${result}\n\n✓ Output matches expected!`);
      }
    } catch (e: any) {
      setError(e.message || 'Execution error');
    }
  };

  const handleReset = () => {
    setCode(initialCode);
    setOutput(null);
    setError(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={`border border-border rounded-xl overflow-hidden my-8 ${className}`}>
      <div className="flex items-center justify-between bg-bg-card px-5 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <IconTerminal size={16} className="text-accent" />
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-text-muted">{title}</span>
          {language && (
            <span className="px-1.5 py-0.5 rounded-sm bg-accent/10 text-[9px] font-mono font-black text-accent uppercase">{language}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleCopy} className="text-text-muted hover:text-accent transition-colors p-1" title="Copy code">
            {copied ? <IconCheck size={14} className="text-accent" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
          <button onClick={handleReset} className="text-text-muted hover:text-accent transition-colors p-1" title="Reset">
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="bg-[var(--color-code-bg, #0d0d0d)]">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full bg-transparent text-text-primary font-mono text-sm p-4 sm:p-5 border-none outline-none resize-none min-h-[120px] leading-relaxed caret-accent"
          spellCheck={false}
          style={{ tabSize: 2 }}
        />
      </div>

      <div className="flex items-center gap-3 px-5 py-3 bg-bg-card border-t border-border">
        <button onClick={handleRun} className="btn-primary text-[10px] py-2 px-5 inline-flex items-center gap-1.5">
          <IconPlay size={12} /> Run
        </button>
        {expectedOutput && (
          <button onClick={() => setShowHint(!showHint)} className="text-[10px] font-mono text-text-muted hover:text-accent transition-colors">
            {showHint ? 'Hide hint' : 'Show hint'}
          </button>
        )}
      </div>

      {showHint && expectedOutput && (
        <div className="px-5 py-3 bg-accent-dim border-t border-border/30">
          <p className="text-[11px] font-mono text-text-muted">
            Expected output: <span className="text-accent">{expectedOutput}</span>
          </p>
        </div>
      )}

      {output && (
        <div className="px-5 py-4 bg-[#000000] border-t border-border/30">
          <pre className="text-sm font-mono text-accent whitespace-pre-wrap leading-relaxed">{output}</pre>
        </div>
      )}

      {error && (
        <div className="px-5 py-4 bg-red-900/10 border-t border-red-900/20">
          <pre className="text-sm font-mono text-red-400 whitespace-pre-wrap leading-relaxed">{error}</pre>
        </div>
      )}
    </div>
  );
};

export default CodePlayground;
