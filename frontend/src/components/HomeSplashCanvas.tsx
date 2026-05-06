/* eslint-disable react/no-unknown-property */
import { Center, Environment, OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Suspense,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { styled } from 'styled-components';
import type { Group } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { MathUtils, Vector3 } from 'three';
import {
  HOME_CAMERA_ENTER_LERP_MS,
  HOME_MODEL_REST_POSITION,
  HOME_MODEL_REST_SCALE,
  HOME_MODEL_TO_REST_LERP_MS,
} from '../constants/homeScene';

const CURLY_GLB = '/curly.glb';

const SPLASH_CAMERA_POSITION = new Vector3(0, 2.5, 28);
const SPLASH_TARGET = new Vector3(0, 0, 0);

const INTRO_CAMERA_POSITION = new Vector3(0, 0, 0);
const INTRO_TARGET = new Vector3(0, 0, -30);
const INTRO_DURATION_SEC = 1;

useGLTF.preload(CURLY_GLB);

function CurlyModel({ onLoaded }: { onLoaded: () => void }) {
  const gltf = useGLTF(CURLY_GLB);
  useLayoutEffect(() => {
    onLoaded();
  }, [onLoaded]);
  return <primitive object={gltf.scene} />;
}

type CanvasPhase = 'splash' | 'transitioning' | 'main';

function easeFromT(t: number): number {
  return 1 - (1 - Math.min(1, Math.max(0, t))) ** 3;
}

function CameraRig({
  phase,
  modelLoaded,
  onIntroDone,
  onSplashDone,
}: {
  phase: CanvasPhase;
  modelLoaded: boolean;
  onIntroDone: () => void;
  onSplashDone: () => void;
}) {
  const controls = useThree((s) => s.controls) as OrbitControlsImpl | null;
  const introT = useRef(0);
  const introEndFired = useRef(false);
  const splash = phase === 'splash';

  const enterStartRef = useRef<number | null>(null);
  const enterFromPos = useRef(new Vector3());
  const enterFromTarget = useRef(new Vector3());
  const splashRestFiredRef = useRef(false);

  useLayoutEffect(() => {
    if (phase === 'splash') {
      enterStartRef.current = null;
      splashRestFiredRef.current = false;
    }
  }, [phase]);

  useFrame(({ camera, clock }, delta) => {
    if (!controls) return;

    if (splash) {
      if (!modelLoaded) {
        camera.position.copy(INTRO_CAMERA_POSITION);
        controls.target.copy(INTRO_TARGET);
        controls.update();
        return;
      }

      if (introT.current >= 1) {
        if (!introEndFired.current) {
          introEndFired.current = true;
          camera.position.copy(SPLASH_CAMERA_POSITION);
          controls.target.copy(SPLASH_TARGET);
          controls.update();
          onIntroDone();
        }
        return;
      }

      introT.current = Math.min(1, introT.current + delta / INTRO_DURATION_SEC);
      const t = easeFromT(introT.current);
      camera.position.lerpVectors(
        INTRO_CAMERA_POSITION,
        SPLASH_CAMERA_POSITION,
        t,
      );
      controls.target.lerpVectors(INTRO_TARGET, SPLASH_TARGET, t);
      controls.update();
      return;
    }

    if (enterStartRef.current === null) {
      enterStartRef.current = clock.elapsedTime;
      enterFromPos.current.copy(camera.position);
      enterFromTarget.current.copy(controls.target);
    }

    const enterSec = HOME_CAMERA_ENTER_LERP_MS / 1000;
    const rawT = Math.min(
      1,
      (clock.elapsedTime - enterStartRef.current) / enterSec,
    );
    const t = easeFromT(rawT);

    camera.position.lerpVectors(enterFromPos.current, SPLASH_CAMERA_POSITION, t);
    controls.target.lerpVectors(enterFromTarget.current, SPLASH_TARGET, t);
    controls.update();

    if (rawT >= 0.8) {
      camera.position.copy(SPLASH_CAMERA_POSITION);
      controls.target.copy(SPLASH_TARGET);
      controls.update();
      if (!splashRestFiredRef.current) {
        splashRestFiredRef.current = true;
        onSplashDone();
      }
    }
  });

  return null;
}

function ModelRestGroup({
  phase,
  cameraAtRest,
  children,
}: {
  phase: CanvasPhase;
  cameraAtRest: boolean;
  children: ReactNode;
}) {
  const groupRef = useRef<Group>(null);
  const tweenStartRef = useRef<number | null>(null);

  const startPos = useMemo(() => new Vector3(0, 0, 0), []);
  const endPos = useMemo(
    () => new Vector3(...HOME_MODEL_REST_POSITION),
    [],
  );

  const atSplash = phase === 'splash';

  useLayoutEffect(() => {
    if (atSplash) {
      tweenStartRef.current = null;
    }
  }, [atSplash]);

  useFrame(({ clock }) => {
    const g = groupRef.current;
    if (!g) return;

    if (atSplash || !cameraAtRest) {
      g.position.copy(startPos);
      g.scale.setScalar(1);
      return;
    }

    if (tweenStartRef.current === null) {
      tweenStartRef.current = clock.elapsedTime;
    }

    const dur = HOME_MODEL_TO_REST_LERP_MS / 1000;
    const rawT = Math.min(
      1,
      (clock.elapsedTime - tweenStartRef.current) / dur,
    );
    const t = easeFromT(rawT);

    g.position.lerpVectors(startPos, endPos, t);
    const s = MathUtils.lerp(1, HOME_MODEL_REST_SCALE, t);
    g.scale.setScalar(s);

    if (rawT >= 1) {
      g.position.copy(endPos);
      g.scale.setScalar(HOME_MODEL_REST_SCALE);
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

function Scene({ phase }: { phase: CanvasPhase }) {
  const [modelLoaded, setModelLoaded] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  const isSplash = phase === 'splash';

  const onModelLoaded = useCallback(() => setModelLoaded(true), []);
  const onIntroDone = useCallback(() => setIntroDone(true), []);
  const onSplashDone = useCallback(() => setSplashDone(true), []);

  return (
    <>
      <ModelRestGroup phase={phase} cameraAtRest={splashDone}>
        <Suspense fallback={null}>
          <Center>
            <CurlyModel onLoaded={onModelLoaded} />
          </Center>
        </Suspense>
      </ModelRestGroup>
      <directionalLight position={[5, 8, 12]} intensity={2.5} color="#ffffff" />
      <directionalLight
        position={[-10, 5, 6]}
        intensity={1.2}
        color="#f7f7ff"
      />
      <directionalLight
        position={[0, 8, -12]}
        intensity={1.2}
        color="#ffffff"
      />
      <Environment preset="studio" environmentIntensity={0.3} />
      <OrbitControls
        makeDefault
        enableDamping={false}
        target={[INTRO_TARGET.x, INTRO_TARGET.y, INTRO_TARGET.z]}
        autoRotate={isSplash && introDone}
        autoRotateSpeed={0.7}
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
      />
      <CameraRig
        phase={phase}
        modelLoaded={modelLoaded}
        onIntroDone={onIntroDone}
        onSplashDone={onSplashDone}
      />
    </>
  );
}

const CanvasLayer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  touch-action: none;
  pointer-events: auto;
  background: #ffffff;

  canvas {
    display: block;
    width: 100%;
    height: 100%;
    cursor: crosshair;
  }
`;

export type HomeSplashCanvasProps = {
  phase: CanvasPhase;
};

function HomeSplashCanvas({ phase }: HomeSplashCanvasProps) {
  return (
    <CanvasLayer aria-hidden>
      <Canvas
        gl={{ antialias: true, alpha: false }}
        camera={{
          position: INTRO_CAMERA_POSITION.toArray(),
          fov: 42,
          near: 0.1,
          far: 300,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#ffffff', 1);
        }}
      >
        <Scene phase={phase} />
      </Canvas>
    </CanvasLayer>
  );
}

export default HomeSplashCanvas;
