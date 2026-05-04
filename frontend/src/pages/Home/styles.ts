import { Link } from 'react-router-dom';
import { styled, css } from 'styled-components';
import { StaggerRow } from '../../components/StaggerRow';

export const HomeRoot = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
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

export const HomeFooter = styled.footer`
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

export const CaseLink = styled(Link)`
  ${footerLinkStyles}
  overflow-wrap: break-word;
  text-align: right;
`;
