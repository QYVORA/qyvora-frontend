import React, { useState, useCallback, useEffect } from 'react';
import { Code2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAutoPlay } from '@/core/hooks/useAutoPlay';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import CodeBlock from '@/shared/components/CodeBlock';
import ToolSectionHeader from './ToolSectionHeader';

export interface ToolSourceExample {
  id: string;
  /** Path shown in the code block header. */
  filename: string;
  label: string;
  description: string;
  code: string;
}

export interface ToolSourceSectionProps {
  id?: string;
  kicker: string;
  title: string;
  accent: string;
  description: string;
  examples: ToolSourceExample[];
}

const ToolSourceSection: React.FC<ToolSourceSectionProps> = ({
  id,
  kicker,
  title,
  accent,
  description,
  examples,
}) => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const total = examples.length;
  const prefersReduced = useReducedMotion();

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1 >= total ? 0 : prev + 1));
  }, [total]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 < 0 ? total - 1 : prev - 1));
  }, [total]);

  const { containerProps } = useAutoPlay({
    onNext: next,
    duration: 8000,
    disabled: total <= 1 || prefersReduced,
  });

  useEffect(() => {
    if (prefersReduced) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [next, prev, prefersReduced]);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '4%' : '-4%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-4%' : '4%',
      opacity: 0,
    }),
  };

  if (!examples.length) return null;

  const example = examples[current];

  return (
    <div
      id={id}
      className={`relative w-full min-h-dvh lg:h-dvh snap-section flex items-center overflow-hidden odd:bg-bg even:bg-bg-alt`}
      {...containerProps}
    >
      <div className="w-full px-3 md:px-4 lg:px-6 pt-24 md:pt-28 lg:pt-32 pb-6 md:pb-8 lg:pb-10">
        <div className="flex flex-col gap-6 lg:gap-8">
          <ToolSectionHeader kicker={kicker} title={title} accent={accent} description={description} />

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={example.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-start gap-8 lg:gap-12">
                {/* Left column — example details + code */}
                <div className="flex min-h-0 min-w-0 flex-col">
                  <div className="mb-4 flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-accent/30 bg-accent/10">
                      <Code2 className="h-4 w-4 text-accent" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-black uppercase tracking-widest text-accent">
                        Go source example
                      </p>
                      <h3 className="mt-0.5 text-sm font-black text-text-primary">{example.label}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-text-muted line-clamp-3">{example.description}</p>
                    </div>
                  </div>
                  <CodeBlock code={example.code} lang="go" filename={example.filename} maxHeight="max-h-[45vh]" />
                </div>

                {/* Right column — icon visual */}
                <div className="hidden lg:flex items-center justify-center">
                  <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-accent/5" />
                    <div className="absolute inset-[15%] rounded-full bg-accent/10" />
                    <div className="absolute inset-[30%] rounded-full bg-accent/15" />
                    <Code2 className="relative z-10 w-24 h-24 text-accent" />
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation — arrows + dots */}
          {total > 1 && (
            <div className="flex items-center justify-between mt-4 md:mt-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={prev}
                  aria-label="Previous example"
                  className="w-9 h-9 rounded-full border border-border/50 bg-bg-card flex items-center justify-center text-text-secondary hover:border-accent/40 hover:text-accent active:scale-95 transition-all duration-300"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button
                  onClick={next}
                  aria-label="Next example"
                  className="w-9 h-9 rounded-full border border-border/50 bg-bg-card flex items-center justify-center text-text-secondary hover:border-accent/40 hover:text-accent active:scale-95 transition-all duration-300"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {examples.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setDirection(i > current ? 1 : -1);
                      setCurrent(i);
                    }}
                    aria-label={`Go to example ${i + 1}`}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === current
                        ? 'bg-accent w-5'
                        : 'bg-border hover:bg-text-muted'
                    }`}
                  />
                ))}
              </div>

              <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                {current + 1} / {total}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToolSourceSection;
