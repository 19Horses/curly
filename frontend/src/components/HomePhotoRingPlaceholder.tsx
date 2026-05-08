/* eslint-disable react/no-unknown-property */
import { useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { Group, Mesh } from 'three';
import { DoubleSide, MathUtils, SRGBColorSpace, Vector3 } from 'three';
import type { CaseStudySummary } from '../queries/useGetCaseStudySummaries';
import {
  HOME_MODEL_TO_REST_LERP_MS,
  HOME_PHOTO_RING_ENTER_OFFSET,
  HOME_PHOTO_RING_GUIDE_COLOR,
  HOME_PHOTO_RING_GUIDE_THICKNESS,
  HOME_PHOTO_RING_PANEL_HEIGHT,
  HOME_PHOTO_RING_PANEL_OUTSET,
  HOME_PHOTO_RING_PANEL_WIDTH,
  HOME_PHOTO_RING_RADIUS,
  HOME_PHOTO_RING_PANEL_HOVER_LERP,
  HOME_PHOTO_RING_PANEL_HOVER_SCALE,
  HOME_PHOTO_RING_ROTATE_RAD_PER_SEC,
  HOME_PHOTO_RING_SCROLL_FRICTION,
  HOME_PHOTO_RING_SCROLL_IMPULSE_PER_WHEEL_UNIT,
  HOME_PHOTO_RING_SCROLL_MAX_RAD_PER_SEC,
  HOME_PHOTO_RING_HOVER_LEAVE_MS,
  HOME_PHOTO_RING_LIST_FOCUS_LERP,
  HOME_PHOTO_RING_Y,
} from '../constants/homeScene';

function easeFromT(t: number): number {
  return 1 - (1 - Math.min(1, Math.max(0, t))) ** 3;
}

function nearestYawToBringPanelForward(
  panelIndex: number,
  panelCount: number,
  currentYaw: number
): number {
  const θ = (2 * Math.PI * panelIndex) / panelCount;
  const base = -θ;
  const k = Math.round((currentYaw - base) / (2 * Math.PI));
  return base + k * 2 * Math.PI;
}

export type HomePhotoRingPhase = 'splash' | 'transitioning' | 'main';

type Slot = { x: number; z: number; yaw: number };

type RingPanelData = {
  reactKey: string;
  slug: string;
  imageUrl: string | undefined;
};

const PLANE_ARGS: [number, number] = [
  HOME_PHOTO_RING_PANEL_WIDTH,
  HOME_PHOTO_RING_PANEL_HEIGHT,
];

function planeSizeForImageAspect(
  iw: number,
  ih: number,
  maxW: number,
  maxH: number
): [number, number] {
  if (iw <= 0 || ih <= 0) return [maxW, maxH];
  const aspect = iw / ih;
  const boxAspect = maxW / maxH;
  if (aspect > boxAspect) {
    const w = maxW;
    return [w, w / aspect];
  }
  const h = maxH;
  return [h * aspect, h];
}

function imageNaturalSize(image: unknown): { w: number; h: number } {
  if (!image || typeof image !== 'object') return { w: 0, h: 0 };
  if ('naturalWidth' in image && 'naturalHeight' in image) {
    const img = image as HTMLImageElement;
    return { w: img.naturalWidth, h: img.naturalHeight };
  }
  if ('width' in image && 'height' in image) {
    const img = image as { width: number; height: number };
    return { w: img.width, h: img.height };
  }
  return { w: 0, h: 0 };
}

function RingPanelMaterialGrey() {
  return (
    <meshStandardMaterial
      color="#b0b0b0"
      roughness={0.85}
      metalness={0.05}
      side={DoubleSide}
    />
  );
}

function RingPanelImageGeometry({ url }: { url: string }) {
  const texture = useTexture(url);

  const planeArgs = useMemo<[number, number]>(() => {
    const { w, h } = imageNaturalSize(texture.image);
    return planeSizeForImageAspect(
      w,
      h,
      HOME_PHOTO_RING_PANEL_WIDTH,
      HOME_PHOTO_RING_PANEL_HEIGHT
    );
  }, [texture]);

  useLayoutEffect(() => {
    texture.colorSpace = SRGBColorSpace;
    texture.needsUpdate = true;
  }, [texture]);

  return (
    <>
      <planeGeometry args={planeArgs} />
      <meshStandardMaterial
        map={texture}
        roughness={0.75}
        metalness={0.02}
        side={DoubleSide}
      />
    </>
  );
}

function RingPanel({
  slot,
  index,
  hoveredIndex,
  panel,
  onPointerEnterPanel,
  onPointerLeavePanel,
  onPanelClick,
}: {
  slot: Slot;
  index: number;
  hoveredIndex: number | null;
  panel: RingPanelData;
  onPointerEnterPanel: (index: number) => void;
  onPointerLeavePanel: () => void;
  onPanelClick: (slug: string) => void;
}) {
  const meshRef = useRef<Mesh>(null);
  const isHovered = hoveredIndex === index;

  useFrame((_, delta) => {
    const m = meshRef.current;
    if (!m) return;
    const target = isHovered ? HOME_PHOTO_RING_PANEL_HOVER_SCALE : 1;
    const k = 1 - Math.exp(-delta * HOME_PHOTO_RING_PANEL_HOVER_LERP);
    const next = MathUtils.lerp(m.scale.x, target, k);
    m.scale.setScalar(next);
  });

  const hasUrl = Boolean(panel.imageUrl);

  return (
    <mesh
      ref={meshRef}
      position={[slot.x, 0, slot.z]}
      rotation={[0, slot.yaw, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        onPointerEnterPanel(index);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onPointerLeavePanel();
      }}
      onClick={(e) => {
        e.stopPropagation();
        onPanelClick(panel.slug);
      }}
    >
      {hasUrl ? (
        <Suspense
          fallback={
            <>
              <planeGeometry args={PLANE_ARGS} />
              <RingPanelMaterialGrey />
            </>
          }
        >
          <RingPanelImageGeometry url={panel.imageUrl as string} />
        </Suspense>
      ) : (
        <>
          <planeGeometry args={PLANE_ARGS} />
          <RingPanelMaterialGrey />
        </>
      )}
    </mesh>
  );
}

export function HomePhotoRingPlaceholder({
  phase,
  caseStudySummaries,
  listDriveCaseStudyId,
  onRingHighlightEnter,
  onRingHighlightLeave,
  onRingPanelClick,
}: {
  phase: HomePhotoRingPhase;
  caseStudySummaries: CaseStudySummary[] | undefined;
  /** Footer list hover only — when set, ring eases that panel forward */
  listDriveCaseStudyId: string | null;
  onRingHighlightEnter?: (caseStudyId: string) => void;
  onRingHighlightLeave?: () => void;
  onRingPanelClick?: (slug: string) => void;
}) {
  const { gl } = useThree();
  const outerRef = useRef<Group>(null);
  const innerRef = useRef<Group>(null);
  const tweenStartRef = useRef<number | null>(null);
  const scrollAngularVelocityRef = useRef(0);
  const hoverLeaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const atSplash = phase === 'splash';

  const { panels: ringPanels, slots } = useMemo(() => {
    const list = caseStudySummaries ?? [];
    const n = list.length;
    if (n === 0) {
      return { panels: [] as RingPanelData[], slots: [] as Slot[] };
    }
    const panels: RingPanelData[] = list.map((s) => ({
      reactKey: s._id,
      slug: s.slug,
      imageUrl: s.coverImage?.url,
    }));
    const panelR =
      HOME_PHOTO_RING_RADIUS +
      HOME_PHOTO_RING_GUIDE_THICKNESS +
      HOME_PHOTO_RING_PANEL_OUTSET;
    const slotList: Slot[] = Array.from({ length: n }, (_, i) => {
      const angle = (2 * Math.PI * i) / n;
      const x = Math.sin(angle) * panelR;
      const z = Math.cos(angle) * panelR;
      return { x, z, yaw: Math.atan2(x, z) + Math.PI };
    });
    return { panels, slots: slotList };
  }, [caseStudySummaries]);

  const focusPanelIndex = useMemo(() => {
    const id = listDriveCaseStudyId;
    if (id == null || ringPanels.length === 0) return null;
    const idx = ringPanels.findIndex((p) => p.reactKey === id);
    return idx >= 0 ? idx : null;
  }, [listDriveCaseStudyId, ringPanels]);

  useEffect(() => {
    const el = gl.domElement;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      let w =
        scrollAngularVelocityRef.current -
        e.deltaY * HOME_PHOTO_RING_SCROLL_IMPULSE_PER_WHEEL_UNIT;
      w = MathUtils.clamp(
        w,
        -HOME_PHOTO_RING_SCROLL_MAX_RAD_PER_SEC,
        HOME_PHOTO_RING_SCROLL_MAX_RAD_PER_SEC
      );
      scrollAngularVelocityRef.current = w;
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [gl]);

  const clearHoverLeaveTimer = useCallback(() => {
    if (hoverLeaveTimerRef.current !== null) {
      clearTimeout(hoverLeaveTimerRef.current);
      hoverLeaveTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearHoverLeaveTimer();
  }, [clearHoverLeaveTimer]);

  const handlePointerEnterPanel = useCallback(
    (index: number) => {
      clearHoverLeaveTimer();
      setHoveredIndex(index);
      const id = ringPanels[index]?.reactKey;
      if (id) {
        onRingHighlightEnter?.(id);
      }
    },
    [clearHoverLeaveTimer, onRingHighlightEnter, ringPanels]
  );

  const handlePointerLeavePanel = useCallback(() => {
    clearHoverLeaveTimer();
    hoverLeaveTimerRef.current = setTimeout(() => {
      setHoveredIndex(null);
      hoverLeaveTimerRef.current = null;
    }, HOME_PHOTO_RING_HOVER_LEAVE_MS);
    onRingHighlightLeave?.();
  }, [clearHoverLeaveTimer, onRingHighlightLeave]);

  const handlePanelClick = useCallback(
    (slug: string) => {
      onRingPanelClick?.(slug);
    },
    [onRingPanelClick]
  );

  const startOffset = useMemo(
    () => new Vector3(...HOME_PHOTO_RING_ENTER_OFFSET),
    []
  );
  const endPos = useMemo(() => new Vector3(0, 0, 0), []);

  useLayoutEffect(() => {
    if (atSplash) {
      tweenStartRef.current = null;
    }
  }, [atSplash]);

  useFrame(({ clock }, delta) => {
    const g = outerRef.current;
    const inner = innerRef.current;
    if (!g) return;

    if (inner) {
      const n = slots.length;
      const listDriving = focusPanelIndex !== null && n > 0;

      if (listDriving) {
        scrollAngularVelocityRef.current *= Math.exp(-delta * 14);
        if (Math.abs(scrollAngularVelocityRef.current) < 1e-4) {
          scrollAngularVelocityRef.current = 0;
        }
        const targetYaw = nearestYawToBringPanelForward(
          focusPanelIndex,
          n,
          inner.rotation.y
        );
        const lk = 1 - Math.exp(-delta * HOME_PHOTO_RING_LIST_FOCUS_LERP);
        inner.rotation.y = MathUtils.lerp(
          inner.rotation.y,
          targetYaw,
          lk
        );
      } else {
        inner.rotation.y += delta * HOME_PHOTO_RING_ROTATE_RAD_PER_SEC;
        inner.rotation.y += scrollAngularVelocityRef.current * delta;
        scrollAngularVelocityRef.current *= Math.exp(
          -delta * HOME_PHOTO_RING_SCROLL_FRICTION
        );
        if (Math.abs(scrollAngularVelocityRef.current) < 1e-4) {
          scrollAngularVelocityRef.current = 0;
        }
      }
    }

    if (atSplash) {
      g.position.copy(startOffset);
      return;
    }

    if (tweenStartRef.current === null) {
      tweenStartRef.current = clock.elapsedTime;
    }

    const dur = HOME_MODEL_TO_REST_LERP_MS / 1000;
    const rawT = Math.min(1, (clock.elapsedTime - tweenStartRef.current) / dur);
    const t = easeFromT(rawT);

    g.position.lerpVectors(startOffset, endPos, t);

    if (rawT >= 1) {
      g.position.copy(endPos);
    }
  });

  return (
    <group ref={outerRef}>
      <group ref={innerRef} position={[0, HOME_PHOTO_RING_Y, 0]}>
        <mesh
          rotation={[Math.PI / 2, 0, 0]}
          raycast={() => null}
        >
          <torusGeometry
            args={[
              HOME_PHOTO_RING_RADIUS,
              HOME_PHOTO_RING_GUIDE_THICKNESS,
              12,
              96,
            ]}
          />
          <meshBasicMaterial
            color={HOME_PHOTO_RING_GUIDE_COLOR}
            toneMapped={false}
          />
        </mesh>
        {slots.map((slot, i) => (
          <RingPanel
            key={ringPanels[i].reactKey}
            index={i}
            slot={slot}
            panel={ringPanels[i]}
            hoveredIndex={hoveredIndex}
            onPointerEnterPanel={handlePointerEnterPanel}
            onPointerLeavePanel={handlePointerLeavePanel}
            onPanelClick={handlePanelClick}
          />
        ))}
      </group>
    </group>
  );
}
