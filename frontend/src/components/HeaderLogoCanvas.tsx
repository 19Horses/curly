/* eslint-disable react/no-unknown-property */
import { Bounds, Center, Environment, useGLTF } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, useLayoutEffect } from 'react';
import { CURLY_GLB_URL } from '../constants/curlyAsset';

useGLTF.preload(CURLY_GLB_URL);

function HeaderLogoMesh() {
  const gltf = useGLTF(CURLY_GLB_URL);
  useLayoutEffect(() => {
    gltf.scene.traverse((o) => {
      o.frustumCulled = false;
    });
  }, [gltf.scene]);
  return <primitive object={gltf.scene} />;
}

function HeaderLogoScene() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 8, 10]} intensity={1.35} color="#ffffff" />
      <directionalLight
        position={[-8, 4, 6]}
        intensity={0.85}
        color="#f4f4ff"
      />
      <Bounds fit clip observe margin={1.18} maxDuration={0.001}>
        <Suspense fallback={null}>
          <Center>
            <HeaderLogoMesh />
          </Center>
        </Suspense>
      </Bounds>
      <Environment preset="studio" environmentIntensity={0.28} />
    </>
  );
}

/**
 * Layout-sized orthographic canvas for the header logo (stable framing on resize).
 */
export default function HeaderLogoCanvas() {
  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 18], zoom: 48, near: 0.1, far: 200 }}
      gl={{ alpha: true, antialias: true }}
      onCreated={({ gl }) => {
        gl.setClearColor('#000000', 0);
      }}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        pointerEvents: 'none',
      }}
    >
      <HeaderLogoScene />
    </Canvas>
  );
}
