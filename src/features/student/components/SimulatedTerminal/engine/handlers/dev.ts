import type { CommandHandler } from '../../types';

export const python3: CommandHandler = (args, state) => {
  if (args.includes('--version') || args.includes('-V')) {
    return { output: 'Python 3.11.8', exitCode: 0 };
  }
  if (args.length === 0) {
    return { output: 'Python 3.11.8 (main, Feb 12 2024, 12:00:00)\n[GCC 12.2.0] on linux\nType "help", "copyright", "credits" or "license" for more information.\n>>> ', exitCode: 0, interactive: true };
  }
  const script = args.join(' ');
  if (script.includes('print')) {
    const match = script.match(/print\(['"](.+)['"]\)/);
    return { output: match ? match[1] : '', exitCode: 0 };
  }
  if (script.includes('1+1')) return { output: '2', exitCode: 0 };
  if (script.includes('import')) return { output: '', exitCode: 0 };
  return { output: 'Traceback (most recent call last):\n  File "<stdin>", line 1, in <module>\nNameError: name \'' + script.split(' ')[0] + '\' is not defined', exitCode: 1 };
};

export const node: CommandHandler = (args, state) => {
  if (args.includes('--version') || args.includes('-v')) {
    return { output: 'v20.11.1', exitCode: 0 };
  }
  if (args.join(' ').includes('console.log')) {
    const match = args.join(' ').match(/console\.log\(['"](.+)['"]\)/);
    return { output: match ? match[1] : 'undefined', exitCode: 0 };
  }
  if (args.length > 0 && !args[0].startsWith('-')) {
    return { output: '', exitCode: 0 };
  }
  return { output: 'Welcome to Node.js v20.11.1.\nType ".help" for more information.\n> ', exitCode: 0, interactive: true };
};

export const git: CommandHandler = (args, state) => {
  if (args.length === 0) {
    return { output: 'usage: git [--version] [--help] [-C <path>] [-c <name>=<value>]\n           [--exec-path[=<path>]] [--html-path] [--man-path] [--info-path]\n           [-p | --paginate | -P | --no-pager] [--no-replace-objects] [--bare]\n           [--git-dir=<path>] [--work-tree=<path>] [--namespace=<name>\n           [--super-prefix=<path>] [--config-env=<name>=<envvar>]\n           <command> [<args>]', exitCode: 1 };
  }
  const subcommand = args[0];
  if (subcommand === 'init') {
    return { output: `Initialized empty Git repository in ${state.cwd}/.git/`, exitCode: 0 };
  }
  if (subcommand === 'status') {
    return { output: 'On branch main\nNo commits yet\n\nChanges to be committed:\n  (use "git rm --cached <file>..." to unstage)\n\tnew file:   README.md\n\nUntracked files:\n  (use "git add <file>..." to include in what will be committed)\n\tmain.py\n\tutils.py', exitCode: 0 };
  }
  if (subcommand === 'add') {
    return { output: '', exitCode: 0 };
  }
  if (subcommand === 'commit') {
    return { output: '[main (root-commit) a1b2c3d] Initial commit\n 1 file changed, 1 insertion(+)\n create mode 100644 README.md', exitCode: 0 };
  }
  if (subcommand === 'log') {
    return { output: 'commit a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0 (HEAD -> main)\nAuthor: QYVORA Student <student@qyvora.io>\nDate:   ' + new Date().toString() + '\n\n    Initial commit', exitCode: 0 };
  }
  if (subcommand === 'branch') {
    return { output: '* main\ndev\nfeature/auth', exitCode: 0 };
  }
  if (subcommand === 'checkout') {
    return { output: `Switched to branch '${args[1] || 'main'}'`, exitCode: 0 };
  }
  if (subcommand === 'diff') {
    return { output: 'diff --git a/README.md b/README.md\nindex e69de29..d95f3ad 100644\n--- a/README.md\n+++ b/README.md\n@@ -0,0 +1 @@\n+# QYVORA Bootcamp Project', exitCode: 0 };
  }
  if (subcommand === 'push') {
    return { output: 'Enumerating objects: 3, done.\nCounting objects: 100% (3/3), done.\nDelta compression using up to 4 threads\nCompressing objects: 100% (2/2), done.\nWriting objects: 100% (3/3), 312 bytes | 312.00 KiB/s, done.\nTotal 3 (delta 0), reused 0 (delta 0)\nTo https://github.com/qyvora/student-project.git\n * [new branch]      main -> main', exitCode: 0 };
  }
  return { output: `git: '${subcommand}' is not a git command. See 'git --help'.`, exitCode: 1 };
};

export const pip: CommandHandler = (args, state) => {
  if (args.length === 0) return { output: 'Usage: pip <command> [options]', exitCode: 1 };
  const subcommand = args[0];
  if (subcommand === 'list') {
    return { output: 'Package           Version\n---------------- -------\npip               24.0\nsetuptools        69.1.0\nrequests          2.31.0\nurllib3           2.2.0\nbeautifulsoup4    4.12.3\nflask             3.0.2\nnumpy             1.26.4\ncryptography      42.0.5\nscapy             2.5.0\nparamiko          3.4.0', exitCode: 0 };
  }
  if (subcommand === 'install') {
    return { output: 'Collecting ' + (args[1] || 'package') + '\n  Downloading ' + (args[1] || 'package') + '-1.0.0-py3-none-any.whl (15 kB)\nInstalling collected packages: ' + (args[1] || 'package') + '\nSuccessfully installed ' + (args[1] || 'package') + '-1.0.0', exitCode: 0 };
  }
  if (subcommand === 'show') {
    return { output: 'Name: ' + (args[1] || 'package') + '\nVersion: 1.0.0\nSummary: A Python package\nHome-page: https://pypi.org/project/' + (args[1] || 'package') + '\nLicense: MIT\nLocation: /usr/lib/python3/dist-packages\nRequires: \nRequired-by: ', exitCode: 0 };
  }
  return { output: `Unknown command: ${subcommand}`, exitCode: 1 };
};

export const apt: CommandHandler = (args, state) => {
  if (args.length === 0) return { output: 'apt 2.7.6 (amd64)\nUsage: apt [options] command\n\nMost used commands:\n  update - update list of available packages\n  install - install packages\n  remove - remove packages\n  upgrade - upgrade the system', exitCode: 0 };
  const subcommand = args[0];
  if (subcommand === 'update') {
    return { output: 'Hit:1 http://kali.download/kali kali-rolling InRelease\nReading package lists... Done', exitCode: 0 };
  }
  if (subcommand === 'install') {
    const pkg = args[1] || 'package';
    return { output: `Reading package lists... Done\nBuilding dependency tree... Done\nReading state information... Done\nThe following NEW packages will be installed:\n  ${pkg}\n0 upgraded, 1 newly installed, 0 to remove and 0 not upgraded.\nNeed to get ${Math.floor(Math.random() * 10000 + 1000)} kB of archives.\nAfter this operation, ${Math.floor(Math.random() * 50000 + 10000)} kB of additional disk space will be used.\nGet:1 http://kali.download/kali kali-rolling/main amd64 ${pkg} amd64 ${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 9)}-kali1 [${Math.floor(Math.random() * 5000 + 500)} kB]\nFetched ${Math.floor(Math.random() * 5000 + 500)} kB in ${Math.floor(Math.random() * 5 + 1)}s (${Math.floor(Math.random() * 5000 + 1000)} kB/s)\nSelecting previously unselected package ${pkg}.\n(Reading database ... ${Math.floor(Math.random() * 100000 + 200000)} files and directories currently installed.)\nPreparing to unpack .../${pkg}_${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 9)}-kali1_amd64.deb ...\nUnpacking ${pkg} (${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 9)}-kali1) ...\nSetting up ${pkg} (${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 9)}-kali1) ...\nProcessing triggers for libc-bin (2.37-15) ...`, exitCode: 0 };
  }
  return { output: `E: Invalid operation ${subcommand}`, exitCode: 1 };
};

export const npm: CommandHandler = (args, state) => {
  if (args.length === 0) return { output: 'Usage: npm <command>', exitCode: 1 };
  const subcommand = args[0];
  if (subcommand === 'init') {
    return { output: 'This utility will walk you through creating a package.json file.\nPress ^C at any time to quit.\npackage name: (project) \nversion: (1.0.0) \ndescription: \nentry point: (index.js) \ntest command: \ngit repository: \nkeywords: \nauthor: \nlicense: (ISC) \nAbout to write to /home/kali/Projects/project/package.json:\n\n{\n  "name": "project",\n  "version": "1.0.0",\n  "description": "",\n  "main": "index.js",\n  "scripts": {},\n  "author": "",\n  "license": "ISC"\n}\n\nIs this OK? (yes) ', exitCode: 0, interactive: true };
  }
  if (subcommand === 'install' || subcommand === 'i') {
    const pkg = args[1] || '';
    if (!pkg) {
      return { output: 'npm warn You must provide a package name to install\nnpm ERR! code EUSAGE\nnpm ERR! npm install\nnpm ERR! A complete log of this run can be found in:\nnpm ERR!     /home/kali/.npm/_logs/' + new Date().toISOString().replace(/:/g, '-') + '-0000-debug.log', exitCode: 1 };
    }
    return { output: `\nadded 1${Math.floor(Math.random() * 100)} packages in ${Math.floor(Math.random() * 10 + 2)}s\n\n${Math.floor(Math.random() * 50)} packages are looking for funding\n  run "npm fund" for details`, exitCode: 0 };
  }
  if (subcommand === 'run') {
    return { output: `> project@1.0.0 ${args[1] || 'start'}\n> node index.js\n\nServer running on http://localhost:3000`, exitCode: 0 };
  }
  if (subcommand === 'test') {
    return { output: `> project@1.0.0 test\n> echo "Error: no test specified"\n\nError: no test specified`, exitCode: 1 };
  }
  return { output: `Unknown command: npm ${subcommand}`, exitCode: 1 };
};

export const docker: CommandHandler = (args, state) => {
  if (args.length === 0) return { output: 'Usage: docker [OPTIONS] COMMAND', exitCode: 1 };
  const subcommand = args[0];
  if (subcommand === 'ps') {
    const all = args.includes('-a');
    const containers = all
      ? [
          { id: 'a1b2c3d4e5f6', image: 'nginx:latest', cmd: '/docker-entrypoint.sh nginx', created: '2 days ago', status: 'Up 2 days', ports: '0.0.0.0:80->80/tcp', name: 'web-server' },
          { id: 'b2c3d4e5f6a1', image: 'mysql:8.0', cmd: 'docker-entrypoint.sh mysqld', created: '3 days ago', status: 'Up 3 days', ports: '0.0.0.0:3306->3306/tcp', name: 'db-server' },
          { id: 'c3d4e5f6a1b2', image: 'redis:7-alpine', cmd: 'docker-entrypoint.sh redis', created: '5 days ago', status: 'Exited (0) 2 days ago', ports: '', name: 'cache-server' },
        ]
      : [
          { id: 'a1b2c3d4e5f6', image: 'nginx:latest', cmd: '/docker-entrypoint.sh nginx', created: '2 days ago', status: 'Up 2 days', ports: '0.0.0.0:80->80/tcp', name: 'web-server' },
          { id: 'b2c3d4e5f6a1', image: 'mysql:8.0', cmd: 'docker-entrypoint.sh mysqld', created: '3 days ago', status: 'Up 3 days', ports: '0.0.0.0:3306->3306/tcp', name: 'db-server' },
        ];
    const header = 'CONTAINER ID   IMAGE          COMMAND                  CREATED        STATUS        PORTS                    NAMES';
    const lines = containers.map(c =>
      `${c.id.padEnd(14)} ${c.image.padEnd(14)} ${c.cmd.padEnd(24)} ${c.created.padEnd(13)} ${c.status.padEnd(13)} ${c.ports.padEnd(24)} ${c.name}`
    );
    return { output: [header, ...lines].join('\n'), exitCode: 0 };
  }
  if (subcommand === 'images') {
    const header = 'REPOSITORY   TAG       IMAGE ID       CREATED       SIZE';
    const lines = [
      'nginx        latest    12a34b56c78d   2 weeks ago   192MB',
      'mysql        8.0       34b56c78d90e   3 weeks ago   514MB',
      'redis        7-alpine  56c78d90e12f   5 weeks ago   32.4MB',
      'python       3.11      78d90e12f34a   2 months ago  919MB',
    ];
    return { output: [header, ...lines].join('\n'), exitCode: 0 };
  }
  if (subcommand === 'run') {
    const image = args.find(a => !a.startsWith('-')) || 'ubuntu:latest';
    return { output: `Unable to find image '${image}' locally\n${image}: Pulling from library/${image.split(':')[0]}\nDownloaded newer image for ${image}\n${Math.random().toString(36).slice(2, 14)}`, exitCode: 0 };
  }
  if (subcommand === 'build') {
    return { output: 'Step 1/5 : FROM ubuntu:latest\nStep 2/5 : RUN apt-get update\n ---> Running in ' + Math.random().toString(36).slice(2, 14) + '\nRemoving intermediate container ' + Math.random().toString(36).slice(2, 14) + '\n ---> ' + Math.random().toString(36).slice(2, 14) + '\nSuccessfully built ' + Math.random().toString(36).slice(2, 14), exitCode: 0 };
  }
  return { output: `docker: '${subcommand}' is not a docker command.`, exitCode: 1 };
};

export const tmux: CommandHandler = (args, state) => {
  if (args.length === 0) return { output: 'usage: tmux [-ClLv] [-c shell-command] [-f file] [-S socket-path] [command]', exitCode: 1 };
  const subcommand = args[0];
  if (subcommand === 'new' || subcommand === 'new-session') {
    const name = args.indexOf('-s') !== -1 ? args[args.indexOf('-s') + 1] : Math.floor(Math.random() * 10000).toString();
    return { output: `Session '${name}' created.`, exitCode: 0 };
  }
  if (subcommand === 'ls' || subcommand === 'list-sessions') {
    return { output: '0: 1 windows (created ' + new Date().toISOString() + ') [80x24]\n1: 2 windows (created ' + new Date(Date.now() - 3600000).toISOString() + ') [80x24]', exitCode: 0 };
  }
  if (subcommand === 'attach' || subcommand === 'attach-session') {
    return { output: `Attached to session '${args[1] || '0'}'`, exitCode: 0 };
  }
  if (subcommand === 'kill-session') {
    return { output: `Session '${args[1] || '0'}' killed.`, exitCode: 0 };
  }
  return { output: `tmux: unknown command -- ${subcommand}`, exitCode: 1 };
};
export { tmux as screen };

export const make: CommandHandler = (args, state) => {
  if (args.includes('clean')) return { output: 'rm -f *.o *.obj main\nrm -rf dist/', exitCode: 0 };
  if (args.includes('install')) return { output: 'install -m 755 build/program /usr/local/bin/', exitCode: 0 };
  return { output: 'gcc -Wall -O2 -c main.c -o main.o\ngcc -Wall -O2 -c utils.c -o utils.o\ngcc main.o utils.o -o build/program', exitCode: 0 };
};

export const gcc: CommandHandler = (args, state) => {
  const files = args.filter(a => !a.startsWith('-'));
  const outIdx = args.indexOf('-o');
  const output = outIdx !== -1 ? args[outIdx + 1] : 'a.out';
  if (files.length === 0) return { output: 'gcc: fatal error: no input files', exitCode: 1 };
  return { output: `gcc: warning: ${files.join(', ')}: linker input file unused because linking not done`, exitCode: 0 };
};
