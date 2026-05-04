/* eslint-disable react/no-unknown-property */
import { Bounds, Environment, OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useLayoutEffect, useMemo, useRef } from 'react';
import { styled } from 'styled-components';
import { Group, Vector3 } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import {
  HOME_CAMERA_ENTER_LERP_MS,
  HOME_MODEL_REST_POSITION,
  HOME_MODEL_TO_REST_LERP_MS,
} from '../constants/homeScene';

const CURLY_GLB = '/curly.glb';

useGLTF.preload(CURLY_GLB);

const SPLASH_CAMERA_POSITION = new Vector3(0, 2.5, 28);
const SPLASH_MODEL_POSITION = new Vector3(0, 0, 0);

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

function CurlyModel() {
  const gltf = useGLTF(CURLY_GLB);
  return <primitive object={gltf.scene} />;
}

type CanvasPhase = 'splash' | 'transitioning' | 'main';

function ModelGroup({
  phase,
  controlsRef,
  transitionStartTimeRef,
  cameraAtRestRef,
  modelCenterWorldRef,
  modelMoveStartedAtRef,
}: {
  phase: CanvasPhase;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
  transitionStartTimeRef: React.MutableRefObject<number | null>;
  cameraAtRestRef: React.MutableRefObject<boolean>;
  modelCenterWorldRef: React.MutableRefObject<Vector3>;
  modelMoveStartedAtRef: React.MutableRefObject<number | null>;
}) {
  const ref = useRef<Group>(null);
  const restVec = useMemo(
    () =>
      new Vector3(
        HOME_MODEL_REST_POSITION[0],
        HOME_MODEL_REST_POSITION[1],
        HOME_MODEL_REST_POSITION[2],
      ),
    [],
  );

  useLayoutEffect(() => {
    if (phase === 'splash') {
      ref.current?.position.copy(SPLASH_MODEL_POSITION);
      modelMoveStartedAtRef.current = null;
    }
    if (phase === 'main') {
      ref.current?.position.copy(restVec);
    }
  }, [phase, restVec, modelMoveStartedAtRef]);

  useFrame(() => {
    const controls = controlsRef.current;
    if (!ref.current) {
      return;
    }

    ref.current.getWorldPosition(modelCenterWorldRef.current);

    if (phase === 'transitioning') {
      if (transitionStartTimeRef.current === null) {
        transitionStartTimeRef.current = performance.now();
      }

      const Tm = HOME_MODEL_TO_REST_LERP_MS;

      if (!cameraAtRestRef.current) {
        ref.current.position.copy(SPLASH_MODEL_POSITION);
        modelMoveStartedAtRef.current = null;
      } else {
        if (modelMoveStartedAtRef.current === null) {
          modelMoveStartedAtRef.current = performance.now();
        }
        const t0 = modelMoveStartedAtRef.current;
        const elapsedMove = t0 === null ? 0 : performance.now() - t0;

        if (elapsedMove < Tm) {
          const u = easeInOutCubic(Math.min(1, elapsedMove / Tm));
          ref.current.position.lerpVectors(
            SPLASH_MODEL_POSITION,
            restVec,
            u,
          );
        } else {
          ref.current.position.copy(restVec);
        }
      }
    }

    if (!controls) {
      return;
    }
    if (phase === 'main') {
      controls.target.set(0, 0, 0);
    } else {
      controls.target.copy(modelCenterWorldRef.current);
    }
  });

  return (
    <group ref={ref}>
      <Bounds fit clip margin={0.82}>
        <Suspense fallback={null}>
          <CurlyModel />
        </Suspense>
      </Bounds>
    </group>
  );
}

function CameraEnterLerp({
  phase,
  transitionStartTimeRef,
  cameraAtRestRef,
  modelCenterWorldRef,
  modelMoveStartedAtRef,
}: {
  phase: CanvasPhase;
  transitionStartTimeRef: React.MutableRefObject<number | null>;
  cameraAtRestRef: React.MutableRefObject<boolean>;
  modelCenterWorldRef: React.MutableRefObject<Vector3>;
  modelMoveStartedAtRef: React.MutableRefObject<number | null>;
}) {
  const { camera } = useThree();
  const cameraStartRef = useRef<Vector3 | null>(null);

  useLayoutEffect(() => {
    if (phase === 'transitioning') {
      cameraStartRef.current = camera.position.clone();
      transitionStartTimeRef.current = null;
      cameraAtRestRef.current = false;
    }
    if (phase === 'splash') {
      cameraStartRef.current = null;
      transitionStartTimeRef.current = null;
      cameraAtRestRef.current = false;
    }
  }, [phase, camera, transitionStartTimeRef, cameraAtRestRef]);

  useFrame(() => {
    if (phase !== 'transitioning') {
      return;
    }

    if (transitionStartTimeRef.current === null) {
      transitionStartTimeRef.current = performance.now();
    }

    const t0 = transitionStartTimeRef.current;
    const elapsed = t0 === null ? 0 : performance.now() - t0;
    const T = HOME_CAMERA_ENTER_LERP_MS;

    if (elapsed < T) {
      cameraAtRestRef.current = false;
      const start = cameraStartRef.current ?? camera.position.clone();
      const u = easeInOutCubic(Math.min(1, elapsed / T));
      camera.position.lerpVectors(start, SPLASH_CAMERA_POSITION, u);
    } else {
      camera.position.copy(SPLASH_CAMERA_POSITION);
      cameraAtRestRef.current = true;
    }

    if (modelMoveStartedAtRef.current !== null) {
      camera.lookAt(0, 0, 0);
    } else {
      camera.lookAt(modelCenterWorldRef.current);
    }
  });

  return null;
}

/** Runs after OrbitControls mounts so ref exists; aligns orbit pivot with post-transition look-at (origin). */
function SyncMainOrbitTarget({
  phase,
  controlsRef,
}: {
  phase: CanvasPhase;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}) {
  useLayoutEffect(() => {
    if (phase === 'main') {
      controlsRef.current?.target.set(0, 0, 0);
    }
  }, [phase, controlsRef]);

  return null;
}

function Scene({ phase }: { phase: CanvasPhase }) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const transitionStartTimeRef = useRef<number | null>(null);
  const cameraAtRestRef = useRef(false);
  const modelCenterWorldRef = useRef(new Vector3());
  const modelMoveStartedAtRef = useRef<number | null>(null);

  const orbitEnabled = phase !== 'transitioning';

  useLayoutEffect(() => {
    transitionStartTimeRef.current = null;
    cameraAtRestRef.current = false;
    modelMoveStartedAtRef.current = null;
  }, [phase]);

  return (
    <>
      <ModelGroup
        phase={phase}
        controlsRef={controlsRef}
        transitionStartTimeRef={transitionStartTimeRef}
        cameraAtRestRef={cameraAtRestRef}
        modelCenterWorldRef={modelCenterWorldRef}
        modelMoveStartedAtRef={modelMoveStartedAtRef}
      />
      <CameraEnterLerp
        phase={phase}
        transitionStartTimeRef={transitionStartTimeRef}
        cameraAtRestRef={cameraAtRestRef}
        modelCenterWorldRef={modelCenterWorldRef}
        modelMoveStartedAtRef={modelMoveStartedAtRef}
      />
      <directionalLight
        position={[5, 8, 12]}
        intensity={2.5}
        color="#ffffff"
      />
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
        ref={controlsRef}
        makeDefault
        enableZoom={false}
        enablePan={false}
        minPolarAngle={0.15}
        maxPolarAngle={Math.PI - 0.15}
        enabled={orbitEnabled}
        target={[0, 0, 0]}
      />
      <SyncMainOrbitTarget phase={phase} controlsRef={controlsRef} />
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
    cursor: grab;
  }

  canvas:active {
    cursor: grabbing;
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
        camera={{ position: [0, 0, 6], fov: 42, near: 0.1, far: 100 }}
        dpr={[1, 2]}
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
