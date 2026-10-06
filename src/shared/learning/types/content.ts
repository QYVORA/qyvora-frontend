/**
 * LEARNING CONTENT TYPES
 * =======================
 * High-level structures for organizing learning blocks into units and sequences.
 */

import type { LearningBlock } from './blocks';

// ─────────────────────────────────────────────────────────────────────────────
// LEARNING UNIT — A single focused learning experience
// ─────────────────────────────────────────────────────────────────────────────

export interface LearningUnit {
  id: string;
  number: number; // Display number (1-indexed)
  title: string;
  blocks: LearningBlock[];
  
  /** Optional metadata */
  estimatedMinutes?: number;
  
  /** Optional image (legacy compatibility) */
  image?: {
    src: string;
    alt: string;
  };
  
  /** Completion criteria */
  completionType?: 'view' | 'checkpoint' | 'manual';
}

// ─────────────────────────────────────────────────────────────────────────────
// LEARNING SEQUENCE — Collection of units (room, lesson, lab)
// ─────────────────────────────────────────────────────────────────────────────

export interface LearningSequence {
  id: string;
  title: string;
  overview: string;
  units: LearningUnit[];
  
  /** Metadata */
  estimatedMinutes?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  category?: string;
  
  /** Prerequisites */
  prerequisites?: string[];
  
  /** Learning outcomes for the entire sequence */
  outcomes?: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// SURFACE-SPECIFIC TYPES
// ─────────────────────────────────────────────────────────────────────────────

/** Bootcamp Room */
export interface BootcampRoomContent extends LearningSequence {
  surfaceType: 'bootcamp-room';
  phaseId: string;
  roomId: string;
  
  /** Room completion quiz */
  completionQuiz?: {
    questions: Array<{
      id: string;
      question: string;
      options: string[];
      correctAnswer: number;
      explanation?: string;
    }>;
    passThreshold: number;
  };
}

/** Course Lesson */
export interface CourseLessonContent extends LearningSequence {
  surfaceType: 'course-lesson';
  courseId: string;
  lessonIndex: number;
}

/** Attack Lab */
export interface LabContent extends LearningSequence {
  surfaceType: 'lab';
  labId: string;
  
  /** Lab-specific settings */
  simulation?: {
    type: 'terminal' | 'browser' | 'network';
    config: any;
  };
}

export type SurfaceContent = BootcampRoomContent | CourseLessonContent | LabContent;

// ─────────────────────────────────────────────────────────────────────────────
// CONTENT VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

export interface ContentValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ContentValidationRules {
  /** Must have at least one block */
  requireBlocks: boolean;
  
  /** Checkpoint rules */
  maxCheckpointsPerUnit: number;
  requireCheckpointForCompletion: boolean;
  
  /** Hint rules */
  maxHintsPerUnit: number;
  
  /** Structural rules */
  recommendedBlockOrder?: string[]; // e.g., ['mission', 'objective', 'text', 'checkpoint']
}
