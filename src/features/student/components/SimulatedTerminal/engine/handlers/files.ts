import type { CommandHandler, VFSNode } from '../../types';
import { findNode, resolvePath, pathDirname, pathBasename, addChild, removeChild, updateNodeAtPath } from '../filesystem';
import { parseFlags, hasFlag, getParentPath } from './utils';

function addChildToPath(root: VFSNode, parentPath: string, child: VFSNode, home: string): VFSNode {
  const parent = findNode(root, parentPath, '/', home);
  if (!parent || parent.type !== 'dir') return root;
  return updateNodeAtPath(root, parentPath, '/', home, (p) => addChild(p, child));
}

function removeChildFromPath(root: VFSNode, parentPath: string, childName: string, home: string): VFSNode {
  const parent = findNode(root, parentPath, '/', home);
  if (!parent) return root;
  return updateNodeAtPath(root, parentPath, '/', home, (p) => removeChild(p, childName));
}

function deepCopyNode(node: VFSNode): VFSNode {
  return {
    ...node,
    children: node.children.map(deepCopyNode),
  };
}

export const cat: CommandHandler = (args, state) => {
  if (args.length === 0) return { output: '', exitCode: 0 };
  const outputs: string[] = [];
  for (const filepath of args) {
    const node = findNode(state.root, filepath, state.cwd, state.home);
    if (!node) return { output: '', error: `cat: ${filepath}: No such file or directory`, exitCode: 1 };
    if (node.type === 'dir') return { output: '', error: `cat: ${filepath}: Is a directory`, exitCode: 1 };
    outputs.push(node.content || '');
  }
  return { output: outputs.join('\n'), exitCode: 0 };
};

export const echo: CommandHandler = (args, state) => {
  if (args.length === 0) return { output: '', exitCode: 0 };
  const text = args.map(arg => {
    if (arg.startsWith('$')) {
      const varName = arg.slice(1);
      return state.env[varName] || '';
    }
    return arg;
  }).join(' ');
  return { output: text, exitCode: 0 };
};

export const touch: CommandHandler = (args, state) => {
  const { positional: targets } = parseFlags(args);
  if (targets.length === 0) return { output: '', error: 'touch: missing file operand', exitCode: 1 };
  let currentRoot = state.root;
  for (const filepath of targets) {
    const existing = findNode(currentRoot, filepath, state.cwd, state.home);
    if (!existing) {
      const { parentPath, name } = getParentPath(state, filepath);
      const newFile: VFSNode = {
        name, type: 'file', content: '',
        permissions: '-rw-r--r--', owner: state.user, group: state.user, size: 0, children: [],
      };
      currentRoot = addChildToPath(currentRoot, parentPath, newFile, state.home);
    }
  }
  return { output: '', exitCode: 0, stateOverride: { root: currentRoot } };
};

export const mkdir: CommandHandler = (args, state) => {
  if (args.length === 0) return { output: '', error: 'mkdir: missing operand', exitCode: 1 };
  const { flags, positional: targets } = parseFlags(args);
  const recursive = hasFlag(flags, '-p');
  let currentRoot = state.root;
  for (const dirpath of targets) {
    const existing = findNode(currentRoot, dirpath, state.cwd, state.home);
    if (existing) {
      if (recursive) continue;
      return { output: '', error: `mkdir: cannot create directory '${dirpath}': File exists`, exitCode: 1 };
    }
    if (recursive) {
      const resolved = resolvePath(dirpath, state.cwd, state.home);
      const parts = resolved.split('/').filter(Boolean);
      let pathSoFar = '';
      for (const part of parts) {
        pathSoFar += '/' + part;
        const existingNode = findNode(currentRoot, pathSoFar, '/', state.home);
        if (!existingNode) {
          const newDir: VFSNode = {
            name: part, type: 'dir', content: '',
            permissions: 'drwxr-xr-x', owner: state.user, group: state.user, size: 4096, children: [],
          };
          const parentPath = pathDirname(pathSoFar);
          currentRoot = addChildToPath(currentRoot, parentPath, newDir, state.home);
        }
      }
    } else {
      const { parentPath, name } = getParentPath(state, dirpath);
      const newDir: VFSNode = {
        name, type: 'dir', content: '',
        permissions: 'drwxr-xr-x', owner: state.user, group: state.user, size: 4096, children: [],
      };
      currentRoot = addChildToPath(currentRoot, parentPath, newDir, state.home);
    }
  }
  return { output: '', exitCode: 0, stateOverride: { root: currentRoot } };
};

export const rm: CommandHandler = (args, state) => {
  if (args.length === 0) return { output: '', error: 'rm: missing operand', exitCode: 1 };
  const { flags, positional: targets } = parseFlags(args);
  const recursive = hasFlag(flags, '-r', '-R');
  const force = hasFlag(flags, '-f');
  const verbose = hasFlag(flags, '-v');
  let currentRoot = state.root;
  const outputs: string[] = [];
  for (const filepath of targets) {
    const node = findNode(currentRoot, filepath, state.cwd, state.home);
    if (!node) {
      if (!force) return { output: '', error: `rm: cannot remove '${filepath}': No such file or directory`, exitCode: 1 };
      continue;
    }
    if (node.type === 'dir' && !recursive) {
      return { output: '', error: `rm: cannot remove '${filepath}': Is a directory`, exitCode: 1 };
    }
    const { parentPath, name } = getParentPath(state, filepath);
    currentRoot = removeChildFromPath(currentRoot, parentPath, name, state.home);
    if (verbose) outputs.push(`removed '${filepath}'`);
  }
  return { output: outputs.join('\n'), exitCode: 0, stateOverride: { root: currentRoot } };
};

export const cp: CommandHandler = (args, state) => {
  const { flags, positional: targets } = parseFlags(args);
  const recursive = hasFlag(flags, '-r', '-R', '-a');
  const verbose = hasFlag(flags, '-v');
  if (targets.length < 2) return { output: '', error: 'cp: missing file operand', exitCode: 1 };
  const dest = targets[targets.length - 1];
  const sources = targets.slice(0, -1);
  const destNode = findNode(state.root, dest, state.cwd, state.home);
  const destIsDir = destNode?.type === 'dir';
  const outputs: string[] = [];
  let currentRoot = state.root;

  for (const src of sources) {
    const srcNode = findNode(currentRoot, src, state.cwd, state.home);
    if (!srcNode) return { output: '', error: `cp: cannot stat '${src}': No such file or directory`, exitCode: 1 };
    if (srcNode.type === 'dir' && !recursive) {
      return { output: '', error: `cp: omitting directory '${src}'`, exitCode: 1 };
    }
    const targetPath = destIsDir ? `${dest}/${pathBasename(src)}` : dest;
    const { parentPath: destParentPath, name: destName } = getParentPath(state, targetPath);
    const copy = deepCopyNode(srcNode);
    copy.name = destName;
    copy.mtime = new Date();
    currentRoot = addChildToPath(currentRoot, destParentPath, copy, currentRoot === state.root ? state.home : state.home);
    if (verbose) outputs.push(`'${src}' -> '${targetPath}'`);
  }

  return { output: outputs.join('\n'), exitCode: 0, stateOverride: { root: currentRoot } };
};

export const mv: CommandHandler = (args, state) => {
  const { flags, positional: targets } = parseFlags(args);
  const verbose = hasFlag(flags, '-v');
  const noClobber = hasFlag(flags, '-n');
  if (targets.length < 2) return { output: '', error: 'mv: missing file operand', exitCode: 1 };
  const [src, dest] = targets;
  const srcNode = findNode(state.root, src, state.cwd, state.home);
  if (!srcNode) return { output: '', error: `mv: cannot stat '${src}': No such file or directory`, exitCode: 1 };
  const destNode = findNode(state.root, dest, state.cwd, state.home);
  if (noClobber && destNode) return { output: '', exitCode: 0 };
  const { parentPath: srcParentPath, name: srcName } = getParentPath(state, src);
  const { parentPath: destParentPath, name: destName } = getParentPath(state, dest);
  const destParent = findNode(state.root, destParentPath, '/', state.home);
  if (!destParent || destParent.type !== 'dir') {
    return { output: '', error: `mv: cannot move '${src}' to '${dest}': No such file or directory`, exitCode: 1 };
  }
  let currentRoot = state.root;
  currentRoot = removeChildFromPath(currentRoot, srcParentPath, srcName, state.home);
  const moved = { ...srcNode, name: destName, mtime: new Date() };
  currentRoot = addChildToPath(currentRoot, destParentPath, moved, state.home);
  const output = verbose ? ` '${src}' -> '${dest}'` : '';
  return { output, exitCode: 0, stateOverride: { root: currentRoot } };
};

export const chmod: CommandHandler = (args, state) => {
  const { positional } = parseFlags(args);
  if (positional.length < 2) return { output: '', error: 'chmod: missing operand', exitCode: 1 };
  const mode = positional[0];
  const filepath = positional[1];
  const node = findNode(state.root, filepath, state.cwd, state.home);
  if (!node) return { output: '', error: `chmod: cannot access '${filepath}': No such file or directory`, exitCode: 1 };

  const typeChar = node.type === 'dir' ? 'd' : '-';
  let perms: string[];

  if (/^\d{3,4}$/.test(mode)) {
    const octal = mode.padStart(4, '0');
    const bits = [
      [parseInt(octal[0]) & 4, parseInt(octal[0]) & 2, parseInt(octal[0]) & 1],
      [parseInt(octal[1]) & 4, parseInt(octal[1]) & 2, parseInt(octal[1]) & 1],
      [parseInt(octal[2]) & 4, parseInt(octal[2]) & 2, parseInt(octal[2]) & 1],
    ];
    perms = [typeChar];
    for (const [r, w, x] of bits) {
      perms.push(r ? 'r' : '-', w ? 'w' : '-', x ? 'x' : '-');
    }
  } else {
    perms = node.permissions.split('');
    const classes = mode.includes('u') ? [1] : mode.includes('g') ? [2] : mode.includes('o') ? [3] : [1, 2, 3];
    const action = mode.includes('+') ? '+' : mode.includes('-') ? '-' : '=';
    const opIdx = mode.indexOf(action);
    const chars = mode.slice(opIdx + 1);
    for (const cls of classes) {
      for (const ch of chars) {
        if (ch === 'r') perms[cls * 3 - 2] = action === '+' ? 'r' : '-';
        if (ch === 'w') perms[cls * 3 - 1] = action === '+' ? 'w' : '-';
        if (ch === 'x') perms[cls * 3] = action === '+' ? 'x' : '-';
      }
    }
  }

  const newPerms = perms.join('');
  const updated = updateNodeAtPath(state.root, filepath, state.cwd, state.home, (n) => ({
    ...n,
    executable: newPerms.includes('x'),
    permissions: newPerms,
  }));
  return { output: '', exitCode: 0, stateOverride: { root: updated } };
};

export const head: CommandHandler = (args, state) => {
  const lines = args.includes('-n') ? parseInt(args[1]) || 10 : 10;
  const fileArgs = args.includes('-n') ? args.slice(2) : args;
  if (fileArgs.length === 0) return { output: '', exitCode: 0 };
  const filepath = fileArgs[0];
  const node = findNode(state.root, filepath, state.cwd, state.home);
  if (!node) return { output: '', error: `head: cannot open '${filepath}': No such file or directory`, exitCode: 1 };
  const content = node.content || '';
  const contentLines = content.split('\n').slice(0, lines);
  return { output: contentLines.join('\n'), exitCode: 0 };
};

export const tail: CommandHandler = (args, state) => {
  const lines = args.includes('-n') ? parseInt(args[1]) || 10 : 10;
  const fileArgs = args.includes('-n') ? args.slice(2) : args;
  if (fileArgs.length === 0) return { output: '', exitCode: 0 };
  const filepath = fileArgs[0];
  const node = findNode(state.root, filepath, state.cwd, state.home);
  if (!node) return { output: '', error: `tail: cannot open '${filepath}': No such file or directory`, exitCode: 1 };
  const content = node.content || '';
  const contentLines = content.split('\n');
  return { output: contentLines.slice(Math.max(0, contentLines.length - lines)).join('\n'), exitCode: 0 };
};

export const wc: CommandHandler = (args, state) => {
  const filepath = args[0];
  if (!filepath) return { output: '0 0 0', exitCode: 0 };
  const node = findNode(state.root, filepath, state.cwd, state.home);
  if (!node) return { output: '', error: `wc: ${filepath}: No such file or directory`, exitCode: 1 };
  const content = node.content || '';
  const lines = content.split('\n').length - 1;
  const words = content.split(/\s+/).filter(Boolean).length;
  const chars = content.length;
  return { output: `${lines} ${words} ${chars} ${filepath}`, exitCode: 0 };
};

export const grep: CommandHandler = (args, state) => {
  const { flags, positional } = parseFlags(args);
  const ignoreCase = hasFlag(flags, '-i');
  const invertMatch = hasFlag(flags, '-v');
  const countOnly = hasFlag(flags, '-c');
  const filesOnly = hasFlag(flags, '-l');
  const lineNumbers = hasFlag(flags, '-n');
  const wholeWord = hasFlag(flags, '-w');
  const fixedStrings = hasFlag(flags, '-F');
  const extendedRegex = hasFlag(flags, '-E');
  const beforeContext = (() => {
    const idx = args.indexOf('-B');
    return idx !== -1 ? parseInt(args[idx + 1]) || 0 : 0;
  })();
  const afterContext = (() => {
    const idx = args.indexOf('-A');
    return idx !== -1 ? parseInt(args[idx + 1]) || 0 : 0;
  })();
  const contextLines = (() => {
    const idx = args.indexOf('-C');
    return idx !== -1 ? parseInt(args[idx + 1]) || 0 : 0;
  })();
  const before = Math.max(beforeContext, contextLines);
  const after = Math.max(afterContext, contextLines);
  const color = hasFlag(flags, '--color=auto') || hasFlag(flags, '--color=always');

  const nonFlagArgs = positional;
  if (nonFlagArgs.length < 1) return { output: '', error: 'grep: missing pattern', exitCode: 2 };
  if (nonFlagArgs.length < 2) return { output: '', exitCode: 1 };
  const pattern = nonFlagArgs[0];
  const filepath = nonFlagArgs[1];

  const node = findNode(state.root, filepath, state.cwd, state.home);
  if (!node) return { output: '', error: `grep: ${filepath}: No such file or directory`, exitCode: 2 };
  const content = node.content || '';
  const lines = content.split('\n');

  let regex: RegExp;
  try {
    const flags = ignoreCase ? 'i' : '';
    if (fixedStrings) {
      const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      regex = new RegExp(wholeWord ? `\\b${escaped}\\b` : escaped, flags);
    } else if (extendedRegex) {
      regex = new RegExp(wholeWord ? `\\b(?:${pattern})\\b` : pattern, flags);
    } else {
      regex = new RegExp(wholeWord ? `\\b${pattern}\\b` : pattern, flags);
    }
  } catch {
    return { output: '', error: `grep: invalid pattern '${pattern}'`, exitCode: 2 };
  }

  const matchIndices: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (invertMatch ? !regex.test(lines[i]) : regex.test(lines[i])) {
      matchIndices.push(i);
    }
  }

  if (countOnly) {
    return { output: String(matchIndices.length), exitCode: matchIndices.length > 0 ? 0 : 1 };
  }
  if (filesOnly) {
    return { output: matchIndices.length > 0 ? filepath : '', exitCode: matchIndices.length > 0 ? 0 : 1 };
  }
  if (matchIndices.length === 0) return { output: '', exitCode: 1 };

  const result: string[] = [];
  let lastShown = -1;
  for (const idx of matchIndices) {
    const contextStart = Math.max(0, idx - before);
    const contextEnd = Math.min(lines.length - 1, idx + after);
    if (lastShown >= 0 && contextStart <= lastShown + 1) {
      for (let i = lastShown + 1; i <= contextEnd; i++) {
        const prefix = lineNumbers ? `${i + 1}:` : '';
        const line = color ? lines[i].replace(regex, (m) => `\x1b[1;31m${m}\x1b[0m`) : lines[i];
        result.push(`${prefix}${line}`);
      }
    } else {
      if (contextStart > 0 && result.length > 0) result.push('--');
      for (let i = contextStart; i <= contextEnd; i++) {
        const isMatch = matchIndices.includes(i);
        const prefix = lineNumbers ? `${i + 1}:` : '';
        const line = isMatch && color ? lines[i].replace(regex, (m) => `\x1b[1;31m${m}\x1b[0m`) : lines[i];
        result.push(`${prefix}${line}`);
      }
    }
    lastShown = contextEnd;
  }

  return { output: result.join('\n'), exitCode: 0 };
};

export const find: CommandHandler = (args, state) => {
  const { positional } = parseFlags(args);
  const startPath = positional[0] || '.';
  const startNode = findNode(state.root, startPath, state.cwd, state.home);
  if (!startNode) return { output: '', error: `find: '${startPath}': No such file or directory`, exitCode: 1 };

  const nameIdx = args.indexOf('-name');
  const typeIdx = args.indexOf('-type');
  const sizeIdx = args.indexOf('-size');
  const permIdx = args.indexOf('-perm');
  const userIdx = args.indexOf('-user');
  const maxDepthIdx = args.indexOf('-maxdepth');
  const minDepthIdx = args.indexOf('-mindepth');
  const pathIdx = args.indexOf('-path');

  const namePattern = nameIdx !== -1 ? args[nameIdx + 1] : null;
  const typeFilter = typeIdx !== -1 ? args[typeIdx + 1] : null;
  const sizeFilter = sizeIdx !== -1 ? args[sizeIdx + 1] : null;
  const permFilter = permIdx !== -1 ? args[permIdx + 1] : null;
  const userFilter = userIdx !== -1 ? args[userIdx + 1] : null;
  const maxDepth = maxDepthIdx !== -1 ? parseInt(args[maxDepthIdx + 1]) : Infinity;
  const minDepth = minDepthIdx !== -1 ? parseInt(args[minDepthIdx + 1]) : 0;
  const pathMatch = pathIdx !== -1 ? args[pathIdx + 1] : null;
  const negate = args.includes('-not');

  const results: string[] = [];

  function matchSize(node: VFSNode, filter: string): boolean {
    const size = node.content?.length || node.size;
    const op = filter[0];
    const val = parseInt(filter.slice(1));
    if (op === '+') return size > val;
    if (op === '-') return size < val;
    return size === val;
  }

  function matchPerm(node: VFSNode, filter: string): boolean {
    return node.permissions.includes(filter);
  }

  function matchPath(nodePath: string, pattern: string): boolean {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$');
    return regex.test(nodePath);
  }

  function walk(node: VFSNode, nodePath: string, depth: number) {
    if (depth > maxDepth) return;
    if (startPath !== '/' || depth > 0) {
      let match = true;
      if (namePattern) {
        const regex = new RegExp('^' + namePattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$');
        match = regex.test(node.name);
      }
      if (typeFilter && node.type !== typeFilter) match = false;
      if (sizeFilter && !matchSize(node, sizeFilter)) match = false;
      if (permFilter && !matchPerm(node, permFilter)) match = false;
      if (userFilter && node.owner !== userFilter) match = false;
      if (pathMatch && !matchPath(nodePath, pathMatch)) match = false;
      if (negate) match = !match;
      if (depth >= minDepth && match) results.push(nodePath);
    }
    if (node.type === 'dir') {
      node.children.forEach(c => {
        const childPath = nodePath === '/' ? `/${c.name}` : `${nodePath}/${c.name}`;
        walk(c, childPath, depth + 1);
      });
    }
  }
  walk(startNode, resolvePath(startPath, state.cwd, state.home), 0);
  return { output: results.length > 0 ? results.join('\n') : '', exitCode: 0 };
};

export const sort: CommandHandler = (args, state) => {
  const { flags, positional: fileArgs } = parseFlags(args);
  const reverse = hasFlag(flags, '-r');
  const numeric = hasFlag(flags, '-n');
  const unique = hasFlag(flags, '-u');
  const foldCase = hasFlag(flags, '-f');
  const humanNum = hasFlag(flags, '-h');
  const fieldSep = (() => {
    const idx = args.indexOf('-t');
    return idx !== -1 ? args[idx + 1] : null;
  })();
  const keyField = (() => {
    const idx = args.indexOf('-k');
    return idx !== -1 ? parseInt(args[idx + 1]) || 1 : 1;
  })();

  if (fileArgs.length === 0) return { output: '', exitCode: 0 };
  const node = findNode(state.root, fileArgs[0], state.cwd, state.home);
  if (!node) return { output: '', error: `sort: ${fileArgs[0]}: No such file or directory`, exitCode: 1 };
  const lines = (node.content || '').split('\n').filter(l => l);

  const parsedLines = lines.map(l => ({
    original: l,
    key: fieldSep ? l.split(fieldSep)[keyField - 1] || '' : l.split(/\s+/)[keyField - 1] || l,
  }));

  const sorted = [...parsedLines].sort((a, b) => {
    let cmp: number;
    if (numeric) {
      cmp = (parseFloat(a.key) || 0) - (parseFloat(b.key) || 0);
    } else if (humanNum) {
      const parseSize = (s: string): number => {
        const match = s.match(/^([\d.]+)([KMGTP]?)$/i);
        if (!match) return parseFloat(s) || 0;
        const val = parseFloat(match[1]);
        const unit = match[2].toUpperCase();
        const multipliers: Record<string, number> = { '': 1, 'K': 1024, 'M': 1048576, 'G': 1073741824, 'T': 1099511627776 };
        return val * (multipliers[unit] || 1);
      };
      cmp = parseSize(a.key) - parseSize(b.key);
    } else {
      cmp = a.key.localeCompare(b.key);
    }
    return reverse ? -cmp : cmp;
  });

  let result = sorted.map(s => s.original);
  if (foldCase) {
    result.sort((a, b) => {
      const cmp = a.toLowerCase().localeCompare(b.toLowerCase());
      return reverse ? -cmp : cmp;
    });
  }
  if (unique) {
    const seen = new Set<string>();
    result = result.filter(l => {
      const key = foldCase ? l.toLowerCase() : l;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  return { output: result.join('\n'), exitCode: 0 };
};

export const less: CommandHandler = (args, state) => {
  const filepath = args[0];
  if (!filepath) return { output: '', error: 'less: missing filename', exitCode: 1 };
  const node = findNode(state.root, filepath, state.cwd, state.home);
  if (!node) return { output: '', error: `less: ${filepath}: No such file or directory`, exitCode: 1 };
  const content = node.content || '';
  const lines = content.split('\n');
  const display = lines.slice(0, Math.min(lines.length, 40));
  display.push('');
  display.push(`-- More --(${Math.min(40, lines.length)}%)`);
  return { output: display.join('\n'), exitCode: 0 };
};
export { less as more };

export const diff: CommandHandler = (args, state) => {
  const targets = args.filter(a => !a.startsWith('-'));
  if (targets.length < 2) return { output: '', error: 'diff: missing operand', exitCode: 1 };
  const nodeA = findNode(state.root, targets[0], state.cwd, state.home);
  const nodeB = findNode(state.root, targets[1], state.cwd, state.home);
  if (!nodeA) return { output: '', error: `diff: ${targets[0]}: No such file or directory`, exitCode: 1 };
  if (!nodeB) return { output: '', error: `diff: ${targets[1]}: No such file or directory`, exitCode: 1 };
  const contentA = (nodeA.content || '').split('\n');
  const contentB = (nodeB.content || '').split('\n');
  const maxLines = Math.max(contentA.length, contentB.length);
  const differences: string[] = [];
  let diffCount = 0;
  for (let i = 0; i < maxLines; i++) {
    if (contentA[i] !== contentB[i]) {
      diffCount++;
      if (diffCount <= 20) {
        differences.push(`${i + 1}c${i + 1}`);
        differences.push(`< ${contentA[i] || ''}`);
        differences.push('---');
        differences.push(`> ${contentB[i] || ''}`);
      }
    }
  }
  if (diffCount === 0) return { output: '', exitCode: 0 };
  const header = `--- ${targets[0]}\n+++ ${targets[1]}\n@@ -1,${contentA.length} +1,${contentB.length} @@`;
  return { output: [header, ...differences].join('\n'), exitCode: 1 };
};

export const ln: CommandHandler = (args, state) => {
  const symbolic = args.includes('-s');
  const targets = args.filter(a => !a.startsWith('-'));
  if (targets.length < 2) return { output: '', error: 'ln: missing operand', exitCode: 1 };
  const [src, dest] = targets;
  const srcNode = findNode(state.root, src, state.cwd, state.home);
  if (!srcNode && !symbolic) {
    return { output: '', error: `ln: failed to create hard link '${dest}': No such file or directory`, exitCode: 1 };
  }
  if (symbolic) {
    const { parentPath, name } = getParentPath(state, dest);
    const symlinkNode: VFSNode = {
      name, type: 'file', content: `symlink:${src}`, permissions: 'lrwxrwxrwx',
      owner: state.user, group: state.user, size: src.length, children: [],
      symlink: src,
    };
    const finalRoot = addChildToPath(state.root, parentPath, symlinkNode, state.home);
    return { output: '', exitCode: 0, stateOverride: { root: finalRoot } };
  }
  const { parentPath, name } = getParentPath(state, dest);
  const linkNode: VFSNode = {
    name, type: srcNode.type, content: srcNode.content,
    permissions: srcNode.permissions, owner: state.user, group: state.user,
    size: srcNode.size, children: srcNode.children.map(c => ({ ...c })),
  };
  const finalRoot = addChildToPath(state.root, parentPath, linkNode, state.home);
  return { output: '', exitCode: 0, stateOverride: { root: finalRoot } };
};

export const du: CommandHandler = (args, state) => {
  const targetPath = args[0] || '.';
  const node = findNode(state.root, targetPath, state.cwd, state.home);
  if (!node) return { output: '', error: `du: cannot access '${targetPath}': No such file or directory`, exitCode: 1 };
  const human = args.includes('-h');
  const total = { size: 0 };
  const lines: string[] = [];
  function walk(n: VFSNode, path: string) {
    const size = n.content ? n.content.length : n.size;
    total.size += size;
    if (n.type === 'dir') {
      n.children.forEach(c => walk(c, path + '/' + c.name));
    }
    const display = human ? `${(size / 1024).toFixed(1)}K` : String(size);
    lines.push(`${display}\t${path}`);
  }
  walk(node, targetPath);
  const totalDisplay = human ? `${(total.size / 1024).toFixed(1)}K` : String(total.size);
  return { output: [...lines, `${totalDisplay}\ttotal`].join('\n'), exitCode: 0 };
};

export const df: CommandHandler = (_args, state) => {
  function calcSize(node: VFSNode): number {
    let size = node.content?.length || node.size;
    if (node.type === 'dir') {
      for (const child of node.children) {
        size += calcSize(child);
      }
    }
    return size;
  }
  const rootSize = calcSize(state.root);
  const homeNode = findNode(state.root, state.home, state.cwd, state.home);
  const homeSize = homeNode ? calcSize(homeNode) : 0;
  const usedKB = Math.ceil((rootSize + 12345678) / 1024);
  const homeUsedKB = Math.ceil(homeSize / 1024);
  const totalKB = 41152768;
  const homeTotalKB = 8257536;
  const rootPct = Math.round((usedKB / totalKB) * 100);
  const homePct = Math.round((homeUsedKB / homeTotalKB) * 100);
  return {
    output: `Filesystem     1K-blocks     Used Available Use% Mounted on\n/dev/sda1       ${totalKB} ${usedKB.toLocaleString()}  ${(totalKB - usedKB).toLocaleString()}  ${rootPct}% /\ntmpfs            2032764        0   2032764   0% /dev/shm\n/dev/sdb1        ${homeTotalKB}  ${homeUsedKB.toLocaleString()}   ${(homeTotalKB - homeUsedKB).toLocaleString()}  ${homePct}% /home`,
    exitCode: 0,
  };
};

export const tar: CommandHandler = (args, state) => {
  const create = args.includes('-c') || args.includes('--create');
  const extract = args.includes('-x') || args.includes('--extract');
  const list = args.includes('-t') || args.includes('--list');
  const fileIdx = args.indexOf('-f') !== -1 ? args.indexOf('-f') : args.indexOf('--file');
  const archiveName = fileIdx !== -1 ? args[fileIdx + 1] : 'archive.tar';
  const fileArgs = args.slice(fileIdx + 2).filter(a => !a.startsWith('-'));

  function collectFiles(node: VFSNode, prefix: string): string[] {
    const files: string[] = [];
    for (const child of node.children) {
      const path = prefix ? `${prefix}/${child.name}` : child.name;
      files.push(path + (child.type === 'dir' ? '/' : ''));
      if (child.type === 'dir') files.push(...collectFiles(child, path));
    }
    return files;
  }

  if (create) {
    const entries: string[] = [];
    for (const f of fileArgs) {
      const node = findNode(state.root, f, state.cwd, state.home);
      if (!node) continue;
      if (node.type === 'dir') {
        entries.push(...collectFiles(node, f));
      } else {
        entries.push(f);
      }
    }
    const data = JSON.stringify({ entries, timestamp: Date.now() });
    const updated = updateNodeAtPath(state.root, archiveName, state.cwd, state.home, (n) => ({
      ...n, type: 'file', content: data, size: data.length,
    }));
    const archiveNode = findNode(updated, archiveName, state.cwd, state.home);
    if (!archiveNode) {
      const name = pathBasename(archiveName);
      const parentPath = pathDirname(resolvePath(archiveName, state.cwd, state.home));
      const newFile: VFSNode = {
        name, type: 'file', content: data, permissions: '-rw-r--r--',
        owner: state.user, group: state.user, size: data.length, children: [],
      };
      const finalRoot = addChildToPath(state.root, parentPath, newFile, state.home);
      return { output: '', exitCode: 0, stateOverride: { root: finalRoot } };
    }
    const finalRoot = updateNodeAtPath(state.root, archiveName, state.cwd, state.home, (n) => ({
      ...n, content: data, size: data.length,
    }));
    return { output: '', exitCode: 0, stateOverride: { root: finalRoot } };
  }

  if (extract) {
    const node = findNode(state.root, archiveName, state.cwd, state.home);
    if (!node) return { output: '', error: `tar: ${archiveName}: Cannot open: No such file or directory`, exitCode: 1 };
    try {
      const data = JSON.parse(node.content || '{}');
      const entries = data.entries || [];
      let currentRoot = state.root;
      for (const entry of entries) {
        if (entry.endsWith('/')) {
          const dirPath = entry.slice(0, -1);
          const dirName = pathBasename(dirPath);
          const parentPath = pathDirname(resolvePath(dirPath, state.cwd, state.home));
          const newDir: VFSNode = {
            name: dirName, type: 'dir', content: '',
            permissions: 'drwxr-xr-x', owner: state.user, group: state.user, size: 4096, children: [],
          };
          currentRoot = addChildToPath(currentRoot, parentPath, newDir, state.home);
        } else {
          const fileName = pathBasename(entry);
          const parentPath = pathDirname(resolvePath(entry, state.cwd, state.home));
          const newFile: VFSNode = {
            name: fileName, type: 'file', content: '', permissions: '-rw-r--r--',
            owner: state.user, group: state.user, size: 0, children: [],
          };
          currentRoot = addChildToPath(currentRoot, parentPath, newFile, state.home);
        }
      }
      return { output: entries.join('\n'), exitCode: 0, stateOverride: { root: currentRoot } };
    } catch {
      return { output: `tar: ${archiveName}: This does not look like a tar archive`, exitCode: 1 };
    }
  }

  if (list) {
    const node = findNode(state.root, archiveName, state.cwd, state.home);
    if (!node) return { output: '', error: `tar: ${archiveName}: Cannot open: No such file or directory`, exitCode: 1 };
    try {
      const data = JSON.parse(node.content || '{}');
      const entries = data.entries || [];
      return { output: entries.join('\n'), exitCode: 0 };
    } catch {
      return { output: `tar: ${archiveName}: This does not look like a tar archive`, exitCode: 1 };
    }
  }

  return { output: '', error: 'tar: You must specify one of the `-c`, `-x` or `-t` options', exitCode: 1 };
};

export const zipCmd: CommandHandler = (args, state) => {
  const targets = args.filter(a => !a.startsWith('-'));
  if (targets.length < 2) return { output: '', error: 'zip: missing file operand', exitCode: 1 };
  const [archive, ...files] = targets;
  const entries: string[] = [];
  let totalSize = 0;
  for (const f of files) {
    const node = findNode(state.root, f, state.cwd, state.home);
    if (node) {
      entries.push(f);
      totalSize += node.content?.length || node.size;
    }
  }
  const data = JSON.stringify({ entries, timestamp: Date.now() });
  const archivePath = archive.endsWith('.zip') ? archive : `${archive}.zip`;
  const name = pathBasename(archivePath);
  const parentPath = pathDirname(resolvePath(archivePath, state.cwd, state.home));
  const newFile: VFSNode = {
    name, type: 'file', content: data, permissions: '-rw-r--r--',
    owner: state.user, group: state.user, size: data.length, children: [],
  };
  const finalRoot = addChildToPath(state.root, parentPath, newFile, state.home);
  const addingOutput = entries.map(f => `  adding: ${f} (stored 0%)`).join('\n');
  return { output: addingOutput, exitCode: 0, stateOverride: { root: finalRoot } };
};
export const unzip: CommandHandler = (args, state) => {
  if (args.length === 0) return { output: '', error: 'unzip: missing file operand', exitCode: 1 };
  const archive = args[0];
  const node = findNode(state.root, archive, state.cwd, state.home);
  if (!node) return { output: '', error: `unzip:  cannot find ${archive}`, exitCode: 1 };
  try {
    const data = JSON.parse(node.content || '{}');
    const entries = data.entries || [];
    let currentRoot = state.root;
    for (const entry of entries) {
      const fileName = pathBasename(entry);
      const parentPath = pathDirname(resolvePath(entry, state.cwd, state.home));
      const newFile: VFSNode = {
        name: fileName, type: 'file', content: '', permissions: '-rw-r--r--',
        owner: state.user, group: state.user, size: 0, children: [],
      };
      currentRoot = addChildToPath(currentRoot, parentPath, newFile, state.home);
    }
    const inflating = entries.map(f => `  inflating: ${f}`).join('\n');
    return { output: inflating, exitCode: 0, stateOverride: { root: currentRoot } };
  } catch {
    return { output: '', error: `unzip:  ${archive} is not a valid zip file`, exitCode: 1 };
  }
};

export const xxd: CommandHandler = (args, state) => {
  const filepath = args.filter(a => !a.startsWith('-'))[0];
  if (!filepath) return { output: '', exitCode: 0 };
  const node = findNode(state.root, filepath, state.cwd, state.home);
  if (!node) return { output: '', error: `xxd: ${filepath}: No such file or directory`, exitCode: 1 };
  const content = node.content || '';
  const hexLines: string[] = [];
  for (let i = 0; i < content.length; i += 16) {
    const chunk = content.slice(i, i + 16);
    const hex = Array.from(chunk).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
    const ascii = Array.from(chunk).map(c => c.match(/[ -~]/) ? c : '.').join('');
    hexLines.push(`${(i.toString(16).padStart(8, '0'))}: ${hex.padEnd(47)}  ${ascii}`);
  }
  return { output: hexLines.join('\n'), exitCode: 0 };
};

export const strings: CommandHandler = (args, state) => {
  const filepath = args.filter(a => !a.startsWith('-'))[0];
  if (!filepath) return { output: '', error: 'strings: missing filename', exitCode: 1 };
  const node = findNode(state.root, filepath, state.cwd, state.home);
  if (!node) return { output: '', error: `strings: ${filepath}: No such file or directory`, exitCode: 1 };
  const content = node.content || '';
  const found = content.match(/[a-zA-Z0-9_\-./]{4,}/g) || [];
  return { output: found.join('\n'), exitCode: 0 };
};

export const file: CommandHandler = (args, state) => {
  const filepath = args.filter(a => !a.startsWith('-'))[0];
  if (!filepath) return { output: '', error: 'file: missing filename', exitCode: 1 };
  const node = findNode(state.root, filepath, state.cwd, state.home);
  if (!node) return { output: '', error: `file: ${filepath}: No such file or directory`, exitCode: 1 };
  const ext = node.name.split('.').pop()?.toLowerCase() || '';
  const typeMap: Record<string, string> = {
    txt: 'ASCII text',
    md: 'Markdown document, ASCII text',
    html: 'HTML document, ASCII text',
    js: 'JavaScript source, ASCII text',
    ts: 'TypeScript source, ASCII text',
    py: 'Python script, ASCII text',
    json: 'JSON data',
    xml: 'XML document',
    csv: 'CSV text',
    png: 'PNG image data',
    jpg: 'JPEG image data',
    gif: 'GIF image data',
    pdf: 'PDF document',
    zip: 'Zip archive data',
    tar: 'POSIX tar archive',
    gz: 'gzip compressed data',
    sh: 'Bourne-Again shell script, ASCII text executable',
    bin: 'ELF 64-bit LSB executable',
  };
  const fileType = typeMap[ext] || (node.type === 'dir' ? 'directory' : 'data');
  return { output: `${filepath}: ${fileType}`, exitCode: 0 };
};

function fakeHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(32, '0');
}

export const md5sum: CommandHandler = (args, state) => {
  const filepath = args.filter(a => !a.startsWith('-'))[0];
  if (!filepath) return { output: '', error: 'md5sum: missing file operand', exitCode: 1 };
  const node = findNode(state.root, filepath, state.cwd, state.home);
  if (!node) return { output: '', error: `md5sum: ${filepath}: No such file or directory`, exitCode: 1 };
  const hash = fakeHash(filepath + (node.content || ''));
  return { output: `${hash}  ${filepath}`, exitCode: 0 };
};
export const sha256sum: CommandHandler = (args, state) => {
  const filepath = args.filter(a => !a.startsWith('-'))[0];
  if (!filepath) return { output: '', error: 'sha256sum: missing file operand', exitCode: 1 };
  const node = findNode(state.root, filepath, state.cwd, state.home);
  if (!node) return { output: '', error: `sha256sum: ${filepath}: No such file or directory`, exitCode: 1 };
  const hash = fakeHash(filepath + (node.content || '')).repeat(2).slice(0, 64);
  return { output: `${hash}  ${filepath}`, exitCode: 0 };
};

export const awk: CommandHandler = (args, state) => {
  const stdin = state.stdin || '';
  const fieldSepIdx = args.indexOf('-F');
  const fieldSep = fieldSepIdx !== -1 ? args[fieldSepIdx + 1] : null;
  const scriptIdx = args.findIndex(a => a.includes('{print') || a.includes('{ if') || a.includes('BEGIN') || a.includes('END'));
  if (scriptIdx === -1 && !stdin) return { output: '', error: 'awk: usage: awk \'{print $N}\' [file]', exitCode: 1 };

  let content = stdin;
  if (!content) {
    const filepath = args[scriptIdx + 1] || args[args.length - 1];
    if (filepath && !filepath.includes('{') && !filepath.startsWith('-')) {
      const node = findNode(state.root, filepath, state.cwd, state.home);
      if (node) content = node.content || '';
    }
  }

  const script = args.find(a => a.includes('{') && !a.startsWith('-')) || '{print $0}';
  const hasPrintAll = script.includes('{print $0}') || script.includes('{print}');
  const fieldMatches = script.match(/\$(\d+)/g);
  const fieldIndices = fieldMatches ? fieldMatches.map(m => parseInt(m.slice(1))) : [];
  const hasNF = script.includes('NF');
  const hasNR = script.includes('NR');
  const hasPrint = script.includes('print');

  const sep = fieldSep || /\s+/;
  const lines = content.split('\n').filter(l => l.trim());
  const output: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const fields = lines[i].split(sep);
    if (hasPrintAll || (!fieldIndices.length && !hasNF && !hasNR)) {
      output.push(lines[i]);
    } else if (fieldIndices.length > 0) {
      const vals = fieldIndices.map(idx => {
        if (idx === 0) return lines[i];
        if (idx === fields.length) return String(fields.length);
        return fields[idx - 1] || '';
      });
      output.push(vals.join(' '));
    }
  }

  return { output: output.join('\n'), exitCode: 0 };
};

export const sed: CommandHandler = (args, state) => {
  const stdin = state.stdin || '';
  const inPlace = args.includes('-i');
  const { positional } = parseFlags(args);
  const expressions: string[] = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '-e' && i + 1 < args.length) {
      expressions.push(args[++i]);
    } else if (args[i].startsWith('s/') || args[i].match(/^[0-9,/].*[dai]$/)) {
      expressions.push(args[i]);
    }
  }
  if (expressions.length === 0 && !stdin) {
    return { output: '', error: 'sed: usage: sed \'s/old/new/\' [file]', exitCode: 1 };
  }

  let content = stdin;
  let filepath: string | undefined;
  if (!content) {
    const fileArgs = positional.filter(a => !a.startsWith('s/') && !a.match(/^[0-9,/]/));
    if (fileArgs.length > 0) {
      filepath = fileArgs[0];
      const node = findNode(state.root, filepath, state.cwd, state.home);
      if (!node) return { output: '', error: `sed: can't read ${filepath}: No such file or directory`, exitCode: 1 };
      content = node.content || '';
    }
  }

  let lines = content.split('\n');
  let modified = false;

  for (const expr of expressions) {
    if (expr.startsWith('s/')) {
      const parts = expr.split('/');
      if (parts.length < 3) continue;
      const [, search, replace] = parts;
      const global = expr.endsWith('/g');
      lines = lines.map(l => {
        if (search === '') return l;
        const regex = new RegExp(search, global ? 'g' : '');
        const result = l.replace(regex, replace);
        if (result !== l) modified = true;
        return result;
      });
    } else if (expr.endsWith('d')) {
      const addr = expr.slice(0, -1);
      if (addr.match(/^\d+$/)) {
        const lineNum = parseInt(addr);
        const before = lines.length;
        lines = lines.filter((_, i) => i + 1 !== lineNum);
        if (lines.length !== before) modified = true;
      } else if (addr.match(/^\d+,\d+$/)) {
        const [start, end] = addr.split(',').map(Number);
        const before = lines.length;
        lines = lines.filter((_, i) => i + 1 < start || i + 1 > end);
        if (lines.length !== before) modified = true;
      }
    } else if (expr.endsWith('a\\')) {
      const text = expr.replace(/a\\$/, '').trim();
      const addrMatch = expr.match(/^(\d+)a/);
      if (addrMatch) {
        const lineNum = parseInt(addrMatch[1]);
        lines.splice(lineNum, 0, text);
        modified = true;
      }
    } else if (expr.endsWith('i\\')) {
      const text = expr.replace(/i\\$/, '').trim();
      const addrMatch = expr.match(/^(\d+)i/);
      if (addrMatch) {
        const lineNum = parseInt(addrMatch[1]);
        lines.splice(lineNum - 1, 0, text);
        modified = true;
      }
    }
  }

  if (inPlace && filepath && modified) {
    const node = findNode(state.root, filepath, state.cwd, state.home);
    if (node) {
      const updated = updateNodeAtPath(state.root, filepath, state.cwd, state.home, (n) => ({
        ...n, content: lines.join('\n'),
      }));
      return { output: '', exitCode: 0, stateOverride: { root: updated } };
    }
  }

  return { output: lines.join('\n'), exitCode: 0 };
};

export const cut: CommandHandler = (args, state) => {
  const stdin = state.stdin || '';
  const fieldIdx = args.indexOf('-f');
  const delimIdx = args.indexOf('-d');
  const fields = fieldIdx !== -1 ? args[fieldIdx + 1] : '1';
  const delimiter = delimIdx !== -1 ? args[delimIdx + 1] : '\t';
  let content = stdin;
  if (!content) {
    const filepath = args.filter(a => !a.startsWith('-'))[0];
    if (filepath) {
      const node = findNode(state.root, filepath, state.cwd, state.home);
      if (node) content = node.content || '';
    }
  }
  const fieldNums = fields.split(',').map(Number).filter(n => !isNaN(n));
  const lines = content.split('\n').filter(l => l.trim());
  const output = lines.map(l => {
    const cols = l.split(delimiter);
    return fieldNums.map(n => cols[n - 1] || '').join(delimiter);
  });
  return { output: output.join('\n'), exitCode: 0 };
};

export const uniq: CommandHandler = (args, state) => {
  const stdin = state.stdin || '';
  let content = stdin;
  if (!content) {
    const filepath = args.filter(a => !a.startsWith('-'))[0];
    if (filepath) {
      const node = findNode(state.root, filepath, state.cwd, state.home);
      if (node) content = node.content || '';
    }
  }
  const lines = content.split('\n');
  const result: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (i === 0 || lines[i] !== lines[i - 1]) {
      result.push(lines[i]);
    }
  }
  return { output: result.join('\n'), exitCode: 0 };
};

export const tr: CommandHandler = (args, state) => {
  const stdin = state.stdin || '';
  if (!stdin) return { output: '', error: 'tr: usage: tr [charset1] [charset2]', exitCode: 1 };
  if (args.length < 2) return { output: '', error: 'tr: missing operand', exitCode: 1 };
  const set1 = args[0];
  const set2 = args[1];
  const from = args.includes('-d') ? '' : set1;
  const to = args.includes('-d') ? '' : set2;
  const delete_chars = args.includes('-d') ? set1 : '';
  let result = stdin;
  if (from && to) {
    const map: Record<string, string> = {};
    for (let i = 0; i < Math.min(from.length, to.length); i++) {
      map[from[i]] = to[i];
    }
    result = Array.from(result).map(ch => map[ch] || ch).join('');
  }
  if (delete_chars) {
    const delSet = new Set(delete_chars);
    result = Array.from(result).filter(ch => !delSet.has(ch)).join('');
  }
  return { output: result, exitCode: 0 };
};
