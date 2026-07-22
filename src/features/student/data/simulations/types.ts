export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type LabCategory =
  | 'privilege-escalation'
  | 'password-cracking'
  | 'sql-injection'
  | 'osint'
  | 'kill-chain';

export interface LabScenario {
  id: string;
  title: string;
  description: string;
  category: LabCategory;
  difficulty: Difficulty;
  cpReward: number;
  estimatedMinutes: number;
  skills: string[];
  hints: string[];
  steps: LabStep[];
}

export interface LabStep {
  id: string;
  instruction: string;
  expectedAction?: string;
  hint?: string;
  completed: boolean;
}

export interface LabProgress {
  scenarioId: string;
  completed: boolean;
  startedAt?: number;
  completedAt?: number;
  hintsUsed: number;
  stepsCompleted: number;
  totalSteps: number;
}

export interface SqlInjectionTarget {
  id: string;
  name: string;
  url: string;
  parameter: string;
  injectable: boolean;
  database: string;
  tables: SqlTable[];
  difficulty: Difficulty;
}

export interface SqlTable {
  name: string;
  columns: string[];
  rows: Record<string, string>[];
}

export interface PrivescScenario {
  id: string;
  title: string;
  description: string;
  technique: string;
  difficulty: Difficulty;
  hints: string[];
  filesystem: Record<string, string>;
  solutionCommands: string[];
  story?: LabStory;
  villain?: {
    name: string;
    alias: string;
    description: string;
    avatar: string;
  };
}

// ── Lab Story System ───────────────────────────────────────────────────────
export interface LabStory {
  title: string;
  chapters: LabChapter[];
}

export interface LabChapter {
  id: string;
  title: string;
  narrative: string;
  triggers: ChapterTrigger[];
  hint?: string;
}

export interface ChapterTrigger {
  type: 'command' | 'output_contains' | 'file_access' | 'privilege_check';
  value: string;
}

// ── Lab Connection State ────────────────────────────────────────────────────
export interface LabConnectionState {
  connectionId: string;
  targetIp: string;
  expiresAt: string;
  commandsRun: string[];
  chaptersCompleted: string[];
  currentChapterId: string;
}
