import { useState, useEffect } from 'react';

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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const resetSession = () => {
    setSessionStart(Date.now());
    setTimeSpent(0);
  };

  return {
    timeSpent,
    fullscreen,
    toggleFullscreen,
    resetSession,
  };
}
