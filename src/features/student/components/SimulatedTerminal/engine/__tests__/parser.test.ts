import { describe, it, expect } from 'vitest';
import { parse, expandVars, expandHistory, applyGlobbing } from '../parser';
import { createNode } from '../filesystem';
import type { TerminalState } from '../../types';

function makeState(overrides: Partial<TerminalState> = {}): TerminalState {
  return {
    cwd: '/home/kali',
    user: 'kali',
    hostname: 'kali',
    home: '/home/kali',
    env: { PATH: '/usr/bin', HOME: '/home/kali' },
    history: [],
    historyIndex: -1,
    root: createNode('/', 'dir'),
    isRoot: false,
    aliases: {},
    lastExitCode: 0,
    discoveredIps: [],
    ...overrides,
  };
}

describe('parser', () => {
  describe('expandVars', () => {
    it('expands $HOME', () => {
      const state = makeState({ env: { HOME: '/home/kali' } });
      expect(expandVars('$HOME', state)).toBe('/home/kali');
    });

    it('expands $?', () => {
      const state = makeState({ lastExitCode: 42 });
      expect(expandVars('$?', state)).toBe('42');
    });

    it('expands unknown var to empty', () => {
      const state = makeState();
      expect(expandVars('$UNKNOWN', state)).toBe('');
    });

    it('expands multiple vars', () => {
      const state = makeState({ env: { A: 'hello', B: 'world' } });
      expect(expandVars('$A $B', state)).toBe('hello world');
    });
  });

  describe('expandHistory', () => {
    it('expands !! to last command', () => {
      const state = makeState({ history: ['ls -la', 'pwd'] });
      expect(expandHistory('!!', state)).toBe('pwd');
    });

    it('expands !N to Nth command', () => {
      const state = makeState({ history: ['ls', 'pwd', 'cat file'] });
      expect(expandHistory('!2', state)).toBe('pwd');
    });

    it('returns input if history is empty', () => {
      const state = makeState({ history: [] });
      expect(expandHistory('!!', state)).toBe('!!');
    });

    it('returns input for non-history commands', () => {
      const state = makeState({ history: ['ls'] });
      expect(expandHistory('pwd', state)).toBe('pwd');
    });
  });

  describe('parse', () => {
    it('parses simple command', () => {
      const result = parse('ls -la');
      expect(result).not.toBeNull();
      expect(result!.stage.command).toBe('ls');
      expect(result!.stage.args).toEqual(['-la']);
    });

    it('parses command with no args', () => {
      const result = parse('pwd');
      expect(result).not.toBeNull();
      expect(result!.stage.command).toBe('pwd');
      expect(result!.stage.args).toEqual([]);
    });

    it('returns null for empty input', () => {
      expect(parse('')).toBeNull();
      expect(parse('  ')).toBeNull();
    });

    it('parses pipe chain', () => {
      const result = parse('cat file | grep pattern');
      expect(result).not.toBeNull();
      expect(result!.stage.command).toBe('cat');
      expect(result!.stage.args).toEqual(['file']);
      expect(result!.stage.pipeToNext).toBe(true);
      expect(result!.next?.stage.command).toBe('grep');
      expect(result!.next?.stage.args).toEqual(['pattern']);
    });

    it('parses && operator', () => {
      const result = parse('cmd1 && cmd2');
      expect(result).not.toBeNull();
      expect(result!.stage.command).toBe('cmd1');
      expect(result!.operator).toBe('&&');
      expect(result!.next?.stage.command).toBe('cmd2');
    });

    it('parses || operator', () => {
      const result = parse('cmd1 || cmd2');
      expect(result).not.toBeNull();
      expect(result!.stage.command).toBe('cmd1');
      expect(result!.operator).toBe('||');
      expect(result!.next?.stage.command).toBe('cmd2');
    });

    it('parses ; operator', () => {
      const result = parse('cmd1 ; cmd2');
      expect(result).not.toBeNull();
      expect(result!.stage.command).toBe('cmd1');
      expect(result!.operator).toBe(';');
      expect(result!.next?.stage.command).toBe('cmd2');
    });

    it('parses output redirect >', () => {
      const result = parse('echo hello > file.txt');
      expect(result).not.toBeNull();
      expect(result!.stage.command).toBe('echo');
      expect(result!.stage.stdoutRedirect).toEqual({ path: 'file.txt', append: false });
    });

    it('parses output redirect >>', () => {
      const result = parse('echo hello >> file.txt');
      expect(result).not.toBeNull();
      expect(result!.stage.stdoutRedirect).toEqual({ path: 'file.txt', append: true });
    });

    it('parses input redirect <', () => {
      const result = parse('grep pattern < file.txt');
      expect(result).not.toBeNull();
      expect(result!.stage.stdinRedirect).toEqual({ path: 'file.txt' });
    });

    it('handles single quotes', () => {
      const result = parse("echo 'hello world'");
      expect(result).not.toBeNull();
      expect(result!.stage.args).toEqual(['hello world']);
    });

    it('handles double quotes', () => {
      const result = parse('echo "hello world"');
      expect(result).not.toBeNull();
      expect(result!.stage.args).toEqual(['hello world']);
    });

    it('handles backslash escape', () => {
      const result = parse('echo hello\\ world');
      expect(result).not.toBeNull();
      expect(result!.stage.args).toEqual(['hello world']);
    });
  });

  describe('applyGlobbing', () => {
    it('returns args unchanged when no glob patterns', () => {
      const state = makeState();
      const result = applyGlobbing(['file.txt'], state, '/home/kali', '/home/kali');
      expect(result).toEqual(['file.txt']);
    });
  });
});
