import React, { useState, useRef, useEffect, useCallback } from 'react';
import { TerminalOutput } from './TerminalOutput';
import { TerminalHeader } from './TerminalHeader';
import { createInitialState, processInput, getPrompt } from './engine/state';
import { injectBootcampContent } from './context/bootcampContent';
import { injectCourseContent } from './context/courseContent';
import type { TerminalState, TerminalLine, TerminalContext } from './types';

interface TerminalShellProps {
  context?: TerminalContext;
  initialCommands?: string[];
  onClose?: () => void;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
}

export const TerminalShell: React.FC<TerminalShellProps> = ({
  context,
  initialCommands = [],
  onClose,
  onToggleFullscreen,
  isFullscreen,
}) => {
  const stateRef = useRef<TerminalState>(createInitialState(context));
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [lines, setLines] = useState<TerminalLine[]>(() => {
    const initial: TerminalLine[] = [
      { type: 'system', text: 'QYVORA Simulated Terminal v2.0' },
      { type: 'system', text: 'Type "help" for available commands.' },
      { type: 'system', text: '────────────────────────────────────────────' },
    ];

    let state = stateRef.current;

    if (context?.type === 'bootcamp' && context.bootcampId) {
      state = injectBootcampContent(state, context.bootcampId, context.phaseId, context.roomId);
    }
    if (context?.type === 'course' && context.courseId) {
      state = injectCourseContent(state, context.courseId, context.lessonId);
    }

    stateRef.current = state;

    for (const cmd of initialCommands) {
      const result = processInput(cmd, state);
      initial.push(...result.lines);
      state = result.newState;
      stateRef.current = state;
    }

    return initial;
  });

  const [input, setInput] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  const process = useCallback((cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) {
      setLines(prev => [...prev, { type: 'input', text: getPrompt(stateRef.current) }]);
      return;
    }

    const result = processInput(trimmed, stateRef.current);

    const newLines: TerminalLine[] = [];

    if (result.lines.length > 0) {
      newLines.push(...result.lines);
    }

    const lastResult = result.lines[result.lines.length - 1];
    const lastError = '';

    if (result) {
      const r = (result as any);
      if (r._clearLine) {
        setLines([]);
        return;
      }

      if (r._exit) {
        newLines.push({ type: 'system', text: '[Session terminated. Close and reopen to restart.]' });
        stateRef.current = result.newState;
        setLines(prev => [...prev, ...newLines]);
        return;
      }
    }

    stateRef.current = result.newState;
    setLines(prev => [...prev, ...newLines]);
    setHistoryIndex(-1);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      process(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const hist = stateRef.current.history;
      if (hist.length > 0) {
        const newIdx = historyIndex === -1 ? hist.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIdx);
        setInput(hist[newIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIdx = historyIndex + 1;
        if (newIdx >= stateRef.current.history.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIdx);
          setInput(stateRef.current.history[newIdx]);
        }
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    } else if (e.key === 'd' && e.ctrlKey) {
      e.preventDefault();
      if (input === '') {
        process('exit');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const trimmed = input.trim();
      if (!trimmed) return;

      const parts = trimmed.split(/\s+/);
      const lastPart = parts[parts.length - 1];

      const currentState = stateRef.current;
      const dirs = currentState.root.children;
      const cwdPath = currentState.cwd;

      const matches: string[] = [];
      function collectMatching(node: any, prefix: string) {
        if (node.children) {
          node.children.forEach((child: any) => {
            if (child.name.startsWith(lastPart)) {
              matches.push(child.name + (child.type === 'dir' ? '/' : ''));
            }
            if (child.type === 'dir') {
              collectMatching(child, prefix + '/' + child.name);
            }
          });
        }
      }
      collectMatching(currentState.root, '');

      const homeDir = currentState.root.children.find((c: any) => c.name === 'home')
        ?.children.find((c: any) => c.name === 'qyvora-student');
      if (homeDir) collectMatching(homeDir, '/home/qyvora-student');

      if (matches.length === 1) {
        parts[parts.length - 1] = matches[0];
        setInput(parts.join(' ') + ' ');
      } else if (matches.length > 1) {
        const commonPrefix = matches.reduce((prefix, match) => {
          let i = 0;
          while (i < prefix.length && i < match.length && prefix[i] === match[i]) i++;
          return prefix.slice(0, i);
        }, matches[0]);
        if (commonPrefix && commonPrefix !== lastPart) {
          parts[parts.length - 1] = commonPrefix;
          setInput(parts.join(' '));
        } else {
          setLines(prev => [...prev, { type: 'system', text: matches.join('  ') }]);
        }
      }
    }
  }, [input, process, historyIndex]);

  useEffect(() => {
    const timer = setTimeout(() => focusInput(), 50);
    return () => clearTimeout(timer);
  }, [focusInput]);

  return (
    <div
      className="flex flex-col h-full bg-[#0a0a0a] rounded-xl overflow-hidden border border-white/10"
      onClick={focusInput}
    >
      <TerminalHeader
        title="qyvora-terminal"
        onClose={onClose}
        onToggleFullscreen={onToggleFullscreen}
        isFullscreen={isFullscreen}
      />

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm leading-relaxed space-y-1"
        style={{ background: '#0a0a0a', scrollbarWidth: 'thin', scrollbarColor: '#1a1a1a transparent' }}
      >
        <TerminalOutput lines={lines} />

        <div className="flex items-center gap-2 mt-1">
          <span className="text-green-400 shrink-0 whitespace-nowrap text-xs">
            {getPrompt(stateRef.current)}
          </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-green-400/90 font-mono text-sm p-0 min-h-0 caret-green-400"
            autoFocus
            spellCheck={false}
            autoComplete="off"
            aria-label="Terminal input"
          />
        </div>
      </div>
    </div>
  );
};
