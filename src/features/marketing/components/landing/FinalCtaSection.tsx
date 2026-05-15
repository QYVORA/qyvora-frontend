import React, { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, ArrowRight, Terminal } from 'lucide-react';
import HeroBackground from '../HeroBackground';
import AsciiHeading from '../../../../shared/components/ui/AsciiHeading';

interface FinalCtaSectionProps {
  user: { isAdmin?: boolean } | null;
}

const LiveGridCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    const CELL = 36;
    const accent = '#B7FF99';

    const nodes: { cx: number; cy: number; phase: number; speed: number; size: number }[] = [];

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      nodes.length = 0;
      const cols = Math.ceil(canvas.width  / CELL) + 1;
      const rows = Math.ceil(canvas.height / CELL) + 1;
      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          if (Math.random() < 0.08) {
            nodes.push({
              cx: c * CELL,
              cy: r * CELL,
              phase: Math.random() * Math.PI * 2,
              speed: 0.4 + Math.random() * 0.8,
              size:  1.5 + Math.random() * 2,
            });
          }
        }
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(183,255,153,0.07)';
      const cols = Math.ceil(canvas.width  / CELL) + 1;
      const rows = Math.ceil(canvas.height / CELL) + 1;
      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          ctx.beginPath();
          ctx.arc(c * CELL, r * CELL, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      for (const n of nodes) {
        const pulse = (Math.sin(t * n.speed + n.phase) + 1) / 2;
        ctx.beginPath();
        ctx.arc(n.cx, n.cy, n.size * (0.6 + pulse * 0.8), 0, Math.PI * 2);
        ctx.fillStyle = accent;
        ctx.globalAlpha = 0.12 + pulse * 0.55;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      t += 0.018;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
};

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
    <section className="
      ascii-section relative pt-28 pb-20 md:py-0 bg-bg scanlines flex items-center has-bg-image
      md:h-full md:overflow-hidden
    ">
      <HeroBackground className="opacity-40" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(135deg, var(--color-bg) 0%, transparent 50%, var(--color-bg) 100%)' }}
      />
      {!shouldReduceMotion && <LiveGridCanvas />}

      <img
        src="/assets/illustrations/cta-operator.webp"
        alt=""
        aria-hidden="true"
        className="hidden lg:block absolute right-0 bottom-0 h-[88%] w-auto object-contain pointer-events-none select-none z-[1]"
        style={{ opacity: 0.7, maskImage: 'linear-gradient(to right, transparent 0%, black 20%)', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 20%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 w-full">
        <div className="max-w-xl">
          <AsciiHeading 
            text={user ? "Operating" : "Operate"} 
            font="Larry3d" 
            align="left" 
            animated 
            glow="intense" 
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
            className="flex flex-row items-center gap-3 flex-wrap mb-10"
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
            className="terminal-card border-beam flex items-start gap-3 px-4 py-3 rounded-xl border border-border bg-bg-card/60 backdrop-blur-sm w-fit"
            style={{ boxShadow: 'var(--card-shimmer)' }}
          >
            <Terminal className="w-3.5 h-3.5 text-accent/50 mt-0.5 flex-none" aria-hidden />
            <TerminalTicker shouldReduceMotion={!!shouldReduceMotion} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FinalCtaSection;
