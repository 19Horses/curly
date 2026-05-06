/* eslint-disable react/no-unknown-property */
import { useFrame, useThree } from '@react-three/fiber';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { Group, Mesh } from 'three';
import { DoubleSide, MathUtils, Vector3 } from 'three';
import {
  HOME_MODEL_TO_REST_LERP_MS,
  HOME_PHOTO_RING_COUNT,
  HOME_PHOTO_RING_ENTER_OFFSET,
  HOME_PHOTO_RING_PANEL_HEIGHT,
  HOME_PHOTO_RING_PANEL_WIDTH,
  HOME_PHOTO_RING_RADIUS,
  HOME_PHOTO_RING_PANEL_OPACITY,
  HOME_PHOTO_RING_PANEL_HOVER_LERP,
  HOME_PHOTO_RING_PANEL_HOVER_SCALE,
  HOME_PHOTO_RING_ROTATE_RAD_PER_SEC,
  HOME_PHOTO_RING_SCROLL_FRICTION,
  HOME_PHOTO_RING_SCROLL_IMPULSE_PER_WHEEL_UNIT,
  HOME_PHOTO_RING_SCROLL_MAX_RAD_PER_SEC,
  HOME_PHOTO_RING_HOVER_LEAVE_MS,
  HOME_PHOTO_RING_Y,
} from '../constants/homeScene';

function easeFromT(t: number): number {
  return 1 - (1 - Math.min(1, Math.max(0, t))) ** 3;
}

export type HomePhotoRingPhase = 'splash' | 'transitioning' | 'main';

type Slot = { x: number; z: number; yaw: number };

function RingPanel({
  slot,
  index,
  hoveredIndex,
  onPointerEnterPanel,
  onPointerLeavePanel,
}: {
  slot: Slot;
  index: number;
  hoveredIndex: number | null;
  onPointerEnterPanel: (index: number) => void;
  onPointerLeavePanel: () => void;
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
    >
      <planeGeometry
        args={[HOME_PHOTO_RING_PANEL_WIDTH, HOME_PHOTO_RING_PANEL_HEIGHT]}
      />
      <meshStandardMaterial
        color="#b0b0b0"
        roughness={0.85}
        metalness={0.05}
        transparent
        opacity={HOME_PHOTO_RING_PANEL_OPACITY}
        side={DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

export function HomePhotoRingPlaceholder({
  phase,
}: {
  phase: HomePhotoRingPhase;
}) {
  const { gl } = useThree();
  const outerRef = useRef<Group>(null);
  const innerRef = useRef<Group>(null);
  const tweenStartRef = useRef<number | null>(null);
  const scrollAngularVelocityRef = useRef(0);
  const hoverLeaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const atSplash = phase === 'splash';

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
    },
    [clearHoverLeaveTimer]
  );

  const handlePointerLeavePanel = useCallback(() => {
    clearHoverLeaveTimer();
    hoverLeaveTimerRef.current = setTimeout(() => {
      setHoveredIndex(null);
      hoverLeaveTimerRef.current = null;
    }, HOME_PHOTO_RING_HOVER_LEAVE_MS);
  }, [clearHoverLeaveTimer]);

  const startOffset = useMemo(
    () => new Vector3(...HOME_PHOTO_RING_ENTER_OFFSET),
    []
  );
  const endPos = useMemo(() => new Vector3(0, 0, 0), []);

  const slots = useMemo(
    () =>
      Array.from({ length: HOME_PHOTO_RING_COUNT }, (_, i) => {
        const angle = (2 * Math.PI * i) / HOME_PHOTO_RING_COUNT;
        const x = Math.sin(angle) * HOME_PHOTO_RING_RADIUS;
        const z = Math.cos(angle) * HOME_PHOTO_RING_RADIUS;
        return { x, z, yaw: Math.atan2(x, z) + Math.PI };
      }),
    []
  );

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
      inner.rotation.y += delta * HOME_PHOTO_RING_ROTATE_RAD_PER_SEC;
      inner.rotation.y += scrollAngularVelocityRef.current * delta;
      scrollAngularVelocityRef.current *= Math.exp(
        -delta * HOME_PHOTO_RING_SCROLL_FRICTION
      );
      if (Math.abs(scrollAngularVelocityRef.current) < 1e-4) {
        scrollAngularVelocityRef.current = 0;
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
        {slots.map((s, i) => (
          <RingPanel
            key={i}
            index={i}
            slot={s}
            hoveredIndex={hoveredIndex}
            onPointerEnterPanel={handlePointerEnterPanel}
            onPointerLeavePanel={handlePointerLeavePanel}
          />
        ))}
      </group>
    </group>
  );
}
