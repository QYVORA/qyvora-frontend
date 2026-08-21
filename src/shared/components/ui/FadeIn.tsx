import React from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  /** Fade duration in seconds. */
  duration?: number;
}

/**
 * Mount-time opacity fade for skeleton→content swaps. Renders a plain
 * wrapper (no animation) when the user prefers reduced motion.
 */
const FadeIn: React.FC<FadeInProps> = ({ children, className = '', duration = 0.3 }) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;
