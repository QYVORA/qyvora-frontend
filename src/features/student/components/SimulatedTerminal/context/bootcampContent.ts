import type { VFSNode, TerminalState } from '../types';

export function injectBootcampContent(
  state: TerminalState,
  bootcampId: string,
  phaseId?: string,
  roomId?: string,
): TerminalState {
  const root = { ...state.root };

  let projectsDir = root.children.find(c => c.name === 'home');
  if (!projectsDir) return state;
  let homeDir = projectsDir.children.find(c => c.name === 'qyvora-student');
  if (!homeDir) return state;
  let projectsNode = homeDir.children.find(c => c.name === 'Projects');
  if (!projectsNode) return state;

  const bootcampDir: VFSNode = {
    name: 'hpb-targets',
    type: 'dir',
    children: [
      {
        name: 'README.md',
        type: 'file',
        content: `# HPB Bootcamp - Target Infrastructure\n\nBootcamp: ${bootcampId}\nPhase: ${phaseId || 'N/A'}\nRoom: ${roomId || 'N/A'}\n\nThis directory contains target configurations and\nvulnerability assessment scenarios for your current\nbootcamp phase.\n`,
        permissions: '-rw-r--r--',
        owner: 'qyvora-student',
        group: 'qyvora-student',
        size: 210,
        children: [],
      },
      {
        name: 'targets.txt',
        type: 'file',
        content: '192.168.1.10  - Web server (Apache 2.4.57)\n192.168.1.11  - Database server (MySQL 8.0)\n192.168.1.12  - File server (Samba 4.18)\n10.0.0.100    - Internal API (Node.js/Express)\n10.0.0.200    - Admin panel (hidden)\n',
        permissions: '-rw-r--r--',
        owner: 'qyvora-student',
        group: 'qyvora-student',
        size: 185,
        children: [],
      },
      {
        name: 'wordlist.txt',
        type: 'file',
        content: 'admin\nroot\nadministrator\nbackup\ntest\nuser\nmanager\nadmin2024\npassword123\nqyvora\nletmein\nwelcome\nsecret\n',
        permissions: '-rw-r--r--',
        owner: 'qyvora-student',
        group: 'qyvora-student',
        size: 105,
        children: [],
      },
    ],
    permissions: 'drwxr-xr-x',
    owner: 'qyvora-student',
    group: 'qyvora-student',
    size: 4096,
  };

  projectsNode.children = [...projectsNode.children, bootcampDir];

  return {
    ...state,
    root,
    env: {
      ...state.env,
      HPB_TARGETS: '/home/qyvora-student/Projects/hpb-targets/targets.txt',
      HPB_WORDLIST: '/home/qyvora-student/Projects/hpb-targets/wordlist.txt',
    },
  };
}
