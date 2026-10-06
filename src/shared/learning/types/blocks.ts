/**
 * LEARNING BLOCK TYPES — V2 SEMANTIC CONTENT MODEL
 * ==================================================
 * Core type definitions for the semantic learning block system.
 * 
 * Design principle: Separate WHAT we teach (content) from HOW we teach it 
 * (learning semantics) from HOW we present it (UI).
 */

import type { QuizQuestion } from '@/features/student/data/courses/types';

// ─────────────────────────────────────────────────────────────────────────────
// BASE TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type BlockType =
  | 'text'
  | 'objective'
  | 'mission'
  | 'concept'
  | 'mental-model'
  | 'diagram'
  | 'observe'
  | 'evidence'
  | 'think'
  | 'do'
  | 'command'
  | 'http'
  | 'code'
  | 'comparison'
  | 'checkpoint'
  | 'hint'
  | 'challenge'
  | 'lab'
  | 'debrief'
  | 'recall';

export interface BaseBlock {
  type: BlockType;
  id: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// NARRATIVE BLOCKS — Explanation and context
// ─────────────────────────────────────────────────────────────────────────────

/** Plain explanatory text — the reading flow */
export interface TextBlock extends BaseBlock {
  type: 'text';
  content: string; // Can be plain text or Markdown for migration compatibility
}

/** Learning outcomes — what the student should be able to do */
export interface ObjectiveBlock extends BaseBlock {
  type: 'objective';
  objectives: string[];
  title?: string; // Default: "Objectives"
}

/** Student's goal/task for this learning unit */
export interface MissionBlock extends BaseBlock {
  type: 'mission';
  mission: string;
  context?: string; // Additional background
}

/** Key idea that deserves emphasis */
export interface ConceptBlock extends BaseBlock {
  type: 'concept';
  title: string;
  content: string;
  importance?: 'core' | 'supporting'; // Visual weight
}

/** Post-activity explanation — what happened and why */
export interface DebriefBlock extends BaseBlock {
  type: 'debrief';
  title?: string; // Default: "Debrief"
  content: string;
  keyTakeaways?: string[];
}

/** Summary for retention — what to remember */
export interface RecallBlock extends BaseBlock {
  type: 'recall';
  title?: string; // Default: "Remember"
  points: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// VISUAL BLOCKS — Mental models and diagrams
// ─────────────────────────────────────────────────────────────────────────────

/** Mental model diagram — teach relationships */
export interface MentalModelBlock extends BaseBlock {
  type: 'mental-model';
  title?: string;
  nodes: Array<{
    id: string;
    label: string;
    description?: string;
  }>;
  connections: Array<{
    from: string;
    to: string;
    label?: string;
  }>;
  caption?: string;
}

/** Generic diagram block */
export interface DiagramBlock extends BaseBlock {
  type: 'diagram';
  title?: string;
  diagramType: 'flow' | 'sequence' | 'network' | 'custom';
  content: any; // Diagram-specific data structure
  caption?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// EVIDENCE BLOCKS — Show students what to notice
// ─────────────────────────────────────────────────────────────────────────────

/** Direct students to observe something specific */
export interface ObserveBlock extends BaseBlock {
  type: 'observe';
  title?: string; // Default: "Observe"
  content: string;
  artifact: 'terminal' | 'http' | 'code' | 'network' | 'file';
  artifactContent: string;
  callouts?: Array<{
    text: string;
    highlight?: string; // Text to highlight in artifact
  }>;
}

/** Terminal output, logs, evidence */
export interface EvidenceBlock extends BaseBlock {
  type: 'evidence';
  title?: string; // Default: "Evidence"
  entries: string[];
  format?: 'terminal' | 'log' | 'plain';
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERACTIVE BLOCKS — Technical artifacts
// ─────────────────────────────────────────────────────────────────────────────

/** Terminal command with explanation */
export interface CommandBlock extends BaseBlock {
  type: 'command';
  command: string;
  explanation?: {
    what: string; // What this command does
    why?: string; // Why we're running it
    watch?: string; // What to watch for in output
  };
  expectedOutput?: string;
  flags?: Array<{
    flag: string;
    description: string;
  }>;
}

/** HTTP request/response */
export interface HttpBlock extends BaseBlock {
  type: 'http';
  request?: {
    method: string;
    url: string;
    headers?: Record<string, string>;
    body?: string;
  };
  response?: {
    status: number;
    headers?: Record<string, string>;
    body?: string;
  };
  annotations?: Array<{
    target: string; // What to annotate
    label: string;
    description?: string;
  }>;
}

/** Code snippet with syntax highlighting */
export interface CodeBlock extends BaseBlock {
  type: 'code';
  language: string;
  code: string;
  filename?: string;
  highlights?: number[]; // Line numbers to emphasize
  explanation?: string;
}

/** Before/after, vulnerable/safe comparison */
export interface ComparisonBlock extends BaseBlock {
  type: 'comparison';
  title?: string;
  left: {
    label: string; // e.g., "Vulnerable"
    language?: string;
    code: string;
    explanation?: string;
  };
  right: {
    label: string; // e.g., "Safer"
    language?: string;
    code: string;
    explanation?: string;
  };
  keyDifference?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// PRACTICE BLOCKS — Active learning
// ─────────────────────────────────────────────────────────────────────────────

/** Reasoning question before revealing answer */
export interface ThinkBlock extends BaseBlock {
  type: 'think';
  question: string;
  options?: string[]; // Multiple choice options
  correctIndex?: number; // Index of correct option
  explanation?: string; // Revealed after answer
  openEnded?: boolean; // True = no validation, just prompt thinking
}

/** Action instructions */
export interface DoBlock extends BaseBlock {
  type: 'do';
  title?: string; // Default: "Try It"
  instructions: string[];
  expectedResult?: string;
  verificationHint?: string;
}

/** Learning checkpoint — quiz/flag/validation */
export interface CheckpointBlock extends BaseBlock {
  type: 'checkpoint';
  checkpointType: 'quiz' | 'flag' | 'task';
  title?: string;
  
  // Quiz checkpoint
  quiz?: {
    questions: QuizQuestion[];
    passThreshold?: number; // Percentage to pass
  };
  
  // Flag checkpoint
  flag?: {
    flagId: string;
    hint?: string;
    progressiveHints?: Array<{
      level: number;
      content: string;
    }>;
  };
  
  // Task checkpoint (manual verification)
  task?: {
    description: string;
    verificationSteps: string[];
  };
}

/** Progressive hints */
export interface HintBlock extends BaseBlock {
  type: 'hint';
  hints: Array<{
    level: number;
    label: string; // e.g., "General Guidance", "Tool Hint"
    content: string;
  }>;
}

/** Reduced-scaffolding challenge */
export interface ChallengeBlock extends BaseBlock {
  type: 'challenge';
  title: string;
  description: string;
  constraints?: string[];
  successCriteria: string[];
  resources?: string[]; // What they have available
}

/** Lab handoff */
export interface LabBlock extends BaseBlock {
  type: 'lab';
  title: string;
  labId: string;
  summary: string; // What they learned leading to this
  objectives: string[]; // What they'll do in the lab
  estimatedMinutes?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// UNION TYPE
// ─────────────────────────────────────────────────────────────────────────────

export type LearningBlock =
  | TextBlock
  | ObjectiveBlock
  | MissionBlock
  | ConceptBlock
  | MentalModelBlock
  | DiagramBlock
  | ObserveBlock
  | EvidenceBlock
  | ThinkBlock
  | DoBlock
  | CommandBlock
  | HttpBlock
  | CodeBlock
  | ComparisonBlock
  | CheckpointBlock
  | HintBlock
  | ChallengeBlock
  | LabBlock
  | DebriefBlock
  | RecallBlock;

// ─────────────────────────────────────────────────────────────────────────────
// TYPE GUARDS
// ─────────────────────────────────────────────────────────────────────────────

export function isTextBlock(block: LearningBlock): block is TextBlock {
  return block.type === 'text';
}

export function isObjectiveBlock(block: LearningBlock): block is ObjectiveBlock {
  return block.type === 'objective';
}

export function isMissionBlock(block: LearningBlock): block is MissionBlock {
  return block.type === 'mission';
}

export function isConceptBlock(block: LearningBlock): block is ConceptBlock {
  return block.type === 'concept';
}

export function isCommandBlock(block: LearningBlock): block is CommandBlock {
  return block.type === 'command';
}

export function isCheckpointBlock(block: LearningBlock): block is CheckpointBlock {
  return block.type === 'checkpoint';
}

export function isObserveBlock(block: LearningBlock): block is ObserveBlock {
  return block.type === 'observe';
}

export function isEvidenceBlock(block: LearningBlock): block is EvidenceBlock {
  return block.type === 'evidence';
}

export function isThinkBlock(block: LearningBlock): block is ThinkBlock {
  return block.type === 'think';
}

export function isDoBlock(block: LearningBlock): block is DoBlock {
  return block.type === 'do';
}

export function isHintBlock(block: LearningBlock): block is HintBlock {
  return block.type === 'hint';
}

export function isDebriefBlock(block: LearningBlock): block is DebriefBlock {
  return block.type === 'debrief';
}

export function isRecallBlock(block: LearningBlock): block is RecallBlock {
  return block.type === 'recall';
}

export function isChallengeBlock(block: LearningBlock): block is ChallengeBlock {
  return block.type === 'challenge';
}

export function isLabBlock(block: LearningBlock): block is LabBlock {
  return block.type === 'lab';
}
