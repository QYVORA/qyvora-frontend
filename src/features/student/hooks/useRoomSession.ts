import { useState, useEffect, useCallback } from 'react';

export function useRoomSession() {
  const [sessionStart, setSessionStart] = useState<number>(Date.now());
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(Date.now() - sessionStart);
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionStart]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Memoised: these are used inside effect dependency lists by consumers. A new
  // identity on every render makes those effects re-run on every render, which
  // re-renders again and loops forever.
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  const resetSession = useCallback(() => {
    setSessionStart(Date.now());
    setTimeSpent(0);
  }, []);

  return {
    timeSpent,
    fullscreen,
    toggleFullscreen,
    resetSession,
  };
}
