import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Flag, Terminal, Trophy, Zap, ArrowRight, Lock, Code2,
  Globe, Network, CheckCircle2, Shield, Lightbulb,
} from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';

// ── Challenge type catalogue ──────────────────────────────────────────────────
const CHALLENGE_TYPES = [
  {
    icon: Code2,
    label: 'HTML Source',
    color: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
    desc: 'Press Ctrl+U to view page source and hunt for hidden flags in comments, attributes, and inline data.',
  },
  {
    icon: Terminal,
    label: 'DevTools Console',
    color: 'text-accent border-accent/30 bg-accent/10',
    desc: 'Open the browser console (F12) and look for logged clues, encoded strings, or injected messages.',
  },
  {
    icon: Network,
    label: 'Network Headers',
    color: 'text-purple-400 border-purple-400/30 bg-purple-400/10',
    desc: 'Intercept HTTP responses in the Network tab and inspect custom headers for embedded flags.',
  },
  {
    icon: Lock,
    label: 'Cookies & Auth',
    color: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
    desc: 'Inspect Application → Cookies in DevTools. Flags can be hidden in cookie values or session tokens.',
  },
  {
    icon: Globe,
    label: 'Robots & Meta',
    color: 'text-orange-400 border-orange-400/30 bg-orange-400/10',
    desc: 'Visit /robots.txt or inspect <meta> tags in page source for disallowed paths and hidden data.',
  },
  {
    icon: Zap,
    label: 'JS Variables',
    color: 'text-pink-400 border-pink-400/30 bg-pink-400/10',
    desc: 'Dig into the Sources tab and search for variables, constants, or obfuscated strings in client-side JS.',
  },
  {
    icon: Shield,
    label: 'Base64 Decode',
    color: 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10',
    desc: 'Spot encoded strings on screen or in source, then decode them using atob() in the console.',
  },
  {
    icon: ArrowRight,
    label: 'Redirect Chains',
    color: 'text-red-400 border-red-400/30 bg-red-400/10',
    desc: 'Enable "Preserve log" in the Network tab and follow redirect chains to find the final destination flag.',
  },
];

// ── How it works steps ────────────────────────────────────────────────────────
const HOW_IT_WORKS = [
  { step: '01', title: 'Enroll in a Bootcamp',   desc: 'Each bootcamp module unlocks a corresponding CTF challenge set.' },
  { step: '02', title: 'Open the CTF Arena',      desc: 'Navigate to your module\'s CTF page — no VM, no downloads needed.' },
  { step: '03', title: 'Use Your Browser Tools',  desc: 'DevTools, page source, network inspector — your weapons are built in.' },
  { step: '04', title: 'Submit the Flag',         desc: 'Enter FLAG{...} format answers and earn Cyber Points instantly.' },
];

// ── Component ─────────────────────────────────────────────────────────────────
const PublicCtfPage: React.FC = () => {
  return (
    <div className="relative w-full overflow-x-hidden">

      {/* ── Hero ── */}
      <section className="relative min-h-[70vh] flex items-center py-24 md:py-32 bg-bg overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 w-full">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-accent text-[11px] font-bold uppercase tracking-[0.3em] mb-4 block">
                // CTF ARENA
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-text-primary leading-tight mb-6">
                Hack With Your Browser.{' '}
                <span className="text-accent">No VM. No Setup.</span>
              </h1>
              <p className="text-text-secondary text-base md:text-lg leading-relaxed mb-8 max-w-2xl">
                Browser-native Capture The Flag challenges that teach real offensive security techniques.
                Use DevTools, network inspection, cookie exploitation, and more — right in your browser.
                Earn Cyber Points for every flag you capture.
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

          {/* Floating stat pills */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-3 mt-12"
          >
            {[
              { icon: Flag,    label: '10+ Challenge Types' },
              { icon: Zap,     label: 'CP Rewards Per Flag' },
              { icon: Trophy,  label: 'Leaderboard Rankings' },
              { icon: Shield,  label: 'No VM Required'       },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-card border border-border text-xs font-bold text-text-secondary">
                <Icon className="w-3.5 h-3.5 text-accent" />
                {label}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Challenge Types ── */}
      <section className="py-20 md:py-28 bg-bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <ScrollReveal>
            <span className="text-accent text-[11px] font-bold uppercase tracking-[0.3em] mb-3 block">// CHALLENGE TYPES</span>
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              8 Categories. Real Techniques.
            </h2>
            <p className="text-text-secondary text-sm md:text-base max-w-xl mb-12">
              Every challenge type mirrors a real-world offensive technique. Master them all to become a full-spectrum operator.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {CHALLENGE_TYPES.map((type, i) => (
              <motion.div
                key={type.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                className="card-hsociety p-5 flex flex-col gap-3 group hover:border-accent/40 transition-all"
              >
                <div className={`w-10 h-10 rounded-lg border flex items-center justify-center flex-none ${type.color}`}>
                  <type.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-text-primary mb-1">{type.label}</h3>
                  <p className="text-xs text-text-muted leading-relaxed">{type.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 md:py-28 bg-bg">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <ScrollReveal>
            <span className="text-accent text-[11px] font-bold uppercase tracking-[0.3em] mb-3 block">// HOW IT WORKS</span>
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-12">
              From Zero to Flag in 4 Steps
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {HOW_IT_WORKS.map((step, i) => (
              <ScrollReveal key={step.step} delay={i * 0.1}>
                <div className="relative">
                  {/* Connector line */}
                  {i < HOW_IT_WORKS.length - 1 && (
                    <div className="hidden lg:block absolute top-6 left-full w-full h-px bg-border z-0" style={{ width: 'calc(100% - 3rem)' }} />
                  )}
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-accent-dim border border-accent/30 flex items-center justify-center mb-4">
                      <span className="text-accent font-black text-sm font-mono">{step.step}</span>
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-text-primary mb-2">{step.title}</h3>
                    <p className="text-xs text-text-muted leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Rewards ── */}
      <section className="py-20 md:py-28 bg-bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            <ScrollReveal>
              <span className="text-accent text-[11px] font-bold uppercase tracking-[0.3em] mb-3 block">// REWARDS</span>
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Every Flag Earns You Cyber Points
              </h2>
              <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-6">
                Cyber Points (CP) are the HSOCIETY economy currency. Capture flags, earn CP, spend them
                on hints, marketplace items, and exclusive operator perks.
              </p>
              <ul className="space-y-3">
                {[
                  'Earn CP for every correct flag submission',
                  'Use hints (costs CP) when you\'re stuck',
                  'Climb the leaderboard with your total XP',
                  'Redeem CP in the Zero-Day Marketplace',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-text-secondary">
                    <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div className="card-hsociety p-6 md:p-8 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <Lightbulb className="w-5 h-5 text-accent" />
                  <span className="text-sm font-black uppercase tracking-widest text-text-primary">Hint System</span>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  Stuck on a challenge? Unlock hints using your Cyber Points. Each hint costs CP but
                  gives you a targeted clue to push you in the right direction.
                </p>
                <div className="grid grid-cols-3 gap-3 pt-2">
                  {[
                    { label: 'Hint 1', cost: 'Low CP',  color: 'text-accent' },
                    { label: 'Hint 2', cost: 'Med CP',  color: 'text-yellow-400' },
                    { label: 'Hint 3', cost: 'High CP', color: 'text-red-400' },
                  ].map((h) => (
                    <div key={h.label} className="rounded-lg bg-bg border border-border p-3 text-center">
                      <div className={`text-xs font-black uppercase tracking-wider ${h.color} mb-1`}>{h.label}</div>
                      <div className="text-[10px] text-text-muted">{h.cost}</div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-20 md:py-28 bg-bg">
        <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
          <ScrollReveal>
            <div className="w-16 h-16 rounded-2xl bg-accent-dim border border-accent/30 flex items-center justify-center mx-auto mb-6">
              <Flag className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-text-primary mb-4">
              The Flag Won't Capture Itself
            </h2>
            <p className="text-text-secondary text-sm md:text-base mb-8 max-w-lg mx-auto">
              Join HSOCIETY OFFSEC, enroll in a bootcamp, and start hunting flags today.
              No VM. No setup. Just your browser and your skills.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/register" className="btn-primary flex items-center gap-2">
                <Flag className="w-4 h-4" /> Create Free Account
              </Link>
              <Link to="/leaderboard" className="btn-secondary flex items-center gap-2">
                <Trophy className="w-4 h-4" /> View Leaderboard
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
};

export default PublicCtfPage;
