import { describe, it, expect, beforeEach } from 'vitest';
import { touch, mkdir, rm, cp, mv, chmod, cat, echo } from '../handlers/files';
import { chown, sudo } from '../handlers/system';
import { createNode, findNode, addChild } from '../filesystem';
import type { TerminalState, VFSNode, CommandResult } from '../../types';

type HandlerResult = CommandResult & { stateOverride?: { root?: VFSNode } };

function makeState(root?: VFSNode): TerminalState {
  const defaultRoot = createNode('/', 'dir', {
    children: [
      createNode('home', 'dir', {
        children: [
          createNode('kali', 'dir', {
            children: [
              createNode('.bashrc', 'file', { content: 'alias ll="ls -la"' }),
              createNode('welcome.txt', 'file', { content: 'Hello World' }),
            ],
          }),
        ],
      }),
      createNode('etc', 'dir', {
        children: [
          createNode('hostname', 'file', { content: 'kali' }),
        ],
      }),
    ],
  });

  return {
    cwd: '/home/kali',
    user: 'kali',
    hostname: 'kali',
    home: '/home/kali',
    env: { PATH: '/usr/bin', HOME: '/home/kali' },
    history: [],
    historyIndex: -1,
    root: root || defaultRoot,
    isRoot: false,
    aliases: {},
    lastExitCode: 0,
    discoveredIps: [],
  };
}

describe('file handlers (immutable)', () => {
  describe('touch', () => {
    it('creates a new file', () => {
      const state = makeState();
      const result = touch(['newfile.txt'], state) as HandlerResult;
      expect(result.exitCode).toBe(0);
      expect(result.stateOverride?.root).toBeDefined();
      const newFile = findNode(result.stateOverride!.root!, '/home/kali/newfile.txt', '/home/kali', '/home/kali');
      expect(newFile).not.toBeNull();
      expect(newFile!.type).toBe('file');
    });

    it('does not mutate original state', () => {
      const state = makeState();
      touch(['newfile.txt'], state);
      const original = findNode(state.root, '/home/kali/newfile.txt', '/home/kali', '/home/kali');
      expect(original).toBeNull();
    });

    it('returns error with no args', () => {
      const state = makeState();
      const result = touch([], state);
      expect(result.exitCode).toBe(1);
      expect(result.error).toContain('missing file operand');
    });
  });

  describe('mkdir', () => {
    it('creates a new directory', () => {
      const state = makeState();
      const result = mkdir(['newdir'], state) as HandlerResult;
      expect(result.exitCode).toBe(0);
      const newDir = findNode(result.stateOverride!.root!, '/home/kali/newdir', '/home/kali', '/home/kali');
      expect(newDir).not.toBeNull();
      expect(newDir!.type).toBe('dir');
    });

    it('does not mutate original state', () => {
      const state = makeState();
      mkdir(['newdir'], state);
      const original = findNode(state.root, '/home/kali/newdir', '/home/kali', '/home/kali');
      expect(original).toBeNull();
    });

    it('returns error if directory exists', () => {
      const state = makeState();
      const result = mkdir(['welcome.txt'], state);
      expect(result.exitCode).toBe(1);
      expect(result.error).toContain('File exists');
    });
  });

  describe('rm', () => {
    it('removes a file', () => {
      const state = makeState();
      const result = rm(['welcome.txt'], state) as HandlerResult;
      expect(result.exitCode).toBe(0);
      const removed = findNode(result.stateOverride!.root!, '/home/kali/welcome.txt', '/home/kali', '/home/kali');
      expect(removed).toBeNull();
    });

    it('does not mutate original state', () => {
      const state = makeState();
      rm(['welcome.txt'], state);
      const original = findNode(state.root, '/home/kali/welcome.txt', '/home/kali', '/home/kali');
      expect(original).not.toBeNull();
    });

    it('returns error for non-existent file without -f', () => {
      const state = makeState();
      const result = rm(['nonexistent.txt'], state);
      expect(result.exitCode).toBe(1);
      expect(result.error).toContain('No such file or directory');
    });

    it('silently skips with -f for non-existent file', () => {
      const state = makeState();
      const result = rm(['-f', 'nonexistent.txt'], state);
      expect(result.exitCode).toBe(0);
    });

    it('returns error for directory without -r', () => {
      const state = makeState();
      const result = rm(['/etc'], state);
      expect(result.exitCode).toBe(1);
      expect(result.error).toContain('Is a directory');
    });
  });

  describe('cp', () => {
    it('copies a file', () => {
      const state = makeState();
      const result = cp(['welcome.txt', 'copy.txt'], state) as HandlerResult;
      expect(result.exitCode).toBe(0);
      const copy = findNode(result.stateOverride!.root!, '/home/kali/copy.txt', '/home/kali', '/home/kali');
      expect(copy).not.toBeNull();
      expect(copy!.content).toBe('Hello World');
    });

    it('deep copies directories with -r', () => {
      const state = makeState();
      const result = cp(['-r', '/etc', '/home/kali/etc_backup'], state) as HandlerResult;
      expect(result.exitCode).toBe(0);
      const backup = findNode(result.stateOverride!.root!, '/home/kali/etc_backup', '/home/kali', '/home/kali');
      expect(backup).not.toBeNull();
      expect(backup!.type).toBe('dir');
    });

    it('does not mutate original state', () => {
      const state = makeState();
      cp(['welcome.txt', 'copy.txt'], state);
      const original = findNode(state.root, '/home/kali/copy.txt', '/home/kali', '/home/kali');
      expect(original).toBeNull();
    });

    it('returns error with less than 2 args', () => {
      const state = makeState();
      const result = cp(['welcome.txt'], state);
      expect(result.exitCode).toBe(1);
      expect(result.error).toContain('missing file operand');
    });

    it('returns error for non-existent source', () => {
      const state = makeState();
      const result = cp(['nonexistent.txt', 'copy.txt'], state);
      expect(result.exitCode).toBe(1);
      expect(result.error).toContain('No such file or directory');
    });
  });

  describe('mv', () => {
    it('moves a file', () => {
      const state = makeState();
      const result = mv(['welcome.txt', 'moved.txt'], state) as HandlerResult;
      expect(result.exitCode).toBe(0);
      const moved = findNode(result.stateOverride!.root!, '/home/kali/moved.txt', '/home/kali', '/home/kali');
      expect(moved).not.toBeNull();
      const original = findNode(result.stateOverride!.root!, '/home/kali/welcome.txt', '/home/kali', '/home/kali');
      expect(original).toBeNull();
    });

    it('does not mutate original state', () => {
      const state = makeState();
      mv(['welcome.txt', 'moved.txt'], state);
      const original = findNode(state.root, '/home/kali/welcome.txt', '/home/kali', '/home/kali');
      expect(original).not.toBeNull();
    });

    it('returns error for non-existent source', () => {
      const state = makeState();
      const result = mv(['nonexistent.txt', 'moved.txt'], state);
      expect(result.exitCode).toBe(1);
      expect(result.error).toContain('No such file or directory');
    });
  });

  describe('chmod', () => {
    it('sets executable flag with +x', () => {
      const state = makeState();
      const result = chmod(['+x', 'welcome.txt'], state) as HandlerResult;
      expect(result.exitCode).toBe(0);
      expect(result.stateOverride?.root).toBeDefined();
      const file = findNode(result.stateOverride!.root!, '/home/kali/welcome.txt', '/home/kali', '/home/kali');
      expect(file?.executable).toBe(true);
      expect(file?.permissions).toContain('x');
    });

    it('does not mutate original state', () => {
      const state = makeState();
      chmod(['+x', 'welcome.txt'], state);
      const original = findNode(state.root, '/home/kali/welcome.txt', '/home/kali', '/home/kali');
      expect(original?.executable).toBeFalsy();
    });

    it('returns error for non-existent file', () => {
      const state = makeState();
      const result = chmod(['+x', 'nonexistent.txt'], state);
      expect(result.exitCode).toBe(1);
    });
  });

  describe('chown', () => {
    it('changes owner', () => {
      const state = makeState();
      const result = chown(['root', 'welcome.txt'], state) as HandlerResult;
      expect(result.exitCode).toBe(0);
      expect(result.stateOverride?.root).toBeDefined();
      const file = findNode(result.stateOverride!.root!, '/home/kali/welcome.txt', '/home/kali', '/home/kali');
      expect(file?.owner).toBe('root');
    });

    it('changes owner and group', () => {
      const state = makeState();
      const result = chown(['root:staff', 'welcome.txt'], state) as HandlerResult;
      expect(result.exitCode).toBe(0);
      const file = findNode(result.stateOverride!.root!, '/home/kali/welcome.txt', '/home/kali', '/home/kali');
      expect(file?.owner).toBe('root');
      expect(file?.group).toBe('staff');
    });

    it('does not mutate original state', () => {
      const state = makeState();
      chown(['root', 'welcome.txt'], state);
      const original = findNode(state.root, '/home/kali/welcome.txt', '/home/kali', '/home/kali');
      expect(original?.owner).toBe('kali');
    });
  });

  describe('cat', () => {
    it('reads file content', () => {
      const state = makeState();
      const result = cat(['welcome.txt'], state);
      expect(result.exitCode).toBe(0);
      expect(result.output).toBe('Hello World');
    });

    it('returns error for non-existent file', () => {
      const state = makeState();
      const result = cat(['nonexistent.txt'], state);
      expect(result.exitCode).toBe(1);
      expect(result.error).toContain('No such file or directory');
    });
  });

  describe('echo', () => {
    it('outputs text', () => {
      const state = makeState();
      const result = echo(['hello', 'world'], state);
      expect(result.exitCode).toBe(0);
      expect(result.output).toBe('hello world');
    });

    it('expands variables', () => {
      const state = makeState();
      state.env.MY_VAR = 'test';
      const result = echo(['$MY_VAR'], state);
      expect(result.output).toBe('test');
    });
  });
});
