import { createContext, useContext } from 'react';

/**
 * Lets a focused walkthrough page hand the deck-step's end-of-unit Continue
 * back to the layout, so the deck surface owns the button (single bottom CTA)
 * while the layout owns where "next" goes.
 */
export interface WalkthroughDeckNav {
  onDeckComplete?: () => void;
  continueLabel?: string;
}

export const WalkthroughDeckNavContext = createContext<WalkthroughDeckNav>({});

export const useWalkthroughDeckNav = (): WalkthroughDeckNav =>
  useContext(WalkthroughDeckNavContext);
