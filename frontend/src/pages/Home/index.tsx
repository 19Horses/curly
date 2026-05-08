import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useHomeSplashChrome } from '../../context/HomeSplashChromeContext';
import HomeSplashCanvas from '../../components/HomeSplashCanvas';
import { StaggerRow } from '../../components/StaggerRow';
import {
  HOME_ENTER_SEQUENCE_MS,
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
  const { data: caseStudies, isLoading, isError } = useGetCaseStudySummaries();
  const { setSuppressSiteHeader } = useHomeSplashChrome();

  const [phase, setPhase] = useState<HomePhase>(() =>
    readHasSeenSplashFromStorage() ? 'main' : 'splash'
  );
  const [listFocusCaseStudyId, setListFocusCaseStudyId] = useState<string | null>(
    null
  );
  const listFocusLeaveTimerRef = useRef<number | null>(null);

  const clearListFocusLeaveTimer = useCallback(() => {
    if (listFocusLeaveTimerRef.current !== null) {
      clearTimeout(listFocusLeaveTimerRef.current);
      listFocusLeaveTimerRef.current = null;
    }
  }, []);

  const handleCaseLinkEnter = useCallback(
    (caseStudyId: string) => {
      clearListFocusLeaveTimer();
      setListFocusCaseStudyId(caseStudyId);
    },
    [clearListFocusLeaveTimer]
  );

  const handleCaseLinkLeave = useCallback(() => {
    clearListFocusLeaveTimer();
    listFocusLeaveTimerRef.current = window.setTimeout(() => {
      setListFocusCaseStudyId(null);
      listFocusLeaveTimerRef.current = null;
    }, HOME_PHOTO_RING_LIST_FOCUS_LEAVE_MS);
  }, [clearListFocusLeaveTimer]);

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
    return () => clearListFocusLeaveTimer();
  }, [clearListFocusLeaveTimer]);

  return (
    <HomeRoot>
      <HomeSplashCanvas
        phase={phase}
        caseStudySummaries={caseStudies}
        listFocusedCaseStudyId={listFocusCaseStudyId}
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
          <HomeFooter>
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
                    {caseStudies.map((study, index) => (
                      <li key={study._id}>
                        <StaggerRow $staggerIndex={index + 1} $align="end">
                          <CaseLink
                            to={`/projects/${study.slug}`}
                            onMouseEnter={() =>
                              handleCaseLinkEnter(study._id)
                            }
                            onMouseLeave={handleCaseLinkLeave}
                          >
                            {study.client} – {study.title}
                          </CaseLink>
                        </StaggerRow>
                      </li>
                    ))}
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
