import type { MutableRefObject } from 'react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { HOME_FOOTER_EXIT_FADE_DURATION_S } from '../constants/homeScene';

/** Matches `HomeFooter` motion easing when leaving for a project */
const CONNECTOR_EXIT_EASE = 'cubic-bezier(0.33, 1, 0.68, 1)';

const ConnectorSvg = styled.svg<{ $isLeavingHome: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 50;
  pointer-events: none;
  overflow: visible;
  opacity: ${({ $isLeavingHome }) => ($isLeavingHome ? 0 : 1)};
  transition: opacity ${HOME_FOOTER_EXIT_FADE_DURATION_S}s
    ${CONNECTOR_EXIT_EASE};

  @media (max-width: 48rem) {
    display: none;
  }
`;

const CONNECTOR_STROKE = '#ec4899';
/** Matches `CaseListDot` (0.375rem ≈ 6px at default root) */
const MARKER_PX = 6;

export type HomeListRingConnectorProps = {
  /** List or ring pane hover — same `_id` as footer row highlight */
  highlightedCaseStudyId: string | null;
  /** Project `_id` → span backing the pink list dot (for screen coords) */
  listDotRefs: MutableRefObject<Map<string, HTMLSpanElement>>;
  /** Screen-space point below the ring panel (written by WebGL each frame) */
  ringAnchorScreenRef: MutableRefObject<{ x: number; y: number } | null>;
  /** Fade connector with footer when navigating to a project */
  isLeavingHome?: boolean;
};

export function HomeListRingConnector({
  highlightedCaseStudyId,
  listDotRefs,
  ringAnchorScreenRef,
  isLeavingHome = false,
}: HomeListRingConnectorProps) {
  const lineRef = useRef<SVGLineElement>(null);
  const ringMarkerRef = useRef<SVGRectElement>(null);
  const [[vw, vh], setVwVh] = useState(() => [
    typeof window !== 'undefined' ? window.innerWidth : 1,
    typeof window !== 'undefined' ? window.innerHeight : 1,
  ]);

  useLayoutEffect(() => {
    const onResize = () => setVwVh([window.innerWidth, window.innerHeight]);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (!highlightedCaseStudyId) return;

    let rafId = 0;
    const tick = () => {
      rafId = requestAnimationFrame(tick);
      const line = lineRef.current;
      const ringMarker = ringMarkerRef.current;
      const ring = ringAnchorScreenRef.current;
      const dotEl = listDotRefs.current.get(highlightedCaseStudyId);
      if (!line || !ringMarker) return;

      if (!ring || !dotEl) {
        line.setAttribute('opacity', '0');
        ringMarker.setAttribute('opacity', '0');
        return;
      }

      const r = dotEl.getBoundingClientRect();
      const x1 = r.left + r.width / 2;
      const y1 = r.top + r.height / 2;

      line.setAttribute('x1', String(x1));
      line.setAttribute('y1', String(y1));
      line.setAttribute('x2', String(ring.x));
      line.setAttribute('y2', String(ring.y));
      line.setAttribute('opacity', '1');

      const h = MARKER_PX / 2;
      ringMarker.setAttribute('x', String(ring.x - h));
      ringMarker.setAttribute('y', String(ring.y - h));
      ringMarker.setAttribute('width', String(MARKER_PX));
      ringMarker.setAttribute('height', String(MARKER_PX));
      ringMarker.setAttribute('opacity', '1');
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [highlightedCaseStudyId, listDotRefs, ringAnchorScreenRef]);

  if (!highlightedCaseStudyId) return null;

  return (
    <ConnectorSvg
      aria-hidden
      $isLeavingHome={isLeavingHome}
      width={vw}
      height={vh}
      viewBox={`0 0 ${vw} ${vh}`}
      preserveAspectRatio="none"
    >
      <line
        ref={lineRef}
        x1={0}
        y1={0}
        x2={0}
        y2={0}
        stroke={CONNECTOR_STROKE}
        strokeWidth={1}
        strokeLinecap="round"
        opacity={0}
      />
      <rect
        ref={ringMarkerRef}
        x={0}
        y={0}
        width={MARKER_PX}
        height={MARKER_PX}
        fill={CONNECTOR_STROKE}
        opacity={0}
      />
    </ConnectorSvg>
  );
}
