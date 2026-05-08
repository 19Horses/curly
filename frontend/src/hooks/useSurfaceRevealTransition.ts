import { useEffect, useState } from 'react';

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
