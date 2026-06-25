import React from 'react';
import { motion } from 'motion/react';
import { Download, Zap } from 'lucide-react';

const TERMINAL_LINES = [
  { type: 'comment', text: '# Reconnaissance scan — surface intelligence' },
  { type: 'command', text: 'anansi scan target.com --deep --out terminal' },
  { type: 'output', text: '' },
  { type: 'output', text: '  ── PHASE 01 ── DISCOVERY // subdomain enumeration + DNS resolution' },
  { type: 'output', text: '  [*] Querying crt.sh certificate transparency logs...' },
  { type: 'output', text: '  [*] Brute-forcing subdomains (20,010 wordlist)' },
  { type: 'output', text: '  [✓] 42 subdomains discovered — 18 live, 24 dead' },
  { type: 'output', text: '' },
  { type: 'output', text: '  ── PHASE 02 ── PROBE // HTTP/HTTPS surface mapping' },
  { type: 'output', text: '  [✓] 18 live hosts — 23 open ports, 3 web servers' },
  { type: 'output', text: '' },
  { type: 'output', text: '  ── PHASE 04 ── HEADERS // security header audit' },
  { type: 'output', text: '  [HIGH] Missing CSP on https://api.target.com' },
  { type: 'output', text: '  [MEDIUM] Missing X-Frame-Options on 2 hosts' },
  { type: 'output', text: '' },
  { type: 'output', text: '  ── PHASE 05 ── PATHS // exposed endpoint detection' },
  { type: 'output', text: '  [CRITICAL] Exposed .env at https://dev.target.com/.env' },
  { type: 'output', text: '' },
  { type: 'output', text: '  ── PHASE 06 ── TAKEOVER // dangling CNAME detection' },
  { type: 'output', text: '  [CRITICAL] Heroku takeover — old.target.com → *.herokuapp.com' },
  { type: 'output', text: '' },
  { type: 'output', text: '  ── SUMMARY ────────────────────────────────────────' },
  { type: 'output', text: '  target      target.com' },
  { type: 'output', text: '  duration    1m 23s' },
  { type: 'output', text: '  risk score  74/100' },
  { type: 'output', text: '  findings    CRIT:2  HIGH:3  MED:4  LOW:2' },
];

const AnansiHeroSection: React.FC = () => {
  return (
    <div className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-10 lg:px-12 xl:px-16 w-full h-full flex items-center pt-28 md:pt-24 lg:pt-28">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-16 xl:gap-20 items-center w-full">
        <div className="space-y-8 text-left">
          <div className="space-y-4">
            <span className="text-xs font-black uppercase tracking-[0.4em] text-accent block">
              // Available Now v1.0.0
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[0.9]">
              ANANSI <span className="text-accent">CLI</span>
            </h1>
          </div>
          <p className="text-lg md:text-xl lg:text-2xl text-text-secondary font-mono leading-relaxed">
            Terminal-first attack surface intelligence engine. Built for speed, portability, and raw technical signal.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            <a
              href="#install"
              className="btn-primary px-8 py-4 font-black uppercase tracking-[0.15em] text-xs flex items-center justify-center gap-3"
            >
              <Download className="w-4 h-4" /> Get Binary
            </a>
            <a
              href="https://github.com/QYVORA/qyvora-anansi-cli"
              target="_blank"
              rel="noreferrer"
              className="px-8 py-4 border border-border bg-bg-card/30 hover:border-accent/40 rounded-xl text-xs font-black uppercase tracking-[0.15em] hover:text-accent transition-all text-center"
            >
              <Zap className="w-4 h-4 inline-block mr-2" /> View Source
            </a>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:block w-full max-w-xl ml-auto"
        >
          <div className="bg-[#050505] border border-white/10 rounded-2xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] max-h-[420px] flex flex-col">
            <div className="bg-[#121212] border-b border-white/5 px-4 sm:px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex gap-2.5">
                <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56]" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e]" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f]" />
              </div>
              <div className="text-[10px] font-mono text-white/40 tracking-[0.2em] uppercase font-bold">
                operator@qyvora:~
              </div>
              <div className="w-10" />
            </div>
            <div className="p-6 sm:p-8 font-mono text-sm space-y-1.5 overflow-y-auto custom-scrollbar">
              {TERMINAL_LINES.map((line, i) => (
                <div key={i}>
                  {line.type === 'comment' ? (
                    <span className="text-accent/40">{line.text}</span>
                  ) : line.type === 'command' ? (
                    <span>
                      <span className="text-accent font-bold">$ </span>
                      <span className="text-white">{line.text}</span>
                    </span>
                  ) : (
                    <span className="text-white/60">{line.text}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnansiHeroSection;
export { AnansiHeroSection };
