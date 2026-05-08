import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useHomeSplashChrome } from '../../context/HomeSplashChromeContext';
import { HomeListRingConnector } from '../../components/HomeListRingConnector';
import HomeSplashCanvas from '../../components/HomeSplashCanvas';
import { StaggerRow } from '../../components/StaggerRow';
import {
  HOME_ENTER_SEQUENCE_MS,
  HOME_FOOTER_EXIT_FADE_DURATION_S,
  HOME_PHOTO_RING_LIST_FOCUS_LEAVE_MS,
} from '../../constants/homeScene';
import {
  HAS_SEEN_SPLASH_STORAGE_KEY,
  readHasSeenSplashFromStorage,
} from '../../constants/splash';
import { useGetCaseStudySummaries } from '../../queries/useGetCaseStudySummaries';
import {
  CaseLink,
  CaseList,
  CaseListDot,
  CaseListItem,
  EnterButton,
  FooterLeft,
  FooterLeftStagger,
  FooterLine,
  FooterRight,
  HomeFooter,
  HomeRoot,
  HomeUiStack,
  ListHeading,
  SplashChrome,
} from './styles';

type HomePhase = 'splash' | 'transitioning' | 'main';

function Home() {
  const navigate = useNavigate();
  const { data: caseStudies, isLoading, isError } = useGetCaseStudySummaries();
  console.log('caseStudies', caseStudies);
  const { setSuppressSiteHeader } = useHomeSplashChrome();

  const [phase, setPhase] = useState<HomePhase>(() =>
    readHasSeenSplashFromStorage() ? 'main' : 'splash'
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
      if (phase !== 'main') return;
      if (exitInProgressRef.current) return;
      exitInProgressRef.current = true;
      exitSlugRef.current = slug;
      clearFocusLeaveTimer();
      setHighlightedCaseStudyId(caseStudyId);
      setListDriveCaseStudyId(caseStudyId);
      setPendingExit({ slug, caseStudyId });
    },
    [phase, clearFocusLeaveTimer]
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

  useLayoutEffect(() => {
    const hideHeader = phase === 'splash' || phase === 'transitioning';
    setSuppressSiteHeader(hideHeader);
    return () => setSuppressSiteHeader(false);
  }, [phase, setSuppressSiteHeader]);

  const persistSeenAndShowFooter = useCallback(() => {
    try {
      localStorage.setItem(HAS_SEEN_SPLASH_STORAGE_KEY, 'true');
    } catch {
      /* ignore */
    }
    setPhase('main');
  }, []);

  const handleEnter = () => {
    setPhase('transitioning');
  };

  useEffect(() => {
    if (phase !== 'transitioning') {
      return;
    }
    const id = window.setTimeout(
      persistSeenAndShowFooter,
      HOME_ENTER_SEQUENCE_MS
    );
    return () => window.clearTimeout(id);
  }, [phase, persistSeenAndShowFooter]);

  useEffect(() => {
    return () => clearFocusLeaveTimer();
  }, [clearFocusLeaveTimer]);

  return (
    <HomeRoot>
      <HomeSplashCanvas
        phase={phase}
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
      <HomeListRingConnector
        highlightedCaseStudyId={highlightedCaseStudyId}
        listDotRefs={listDotElementRefs}
        ringAnchorScreenRef={listFooterAnchorScreenRef}
        isLeavingHome={isLeavingHome}
      />
      <HomeUiStack>
        {phase === 'splash' ? (
          <SplashChrome>
            <EnterButton type="button" onClick={handleEnter}>
              Enter
            </EnterButton>
          </SplashChrome>
        ) : null}
        {phase === 'main' ? (
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
              <StaggerRow $staggerIndex={0} $align="end">
                <ListHeading>worlds we&apos;ve built</ListHeading>
              </StaggerRow>
              {isLoading && <FooterLine>Loading projects…</FooterLine>}
              {isError && <FooterLine>Could not load projects.</FooterLine>}
              {!isLoading &&
                !isError &&
                caseStudies &&
                caseStudies.length > 0 && (
                  <CaseList>
                    {caseStudies.map((study, index) => {
                      const rowHighlighted =
                        highlightedCaseStudyId === study._id;
                      return (
                        <CaseListItem
                          key={study._id}
                          $highlighted={rowHighlighted}
                        >
                          <CaseListDot ref={getListDotRefCallback(study._id)} />
                          <StaggerRow $staggerIndex={index + 1} $align="end">
                            <CaseLink
                              to={`/projects/${study.slug}`}
                              $syncHover={rowHighlighted}
                              onMouseEnter={() =>
                                handleCaseLinkEnter(study._id)
                              }
                              onMouseLeave={handleCaseLinkLeave}
                              onClick={(e) => {
                                if (
                                  e.ctrlKey ||
                                  e.metaKey ||
                                  e.shiftKey ||
                                  e.altKey
                                ) {
                                  return;
                                }
                                e.preventDefault();
                                beginProjectExit(study.slug, study._id);
                              }}
                            >
                              {study.client} – {study.title}
                            </CaseLink>
                          </StaggerRow>
                        </CaseListItem>
                      );
                    })}
                  </CaseList>
                )}
              {!isLoading && !isError && caseStudies?.length === 0 && (
                <FooterLine>No projects yet.</FooterLine>
              )}
            </FooterRight>
          </HomeFooter>
        ) : null}
      </HomeUiStack>
    </HomeRoot>
  );
}

export default Home;
