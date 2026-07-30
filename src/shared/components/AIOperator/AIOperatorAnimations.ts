/**
 * AIOperatorAnimations.ts
 *
 * Motion specifications for the QYVORA AI Operator.
 * All durations and keyframes are centralized here for consistency.
 */

import type { Variants, Transition } from 'motion/react';

// ─── Motion reduced respect ─────────────────────────────────────────────
export const MOTION_REDUCED = '(prefers-reduced-motion: reduce)';

// ─── Idle float animation ───────────────────────────────────────────────
export const floatTransition: Transition = {
  duration: 4,
  repeat: Infinity,
  ease: [0.22, 1, 0.36, 1],
  repeatType: 'mirror',
};

export const floatVariants: Variants = {
  animate: {
    y: [0, -4, 0],
    transition: floatTransition,
  },
};

// ─── Gentle breathing ───────────────────────────────────────────────────
export const breatheTransition: Transition = {
  duration: 3.5,
  repeat: Infinity,
  ease: [0.22, 1, 0.36, 1],
  repeatType: 'mirror',
};

export const breatheVariants: Variants = {
  animate: {
    scale: [1, 1.008, 1],
    transition: breatheTransition,
  },
};

// ─── Blink ──────────────────────────────────────────────────────────────
export const blinkTransition: Transition = {
  duration: 0.12,
  ease: 'easeInOut',
};

export const BLINK_INTERVAL_MIN = 5000;
export const BLINK_INTERVAL_MAX = 8000;

// ─── Core Glow pulse ────────────────────────────────────────────────────
export const coreGlowTransition: Transition = {
  duration: 2.8,
  repeat: Infinity,
  ease: [0.22, 1, 0.36, 1],
  repeatType: 'mirror',
};

export const coreGlowVariants: Variants = {
  animate: {
    opacity: [0.6, 1, 0.6],
    transition: coreGlowTransition,
  },
};

// ─── Eye Glow subtle pulse ──────────────────────────────────────────────
export const eyeGlowTransition: Transition = {
  duration: 3.2,
  repeat: Infinity,
  ease: [0.22, 1, 0.36, 1],
  repeatType: 'mirror',
};

export const eyeGlowVariants: Variants = {
  animate: {
    opacity: [0.7, 1, 0.7],
    transition: eyeGlowTransition,
  },
};

// ─── Holographic scan ──────────────────────────────────────────────────
export const scanTransition: Transition = {
  duration: 6,
  repeat: Infinity,
  ease: [0.22, 1, 0.36, 1],
  repeatType: 'mirror',
};

export const scanVariants: Variants = {
  animate: {
    y: ['100%', '-100%'],
    opacity: [0, 0.15, 0],
    transition: scanTransition,
  },
};

// ─── Head tilt ──────────────────────────────────────────────────────────
export const headTiltTransition: Transition = {
  duration: 0.3,
  ease: [0.22, 1, 0.36, 1],
};

export const headTiltVariants: Variants = {
  idle: { rotate: 0 },
  curious: { rotate: -3 },
  thinking: { rotate: 2 },
  happy: { rotate: -2 },
};

// ─── Hover response ─────────────────────────────────────────────────────
export const hoverTransition: Transition = {
  duration: 0.3,
  ease: [0.22, 1, 0.36, 1],
};

// ─── Entrance animation ─────────────────────────────────────────────────
export const entranceVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.85,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// ─── Default transition for all motion elements ─────────────────────────
export const defaultTransition: Transition = {
  duration: 0.42,
  ease: [0.22, 1, 0.36, 1],
};
