import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * READ ALOUD
 * ==========
 * Browser-native text-to-speech for learning cards (Web Speech API). No
 * backend, works offline, and degrades to a no-op when the browser has no
 * `speechSynthesis` (older Safari, jsdom). Mirrors the QYVORA voice direction:
 * the learner can hear what a card teaches, hands-free.
 */
export interface ReadAloud {
  supported: boolean;
  speaking: boolean;
  speak: (text: string) => void;
  stop: () => void;
}

const canSpeak =
  typeof window !== 'undefined' &&
  'speechSynthesis' in window &&
  typeof window.SpeechSynthesisUtterance !== 'undefined';

export function useReadAloud(): ReadAloud {
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stop = useCallback(() => {
    if (!canSpeak) return;
    utteranceRef.current = null;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  const speak = useCallback((text: string) => {
    if (!canSpeak) return;
    const content = text.replace(/\s+/g, ' ').trim();
    if (!content) return;

    window.speechSynthesis.cancel();
    const utterance = new window.SpeechSynthesisUtterance(content);
    utterance.rate = 0.98;
    utterance.pitch = 1;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    utteranceRef.current = utterance;
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }, []);

  // Never leave the voice running after the card/page unmounts.
  useEffect(() => {
    return () => {
      if (canSpeak) window.speechSynthesis.cancel();
    };
  }, []);

  return { supported: canSpeak, speaking, speak, stop };
}

export default useReadAloud;
