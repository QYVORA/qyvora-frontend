import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/shared/utils/cn';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';

interface TypewriterTextProps {
  /** Phrases to cycle through. The first becomes the reduced-motion fallback. */
  words: string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  holdDuration?: number;
  /** Applies the terminal caret at the end of the typed phrase. */
  caretClassName?: string;
}

/**
 * TypewriterText — cycling type-on / hold / type-off phrase effect for
 * terminal-born brand moments. Respects reduced motion by rendering the first
 * word statically. Callers must reserve layout height around the typed line
 * (e.g. min-height on a wrapping span) so rotation never shifts the section.
 */
const TypewriterText: React.FC<TypewriterTextProps> = ({
  words,
  className,
  typingSpeed = 60,
  deletingSpeed = 28,
  holdDuration = 1900,
  caretClassName,
}) => {
  const prefersReduced = useReducedMotion();
  const wordsRef = useRef(words);
  wordsRef.current = words;

  const wordsKey = words.join('\u0000');
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState('');
  const [phase, setPhase] = useState<'typing' | 'holding' | 'deleting'>('typing');

  useEffect(() => {
    if (prefersReduced) {
      setText(wordsRef.current[0] ?? '');
      return;
    }
    const word = wordsRef.current[wordIndex % wordsRef.current.length] ?? '';
    let handle = 0;

    if (phase === 'typing') {
      if (text.length < word.length) {
        handle = window.setTimeout(() => setText(word.slice(0, text.length + 1)), typingSpeed);
      } else {
        handle = window.setTimeout(() => setPhase('holding'), 60);
      }
    } else if (phase === 'holding') {
      handle = window.setTimeout(() => setPhase('deleting'), holdDuration);
    } else if (phase === 'deleting') {
      if (text.length > 0) {
        handle = window.setTimeout(() => setText(word.slice(0, text.length - 1)), deletingSpeed);
      } else {
        handle = window.setTimeout(() => {
          setWordIndex((i) => (i + 1) % wordsRef.current.length);
          setPhase('typing');
        }, 60);
      }
    }

    return () => window.clearTimeout(handle);
  }, [text, phase, wordIndex, wordsKey, prefersReduced, typingSpeed, deletingSpeed, holdDuration]);

  if (prefersReduced) {
    return (
      <span className={className} aria-label={words[0] ?? ''} role="text">
        {words[0] ?? ''}
      </span>
    );
  }

  return (
    <span className={className} aria-label={words[wordIndex] ?? ''} role="text">
      <span aria-hidden="true">{text}</span>
      <span
        aria-hidden="true"
        className={cn(
          'ml-1 inline-block h-[0.95em] w-[2px] translate-y-[0.08em] bg-accent animate-pulse',
          caretClassName,
        )}
      />
    </span>
  );
};

export default TypewriterText;