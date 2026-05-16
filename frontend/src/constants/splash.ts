export const SPLASH_REPEAT_AFTER_MS = 7 * 24 * 60 * 60 * 1000;

export const HAS_SEEN_SPLASH_STORAGE_KEY = 'hasSeenSplashScreen';

export function readHasSeenSplashFromStorage(): boolean {
  try {
    const raw = localStorage.getItem(HAS_SEEN_SPLASH_STORAGE_KEY);
    if (raw === null) {
      return false;
    }
    if (raw === 'true') {
      localStorage.setItem(HAS_SEEN_SPLASH_STORAGE_KEY, String(Date.now()));
      return true;
    }
    const lastSeen = Number(raw);
    if (!Number.isFinite(lastSeen)) {
      return false;
    }
    return Date.now() - lastSeen < SPLASH_REPEAT_AFTER_MS;
  } catch {
    return false;
  }
}

export function persistSplashDismissedAtNow(): void {
  try {
    localStorage.setItem(HAS_SEEN_SPLASH_STORAGE_KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
}
