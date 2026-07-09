import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createInitialState, processInput, getInputPrefix } from './engine/state';
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

const KALI_BG = '#0c0c0c';
const KALI_GREEN = '#00ff41';
const KALI_OUTPUT = '#d4d4d4';
const KALI_ERROR = '#ff3333';
const KALI_SYSTEM = '#d4d4d4';
const KALI_CURSOR = '#00ff41';
const KALI_TITLE_BG = '#1a1a1a';
const KALI_BORDER = '#2a2a2a';
const KALI_DIR = '#569cd6';
const KALI_EXEC = '#00ff41';

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
    let state = stateRef.current;

    if (context?.type === 'bootcamp' && context.bootcampId) {
      state = injectBootcampContent(state, context.bootcampId, context.phaseId, context.roomId);
    }
    if (context?.type === 'course' && context.courseId) {
      state = injectCourseContent(state, context.courseId, context.lessonId);
    }

    stateRef.current = state;

    const initial: TerminalLine[] = [];

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

  const getPromptTop = useCallback((s: TerminalState) => {
    const cwdDisplay = s.cwd === s.home ? '~' : s.cwd.replace(s.home, '~');
    return `┌──(${s.user}㉿${s.hostname})-[${cwdDisplay}]`;
  }, []);

  const [promptTop, setPromptTop] = useState(() => getPromptTop(stateRef.current));

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight;
      });
    }
  }, [lines]);

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight;
      });
    }
  }, []);

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
      onClose?.();
      return;
    }

    stateRef.current = result.newState;
    setLines(prev => [...prev, ...result.lines]);
    setPromptTop(getPromptTop(result.newState));
    setHistoryIndex(-1);
  }, [onClose, getPromptTop]);

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
      e.stopPropagation();
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

  const prefix = getInputPrefix(stateRef.current);

  return (
    <div className="flex flex-col h-full" style={{ background: KALI_BG }}>
      <div
        className="flex items-center justify-between px-3 py-1 shrink-0 border-b"
        style={{ background: KALI_TITLE_BG, borderColor: KALI_BORDER }}
      >
        <span className="text-[10px] font-mono text-white/30 tracking-[0.12em] select-none">_terminal <span className="text-white/20">v2.0 — type "help"</span></span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={onClose}
            className="h-2.5 w-2.5 min-h-0 min-w-0 shrink-0 rounded-full bg-[#ff5f56] hover:brightness-125 transition-all focus:outline-none"
            aria-label="Close terminal"
          />
          <button
            onClick={onToggleFullscreen}
            className="h-2.5 w-2.5 min-h-0 min-w-0 shrink-0 rounded-full bg-[#ffbd2e] hover:brightness-125 transition-all focus:outline-none"
            aria-label={isFullscreen ? 'Minimize' : 'Maximize'}
          />
          <span className="h-2.5 w-2.5 min-h-0 min-w-0 shrink-0 rounded-full bg-[#27c93f]" />
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-3 pb-4 pt-1 font-mono text-sm leading-relaxed overscroll-contain"
        style={{
          background: KALI_BG,
          scrollbarWidth: 'thin',
          scrollbarColor: `${KALI_BORDER} transparent`,
        }}
        onClick={focusInput}
      >
        {lines.map((line, i) => {
          let color = KALI_OUTPUT;
          let opacity: number | undefined = 1;
          switch (line.type) {
            case 'input': color = KALI_GREEN; break;
            case 'output': {
              const t = line.text;
              if (t.endsWith('/')) color = KALI_DIR;
              else if (t.endsWith('*')) color = KALI_EXEC;
              else color = KALI_OUTPUT;
              break;
            }
            case 'error': color = KALI_ERROR; break;
            case 'prompt': color = KALI_GREEN; break;
            case 'system': color = KALI_SYSTEM; opacity = 0.5; break;
          }
          return (
            <div
              key={i}
              style={{ color, opacity }}
              className="whitespace-pre-wrap"
            >
              {line.text}
            </div>
          );
        })}
        <div style={{ color: KALI_GREEN }} className="whitespace-pre-wrap leading-relaxed">
          {promptTop}
        </div>
        <div className="flex items-center" style={{ color: KALI_GREEN }}>
          <span className="shrink-0 whitespace-nowrap leading-relaxed">{prefix}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none font-mono text-sm p-0 m-0 min-h-0 h-auto leading-relaxed ml-0"
            style={{ color: KALI_GREEN, caretColor: KALI_CURSOR }}
            spellCheck={false}
            autoComplete="off"
            autoFocus
            aria-label="Terminal input"
          />
        </div>
      </div>
    </div>
  );
};

export default TerminalShell;
