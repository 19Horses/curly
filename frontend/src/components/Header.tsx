import { Link } from 'react-router-dom';
import { styled, css } from 'styled-components';
import { StaggerRow } from './StaggerRow';
import { fadeIn } from '../styles/animations';

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
    date,
  );
  const month = new Intl.DateTimeFormat('en-GB', { month: 'long' }).format(date);
  const year = date.getFullYear();
  const day = ordinalDay(date.getDate());
  return `${weekday} ${day} ${month} ${year}`;
}

const Shell = styled.header`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: start;
  gap: clamp(0.5rem, 0.35rem + 0.8vw, 1rem);
  padding: clamp(0.75rem, 0.4rem + 2.2vw, 2.5rem);
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

const DateDisplay = styled.time`
  justify-self: start;
  text-align: left;
  animation: ${fadeIn} 0.5s ease-out both;
`;

const LogoRow = styled.span`
  text-align: center;
  animation: ${fadeIn} 0.5s ease-out both;
  animation-delay: 0.1s;
`;

const LogoLink = styled(Link)`
  ${navItemStyles}
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: clamp(1px, 0.1rem + 0.15vw, 2px);
  justify-self: end;
  line-height: 1.25;
  text-transform: lowercase;
`;

const NavLink = styled(Link)`
  ${navItemStyles}
`;

const NavPlaceholder = styled.span`
  ${navItemStyles}
  cursor: default;
`;

function Header() {
  const formattedDate = formatHeaderDate(new Date());
  const today = new Date().toISOString().slice(0, 10);

  return (
    <Shell>
      <DateDisplay dateTime={today}>{formattedDate}</DateDisplay>
      <LogoRow>
        <LogoLink to="/">Curly</LogoLink>
      </LogoRow>
      <Nav aria-label="Main">
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
