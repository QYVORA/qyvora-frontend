/**
 * LEARNING PROGRESS TYPES
 * ========================
 * Types for tracking student progress through learning content.
 */

// ─────────────────────────────────────────────────────────────────────────────
// PROGRESS STATES
// ─────────────────────────────────────────────────────────────────────────────

export type ProgressState =
  | 'not_started'
  | 'in_progress'
  | 'checkpoint_passed'
  | 'completed';

export interface UnitProgress {
  unitId: string;
  state: ProgressState;
  
  /** Timestamp of state changes */
  startedAt?: number;
  completedAt?: number;
  
  /** Checkpoint results */
  checkpointResults?: {
    blockId: string;
    passed: boolean;
    attempts: number;
    lastAttemptAt: number;
  }[];
  
  /** Think block responses (for analytics, not graded) */
  thinkBlockResponses?: {
    blockId: string;
    response: string | number;
    timestamp: number;
  }[];
}

export interface SequenceProgress {
  sequenceId: string;
  units: UnitProgress[];
  
  /** Overall progress percentage (0-100) */
  progressPercentage: number;
  
  /** Time spent */
  totalTimeSpent?: number; // milliseconds
  
  /** Completion */
  isCompleted: boolean;
  completedAt?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// PROGRESS EVENTS
// ─────────────────────────────────────────────────────────────────────────────

export type ProgressEventType =
  | 'unit_started'
  | 'unit_viewed'
  | 'checkpoint_attempted'
  | 'checkpoint_passed'
  | 'checkpoint_failed'
  | 'unit_completed'
  | 'sequence_completed';

export interface ProgressEvent {
  type: ProgressEventType;
  sequenceId: string;
  unitId: string;
  blockId?: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

// ─────────────────────────────────────────────────────────────────────────────
// PROGRESS ACTIONS
// ─────────────────────────────────────────────────────────────────────────────

export interface MarkUnitViewedAction {
  type: 'mark_unit_viewed';
  sequenceId: string;
  unitId: string;
}

export interface SubmitCheckpointAction {
  type: 'submit_checkpoint';
  sequenceId: string;
  unitId: string;
  blockId: string;
  answer: any; // Quiz answer, flag value, etc.
}

export interface CompleteUnitAction {
  type: 'complete_unit';
  sequenceId: string;
  unitId: string;
}

export type ProgressAction =
  | MarkUnitViewedAction
  | SubmitCheckpointAction
  | CompleteUnitAction;

// ─────────────────────────────────────────────────────────────────────────────
// API COMPATIBILITY (for migration)
// ─────────────────────────────────────────────────────────────────────────────

/** Maps to existing backend progress endpoints */
export interface LegacyProgressAdapter {
  /** POST /student/bootcamp/room/progress */
  markBootcampStepViewed: (
    bootcampId: string,
    phaseId: string,
    roomId: string,
    stepIndex: number
  ) => Promise<void>;
  
  /** POST /student/lab/flag */
  submitLabFlag: (
    labId: string,
    stepId: string,
    flag: string
  ) => Promise<{ correct: boolean }>;
  
  /** POST /student/course/lesson/complete */
  completeCourseLesson: (
    courseId: string,
    lessonIndex: number
  ) => Promise<void>;
  
  /** POST /student/quiz */
  submitQuiz: (
    quizId: string,
    answers: number[]
  ) => Promise<{ score: number; passed: boolean }>;
}
