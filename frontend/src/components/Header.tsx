import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { styled, css } from 'styled-components';
import logoSrc from '../assets/logo.png';
import { PROJECT_SURFACE_TIMING } from '../constants/projectSurface';
import { useProjectChrome } from '../hooks/useProjectChrome';
import { useGetCaseStudySummaries } from '../queries/useGetCaseStudySummaries';
import CaseStudiesList from './CaseStudiesList';
import { ListHeading } from './CaseStudiesList/styles';
import { HeaderAudioTrack } from './HeaderAudioTrack';
import { StaggerRow } from './StaggerRow';
import { fadeIn, fadeInAbsoluteCenter } from '../styles/animations';

function ordinalDay(n: number): string {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) {
    return `${n}th`;
  }
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

function formatHeaderDate(date: Date, compact = false): string {
  const weekday = new Intl.DateTimeFormat('en-GB', { weekday: 'short' }).format(
    date
  );

  if (compact) {
    const month = new Intl.DateTimeFormat('en-GB', { month: 'short' }).format(
      date
    );
    return `${weekday} ${date.getDate()} ${month}`;
  }

  const month = new Intl.DateTimeFormat('en-GB', { month: 'long' }).format(
    date
  );
  const year = date.getFullYear();
  const day = ordinalDay(date.getDate());
  return `${weekday} ${day} ${month} ${year}`;
}

const Shell = styled.header<{ $projectChrome: boolean; $menuOpen: boolean }>`
  position: relative;
  z-index: ${({ $menuOpen }) => ($menuOpen ? 10000 : 2)};
  --header-pad: clamp(0.75rem, 0.4rem + 2.2vw, 2.5rem);
  padding: var(--header-pad);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  gap: clamp(0.5rem, 0.35rem + 0.8vw, 1rem);
  font-size: clamp(0.8125rem, 0.72rem + 0.45vw, 1.125rem);
  font-weight: bold;
  background-color: transparent;
  background-image: none;
  box-shadow: none;
  color: ${({ $projectChrome }) => ($projectChrome ? '#ffffff' : 'inherit')};
  transition: color ${PROJECT_SURFACE_TIMING};
`;

const navItemStyles = css`
  color: inherit;
  text-decoration: none;
  transition: opacity 0.3s ease-in-out;

  &:hover {
    opacity: 0.5;
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
`;

const LeftCluster = styled.div`
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: clamp(0.35rem, 0.22rem + 0.45vw, 0.55rem);
`;

const DateDisplay = styled.time<{ $lightOnDark: boolean }>`
  text-align: left;
  animation: ${fadeIn} 0.5s ease-out both;
  color: ${({ $lightOnDark }) => ($lightOnDark ? '#ffffff' : 'inherit')};
  transition: color ${PROJECT_SURFACE_TIMING};
`;

const LogoLink = styled(Link)`
  position: absolute;
  left: 50%;
  top: var(--header-pad);
  z-index: 1;
  ${navItemStyles}
  text-align: center;
  animation: ${fadeInAbsoluteCenter} 0.5s ease-out both;
  animation-delay: 0.1s;
  display: block;
  width: clamp(140px, 28vw, 252px);
  height: clamp(44px, 10vw, 80px);
`;

const LogoImg = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const MOBILE_MENU_MQ = '(max-width: 48rem)';

const Nav = styled.nav<{ $navLight: boolean }>`
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: clamp(1px, 0.1rem + 0.15vw, 2px);
  line-height: 1.25;
  text-transform: lowercase;
  color: ${({ $navLight }) => ($navLight ? '#ffffff' : 'inherit')};
  transition: color ${PROJECT_SURFACE_TIMING};

  @media ${MOBILE_MENU_MQ} {
    display: none;
  }
`;

/** Same look as footer ListHeading, without its extra margin (nav uses column gap instead). */
const NavSectionHeading = styled(ListHeading)`
  margin-bottom: 0;
`;

const NavLink = styled(Link)`
  ${navItemStyles}
  font-weight: normal;
`;

/** Matches JobsPage narrow stacking breakpoint */
const JOBS_STACK_MQ = '(max-width: 42rem)';

function Header() {
  const { pathname } = useLocation();
  const { data: caseStudies, isLoading, isError } = useGetCaseStudySummaries();
  const jobsBleed = pathname === '/jobs';
  const projectChrome = useProjectChrome();
  const [narrowStack, setNarrowStack] = useState(
    () =>
      typeof window !== 'undefined' && window.matchMedia(JOBS_STACK_MQ).matches
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(JOBS_STACK_MQ);
    const sync = () => setNarrowStack(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  const lightOnDark = jobsBleed || projectChrome;
  const navLight = (jobsBleed && narrowStack) || projectChrome;
  const formattedDate = formatHeaderDate(new Date(), narrowStack);
  const today = new Date().toISOString().slice(0, 10);
  const isContactPage = pathname === '/contact';
  const isJobsPage = pathname === '/jobs';
  const currentProjectSlug = useMemo(() => {
    const match = /^\/projects\/([^/]+)/.exec(pathname);
    return match?.[1];
  }, [pathname]);

  return (
    <Shell $projectChrome={projectChrome} $menuOpen={isMobileMenuOpen}>
      <LeftCluster>
        <DateDisplay dateTime={today} $lightOnDark={lightOnDark}>
          {formattedDate}
        </DateDisplay>
        <HeaderAudioTrack lightOnDark={lightOnDark} />
      </LeftCluster>
      <LogoLink to="/" aria-label="Curly home">
        <LogoImg src={logoSrc} alt="" decoding="async" />
      </LogoLink>
      <RightCluster>
        <Nav aria-label="Main" $navLight={navLight}>
          <StaggerRow $staggerIndex={0} $align="end" $delayOffset={2}>
            <NavSectionHeading>other stuff</NavSectionHeading>
          </StaggerRow>
          <StaggerRow $staggerIndex={1} $align="end" $delayOffset={2}>
            <NavLink to="/contact">contact</NavLink>
          </StaggerRow>
          <StaggerRow $staggerIndex={2} $align="end" $delayOffset={2}>
            <NavLink to="/jobs">jobs</NavLink>
          </StaggerRow>
        </Nav>
        <MobileMenuButton
          type="button"
          aria-expanded={isMobileMenuOpen}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          $open={isMobileMenuOpen}
          $light={jobsBleed || Boolean(currentProjectSlug)}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          <MobileMenuLine $open={isMobileMenuOpen} />
          <MobileMenuLine $open={isMobileMenuOpen} />
        </MobileMenuButton>
      </RightCluster>
      <MobileMenuOverlay
        $open={isMobileMenuOpen}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden={!isMobileMenuOpen}
      >
        <MobileMenuPanel onClick={(event) => event.stopPropagation()}>
          <MobileMenuTop $open={isMobileMenuOpen} $delayMs={0}>
            <StaggerRow $staggerIndex={0} $align="end">
              <NavSectionHeading>other stuff</NavSectionHeading>
            </StaggerRow>
            <StaggerRow $staggerIndex={1} $align="end">
              <MobileNavItem>
                <MobileActiveSquare $active={isContactPage} />
                <MobileNavLink to="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                  contact
                </MobileNavLink>
              </MobileNavItem>
            </StaggerRow>
            <StaggerRow $staggerIndex={2} $align="end">
              <MobileNavItem>
                <MobileActiveSquare $active={isJobsPage} />
                <MobileNavLink to="/jobs" onClick={() => setIsMobileMenuOpen(false)}>
                  jobs
                </MobileNavLink>
              </MobileNavItem>
            </StaggerRow>
          </MobileMenuTop>
          <MobileMenuBottom $open={isMobileMenuOpen} $delayMs={80}>
            <CaseStudiesList
              summaries={caseStudies}
              isLoading={isLoading}
              isError={isError}
              currentSlug={currentProjectSlug}
              onItemClick={() => setIsMobileMenuOpen(false)}
            />
          </MobileMenuBottom>
        </MobileMenuPanel>
      </MobileMenuOverlay>
    </Shell>
  );
}

export default Header;

const RightCluster = styled.div`
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  justify-content: flex-end;
`;

const MobileMenuButton = styled.button<{ $open: boolean; $light: boolean }>`
  display: none;

  @media ${MOBILE_MENU_MQ} {
    display: inline-flex;
    position: relative;
    z-index: 10002;
    width: 2rem;
    height: 2rem;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    padding: 0;
    cursor: pointer;
    color: ${({ $open, $light }) =>
      $open || $light ? '#ffffff' : '#000000'};
    transition: color 0.25s ease;
  }
`;

const MobileMenuLine = styled.span<{ $open: boolean }>`
  position: absolute;
  width: 1.5rem;
  height: 2px;
  border-radius: 1px;
  background: currentColor;
  transition:
    transform 0.25s ease,
    opacity 0.25s ease;

  &:first-child {
    transform: ${({ $open }) =>
      $open ? 'translateY(0) rotate(45deg)' : 'translateY(-0.28rem) rotate(0)'};
  }

  &:last-child {
    transform: ${({ $open }) =>
      $open ? 'translateY(0) rotate(-45deg)' : 'translateY(0.28rem) rotate(0)'};
  }
`;

const MobileMenuOverlay = styled.div<{ $open: boolean }>`
  display: none;

  @media ${MOBILE_MENU_MQ} {
    display: block;
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100dvh;
    z-index: 10001;
    background: rgba(0, 0, 0, 0.9);
    color: #ffffff;
    opacity: ${({ $open }) => ($open ? 1 : 0)};
    visibility: ${({ $open }) => ($open ? 'visible' : 'hidden')};
    pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
    transition:
      opacity 0.3s ease,
      visibility 0.3s ease;
  }
`;

const MobileMenuPanel = styled.div`
  width: 100vw;
  height: 100dvh;
  max-height: 100dvh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
  overflow-y: auto;
  overflow-x: hidden;
  padding: clamp(4.5rem, 4rem + 2.5vw, 6rem) clamp(1.4rem, 1.15rem + 1.3vw, 2.1rem)
    clamp(1.4rem, 1.1rem + 1.3vw, 2.2rem);
`;

const mobileSectionFade = css<{ $open: boolean; $delayMs: number }>`
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transform: translateY(${({ $open }) => ($open ? '0' : '8px')});
  transition:
    opacity 0.28s ease ${({ $delayMs }) => $delayMs}ms,
    transform 0.28s ease ${({ $delayMs }) => $delayMs}ms;
`;

const MobileMenuTop = styled.div<{ $open: boolean; $delayMs: number }>`
  width: min(100%, 38rem);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
  gap: clamp(0.2rem, 0.15rem + 0.35vw, 0.36rem);
  font-size: clamp(0.95rem, 0.9rem + 0.35vw, 1.1rem);
  min-width: 0;
  ${mobileSectionFade}
`;

const MobileMenuBottom = styled.div<{ $open: boolean; $delayMs: number }>`
  margin-top: auto;
  padding-top: clamp(0.9rem, 0.75rem + 0.8vw, 1.4rem);
  width: min(100%, 38rem);
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
  min-width: 0;
  max-height: min(58dvh, 100%);
  overflow-y: auto;
  overflow-x: hidden;
  font-size: clamp(0.95rem, 0.9rem + 0.35vw, 1.1rem);

  & > * {
    max-width: 100%;
  }

  ${mobileSectionFade}
`;

const MobileNavItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.45em;
`;

const MobileActiveSquare = styled.span<{ $active: boolean }>`
  width: 0.375rem;
  height: 0.375rem;
  flex: 0 0 auto;
  background: #ec4899;
  opacity: ${({ $active }) => ($active ? 1 : 0)};
  transition: opacity 0.2s ease;
`;

const MobileNavLink = styled(Link)`
  ${navItemStyles}
  color: inherit;
  font-weight: normal;
`;
