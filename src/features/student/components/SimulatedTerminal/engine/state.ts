import type { TerminalState, TerminalContext, TerminalLine } from '../types';
import { buildDefaultFilesystem } from '../data/defaultFilesystem';
import { executeCommand } from './commands';

export function createInitialState(context?: TerminalContext): TerminalState {
  const root = buildDefaultFilesystem();

  return {
    cwd: '/home/qyvora-student',
    user: 'qyvora-student',
    hostname: 'qyvora-sandbox',
    home: '/home/qyvora-student',
    env: {
      PATH: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
      HOME: '/home/qyvora-student',
      USER: 'qyvora-student',
      SHELL: '/bin/bash',
      TERM: 'xterm-256color',
      EDITOR: 'nano',
      LANG: 'en_US.UTF-8',
      PS1: '\\u@\\h:\\w\\$ ',
    },
    history: [],
    historyIndex: -1,
    root,
    isRoot: false,
    aliases: {
      ll: 'ls -la',
      la: 'ls -A',
      grep: 'grep --color=auto',
    },
    lastExitCode: 0,
  };
}

export function processInput(
  input: string,
  state: TerminalState,
): { lines: TerminalLine[]; newState: TerminalState } {
  const trimmed = input.trim();
  if (!trimmed) return { lines: [], newState: state };

  const lines: TerminalLine[] = [];

  const expanded = state.aliases[trimmed.split(' ')[0]]
    ? trimmed.replace(/^\S+/, state.aliases[trimmed.split(' ')[0]])
    : trimmed;

  const result = executeCommand(expanded, state);

  lines.push({ type: 'input', text: `$ ${trimmed}` });
  if (result.output) lines.push({ type: 'output', text: result.output });
  if (result.error) lines.push({ type: 'error', text: result.error });

  const newState: TerminalState = {
    ...state,
    history: [...state.history, trimmed],
    historyIndex: -1,
    lastExitCode: result.exitCode,
  };

  return { lines, newState };
}

export function getPrompt(state: TerminalState): string {
  const cwdDisplay = state.cwd === state.home ? '~' : state.cwd.replace(state.home, '~');
  const indicator = state.isRoot ? '#' : '$';
  return `${state.user}@${state.hostname}:${cwdDisplay}${indicator} `;
}
