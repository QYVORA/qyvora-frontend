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
  mtime?: Date;
  symlink?: string;
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
  stdin?: string;
  streamLines?: string[];
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
  inMsfConsole?: boolean;
  stdin?: string;
  discoveredIps: string[];
}

export interface PipelineStage {
  command: string;
  args: string[];
  stdin?: string;
  stdoutRedirect?: { path: string; append: boolean };
  stdinRedirect?: { path: string };
  pipeToNext?: boolean;
}

export interface TerminalContext {
  type: 'dashboard' | 'bootcamp' | 'course' | 'lab';
  labId?: string;
  scenarioId?: string;
  bootcampId?: string;
  phaseId?: string;
  roomId?: string;
  courseId?: string;
  lessonId?: string;
}

export interface InternalCommandResult extends CommandResult {
  stateOverride?: Partial<Pick<TerminalState, 'cwd' | 'env' | 'aliases' | 'root' | 'isRoot' | 'history' | 'inMsfConsole' | 'discoveredIps'>>;
  clearLine?: boolean;
  exit?: boolean;
  interactive?: boolean;
}

export interface CommandTiming {
  startupDelay?: number;
  lineDelay: number | [number, number];
  mode: 'instant' | 'batched' | 'line';
  batchSize?: number;
  batchDelay?: number | [number, number];
}

export interface StreamingDescriptor {
  streamLines: string[];
  timing: CommandTiming;
}

export interface ProcessInputResult {
  lines: TerminalLine[];
  newState: TerminalState;
  _clearLine?: boolean;
  _exit?: boolean;
  streaming?: StreamingDescriptor;
}

export interface SimulatedTerminalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  context?: TerminalContext;
  initialCommands?: string[];
  mode?: 'modal' | 'inline';
  size?: 'normal' | 'compact';
  title?: string;
}
