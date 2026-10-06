/**
 * CONTENT ADAPTER
 * ===============
 * Utilities for converting legacy content formats to semantic learning blocks.
 * This enables gradual migration without breaking existing content.
 */

import type {
  LearningBlock,
  TextBlock,
  ObjectiveBlock,
  MissionBlock,
  CommandBlock,
  CheckpointBlock,
  EvidenceBlock,
} from '../types/blocks';
import type { LearningUnit } from '../types/content';
import type { BootcampStep } from '@/features/student/constants/bootcampStructure';

// ─────────────────────────────────────────────────────────────────────────────
// BOOTCAMP ADAPTER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convert legacy BootcampStep to semantic LearningUnit.
 * 
 * Strategy: For now, wrap the Markdown instruction in a TextBlock.
 * Future: Parse the Markdown and extract semantic structures.
 */
export function adaptBootcampStep(
  step: BootcampStep,
  stepIndex: number,
  roomId: string,
  phaseId: string
): LearningUnit {
  const blocks: LearningBlock[] = [];
  
  // Main instruction as TextBlock (Markdown compatible)
  const textBlock: TextBlock = {
    type: 'text',
    id: `${roomId}-${stepIndex}-text`,
    content: step.instruction,
  };
  blocks.push(textBlock);
  
  // Optional quiz as CheckpointBlock
  if (step.quiz && step.quiz.length > 0) {
    const checkpointBlock: CheckpointBlock = {
      type: 'checkpoint',
      id: `${roomId}-${stepIndex}-quiz`,
      checkpointType: 'quiz',
      quiz: {
        questions: step.quiz,
      },
    };
    blocks.push(checkpointBlock);
  }
  
  return {
    id: `${phaseId}-${roomId}-step-${stepIndex}`,
    number: stepIndex + 1,
    title: step.title,
    blocks,
    image: step.image
      ? {
          src: step.image,
          alt: `${step.title} illustration`,
        }
      : undefined,
    completionType: 'view', // Bootcamp steps complete on view
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// LAB ADAPTER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convert WalkthroughStep props to semantic LearningUnit.
 * 
 * This is more structured than bootcamp because labs already have
 * semantic fields (mission, objectives, evidence, etc.)
 */
export interface LegacyWalkthroughStep {
  title: string;
  narrative: string;
  mission?: string;
  objectives?: string[];
  evidence?: string[];
  commandInstruction?: string;
  reflection?: string;
  hint?: string;
  progressiveHints?: Array<{ level: number; content: string }>;
  quiz?: Array<{
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }>;
  flagId?: string;
}

export function adaptLabStep(
  step: LegacyWalkthroughStep,
  stepIndex: number,
  labId: string
): LearningUnit {
  const blocks: LearningBlock[] = [];
  
  // Mission
  if (step.mission) {
    const missionBlock: MissionBlock = {
      type: 'mission',
      id: `${labId}-${stepIndex}-mission`,
      mission: step.mission,
    };
    blocks.push(missionBlock);
  }
  
  // Objectives
  if (step.objectives && step.objectives.length > 0) {
    const objectiveBlock: ObjectiveBlock = {
      type: 'objective',
      id: `${labId}-${stepIndex}-objectives`,
      objectives: step.objectives,
    };
    blocks.push(objectiveBlock);
  }
  
  // Narrative
  const textBlock: TextBlock = {
    type: 'text',
    id: `${labId}-${stepIndex}-narrative`,
    content: step.narrative,
  };
  blocks.push(textBlock);
  
  // Evidence
  if (step.evidence && step.evidence.length > 0) {
    const evidenceBlock: EvidenceBlock = {
      type: 'evidence',
      id: `${labId}-${stepIndex}-evidence`,
      entries: step.evidence,
      format: 'terminal',
    };
    blocks.push(evidenceBlock);
  }
  
  // Command
  if (step.commandInstruction) {
    const commandBlock: CommandBlock = {
      type: 'command',
      id: `${labId}-${stepIndex}-command`,
      command: step.commandInstruction,
    };
    blocks.push(commandBlock);
  }
  
  // Hints (if present)
  // TODO: Convert to HintBlock when component is ready
  
  // Quiz
  if (step.quiz && step.quiz.length > 0) {
    const checkpointBlock: CheckpointBlock = {
      type: 'checkpoint',
      id: `${labId}-${stepIndex}-quiz`,
      checkpointType: 'quiz',
      quiz: {
        questions: step.quiz,
      },
    };
    blocks.push(checkpointBlock);
  }
  
  // Flag
  if (step.flagId) {
    const checkpointBlock: CheckpointBlock = {
      type: 'checkpoint',
      id: `${labId}-${stepIndex}-flag`,
      checkpointType: 'flag',
      flag: {
        flagId: step.flagId,
        hint: step.hint,
        progressiveHints: step.progressiveHints?.map((h) => ({
          level: h.level,
          content: h.content,
        })),
      },
    };
    blocks.push(checkpointBlock);
  }
  
  // Reflection (debrief)
  // TODO: Convert to DebriefBlock when component is ready
  
  return {
    id: `${labId}-step-${stepIndex}`,
    number: stepIndex + 1,
    title: step.title,
    blocks,
    completionType: step.flagId ? 'checkpoint' : 'view',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// MARKDOWN PARSER (future enhancement)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse Markdown content and extract semantic structures.
 * 
 * Example: Detect patterns like:
 * - "Mission:" or "Objective:" headers → extract as semantic blocks
 * - Code fences with specific labels → CommandBlock
 * - Blockquotes with "Think:" → ThinkBlock
 * 
 * This is a future enhancement to enable smarter migration.
 */
export function parseMarkdownToBlocks(markdown: string, baseId: string): LearningBlock[] {
  // For now, just return a single TextBlock
  // Future: Use regex/parser to extract semantic patterns
  return [
    {
      type: 'text',
      id: `${baseId}-parsed`,
      content: markdown,
    },
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validate that a LearningUnit conforms to best practices.
 */
export function validateLearningUnit(unit: LearningUnit): {
  valid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  
  // Check if unit has blocks
  if (unit.blocks.length === 0) {
    warnings.push('Unit has no content blocks');
  }
  
  // Check for multiple checkpoints (discouraged)
  const checkpointCount = unit.blocks.filter((b) => b.type === 'checkpoint').length;
  if (checkpointCount > 1) {
    warnings.push(`Unit has ${checkpointCount} checkpoints. Consider splitting into multiple units.`);
  }
  
  // Check completion type matches content
  if (unit.completionType === 'checkpoint' && checkpointCount === 0) {
    warnings.push('Unit requires checkpoint completion but has no checkpoint blocks');
  }
  
  return {
    valid: warnings.length === 0,
    warnings,
  };
}
