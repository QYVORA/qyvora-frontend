import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { Flag, Terminal, Trophy, Zap, ArrowRight, Lock, Code2, Globe, Network, Shield, ChevronDown } from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import { CardBase } from '../../../shared/components/ui/Card';
import CpLogo from '../../../shared/components/CpLogo';
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

const CHALLENGE_TYPES = [
  { icon: Code2,      color: 'text-blue-400',   title: 'HTML Source',      desc: 'Hunt flags hidden in page source comments and attributes.' },
  { icon: Terminal,   color: 'text-accent',      title: 'DevTools Console', desc: 'Find clues logged to the browser console on page load.' },
  { icon: Network,    color: 'text-purple-400',  title: 'Network Headers',  desc: 'Inspect HTTP response headers for embedded flags.' },
  { icon: Lock,       color: 'text-yellow-400',  title: 'Cookies & Auth',   desc: 'Find flags hidden in cookie values or session tokens.' },
  { icon: Globe,      color: 'text-orange-400',  title: 'Robots & Meta',    desc: 'Check /robots.txt and meta tags for hidden data.' },
  { icon: Zap,        color: 'text-pink-400',    title: 'JS Variables',     desc: 'Dig into Sources tab for variables buried in client-side JS.' },
  { icon: Shield,     color: 'text-cyan-400',    title: 'Base64 Decode',    desc: 'Decode visible base64 strings using atob() in the console.' },
  { icon: ArrowRight, color: 'text-red-400',     title: 'Redirect Chains',  desc: 'Follow redirect chains in the Network tab to the flag.' },
];

const PublicCtfPage: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      id="ctf-scroll"
      className="w-full overflow-x-hidden md:h-full md:overflow-y-scroll md:snap-y md:snap-mandatory"
      style={{ scrollSnapType: undefined }}
    >

      {/* ── 1. Hero ── */}
      <section
        id="ctf-hero"
        className="ascii-section md:snap-start md:h-full md:flex-shrink-0 relative flex items-center md:overflow-hidden scanlines bg-bg min-h-[85vh] md:min-h-0"
      >
        <BinaryStreamBackground />
        <div className="absolute inset-0 bg-bg z-0 light-theme-hide-bg-base" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute inset-0 dot-grid hero-dot-grid opacity-20 z-0" />
        <div className="absolute inset-0 bg-radial-vignette opacity-70 z-10" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-20 w-full py-16">
          <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="ascii-kicker mb-3 block md:text-sm">
              // CTF ARENA
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-text-primary leading-tight mb-6">
              Hack With Your Browser.{' '}
              <span className="text-accent">No VM. No Setup.</span>
            </h1>
            <p className="text-text-secondary text-base md:text-lg leading-relaxed mb-8 max-w-lg">
              Browser-native Capture The Flag challenges. Use DevTools, network inspection,
              and cookie exploitation — right in your browser. Earn{' '}
              <CpLogo className="w-4 h-4 mx-0.5 inline-block" /> for every flag.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="btn-primary flex items-center gap-2">
                <Flag className="w-4 h-4" /> Start Hacking
              </Link>
              <Link to="/bootcamps" className="btn-secondary flex items-center gap-2">
                <Terminal className="w-4 h-4" /> View Bootcamps
              </Link>
            </div>
            </motion.div>
          </div>
        </div>

        <ScrollHint targetId="ctf-types" containerId="ctf-scroll" />
      </section>

      {/* ── 2. Challenge types ── */}
      <Snap id="ctf-types" className="bg-bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-14">
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.55 }}
              className="mb-8 md:mb-10"
            >
              <span className="text-accent text-[11px] font-black uppercase tracking-[0.35em] mb-2 block">CHALLENGE TYPES</span>
              <h2 className="text-2xl md:text-3xl font-bold text-text-primary">8 Ways to Hunt a Flag</h2>
              <p className="text-text-muted text-sm mt-1 max-w-lg">Every challenge type teaches a real browser-based recon skill.</p>
            </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CHALLENGE_TYPES.map((ct, i) => (
              <ScrollReveal key={ct.title} delay={i * 0.08}>
                <CardBase className="p-5 flex flex-col gap-3 h-full hover:border-accent/40 transition-all">
                  <div className="w-9 h-9 rounded-xl bg-accent-dim flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <ct.icon className={`w-4 h-4 ${ct.color}`} />
                  </div>
                  <p className="text-sm font-black text-text-primary group-hover:text-accent transition-colors duration-300">{ct.title}</p>
                  <p className="text-xs text-text-muted leading-relaxed">{ct.desc}</p>
                </CardBase>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </Snap>

      {/* ── 3. CTA + Footer ── */}
      <Snap id="ctf-cta" className="bg-bg">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
            {[
              { icon: <CpLogo className="w-7 h-7 shrink-0" />, title: 'Every Flag Earns CP', desc: 'Spend CP on hints, marketplace items, and operator perks.', cta: 'Learn CP', href: '/cyber-points', primary: false },
              { icon: <Flag className="w-7 h-7 text-accent shrink-0" />, title: "The Flag Won't Capture Itself", desc: 'Enroll in a bootcamp and start hunting today.', cta: 'Sign Up', href: '/register', primary: true },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={shouldReduceMotion ? false : { opacity: 0, x: i === 0 ? -40 : 40, y: 20, scale: 0.94, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)' }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.65, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                whileHover={shouldReduceMotion ? {} : { y: -6, scale: 1.01, transition: { duration: 0.2 } }}
              >
                <div className="terminal-card card-hsociety p-5 flex flex-col sm:flex-row items-center gap-4 h-full hover:border-accent/40 transition-all">
                  {card.icon}
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <p className="text-sm font-black text-text-primary mb-0.5">{card.title}</p>
                    <p className="text-xs text-text-muted">{card.desc}</p>
                  </div>
                  <Link to={card.href} className={`${card.primary ? 'btn-primary' : 'btn-secondary'} text-xs !px-4 !py-2 shrink-0 inline-flex items-center gap-1.5 group`}>
                    {card.cta} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.94, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="terminal-card rounded-lg border-2 border-accent/25 bg-accent-dim p-8 text-center md:p-10 relative overflow-hidden"
          >
            <motion.div
              className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <span className="ascii-kicker mb-3 block">// CTF Arena</span>
            <h2 className="mb-3 text-3xl font-black text-text-primary md:text-4xl">Start hunting flags today.</h2>
            <p className="mx-auto mb-6 max-w-md text-base text-text-muted">No VM. No setup. Just your browser, DevTools, and the will to find the flag.</p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link to="/register" className="btn-primary inline-flex items-center gap-2 px-8 py-3 text-sm group">
                <Flag className="w-4 h-4" /> Start Hacking <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/leaderboard" className="btn-secondary inline-flex items-center gap-2 px-8 py-3 text-sm">
                <Trophy className="w-4 h-4" /> Leaderboard
              </Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </Snap>

    </div>
  );
};

export default PublicCtfPage;
