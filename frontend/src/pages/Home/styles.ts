import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { styled, css } from 'styled-components';
import { StaggerRow } from '../../components/StaggerRow';

export const HomeRoot = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
`;

/** Stacks splash chrome or footer above the fixed canvas */
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

/** Full-area layer for Enter only (canvas stays fullscreen underneath) */
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

export const footerLinkStyles = css`
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
`;

export const FooterLeft = styled.div`
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: clamp(0.25em, 0.15em + 0.6vw, 0.35em);
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
`;

export const ListHeading = styled.span`
  display: inline-block;
  font-weight: bold;
  text-transform: lowercase;
  margin-bottom: clamp(0.45em, 0.3em + 0.8vw, 0.7em);
`;

export const CaseList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: clamp(0.15em, 0.08em + 0.45vw, 0.25em);
`;

/** Pink anchor — kept measurable for list ↔ ring connector line */
export const CaseListDot = styled.span`
  flex-shrink: 0;
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 0;
  background: #ec4899;
  opacity: 0;
  transition: opacity 0.2s ease;
`;

export const CaseListItem = styled.li<{ $highlighted?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 0.45em;

  & > ${StaggerRow} {
    align-self: center;
  }

  &:hover > ${CaseListDot},
  &:has(:focus-visible) > ${CaseListDot} {
    opacity: 1;
  }

  ${({ $highlighted }) =>
    $highlighted &&
    css`
      > ${CaseListDot} {
        opacity: 1;
      }
    `}
`;

export const CaseLink = styled(Link)<{ $syncHover?: boolean }>`
  ${footerLinkStyles}
  overflow-wrap: break-word;
  text-align: right;

  ${({ $syncHover }) =>
    $syncHover &&
    css`
      opacity: 0.5;
    `}
`;
