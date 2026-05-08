import { Link } from 'react-router-dom';
import { styled, css } from 'styled-components';
import { StaggerRow } from '../StaggerRow';

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

export const CaseListItem = styled.li<{
  $highlighted?: boolean;
  $current?: boolean;
}>`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 0.45em;

  & > ${StaggerRow} {
    align-self: center;
  }

  &:hover > ${CaseListDot}, &:has(:focus-visible) > ${CaseListDot} {
    opacity: 1;
  }

  ${({ $highlighted }) =>
    $highlighted &&
    css`
      > ${CaseListDot} {
        opacity: 1;
      }
    `}

  ${({ $current }) =>
    $current &&
    css`
      > ${CaseListDot} {
        opacity: 1;
      }
    `}
`;

export const CaseLink = styled(Link)<{
  $syncHover?: boolean;
  $current?: boolean;
}>`
  ${footerLinkStyles}
  overflow-wrap: break-word;
  text-align: right;

  ${({ $syncHover }) =>
    $syncHover &&
    css`
      opacity: 0.5;
    `}

  ${({ $current }) =>
    $current &&
    css`
      opacity: 1;
      cursor: default;

      &:hover {
        opacity: 1;
      }
    `}
`;

export const ListStatusLine = styled.span`
  display: block;
  margin: 0;
  line-height: 1.38;
  overflow-wrap: break-word;
`;
