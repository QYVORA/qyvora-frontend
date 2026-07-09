export interface VFSNode {
  type: 'file' | 'dir';
  name: string;
  content?: string;
  permissions: string;
  owner: string;
  group: string;
  size: number;
  children: VFSNode[];
  executable?: boolean;
}

export type TerminalLineType = 'input' | 'output' | 'error' | 'system' | 'prompt';

export interface TerminalLine {
  type: TerminalLineType;
  text: string;
}

export interface CommandResult {
  output: string;
  error?: string;
  exitCode: number;
}

export type CommandHandler = (
  args: string[],
  state: TerminalState,
) => CommandResult;

export interface TerminalState {
  cwd: string;
  user: string;
  hostname: string;
  home: string;
  env: Record<string, string>;
  history: string[];
  historyIndex: number;
  root: VFSNode;
  isRoot: boolean;
  aliases: Record<string, string>;
  lastExitCode: number;
}

export interface TerminalContext {
  type: 'dashboard' | 'bootcamp' | 'course';
  bootcampId?: string;
  phaseId?: string;
  roomId?: string;
  courseId?: string;
  lessonId?: string;
}

export interface SimulatedTerminalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  context?: TerminalContext;
  initialCommands?: string[];
  mode?: 'modal' | 'inline';
  title?: string;
}
