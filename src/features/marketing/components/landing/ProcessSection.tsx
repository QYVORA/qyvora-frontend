import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Terminal, Shield, Zap, Target } from 'lucide-react';
import AsciiHeading from '../../../../shared/components/ui/AsciiHeading';

const STEPS = [
  { icon: Terminal, title: 'Learn', desc: 'Master Linux, networking, and social engineering fundamentals.' },
  { icon: Target,   title: 'Operate', desc: 'Execute mission-based rooms in browser labs.' },
  { icon: Zap,      title: 'Earn', desc: 'Capture flags and earn CP on the HSOCIETY Chain.' },
  { icon: Shield,   title: 'Prove', desc: 'Validate your skills with a permanent, tamper-proof record.' },
];

const ProcessSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="w-full h-full flex items-center overflow-hidden py-8 lg:py-6 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 md:px-10 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[0.5fr_1.5fr] gap-8 lg:gap-12 items-center">
          
          {/* ── Left: Heading Column ── */}
          <div className="lg:pr-6 flex flex-col">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-4 lg:mb-3">
              <div className="h-[1px] w-8 bg-accent/40" />
              <span className="text-[10px] font-black text-accent uppercase tracking-[0.35em]">
                The Journey
              </span>
            </div>

            {/* Heading */}
            <AsciiHeading
              text="Process"
              font="ANSI Shadow"
              align="left"
              animated
              compact
              className="mb-5 lg:mb-4"
            />

            {/* Description */}
            <p className="text-text-secondary text-base lg:text-sm leading-relaxed font-mono mb-6 lg:mb-4 max-w-sm opacity-80">
              From novice to operator in four steps. Phased training designed for maximum practical skill acquisition.
            </p>
          </div>

          {/* ── Right: Cards Grid (2x2 on Desktop) ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            {STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="terminal-card p-6 rounded-2xl border border-border bg-bg-card flex flex-col gap-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/5 border border-accent/20 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                  <step.icon size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-text-primary uppercase tracking-tight mb-2">{step.title}</h3>
                  <p className="text-[11px] text-text-muted leading-relaxed font-mono">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessSection;
