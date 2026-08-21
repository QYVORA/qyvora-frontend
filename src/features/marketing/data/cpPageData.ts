/**
 * cpPageData.ts
 *
 * Content layer for the CP (QYVORA Cyber Coin) product page.
 *
 * CP is the reward layer of the QYVORA cybersecurity learning ecosystem —
 * earned through verified learning and execution activity, never issued for
 * passive engagement. Reward values are intentionally left as "+ CP"
 * placeholders; concrete values are defined by the platform protocol and are
 * supplied elsewhere.
 */

import {
  BookOpen,
  ListChecks,
  Terminal,
  Trophy,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ─── Hero ─────────────────────────────────────────────────────────────────────

export const CP_HERO = {
  label: 'QYVORA ECOSYSTEM // REWARD PROTOCOL',
  title: 'CP',
  subtitle: 'CYBER COIN',
  headlinePrimary: 'Earn Your',
  headlineAccent: 'Progress.',
  description:
    'CP is the reward layer connecting learning, execution, and achievement across the QYVORA cybersecurity ecosystem.',
  motto: ['LEARN', 'EXECUTE', 'EARN'] as const,
  terminal: {
    prompt: 'root@qyvora:~#',
    command: 'initializing reward_protocol...',
    output: 'learning → execution → verification → reward',
  },
};

// ─── 02 · What is CP ──────────────────────────────────────────────────────────

export interface CpPillar {
  id: string;
  index: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

export const CP_PILLARS: CpPillar[] = [
  {
    id: 'learn',
    index: '01',
    icon: BookOpen,
    title: 'Learn',
    description: 'Complete structured cybersecurity education across courses and phases.',
  },
  {
    id: 'test',
    index: '02',
    icon: ListChecks,
    title: 'Test',
    description: 'Validate knowledge through quizzes and assessments that check real understanding.',
  },
  {
    id: 'execute',
    index: '03',
    icon: Terminal,
    title: 'Execute',
    description: 'Apply knowledge through practical attack labs and hands-on challenges.',
  },
  {
    id: 'achieve',
    index: '04',
    icon: Trophy,
    title: 'Achieve',
    description: 'Reach defined milestones and receive CP rewards for proven capability.',
  },
];

// ─── 03 · Philosophy ──────────────────────────────────────────────────────────

export const CP_PHILOSOPHY_STAGES = [
  { id: 'knowledge', label: 'KNOWLEDGE' },
  { id: 'practice', label: 'PRACTICE' },
  { id: 'execution', label: 'EXECUTION' },
  { id: 'verification', label: 'VERIFICATION' },
  { id: 'reward', label: 'REWARD' },
] as const;

export const CP_PHILOSOPHY_TERMINAL = [
  { text: '> knowledge absorbed', status: '[OK]' },
  { text: '> practice completed', status: '[OK]' },
  { text: '> execution verified', status: '[OK]' },
  { text: '> reward issued', status: '[CP]' },
] as const;

// ─── 04 · Reward matrix ───────────────────────────────────────────────────────

export type CpActivityStatus = 'VERIFIED' | 'COMPLETED' | 'IN PROGRESS';

export interface CpRewardActivity {
  id: string;
  activity: string;
  category: string;
  reward: string;
  status: CpActivityStatus;
}

export const CP_REWARD_MATRIX: CpRewardActivity[] = [
  { id: 'course', activity: 'Course Completed', category: 'EDUCATION', reward: '+ CP', status: 'VERIFIED' },
  { id: 'quiz', activity: 'Quiz Passed', category: 'ASSESSMENT', reward: '+ CP', status: 'COMPLETED' },
  { id: 'phase', activity: 'Phase Completed', category: 'BOOTCAMP', reward: '+ CP', status: 'IN PROGRESS' },
  { id: 'lab', activity: 'Attack Lab Completed', category: 'EXECUTION', reward: '+ CP', status: 'VERIFIED' },
  { id: 'challenge', activity: 'Challenge Completed', category: 'EXECUTION', reward: '+ CP', status: 'COMPLETED' },
  { id: 'milestone', activity: 'Milestone Achieved', category: 'ACHIEVEMENT', reward: '+ CP', status: 'IN PROGRESS' },
];

// ─── 05 · Learning loop ───────────────────────────────────────────────────────

export interface CpLoopStage {
  id: string;
  index: string;
  label: string;
  description: string;
}

export const CP_LEARNING_LOOP: CpLoopStage[] = [
  { id: 'learn', index: '01', label: 'LEARN', description: 'Absorb structured offensive security education.' },
  { id: 'practice', index: '02', label: 'PRACTICE', description: 'Rehearse techniques in guided environments.' },
  { id: 'break', index: '03', label: 'BREAK', description: 'Attack real lab targets with intent.' },
  { id: 'build', index: '04', label: 'BUILD', description: 'Turn attacks into repeatable methodology.' },
  { id: 'verify', index: '05', label: 'VERIFY', description: 'Prove capability through assessment.' },
  { id: 'earn', index: '06', label: 'EARN', description: 'Receive CP for verified progress.' },
];

// ─── 06 · Anansi terminal ─────────────────────────────────────────────────────

export const CP_ANANSI_TERMINAL = {
  title: 'anansi — zsh',
  command: 'anansi target.example --modules chain',
  lines: [
    { text: '> initializing reconnaissance', accent: false },
    { text: '> attack surface discovered', accent: false },
    { text: '> intelligence collected', accent: false },
    { text: '> mission complete', accent: false },
    { text: '> reward eligibility verified', accent: false },
    { text: '> CP + REWARD', accent: true },
  ],
};

// ─── 07 · Future chain ────────────────────────────────────────────────────────

export interface CpFutureStep {
  id: string;
  label: string;
  planned: boolean;
}

export const CP_FUTURE_CHAIN: CpFutureStep[] = [
  { id: 'qyvora', label: 'QYVORA', planned: false },
  { id: 'achievement', label: 'VERIFIED ACHIEVEMENT', planned: false },
  { id: 'cp', label: 'CP', planned: false },
  { id: 'blockchain', label: 'BLOCKCHAIN', planned: true },
  { id: 'proof', label: 'DIGITAL PROOF', planned: true },
];
