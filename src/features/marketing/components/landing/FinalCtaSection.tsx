import React, { useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, ArrowRight, Terminal } from 'lucide-react';
import AsciiHeading from '../../../../shared/components/ui/AsciiHeading';

interface FinalCtaSectionProps {
  user: { isAdmin?: boolean } | null;
}

const TERMINAL_LINES = [
  '> Scanning SERVER...',
  '> Bootcamp PHASES [OK]',
  '> Operator ACCOUNT CONNECTED',
  '> Zero_Day Market [ONLINE]',
  '> HSOCIETY_CHAIN [OK]',
];

const TerminalTicker: React.FC<{ shouldReduceMotion: boolean }> = ({ shouldReduceMotion }) => {
  const [lines, setLines] = React.useState<string[]>([TERMINAL_LINES[0]]);
  const [cursor, setCursor] = React.useState(true);

  useEffect(() => {
    if (shouldReduceMotion) {
      setLines(TERMINAL_LINES);
      return;
    }
    let idx = 0;
    const cursorTimer = setInterval(() => setCursor(c => !c), 530);
    const lineTimer = setInterval(() => {
      idx = (idx + 1) % TERMINAL_LINES.length;
      setLines(prev => [...prev.slice(-3), TERMINAL_LINES[idx]]);
    }, 1800);
    return () => { clearInterval(cursorTimer); clearInterval(lineTimer); };
  }, [shouldReduceMotion]);

  return (
    <div className="font-mono text-[10px] text-accent/60 leading-relaxed select-none" aria-hidden="true">
      {lines.map((l, i) => (
        <div key={i} className={i === lines.length - 1 ? 'text-accent/90' : 'text-accent/35'}>
          {l}{i === lines.length - 1 && <span className={cursor ? 'opacity-100' : 'opacity-0'}>_</span>}
        </div>
      ))}
    </div>
  );
};

const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ user }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(135deg, var(--color-bg) 0%, transparent 50%, var(--color-bg) 100%)' }}
      />

      <img
        src="/assets/illustrations/cta-operator.webp"
        alt=""
        aria-hidden="true"
        className="hidden lg:block absolute right-0 bottom-0 h-[120%] w-auto object-contain pointer-events-none select-none z-[1]"
        style={{ opacity: 0.7, maskImage: 'linear-gradient(to right, transparent 0%, black 20%)', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 20%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-2 md:px-10 w-full overflow-hidden">
        <div className="max-w-xl px-2 md:px-0">

          <div className="flex items-center gap-3 mb-3">
              <div className="h-[1px] w-8 bg-accent/40" />
              <span className="text-[10px] font-black text-accent uppercase tracking-[0.35em]">
                Don't Just see  Look.  
              </span>
            </div>

          <AsciiHeading 
            text={user ? "Operating" : "Operate"} 
            font="ANSI Shadow" 
            align="left" 
            animated 
            className="mb-8" 
          />

          <motion.p
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm md:text-base text-text-secondary leading-relaxed mb-8"
          >
            {user
              ? 'Your training is active. Head to your dashboard to continue where you left off.'
              : 'Join operators training in offensive security across Africa. No experience required — just commitment.'}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-row items-center gap-6 flex-wrap mb-10"
          >
            {user ? (
              <Link to="/dashboard" className="btn-primary !px-7 !py-3 text-sm inline-flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary !px-7 !py-3 text-sm inline-flex items-center gap-2">
                  Start Free Module <ArrowRight className="w-4 h-4" />
                </Link>
                 <Link to="/login" className="btn-secondary !px-7 !py-3 text-sm inline-flex items-center justify-center">
                   Log In
                 </Link>
              </>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="terminal-card flex items-start gap-3 px-4 py-3 rounded-2xl border border-border bg-bg-card/60 backdrop-blur-sm w-fit"
            style={{ boxShadow: 'var(--card-shimmer)' }}
          >
            <Terminal className="w-3.5 h-3.5 text-accent/50 mt-0.5 flex-none" aria-hidden />
            <TerminalTicker shouldReduceMotion={!!shouldReduceMotion} />
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default FinalCtaSection;
