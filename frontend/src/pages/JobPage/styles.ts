import { styled, css } from 'styled-components';
import { StaggerRow } from '../../components/StaggerRow';
import { fadeIn } from '../../styles/animations';

export const APPLY_EMAIL = 'hello@curlymedialtd.com';

export const accentPink = '#ec4899';

export const stackBp = '@media (max-width: 52rem)';

export const thinPinkScrollbar = css`
  scrollbar-width: thin;
  scrollbar-color: ${accentPink} transparent;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${accentPink};
    border-radius: 0;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #db2777;
  }
`;

export const JobRoot = styled.article`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
  max-height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding-inline: clamp(0.75rem, 0.4rem + 2.2vw, 2.5rem);
  padding-top: 0;
  padding-bottom: clamp(0.85rem, 1.5vw + 0.35rem, 1.65rem);
  overflow: hidden;
`;

export const TitleRow = styled.div`
  flex: 0 0 auto;
  width: 100%;
  padding-bottom: clamp(1.1rem, 2.5vw, 2rem);
`;

export const ColumnsRow = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
  grid-template-rows: minmax(0, 1fr);
  column-gap: clamp(3rem, 9vw, 7.5rem);
  min-height: 0;
  min-width: 0;
  align-items: stretch;

  ${stackBp} {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    gap: clamp(1.75rem, 4vw, 2.75rem);
  }
`;

export const ColLeft = styled.div`
  min-width: 0;
  min-height: 0;
  overflow: hidden;

  ${stackBp} {
    flex: 0 0 auto;
    overflow: hidden;
  }
`;

export const MidRightScroll = styled.div`
  min-width: 0;
  min-height: 0;
  max-height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  ${thinPinkScrollbar}

  ${stackBp} {
    flex: 1 1 0%;
    min-height: 0;
    max-height: none;
  }
`;

export const MidRightGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  column-gap: clamp(3rem, 9vw, 7.5rem);
  align-items: start;
  min-width: 0;

  ${stackBp} {
    grid-template-columns: 1fr;
    gap: clamp(1.75rem, 4vw, 2.75rem);
  }
`;

export const MiddleInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  text-align: left;
  gap: clamp(1.75rem, 4vw, 3rem);
  width: 100%;
`;

export const RightInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(1.35rem, 3vw, 2.25rem);
  width: 100%;
`;

export const SectionChunk = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(0.12rem, 0.35vw, 0.28rem);
  width: 100%;
`;

export const FadeBox = styled.div<{ $delay?: number }>`
  animation: ${fadeIn} 0.55s ease-out both;
  animation-delay: ${({ $delay = 0 }) => $delay}s;
`;

export const JobTitle = styled.h1`
  margin: 0;
  width: 100%;
  font-size: clamp(1.45rem, 3vw + 0.85rem, 2.75rem);
  font-weight: bold;
  line-height: 1.12;
`;

export const SectionLabel = styled.h2`
  margin: 0;
  font-size: clamp(0.72rem, 0.65rem + 0.22vw, 0.88rem);
  font-weight: bold;
  line-height: 1.3;
`;

export const MetaText = styled.p`
  margin: 0;
  font-size: clamp(0.6875rem, 0.62rem + 0.28vw, 0.9rem);
  line-height: 1.5;
`;

export const MetaBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(0.12rem, 0.35vw, 0.28rem);
`;

export const RespStack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.38em;
  width: 100%;
`;

export const RespStagger = styled(StaggerRow)`
  display: block;
  width: fit-content;
  max-width: 100%;
  align-self: flex-start;
`;

export const RespLine = styled.span`
  font-size: clamp(0.6875rem, 0.62rem + 0.28vw, 0.9rem);
  line-height: 1.5;
  text-align: left;
`;

export const ApplyCopy = styled.p`
  margin: 0;
  font-size: clamp(0.6875rem, 0.62rem + 0.28vw, 0.9rem);
  line-height: 1.5;
`;

export const ApplyEmailLink = styled.a`
  color: ${accentPink};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  &::selection {
    background-color: #000;
    color: ${accentPink};
  }

  &::-moz-selection {
    background-color: #000;
    color: ${accentPink};
  }
`;

export const Message = styled.p`
  margin: 0;
  font-weight: bold;
  font-size: clamp(0.75rem, 0.68rem + 0.25vw, 0.95rem);
`;
