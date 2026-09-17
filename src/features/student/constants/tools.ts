import { Terminal, Code2, Network } from 'lucide-react';

export interface ToolDef {
  id: 'terminal' | 'ide' | 'network-visualizer';
  label: string;
  desc: string;
  icon: typeof Terminal;
  shortcut: string;
  route: string;
}

export const TOOLS: ToolDef[] = [
  { id: 'terminal', label: 'Terminal', desc: 'Kali Linux terminal emulator', icon: Terminal, shortcut: 'Ctrl+`', route: '/dashboard/tools/terminal' },
  { id: 'ide', label: 'IDE', desc: 'Write and run Python/Bash for course exercises', icon: Code2, shortcut: 'Ctrl+Shift+I', route: '/dashboard/tools/ide' },
  { id: 'network-visualizer', label: 'Network Visualizer', desc: 'Build and explore network topologies', icon: Network, shortcut: 'Ctrl+Shift+N', route: '/dashboard/tools/network-visualizer' },
];
