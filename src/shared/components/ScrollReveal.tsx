import React from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { useAdaptiveUi } from '../../core/hooks/useAdaptiveUi';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Direction to reveal from. Default: 'up' */
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  /** How much of the element must be visible before triggering. Default: 0.1 */
  amount?: number;
  /** Scale from value. Default: 0.95 */
  scale?: number;
  /** If true, children will be staggered. Requires children to be motion elements or use variants. */
  staggerChildren?: number;
}

/**
 * ScrollReveal
 * ─────────────────────────────────────────────────────────────────────────────
 * A sophisticated reveal-on-scroll component that makes elements "build" into 
 * place with cinematic easing and optional staggering.
 */
const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  amount = 0.1,
  scale = 0.95,
  staggerChildren = 0,
}) => {
  const ref = React.useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const { constrainedDevice } = useAdaptiveUi();
  const minimizeEffects = shouldReduceMotion || constrainedDevice;

  const offset = minimizeEffects ? 0 : 50;

  const variants: Variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? offset : direction === 'down' ? -offset : 0,
      x: direction === 'left' ? offset : direction === 'right' ? -offset : 0,
      scale: minimizeEffects ? 1 : scale,
      rotateX: direction === 'up' ? 10 : direction === 'down' ? -10 : 0,
      filter: minimizeEffects ? 'none' : 'blur(10px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      rotateX: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        damping: 30,
        stiffness: 100,
        mass: 1,
        duration: minimizeEffects ? 0.01 : 0.8,
        ease: [0.22, 1, 0.36, 1], // Custom cinematic easing
        delay,
        staggerChildren: staggerChildren || undefined,
        filter: { duration: minimizeEffects ? 0.01 : 0.5 },
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={variants}
      className={className}
      style={{ perspective: '1200px' }} // Adds depth for rotateX
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
