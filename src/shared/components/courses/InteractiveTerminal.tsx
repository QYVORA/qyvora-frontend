import React, { useState, useRef, useEffect, useCallback } from 'react';

const COMMANDS: Record<string, string> = {
  ls: 'Desktop  Documents  Downloads  Music  Pictures  Projects  Public  Templates  Videos',
  pwd: '/home/qyvora-student',
  whoami: 'qyvora-student',
  id: 'uid=1001(qyvora-student) gid=1001(qyvora-student) groups=1001(qyvora-student),27(sudo)',
  uname: 'Linux qyvora-sandbox 6.8.0-x86_64 GNU/Linux',
  'uname -a': 'Linux qyvora-sandbox 6.8.0-x86_64 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux',
  date: new Date().toString(),
  cal: '    July 2026\nMo Tu We Th Fr Sa Su\n       1  2  3  4  5\n 6  7  8  9 10 11 12\n13 14 15 16 17 18 19\n20 21 22 23 24 25 26\n27 28 29 30 31',
  echo: '',
  help: 'Available commands: ls, pwd, whoami, id, uname, date, cal, echo, cat, cd, clear, help, exit',
  exit: '[Session terminated. Close the terminal and reopen to start a new session.]',
  cat: '',
  cd: '',
  'ls -la': 'total 48\ndrwxr-xr-x 12 qyvora-student qyvora-student 4096 Jul  4 12:00 .\ndrwxr-xr-x  3 root          root          4096 Jul  4 12:00 ..\ndrwxr-xr-x  2 qyvora-student qyvora-student 4096 Jul  4 12:00 Desktop\ndrwxr-xr-x  2 qyvora-student qyvora-student 4096 Jul  4 12:00 Documents\ndrwxr-xr-x  2 qyvora-student qyvora-student 4096 Jul  4 12:00 Downloads\n-rw-r--r--  1 qyvora-student qyvora-student  220 Jul  4 12:00 .env\n-rw-r--r--  1 qyvora-student qyvora-student 1024 Jul  4 12:00 secret.txt',
  'cat .env': 'DB_HOST=localhost\nDB_PORT=5432\nAPI_KEY=qyvora_demo_sk_xxxxxxxx\nFLAG=QYVORA{terminal_master}',
  'cat secret.txt': 'ACCESS DENIED: You do not have permission to read this file.\n\nHint: Try checking the file permissions with ls -la',
};

interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'system';
  text: string;
}

interface InteractiveTerminalProps {
  initialCommands?: string[];
  title?: string;
  className?: string;
  onCommand?: (command: string) => void;
}

export const InteractiveTerminal: React.FC<InteractiveTerminalProps> = ({
  initialCommands = [],
  title = 'terminal',
  className = '',
  onCommand,
}) => {
  const [lines, setLines] = useState<TerminalLine[]>(() => {
    const initial: TerminalLine[] = [
      { type: 'system', text: 'QYVORA Sandbox Terminal v1.0' },
      { type: 'system', text: 'Type "help" for available commands.' },
      { type: 'system', text: '─────────────────────────────────' },
    ];
    for (const cmd of initialCommands) {
      initial.push({ type: 'input', text: `$ ${cmd}` });
      const fn = COMMANDS[cmd];
      if (fn) {
        initial.push({ type: 'output', text: fn });
      } else if (cmd.startsWith('echo ')) {
        initial.push({ type: 'output', text: cmd.slice(5) });
      } else if (cmd.startsWith('cat ')) {
        const file = cmd.slice(4);
        if (COMMANDS[cmd]) {
          initial.push({ type: 'output', text: COMMANDS[cmd] });
        } else {
          initial.push({ type: 'error', text: `cat: ${file}: No such file or directory` });
        }
      } else if (cmd.startsWith('cd ')) {
        initial.push({ type: 'output', text: '' });
      } else {
        initial.push({ type: 'error', text: `bash: ${cmd.split(' ')[0]}: command not found` });
      }
    }
    return initial;
  });

  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  const processCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setLines(prev => [...prev, { type: 'input', text: `$ ${trimmed}` }]);
    setHistory(prev => [...prev, trimmed]);
    setHistoryIdx(-1);
    onCommand?.(trimmed);

    if (trimmed === 'clear') {
      setLines([]);
      return;
    }

    if (COMMANDS[trimmed] !== undefined) {
      setLines(prev => [...prev, { type: 'output', text: COMMANDS[trimmed] }]);
      return;
    }

    if (trimmed.startsWith('echo ')) {
      setLines(prev => [...prev, { type: 'output', text: trimmed.slice(5) }]);
      return;
    }

    if (trimmed.startsWith('cat ')) {
      const file = trimmed.slice(4);
      if (COMMANDS[trimmed]) {
        setLines(prev => [...prev, { type: 'output', text: COMMANDS[trimmed] }]);
      } else {
        setLines(prev => [...prev, { type: 'error', text: `cat: ${file}: No such file or directory` }]);
      }
      return;
    }

    if (trimmed.startsWith('cd ')) {
      setLines(prev => [...prev, { type: 'output', text: '' }]);
      return;
    }

    setLines(prev => [...prev, { type: 'error', text: `bash: ${trimmed.split(' ')[0]}: command not found` }]);
  }, [onCommand]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      processCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIdx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
        setHistoryIdx(newIdx);
        setInput(history[newIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx >= 0) {
        const newIdx = historyIdx + 1;
        if (newIdx >= history.length) {
          setHistoryIdx(-1);
          setInput('');
        } else {
          setHistoryIdx(newIdx);
          setInput(history[newIdx]);
        }
      }
    }
  };

  return (
    <div className={`relative border border-border rounded-xl overflow-hidden my-8 bg-[#000000] ${className}`}>
      <div className="flex items-center justify-between border-b border-border bg-bg-card px-5 py-3 select-none">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-accent/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
        </div>
        <span className="text-[10px] font-mono text-text-muted uppercase tracking-[0.15em]">{title}</span>
      </div>

      <div
        ref={containerRef}
        className="overflow-y-auto max-h-[70vh] p-4 sm:p-6 font-mono text-sm leading-relaxed"
        style={{ background: '#000000' }}
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((line, i) => (
          <div key={i} className={`mb-1 ${
            line.type === 'input' ? 'text-text-primary' :
            line.type === 'output' ? 'text-text-secondary' :
            line.type === 'error' ? 'text-red-400' :
            'text-text-muted text-[11px]'
          }`}>
            {line.text}
          </div>
        ))}
        <div className="flex items-center mb-1">
          <span className="text-accent mr-2 shrink-0">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-text-primary font-mono text-sm p-0 min-h-0 caret-accent"
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
};

export default InteractiveTerminal;
