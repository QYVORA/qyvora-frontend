import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createInitialState, processInput, getPrompt } from './engine/state';
import { injectBootcampContent } from './context/bootcampContent';
import { injectCourseContent } from './context/courseContent';
import type { TerminalState, TerminalLine, TerminalContext, VFSNode } from './types';

function collectTabMatches(root: VFSNode, lastPart: string): string[] {
  const matches: string[] = [];
  function walk(node: VFSNode) {
    if (node.children) {
      node.children.forEach((child: VFSNode) => {
        if (child.name.startsWith(lastPart)) {
          matches.push(child.name + (child.type === 'dir' ? '/' : ''));
        }
        if (child.type === 'dir') {
          walk(child);
        }
      });
    }
  }
  walk(root);
  return matches;
}

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
  }, [lines, input]);

  const process = useCallback((cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const result = processInput(trimmed, stateRef.current);

    if (result._clearLine) {
      stateRef.current = result.newState;
      setLines([]);
      return;
    }

    if (result._exit) {
      stateRef.current = result.newState;
      setLines(prev => [...prev, ...result.lines]);
      return;
    }

    stateRef.current = result.newState;
    setLines(prev => [...prev, ...result.lines]);
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

      const matches = collectTabMatches(stateRef.current.root, lastPart);

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

  const prompt = getPrompt(stateRef.current);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#152238] shrink-0">
        <button
          onClick={onClose}
          className="h-2.5 w-2.5 min-h-0 rounded-full bg-[#ff5555] hover:brightness-125 transition-all focus:outline-none"
          aria-label="Close terminal"
        />
        <button
          onClick={onToggleFullscreen}
          className="h-2.5 w-2.5 min-h-0 rounded-full bg-[#ffbd2e] hover:brightness-125 transition-all focus:outline-none"
          aria-label={isFullscreen ? 'Minimize' : 'Maximize'}
        />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840] opacity-80" />
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-3 py-2 font-mono text-sm leading-relaxed"
        style={{
          background: '#221b30',
          scrollbarWidth: 'thin',
          scrollbarColor: '#3d2e5c transparent',
        }}
        onClick={focusInput}
      >
        {lines.map((line, i) => (
          <div
            key={i}
            className={`whitespace-pre-wrap break-all ${
              line.type === 'input'
                ? 'text-[#33ff00]'
                : line.type === 'output'
                ? 'text-[#e6edf3]'
                : line.type === 'error'
                ? 'text-[#ff5555]'
                : line.type === 'prompt'
                ? 'text-[#33ff00]'
                : 'text-[#e6edf3]/50'
            }`}
          >
            {line.text}
          </div>
        ))}
        <div className="flex items-center text-[#33ff00]">
          <span className="shrink-0 whitespace-nowrap">{prompt}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-[#33ff00] font-mono text-sm p-0 m-0 min-h-0 h-auto leading-normal caret-[#33ff00]"
            spellCheck={false}
            autoComplete="off"
            autoFocus
            aria-label="Terminal input"
          />
          <span className="w-2 h-4 bg-[#33ff00] animate-pulse shrink-0" />
        </div>
      </div>
    </div>
  );
};

export default TerminalShell;
