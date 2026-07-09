import type { TerminalState, TerminalContext, TerminalLine, PipelineStage } from '../types';
import { buildDefaultFilesystem } from '../data/defaultFilesystem';
import { executeCommandInternal } from './commands';
import { parse, expandHistory, expandVars, applyGlobbing, executeSequence } from './parser';
import { resolvePath, findNode, addChild, updateNodeAtPath } from './filesystem';
import { pathBasename, pathDirname } from './filesystem';

export function createInitialState(context?: TerminalContext): TerminalState {
  const root = buildDefaultFilesystem();

  return {
    cwd: '/home/kali',
    user: 'kali',
    hostname: 'kali',
    home: '/home/kali',
    env: {
      PATH: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
      HOME: '/home/kali',
      USER: 'kali',
      SHELL: '/bin/bash',
      TERM: 'xterm-256color',
      EDITOR: 'nano',
      LANG: 'en_US.UTF-8',
      PS1: '\\[\\033[01;32m\\]\\u@\\h\\[\\033[00m\\]:\\[\\033[01;34m\\]\\w\\[\\033[00m\\]\\$ ',
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

function executeStage(
  stage: PipelineStage,
  state: TerminalState,
): { result: ReturnType<typeof executeCommandInternal>; newState: TerminalState } {
  let currentState = state;

  if (stage.stdinRedirect) {
    const node = findNode(currentState.root, stage.stdinRedirect.path, currentState.cwd, currentState.home);
    if (node && node.content !== undefined) {
      stage = { ...stage, stdin: node.content };
    } else {
      return {
        result: { output: '', error: `bash: ${stage.stdinRedirect.path}: No such file or directory`, exitCode: 1 },
        newState: currentState,
      };
    }
  }

  const globbedArgs = applyGlobbing(stage.args, currentState, currentState.cwd, currentState.home);
  stage = { ...stage, args: globbedArgs };

  const result = executeCommandInternal(stage, currentState) as ReturnType<typeof executeCommandInternal> & { _stateOverride?: any };

  let newState = currentState;
  if (result._stateOverride) {
    newState = { ...currentState, ...result._stateOverride };
  }

  if (stage.stdoutRedirect) {
    const outputContent = result.output || '';
    const resolvedPath = resolvePath(stage.stdoutRedirect.path, currentState.cwd, currentState.home);
    const parentPath = pathDirname(resolvedPath);
    const name = pathBasename(resolvedPath);
    const parentNode = findNode(newState.root, parentPath, '/', newState.home);

    if (parentNode && parentNode.type === 'dir') {
      const existing = parentNode.children.find(c => c.name === name);
      if (existing) {
        if (stage.stdoutRedirect.append) {
          existing.content = (existing.content || '') + outputContent;
        } else {
          existing.content = outputContent;
        }
      } else {
        parentNode.children.push({
          name,
          type: 'file',
          content: outputContent,
          permissions: '-rw-r--r--',
          owner: newState.user,
          group: newState.user,
          size: outputContent.length,
          children: [],
        });
      }
    }

    return {
      result: { output: '', exitCode: result.exitCode },
      newState,
    };
  }

  return { result, newState };
}

export function processInput(
  input: string,
  state: TerminalState,
): { lines: TerminalLine[]; newState: TerminalState; _clearLine?: boolean; _exit?: boolean } {
  const trimmed = input.trim();
  if (!trimmed) return { lines: [], newState: state };

  const lines: TerminalLine[] = [];

  const historyExpanded = expandHistory(trimmed, state);

  const aliasExpanded = state.aliases[historyExpanded.split(' ')[0]]
    ? historyExpanded.replace(/^\S+/, state.aliases[historyExpanded.split(' ')[0]])
    : historyExpanded;

  const parsed = parse(aliasExpanded);

  if (!parsed) {
    return { lines: [], newState: state };
  }

  let currentState = state;
  let finalOutput = '';
  let finalError = '';
  let finalExitCode = 0;

  executeSequence(parsed, currentState, executeStage);

  let seqPtr: typeof parsed | undefined = parsed;
  while (seqPtr) {
    const { result, newState } = executeStage(seqPtr.stage, currentState);
    currentState = newState;

    if (result.output) finalOutput = (finalOutput ? finalOutput + '\n' : '') + result.output;
    if (result.error) finalError = (finalError ? finalError + '\n' : '') + result.error;
    finalExitCode = result.exitCode;

    if (result.streamLines) {
      finalOutput = result.streamLines.join('\n');
    }

    if (seqPtr.operator === '&&' && finalExitCode !== 0) break;
    if (seqPtr.operator === '||' && finalExitCode === 0) break;

    seqPtr = seqPtr.next || undefined;
  }

  lines.push({ type: 'input', text: `${getInputPrefix(state)}${trimmed}` });
  if (finalOutput) lines.push({ type: 'output', text: finalOutput });
  if (finalError) lines.push({ type: 'error', text: finalError });

  const newState: TerminalState = {
    ...currentState,
    history: [...currentState.history, trimmed],
    historyIndex: -1,
    lastExitCode: finalExitCode,
  };

  const lastResult = (() => {
    let ptr = parsed;
    while (ptr.next) ptr = ptr.next;
    return executeStage(ptr.stage, currentState);
  })();

  return {
    lines,
    newState,
    _clearLine: (lastResult.result as any)._clearLine,
    _exit: (lastResult.result as any)._exit,
  };
}

export function getPrompt(state: TerminalState): string {
  const cwdDisplay = state.cwd === state.home ? '~' : state.cwd.replace(state.home, '~');
  const indicator = state.isRoot ? '#' : '$';
  return `┌──(${state.user}㉿${state.hostname})-[${cwdDisplay}]\n└─${indicator} `;
}

export function getInputPrefix(state: TerminalState): string {
  const indicator = state.isRoot ? '#' : '$';
  if (state.inMsfConsole) return 'msf6 > ';
  return `└─${indicator} `;
}
