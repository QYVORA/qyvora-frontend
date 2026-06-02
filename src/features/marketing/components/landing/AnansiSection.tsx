import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ExternalLink } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import ScrollReveal from '../../../../shared/components/ScrollReveal';
import AsciiHeading from '../../../../shared/components/ui/AsciiHeading';

const BULLETS = [
  'Subdomain enumeration',
  'TLS & security analysis',
  'Exposed paths detection',
  'JSON export',
];

const AnansiSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="w-full min-h-full flex items-center py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-2 md:px-10 relative z-10 w-full overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-10 items-center px-2 md:px-0">

          {/* Left: description + features */}
          <div>
            <ScrollReveal direction="left">
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-4 lg:mb-3">
                <div className="h-[1px] w-8 bg-cyan-500/40" />
                <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.35em]">
                  Attack Surface Intelligence
                </span>
              </div>

              <AsciiHeading 
                text="ANANSI" 
                font="ANSI Shadow" 
                align="left" 
                animated 
                className="mb-6" 
              />
              
              <p className="text-text-secondary text-sm mb-6 leading-relaxed">
                Attack surface intelligence engine. Run comprehensive recon scans directly in your browser.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 max-w-2xl">
                {BULLETS.map((bullet) => (
                  <div key={bullet} className="flex items-center gap-2.5 text-sm text-text-secondary">
                    <CheckCircle2 className="w-4 h-4 text-cyan-500 flex-none" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/anansi"
                className="btn-secondary text-xs inline-flex items-center gap-2"
              >
                Launch Scanner <ExternalLink className="w-4 h-4" />
              </Link>
            </ScrollReveal>
          </div>

          {/* Right: ANANSI Logo */}
          <ScrollReveal className="flex items-center justify-center" direction="right" delay={0.1}>
            <div className="relative flex items-center justify-center w-full max-w-[900px] h-72 sm:h-[28rem] md:h-[32rem] lg:h-[36rem]">
              <div className="relative z-10 w-64 h-64 sm:w-80 sm:h-80 md:w-[28rem] md:h-[28rem] lg:w-[32rem] lg:h-[32rem]">
                <motion.img
                  src="/assets/branding/logos/anansi-logo.webp"
                  alt="ANANSI"
                  className="relative z-10 w-full h-full object-contain"
                  animate={shouldReduceMotion ? {} : { y: [0, -10, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
};

export default AnansiSection;
