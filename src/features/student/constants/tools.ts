import { Terminal, Code2, Network } from 'lucide-react';

export interface ToolDef {
  id: 'terminal' | 'ide' | 'network-visualizer';
  label: string;
  description: string;
  icon: typeof Terminal;
  shortcut: string;
  route: string;
}

export const TOOLS: ToolDef[] = [
  { id: 'terminal', label: 'Terminal', description: 'Kali Linux terminal emulator', icon: Terminal, shortcut: 'Ctrl+`', route: '/dashboard/tools/terminal' },
  { id: 'ide', label: 'IDE', description: 'Write and run Python/Bash', icon: Code2, shortcut: 'Ctrl+Shift+I', route: '/dashboard/tools/ide' },
  { id: 'network-visualizer', label: 'Network Visualizer', description: 'Build network topologies', icon: Network, shortcut: 'Ctrl+Shift+N', route: '/dashboard/tools/network-visualizer' },
];
