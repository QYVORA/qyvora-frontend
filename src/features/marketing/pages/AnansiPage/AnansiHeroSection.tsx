import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Download, Zap } from 'lucide-react';

const BANNER = [
  '              ;                  &              ',
  '            ;;                    ;&            ',
  '           ;;;                    ;;;           ',
  '      ;    ;;;                    ;;;    ;      ',
  '      ;;;  ;;;        ;   ;;      ;;;   ;;;     ',
  '      ;;;;  ;;;;   ;;; && ;;;   ;;;;   ;;;;     ',
  '       ;;;;   ;;;; ;;;;;;;;;; ;;;;    ;;;;      ',
  '         ;;;;;;;;; ;;;;;;;;;;;;;;;; ;;;;;;;;;    ',
  '             &;;;;;;;;;;;;$x;;;;;;;;;;;;         ',
  '            ;;;;;;;;;;&&&+++&&&;;;;;;;;;;;       ',
  '      ;;;;;;;;;  ;;;&&+&&&&&+&&;;;  ;;;;;;;;;;  ',
  '      ;;;&    ;; ;;;&+&&&&&&&+&&;;; ;;    &;;;  ',
  '      ;;;   ;;;;  ;;;&&+&&&&&&+&;;; ;;;;   ;;;  ',
  '      ;;;   ;;;   ;;;;&&++&++++&&;;  ;;;   ;;;  ',
  '       ;;   ;;;    ;;;;;;;;;;;&&&&;  ;;;   ;;   ',
  '       ;;   ;;;      ;;;;;;;;;;;;;;  ;;;   ;;   ',
  '        ;   ;;;        ;;;;;;;;;;    ;;;   ;    ',
  '            &;;           ;;;;       ;;&         ',
  '              ;;           ;;       ;;;          ',
  '                ;                 ;             ',
];

const BANNER_COUNT = BANNER.length;

const CMD = 'anansi target.com --deep --out terminal';

const LINES: { text: string; cls: string; isCommand?: boolean }[] = [
  ...BANNER.map(line => ({ text: line, cls: 'text-accent' })),
  { text: '', cls: '' },
  { text: '  Attack Surface Intelligence Engine — QYVORA OffSec', cls: 'text-white font-bold' },
  { text: '  https://qyvora.netlify.app', cls: 'text-accent' },
  { text: '  Built in Tamale, Ghana', cls: 'text-white/40' },
  { text: '', cls: '' },
  { text: '  TARGET: target.com', cls: 'text-white/50' },
  { text: '  TIME:   2026-06-28 13:21:41 UTC', cls: 'text-white/50' },
  { text: '', cls: '' },
  { text: '# Deep reconnaissance scan — full surface intelligence', cls: 'text-accent/40' },
  { text: CMD, cls: '', isCommand: true },
  { text: '', cls: '' },
  { text: '  ══ PHASE 01 ── DISCOVERY // subdomain enumeration + DNS resolution', cls: 'text-accent' },
  { text: '  ────────────────────────────────────────────────────────────', cls: 'text-white/30' },
  { text: '  [*] Detecting DNS wildcard...', cls: 'text-accent' },
  { text: '  [*] Querying crt.sh (Certificate Transparency)...', cls: 'text-accent' },
  { text: '  [*] Brute-forcing subdomains (20,010 wordlist)', cls: 'text-accent' },
  { text: '  [*] Resolving 39 candidates...', cls: 'text-accent' },
  { text: '', cls: '' },
  { text: '  sources: crt.sh=12  wordlist=3  san=2', cls: 'text-white/40' },
  { text: '', cls: '' },
  { text: '  SUBDOMAIN          IP               SOURCE    STATUS', cls: 'text-white/40' },
  { text: '  ───────────────────────────────────────────────────────────', cls: 'text-white/30' },
  { text: '  api.target.com     104.21.44.12     crt.sh    LIVE', cls: 'text-white' },
  { text: '  dev.target.com     104.21.44.13     crt.sh    LIVE', cls: 'text-white' },
  { text: '  old.target.com     —                wordlist  DEAD', cls: 'text-white/40' },
  { text: '', cls: '' },
  { text: '  ══ PHASE 04 ── HEADERS // security header audit', cls: 'text-accent' },
  { text: '  ────────────────────────────────────────────────────────────', cls: 'text-white/30' },
  { text: '  [HIGH   ] Missing CSP on https://api.target.com', cls: 'text-yellow-400' },
  { text: '  [MEDIUM ] Missing X-Frame-Options on 2 hosts', cls: 'text-yellow-500' },
  { text: '  [LOW    ] Missing Referrer-Policy on 3 hosts', cls: 'text-white/40' },
  { text: '', cls: '' },
  { text: '  ══ PHASE 05 ── PATHS // exposed endpoint + file detection', cls: 'text-accent' },
  { text: '  ────────────────────────────────────────────────────────────', cls: 'text-white/30' },
  { text: '  [CRITICAL] Exposed .env at https://dev.target.com/.env', cls: 'text-red-400' },
  { text: '  [HIGH   ] Exposed .git/config at https://dev.target.com', cls: 'text-yellow-400' },
  { text: '', cls: '' },
  { text: '  ══ PHASE 06 ── TAKEOVER // dangling CNAME subdomain takeover', cls: 'text-accent' },
  { text: '  ────────────────────────────────────────────────────────────', cls: 'text-white/30' },
  { text: '  [CRITICAL] Heroku takeover — old.target.com → *.herokuapp.com', cls: 'text-red-400' },
  { text: '', cls: '' },
  { text: '  ══ SUMMARY', cls: 'text-accent' },
  { text: '  ────────────────────────────────────────────────────────────', cls: 'text-white/30' },
  { text: '  target      target.com', cls: 'text-white' },
  { text: '  duration    1m 23s', cls: 'text-white' },
  { text: '  risk score  74/100', cls: 'text-white' },
  { text: '  findings    CRIT:2  HIGH:3  MED:4  LOW:2', cls: 'text-white' },
];

const COMMAND_INDEX = BANNER_COUNT + 9;

function useIsReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

const AnansiHeroSection: React.FC = () => {
  const reducedMotion = useIsReducedMotion();
  const [revealedCount, setRevealedCount] = useState(
    reducedMotion ? LINES.length : BANNER_COUNT
  );
  const [typedChars, setTypedChars] = useState(
    reducedMotion ? CMD.length : 0
  );
  const [cursorOn, setCursorOn] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // auto-scroll on content change
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    requestAnimationFrame(() => { el.scrollTop = el.scrollHeight; });
  }, [revealedCount, typedChars]);

  // animation
  useEffect(() => {
    if (reducedMotion) return;

    const timeouts: ReturnType<typeof setTimeout>[] = [];

    // 1. reveal info lines (indices BANNER_COUNT .. BANNER_COUNT+8)
    for (let i = 0; i <= 8; i++) {
      timeouts.push(setTimeout(
        () => setRevealedCount(BANNER_COUNT + i + 1),
        300 + i * 50
      ));
    }

    const infoEnd = 300 + 9 * 50;

    // 2. type command character by character
    for (let i = 1; i <= CMD.length; i++) {
      timeouts.push(setTimeout(
        () => setTypedChars(i),
        infoEnd + 200 + i * 40
      ));
    }

    const typingEnd = infoEnd + 200 + CMD.length * 40;

    // 3. reveal output lines (indices COMMAND_INDEX + 2 onward)
    for (let i = COMMAND_INDEX + 2; i < LINES.length; i++) {
      timeouts.push(setTimeout(
        () => setRevealedCount(i + 1),
        typingEnd + 400 + (i - COMMAND_INDEX - 2) * 70
      ));
    }

    return () => timeouts.forEach(clearTimeout);
  }, [reducedMotion]);

  // cursor blink
  useEffect(() => {
    const interval = setInterval(() => setCursorOn(c => !c), 530);
    return () => clearInterval(interval);
  }, []);

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
          <div className="bg-[#050505] border border-white/10 rounded-2xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] h-[520px] flex flex-col">
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
            <div
              ref={scrollRef}
              className="flex-1 min-h-0 p-4 sm:p-5 font-mono text-[11px] leading-[1.4] overflow-y-hidden"
            >
              {
                LINES.slice(0, revealedCount).map((line, idx) => {
                  const actualIndex = idx;

                  if (actualIndex === COMMAND_INDEX) {
                    return (
                      <div key={actualIndex} className="h-[1.2em]">
                        <span className="text-accent font-bold">$ </span>
                        <span className="text-white">{line.text.slice(0, typedChars)}</span>
                        {typedChars < line.text.length && (
                          <span
                            className={`inline-block w-[0.5em] h-[1em] bg-white/80 ml-px align-middle ${cursorOn ? '' : 'opacity-0'}`}
                            style={{ transition: 'opacity 0s' }}
                          />
                        )}
                      </div>
                    );
                  }

                  if (line.text === '') {
                    return <div key={actualIndex} className="h-[1.1em]" />;
                  }

                  return (
                    <div key={actualIndex} className={`whitespace-pre ${line.cls}`}>
                      {line.text}
                    </div>
                  );
                })
              }
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnansiHeroSection;
export { AnansiHeroSection };
