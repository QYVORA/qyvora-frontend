import type { CommandHandler, VFSNode, TerminalState } from '../../types';
import { findNode, resolvePath, pathBasename, pathDirname } from '../filesystem';

export interface ParsedFlags {
  flags: Set<string>;
  positional: string[];
}

export function parseFlags(args: string[]): ParsedFlags {
  const flags = new Set<string>();
  const positional: string[] = [];

  for (const arg of args) {
    if (arg === '--') {
      positional.push(...args.slice(args.indexOf(arg) + 1));
      break;
    }
    if (arg.startsWith('--') && arg.length > 2) {
      flags.add(arg);
    } else if (arg.startsWith('-') && arg.length > 1 && !arg.match(/^-?\d/)) {
      for (let i = 1; i < arg.length; i++) {
        flags.add('-' + arg[i]);
      }
    } else {
      positional.push(arg);
    }
  }

  return { flags, positional };
}

export function hasFlag(flags: Set<string>, ...names: string[]): boolean {
  return names.some(n => flags.has(n));
}

export function getFlagValue(args: string[], flag: string): string | undefined {
  const idx = args.indexOf(flag);
  if (idx === -1 || idx >= args.length - 1) return undefined;
  return args[idx + 1];
}

export function resolveFile(
  state: TerminalState,
  filepath: string,
): VFSNode | null {
  return findNode(state.root, filepath, state.cwd, state.home);
}

export function requireFile(
  state: TerminalState,
  filepath: string,
  cmd: string,
): { node: VFSNode } | { error: string; exitCode: number } {
  const node = findNode(state.root, filepath, state.cwd, state.home);
  if (!node) return { error: `${cmd}: ${filepath}: No such file or directory`, exitCode: 1 };
  return { node };
}

export function requireFileOrDir(
  state: TerminalState,
  filepath: string,
  cmd: string,
): { node: VFSNode } | { error: string; exitCode: number } {
  const node = findNode(state.root, filepath, state.cwd, state.home);
  if (!node) return { error: `${cmd}: cannot access '${filepath}': No such file or directory`, exitCode: 1 };
  return { node };
}

export function getParentPath(
  state: TerminalState,
  filepath: string,
): { parentPath: string; name: string } {
  const resolved = resolvePath(filepath, state.cwd, state.home);
  return {
    parentPath: pathDirname(resolved),
    name: pathBasename(resolved),
  };
}
