import type { VFSNode } from '../types';

export function createNode(
  name: string,
  type: 'file' | 'dir',
  opts?: Partial<Omit<VFSNode, 'name' | 'type' | 'children'>>,
): VFSNode {
  return {
    name,
    type,
    children: type === 'dir' ? [] : [],
    permissions: type === 'dir' ? 'drwxr-xr-x' : '-rw-r--r--',
    owner: 'kali',
    group: 'kali',
    size: type === 'dir' ? 4096 : 0,
    ...opts,
  };
}

export function addChild(parent: VFSNode, child: VFSNode): VFSNode {
  if (parent.type !== 'dir') return parent;
  const exists = parent.children.some((c) => c.name === child.name);
  if (exists) return parent;
  return {
    ...parent,
    children: [...parent.children, child],
  };
}

export function removeChild(parent: VFSNode, name: string): VFSNode {
  return {
    ...parent,
    children: parent.children.filter((c) => c.name !== name),
  };
}

export function findNode(root: VFSNode, path: string, cwd: string, home: string): VFSNode | null {
  const resolved = resolvePath(path, cwd, home);
  if (resolved === '/') return root;
  const parts = resolved.split('/').filter(Boolean);
  let current = root;
  for (const part of parts) {
    const child = current.children.find((c) => c.name === part);
    if (!child) return null;
    current = child;
  }
  return current;
}

export function resolvePath(path: string, cwd: string, home: string): string {
  if (!path) return cwd;
  if (path === '~') return home;
  if (path.startsWith('~/')) return home + '/' + path.slice(2);
  if (path.startsWith('/')) return normalizePath(path);
  return normalizePath(cwd + '/' + path);
}

export function normalizePath(path: string): string {
  const parts = path.split('/').filter(Boolean);
  const stack: string[] = [];
  for (const part of parts) {
    if (part === '.') continue;
    if (part === '..') { stack.pop(); continue; }
    stack.push(part);
  }
  return '/' + stack.join('/');
}

export function pathDirname(path: string): string {
  const normalized = normalizePath(path);
  if (normalized === '/') return '/';
  const parts = normalized.split('/').filter(Boolean);
  parts.pop();
  return '/' + parts.join('/');
}

export function pathBasename(path: string): string {
  const normalized = normalizePath(path);
  if (normalized === '/') return '/';
  return normalized.split('/').filter(Boolean).pop() || '';
}

export function cloneNode(node: VFSNode): VFSNode {
  return {
    ...node,
    children: node.children.map(cloneNode),
    content: node.content,
  };
}

export function nodeAtPath(root: VFSNode, path: string, cwd: string, home: string): VFSNode | null {
  const resolved = resolvePath(path, cwd, home);
  if (resolved === '/') return root;
  const parts = resolved.split('/').filter(Boolean);
  let current = root;
  for (const part of parts) {
    const child = current.children.find((c) => c.name === part);
    if (!child) return null;
    current = child;
  }
  return current;
}

export function updateNodeAtPath(
  root: VFSNode,
  path: string,
  cwd: string,
  home: string,
  updater: (node: VFSNode) => VFSNode,
): VFSNode {
  const resolved = resolvePath(path, cwd, home);
  if (resolved === '/') return updater(root);

  const parts = resolved.split('/').filter(Boolean);
  const targetName = parts.pop()!;
  const parentPath = '/' + parts.join('/');

  const updateRecursive = (node: VFSNode, remaining: string[]): VFSNode => {
    if (remaining.length === 0) {
      if (node.name === targetName) return updater(node);
      return node;
    }
    const [head, ...rest] = remaining;
    return {
      ...node,
      children: node.children.map((c) =>
        c.name === head ? updateRecursive(c, rest) : c,
      ),
    };
  };

  const parentParts = parts.length === 0 ? [] : parts;
  if (parentParts.length > 0) {
    const navigateToParent = (node: VFSNode, remaining: string[]): VFSNode => {
      if (remaining.length === 0) return node;
      const [head, ...rest] = remaining;
      return {
        ...node,
        children: node.children.map((c) =>
          c.name === head ? navigateToParent(c, rest) : c,
        ),
      };
    };
    const targetDir = nodeAtPath(root, parentPath, '/', home);
    if (!targetDir) return root;
    return navigateToParent(root, parentParts);
  }

  return {
    ...root,
    children: root.children.map((c) =>
      c.name === targetName ? updater(c) : c,
    ),
  };
}

export function getPathComponents(path: string): string[] {
  return path.split('/').filter(Boolean);
}

export function isSubPath(parent: string, child: string): boolean {
  const normalizedParent = normalizePath(parent);
  const normalizedChild = normalizePath(child);
  if (normalizedParent === '/') return true;
  return normalizedChild.startsWith(normalizedParent + '/');
}

export function getFileExtension(filename: string): string {
  const idx = filename.lastIndexOf('.');
  return idx === -1 ? '' : filename.slice(idx);
}
