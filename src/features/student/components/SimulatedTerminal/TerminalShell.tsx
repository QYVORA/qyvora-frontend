import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Minimize2, Maximize2, X } from 'lucide-react';
import { createInitialState, processInput, getInputPrefix } from './engine/state';
import { streamOutput, hasStreamingOutput } from './engine/streaming';
import { injectBootcampContent } from './context/bootcampContent';
import { injectCourseContent } from './context/courseContent';
import type { TerminalState, TerminalLine, TerminalContext, VFSNode, ProcessInputResult } from './types';

const LS_KEY_LINES = 'qyvora_terminal_lines';
const LS_KEY_STATE = 'qyvora_terminal_state';

function saveTerminalData(lines: TerminalLine[], state: TerminalState) {
  try {
    localStorage.setItem(LS_KEY_LINES, JSON.stringify(lines));
    const serializable = {
      cwd: state.cwd,
      user: state.user,
      hostname: state.hostname,
      home: state.home,
      env: state.env,
      history: state.history,
      root: state.root,
      isRoot: state.isRoot,
      aliases: state.aliases,
      lastExitCode: state.lastExitCode,
      inMsfConsole: state.inMsfConsole,
      discoveredIps: state.discoveredIps,
    };
    localStorage.setItem(LS_KEY_STATE, JSON.stringify(serializable));
  } catch {}
}

function loadTerminalLines(): TerminalLine[] | null {
  try {
    const raw = localStorage.getItem(LS_KEY_LINES);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as TerminalLine[];
    return null;
  } catch {
    return null;
  }
}

function loadTerminalState(): TerminalState | null {
  try {
    const raw = localStorage.getItem(LS_KEY_STATE);
    if (!raw) return null;
    return JSON.parse(raw) as TerminalState;
  } catch {
    return null;
  }
}

export function clearTerminalStorage() {
  try {
    localStorage.removeItem(LS_KEY_LINES);
    localStorage.removeItem(LS_KEY_STATE);
  } catch {}
}

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
  const savedLines = useRef<TerminalLine[] | null>(loadTerminalLines());
  const savedState = useRef<TerminalState | null>(savedLines.current ? loadTerminalState() : null);

  const stateRef = useRef<TerminalState>(
    savedState.current ?? createInitialState(context),
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const streamingRef = useRef<boolean>(false);
  const streamingAbortRef = useRef<{ aborted: boolean } | null>(null);
  const tabTimingRef = useRef<{ time: number; prefix: string }>({ time: 0, prefix: '' });

  const [lines, setLines] = useState<TerminalLine[]>(() => {
    if (savedLines.current) {
      return savedLines.current;
    }

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

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveTerminalData(lines, stateRef.current);
    }, 300);
    return () => { if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current); };
  }, [lines]);

  const [input, setInput] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [streamingActive, setStreamingActive] = useState(false);

  const [promptTop] = useState('');

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

  const [reverseSearchActive, setReverseSearchActive] = useState(false);
  const [reverseSearchQuery, setReverseSearchQuery] = useState('');
  const [reverseSearchResults, setReverseSearchResults] = useState<number[]>([]);
  const [reverseSearchIdx, setReverseSearchIdx] = useState(-1);

  const isInitialRender = useRef(true);

  const process = useCallback(async (cmd: string) => {
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
      saveTerminalData([...lines, ...result.lines], result.newState);
      onClose?.();
      return;
    }

    stateRef.current = result.newState;

    if (result.streaming && hasStreamingOutput(result.streaming) && !isInitialRender.current) {
      streamingRef.current = true;
      setStreamingActive(true);
      const inputLine = result.lines[0];
      const streamingDescriptor = result.streaming;
      const finalState = result.newState;

      setLines(prev => [...prev, inputLine]);
      setHistoryIndex(-1);

      const signal = { aborted: false };
      streamingAbortRef.current = signal;

      let lastRevealed: string[] = [];
      let isFirstBatch = true;
      for await (const batch of streamOutput(streamingDescriptor, signal)) {
        if (signal.aborted) break;
        lastRevealed = batch;
        const joined = batch.join('\n');
        if (isFirstBatch) {
          setLines(prev => [...prev, { type: 'output', text: joined }]);
          isFirstBatch = false;
        } else {
          setLines(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = { type: 'output', text: joined };
            return updated;
          });
        }
      }

      if (signal.aborted) {
        const partialOutput = lastRevealed.join('\n');
        setLines(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { type: 'output', text: partialOutput };
          updated.push({ type: 'system', text: '^C' });
          return updated;
        });
        stateRef.current = { ...finalState, lastExitCode: 130 };
      }

      streamingRef.current = false;
      streamingAbortRef.current = null;
      setStreamingActive(false);
      saveTerminalData([], stateRef.current);
      setTimeout(() => focusInput(), 50);
    } else {
      setLines(prev => [...prev, ...result.lines]);
      setHistoryIndex(-1);
    }
  }, [onClose, lines]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'c') {
      e.preventDefault();
      e.stopPropagation();
      if (streamingRef.current && streamingAbortRef.current) {
        streamingAbortRef.current.aborted = true;
        return;
      }
      if (input) {
        setLines(prev => [...prev, { type: 'input', text: `${getInputPrefix(stateRef.current)}${input}^C` }]);
        setInput('');
      }
      return;
    }

    if (e.ctrlKey && e.key === 'a') {
      e.preventDefault();
      e.stopPropagation();
      inputRef.current?.setSelectionRange(0, 0);
      return;
    }

    if (e.ctrlKey && e.key === 'e') {
      e.preventDefault();
      e.stopPropagation();
      const len = input.length;
      inputRef.current?.setSelectionRange(len, len);
      return;
    }

    if (e.ctrlKey && e.key === 'u') {
      e.preventDefault();
      e.stopPropagation();
      setInput('');
      return;
    }

    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault();
      e.stopPropagation();
      const selStart = inputRef.current?.selectionStart || 0;
      setInput(input.slice(0, selStart));
      return;
    }

    if (e.ctrlKey && e.key === 'w') {
      e.preventDefault();
      e.stopPropagation();
      const selStart = inputRef.current?.selectionStart || input.length;
      const before = input.slice(0, selStart);
      const after = input.slice(selStart);
      const trimmed = before.replace(/\s*\S+$/, '');
      setInput(trimmed + after);
      return;
    }

    if (e.ctrlKey && e.key === 'r') {
      e.preventDefault();
      e.stopPropagation();
      if (!reverseSearchActive) {
        setReverseSearchActive(true);
        setReverseSearchQuery('');
        setReverseSearchResults([]);
        setReverseSearchIdx(-1);
      } else {
        const idx = reverseSearchIdx;
        const results = reverseSearchResults;
        if (results.length > 0) {
          const nextIdx = (idx - 1 + results.length) % results.length;
          setReverseSearchIdx(nextIdx);
          setInput(stateRef.current.history[results[nextIdx]]);
        }
      }
      return;
    }

    if (reverseSearchActive) {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        setReverseSearchActive(false);
        setReverseSearchQuery('');
        setReverseSearchResults([]);
        setReverseSearchIdx(-1);
        return;
      }
      if (e.key === 'Escape' || (e.ctrlKey && e.key === 'g')) {
        e.preventDefault();
        e.stopPropagation();
        setReverseSearchActive(false);
        setReverseSearchQuery('');
        setReverseSearchResults([]);
        setReverseSearchIdx(-1);
        setInput('');
        return;
      }
      if (e.key === 'Backspace') {
        e.preventDefault();
        e.stopPropagation();
        const newQuery = reverseSearchQuery.slice(0, -1);
        setReverseSearchQuery(newQuery);
        if (newQuery) {
          const results = stateRef.current.history
            .map((cmd, i) => ({ cmd, i }))
            .filter(({ cmd }) => cmd.includes(newQuery))
            .map(({ i }) => i);
          setReverseSearchResults(results);
          if (results.length > 0) {
            setReverseSearchIdx(results.length - 1);
            setInput(stateRef.current.history[results[results.length - 1]]);
          } else {
            setReverseSearchIdx(-1);
          }
        } else {
          setReverseSearchResults([]);
          setReverseSearchIdx(-1);
        }
        return;
      }
      if (e.key.length === 1) {
        e.preventDefault();
        e.stopPropagation();
        const newQuery = reverseSearchQuery + e.key;
        setReverseSearchQuery(newQuery);
        const results = stateRef.current.history
          .map((cmd, i) => ({ cmd, i }))
          .filter(({ cmd }) => cmd.includes(newQuery))
          .map(({ i }) => i);
        setReverseSearchResults(results);
        if (results.length > 0) {
          setReverseSearchIdx(results.length - 1);
          setInput(stateRef.current.history[results[results.length - 1]]);
        } else {
          setReverseSearchIdx(-1);
        }
        return;
      }
      return;
    }

    if (e.key === 'Enter') {
      if (streamingRef.current) return;
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
      if (!streamingRef.current) {
        setLines([]);
      }
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

      const now = Date.now();
      const isDoubleTab = (now - tabTimingRef.current.time < 500) && tabTimingRef.current.prefix === lastPart;
      tabTimingRef.current = { time: now, prefix: lastPart };

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
        if (commonPrefix && commonPrefix !== lastPart && !isDoubleTab) {
          parts[parts.length - 1] = commonPrefix;
          setInput(parts.join(' '));
        } else {
          setLines(prev => [...prev, { type: 'system', text: matches.join('  ') }]);
        }
      }
    }
  }, [input, process, historyIndex, promptTop, reverseSearchActive, reverseSearchQuery, reverseSearchResults, reverseSearchIdx]);

  useEffect(() => {
    const timer = setTimeout(() => focusInput(), 50);
    return () => clearTimeout(timer);
  }, [focusInput]);

  useEffect(() => {
    isInitialRender.current = false;
  }, []);

  const prefix = getInputPrefix(stateRef.current);

  return (
    <div className="flex flex-col h-full" style={{ background: KALI_BG }}>
      <div
        className="flex items-center justify-between px-2.5 py-1 shrink-0 border-b"
        style={{ background: KALI_TITLE_BG, borderColor: KALI_BORDER }}
      >
        <span className="text-[10px] font-mono text-white/30 tracking-[0.12em] select-none">_terminal <span className="text-white/20">v2.0 — type "help"</span></span>
        <div className="flex items-center gap-1">
          <button
            onClick={onToggleFullscreen}
            className="flex items-center justify-center h-8 w-8 md:h-5 md:w-5 rounded-lg hover:bg-white/5 transition-all focus:outline-none text-white/30 hover:text-white/60"
            aria-label={isFullscreen ? 'Minimize' : 'Maximize'}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button
            onClick={() => { saveTerminalData(lines, stateRef.current); onClose?.(); }}
            className="flex items-center justify-center h-8 w-8 md:h-5 md:w-5 rounded-lg hover:bg-white/5 transition-all focus:outline-none text-white/30 hover:text-red-400"
            aria-label="Close terminal"
          >
            <X size={14} />
          </button>
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
          const baseOpacity: number | undefined = line.type === 'system' ? 0.5 : 1;
          if (line.type === 'output') {
            const subLines = line.text.split('\n');
            return (
              <div key={i}>
                {subLines.map((sub, j) => {
                  let c = KALI_OUTPUT;
                  if (sub.endsWith('/')) c = KALI_DIR;
                  else if (sub.endsWith('*')) c = KALI_EXEC;
                  return (
                    <div key={j} style={{ color: c }} className="whitespace-pre-wrap">
                      {sub}
                    </div>
                  );
                })}
              </div>
            );
          }
          let color = KALI_GREEN;
          if (line.type === 'error') color = KALI_ERROR;
          else if (line.type === 'prompt') color = KALI_GREEN;
          else if (line.type === 'system') color = KALI_SYSTEM;
          else if (line.type !== 'input') color = KALI_OUTPUT;
          return (
            <div
              key={i}
              style={{ color, opacity: baseOpacity }}
              className="whitespace-pre-wrap"
            >
              {line.text}
            </div>
          );
        })}
        {streamingActive && (
          <div style={{ color: KALI_GREEN }} className="whitespace-pre-wrap">
            <span className="inline-block w-2 h-4 bg-current animate-pulse" />
          </div>
        )}
        {!streamingActive && (
          <div className="flex items-center" style={{ color: KALI_GREEN }}>
            <span className="shrink-0 whitespace-nowrap leading-relaxed">{prefix}</span>
            {reverseSearchActive && (
              <span className="shrink-0 whitespace-nowrap leading-relaxed text-[#ffbd2e] mr-1">
                (reverse-i-search)`{reverseSearchQuery}':
              </span>
            )}
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none font-mono text-sm p-0 m-0 min-h-0 h-auto leading-relaxed ml-1.5"
              style={{ color: KALI_GREEN, caretColor: KALI_CURSOR }}
              spellCheck={false}
              autoComplete="off"
              autoFocus
              aria-label="Terminal input"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TerminalShell;
