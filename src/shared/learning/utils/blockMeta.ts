/**
 * BLOCK META
 * ==========
 * Presentation metadata for learning blocks — deck labels, titles,
 * XP rewards and interactivity classification.
 *
 * XP model:
 *   - Read cards  (text/concept/recall/debrief/observe/evidence/code/map)   : 10 XP
 *   - Interact    (think/do/command/challenge/comparison/http/lab)           : 15 XP
 *   - Playground                                                             : 20 XP
 *   - Checkpoint  (quiz/flag gate)                                           : 25 XP
 * Interactive bonuses are awarded on a correct resolution on top of the card.
 */

import type { LearningBlock, BlockType } from '../types/blocks';

export const BLOCK_LABELS: Record<BlockType, string> = {
  text: 'Read',
  objective: 'Objectives',
  mission: 'Mission',
  concept: 'Concept',
  'mental-model': 'Map',
  diagram: 'Diagram',
  observe: 'Observe',
  evidence: 'Evidence',
  think: 'Think',
  do: 'Do',
  command: 'Command',
  http: 'HTTP',
  code: 'Code',
  comparison: 'Compare',
  checkpoint: 'Checkpoint',
  hint: 'Hint',
  challenge: 'Challenge',
  lab: 'Lab',
  playground: 'Playground',
  debrief: 'Debrief',
  recall: 'Remember',
};

const READ_TYPES: ReadonlySet<BlockType> = new Set<BlockType>([
  'text',
  'concept',
  'recall',
  'debrief',
  'observe',
  'evidence',
  'code',
  'mental-model',
  'diagram',
]);

const INTERACTIVE_TYPES: ReadonlySet<BlockType> = new Set<BlockType>([
  'think',
  'do',
  'command',
  'challenge',
  'lab',
  'comparison',
  'http',
  'playground',
  'checkpoint',
]);

export const READ_XP = 10;
export const INTERACT_XP = 15;
export const PLAYGROUND_XP = 20;
export const CHECKPOINT_XP = 25;

export function blockLabel(type: BlockType): string {
  return BLOCK_LABELS[type] ?? 'Card';
}

export function blockXp(block: Pick<LearningBlock, 'type'>): number {
  switch (block.type) {
    case 'checkpoint':
      return CHECKPOINT_XP;
    case 'playground':
      return PLAYGROUND_XP;
    case 'think':
    case 'do':
    case 'command':
    case 'challenge':
    case 'lab':
    case 'comparison':
    case 'http':
      return INTERACT_XP;
    default:
      return READ_XP;
  }
}

export function isReadCard(block: Pick<LearningBlock, 'type'>): boolean {
  return READ_TYPES.has(block.type);
}

export function isInteractiveCard(block: Pick<LearningBlock, 'type'>): boolean {
  return INTERACTIVE_TYPES.has(block.type);
}

export function isCheckpointCard(block: Pick<LearningBlock, 'type'>): boolean {
  return block.type === 'checkpoint';
}

/**
 * Does this block carry an in-flow validation moment (quiz/flag/think/answerable
 * playground)? These are combo-sensitive: a correct resolution earns a bonus and
 * extends the combo; skipping one (or failing it) resets the combo.
 */
export function hasValidation(block: Pick<LearningBlock, 'type'> & { expectedOutput?: string }): boolean {
  switch (block.type) {
    case 'checkpoint':
      return true;
    case 'think':
      return true;
    case 'playground':
      return Boolean(block.expectedOutput);
    default:
      return false;
  }
}

/** Short human title for a block, used for deck row labels. */
export function blockTitle(block: LearningBlock, fallback?: string): string {
  switch (block.type) {
    case 'mission':
      return block.mission;
    case 'objective':
      return block.title ?? 'Objectives';
    case 'concept':
      return block.title;
    case 'mental-model':
      return block.title ?? 'Relationships';
    case 'diagram':
      return block.title ?? 'Diagram';
    case 'observe':
      return block.title ?? 'Look Closely';
    case 'evidence':
      return block.title ?? 'Evidence';
    case 'do':
      return block.title ?? 'Try It';
    case 'command':
      return block.command;
    case 'http':
      return block.request ? `${block.request.method} ${block.request.url}` : 'HTTP';
    case 'code':
      return block.filename ?? block.language;
    case 'comparison':
      return block.title ?? 'Before vs After';
    case 'checkpoint':
      return block.title ?? (block.checkpointType === 'quiz' ? 'Knowledge Check' : 'Submit Flag');
    case 'hint':
      return 'Hint';
    case 'challenge':
      return block.title;
    case 'lab':
      return block.title;
    case 'playground':
      return block.title ?? 'Code Playground';
    case 'debrief':
      return block.title ?? 'What We Learned';
    case 'recall':
      return block.title ?? 'Key Points';
    case 'text':
    case 'think':
    default:
      return fallback ?? blockLabel(block.type);
  }
}

/** Truncate a long title to keep deck rows compact. */
export function truncate(text: string, max = 56): string {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= max) return cleaned;
  return `${cleaned.slice(0, max - 1).trimEnd()}…`;
}

/** Stable sort order used by deck surfaces when no explicit order matters. */
export const BLOCK_TYPES: ReadonlyArray<BlockType> = Object.keys(BLOCK_LABELS) as BlockType[];