import type { CommandHandler, VFSNode } from '../../types';
import { findNode, resolvePath, pathBasename, pathDirname } from '../filesystem';

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

  const text = args
    .map(arg => {
      if (arg.startsWith('$')) {
        const varName = arg.slice(1);
        return state.env[varName] || '';
      }
      return arg;
    })
    .join(' ');

  return { output: text, exitCode: 0 };
};

export const touch: CommandHandler = (args, state) => {
  if (args.length === 0) return { output: '', error: 'touch: missing file operand', exitCode: 1 };

  let currentRoot = state.root;
  for (const filepath of args) {
    const existing = findNode(currentRoot, filepath, state.cwd, state.home);
    if (!existing) {
      const parentPath = pathDirname(resolvePath(filepath, state.cwd, state.home));
      const name = pathBasename(filepath);
      const newFile: VFSNode = {
        name,
        type: 'file',
        content: '',
        permissions: '-rw-r--r--',
        owner: state.user,
        group: state.user,
        size: 0,
        children: [],
      };
      const parent = findNode(currentRoot, parentPath, '/', state.home);
      if (parent && parent.type === 'dir') {
        parent.children.push(newFile);
      }
    }
  }

  return { output: '', exitCode: 0, stateOverride: { root: currentRoot } };
};

export const mkdir: CommandHandler = (args, state) => {
  if (args.length === 0) return { output: '', error: 'mkdir: missing operand', exitCode: 1 };

  let currentRoot = state.root;
  for (const dirpath of args) {
    const existing = findNode(currentRoot, dirpath, state.cwd, state.home);
    if (existing) {
      return { output: '', error: `mkdir: cannot create directory '${dirpath}': File exists`, exitCode: 1 };
    }
    const name = pathBasename(dirpath);
    const newDir: VFSNode = {
      name,
      type: 'dir',
      content: '',
      permissions: 'drwxr-xr-x',
      owner: state.user,
      group: state.user,
      size: 4096,
      children: [],
    };
    const parentPath = pathDirname(resolvePath(dirpath, state.cwd, state.home));
    const parent = findNode(currentRoot, parentPath, '/', state.home);
    if (parent && parent.type === 'dir') {
      parent.children.push(newDir);
    }
  }

  return { output: '', exitCode: 0, stateOverride: { root: currentRoot } };
};

export const rm: CommandHandler = (args, state) => {
  if (args.length === 0) return { output: '', error: 'rm: missing operand', exitCode: 1 };

  const recursive = args.includes('-r') || args.includes('-rf');
  const force = args.includes('-f') || args.includes('-rf');
  const targets = args.filter(a => !a.startsWith('-'));

  let currentRoot = state.root;
  for (const filepath of targets) {
    const node = findNode(currentRoot, filepath, state.cwd, state.home);
    if (!node) {
      if (!force) return { output: '', error: `rm: cannot remove '${filepath}': No such file or directory`, exitCode: 1 };
      continue;
    }
    if (node.type === 'dir' && !recursive) {
      return { output: '', error: `rm: cannot remove '${filepath}': Is a directory`, exitCode: 1 };
    }
    const parentPath = pathDirname(resolvePath(filepath, state.cwd, state.home));
    const name = pathBasename(filepath);
    const parent = findNode(currentRoot, parentPath, '/', state.home);
    if (parent) {
      parent.children = parent.children.filter(c => c.name !== name);
    }
  }

  return { output: '', exitCode: 0, stateOverride: { root: currentRoot } };
};

export const cp: CommandHandler = (args, state) => {
  const recursive = args.includes('-r') || args.includes('-rf');
  const targets = args.filter(a => !a.startsWith('-'));

  if (targets.length < 2) return { output: '', error: 'cp: missing file operand', exitCode: 1 };

  const [src, dest] = targets;
  const srcNode = findNode(state.root, src, state.cwd, state.home);
  if (!srcNode) return { output: '', error: `cp: cannot stat '${src}': No such file or directory`, exitCode: 1 };
  if (srcNode.type === 'dir' && !recursive) {
    return { output: '', error: `cp: omitting directory '${src}'`, exitCode: 1 };
  }

  const destParentPath = pathDirname(resolvePath(dest, state.cwd, state.home));
  const destName = pathBasename(dest);
  const destParent = findNode(state.root, destParentPath, '/', state.home);
  if (!destParent || destParent.type !== 'dir') {
    return { output: '', error: `cp: cannot create regular file '${dest}': No such file or directory`, exitCode: 1 };
  }

  const copy = { ...srcNode, name: destName };
  destParent.children.push(copy);

  return { output: '', exitCode: 0 };
};

export const mv: CommandHandler = (args, state) => {
  const targets = args.filter(a => !a.startsWith('-'));

  if (targets.length < 2) return { output: '', error: 'mv: missing file operand', exitCode: 1 };

  const [src, dest] = targets;
  const srcNode = findNode(state.root, src, state.cwd, state.home);
  if (!srcNode) return { output: '', error: `mv: cannot stat '${src}': No such file or directory`, exitCode: 1 };

  const srcParentPath = pathDirname(resolvePath(src, state.cwd, state.home));
  const srcName = pathBasename(src);
  const srcParent = findNode(state.root, srcParentPath, '/', state.home);
  if (srcParent) {
    srcParent.children = srcParent.children.filter(c => c.name !== srcName);
  }

  const destParentPath = pathDirname(resolvePath(dest, state.cwd, state.home));
  const destName = pathBasename(dest);
  const destParent = findNode(state.root, destParentPath, '/', state.home);
  if (!destParent || destParent.type !== 'dir') {
    return { output: '', error: `mv: cannot move '${src}' to '${dest}': No such file or directory`, exitCode: 1 };
  }

  const moved = { ...srcNode, name: destName };
  destParent.children.push(moved);

  return { output: '', exitCode: 0 };
};

export const chmod: CommandHandler = (args, state) => {
  if (args.length < 2) return { output: '', error: 'chmod: missing operand', exitCode: 1 };

  const mode = args[0];
  const filepath = args[1];
  const node = findNode(state.root, filepath, state.cwd, state.home);
  if (!node) return { output: '', error: `chmod: cannot access '${filepath}': No such file or directory`, exitCode: 1 };

  if (mode === '+x' || mode === 'a+x') {
    node.executable = true;
    const perms = node.permissions.split('');
    perms[7] = 'x';
    perms[8] = 'x';
    perms[9] = 'x';
    node.permissions = perms.join('');
  }

  return { output: '', exitCode: 0 };
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
  const showColor = args.includes('--color=auto');
  const noColor = args.includes('--color=never');
  const ignoreCase = args.includes('-i') || args.includes('--ignore-case');
  const filterArgs = args.filter(a => !a.startsWith('--') && !a.startsWith('-'));

  if (filterArgs.length < 1) return { output: '', error: 'grep: missing pattern', exitCode: 2 };
  if (filterArgs.length < 2) return { output: '', exitCode: 1 };

  const pattern = filterArgs[0];
  const filepath = filterArgs[1];
  const node = findNode(state.root, filepath, state.cwd, state.home);
  if (!node) return { output: '', error: `grep: ${filepath}: No such file or directory`, exitCode: 2 };

  const content = node.content || '';
  const lines = content.split('\n');
  const matching = lines.filter(l => {
    const match = ignoreCase ? l.toLowerCase().includes(pattern.toLowerCase()) : l.includes(pattern);
    if (!match && pattern.startsWith('^')) {
      const regex = new RegExp(pattern, ignoreCase ? 'i' : '');
      return regex.test(l);
    }
    return match;
  });

  if (matching.length === 0) return { output: '', exitCode: 1 };
  return { output: matching.join('\n'), exitCode: 0 };
};

export const find: CommandHandler = (args, state) => {
  const startPath = args[0] || '.';
  const startNode = findNode(state.root, startPath, state.cwd, state.home);
  if (!startNode) return { output: '', error: `find: '${startPath}': No such file or directory`, exitCode: 1 };

  const nameIdx = args.indexOf('-name');
  const typeIdx = args.indexOf('-type');
  const namePattern = nameIdx !== -1 ? args[nameIdx + 1] : null;
  const typeFilter = typeIdx !== -1 ? args[typeIdx + 1] : null;

  const results: string[] = [];

  function walk(node: VFSNode, path: string) {
    if (path !== '/') {
      let match = true;
      if (namePattern) {
        const regex = new RegExp('^' + namePattern.replace(/\*/g, '.*') + '$');
        match = regex.test(node.name);
      }
      if (typeFilter && node.type !== typeFilter) match = false;
      if (match) results.push(path);
    }
    if (node.type === 'dir') {
      node.children.forEach(c => walk(c, path === '/' ? `/${c.name}` : `${path}/${c.name}`));
    }
  }

  walk(startNode, resolvePath(startPath, state.cwd, state.home));

  return { output: results.length > 0 ? results.join('\n') : '', exitCode: 0 };
};

export const sort: CommandHandler = (args, state) => {
  const reverse = args.includes('-r');
  const fileArgs = args.filter(a => !a.startsWith('-'));

  if (fileArgs.length === 0) return { output: '', exitCode: 0 };

  const node = findNode(state.root, fileArgs[0], state.cwd, state.home);
  if (!node) return { output: '', error: `sort: ${fileArgs[0]}: No such file or directory`, exitCode: 1 };

  const lines = (node.content || '').split('\n').filter(l => l);
  const sorted = reverse ? lines.sort().reverse() : lines.sort();
  return { output: sorted.join('\n'), exitCode: 0 };
};
