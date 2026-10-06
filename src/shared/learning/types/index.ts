/**
 * LEARNING TYPES — BARREL EXPORT
 * ===============================
 * Central export point for all learning type definitions.
 */

// Block types
export type {
  BlockType,
  BaseBlock,
  LearningBlock,
  // Narrative blocks
  TextBlock,
  ObjectiveBlock,
  MissionBlock,
  ConceptBlock,
  DebriefBlock,
  RecallBlock,
  // Visual blocks
  MentalModelBlock,
  DiagramBlock,
  // Evidence blocks
  ObserveBlock,
  EvidenceBlock,
  // Interactive blocks
  ThinkBlock,
  DoBlock,
  CommandBlock,
  HttpBlock,
  CodeBlock,
  ComparisonBlock,
  CheckpointBlock,
  HintBlock,
  ChallengeBlock,
  LabBlock,
} from './blocks';

// Type guards
export {
  isTextBlock,
  isObjectiveBlock,
  isMissionBlock,
  isConceptBlock,
  isCommandBlock,
  isCheckpointBlock,
  isObserveBlock,
  isEvidenceBlock,
  isThinkBlock,
  isDoBlock,
  isHintBlock,
  isDebriefBlock,
  isRecallBlock,
  isChallengeBlock,
  isLabBlock,
} from './blocks';

// Content types
export type {
  LearningUnit,
  LearningSequence,
  BootcampRoomContent,
  CourseLessonContent,
  LabContent,
  SurfaceContent,
  ContentValidationResult,
  ContentValidationRules,
} from './content';

// Progress types
export type {
  ProgressState,
  UnitProgress,
  SequenceProgress,
  ProgressEventType,
  ProgressEvent,
  ProgressAction,
  MarkUnitViewedAction,
  SubmitCheckpointAction,
  CompleteUnitAction,
  LegacyProgressAdapter,
} from './progress';
