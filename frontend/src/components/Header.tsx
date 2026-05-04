import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { styled, css } from 'styled-components';
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

function formatHeaderDate(date: Date): string {
  const weekday = new Intl.DateTimeFormat('en-GB', { weekday: 'short' }).format(
    date
  );
  const month = new Intl.DateTimeFormat('en-GB', { month: 'long' }).format(
    date
  );
  const year = date.getFullYear();
  const day = ordinalDay(date.getDate());
  return `${weekday} ${day} ${month} ${year}`;
}

const Shell = styled.header`
  position: relative;
  z-index: 2;
  --header-pad: clamp(0.75rem, 0.4rem + 2.2vw, 2.5rem);
  padding: var(--header-pad);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  gap: clamp(0.5rem, 0.35rem + 0.8vw, 1rem);
  font-size: clamp(0.8125rem, 0.72rem + 0.45vw, 1.125rem);
  font-weight: bold;
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

const DateDisplay = styled.time<{ $jobsBleed: boolean }>`
  text-align: left;
  animation: ${fadeIn} 0.5s ease-out both;
  color: ${({ $jobsBleed }) => ($jobsBleed ? '#fff' : 'inherit')};
  transition: color 0.4s ease;
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
`;

const Nav = styled.nav<{ $jobsLight: boolean }>`
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: clamp(1px, 0.1rem + 0.15vw, 2px);
  line-height: 1.25;
  text-transform: lowercase;
  color: ${({ $jobsLight }) => ($jobsLight ? '#fff' : 'inherit')};
  transition: color 0.4s ease;
`;

const NavLink = styled(Link)`
  ${navItemStyles}
`;

const NavPlaceholder = styled.span`
  ${navItemStyles}
  cursor: default;
`;

/** Matches JobsPage narrow stacking breakpoint */
const JOBS_STACK_MQ = '(max-width: 42rem)';

function Header() {
  const { pathname } = useLocation();
  const jobsBleed = pathname === '/jobs';
  const [narrowStack, setNarrowStack] = useState(
    () =>
      typeof window !== 'undefined' && window.matchMedia(JOBS_STACK_MQ).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(JOBS_STACK_MQ);
    const sync = () => setNarrowStack(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const jobsNavLight = jobsBleed && narrowStack;
  const formattedDate = formatHeaderDate(new Date());
  const today = new Date().toISOString().slice(0, 10);

  return (
    <Shell>
      <LeftCluster>
        <DateDisplay dateTime={today} $jobsBleed={jobsBleed}>
          {formattedDate}
        </DateDisplay>
        <HeaderAudioTrack jobsBleed={jobsBleed} />
      </LeftCluster>
      <LogoLink to="/">Curly</LogoLink>
      <Nav aria-label="Main" $jobsLight={jobsNavLight}>
        <StaggerRow $staggerIndex={0} $align="end" $delayOffset={2}>
          <NavPlaceholder>other stuff</NavPlaceholder>
        </StaggerRow>
        <StaggerRow $staggerIndex={1} $align="end" $delayOffset={2}>
          <NavLink to="/contact">contact</NavLink>
        </StaggerRow>
        <StaggerRow $staggerIndex={2} $align="end" $delayOffset={2}>
          <NavLink to="/jobs">jobs</NavLink>
        </StaggerRow>
      </Nav>
    </Shell>
  );
}

export default Header;
