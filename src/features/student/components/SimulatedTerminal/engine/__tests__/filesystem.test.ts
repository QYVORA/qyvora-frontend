import { describe, it, expect } from 'vitest';
import {
  createNode,
  addChild,
  removeChild,
  findNode,
  resolvePath,
  normalizePath,
  pathDirname,
  pathBasename,
  cloneNode,
  updateNodeAtPath,
} from '../filesystem';
import type { VFSNode } from '../../types';

function makeDir(name: string, children: VFSNode[] = []): VFSNode {
  return createNode(name, 'dir', { children });
}

function makeFile(name: string, content = ''): VFSNode {
  return createNode(name, 'file', { content, size: content.length });
}

describe('filesystem', () => {
  describe('createNode', () => {
    it('creates a file node with defaults', () => {
      const node = createNode('test.txt', 'file');
      expect(node.name).toBe('test.txt');
      expect(node.type).toBe('file');
      expect(node.permissions).toBe('-rw-r--r--');
      expect(node.owner).toBe('kali');
      expect(node.group).toBe('kali');
      expect(node.size).toBe(0);
      expect(node.children).toEqual([]);
    });

    it('creates a dir node with defaults', () => {
      const node = createNode('testdir', 'dir');
      expect(node.type).toBe('dir');
      expect(node.permissions).toBe('drwxr-xr-x');
      expect(node.size).toBe(4096);
    });

    it('applies options', () => {
      const node = createNode('test.txt', 'file', { content: 'hello', size: 5 });
      expect(node.content).toBe('hello');
      expect(node.size).toBe(5);
    });
  });

  describe('addChild', () => {
    it('adds a child to a directory', () => {
      const parent = makeDir('parent');
      const child = makeFile('child.txt');
      const updated = addChild(parent, child);
      expect(updated.children).toHaveLength(1);
      expect(updated.children[0].name).toBe('child.txt');
    });

    it('does not mutate the original parent', () => {
      const parent = makeDir('parent');
      const child = makeFile('child.txt');
      addChild(parent, child);
      expect(parent.children).toHaveLength(0);
    });

    it('does not add duplicate children', () => {
      const parent = makeDir('parent', [makeFile('child.txt')]);
      const child = makeFile('child.txt');
      const updated = addChild(parent, child);
      expect(updated.children).toHaveLength(1);
    });

    it('returns parent unchanged if not a directory', () => {
      const file = makeFile('file.txt');
      const child = makeFile('child.txt');
      const result = addChild(file, child);
      expect(result).toBe(file);
    });
  });

  describe('removeChild', () => {
    it('removes a child by name', () => {
      const parent = makeDir('parent', [makeFile('a.txt'), makeFile('b.txt')]);
      const updated = removeChild(parent, 'a.txt');
      expect(updated.children).toHaveLength(1);
      expect(updated.children[0].name).toBe('b.txt');
    });

    it('does not mutate the original parent', () => {
      const parent = makeDir('parent', [makeFile('a.txt')]);
      removeChild(parent, 'a.txt');
      expect(parent.children).toHaveLength(1);
    });

    it('handles removing non-existent child', () => {
      const parent = makeDir('parent', [makeFile('a.txt')]);
      const updated = removeChild(parent, 'nonexistent.txt');
      expect(updated.children).toHaveLength(1);
    });
  });

  describe('findNode', () => {
    it('finds root node', () => {
      const root = makeDir('/');
      const result = findNode(root, '/', '/home/kali', '/home/kali');
      expect(result).toBe(root);
    });

    it('finds a nested node by absolute path', () => {
      const child = makeFile('test.txt');
      const parent = makeDir('home', [makeDir('kali', [child])]);
      const root = makeDir('/', [parent]);
      const result = findNode(root, '/home/kali/test.txt', '/home/kali', '/home/kali');
      expect(result).toBe(child);
    });

    it('finds a node by relative path', () => {
      const child = makeFile('test.txt');
      const dir = makeDir('kali', [child]);
      const root = makeDir('/', [makeDir('home', [dir])]);
      const result = findNode(root, 'test.txt', '/home/kali', '/home/kali');
      expect(result).toBe(child);
    });

    it('returns null for non-existent path', () => {
      const root = makeDir('/');
      const result = findNode(root, '/nonexistent', '/home/kali', '/home/kali');
      expect(result).toBeNull();
    });

    it('handles ~ expansion', () => {
      const child = makeFile('.bashrc');
      const home = makeDir('kali', [child]);
      const root = makeDir('/', [makeDir('home', [home])]);
      const result = findNode(root, '~/.bashrc', '/home/kali', '/home/kali');
      expect(result).toBe(child);
    });
  });

  describe('resolvePath', () => {
    it('resolves absolute path', () => {
      expect(resolvePath('/etc/hostname', '/home/kali', '/home/kali')).toBe('/etc/hostname');
    });

    it('resolves relative path', () => {
      expect(resolvePath('file.txt', '/home/kali', '/home/kali')).toBe('/home/kali/file.txt');
    });

    it('resolves ~ to home', () => {
      expect(resolvePath('~', '/home/kali', '/home/kali')).toBe('/home/kali');
    });

    it('resolves ~/path', () => {
      expect(resolvePath('~/file.txt', '/home/kali', '/home/kali')).toBe('/home/kali/file.txt');
    });

    it('normalizes path with ..', () => {
      expect(resolvePath('/home/kali/../etc/hostname', '/home/kali', '/home/kali')).toBe('/home/etc/hostname');
    });

    it('returns cwd for empty path', () => {
      expect(resolvePath('', '/home/kali', '/home/kali')).toBe('/home/kali');
    });
  });

  describe('normalizePath', () => {
    it('removes trailing slash', () => {
      expect(normalizePath('/home/kali/')).toBe('/home/kali');
    });

    it('resolves ..', () => {
      expect(normalizePath('/home/kali/../etc')).toBe('/home/etc');
    });

    it('resolves .', () => {
      expect(normalizePath('/home/kali/.')).toBe('/home/kali');
    });

    it('handles root', () => {
      expect(normalizePath('/')).toBe('/');
    });
  });

  describe('pathDirname', () => {
    it('returns parent directory', () => {
      expect(pathDirname('/home/kali/file.txt')).toBe('/home/kali');
    });

    it('returns / for root', () => {
      expect(pathDirname('/')).toBe('/');
    });

    it('returns / for single component', () => {
      expect(pathDirname('/home')).toBe('/');
    });
  });

  describe('pathBasename', () => {
    it('returns filename', () => {
      expect(pathBasename('/home/kali/file.txt')).toBe('file.txt');
    });

    it('returns directory name', () => {
      expect(pathBasename('/home/kali')).toBe('kali');
    });

    it('returns / for root', () => {
      expect(pathBasename('/')).toBe('/');
    });
  });

  describe('cloneNode', () => {
    it('deep clones a node', () => {
      const child = makeFile('child.txt');
      const parent = makeDir('parent', [child]);
      const cloned = cloneNode(parent);
      expect(cloned.name).toBe('parent');
      expect(cloned.children).toHaveLength(1);
      expect(cloned).not.toBe(parent);
      expect(cloned.children[0]).not.toBe(child);
    });
  });

  describe('updateNodeAtPath', () => {
    it('updates a node at the given path', () => {
      const child = makeFile('test.txt', 'old');
      const root = makeDir('/', [makeDir('home', [makeDir('kali', [child])])]);
      const updated = updateNodeAtPath(root, '/home/kali/test.txt', '/home/kali', '/home/kali', (n) => ({
        ...n,
        content: 'new',
      }));
      const result = findNode(updated, '/home/kali/test.txt', '/home/kali', '/home/kali');
      expect(result?.content).toBe('new');
    });

    it('does not mutate the original tree', () => {
      const child = makeFile('test.txt', 'old');
      const root = makeDir('/', [makeDir('home', [makeDir('kali', [child])])]);
      updateNodeAtPath(root, '/home/kali/test.txt', '/home/kali', '/home/kali', (n) => ({
        ...n,
        content: 'new',
      }));
      const original = findNode(root, '/home/kali/test.txt', '/home/kali', '/home/kali');
      expect(original?.content).toBe('old');
    });

    it('returns root unchanged for non-existent path', () => {
      const root = makeDir('/');
      const updated = updateNodeAtPath(root, '/nonexistent', '/home/kali', '/home/kali', (n) => ({
        ...n,
        content: 'new',
      }));
      expect(updated).toBe(root);
    });
  });
});
