import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { Flag, Terminal, Trophy, Zap, ArrowRight, Lock, Code2, Globe, Network } from 'lucide-react';
import ScrollReveal from '../../../../shared/components/ScrollReveal';

const CHALLENGE_TYPES = [
  { icon: Code2,    label: 'HTML Source',      color: 'text-blue-400',   desc: 'Inspect page source for hidden flags'       },
  { icon: Terminal, label: 'DevTools Console', color: 'text-accent',     desc: 'Uncover secrets in the browser console'     },
  { icon: Network,  label: 'Network Headers',  color: 'text-purple-400', desc: 'Intercept HTTP responses for clues'         },
  { icon: Globe,    label: 'Robots & Meta',    color: 'text-orange-400', desc: 'Crawl hidden paths and metadata'            },
  { icon: Lock,     label: 'Cookies & Auth',   color: 'text-yellow-400', desc: 'Exploit session and cookie mechanics'       },
  { icon: Zap,      label: 'JS Variables',     color: 'text-pink-400',   desc: 'Hunt variables buried in client-side code'  },
];

const STATS = [
  { value: '10+',  label: 'Challenge Types' },
  { value: 'CP',   label: 'Rewards Per Flag' },
  { value: '0',    label: 'VM Required' },
];

const CtfArenaSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-20 md:py-32 bg-bg border-y border-border relative overflow-hidden has-bg-image">
      {/* Background */}
      <img
        src="/assets/sections/backgrounds/ctf-bg.png"
        alt=""
        className="section-bg-img absolute inset-0 w-full h-full object-cover opacity-[0.10] md:opacity-[0.14] pointer-events-none"
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
      />
      <div className="section-bg-overlay light-theme-hide-bg-overlay absolute inset-0 pointer-events-none" />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
          <ScrollReveal>
            <span className="text-accent text-[11px] font-bold uppercase tracking-[0.3em] mb-3 block">// CTF ARENA</span>
            <h2 className="text-3xl md:text-4xl text-text-primary font-bold leading-tight">
              Hack With Your Browser.<br />
              <span className="text-accent">No VM. No Setup.</span>
            </h2>
            <p className="text-text-secondary text-sm md:text-base mt-4 max-w-lg leading-relaxed">
              Browser-native CTF challenges that teach real offensive techniques — DevTools, network inspection,
              cookie exploitation, and more. Earn CP for every flag you capture.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.15} className="flex flex-col items-start md:items-end gap-4">
            {/* Stats row */}
            <div className="flex items-center gap-6">
              {STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-xl md:text-2xl font-black text-accent font-mono">{s.value}</div>
                  <div className="text-[10px] text-text-muted uppercase tracking-widest">{s.label}</div>
                </div>
              ))}
            </div>
            <Link
              to="/ctf"
              className="flex items-center gap-2 text-accent text-sm font-bold border-b border-accent/30 pb-1 hover:border-accent group w-fit transition-colors"
            >
              Explore CTF Arena <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </ScrollReveal>
        </div>

        {/* Challenge type grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-12">
          {CHALLENGE_TYPES.map((type, i) => (
            <motion.div
              key={type.label}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="card-hsociety p-4 flex flex-col items-center text-center gap-2 group hover:border-accent/40 transition-all"
            >
              <div className={`p-2.5 rounded-lg bg-bg border border-border group-hover:border-accent/40 transition-colors ${type.color}`}>
                <type.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-text-primary leading-tight">{type.label}</span>
              <span className="text-[9px] text-text-muted leading-tight hidden sm:block">{type.desc}</span>
            </motion.div>
          ))}
        </div>

        {/* CTA card */}
        <ScrollReveal>
          <div className="relative rounded-xl border border-accent/20 bg-accent-dim/30 p-6 md:p-10 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Decorative flag icon */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none hidden md:block">
              <Flag className="w-48 h-48 text-accent" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Flag className="w-5 h-5 text-accent" />
                <span className="text-accent text-xs font-black uppercase tracking-widest">Capture The Flag</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-text-primary mb-2">
                Ready to Hunt Flags?
              </h3>
              <p className="text-text-secondary text-sm max-w-md">
                Each bootcamp module unlocks browser-based CTF challenges. Solve them, earn Cyber Points,
                and climb the leaderboard.
              </p>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row gap-3 shrink-0">
              <Link to="/ctf" className="btn-secondary !px-6 !py-3 text-sm flex items-center gap-2">
                <Trophy className="w-4 h-4" /> View Challenges
              </Link>
              <Link to="/register" className="btn-primary !px-6 !py-3 text-sm flex items-center gap-2">
                <Flag className="w-4 h-4" /> Start Hacking
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CtfArenaSection;
