import { Terminal, Code2, Network } from 'lucide-react';

export interface ToolDef {
  id: 'terminal' | 'ide' | 'network-visualizer';
  labelKey: string;
  descKey: string;
  icon: typeof Terminal;
  shortcut: string;
  route: string;
}

export const TOOLS: ToolDef[] = [
  { id: 'terminal', labelKey: 'student.tools.terminal', descKey: 'student.tools.terminalDesc', icon: Terminal, shortcut: 'Ctrl+`', route: '/dashboard/tools/terminal' },
  { id: 'ide', labelKey: 'student.tools.ide', descKey: 'student.tools.ideDesc', icon: Code2, shortcut: 'Ctrl+Shift+I', route: '/dashboard/tools/ide' },
  { id: 'network-visualizer', labelKey: 'student.tools.networkVisualizer', descKey: 'student.tools.networkVisualizerDesc', icon: Network, shortcut: 'Ctrl+Shift+N', route: '/dashboard/tools/network-visualizer' },
];
