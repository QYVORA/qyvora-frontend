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
  /** Scale from value. Default: 0.97 */
  scale?: number;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  amount = 0.1,
  scale = 0.97,
}) => {
  const ref = React.useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const { constrainedDevice } = useAdaptiveUi();
  const minimizeEffects = shouldReduceMotion || constrainedDevice;

  const offset = minimizeEffects ? 0 : 36;

  const variants: Variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? offset : direction === 'down' ? -offset : 0,
      x: direction === 'left' ? offset : direction === 'right' ? -offset : 0,
      scale: minimizeEffects ? 1 : scale,
      filter: minimizeEffects ? 'none' : 'blur(4px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: minimizeEffects ? 0.01 : 0.65,
        ease: [0.16, 1, 0.3, 1],
        delay,
        filter: { duration: minimizeEffects ? 0.01 : 0.4 },
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
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
