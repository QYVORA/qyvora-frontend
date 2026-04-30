import React from 'react';
import { motion, useInView, useReducedMotion, type Variants } from 'motion/react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Direction to reveal from. Default: 'up' */
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  /** How much of the element must be visible before triggering. Default: 0.12 */
  amount?: number;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  amount = 0.12,
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount });
  const shouldReduceMotion = useReducedMotion();

  const offset = shouldReduceMotion ? 0 : 24;

  const initial = {
    opacity: 0,
    y: direction === 'up' ? offset : direction === 'down' ? -offset : 0,
    x: direction === 'left' ? offset : direction === 'right' ? -offset : 0,
  };

  const variants: Variants = {
    hidden: initial,
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.55,
        ease: [0.16, 1, 0.3, 1],
        delay,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
