import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import HackerGlobe from '../../marketing/components/HackerGlobe';

const AuthHero: React.FC = () => (
  <div className="hidden lg:flex relative flex-col justify-between h-full overflow-hidden p-12">
    <div className="absolute inset-0 dot-grid opacity-20 z-0" />

    {/* Globe */}
    <div className="absolute inset-0 flex items-center justify-center z-[5] pointer-events-none">
      <div className="relative w-full h-full max-w-[520px] max-h-[520px] mx-auto">
        <div className="absolute inset-0 rounded-full bg-accent/5 blur-3xl pointer-events-none" />
        <div className="w-full h-full"><HackerGlobe scale={0.95} /></div>
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-8 right-6 px-2 py-1 bg-bg-card/80 border border-accent/20 rounded text-[8px] font-mono text-accent uppercase tracking-widest"
        >
          SAT-02 // ORBIT
        </motion.div>
      </div>
    </div>

    {/* Back to Home — top-left */}
    <div className="relative z-20">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-bold text-text-muted hover:text-accent uppercase tracking-widest transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>
    </div>
  </div>
);

export default AuthHero;
