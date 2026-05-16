import { motion } from 'motion/react';
import { styled } from 'styled-components';
import { StaggerRow } from '../../components/StaggerRow';

const HOME_MOBILE_MQ = '(max-width: 48rem)';

export const HomeRoot = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
`;

/** Bottom-left layout toggle — aligned with site chrome padding */
export const HomeVersionToggle = styled.div`
  position: absolute;
  bottom: clamp(0.5rem, 1.25vw, 1rem);
  left: clamp(0.75rem, 0.4rem + 2.2vw, 2.5rem);
  z-index: 60;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
`;

export const HomeVersionToggleButton = styled.button<{ $active: boolean }>`
  margin: 0;
  padding: 0.35em 0.65em;
  font: inherit;
  font-size: clamp(0.6875rem, 0.62rem + 0.28vw, 0.8125rem);
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: inherit;
  background: transparent;
  border: 1px solid currentColor;
  border-radius: 2px;
  opacity: ${({ $active }) => ($active ? 1 : 0.72)};
  cursor: pointer;
  appearance: none;

  &:hover {
    opacity: 1;
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
`;

export const HomeUiStack = styled.div`
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  pointer-events: none;

  & > * {
    pointer-events: auto;
  }
`;

export const SplashChrome = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  pointer-events: none;
`;

export const EnterButton = styled.button`
  margin-top: auto;
  align-self: center;
  margin-bottom: clamp(1rem, 3.5vh, 1.75rem);
  padding: 0;
  font: inherit;
  font-size: clamp(0.8125rem, 1.75vw, 0.9375rem);
  font-weight: 400;
  letter-spacing: 0.03em;
  color: #111111;
  background: none;
  border: none;
  border-radius: 0;
  box-shadow: none;
  appearance: none;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 0.3em;
  pointer-events: auto;

  &:hover {
    color: #000000;
  }

  &:focus-visible {
    outline: 2px solid #ec4899;
    outline-offset: 4px;
  }
`;

export const HomeFooter = styled(motion.footer)`
  margin-top: auto;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: flex-end;
  gap: clamp(0.75rem, 2vw + 0.25rem, 2rem);
  padding: clamp(0.75rem, 0.4rem + 2.2vw, 2.5rem);
  font-size: clamp(0.8125rem, 0.72rem + 0.45vw, 1.125rem);

  @media ${HOME_MOBILE_MQ} {
    width: 100%;
    align-items: flex-start;
  }
`;

export const FooterLeft = styled.div`
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: clamp(0.25em, 0.15em + 0.6vw, 0.35em);

  @media ${HOME_MOBILE_MQ} {
    width: 100%;
    flex: 1 1 100%;
  }
`;

export const FooterLeftStagger = styled(StaggerRow)`
  width: 100%;
`;

export const FooterLine = styled.span`
  display: block;
  margin: 0;
  line-height: 1.38;
  overflow-wrap: break-word;
`;

export const FooterRight = styled.div`
  flex: 0 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: clamp(0.25em, 0.15em + 0.6vw, 0.35em);
  text-align: right;

  @media ${HOME_MOBILE_MQ} {
    display: none;
  }
`;
