import React, { useEffect, useState } from 'react';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';

const PROMPT = 'qyvora@core:~$ ';
const COMMAND = './qyvora boot --offensive';

const INITIAL_DELAY_MS = 180;
const DELAYED_LOADER_MS = 140;
const TYPE_MIN_MS = 6;
const TYPE_MAX_MS = 18;

const textSecondary = 'text-text-secondary';

interface BootSeg {
  text: string;
  cls: string;
}

interface BootLine {
  instant: BootSeg[];
  stream: BootSeg[];
}

const BOOT_LINES: BootLine[] = [
  {
    instant: [],
    stream: [
      { text: PROMPT, cls: 'text-accent' },
      { text: COMMAND, cls: 'text-text-primary' },
    ],
  },
  {
    instant: [{ text: '[ OK ] ', cls: 'text-accent' }],
    stream: [{ text: 'mounting /dev/knowledge → /mnt/toolkit', cls: textSecondary }],
  },
  {
    instant: [{ text: '[ OK ] ', cls: 'text-accent' }],
    stream: [{ text: 'resolving modules · recon · privesc · web · wireless', cls: textSecondary }],
  },
  {
    instant: [{ text: '[ OK ] ', cls: 'text-accent' }],
    stream: [{ text: 'handshaking with chain · stratum-01 · peers 19', cls: textSecondary }],
  },
  {
    instant: [{ text: '[ OK ] ', cls: 'text-accent' }],
    stream: [{ text: 'loading shell · /usr/bin/qyvora', cls: textSecondary }],
  },
  {
    instant: [],
    stream: [{ text: 'ready.', cls: 'text-accent' }],
  },
];

interface StreamUnit {
  line: number;
  seg: number;
}

const STREAM: StreamUnit[] = [];
const LINE_STREAM_START: number[] = [];
const LINE_STREAM_LEN: number[] = [];
let rolling = 0;

BOOT_LINES.forEach((line, li) => {
  LINE_STREAM_START.push(rolling);
  let lineLen = 0;
  line.stream.forEach((seg, si) => {
    for (let i = 0; i < seg.text.length; i++) {
      STREAM.push({ line: li, seg: si });
    }
    lineLen += seg.text.length;
  });
  LINE_STREAM_LEN.push(lineLen);
  rolling += lineLen;
});

const TOTAL_STREAM = rolling;

function nextTypeDelay(): number {
  return TYPE_MIN_MS + Math.random() * (TYPE_MAX_MS - TYPE_MIN_MS);
}

interface PageLoaderProps {
  onStateChange?: (state: string) => void;
}

/**
 * Full-screen QYVORA boot loader.
 *
 * Types a realistic kernel-boot transcript (`qyvora@core` prompt, `[ OK ]`
 * module stamps, trailing `ready.`) with a human typing cadence and a blinking
 * caret that stays locked to the current reveal position. Styling mirrors the
 * Kali-style terminal chrome used across the platform (dark surface, mono
 * output, accent green). Reduced-motion users get the full log instantly, no
 * typing, no caret.
 */
const PageLoader: React.FC<PageLoaderProps> = ({ onStateChange }) => {
  const prefersReduced = useReducedMotion();
  const [revealed, setRevealed] = useState(prefersReduced ? TOTAL_STREAM : 0);

  useEffect(() => {
    if (prefersReduced) {
      setRevealed(TOTAL_STREAM);
      return;
    }

    let current = 0;
    let cancelled = false;
    let timeout = 0;

    const step = () => {
      if (cancelled || current >= TOTAL_STREAM) return;
      current += 1;
      setRevealed(current);
      timeout = window.setTimeout(step, nextTypeDelay());
    };

    timeout = window.setTimeout(step, INITIAL_DELAY_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [prefersReduced]);

  useEffect(() => {
    onStateChange?.(revealed >= TOTAL_STREAM ? 'ready' : 'boot');
  }, [revealed, onStateChange]);

  const done = revealed >= TOTAL_STREAM;
  const caretLine = revealed > 0 ? STREAM[revealed - 1].line : 0;
  const percent = Math.min(100, Math.round((revealed / TOTAL_STREAM) * 100));

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-bg px-4"
    >
      <div className="w-full wc-terminal">
        <div className="mb-3 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">
            {done ? 'system ready' : 'initialising'}
          </p>
          <p className="text-base font-black uppercase tracking-tight text-text-primary">
            qyvora boot
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-bg-card">
          <div className="flex items-center justify-between border-b border-border bg-bg-elevated px-3 py-1.5">
            <span className="select-none text-xs font-mono tracking-[0.2em] text-text-muted">
              _boot
            </span>
            <span className="select-none text-xs font-mono text-text-muted/60">v2.0</span>
          </div>

          <div className="px-4 py-3 font-mono text-xs leading-6 md:px-5 md:py-4 md:text-sm">
            {BOOT_LINES.map((line, li) => {
              const start = LINE_STREAM_START[li];
              const len = LINE_STREAM_LEN[li];
              const shown = Math.max(0, Math.min(len, revealed - start));
              let consumed = 0;

              return (
                <div key={li} className="flex flex-wrap whitespace-pre-wrap">
                  {line.instant.map((seg, si) => (
                    <span key={si} className={seg.cls}>
                      {shown > 0 ? seg.text : ''}
                    </span>
                  ))}
                  {line.stream.map((seg, si) => {
                    const segShown = Math.max(0, Math.min(seg.text.length, shown - consumed));
                    consumed += seg.text.length;
                    return (
                      <span key={si} className={seg.cls}>
                        {seg.text.slice(0, segShown)}
                      </span>
                    );
                  })}
                  {li === caretLine && (
                    <span className="ml-0.5 inline-block h-[1.1em] w-[0.55em] animate-pulse bg-accent align-text-bottom" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-border bg-bg-elevated px-4 py-2 font-mono text-xs">
            <span className="tracking-[0.2em] text-text-muted">
              {done ? 'ready.' : 'loading'}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-accent tabular-nums">{percent}%</span>
              <div className="h-1 w-24 overflow-hidden rounded-full bg-bg">
                <div
                  className="h-full rounded-full bg-accent transition-[width] duration-100"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DelayedPageLoader: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setShow(true), DELAYED_LOADER_MS);
    return () => window.clearTimeout(timeout);
  }, []);

  return show ? <PageLoader /> : null;
};

export default PageLoader;