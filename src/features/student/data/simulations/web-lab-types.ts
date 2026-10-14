import type { Difficulty, QuizQuestion } from './types';

/**
 * QOSE web/application lab taxonomy. These labs mirror the data-driven
 * `SqlInjectionTarget` pattern so a single generic page can render them.
 *
 * Flag values are NEVER stored here — only the server-side store
 * (`qyvora-backend` lab.controller) holds SHA-256 digests. The walkthrough
 * teaches the technique; the learner captures the flag from the live lab
 * container and submits it for server-side verification.
 */
export type WebLabCategory = 'web-access-control' | 'api-security' | 'automation';

export interface WebLabStep {
  id: string;
  instruction: string;
  command: string;
  output: string;
  explanation: string;
  hint?: string;
  quiz?: QuizQuestion[];
}

export interface WebLabScenario {
  id: string;
  name: string;
  description: string;
  /** Stable QOSE module id, e.g. `QOSE-M03`. */
  module: string;
  category: WebLabCategory;
  technique: string;
  url: string;
  endpoint: string;
  difficulty: Difficulty;
  cpReward: number;
  estimatedMinutes: number;
  objectives: string[];
  hints: string[];
  steps: WebLabStep[];
  villain?: {
    name: string;
    alias: string;
    description: string;
  };
  narrative?: string;
}
