import { forwardRef, useCallback, useEffect, useRef } from 'react';
import { styled } from 'styled-components';
import p5 from 'p5';

const PINK: [number, number, number] = [236, 72, 153];

const GRID_SPACING = 20;
const BASE_HALF_LEN = 2;
const MAX_EXTRA_HALF = 2;
const INFLUENCE_RADIUS = 340;

const SIZE_LERP = 0.034;

const ENTER_EXCLUDE_PADDING = 16;

export type SplashPlusExcludeRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function cellCenterInExcludeZone(
  cx: number,
  cy: number,
  rect: SplashPlusExcludeRect | null,
  pad: number
): boolean {
  if (!rect) return false;
  return (
    cx >= rect.x - pad &&
    cx <= rect.x + rect.width + pad &&
    cy >= rect.y - pad &&
    cy <= rect.y + rect.height + pad
  );
}

function countAxisCells(
  span: number,
  halfStep: number,
  spacing: number
): number {
  let n = 0;
  for (let u = halfStep; u < span + spacing; u += spacing) n++;
  return n;
}

/** Same z-index as WebGL wrapper; paint below it by appearing earlier in the DOM (see Home). */
const Layer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;

  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
`;

type Props = {
  active: boolean;
  /** Layer-local rectangle around the Enter control; grid cells whose center falls inside (with padding) are not drawn. */
  excludeRect: SplashPlusExcludeRect | null;
};

export const SplashPlusGridSketch = forwardRef<HTMLDivElement, Props>(
  function SplashPlusGridSketch({ active, excludeRect }, ref) {
    const hostRef = useRef<HTMLDivElement>(null);
    const excludeRectRef = useRef(excludeRect);
    excludeRectRef.current = excludeRect;

    const setHostRef = useCallback(
      (node: HTMLDivElement | null) => {
        hostRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    useEffect(() => {
      if (!active) return;
      const host = hostRef.current;
      if (!host) return;

      const mouse = { x: -99999, y: -99999 };

      const syncMouse = (e: MouseEvent) => {
        const r = host.getBoundingClientRect();
        mouse.x = e.clientX - r.left;
        mouse.y = e.clientY - r.top;
      };

      window.addEventListener('mousemove', syncMouse, { passive: true });

      let smoothHalfLens = new Float32Array(0);

      const sketch = (p: p5) => {
        p.setup = () => {
          p.createCanvas(
            host.clientWidth || p.windowWidth,
            host.clientHeight || p.windowHeight
          );
          p.pixelDensity(
            Math.min(
              2,
              typeof window !== 'undefined' ? window.devicePixelRatio : 1
            )
          );
        };

        p.windowResized = () => {
          p.resizeCanvas(
            host.clientWidth || p.windowWidth,
            host.clientHeight || p.windowHeight
          );
        };

        p.draw = () => {
          p.clear();
          p.stroke(...PINK);
          p.strokeCap(p.PROJECT);
          p.noFill();

          const mx = mouse.x;
          const my = mouse.y;
          const inflR = INFLUENCE_RADIUS;
          const rSq = inflR * inflR;
          const halfStep = GRID_SPACING / 2;
          const rect = excludeRectRef.current;
          const excludePad = ENTER_EXCLUDE_PADDING;

          const cols = countAxisCells(p.width, halfStep, GRID_SPACING);
          const rows = countAxisCells(p.height, halfStep, GRID_SPACING);
          const cellCount = cols * rows;
          if (smoothHalfLens.length !== cellCount) {
            smoothHalfLens = new Float32Array(cellCount);
          }

          let idx = 0;
          for (let j = 0; j < rows; j++) {
            const cy = halfStep + j * GRID_SPACING;
            for (let i = 0; i < cols; i++) {
              const cx = halfStep + i * GRID_SPACING;
              const inExclude = cellCenterInExcludeZone(
                cx,
                cy,
                rect,
                excludePad
              );

              const dx = mx - cx;
              const dy = my - cy;
              const dSq = dx * dx + dy * dy;
              const falloff = dSq >= rSq ? 0 : (1 - dSq / rSq) ** 2;
              const targetHalf =
                inExclude || falloff <= 0
                  ? BASE_HALF_LEN
                  : BASE_HALF_LEN + falloff * MAX_EXTRA_HALF;

              smoothHalfLens[idx] +=
                (targetHalf - smoothHalfLens[idx]) * SIZE_LERP;
              const half = smoothHalfLens[idx];

              idx++;

              if (inExclude) continue;

              const expandT =
                MAX_EXTRA_HALF > 0
                  ? Math.min(
                    1,
                    Math.max(0, (half - BASE_HALF_LEN) / MAX_EXTRA_HALF)
                  )
                  : 0;
              p.strokeWeight(0.65 + expandT * 0.85);

              p.line(cx - half, cy, cx + half, cy);
              p.line(cx, cy - half, cx, cy + half);
            }
          }
        };
      };

      const instance = new p5(sketch, host);

      const onResize = () => {
        instance.windowResized();
      };
      window.addEventListener('resize', onResize);

      return () => {
        window.removeEventListener('mousemove', syncMouse);
        window.removeEventListener('resize', onResize);
        instance.remove();
      };
    }, [active]);

    if (!active) return null;

    return <Layer ref={setHostRef} aria-hidden />;
  }
);
