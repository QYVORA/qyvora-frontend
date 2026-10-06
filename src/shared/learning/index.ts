/**
 * LEARNING SYSTEM V2 — MAIN EXPORT
 * =================================
 * Central entry point for the semantic learning block system.
 * 
 * Usage:
 * ```tsx
 * import { LearningContentRenderer, adaptBootcampStep } from '@/shared/learning';
 * import type { LearningUnit, LearningBlock } from '@/shared/learning';
 * ```
 */

// Type definitions
export type * from './types';

// Renderers
export * from './renderer';

// Utilities
export * from './utils';

// Block components (must be imported to register themselves)
export * from './blocks';
