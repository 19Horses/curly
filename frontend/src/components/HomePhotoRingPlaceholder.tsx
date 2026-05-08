/* eslint-disable react/no-unknown-property */
import { useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import type { MutableRefObject } from 'react';
import {
  Suspense,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { Camera, Group, Material, Mesh } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import {
  DoubleSide,
  MathUtils,
  PerspectiveCamera,
  SRGBColorSpace,
  Vector3,
} from 'three';
import type { CaseStudySummary } from '../queries/useGetCaseStudySummaries';
import {
  HOME_MODEL_TO_REST_LERP_MS,
  HOME_PHOTO_RING_CONNECTOR_BELOW_IMAGE,
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
  HOME_PHOTO_RING_EXIT_OTHERS_MS,
  HOME_PHOTO_RING_EXIT_SELECTED_MS,
  HOME_PHOTO_RING_EXIT_ALIGN_EPSILON_RAD,
  HOME_PHOTO_RING_LAYOUT_HALF_SPAN,
  HOME_PHOTO_RING_VIEWPORT_MIN_SCALE,
  HOME_PHOTO_RING_VIEWPORT_PADDING,
  HOME_PHOTO_RING_Y,
} from '../constants/homeScene';

/** Bottom-center of panel mesh → screen (footer ↔ ring connector) */
const _footerAnchorProj = new Vector3();

/** Uniform scale so the ring fits horizontally (caps at 1); floored so panels don’t shrink past readability. */
function ringViewportUniformScale(
  camera: Camera,
  orbitTarget: Vector3,
  layoutHalfSpan: number,
  padding: number,
  minScale: number
): number {
  if (!(camera instanceof PerspectiveCamera)) return 1;
  const dist = camera.position.distanceTo(orbitTarget);
  if (!(dist > 1e-6)) return 1;
  const vFovRad = MathUtils.degToRad(camera.fov);
  const visibleHalfWidth = Math.tan(vFovRad / 2) * dist * camera.aspect;
  const fit = (visibleHalfWidth * padding) / layoutHalfSpan;
  return Math.min(1, Math.max(minScale, fit));
}

function easeFromT(t: number): number {
  return 1 - (1 - Math.min(1, Math.max(0, t))) ** 3;
}

type RingExitContextValue = {
  exitTargetCaseStudyId: string | null;
  /** Clock time when alignment finished — fades run from here */
  exitSequenceStartRef: MutableRefObject<number | null>;
};

const RingExitContext = createContext<RingExitContextValue | null>(null);

function ringPanelOpacity(
  elapsedSinceSequenceStart: number,
  panelCaseStudyId: string,
  exitTargetCaseStudyId: string,
  othersSec: number,
  selectedSec: number
): number {
  const isSelected = panelCaseStudyId === exitTargetCaseStudyId;
  if (!isSelected) {
    const rawT = Math.min(1, elapsedSinceSequenceStart / othersSec);
    return 1 - easeFromT(rawT);
  }
  if (elapsedSinceSequenceStart < othersSec) {
    return 1;
  }
  const rawT = Math.min(
    1,
    (elapsedSinceSequenceStart - othersSec) / selectedSec
  );
  return 1 - easeFromT(rawT);
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

/** Shortest signed angle from `yaw` to `targetYaw` (radians). */
function shortestYawDelta(yaw: number, targetYaw: number): number {
  return Math.atan2(Math.sin(targetYaw - yaw), Math.cos(targetYaw - yaw));
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
  listDrivePanelIndex,
  panelMeshesRef,
  panel,
  onPointerEnterPanel,
  onPointerLeavePanel,
  onPanelClick,
}: {
  slot: Slot;
  index: number;
  hoveredIndex: number | null;
  /** Footer list hover — same panel scale as direct ring hover */
  listDrivePanelIndex: number | null;
  panelMeshesRef: MutableRefObject<(Mesh | null)[]>;
  panel: RingPanelData;
  onPointerEnterPanel: (index: number) => void;
  onPointerLeavePanel: () => void;
  onPanelClick: (slug: string, caseStudyId: string) => void;
}) {
  const meshRef = useRef<Mesh | null>(null);
  const setMeshRef = useCallback(
    (node: Mesh | null) => {
      meshRef.current = node;
      panelMeshesRef.current[index] = node;
    },
    [panelMeshesRef, index]
  );
  const exitCtx = useContext(RingExitContext);
  const isHovered =
    hoveredIndex === index ||
    (listDrivePanelIndex !== null && listDrivePanelIndex === index);

  useFrame(({ clock }, delta) => {
    const m = meshRef.current;
    if (!m) return;

    let opacity = 1;
    const seqStart = exitCtx?.exitSequenceStartRef.current;
    if (exitCtx?.exitTargetCaseStudyId && seqStart != null) {
      const elapsed = clock.elapsedTime - seqStart;
      opacity = ringPanelOpacity(
        elapsed,
        panel.reactKey,
        exitCtx.exitTargetCaseStudyId,
        HOME_PHOTO_RING_EXIT_OTHERS_MS / 1000,
        HOME_PHOTO_RING_EXIT_SELECTED_MS / 1000
      );
    }

    const mats = m.material;
    const list = Array.isArray(mats) ? mats : [mats];
    for (const mat of list) {
      const mm = mat as Material;
      mm.opacity = opacity;
      mm.transparent = opacity < 1;
      mm.depthWrite = opacity >= 0.999;
      mm.needsUpdate = true;
    }

    const scaleTarget = isHovered ? HOME_PHOTO_RING_PANEL_HOVER_SCALE : 1;
    const k = 1 - Math.exp(-delta * HOME_PHOTO_RING_PANEL_HOVER_LERP);
    const next = MathUtils.lerp(m.scale.x, scaleTarget, k);
    m.scale.setScalar(next);
  });

  const hasUrl = Boolean(panel.imageUrl);

  return (
    <mesh
      ref={setMeshRef}
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
        onPanelClick(panel.slug, panel.reactKey);
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
  highlightedCaseStudyId,
  listFooterAnchorScreenRef,
  onRingHighlightEnter,
  onRingHighlightLeave,
  onRingPanelClick,
  exitTargetCaseStudyId = null,
  onExitAnimationComplete,
  onExitSelectedFadeStart,
}: {
  phase: HomePhotoRingPhase;
  caseStudySummaries: CaseStudySummary[] | undefined;
  /** Footer list hover only — when set, ring eases that panel forward */
  listDriveCaseStudyId: string | null;
  /** Footer list or ring pane hover — drives connector line anchor */
  highlightedCaseStudyId: string | null;
  /** Screen coords for dot below highlighted panel + SVG connector line */
  listFooterAnchorScreenRef?: MutableRefObject<{
    x: number;
    y: number;
  } | null>;
  onRingHighlightEnter?: (caseStudyId: string) => void;
  onRingHighlightLeave?: () => void;
  onRingPanelClick?: (slug: string, caseStudyId: string) => void;
  exitTargetCaseStudyId?: string | null;
  onExitAnimationComplete?: () => void;
  /** Fires once when the selected panel begins fading (after other panels have faded). */
  onExitSelectedFadeStart?: () => void;
}) {
  const { gl, camera, controls, size } = useThree();
  const orbitTargetFallbackRef = useRef(new Vector3(0, 0, 0));
  const outerRef = useRef<Group>(null);
  const innerRef = useRef<Group>(null);
  const panelMeshesRef = useRef<(Mesh | null)[]>([]);
  const tweenStartRef = useRef<number | null>(null);
  const scrollAngularVelocityRef = useRef(0);
  const hoverLeaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitSequenceStartRef = useRef<number | null>(null);
  const exitCompleteFiredRef = useRef(false);
  const exitSelectedFadeStartFiredRef = useRef(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const atSplash = phase === 'splash';

  const exitTargetId = exitTargetCaseStudyId ?? null;

  const ringExitCtx = useMemo<RingExitContextValue>(
    () => ({
      exitTargetCaseStudyId: exitTargetId,
      exitSequenceStartRef,
    }),
    [exitTargetId]
  );

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

  const connectorPanelIndex = useMemo(() => {
    const id = highlightedCaseStudyId;
    if (id == null || ringPanels.length === 0) return null;
    const idx = ringPanels.findIndex((p) => p.reactKey === id);
    return idx >= 0 ? idx : null;
  }, [highlightedCaseStudyId, ringPanels]);

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
    (slug: string, caseStudyId: string) => {
      onRingPanelClick?.(slug, caseStudyId);
    },
    [onRingPanelClick]
  );

  useLayoutEffect(() => {
    if (!exitTargetId) {
      exitSequenceStartRef.current = null;
      exitCompleteFiredRef.current = false;
      exitSelectedFadeStartFiredRef.current = false;
    }
  }, [exitTargetId]);

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

    const orbitTarget =
      controls != null && 'target' in controls
        ? (controls as OrbitControlsImpl).target
        : orbitTargetFallbackRef.current;
    const ringScale = ringViewportUniformScale(
      camera,
      orbitTarget,
      HOME_PHOTO_RING_LAYOUT_HALF_SPAN,
      HOME_PHOTO_RING_VIEWPORT_PADDING,
      HOME_PHOTO_RING_VIEWPORT_MIN_SCALE
    );
    g.scale.setScalar(ringScale);

    if (inner) {
      const n = slots.length;

      if (exitTargetId && n > 0) {
        scrollAngularVelocityRef.current = 0;
        const exitIdx = ringPanels.findIndex(
          (p) => p.reactKey === exitTargetId
        );
        if (exitIdx >= 0 && exitSequenceStartRef.current === null) {
          const targetYaw = nearestYawToBringPanelForward(
            exitIdx,
            n,
            inner.rotation.y
          );
          const alignErr = Math.abs(
            shortestYawDelta(inner.rotation.y, targetYaw)
          );
          if (alignErr > HOME_PHOTO_RING_EXIT_ALIGN_EPSILON_RAD) {
            const lk = 1 - Math.exp(-delta * HOME_PHOTO_RING_LIST_FOCUS_LERP);
            inner.rotation.y = MathUtils.lerp(inner.rotation.y, targetYaw, lk);
          } else {
            /* Stay at the current eased angle — no snap to targetYaw (avoids a visible jerk). */
            exitSequenceStartRef.current = clock.elapsedTime;
          }
        }

        if (
          exitSequenceStartRef.current !== null &&
          !exitCompleteFiredRef.current
        ) {
          const elapsed = clock.elapsedTime - exitSequenceStartRef.current;
          const othersSec = HOME_PHOTO_RING_EXIT_OTHERS_MS / 1000;
          if (elapsed >= othersSec && !exitSelectedFadeStartFiredRef.current) {
            exitSelectedFadeStartFiredRef.current = true;
            onExitSelectedFadeStart?.();
          }
          const exitTotalSec =
            othersSec + HOME_PHOTO_RING_EXIT_SELECTED_MS / 1000;
          if (elapsed >= exitTotalSec) {
            exitCompleteFiredRef.current = true;
            onExitAnimationComplete?.();
          }
        }
      } else if (!exitTargetId) {
        const listDriving = focusPanelIndex !== null && n > 0;

        if (listDriving && focusPanelIndex !== null) {
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
          inner.rotation.y = MathUtils.lerp(inner.rotation.y, targetYaw, lk);
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

    if (listFooterAnchorScreenRef) {
      if (highlightedCaseStudyId && connectorPanelIndex !== null) {
        const mesh = panelMeshesRef.current[connectorPanelIndex];
        if (mesh && camera instanceof PerspectiveCamera) {
          mesh.updateWorldMatrix(true, true);
          const geom = mesh.geometry;
          if (!geom.boundingBox) geom.computeBoundingBox();
          const bb = geom.boundingBox;
          if (bb) {
            _footerAnchorProj.set(
              0,
              bb.min.y - HOME_PHOTO_RING_CONNECTOR_BELOW_IMAGE,
              0
            );
            _footerAnchorProj.applyMatrix4(mesh.matrixWorld);
            _footerAnchorProj.project(camera);
            const x = (_footerAnchorProj.x * 0.5 + 0.5) * size.width;
            const y = (-_footerAnchorProj.y * 0.5 + 0.5) * size.height;
            listFooterAnchorScreenRef.current = { x, y };
          }
        } else {
          listFooterAnchorScreenRef.current = null;
        }
      } else {
        listFooterAnchorScreenRef.current = null;
      }
    }
  });

  return (
    <group ref={outerRef}>
      <group ref={innerRef} position={[0, HOME_PHOTO_RING_Y, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} raycast={() => null}>
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
        <RingExitContext.Provider value={ringExitCtx}>
          {slots.map((slot, i) => (
            <RingPanel
              key={ringPanels[i].reactKey}
              index={i}
              slot={slot}
              panel={ringPanels[i]}
              hoveredIndex={hoveredIndex}
              listDrivePanelIndex={focusPanelIndex}
              panelMeshesRef={panelMeshesRef}
              onPointerEnterPanel={handlePointerEnterPanel}
              onPointerLeavePanel={handlePointerLeavePanel}
              onPanelClick={handlePanelClick}
            />
          ))}
        </RingExitContext.Provider>
      </group>
    </group>
  );
}
