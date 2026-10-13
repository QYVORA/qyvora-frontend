/**
 * UTILS BARREL EXPORT
 */

export { blockRegistry, assertBlockRegistered } from './blockRegistry';
export type { BlockRendererProps, BlockRenderContext } from './blockRegistry';

export {
  adaptBootcampStep,
  adaptLabStep,
  parseMarkdownToBlocks,
  validateLearningUnit,
} from './contentAdapter';
export type { LegacyWalkthroughStep } from './contentAdapter';

export {
  chunkMarkdown,
  markdownToBlocks,
  splitProse,
  plainMarkdown,
  MAX_PROSE_PER_CARD,
} from './markdownChunker';

export {
  BLOCK_LABELS,
  blockLabel,
  blockTitle,
  blockXp,
  truncate,
  isReadCard,
  isInteractiveCard,
  isCheckpointCard,
  hasValidation,
  READ_XP,
  INTERACT_XP,
  PLAYGROUND_XP,
  CHECKPOINT_XP,
} from './blockMeta';

export {
  RANKS,
  rankFor,
  comboMultiplier,
  resolveAward,
  registerDailyXp,
  dayKey,
  DAILY_TARGET,
  readStorage,
  writeStorage,
} from '../gamification/deckGamification';
export type {
  RankTier,
  RankInfo,
  AwardInput,
  AwardResult,
  StreakState,
} from '../gamification/deckGamification';
