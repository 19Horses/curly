/* eslint-disable react/no-unknown-property */
import { Center, Environment, OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import type { MutableRefObject } from 'react';
import {
  Suspense,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type FC,
  type ReactNode,
} from 'react';
import { styled } from 'styled-components';
import type { Group } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { Vector3 } from 'three';
import { CURLY_GLB_URL } from '../constants/curlyAsset';
import { HOME_CAMERA_ENTER_LERP_MS } from '../constants/homeScene';
import type { CaseStudySummary } from '../queries/useGetCaseStudySummaries';
import { HomePhotoRingPlaceholder } from './HomePhotoRingPlaceholder';

const SPLASH_CAMERA_POSITION = new Vector3(0, 2.5, 28);
const SPLASH_TARGET = new Vector3(0, 0, 0);

const INTRO_CAMERA_POSITION = new Vector3(0, 0, 0);
const INTRO_TARGET = new Vector3(0, 0, -30);
const INTRO_DURATION_SEC = 1;

useGLTF.preload(CURLY_GLB_URL);

/** World offset so the hero mesh leaves the frame while the camera eases to splash (Enter). */
const HERO_MODEL_EXIT_END = new Vector3(0, 58, 70);

function CurlyModel({ onLoaded }: { onLoaded: () => void }) {
  const gltf = useGLTF(CURLY_GLB_URL);
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
}: {
  phase: CanvasPhase;
  modelLoaded: boolean;
  onIntroDone: () => void;
}) {
  const controls = useThree((s) => s.controls) as OrbitControlsImpl | null;
  const introT = useRef(0);
  const introEndFired = useRef(false);
  const splash = phase === 'splash';

  const enterStartRef = useRef<number | null>(null);
  const enterFromPos = useRef(new Vector3());
  const enterFromTarget = useRef(new Vector3());

  useLayoutEffect(() => {
    if (phase === 'splash') {
      enterStartRef.current = null;
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
        t
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
      (clock.elapsedTime - enterStartRef.current) / enterSec
    );
    const t = easeFromT(rawT);

    camera.position.lerpVectors(
      enterFromPos.current,
      SPLASH_CAMERA_POSITION,
      t
    );
    controls.target.lerpVectors(enterFromTarget.current, SPLASH_TARGET, t);
    controls.update();

    if (rawT >= 1) {
      camera.position.copy(SPLASH_CAMERA_POSITION);
      controls.target.copy(SPLASH_TARGET);
      controls.update();
    }
  });

  return null;
}

function HeroModelExitGroup({
  phase,
  children,
}: {
  phase: CanvasPhase;
  children: ReactNode;
}) {
  const groupRef = useRef<Group>(null);
  const tweenStartRef = useRef<number | null>(null);
  const start = useMemo(() => new Vector3(0, 0, 0), []);
  const atSplash = phase === 'splash';

  useLayoutEffect(() => {
    if (atSplash) {
      tweenStartRef.current = null;
    }
  }, [atSplash]);

  useFrame(({ clock }) => {
    const g = groupRef.current;
    if (!g) return;

    if (atSplash) {
      g.position.copy(start);
      return;
    }

    if (tweenStartRef.current === null) {
      tweenStartRef.current = clock.elapsedTime;
    }

    const dur = HOME_CAMERA_ENTER_LERP_MS / 1000;
    const rawT = Math.min(1, (clock.elapsedTime - tweenStartRef.current) / dur);
    const t = easeFromT(rawT);
    g.position.lerpVectors(start, HERO_MODEL_EXIT_END, t);
    if (rawT >= 1) {
      g.position.copy(HERO_MODEL_EXIT_END);
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

function Scene({
  phase,
  caseStudySummaries,
  listDriveCaseStudyId,
  highlightedCaseStudyId,
  listFooterAnchorScreenRef,
  onHeroModelReady,
  onRingHighlightEnter,
  onRingHighlightLeave,
  onRingPanelClick,
  exitTargetCaseStudyId = null,
  onRingExitAnimationComplete,
  onRingExitSelectedFadeStart,
}: {
  phase: CanvasPhase;
  caseStudySummaries: CaseStudySummary[] | undefined;
  listDriveCaseStudyId: string | null;
  highlightedCaseStudyId: string | null;
  listFooterAnchorScreenRef?: MutableRefObject<{
    x: number;
    y: number;
  } | null>;
  onHeroModelReady?: () => void;
  onRingHighlightEnter?: (caseStudyId: string) => void;
  onRingHighlightLeave?: () => void;
  onRingPanelClick?: (slug: string, caseStudyId: string) => void;
  exitTargetCaseStudyId?: string | null;
  onRingExitAnimationComplete?: () => void;
  onRingExitSelectedFadeStart?: () => void;
}) {
  const [modelLoaded, setModelLoaded] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const isSplash = phase === 'splash';
  const showHeroModel = phase !== 'main';

  const onModelLoaded = useCallback(() => {
    setModelLoaded(true);
    onHeroModelReady?.();
  }, [onHeroModelReady]);
  const onIntroDone = useCallback(() => setIntroDone(true), []);

  return (
    <>
      {showHeroModel ? (
        <Suspense fallback={null}>
          <HeroModelExitGroup phase={phase}>
            <Center>
              <CurlyModel onLoaded={onModelLoaded} />
            </Center>
          </HeroModelExitGroup>
        </Suspense>
      ) : null}
      <Suspense fallback={null}>
        <HomePhotoRingPlaceholder
          phase={phase}
          caseStudySummaries={caseStudySummaries}
          listDriveCaseStudyId={listDriveCaseStudyId}
          highlightedCaseStudyId={highlightedCaseStudyId}
          listFooterAnchorScreenRef={listFooterAnchorScreenRef}
          onRingHighlightEnter={onRingHighlightEnter}
          onRingHighlightLeave={onRingHighlightLeave}
          onRingPanelClick={onRingPanelClick}
          exitTargetCaseStudyId={exitTargetCaseStudyId}
          onExitAnimationComplete={onRingExitAnimationComplete}
          onExitSelectedFadeStart={onRingExitSelectedFadeStart}
        />
      </Suspense>
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
        enabled={isSplash && introDone}
        enableDamping={false}
        target={[INTRO_TARGET.x, INTRO_TARGET.y, INTRO_TARGET.z]}
        autoRotate={isSplash && introDone}
        autoRotateSpeed={0.9}
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
      />
      <CameraRig
        phase={phase}
        modelLoaded={modelLoaded}
        onIntroDone={onIntroDone}
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

/** Fade entire WebGL layer in only after hero GLTF commits (avoids mesh popping ahead of CSS). */
const CanvasReveal = styled.div<{ $visible: boolean }>`
  position: absolute;
  inset: 0;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.45s ease-out;
  pointer-events: ${({ $visible }) => ($visible ? 'auto' : 'none')};
`;

export type HomeSplashCanvasProps = {
  phase: CanvasPhase;
  caseStudySummaries?: CaseStudySummary[];
  /** Footer list hover only — drives ring rotation toward that panel */
  listDriveCaseStudyId?: string | null;
  /** List or ring pane hover — drives connector line (with listFooterAnchorScreenRef) */
  highlightedCaseStudyId?: string | null;
  /** Screen coords for connector dot below ring panel (written by WebGL) */
  listFooterAnchorScreenRef?: MutableRefObject<{
    x: number;
    y: number;
  } | null>;
  onRingHighlightEnter?: (caseStudyId: string) => void;
  onRingHighlightLeave?: () => void;
  onRingPanelClick?: (slug: string, caseStudyId: string) => void;
  /** Case study `_id` driving staged ring fade-out before navigation */
  exitTargetCaseStudyId?: string | null;
  onRingExitAnimationComplete?: () => void;
  /** Ring begins fading the selected panel (others already faded) — e.g. footer out */
  onRingExitSelectedFadeStart?: () => void;
};

const HomeSplashCanvas: FC<HomeSplashCanvasProps> = ({
  phase,
  caseStudySummaries,
  listDriveCaseStudyId = null,
  highlightedCaseStudyId = null,
  listFooterAnchorScreenRef,
  onRingHighlightEnter,
  onRingHighlightLeave,
  onRingPanelClick,
  exitTargetCaseStudyId = null,
  onRingExitAnimationComplete,
  onRingExitSelectedFadeStart,
}) => {
  const [sceneReveal, setSceneReveal] = useState(false);

  const onHeroModelReady = useCallback(() => {
    setSceneReveal(true);
  }, []);

  useLayoutEffect(() => {
    if (phase === 'main') {
      setSceneReveal(true);
    }
  }, [phase]);

  return (
    <CanvasLayer aria-hidden>
      <CanvasReveal $visible={sceneReveal}>
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
          <Scene
            phase={phase}
            caseStudySummaries={caseStudySummaries}
            listDriveCaseStudyId={listDriveCaseStudyId}
            highlightedCaseStudyId={highlightedCaseStudyId}
            listFooterAnchorScreenRef={listFooterAnchorScreenRef}
            onHeroModelReady={onHeroModelReady}
            onRingHighlightEnter={onRingHighlightEnter}
            onRingHighlightLeave={onRingHighlightLeave}
            onRingPanelClick={onRingPanelClick}
            exitTargetCaseStudyId={exitTargetCaseStudyId}
            onRingExitAnimationComplete={onRingExitAnimationComplete}
            onRingExitSelectedFadeStart={onRingExitSelectedFadeStart}
          />
        </Canvas>
      </CanvasReveal>
    </CanvasLayer>
  );
};

export default HomeSplashCanvas;
