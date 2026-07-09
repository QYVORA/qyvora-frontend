import type { CommandHandler, VFSNode } from '../../types';
import { resolvePath, findNode } from '../filesystem';

export const ls: CommandHandler = (args, state) => {
  const targetPath = args[0] || '.';
  const target = findNode(state.root, targetPath, state.cwd, state.home);
  if (!target) return { output: '', error: `ls: cannot access '${targetPath}': No such file or directory`, exitCode: 2 };
  if (target.type === 'file') return { output: target.name, exitCode: 0 };

  const showAll = args.includes('-a') || args.includes('-la') || args.includes('-al');
  const long = args.includes('-l') || args.includes('-la') || args.includes('-al');
  const dirs = args.includes('-d');

  if (dirs) {
    return { output: long
      ? `${target.permissions} ${target.owner} ${target.group} ${target.size} ${target.name}`
      : target.name,
      exitCode: 0 };
  }

  let entries = [...target.children];
  if (showAll) {
    entries = [
      { name: '.', type: 'dir', permissions: 'drwxr-xr-x', owner: state.user, group: 'qyvora-student', size: 4096, children: [] } as VFSNode,
      { name: '..', type: 'dir', permissions: 'drwxr-xr-x', owner: state.user, group: 'qyvora-student', size: 4096, children: [] } as VFSNode,
      ...entries,
    ];
  } else {
    entries = entries.filter(c => !c.name.startsWith('.'));
  }

  if (long) {
    const lines = entries.map(c => {
      const size = c.type === 'dir' ? c.size : (c.content?.length || c.size);
      return `${c.permissions}  ${c.owner.padEnd(15)} ${c.group} ${String(size).padStart(8)} ${c.name}${c.executable ? '*' : ''}`;
    });
    return { output: `total ${entries.length * 2}\n` + lines.join('\n'), exitCode: 0 };
  }

  const columns = entries.map(c => c.name + (c.type === 'dir' ? '/' : '') + (c.executable ? '*' : ''));
  return { output: columns.join('  '), exitCode: 0 };
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
