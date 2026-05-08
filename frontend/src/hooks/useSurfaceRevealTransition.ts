import { useEffect, useState } from 'react';

/**
 * After `enabled` becomes true, becomes true after double rAF so paired surfaces can
 * transition from their initial painted state in sync.
 */
export function useSurfaceRevealTransition(
  enabled: boolean,
  resetKey: string | number | undefined
): boolean {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setRevealed(false);
      return;
    }
    setRevealed(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setRevealed(true));
    });
    return () => cancelAnimationFrame(id);
  }, [enabled, resetKey]);

  return revealed;
}
