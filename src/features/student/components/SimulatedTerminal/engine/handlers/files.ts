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
  if (args.length === 0) return { output: '', error: 'touch: missing file operand', exitCode: 1 };
  let currentRoot = state.root;
  for (const filepath of args) {
    const existing = findNode(currentRoot, filepath, state.cwd, state.home);
    if (!existing) {
      const parentPath = pathDirname(resolvePath(filepath, state.cwd, state.home));
      const name = pathBasename(filepath);
      const newFile: VFSNode = {
        name, type: 'file', content: '',
        permissions: '-rw-r--r--', owner: state.user, group: state.user, size: 0, children: [],
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
      name, type: 'dir', content: '',
      permissions: 'drwxr-xr-x', owner: state.user, group: state.user, size: 4096, children: [],
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
    perms[7] = 'x'; perms[8] = 'x'; perms[9] = 'x';
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
  if (!srcNode && !symbolic) return { output: '', error: `ln: failed to create hard link '${dest}': No such file or directory`, exitCode: 1 };
  if (symbolic) {
    return { output: '', exitCode: 0 };
  }
  return { output: '', exitCode: 0 };
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

export const df: CommandHandler = (_args, _state) => {
  return {
    output: 'Filesystem     1K-blocks     Used Available Use% Mounted on\n/dev/sda1       41152768 12345678  28807090  30% /\ntmpfs            2032764        0   2032764   0% /dev/shm\n/dev/sdb1        8257536  1234567   7022969  15% /home',
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

  if (create) {
    return { output: `tar: ${archiveName}: Archived ${fileArgs.length > 0 ? fileArgs.join(', ') : '(empty)'}`, exitCode: 0 };
  }
  if (extract) {
    return { output: `tar: ${archiveName}: Extracted`, exitCode: 0 };
  }
  if (list) {
    const exampleFiles = ['README.md', 'src/', 'src/index.js', 'src/utils.js', 'package.json'];
    return { output: exampleFiles.join('\n'), exitCode: 0 };
  }
  return { output: '', error: 'tar: You must specify one of the `-c`, `-x` or `-t` options', exitCode: 1 };
};

export const zipCmd: CommandHandler = (args, state) => {
  const targets = args.filter(a => !a.startsWith('-'));
  if (targets.length < 2) return { output: '', error: 'zip: missing file operand', exitCode: 1 };
  const [archive, ...files] = targets;
  return { output: `  adding: ${files.join(', ')} (stored 0%)\nZip file: ${archive}.zip`, exitCode: 0 };
};
export const unzip: CommandHandler = (args, state) => {
  if (args.length === 0) return { output: '', error: 'unzip: missing file operand', exitCode: 1 };
  const archive = args[0];
  return { output: `Archive:  ${archive}\n  inflating: extracted_file.txt\n  inflating: data.csv`, exitCode: 0 };
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
  const scriptIdx = args.findIndex(a => a.includes('{print') || a.includes('{ print'));
  if (scriptIdx === -1 && !stdin) return { output: '', error: 'awk: usage: awk \'{print $N}\' [file]', exitCode: 1 };
  let content = stdin;
  if (!content) {
    const filepath = args[scriptIdx + 1] || args[args.length - 1];
    if (filepath && !filepath.includes('{')) {
      const node = findNode(state.root, filepath, state.cwd, state.home);
      if (node) content = node.content || '';
    }
  }
  const script = args.find(a => a.includes('{print')) || '{print $0}';
  const fieldMatch = script.match(/\$(\d+)/);
  const fieldIdx = fieldMatch ? parseInt(fieldMatch[1]) : 0;
  const lines = content.split('\n').filter(l => l.trim());
  const output = lines.map(l => {
    const fields = l.split(/\s+/);
    if (fieldIdx === 0) return l;
    return fields[fieldIdx - 1] || '';
  });
  return { output: output.join('\n'), exitCode: 0 };
};

export const sed: CommandHandler = (args, state) => {
  const stdin = state.stdin || '';
  const exprIdx = args.findIndex(a => a.startsWith('s/'));
  if (exprIdx === -1 && !stdin) return { output: '', error: 'sed: usage: sed \'s/old/new/\' [file]', exitCode: 1 };
  let content = stdin;
  if (!content) {
    const filepath = args[exprIdx + 1] || args[args.length - 1];
    if (filepath && !filepath.startsWith('s/')) {
      const node = findNode(state.root, filepath, state.cwd, state.home);
      if (node) content = node.content || '';
    }
  }
  const expr = args.find(a => a.startsWith('s/')) || 's///';
  const parts = expr.split('/');
  if (parts.length < 3) return { output: content, exitCode: 0 };
  const [_, search, replace] = parts;
  const global = expr.endsWith('/g');
  const lines = content.split('\n');
  const output = lines.map(l => {
    if (global) return l.split(search).join(replace);
    return l.replace(search, replace);
  });
  return { output: output.join('\n'), exitCode: 0 };
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
