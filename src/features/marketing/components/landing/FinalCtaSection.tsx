import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';
import ScrollReveal from '../../../../shared/components/ScrollReveal';

interface FinalCtaSectionProps {
  user: { isAdmin?: boolean } | null;
}

const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ user }) => (
  <section className="relative py-20 md:py-32 overflow-hidden bg-bg scanlines">
    <div className="absolute inset-0 z-0">
      <img src="/images/cta-section-background/cta-background.webp" alt="" className="w-full h-full object-cover grayscale opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg via-transparent to-bg" />
    </div>
    <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
      <ScrollReveal>
        <motion.div animate={{ opacity: [0.5, 1, 0.5], filter: ['blur(0px)', 'blur(1px)', 'blur(0px)'] }} transition={{ duration: 4, repeat: Infinity }}
          className="inline-block mb-5 px-4 py-1.5 border border-accent bg-accent-dim text-accent rounded-full text-xs font-bold uppercase tracking-[0.3em] shadow-[0_0_15px_rgba(136,173,124,0.3)]">
          ENROLLMENT OPEN
        </motion.div>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6 leading-tight">
          Ready to <span className="text-accent underline decoration-accent/30 underline-offset-8">Operate?</span>
        </h2>
        <p className="text-text-secondary text-sm md:text-lg mb-10 max-w-2xl mx-auto">Join operators training in offensive security. No experience required, just commitment.</p>
        <div className="flex items-center justify-center">
          {user ? (
            <Link to="/dashboard" className="btn-primary !px-10 !py-4 text-sm flex items-center gap-3"><LayoutDashboard className="w-5 h-5" /> Go to Dashboard</Link>
          ) : (
            <Link to="/register" className="btn-primary !px-10 !py-4 text-sm">Start Training →</Link>
          )}
        </div>
      </ScrollReveal>
    </div>
  </section>
);

export default FinalCtaSection;

