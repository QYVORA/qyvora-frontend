import type { TerminalState, PipelineStage } from '../types';
import { resolvePath, findNode } from './filesystem';

export interface ParsedSequence {
  stage: PipelineStage;
  operator?: '&&' | '||' | ';' | '|';
  next?: ParsedSequence;
}

export function expandVars(arg: string, state: TerminalState): string {
  return arg.replace(/\$(\w+|\?)/g, (match, varName) => {
    if (varName === '?') return String(state.lastExitCode);
    return state.env[varName] || '';
  });
}

export function expandHistory(input: string, state: TerminalState): string {
  if (input === '!!') {
    if (state.history.length === 0) return input;
    return state.history[state.history.length - 1];
  }
  const bangN = input.match(/^!(\d+)$/);
  if (bangN) {
    const idx = parseInt(bangN[1], 10) - 1;
    if (idx >= 0 && idx < state.history.length) {
      return state.history[idx];
    }
    return input;
  }
  return input;
}

function expandGlob(pattern: string, state: TerminalState, cwd: string, home: string): string[] {
  if (!pattern.includes('*') && !pattern.includes('?') && !pattern.includes('[')) {
    return [pattern];
  }
  const dir = pattern.includes('/') ? pattern.substring(0, pattern.lastIndexOf('/')) : '.';
  const baseName = pattern.includes('/') ? pattern.substring(pattern.lastIndexOf('/') + 1) : pattern;
  const resolvedDir = resolvePath(dir, cwd, home);
  const dirNode = findNode(state.root, resolvedDir, '/', home);
  if (!dirNode || dirNode.type !== 'dir') return [pattern];

  const regexStr = '^' + baseName
    .replace(/\./g, '\\.')
    .replace(/\*/g, '.*')
    .replace(/\?/g, '.')
    .replace(/\[/g, '[')
    + '$';
  const regex = new RegExp(regexStr);

  const prefix = dir === '.' ? '' : dir.endsWith('/') ? dir : dir + '/';
  const matches = dirNode.children
    .filter(c => regex.test(c.name) && !c.name.startsWith('.'))
    .map(c => prefix + c.name + (c.type === 'dir' ? '/' : ''));

  return matches.length > 0 ? matches.sort() : [pattern];
}

export function applyGlobbing(args: string[], state: TerminalState, cwd: string, home: string): string[] {
  const result: string[] = [];
  for (const arg of args) {
    result.push(...expandGlob(arg, state, cwd, home));
  }
  return result;
}

function tokenize(input: string): string[] {
  const tokens: string[] = [];
  let current = '';
  let inSingle = false;
  let inDouble = false;
  let escape = false;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];

    if (escape) {
      current += ch;
      escape = false;
      continue;
    }

    if (ch === '\\' && inSingle) {
      current += ch;
      continue;
    }
    if (ch === '\\' && !inSingle) {
      escape = true;
      continue;
    }

    if (ch === "'" && !inDouble) {
      inSingle = !inSingle;
      continue;
    }
    if (ch === '"' && !inSingle) {
      inDouble = !inDouble;
      continue;
    }

    if (inSingle || inDouble) {
      current += ch;
      continue;
    }

    if (ch === ' ' || ch === '\t') {
      if (current) {
        tokens.push(current);
        current = '';
      }
      continue;
    }

    if (ch === '|' || ch === ';' || ch === '&') {
      if (current) {
        tokens.push(current);
        current = '';
      }
      if (ch === '&' && input[i + 1] === '&') {
        tokens.push('&&');
        i++;
      } else if (ch === '|' && input[i + 1] === '|') {
        tokens.push('||');
        i++;
      } else {
        tokens.push(ch);
      }
      continue;
    }

    if (ch === '>' || ch === '<') {
      if (current) {
        tokens.push(current);
        current = '';
      }
      if (ch === '>' && input[i + 1] === '>') {
        tokens.push('>>');
        i++;
      } else {
        tokens.push(ch);
      }
      continue;
    }

    current += ch;
  }

  if (current) tokens.push(current);

  return tokens;
}

function splitByFirstOf(tokens: string[], ops: string[]): { left: string[]; operator?: string; right: string[] } {
  const idx = tokens.findIndex(t => ops.includes(t));
  if (idx === -1) return { left: tokens, right: [] };
  return {
    left: tokens.slice(0, idx),
    operator: tokens[idx],
    right: tokens.slice(idx + 1),
  };
}

function buildStageFromTokens(tokens: string[], stdin?: string): PipelineStage {
  const redirSplit = splitByFirstOf(tokens, ['>', '>>', '<']);
  let cmdTokens = redirSplit.left;
  let stdoutRedirect: { path: string; append: boolean } | undefined;
  let stdinRedirect: { path: string } | undefined;

  if (redirSplit.operator === '>' || redirSplit.operator === '>>') {
    stdoutRedirect = { path: redirSplit.right.join(' '), append: redirSplit.operator === '>>' };
  } else if (redirSplit.operator === '<') {
    stdinRedirect = { path: redirSplit.right.join(' ') };
    const further = splitByFirstOf(cmdTokens, ['>', '>>']);
    if (further.operator === '>' || further.operator === '>>') {
      cmdTokens = further.left;
      stdoutRedirect = { path: further.right.join(' '), append: further.operator === '>>' };
    }
  }

  const cmd = cmdTokens[0] || '';
  const args = cmdTokens.slice(1);

  return {
    command: cmd,
    args,
    stdin,
    stdoutRedirect,
    stdinRedirect,
    pipeToNext: false,
  };
}

export function parse(input: string): ParsedSequence | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const tokens = tokenize(trimmed);

  const seqOp = splitByFirstOf(tokens, ['&&', '||', ';']);
  const pipeSplit = splitByFirstOf(seqOp.left, ['|']);

  const firstStage = buildStageFromTokens(pipeSplit.left);

  if (pipeSplit.operator === '|') {
    firstStage.pipeToNext = true;
    const pipeResult = parsePipeChain(pipeSplit.right, firstStage);
    if (seqOp.operator && seqOp.right.length > 0) {
      const rightSeq = parse(seqOp.right.join(' '));
      return {
        stage: pipeResult.stage,
        operator: seqOp.operator as '&&' | '||' | ';',
        next: rightSeq || undefined,
      };
    }
    return pipeResult;
  }

  if (seqOp.operator && seqOp.right.length > 0) {
    const rightTokens = seqOp.right;
    const rightSeq = parse(rightTokens.join(' '));
    return {
      stage: firstStage,
      operator: seqOp.operator as '&&' | '||' | ';',
      next: rightSeq || undefined,
    };
  }

  return { stage: firstStage };
}

function parsePipeChain(tokens: string[], leftStage: PipelineStage): ParsedSequence {
  const pipeSplit = splitByFirstOf(tokens, ['|']);
  const stage = buildStageFromTokens(pipeSplit.left);

  if (pipeSplit.operator === '|') {
    stage.pipeToNext = true;
    const rest = parsePipeChain(pipeSplit.right, stage);
    return {
      stage: leftStage,
      operator: '|',
      next: rest,
    };
  }

  return {
    stage: leftStage,
    operator: '|',
    next: { stage },
  };
}

export function executeSequence(
  seq: ParsedSequence,
  state: TerminalState,
  execFn: (stage: PipelineStage, state: TerminalState) => { result: ReturnType<typeof import('./commands').executeCommandInternal>; newState: TerminalState },
): { finalState: TerminalState; output: string; error?: string; exitCode: number } {
  let currentState = state;
  let output = '';
  let error = '';
  let exitCode = 0;

  let seqPtr: ParsedSequence | undefined = seq;

  while (seqPtr) {
    const { result, newState } = execFn(seqPtr.stage, currentState);
    currentState = newState;

    if (result.output) output += (output ? '\n' : '') + result.output;
    if (result.error) error += (error ? '\n' : '') + result.error;
    exitCode = result.exitCode;

    if (seqPtr.operator === '&&' && exitCode !== 0) break;
    if (seqPtr.operator === '||' && exitCode === 0) break;

    seqPtr = seqPtr.next;
  }

  return { finalState: currentState, output, error, exitCode };
}
