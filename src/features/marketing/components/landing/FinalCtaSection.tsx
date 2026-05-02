import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, ArrowRight } from 'lucide-react';
import ScrollReveal from '../../../../shared/components/ScrollReveal';

interface FinalCtaSectionProps {
  user: { isAdmin?: boolean } | null;
}

const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ user }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-[60vh] py-20 md:py-32 overflow-hidden bg-bg scanlines flex items-center has-bg-image">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/sections/backgrounds/employee-training-bg.png"
          alt=""
          className="w-full h-full object-cover grayscale opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/90 via-bg/40 to-bg/90 light-theme-hide-bg-overlay" />
      </div>

      {/* Operator illustration — right side, desktop only */}
      <img
        src="/assets/illustrations/cta-operator.png"
        alt=""
        aria-hidden="true"
        className="hidden lg:block absolute right-0 bottom-0 h-[85%] w-auto object-contain pointer-events-none select-none opacity-80 z-[1]"
      />

      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full pointer-events-none z-0"
        data-light-overlay="true"
        style={{ background: 'radial-gradient(ellipse, var(--color-accent-glow) 0%, transparent 70%)' }}
      />

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10 w-full">
        <ScrollReveal>
          {/* Pulsing badge */}
          <motion.div
            animate={shouldReduceMotion ? {} : {
              opacity: [0.7, 1, 0.7],
              boxShadow: [
                '0 0 10px var(--color-accent-glow)',
                '0 0 24px var(--color-accent-glow)',
                '0 0 10px var(--color-accent-glow)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-block mb-6 px-4 py-1.5 border border-accent bg-accent-dim text-accent rounded-full text-xs font-bold uppercase tracking-[0.3em]"
          >
            {user ? 'TRAINING IN PROGRESS' : 'ENROLLMENT OPEN'}
          </motion.div>

          {user ? (
            <>
              <motion.h2
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 28, filter: 'blur(8px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1], filter: { duration: 0.45 } }}
                className="text-3xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6 leading-tight"
              >
                Keep <span className="text-accent underline decoration-accent/30 underline-offset-8">Operating.</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, filter: 'blur(4px)' }}
                whileInView={{ opacity: 1, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.25, filter: { duration: 0.35 } }}
                className="text-text-secondary text-sm md:text-lg mb-10 max-w-2xl mx-auto"
              >
                Your training is active. Head to your dashboard to continue where you left off.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="flex items-center justify-center"
              >
                <Link to="/dashboard" className="btn-primary !px-8 !py-3 text-sm flex items-center gap-3 flex-none">
                  <LayoutDashboard className="w-5 h-5" /> Go to Dashboard
                </Link>
              </motion.div>
            </>
          ) : (
            <>
              <motion.h2
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 28, filter: 'blur(8px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1], filter: { duration: 0.45 } }}
                className="text-3xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6 leading-tight"
              >
                Ready to <span className="text-accent underline decoration-accent/30 underline-offset-8">Operate?</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, filter: 'blur(4px)' }}
                whileInView={{ opacity: 1, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.25, filter: { duration: 0.35 } }}
                className="text-text-secondary text-sm md:text-lg mb-10 max-w-2xl mx-auto"
              >
                Join operators training in offensive security. No experience required — just commitment.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="flex flex-row items-center justify-center gap-3 flex-wrap"
              >
                <Link to="/register" className="btn-primary !px-8 !py-3 text-sm inline-flex items-center gap-2 flex-none">
                  Start Training <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/login" className="btn-secondary !px-8 !py-3 text-sm flex-none">
                  Log In
                </Link>
              </motion.div>
            </>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
};

export default FinalCtaSection;
