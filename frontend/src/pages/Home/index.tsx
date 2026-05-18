import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeMobileProjectCarousel from '../../components/HomeMobileProjectCarousel';
import { HomeListRingConnector } from '../../components/HomeListRingConnector';
import HomePhotoRingCanvas from '../../components/HomePhotoRingCanvas';
import CaseStudiesList from '../../components/CaseStudiesList';
import {
  HOME_FOOTER_EXIT_FADE_DURATION_S,
  HOME_PHOTO_RING_LIST_FOCUS_LEAVE_MS,
} from '../../constants/homeScene';
import { usePrefetchData } from '../../hooks/usePrefetchData';
import { useGetCaseStudySummaries } from '../../queries/useGetCaseStudySummaries';
import {
  FooterLeft,
  FooterLeftStagger,
  FooterLine,
  FooterRight,
  HomeFooter,
  HomeRoot,
  HomeUiStack,
  HOME_MOBILE_MQ,
} from './styles';

function Home() {
  const navigate = useNavigate();
  const { data: caseStudies, isLoading, isError } = useGetCaseStudySummaries();
  usePrefetchData(caseStudies);

  const [isMobileViewport, setIsMobileViewport] = useState(
    () => window.matchMedia(HOME_MOBILE_MQ).matches
  );
  /** Footer row highlight — driven by list hover or ring pane hover */
  const [highlightedCaseStudyId, setHighlightedCaseStudyId] = useState<
    string | null
  >(null);
  /** Ring rotation lock — footer list hover only; ring hover does not set this */
  const [listDriveCaseStudyId, setListDriveCaseStudyId] = useState<
    string | null
  >(null);
  /** Staged ring fade then navigate to `/projects/:slug` */
  const [pendingExit, setPendingExit] = useState<{
    slug: string;
    caseStudyId: string;
  } | null>(null);
  /** Once true, footer stays faded until Home unmounts (avoids flash when clearing pending exit). */
  const [isLeavingHome, setIsLeavingHome] = useState(false);
  const exitSlugRef = useRef<string | null>(null);
  const exitInProgressRef = useRef(false);
  const focusLeaveTimerRef = useRef<number | null>(null);
  const listFooterAnchorScreenRef = useRef<{ x: number; y: number } | null>(
    null
  );
  const listDotElementRefs = useRef<Map<string, HTMLSpanElement>>(new Map());
  const listDotRefCallbackCache = useRef<
    Map<string, (el: HTMLSpanElement | null) => void>
  >(new Map());

  const getListDotRefCallback = useCallback((caseStudyId: string) => {
    let cb = listDotRefCallbackCache.current.get(caseStudyId);
    if (!cb) {
      cb = (el: HTMLSpanElement | null) => {
        const m = listDotElementRefs.current;
        if (el) m.set(caseStudyId, el);
        else m.delete(caseStudyId);
      };
      listDotRefCallbackCache.current.set(caseStudyId, cb);
    }
    return cb;
  }, []);

  const clearFocusLeaveTimer = useCallback(() => {
    if (focusLeaveTimerRef.current !== null) {
      clearTimeout(focusLeaveTimerRef.current);
      focusLeaveTimerRef.current = null;
    }
  }, []);

  const handleCaseLinkEnter = useCallback(
    (caseStudyId: string) => {
      clearFocusLeaveTimer();
      setHighlightedCaseStudyId(caseStudyId);
      setListDriveCaseStudyId(caseStudyId);
    },
    [clearFocusLeaveTimer]
  );

  const handleCaseLinkLeave = useCallback(() => {
    clearFocusLeaveTimer();
    focusLeaveTimerRef.current = window.setTimeout(() => {
      setHighlightedCaseStudyId(null);
      setListDriveCaseStudyId(null);
      focusLeaveTimerRef.current = null;
    }, HOME_PHOTO_RING_LIST_FOCUS_LEAVE_MS);
  }, [clearFocusLeaveTimer]);

  const handleRingHighlightEnter = useCallback(
    (caseStudyId: string) => {
      clearFocusLeaveTimer();
      setHighlightedCaseStudyId(caseStudyId);
      setListDriveCaseStudyId(null);
    },
    [clearFocusLeaveTimer]
  );

  const handleRingHighlightLeave = useCallback(() => {
    clearFocusLeaveTimer();
    focusLeaveTimerRef.current = window.setTimeout(() => {
      setHighlightedCaseStudyId(null);
      focusLeaveTimerRef.current = null;
    }, HOME_PHOTO_RING_LIST_FOCUS_LEAVE_MS);
  }, [clearFocusLeaveTimer]);

  const beginProjectExit = useCallback(
    (slug: string, caseStudyId: string) => {
      if (exitInProgressRef.current) return;
      exitInProgressRef.current = true;
      exitSlugRef.current = slug;
      clearFocusLeaveTimer();
      setHighlightedCaseStudyId(caseStudyId);
      setListDriveCaseStudyId(caseStudyId);
      setPendingExit({ slug, caseStudyId });
    },
    [clearFocusLeaveTimer]
  );

  const handleRingExitAnimationComplete = useCallback(() => {
    const slug = exitSlugRef.current;
    exitSlugRef.current = null;
    exitInProgressRef.current = false;
    setPendingExit(null);
    if (slug) navigate(`/projects/${slug}`);
  }, [navigate]);

  const handleRingPanelClick = useCallback(
    (slug: string, caseStudyId: string) => {
      beginProjectExit(slug, caseStudyId);
    },
    [beginProjectExit]
  );

  const handleRingExitSelectedFadeStart = useCallback(() => {
    setIsLeavingHome(true);
  }, []);

  useEffect(() => {
    const media = window.matchMedia(HOME_MOBILE_MQ);
    const onChange = (event: MediaQueryListEvent) => {
      setIsMobileViewport(event.matches);
    };
    setIsMobileViewport(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    return () => clearFocusLeaveTimer();
  }, [clearFocusLeaveTimer]);

  const showMobileCarousel = isMobileViewport;

  return (
    <HomeRoot>
      {!showMobileCarousel ? (
        <HomePhotoRingCanvas
          caseStudySummaries={caseStudies}
          listDriveCaseStudyId={listDriveCaseStudyId}
          highlightedCaseStudyId={highlightedCaseStudyId}
          listFooterAnchorScreenRef={listFooterAnchorScreenRef}
          onRingHighlightEnter={handleRingHighlightEnter}
          onRingHighlightLeave={handleRingHighlightLeave}
          onRingPanelClick={handleRingPanelClick}
          exitTargetCaseStudyId={pendingExit?.caseStudyId ?? null}
          onRingExitAnimationComplete={handleRingExitAnimationComplete}
          onRingExitSelectedFadeStart={handleRingExitSelectedFadeStart}
        />
      ) : null}
      {!showMobileCarousel ? (
        <HomeListRingConnector
          highlightedCaseStudyId={highlightedCaseStudyId}
          listDotRefs={listDotElementRefs}
          ringAnchorScreenRef={listFooterAnchorScreenRef}
          isLeavingHome={isLeavingHome}
        />
      ) : null}
      <HomeUiStack>
        {showMobileCarousel ? (
          <HomeMobileProjectCarousel
            caseStudySummaries={caseStudies}
            isLoading={isLoading}
            isError={isError}
          />
        ) : null}
        <HomeFooter
          initial={false}
          animate={{ opacity: isLeavingHome ? 0 : 1 }}
          transition={{
            duration: HOME_FOOTER_EXIT_FADE_DURATION_S,
            ease: [0.33, 1, 0.68, 1],
          }}
        >
          <FooterLeft>
            <FooterLeftStagger $staggerIndex={0} $align="start">
              <FooterLine>
                <strong>curly</strong> is an independent creative studio.
              </FooterLine>
            </FooterLeftStagger>
            <FooterLeftStagger $staggerIndex={1} $align="start">
              <FooterLine>
                we use world building to create moments in culture.
              </FooterLine>
            </FooterLeftStagger>
          </FooterLeft>
          <FooterRight>
            <CaseStudiesList
              summaries={caseStudies}
              isLoading={isLoading}
              isError={isError}
              highlightedId={highlightedCaseStudyId}
              getDotRefCallback={getListDotRefCallback}
              onItemEnter={handleCaseLinkEnter}
              onItemLeave={handleCaseLinkLeave}
              onItemClick={(e, slug, id) => {
                if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) {
                  return;
                }
                e.preventDefault();
                beginProjectExit(slug, id);
              }}
            />
          </FooterRight>
        </HomeFooter>
      </HomeUiStack>
    </HomeRoot>
  );
}

export default Home;
