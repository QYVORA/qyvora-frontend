import type { DiagramDefinition } from '@/shared/components/diagrams/types';

export const linuxPermissionsDiagram: DiagramDefinition = {
  id: 'linux-permissions',
  type: 'system-architecture',
  renderer: 'react-flow',
  layout: 'auto',
  title: 'Linux File Permissions',
  description: 'Reading a permission string like -rwxr-xr--.',
  nodes: [
    {
      id: 'file',
      type: 'file-system',
      label: 'secret.txt',
      sublabel: '-rwxr-xr--',
      position: { x: 0, y: 0 },
      metadata: {
        explanation: 'The first character is the type (- for a file, d for a directory).',
      },
    },
    {
      id: 'owner',
      type: 'user',
      label: 'Owner',
      sublabel: 'rwx',
      position: { x: 340, y: 0 },
      metadata: { explanation: 'The owner can read, write, and execute (rwx).' },
    },
    {
      id: 'group',
      type: 'identity',
      label: 'Group',
      sublabel: 'r-x',
      position: { x: 340, y: 140 },
      metadata: { explanation: 'The group can read and execute, but not write (r-x).' },
    },
    {
      id: 'others',
      type: 'user',
      label: 'Others',
      sublabel: 'r--',
      position: { x: 340, y: 280 },
      metadata: { explanation: 'Everyone else can only read (r--).' },
    },
  ],
  edges: [
    { id: 'p-owner', source: 'file', target: 'owner', type: 'relationship' },
    { id: 'p-group', source: 'file', target: 'group', type: 'relationship' },
    { id: 'p-others', source: 'file', target: 'others', type: 'relationship' },
  ],
  animation: {
    type: 'state-transition',
    loop: false,
    autoPlay: false,
    speed: 1,
    respectReducedMotion: true,
    stages: [
      {
        id: 'file',
        duration: 1100,
        description: '1 · The permission string: - rwx r-x r--.',
        actions: [{ type: 'node-state-change', nodeId: 'file', state: 'active' }],
      },
      {
        id: 'owner',
        duration: 1100,
        description: '2 · Owner — rwx: read, write, execute.',
        actions: [
          { type: 'node-state-change', nodeId: 'file', state: 'normal' },
          { type: 'node-state-change', nodeId: 'owner', state: 'active' },
        ],
      },
      {
        id: 'group',
        duration: 1100,
        description: '3 · Group — r-x: read and execute, no write.',
        actions: [
          { type: 'node-state-change', nodeId: 'owner', state: 'normal' },
          { type: 'node-state-change', nodeId: 'group', state: 'active' },
        ],
      },
      {
        id: 'others',
        duration: 1100,
        description: '4 · Others — r--: read only.',
        actions: [
          { type: 'node-state-change', nodeId: 'group', state: 'normal' },
          { type: 'node-state-change', nodeId: 'others', state: 'active' },
        ],
      },
    ],
  },
  interaction: { selectable: true },
  accessibility: {
    ariaLabel: 'Linux file permissions for owner, group, and others',
    ariaDescription:
      'A file has permissions -rwxr-xr--: the owner can read, write and execute; the group can read and execute; others can only read.',
  },
};
