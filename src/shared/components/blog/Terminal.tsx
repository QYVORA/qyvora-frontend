import React, { useRef, useState, useEffect, useCallback } from 'react';

const INTERACTIVE_COMMANDS: Record<string, string> = {
  ls: 'Documents  Downloads  projects  tools  .config  .local',
  pwd: '/home/operator',
  whoami: 'operator',
  echo: 'echo',
  uname: 'Linux qyvora-node 6.2.0-arch1-1 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux',
  hostname: 'qyvora-node',
  help: 'Available commands: ls, pwd, whoami, echo, uname, hostname, cat, cd, clear, help, exit, history',
  exit: 'Session terminated. Goodbye, operator.',
  cat: 'cat: no file specified',
  cd: '(directory changed)',
  clear: '__CLEAR__',
  history: '',
};

const Terminal: React.FC<{
  code: string;
  title?: string;
  interactive?: boolean;
}> = ({ code, title = 'terminal', interactive = false }) => {
  const preRef = useRef<HTMLPreElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const [lines, setLines] = useState<Array<{ type: 'output' | 'input' | 'prompt'; text: string }>>(() => {
    if (interactive) return [{ type: 'prompt', text: '' }];
    return [];
  });
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  useEffect(() => {
    const pre = preRef.current;
    const wrapper = wrapperRef.current;
    if (!pre || !wrapper) return;

    const updateScale = () => {
      const ww = wrapper.clientWidth;
      const contentWidth = pre.scrollWidth;
      setScale(contentWidth > ww ? ww / contentWidth : 1);
    };

    requestAnimationFrame(updateScale);
    const observer = new ResizeObserver(updateScale);
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [code]);

  useEffect(() => {
    if (interactive && outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines, interactive]);

  const handleCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim();
    const newHistory = [...history.filter(h => h !== trimmed), trimmed];
    setHistory(newHistory);
    setHistoryIdx(-1);

    const inputLine: Array<{ type: 'output' | 'input' | 'prompt'; text: string }> = [
      { type: 'input', text: `$ ${cmd}` },
    ];

    if (!trimmed) {
      setLines((prev) => [...prev, ...inputLine, { type: 'prompt', text: '' }]);
      setInputValue('');
      return;
    }

    const cmdName = trimmed.split(/\s+/)[0];
    const rest = trimmed.slice(cmdName.length).trim();

    let response = '';
    if (cmdName === 'clear') {
      setLines([{ type: 'prompt', text: '' }]);
      setInputValue('');
      return;
    }
    if (cmdName === 'history') {
      response = newHistory.map((h, i) => `  ${i + 1}  ${h}`).join('\n');
    } else if (cmdName === 'echo') {
      response = rest || '';
    } else if (cmdName === 'cat') {
      response = rest ? `(contents of ${rest} would be shown here)` : INTERACTIVE_COMMANDS.cat;
    } else {
      response = INTERACTIVE_COMMANDS[cmdName] || `command not found: ${cmdName}`;
    }

    const outputLines = [{ type: 'output' as const, text: response }];
    setLines((prev) => [...prev, ...inputLine, ...outputLines, { type: 'prompt', text: '' }]);
    setInputValue('');
  }, [history]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) handleCommand(inputValue);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const newIdx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(newIdx);
      setInputValue(history[newIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx === -1) return;
      const newIdx = historyIdx + 1;
      if (newIdx >= history.length) {
        setHistoryIdx(-1);
        setInputValue('');
      } else {
        setHistoryIdx(newIdx);
        setInputValue(history[newIdx]);
      }
    }
  };

  // Non-interactive: just show code
  if (!interactive) {
    return (
      <div className="relative border border-white/10 bg-bg-card/70 rounded-xl overflow-hidden my-8">
        <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-5 py-3 select-none">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-accent/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          </div>
          <span className="text-[10px] font-mono text-text-muted uppercase tracking-[0.15em]">{title}</span>
        </div>

        <div
          ref={wrapperRef}
          className="relative overflow-x-hidden overflow-y-auto max-h-[70vh] custom-scrollbar"
        >
          <div style={{ height: scale < 1 ? `${100 / scale}%` : undefined }}>
            <pre
              ref={preRef}
              className="p-4 sm:p-6 md:p-8 font-mono leading-relaxed whitespace-pre text-text-secondary"
              style={{
                fontSize: '0.8rem',
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                width: scale < 1 ? `${(1 / scale) * 100}%` : undefined,
              }}
            >
              <code>
                {code.split('\n').map((line, i, arr) => (
                  <React.Fragment key={i}>
                    <span>{line || ' '}</span>
                    {i === arr.length - 1 && (
                      <span
                        className="inline-block w-[0.55em] h-[1.05em] bg-accent/90 ml-[1px] animate-pulse"
                        style={{ verticalAlign: 'text-bottom', marginBottom: '1px' }}
                      />
                    )}
                    {i < arr.length - 1 && '\n'}
                  </React.Fragment>
                ))}
              </code>
            </pre>
          </div>
        </div>
      </div>
    );
  }

  // Interactive mode
  return (
    <div className="relative border border-white/10 bg-black rounded-xl overflow-hidden my-8">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-5 py-3 select-none">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-accent/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
        </div>
        <span className="text-[10px] font-mono text-text-muted uppercase tracking-[0.15em]">{title}</span>
      </div>

      <div
        ref={outputRef}
        className="relative overflow-auto max-h-[70vh] custom-scrollbar p-4 sm:p-6 md:p-8 font-mono text-sm leading-relaxed"
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((line, i) => {
          if (line.type === 'prompt') {
            return (
              <div key={i} className="flex items-center">
                <span className="text-accent mr-2 shrink-0">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent border-none outline-none text-text-primary font-mono text-sm caret-accent p-0 m-0"
                  autoFocus
                  spellCheck={false}
                  autoComplete="off"
                />
              </div>
            );
          }
          if (line.type === 'input') {
            return (
              <div key={i} className="text-text-secondary whitespace-pre-wrap">
                {line.text}
              </div>
            );
          }
          return (
            <div key={i} className="text-text-primary whitespace-pre-wrap">
              {line.text}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Terminal;
export { Terminal };
