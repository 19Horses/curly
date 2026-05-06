/* eslint-disable react/no-unknown-property */
import { Center, Environment, OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useCallback, useLayoutEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { Vector3 } from 'three';

const CURLY_GLB = '/curly.glb';
const EPSILON = 0.05;

const SPLASH_CAMERA_POSITION = new Vector3(0, 2.5, 28);
const SPLASH_TARGET = new Vector3(0, 0, 0);



const INTRO_CAMERA_POSITION = new Vector3(0, 0, 0);
const INTRO_TARGET = new Vector3(0, 0, -30);
const INTRO_DURATION_SEC = 1;

useGLTF.preload(CURLY_GLB);

function CurlyModel({ onLoaded }: { onLoaded: () => void, splashDone: boolean }) {
  const gltf = useGLTF(CURLY_GLB);
  useLayoutEffect(() => {
    onLoaded();
  }, [onLoaded]);
  return <primitive object={gltf.scene} />;
}

type CanvasPhase = 'splash' | 'transitioning' | 'main';

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

  useFrame(({ camera }, delta) => {
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
      const t = 1 - (1 - introT.current) ** 3;
      camera.position.lerpVectors(INTRO_CAMERA_POSITION, SPLASH_CAMERA_POSITION, t);
      controls.target.lerpVectors(INTRO_TARGET, SPLASH_TARGET, t);
      controls.update();
      return;
    }

    const k = Math.min(1, delta * 7);
    camera.position.lerp(SPLASH_CAMERA_POSITION, k);
    controls.target.lerp(SPLASH_TARGET, k);
    controls.update();

    if (camera.position.distanceTo(SPLASH_CAMERA_POSITION) < EPSILON) {
      camera.position.copy(SPLASH_CAMERA_POSITION);
      controls.target.copy(SPLASH_TARGET);
      controls.update();
      onSplashDone();
    }
  });

  return null;
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
      <group>
        <Suspense fallback={null}>
          <Center>
            <CurlyModel onLoaded={onModelLoaded} splashDone={splashDone} />
          </Center>
        </Suspense>
      </group>
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
          far: 100,
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
