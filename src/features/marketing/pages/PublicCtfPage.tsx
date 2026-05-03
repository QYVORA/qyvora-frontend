import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Flag, Terminal, Trophy, Zap, ArrowRight, Lock,
  Code2, Globe, Network, Shield,
} from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import { CardBase } from '../../../shared/components/ui/Card';
import CpLogo from '../../../shared/components/CpLogo';

const CHALLENGE_TYPES = [
  { icon: Code2,    label: 'HTML Source',      color: 'text-blue-400',   desc: 'Hunt flags hidden in page source comments and attributes.' },
  { icon: Terminal, label: 'DevTools Console', color: 'text-accent',     desc: 'Find clues logged to the browser console on page load.' },
  { icon: Network,  label: 'Network Headers',  color: 'text-purple-400', desc: 'Inspect HTTP response headers for embedded flags.' },
  { icon: Lock,     label: 'Cookies & Auth',   color: 'text-yellow-400', desc: 'Find flags hidden in cookie values or session tokens.' },
  { icon: Globe,    label: 'Robots & Meta',    color: 'text-orange-400', desc: 'Check /robots.txt and <meta> tags for hidden data.' },
  { icon: Zap,      label: 'JS Variables',     color: 'text-pink-400',   desc: 'Dig into Sources tab for variables buried in client-side JS.' },
  { icon: Shield,   label: 'Base64 Decode',    color: 'text-cyan-400',   desc: 'Decode visible base64 strings using atob() in the console.' },
  { icon: ArrowRight, label: 'Redirect Chains', color: 'text-red-400',  desc: 'Follow redirect chains in the Network tab to the flag.' },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Enroll in a Bootcamp',  desc: 'Each module unlocks a corresponding CTF challenge set.' },
  { step: '02', title: 'Open the CTF Arena',    desc: 'No VM, no downloads — just your browser.' },
  { step: '03', title: 'Use Your DevTools',     desc: 'Network, Sources, Console, Application — all built in.' },
  { step: '04', title: 'Submit the Flag',       desc: 'Enter FLAG{...} and earn Cyber Points instantly.' },
];

const PublicCtfPage: React.FC = () => {
  return (
    <div className="relative w-full overflow-x-hidden">

      {/* ── Hero ── */}
      <section className="relative min-h-[70vh] flex items-center py-24 md:py-32 bg-bg overflow-hidden scanlines">
        <div className="absolute inset-0 bg-bg z-0 light-theme-hide-bg-base" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute inset-0 dot-grid hero-dot-grid opacity-20 z-0" />
        <div className="absolute inset-0 bg-radial-vignette opacity-70 z-10" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-20 w-full">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mb-5 px-3 py-1 border border-border bg-accent-dim rounded-sm w-fit">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">// CTF ARENA</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-text-primary leading-tight mb-6">
                Hack With Your Browser.{' '}
                <span className="text-accent">No VM. No Setup.</span>
              </h1>
              <p className="text-text-secondary text-base md:text-lg leading-relaxed mb-8 max-w-2xl">
                Browser-native Capture The Flag challenges. Use DevTools, network inspection,
                and cookie exploitation — right in your browser. Earn <CpLogo className="w-4 h-4 mx-0.5" /> for every flag.
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

          {/* Stat pills */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-3 mt-12"
          >
            {[
              { icon: Flag,   label: '8 Challenge Types' },
              { icon: Zap,    label: 'CP Per Flag' },
              { icon: Trophy, label: 'Leaderboard Rankings' },
              { icon: Shield, label: 'No VM Required' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-card border border-border text-xs font-bold text-text-secondary">
                <Icon className="w-3.5 h-3.5 text-accent" />
                {label}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Body ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 space-y-5">

        {/* Challenge types */}
        <ScrollReveal>
          <CardBase className="p-6 md:p-8">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-1">// Challenge Types</p>
            <h2 className="text-xl font-black text-text-primary mb-6">8 Categories. Real Techniques.</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {CHALLENGE_TYPES.map(({ icon: Icon, label, color, desc }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <CardBase className="p-4 flex flex-col gap-2 h-full">
                    <div className={`w-8 h-8 rounded bg-accent-dim flex items-center justify-center flex-none ${color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-black uppercase tracking-wider text-text-primary">{label}</p>
                    <p className="text-[11px] text-text-muted leading-relaxed">{desc}</p>
                  </CardBase>
                </motion.div>
              ))}
            </div>
          </CardBase>
        </ScrollReveal>

        {/* How it works */}
        <ScrollReveal>
          <CardBase className="p-6 md:p-8">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-1">// How It Works</p>
            <h2 className="text-xl font-black text-text-primary mb-6">From Zero to Flag in 4 Steps</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {HOW_IT_WORKS.map(({ step, title, desc }, i) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <CardBase className="p-4 flex flex-col gap-3 h-full">
                    <div className="w-10 h-10 rounded-xl bg-accent-dim border border-accent/30 flex items-center justify-center">
                      <span className="text-accent font-black text-sm font-mono">{step}</span>
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase tracking-wider text-text-primary mb-1">{title}</p>
                      <p className="text-xs text-text-muted leading-relaxed">{desc}</p>
                    </div>
                  </CardBase>
                </motion.div>
              ))}
            </div>
          </CardBase>
        </ScrollReveal>

        {/* CP rewards callout */}
        <ScrollReveal>
          <CardBase className="flex flex-col sm:flex-row items-center gap-4 px-6 py-5">
            <CpLogo className="w-9 h-9 shrink-0" />
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <p className="text-sm font-black text-text-primary">Every flag earns you Cyber Points</p>
              <p className="text-xs text-text-muted mt-0.5">Spend CP on hints, marketplace items, and operator perks.</p>
            </div>
            <Link to="/cyber-points" className="btn-secondary text-xs !px-5 !py-2.5 shrink-0 inline-flex items-center gap-2">
              Learn about CP <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardBase>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal>
          <CardBase className="p-8 md:p-12 text-center flex flex-col items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-accent-dim border border-accent/30 flex items-center justify-center">
              <Flag className="w-7 h-7 text-accent" />
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-text-primary">
              The Flag Won't Capture Itself
            </h3>
            <p className="text-sm text-text-secondary max-w-md">
              Enroll in a bootcamp and start hunting flags today. No VM. No setup. Just your browser.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/register" className="btn-primary !px-8 !py-3 text-sm inline-flex items-center justify-center gap-2">
                <Flag className="w-4 h-4" /> Create Free Account
              </Link>
              <Link to="/leaderboard" className="btn-secondary !px-8 !py-3 text-sm inline-flex items-center justify-center gap-2">
                <Trophy className="w-4 h-4" /> View Leaderboard
              </Link>
            </div>
          </CardBase>
        </ScrollReveal>

      </div>
    </div>
  );
};

export default PublicCtfPage;
