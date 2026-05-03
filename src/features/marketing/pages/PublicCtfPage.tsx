import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Flag, Terminal, Trophy, Zap, ArrowRight, Lock, Code2, Globe, Network, Shield } from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import { CardBase } from '../../../shared/components/ui/Card';
import CpLogo from '../../../shared/components/CpLogo';

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
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
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
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
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

      {/* ── Cards ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <ScrollReveal>
            <CardBase className="p-6 flex flex-col gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent-dim flex items-center justify-center">
                <Code2 className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-sm font-black text-text-primary">HTML Source</p>
              <p className="text-xs text-text-muted leading-relaxed">Hunt flags hidden in page source comments and attributes.</p>
            </CardBase>
          </ScrollReveal>

          <ScrollReveal delay={0.05}>
            <CardBase className="p-6 flex flex-col gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent-dim flex items-center justify-center">
                <Terminal className="w-4 h-4 text-accent" />
              </div>
              <p className="text-sm font-black text-text-primary">DevTools Console</p>
              <p className="text-xs text-text-muted leading-relaxed">Find clues logged to the browser console on page load.</p>
            </CardBase>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <CardBase className="p-6 flex flex-col gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent-dim flex items-center justify-center">
                <Network className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-sm font-black text-text-primary">Network Headers</p>
              <p className="text-xs text-text-muted leading-relaxed">Inspect HTTP response headers for embedded flags.</p>
            </CardBase>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <CardBase className="p-6 flex flex-col gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent-dim flex items-center justify-center">
                <Lock className="w-4 h-4 text-yellow-400" />
              </div>
              <p className="text-sm font-black text-text-primary">Cookies & Auth</p>
              <p className="text-xs text-text-muted leading-relaxed">Find flags hidden in cookie values or session tokens.</p>
            </CardBase>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <CardBase className="p-6 flex flex-col gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent-dim flex items-center justify-center">
                <Globe className="w-4 h-4 text-orange-400" />
              </div>
              <p className="text-sm font-black text-text-primary">Robots & Meta</p>
              <p className="text-xs text-text-muted leading-relaxed">Check /robots.txt and meta tags for hidden data.</p>
            </CardBase>
          </ScrollReveal>

          <ScrollReveal delay={0.25}>
            <CardBase className="p-6 flex flex-col gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent-dim flex items-center justify-center">
                <Zap className="w-4 h-4 text-pink-400" />
              </div>
              <p className="text-sm font-black text-text-primary">JS Variables</p>
              <p className="text-xs text-text-muted leading-relaxed">Dig into Sources tab for variables buried in client-side JS.</p>
            </CardBase>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <CardBase className="p-6 flex flex-col gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent-dim flex items-center justify-center">
                <Shield className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-sm font-black text-text-primary">Base64 Decode</p>
              <p className="text-xs text-text-muted leading-relaxed">Decode visible base64 strings using atob() in the console.</p>
            </CardBase>
          </ScrollReveal>

          <ScrollReveal delay={0.35}>
            <CardBase className="p-6 flex flex-col gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent-dim flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-red-400" />
              </div>
              <p className="text-sm font-black text-text-primary">Redirect Chains</p>
              <p className="text-xs text-text-muted leading-relaxed">Follow redirect chains in the Network tab to the flag.</p>
            </CardBase>
          </ScrollReveal>

        </div>

        {/* CTA row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          <ScrollReveal>
            <CardBase className="p-6 flex flex-col sm:flex-row items-center gap-4">
              <CpLogo className="w-8 h-8 shrink-0" />
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <p className="text-sm font-black text-text-primary mb-0.5">Every Flag Earns CP</p>
                <p className="text-xs text-text-muted">Spend CP on hints, marketplace items, and operator perks.</p>
              </div>
              <Link to="/cyber-points" className="btn-secondary text-xs !px-5 !py-2.5 shrink-0 inline-flex items-center gap-1.5">
                Learn CP <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardBase>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <CardBase className="p-6 flex flex-col sm:flex-row items-center gap-4">
              <Flag className="w-8 h-8 text-accent shrink-0" />
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <p className="text-sm font-black text-text-primary mb-0.5">The Flag Won't Capture Itself</p>
                <p className="text-xs text-text-muted">Enroll in a bootcamp and start hunting today.</p>
              </div>
              <Link to="/register" className="btn-primary text-xs !px-5 !py-2.5 shrink-0 inline-flex items-center gap-1.5">
                Sign Up <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardBase>
          </ScrollReveal>
        </div>
      </div>

    </div>
  );
};

export default PublicCtfPage;
