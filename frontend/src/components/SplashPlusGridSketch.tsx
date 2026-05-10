import { useEffect, useRef } from 'react';
import { styled } from 'styled-components';
import p5 from 'p5';

const PINK: [number, number, number] = [236, 72, 153];

const GRID_SPACING = 20;
const BASE_HALF_LEN = 2;
const MAX_EXTRA_HALF = 4;
const INFLUENCE_RADIUS = 340;
/** Lower = slower ease / longer linger after the cursor moves away. */
const SIZE_LERP = 0.034;

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
};

export function SplashPlusGridSketch({ active }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);

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
        const r = INFLUENCE_RADIUS;
        const rSq = r * r;
        const halfStep = GRID_SPACING / 2;

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
            const dx = mx - cx;
            const dy = my - cy;
            const dSq = dx * dx + dy * dy;
            const falloff = dSq >= rSq ? 0 : (1 - dSq / rSq) ** 2;
            const targetHalf = BASE_HALF_LEN + falloff * MAX_EXTRA_HALF;

            smoothHalfLens[idx] +=
              (targetHalf - smoothHalfLens[idx]) * SIZE_LERP;
            const half = smoothHalfLens[idx];

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
            idx++;
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

  return <Layer ref={hostRef} aria-hidden />;
}
