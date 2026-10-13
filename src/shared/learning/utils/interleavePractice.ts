/**
 * INTERLEAVE PRACTICE
 * ===================
 * Duolingo-style pacing: never let a learner read a long run of passive cards
 * before answering something. Quiz checkpoints are pulled forward so they land
 * after at most `maxReadRun` consecutive read cards.
 *
 * Only *quiz* checkpoints move. Flag checkpoints (labs) stay exactly where the
 * author put them — they gate a hands-on step and must come after the command.
 * If the unit has no quiz, the block order is returned untouched.
 */

import type { LearningBlock } from '../types/blocks';
import { isCheckpointCard, isReadCard } from './blockMeta';

export const MAX_READ_RUN = 3;

function isMovablePractice(block: LearningBlock): boolean {
  return block.type === 'checkpoint' && isCheckpointCard(block) && block.checkpointType === 'quiz';
}

export function interleavePractice(
  blocks: LearningBlock[],
  maxReadRun = MAX_READ_RUN,
): LearningBlock[] {
  const practice = blocks.filter(isMovablePractice);
  if (practice.length === 0) return blocks;

  const result: LearningBlock[] = [];
  let placed = 0;
  let readRun = 0;

  for (const block of blocks) {
    if (isMovablePractice(block)) continue;

    result.push(block);
    if (isReadCard(block)) {
      readRun += 1;
    } else {
      readRun = 0;
    }

    if (readRun >= maxReadRun && placed < practice.length) {
      result.push(practice[placed]);
      placed += 1;
      readRun = 0;
    }
  }

  while (placed < practice.length) {
    result.push(practice[placed]);
    placed += 1;
  }

  return result;
}

export default interleavePractice;
