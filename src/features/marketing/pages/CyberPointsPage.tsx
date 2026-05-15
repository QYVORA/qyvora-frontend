import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, BookOpen, Trophy, ShoppingBag, Shield, Zap, Lock, ChevronDown } from 'lucide-react';
import { CardBase } from '../../../shared/components/ui/Card';
import CpLogo from '../../../shared/components/CpLogo';
import ChainLogo from '../../../shared/components/ChainLogo';
import Footer from '../components/layout/Footer';
import BinaryStreamBackground from '../../../shared/components/BinaryStreamBackground';

const Snap: React.FC<{ id: string; children: React.ReactNode; className?: string }> = ({
  id, children, className = '',
}) => {
  const shouldReduceMotion = useReducedMotion();
  return (
    <section
      id={id}
      className={`ascii-section md:snap-start md:h-full md:flex-shrink-0 md:overflow-hidden flex flex-col justify-center ${className}`}
    >
      <BinaryStreamBackground />
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 40, filter: 'blur(6px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], filter: { duration: 0.45 } }}
        className="w-full md:h-full md:overflow-y-auto md:overflow-x-hidden"
        style={{ scrollbarWidth: 'none' }}
      >
        {children}
      </motion.div>
    </section>
  );
};

const ScrollHint: React.FC<{ targetId: string; containerId: string }> = ({ targetId, containerId }) => (
  <motion.button
    onClick={() => {
      const container = document.getElementById(containerId);
      const target = document.getElementById(targetId);
      if (container && target) container.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
    }}
    aria-label="Scroll down"
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.6 }}
    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1.5 text-text-muted hover:text-accent transition-colors"
  >
    <span className="text-[10px] font-bold uppercase tracking-[0.25em]">Scroll</span>
    <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}>
      <ChevronDown className="w-6 h-6" />
    </motion.div>
  </motion.button>
);

const CyberPointsPage: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      id="cp-scroll"
      className="w-full overflow-x-hidden md:h-full md:overflow-y-scroll md:snap-y md:snap-mandatory bg-bg"
      style={{ scrollSnapType: undefined }}
    >

      {/* ── 1. Hero ── */}
      <section
        id="cp-hero"
        className="ascii-section md:snap-start md:h-full md:flex-shrink-0 relative flex items-center md:overflow-hidden bg-bg min-h-[85vh] md:min-h-0"
      >
        <BinaryStreamBackground />
        <div className="absolute inset-0 bg-bg z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-accent/5 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute inset-0 dot-grid opacity-[0.05] z-0" />
        <div className="absolute inset-0 bg-radial-vignette opacity-50 z-10" />

        <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full py-24">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <span className="ascii-kicker mb-3 block md:text-sm">
                // CYBER POINTS
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-text-primary leading-[1.05] mb-8 tracking-tight flex flex-wrap items-center justify-center lg:justify-start gap-4"
            >
              What Is <CpLogo className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20" /> ?
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="text-text-secondary text-base md:text-lg lg:text-xl max-w-lg mb-8 leading-relaxed opacity-80"
            >
              Cyber Points is HSOCIETY's skill-backed internal currency. Earn <CpLogo className="w-4 h-4 mx-0.5 inline-block align-middle" /> by
              completing bootcamp rooms and CTF challenges, then spend it in the Zero-Day Market.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              className="flex w-full sm:w-auto flex-col sm:flex-row items-stretch sm:items-center gap-4"
            >
              <Link to="/bootcamps" className="btn-secondary glass-effect text-sm !px-10 py-4 font-medium transition-all hover:scale-[1.02] active:scale-[0.98] inline-flex items-center justify-center gap-2">
                <BookOpen className="w-4 h-4" /> Start Training
              </Link>
              <Link to="/zero-day-market" className="btn-primary glass-effect text-sm !px-10 py-4 font-medium transition-all hover:scale-[1.02] active:scale-[0.98] inline-flex items-center justify-center gap-2">
                <ShoppingBag className="w-4 h-4" /> Open Market <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex relative h-[400px] xl:h-[480px] w-full items-center justify-center"
          >
            <div className="absolute inset-0 rounded-full bg-accent/5 blur-[120px] pointer-events-none" />
            <motion.img
              src="/assets/branding/logos/cyber-points-logo.webp"
              alt="Cyber Points"
              className="w-[300px] xl:w-[360px] h-auto object-contain relative z-10 drop-shadow-[0_0_80px_rgba(136,173,124,0.3)] opacity-90"
              animate={shouldReduceMotion ? {} : { y: [0, -20, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </div>

        <ScrollHint targetId="cp-details" containerId="cp-scroll" />
      </section>

      {/* ── 2. Details ── */}
      <Snap id="cp-details" className="bg-bg-card border-y border-border/50">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: 'Complete Bootcamp Rooms', desc: 'Finish room tasks in any module to earn CP instantly.' },
              { icon: Shield, title: 'Capture CTF Flags', desc: 'Submit correct flags for immediate CP rewards.' },
              { icon: Trophy, title: 'Climb the Leaderboard', desc: 'Consistent activity and completions grow your rank.' },
              { icon: Zap, title: 'Proof-of-Skill', desc: 'A currency backed by real demonstrated ability, not just time spent.' },
              { icon: Lock, title: 'Gated Resources', desc: 'Unlocks premium zero-day tools and operator assets in the market.' },
              { icon: ChainLogo, title: 'Chain-Verified', desc: 'Every CP event is recorded on the HSOCIETY Chain — tamper-proof.', isChain: true }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.1 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <CardBase className="p-8 flex flex-col gap-5 h-full glass-effect hover:border-accent/40 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-accent/5 flex items-center justify-center border border-accent/10">
                    {item.isChain ? <item.icon size={20} /> : <item.icon className="w-5 h-5 text-accent" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-primary mb-2">{item.title}</h3>
                    <p className="text-sm text-text-muted leading-relaxed">{item.desc}</p>
                  </div>
                </CardBase>
              </motion.div>
            ))}
          </div>
        </div>
      </Snap>

      {/* ── 3. Final CTA + Footer ── */}
      <Snap id="cp-cta" className="bg-bg">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
            <CardBase className="p-8 flex flex-col sm:flex-row items-center gap-6 glass-effect hover:border-accent/40 transition-all">
              <ShoppingBag className="w-12 h-12 text-accent shrink-0" />
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <h3 className="text-lg font-bold text-text-primary mb-1">Zero-Day Market</h3>
                <p className="text-sm text-text-muted">Spend your CP on tools and operator assets.</p>
              </div>
              <Link to="/zero-day-market" className="btn-primary glass-effect text-xs !px-8 py-3 shrink-0 inline-flex items-center gap-2">
                Open Market <ArrowRight className="w-4 h-4" />
              </Link>
            </CardBase>

            <CardBase className="p-8 flex flex-col sm:flex-row items-center gap-6 glass-effect hover:border-accent/40 transition-all">
              <Trophy className="w-12 h-12 text-accent shrink-0" />
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <h3 className="text-lg font-bold text-text-primary mb-1">Start Earning Today</h3>
                <p className="text-sm text-text-muted">Create a free account and begin training.</p>
              </div>
              <Link to="/register" className="btn-primary glass-effect text-xs !px-8 py-3 shrink-0 inline-flex items-center gap-2">
                Sign Up <ArrowRight className="w-4 h-4" />
              </Link>
            </CardBase>
          </div>
          <Footer />
        </div>
      </Snap>

    </div>
  );
};

export default CyberPointsPage;
