import MuxPlayer from '@mux/mux-player-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  CaseStudyMuxDockAnchor,
  CaseStudyMuxDockPanel,
  CaseStudyMuxGrabEdge,
  CaseStudyMuxPlayerShell,
} from '../pages/ProjectPage/styles';
import { useGetCaseStudy } from '../queries/useGetCaseStudy';

function cssAspectRatioFromMux(value: string | null | undefined): string {
  if (value == null || typeof value !== 'string') return '16 / 9';
  const parts = value.split(':').map((s) => s.trim());
  if (parts.length !== 2) return '16 / 9';
  const w = Number(parts[0]);
  const h = Number(parts[1]);
  if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) {
    return '16 / 9';
  }
  return `${w} / ${h}`;
}

function clampDockTranslate(
  el: HTMLElement,
  tx: number,
  ty: number,
  margin: number
): { x: number; y: number } {
  let x = tx;
  let y = ty;
  for (let i = 0; i < 24; i += 1) {
    el.style.transform = `translate(${x}px, ${y}px)`;
    const r = el.getBoundingClientRect();
    let dx = 0;
    let dy = 0;
    if (r.left < margin) dx += margin - r.left;
    if (r.right > window.innerWidth - margin) {
      dx -= r.right - (window.innerWidth - margin);
    }
    if (r.top < margin) dy += margin - r.top;
    if (r.bottom > window.innerHeight - margin) {
      dy -= r.bottom - (window.innerHeight - margin);
    }
    if (dx === 0 && dy === 0) break;
    x += dx;
    y += dy;
  }
  return { x, y };
}

type DragSession = {
  pointerId: number;
  originClientX: number;
  originClientY: number;
  translateAtStartX: number;
  translateAtStartY: number;
};

const GRAB_EDGES = ['top', 'right', 'bottom', 'left'] as const;

export function PersistedCaseStudyMuxPlayer() {
  const { pathname } = useLocation();
  const slugFromRoute = useMemo(() => {
    const m = /^\/projects\/([^/]+)/.exec(pathname);
    return m?.[1];
  }, [pathname]);
  const [lastProjectSlug, setLastProjectSlug] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (slugFromRoute) setLastProjectSlug(slugFromRoute);
  }, [slugFromRoute]);

  const querySlug = slugFromRoute ?? lastProjectSlug;
  const { data, isLoading, isError } = useGetCaseStudy(querySlug);

  const muxPlaybackId =
    querySlug && !isLoading && !isError && data?.videoPlaybackId
      ? data.videoPlaybackId
      : null;

  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const translateRef = useRef(translate);
  translateRef.current = translate;

  const anchorRef = useRef<HTMLDivElement>(null);
  const dragSessionRef = useRef<DragSession | null>(null);

  useEffect(() => {
    setTranslate({ x: 0, y: 0 });
  }, [muxPlaybackId]);

  const [mediaVisible, setMediaVisible] = useState(false);
  const revealedRef = useRef(false);

  useEffect(() => {
    revealedRef.current = false;
    setMediaVisible(false);
  }, [muxPlaybackId]);

  const revealMedia = useCallback(() => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    setMediaVisible(true);
  }, []);

  useEffect(() => {
    if (!muxPlaybackId) return;
    const t = window.setTimeout(() => {
      revealMedia();
    }, 4000);
    return () => window.clearTimeout(t);
  }, [muxPlaybackId, revealMedia]);

  const handleDragPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0) return;
      e.preventDefault();
      const target = e.currentTarget;
      target.setPointerCapture(e.pointerId);
      const t = translateRef.current;
      dragSessionRef.current = {
        pointerId: e.pointerId,
        originClientX: e.clientX,
        originClientY: e.clientY,
        translateAtStartX: t.x,
        translateAtStartY: t.y,
      };
    },
    []
  );

  const handleDragPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const session = dragSessionRef.current;
      if (!session || e.pointerId !== session.pointerId) return;
      e.preventDefault();
      const nx =
        session.translateAtStartX + (e.clientX - session.originClientX);
      const ny =
        session.translateAtStartY + (e.clientY - session.originClientY);
      setTranslate({ x: nx, y: ny });
    },
    []
  );

  const endDrag = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const session = dragSessionRef.current;
    if (!session || e.pointerId !== session.pointerId) return;
    dragSessionRef.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
    const el = anchorRef.current;
    if (!el) return;
    const nx = session.translateAtStartX + (e.clientX - session.originClientX);
    const ny = session.translateAtStartY + (e.clientY - session.originClientY);
    const clamped = clampDockTranslate(el, nx, ny, 8);
    setTranslate(clamped);
  }, []);

  if (!muxPlaybackId || !data) {
    return null;
  }

  const aspectCss = cssAspectRatioFromMux(data.videoAspectRatio);

  return (
    <CaseStudyMuxDockAnchor
      key={muxPlaybackId}
      ref={anchorRef}
      style={{
        transform: `translate(${translate.x}px, ${translate.y}px)`,
      }}
    >
      <CaseStudyMuxDockPanel
        role="group"
        aria-label="Case study video. Drag from the white border to move."
      >
        {GRAB_EDGES.map((edge) => (
          <CaseStudyMuxGrabEdge
            key={edge}
            $edge={edge}
            onPointerDown={handleDragPointerDown}
            onPointerMove={handleDragPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          />
        ))}
        <CaseStudyMuxPlayerShell $aspectRatio={aspectCss}>
          <MuxPlayer
            playbackId={muxPlaybackId}
            streamType="on-demand"
            accentColor="#ec4899"
            metadata={{
              video_title: `${data.client} — ${data.title}`,
            }}
            onLoadedMetadata={revealMedia}
            onCanPlay={revealMedia}
            style={{
              opacity: mediaVisible ? 1 : 0,
              transition: 'opacity 0.2s ease-out',
            }}
          />
        </CaseStudyMuxPlayerShell>
      </CaseStudyMuxDockPanel>
    </CaseStudyMuxDockAnchor>
  );
}
