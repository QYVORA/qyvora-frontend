import { useEffect, useMemo, useState } from 'react';
import { useReducedMotion } from 'motion/react';

type DeviceMemoryNavigator = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };

export function useAdaptiveUi() {
  const reduceMotionPreference = useReducedMotion();
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 767px)').matches);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const onChange = (event: MediaQueryListEvent) => setIsMobile(event.matches);
    setIsMobile(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const profile = useMemo(() => {
    const nav = navigator as DeviceMemoryNavigator;
    const saveData = Boolean(nav.connection?.saveData);
    const lowMemory = typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4;
    const constrainedDevice = isMobile || saveData || lowMemory || Boolean(reduceMotionPreference);
    return {
      isMobile,
      saveData,
      lowMemory,
      reduceMotionPreference: Boolean(reduceMotionPreference),
      constrainedDevice,
    };
  }, [isMobile, reduceMotionPreference]);

  return profile;
}
