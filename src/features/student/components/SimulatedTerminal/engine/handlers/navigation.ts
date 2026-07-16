import type { CommandHandler, VFSNode } from '../../types';
import { resolvePath, findNode, pathBasename, pathDirname, updateNodeAtPath, addChild } from '../filesystem';

function addChildToPath(root: VFSNode, parentPath: string, child: VFSNode, home: string): VFSNode {
  const parent = findNode(root, parentPath, '/', home);
  if (!parent || parent.type !== 'dir') return root;
  return updateNodeAtPath(root, parentPath, '/', home, (p) => addChild(p, child));
}

function formatSize(size: number, human: boolean): string {
  if (!human) return String(size);
  const units = ['B', 'K', 'M', 'G', 'T'];
  let i = 0;
  let s = size;
  while (s >= 1024 && i < units.length - 1) { s /= 1024; i++; }
  return i === 0 ? `${s}${units[i]}` : `${s.toFixed(1)}${units[i]}`;
}

function formatTime(date: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  const month = months[date.getMonth()];
  const day = String(date.getDate()).padStart(2);
  if (date.getFullYear() === now.getFullYear()) {
    return `${month} ${day} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }
  return `${month} ${day}  ${date.getFullYear()}`;
}

function colorize(name: string, type: string, executable?: boolean): string {
  if (type === 'dir') return `\x1b[1;34m${name}\x1b[0m`;
  if (executable) return `\x1b[1;32m${name}\x1b[0m`;
  if (name.endsWith('.sh') || name.endsWith('.py') || name.endsWith('.pl')) return `\x1b[1;32m${name}\x1b[0m`;
  if (name.endsWith('.tar.gz') || name.endsWith('.zip') || name.endsWith('.gz')) return `\x1b[1;31m${name}\x1b[0m`;
  return name;
}

function collectEntriesRecursive(node: VFSNode, path: string, showAll: boolean): Array<{ node: VFSNode; path: string; depth: number }> {
  const result: Array<{ node: VFSNode; path: string; depth: number }> = [];
  const children = showAll ? node.children : node.children.filter(c => !c.name.startsWith('.'));
  for (const child of children) {
    const childPath = path === '/' ? `/${child.name}` : `${path}/${child.name}`;
    result.push({ node: child, path: childPath, depth: 0 });
    if (child.type === 'dir') {
      result.push(...collectEntriesRecursive(child, childPath, showAll).map(e => ({ ...e, depth: e.depth + 1 })));
    }
  }
  return result;
}

export const ls: CommandHandler = (args, state) => {
  const flags = new Set<string>();
  const paths: string[] = [];
  for (const arg of args) {
    if (arg.startsWith('-') && arg !== '--' && arg.length > 1 && !arg.match(/^-?\d/)) {
      for (const c of arg.slice(1)) flags.add('-' + c);
    } else {
      paths.push(arg);
    }
  }
  const targetPath = paths[0] || '.';
  const target = findNode(state.root, targetPath, state.cwd, state.home);
  if (!target) return { output: '', error: `ls: cannot access '${targetPath}': No such file or directory`, exitCode: 2 };
  if (target.type === 'file') return { output: target.name, exitCode: 0 };

  const showAll = flags.has('-a');
  const long = flags.has('-l');
  const human = flags.has('-h');
  const recursive = flags.has('-R');
  const sortBySize = flags.has('-S');
  const sortByTime = flags.has('-t');
  const onePerLine = flags.has('-1');
  const color = flags.has('--color') || flags.has('--color=auto') || flags.has('--color=always');
  const dirs = flags.has('-d');

  if (dirs) {
    return { output: long
      ? `${target.permissions}  ${target.owner.padEnd(15)} ${target.group}  ${formatSize(target.size, human).padStart(8)} ${color ? colorize(target.name, 'dir') : target.name}`
      : (color ? colorize(target.name, 'dir') : target.name),
      exitCode: 0 };
  }

  if (recursive) {
    const allEntries: Array<{ node: VFSNode; path: string; depth: number }> = [];
    const topChildren = showAll ? target.children : target.children.filter(c => !c.name.startsWith('.'));
    for (const child of topChildren) {
      const childPath = targetPath === '.' ? child.name : `${targetPath}/${child.name}`;
      allEntries.push({ node: child, path: childPath, depth: 0 });
      if (child.type === 'dir') {
        allEntries.push(...collectEntriesRecursive(child, childPath, showAll).map(e => ({ ...e, depth: e.depth + 1 })));
      }
    }

    const lines: string[] = [];
    const resolvedTarget = resolvePath(targetPath, state.cwd, state.home);
    lines.push(`${resolvedTarget}:`);
    for (const entry of allEntries) {
      if (entry.depth > 0 && entry.node.type === 'dir') {
        lines.push(`${' '.repeat(entry.depth * 4).slice(0, -2)}${entry.node.name}:`);
      } else if (entry.depth > 0) {
        const displayName = color ? colorize(entry.node.name, entry.node.type, entry.node.executable) : entry.node.name;
        lines.push(`${' '.repeat((entry.depth - 1) * 4 + 2)}${displayName}`);
      }
    }
    return { output: lines.join('\n'), exitCode: 0 };
  }

  let entries = [...target.children];
  if (showAll) {
    entries = [
      { name: '.', type: 'dir', permissions: 'drwxr-xr-x', owner: state.user, group: state.user, size: 4096, children: [] } as VFSNode,
      { name: '..', type: 'dir', permissions: 'drwxr-xr-x', owner: state.user, group: state.user, size: 4096, children: [] } as VFSNode,
      ...entries,
    ];
  } else {
    entries = entries.filter(c => !c.name.startsWith('.'));
  }

  if (sortBySize) entries.sort((a, b) => (b.content?.length || b.size) - (a.content?.length || a.size));
  if (sortByTime) entries.sort((a, b) => (b.mtime?.getTime() || 0) - (a.mtime?.getTime() || 0));

  if (long) {
    const totalBlocks = entries.reduce((sum, c) => sum + Math.ceil((c.content?.length || c.size) / 512), 0);
    const lines = entries.map(c => {
      const size = c.content?.length || c.size;
      const displayName = color ? colorize(c.name, c.type, c.executable) : c.name;
      return `${c.permissions}  ${c.owner.padEnd(15)} ${c.group}  ${formatSize(size, human).padStart(8)} ${c.mtime ? formatTime(c.mtime) : 'Jan  1 00:00'} ${displayName}${c.executable ? '*' : ''}`;
    });
    return { output: `total ${totalBlocks}\n` + lines.join('\n'), exitCode: 0 };
  }

  const lines = entries.map(c => {
    const displayName = color ? colorize(c.name, c.type, c.executable) : c.name;
    return displayName + (c.type === 'dir' ? '/' : '') + (c.executable ? '*' : '');
  });

  if (onePerLine) return { output: lines.join('\n'), exitCode: 0 };
  return { output: lines.join('\n'), exitCode: 0 };
};

export const cd: CommandHandler = (args, state) => {
  const target = args[0] || state.home;
  if (target === '-') {
    const prev = state.env.OLDPWD || state.home;
    return { output: '', exitCode: 0, stateOverride: { cwd: prev, env: { ...state.env, OLDPWD: state.cwd } } };
  }
  const resolved = resolvePath(target, state.cwd, state.home);
  const node = findNode(state.root, target, state.cwd, state.home);
  if (!node) return { output: '', error: `cd: ${target}: No such file or directory`, exitCode: 1 };
  if (node.type !== 'dir') return { output: '', error: `cd: ${target}: Not a directory`, exitCode: 1 };
  return { output: '', exitCode: 0, stateOverride: { cwd: resolved, env: { ...state.env, OLDPWD: state.cwd } } };
};

export const pwd: CommandHandler = (_args, state) => {
  return { output: state.cwd, exitCode: 0 };
};

export const tree: CommandHandler = (args, state) => {
  const targetPath = args[0] || '.';
  const target = findNode(state.root, targetPath, state.cwd, state.home);
  if (!target) return { output: '', error: `tree: ${targetPath}: No such file or directory`, exitCode: 1 };

  const showAll = args.includes('-a');

  function render(node: VFSNode, prefix: string, isLast: boolean): string[] {
    const lines: string[] = [];
    const children = showAll ? node.children : node.children.filter(c => !c.name.startsWith('.'));
    const sorted = [...children].sort((a, b) => {
      if (a.type !== b.type) return a.type === 'dir' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });

    sorted.forEach((child, idx) => {
      const isLastChild = idx === sorted.length - 1;
      const connector = isLastChild ? '└── ' : '├── ';
      lines.push(prefix + connector + child.name + (child.type === 'dir' ? '/' : ''));
      if (child.type === 'dir') {
        const extension = isLastChild ? '    ' : '│   ';
        lines.push(...render(child, prefix + extension, isLastChild));
      }
    });
    return lines;
  }

  const output = [target.name + '/', ...render(target, '', true)];
  const dirCount = output.filter(l => l.endsWith('/')).length;
  const fileCount = output.length - dirCount;
  output.push('');
  output.push(`${dirCount} ${dirCount === 1 ? 'directory' : 'directories'}, ${fileCount} ${fileCount === 1 ? 'file' : 'files'}`);

  return { output: output.join('\n'), exitCode: 0 };
};

export const realpath: CommandHandler = (args, state) => {
  const path = args[0];
  if (!path) return { output: '', error: 'realpath: missing file operand', exitCode: 1 };
  return { output: resolvePath(path, state.cwd, state.home), exitCode: 0 };
};

export const tee: CommandHandler = (args, state) => {
  const append = args.includes('-a');
  const fileArgs = args.filter(a => !a.startsWith('-'));
  const stdin = state.stdin || '';
  let currentRoot = state.root;
  for (const filepath of fileArgs) {
    const existing = findNode(currentRoot, filepath, state.cwd, state.home);
    if (existing && existing.type === 'file') {
      const newContent = append ? (existing.content || '') + stdin : stdin;
      currentRoot = updateNodeAtPath(currentRoot, filepath, state.cwd, state.home, (n) => ({
        ...n, content: newContent, size: newContent.length,
      }));
    } else {
      const name = pathBasename(filepath);
      const parentPath = pathDirname(resolvePath(filepath, state.cwd, state.home));
      const newFile: VFSNode = {
        name, type: 'file', content: stdin, permissions: '-rw-r--r--',
        owner: state.user, group: state.user, size: stdin.length, children: [],
      };
      currentRoot = addChildToPath(currentRoot, parentPath, newFile, state.home);
    }
  }
  return { output: stdin, exitCode: 0, stateOverride: { root: currentRoot } };
};

export const xargs: CommandHandler = (args, state) => {
  const stdin = state.stdin || '';
  if (args.length === 0) return { output: '', error: 'xargs: missing command', exitCode: 1 };
  const cmd = args[0];
  const cmdArgs = args.slice(1);
  const inputArgs = stdin.trim().split(/\s+/).filter(Boolean);
  return { output: `xargs: would execute: ${cmd} ${[...cmdArgs, ...inputArgs].join(' ')}`, exitCode: 0 };
};
