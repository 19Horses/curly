import { useLocation } from 'react-router-dom';
import { useSurfaceRevealTransition } from './useSurfaceRevealTransition';

/** Header + main shell use this so surface colour transitions stay paired on enter and exit. */
export function useProjectChrome(): boolean {
  const { pathname } = useLocation();
  const projectRoute = /^\/projects\/[^/]+/.test(pathname);
  const projectSurfaceRevealed = useSurfaceRevealTransition(
    projectRoute,
    pathname
  );
  return projectRoute && projectSurfaceRevealed;
}
