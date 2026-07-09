import { createNode, addChild } from '../engine/filesystem';
import type { VFSNode } from '../types';

export function buildDefaultFilesystem(): VFSNode {
  const home = createNode('home', 'dir', { permissions: 'drwxr-xr-x', owner: 'root', group: 'root' });
  const kaliHome = createNode('kali', 'dir', { permissions: 'drwxr-xr-x', owner: 'kali', group: 'kali' });
  kaliHome.children = [
    createNode('Desktop', 'dir', { permissions: 'drwxr-xr-x', size: 4096 }),
    createNode('Documents', 'dir', { permissions: 'drwxr-xr-x', size: 4096 }),
    createNode('Downloads', 'dir', { permissions: 'drwxr-xr-x', size: 4096 }),
    createNode('Music', 'dir', { permissions: 'drwxr-xr-x', size: 4096 }),
    createNode('Pictures', 'dir', { permissions: 'drwxr-xr-x', size: 4096 }),
    createNode('Projects', 'dir', { permissions: 'drwxr-xr-x', size: 4096 }),
    createNode('Public', 'dir', { permissions: 'drwxr-xr-x', size: 4096 }),
    createNode('Templates', 'dir', { permissions: 'drwxr-xr-x', size: 4096 }),
    createNode('Videos', 'dir', { permissions: 'drwxr-xr-x', size: 4096 }),
    createNode('.bashrc', 'file', {
      content: 'export PS1="\\u@\\h:\\w\\$ "\nalias ll="ls -la"\nalias la="ls -A"\nexport EDITOR=nano\n',
      permissions: '-rw-r--r--',
      size: 104,
    }),
    createNode('.profile', 'file', {
      content: '# ~/.profile: executed by the command interpreter for login shells.\n# This file is not read by bash(1), if ~/.bash_profile or ~/.bash_login exists.\n',
      permissions: '-rw-r--r--',
      size: 160,
    }),
    createNode('welcome.txt', 'file', {
      content: 'Welcome to QYVORA Simulated Terminal!\n\nThis environment mimics a Kali Linux terminal for educational purposes.\nType "help" to see available commands.\nType "qyvora-help" for course-specific commands.\n',
      permissions: '-rw-r--r--',
      size: 185,
    }),
    createNode('.bash_logout', 'file', {
      content: '# ~/.bash_logout: executed by bash(1) when login shell exits.\n',
      permissions: '-rw-r--r--',
      size: 75,
    }),
  ];
  home.children = [kaliHome];

  const root = createNode('/', 'dir', { permissions: 'drwxr-xr-x', owner: 'root', group: 'root' });
  root.children = [
    home,
    createNode('etc', 'dir', { permissions: 'drwxr-xr-x', owner: 'root', group: 'root' }),
    createNode('usr', 'dir', { permissions: 'drwxr-xr-x', owner: 'root', group: 'root' }),
    createNode('var', 'dir', { permissions: 'drwxr-xr-x', owner: 'root', group: 'root' }),
    createNode('tmp', 'dir', { permissions: 'drwxrwxrwt', owner: 'root', group: 'root', size: 4096 }),
    createNode('root', 'dir', { permissions: 'drwx------', owner: 'root', group: 'root', size: 4096 }),
    createNode('bin', 'dir', { permissions: 'drwxr-xr-x', owner: 'root', group: 'root', size: 4096 }),
    createNode('sbin', 'dir', { permissions: 'drwxr-xr-x', owner: 'root', group: 'root', size: 4096 }),
    createNode('lib', 'dir', { permissions: 'drwxr-xr-x', owner: 'root', group: 'root', size: 4096 }),
    createNode('opt', 'dir', { permissions: 'drwxr-xr-x', owner: 'root', group: 'root', size: 4096 }),
    createNode('mnt', 'dir', { permissions: 'drwxr-xr-x', owner: 'root', group: 'root', size: 4096 }),
    createNode('media', 'dir', { permissions: 'drwxr-xr-x', owner: 'root', group: 'root', size: 4096 }),
    createNode('srv', 'dir', { permissions: 'drwxr-xr-x', owner: 'root', group: 'root', size: 4096 }),
    createNode('proc', 'dir', { permissions: 'dr-xr-xr-x', owner: 'root', group: 'root', size: 0 }),
    createNode('sys', 'dir', { permissions: 'dr-xr-xr-x', owner: 'root', group: 'root', size: 0 }),
    createNode('dev', 'dir', { permissions: 'drwxr-xr-x', owner: 'root', group: 'root', size: 0 }),
  ];

  const etc = root.children.find(c => c.name === 'etc')!;
  etc.children = [
    createNode('hostname', 'file', { content: 'kali\n', permissions: '-rw-r--r--', owner: 'root', group: 'root', size: 5 }),
    createNode('hosts', 'file', { content: '127.0.0.1\tlocalhost\n127.0.1.1\tkali\n::1\t\tlocalhost ip6-localhost ip6-loopback\n', permissions: '-rw-r--r--', owner: 'root', group: 'root', size: 95 }),
    createNode('passwd', 'file', { content: 'root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nkali:x:1000:1000:Kali,,,:/home/kali:/bin/bash\n', permissions: '-rw-r--r--', owner: 'root', group: 'root', size: 128 }),
    createNode('shadow', 'file', { content: 'root:*:19712:0:99999:7:::\ndaemon:*:19712:0:99999:7:::\nkali:$6$demo$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx:19712:0:99999:7:::\n', permissions: '-rw-r-----', owner: 'root', group: 'shadow', size: 164 }),
    createNode('os-release', 'file', { content: 'PRETTY_NAME="Kali GNU/Linux Rolling"\nNAME="Kali GNU/Linux"\nID=kali\nVERSION_ID="2024.1"\nVERSION="2024.1"\n', permissions: '-rw-r--r--', owner: 'root', group: 'root', size: 112 }),
  ];

  const usr = root.children.find(c => c.name === 'usr')!;
  usr.children = [
    createNode('bin', 'dir', { permissions: 'drwxr-xr-x', owner: 'root', group: 'root', size: 4096 }),
    createNode('share', 'dir', { permissions: 'drwxr-xr-x', owner: 'root', group: 'root', size: 4096 }),
    createNode('lib', 'dir', { permissions: 'drwxr-xr-x', owner: 'root', group: 'root', size: 4096 }),
  ];

  return root;
}
