import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, ArrowRight } from 'lucide-react';
import ScrollReveal from '../../../../shared/components/ScrollReveal';

interface FinalCtaSectionProps {
  user: { isAdmin?: boolean } | null;
}

const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ user }) => {
  // Fix #20: respect prefers-reduced-motion
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-[60vh] py-20 md:py-32 overflow-hidden bg-bg scanlines flex items-center">
      <div className="absolute inset-0 z-0">
        <img src="/images/cta-section-background/cta-background.webp" alt="" className="w-full h-full object-cover grayscale opacity-20" />
        {/* L18: use bg/80 fade instead of from-bg so it works in both themes */}
        <div className="absolute inset-0 bg-gradient-to-r from-bg/90 via-bg/40 to-bg/90" />
      </div>
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10 w-full">
        <ScrollReveal>
          {/* Fix #20: no blur animation when reduced motion is preferred */}
          {/* L19: shadow uses accent-glow CSS var — adapts to theme */}
          <motion.div
            animate={shouldReduceMotion ? {} : { opacity: [0.5, 1, 0.5], filter: ['blur(0px)', 'blur(1px)', 'blur(0px)'] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="inline-block mb-5 px-4 py-1.5 border border-accent bg-accent-dim text-accent rounded-full text-xs font-bold uppercase tracking-[0.3em]"
            style={{ boxShadow: '0 0 15px var(--color-accent-glow)' }}
          >
            {/* Fix #21: badge copy changes for logged-in users */}
            {user ? 'TRAINING IN PROGRESS' : 'ENROLLMENT OPEN'}
          </motion.div>

          {/* Fix #21: heading and subtext adapt to auth state */}
          {user ? (
            <>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6 leading-tight">
                Keep <span className="text-accent underline decoration-accent/30 underline-offset-8">Operating.</span>
              </h2>
              <p className="text-text-secondary text-sm md:text-lg mb-10 max-w-2xl mx-auto">
                Your training is active. Head to your dashboard to continue where you left off.
              </p>
              <div className="flex items-center justify-center">
                <Link to="/dashboard" className="btn-primary !px-6 md:!px-10 !py-3 md:!py-4 text-sm flex items-center gap-3">
                  <LayoutDashboard className="w-5 h-5" /> Go to Dashboard
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6 leading-tight">
                Ready to <span className="text-accent underline decoration-accent/30 underline-offset-8">Operate?</span>
              </h2>
              <p className="text-text-secondary text-sm md:text-lg mb-10 max-w-2xl mx-auto">
                Join operators training in offensive security. No experience required, just commitment.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link to="/register" className="btn-primary !px-6 md:!px-10 !py-3 md:!py-4 text-sm inline-flex items-center gap-2">
                  Start Training <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
};

export default FinalCtaSection;
