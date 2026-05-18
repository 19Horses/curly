/* eslint-disable react/no-unknown-property */
import { Environment, OrbitControls } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { useLayoutEffect, type FC, type MutableRefObject } from 'react';
import { styled } from 'styled-components';
import type { CaseStudySummary } from '../queries/useGetCaseStudySummaries';
import { HomePhotoRingPlaceholder } from './HomePhotoRingPlaceholder';

const HOME_CAMERA_POSITION = [0, 2.5, 28] as const;
const HOME_CAMERA_TARGET = [0, 0, 0] as const;
const MOBILE_CAMERA_FOV = 52;
const DESKTOP_CAMERA_FOV = 42;

function ResponsiveCameraFov() {
  const camera = useThree((s) => s.camera);
  const viewportWidth = useThree((s) => s.size.width);

  useLayoutEffect(() => {
    if (!('fov' in camera)) return;
    const targetFov =
      viewportWidth <= 768 ? MOBILE_CAMERA_FOV : DESKTOP_CAMERA_FOV;
    if (camera.fov !== targetFov) {
      camera.fov = targetFov;
      camera.updateProjectionMatrix();
    }
  }, [camera, viewportWidth]);

  return null;
}

function Scene({
  caseStudySummaries,
  listDriveCaseStudyId,
  highlightedCaseStudyId,
  listFooterAnchorScreenRef,
  onRingHighlightEnter,
  onRingHighlightLeave,
  onRingPanelClick,
  exitTargetCaseStudyId = null,
  onRingExitAnimationComplete,
  onRingExitSelectedFadeStart,
}: {
  caseStudySummaries: CaseStudySummary[] | undefined;
  listDriveCaseStudyId: string | null;
  highlightedCaseStudyId: string | null;
  listFooterAnchorScreenRef?: MutableRefObject<{
    x: number;
    y: number;
  } | null>;
  onRingHighlightEnter?: (caseStudyId: string) => void;
  onRingHighlightLeave?: () => void;
  onRingPanelClick?: (slug: string, caseStudyId: string) => void;
  exitTargetCaseStudyId?: string | null;
  onRingExitAnimationComplete?: () => void;
  onRingExitSelectedFadeStart?: () => void;
}) {
  return (
    <>
      <ResponsiveCameraFov />
      <HomePhotoRingPlaceholder
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
        enabled={false}
        enableDamping={false}
        target={HOME_CAMERA_TARGET}
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
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

export type HomePhotoRingCanvasProps = {
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

const HomePhotoRingCanvas: FC<HomePhotoRingCanvasProps> = ({
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
  return (
    <CanvasLayer aria-hidden>
      <Canvas
        gl={{ antialias: true, alpha: true }}
        camera={{
          position: HOME_CAMERA_POSITION,
          fov: DESKTOP_CAMERA_FOV,
          near: 0.1,
          far: 300,
        }}
      >
        <Scene
          caseStudySummaries={caseStudySummaries}
          listDriveCaseStudyId={listDriveCaseStudyId}
          highlightedCaseStudyId={highlightedCaseStudyId}
          listFooterAnchorScreenRef={listFooterAnchorScreenRef}
          onRingHighlightEnter={onRingHighlightEnter}
          onRingHighlightLeave={onRingHighlightLeave}
          onRingPanelClick={onRingPanelClick}
          exitTargetCaseStudyId={exitTargetCaseStudyId}
          onRingExitAnimationComplete={onRingExitAnimationComplete}
          onRingExitSelectedFadeStart={onRingExitSelectedFadeStart}
        />
      </Canvas>
    </CanvasLayer>
  );
};

export default HomePhotoRingCanvas;
