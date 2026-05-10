export const HAS_SEEN_SPLASH_STORAGE_KEY = 'hasSeenSplashScreen';

export function readHasSeenSplashFromStorage(): boolean {
  return false;
  try {
    return localStorage.getItem(HAS_SEEN_SPLASH_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}
