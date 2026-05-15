import React from 'react';
import { motion } from 'motion/react';
import { Terminal, Shield, Zap, Target } from 'lucide-react';
import HeroBackground from '../HeroBackground';
import AsciiHeading from '../../../../shared/components/ui/AsciiHeading';

const STEPS = [
  { icon: Terminal, title: 'Learn', desc: 'Master Linux, networking, and social engineering fundamentals.' },
  { icon: Target,   title: 'Operate', desc: 'Execute mission-based rooms in browser labs.' },
  { icon: Zap,      title: 'Earn', desc: 'Capture flags and earn CP on the HSOCIETY Chain.' },
  { icon: Shield,   title: 'Prove', desc: 'Validate your skills with a permanent, tamper-proof record.' },
];

const ProcessSection: React.FC = () => {
  return (
    <section className="ascii-section relative py-14 md:py-24 bg-bg overflow-hidden border-t border-border">
      <HeroBackground className="opacity-40" />
      <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-16">
          <AsciiHeading text="The Process" font="Larry3d" animated glow="intense" className="mb-8" />
          <p className="text-text-secondary text-base md:text-lg max-w-lg mx-auto opacity-80 leading-relaxed">
            From novice to operator in four steps. Phased training designed for maximum practical skill acquisition.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="terminal-card border-beam p-8 rounded-xl border border-border bg-bg-card/80 backdrop-blur-md text-center group"
            >
              <div className="w-14 h-14 rounded-2xl bg-accent/5 border border-accent/20 flex items-center justify-center text-accent mx-auto mb-6 group-hover:scale-110 transition-transform">
                <step.icon size={24} />
              </div>
              <h3 className="text-lg font-bold text-text-primary uppercase tracking-tight mb-3">{step.title}</h3>
              <p className="text-xs text-text-muted leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
