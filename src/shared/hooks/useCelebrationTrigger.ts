import { useEffect, useRef, useState } from 'react';

/**
 * Fires `true` only when `active` transitions from false → true.
 * Returns [open, setOpen] so callers can dismiss the modal.
 * Safe against re-firing when a page loads with the condition already satisfied.
 */
export function useCelebrationTrigger(
  active: boolean,
): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
  const [open, setOpen] = useState(false);
  const prev = useRef(active);

  useEffect(() => {
    if (active && !prev.current) setOpen(true);
    prev.current = active;
  }, [active]);

  return [open, setOpen];
}
