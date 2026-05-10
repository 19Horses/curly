import styled from 'styled-components';
import {
  PROJECT_CONTENT_FADE_DURATION_S,
  PROJECT_CONTENT_STAGGER_STEP_S,
  PROJECT_IMAGE_BASE_DELAY_S,
  PROJECT_TITLE_FADE_DELAY_S,
} from '../../constants/projectPage';
import { SITE_HEADER_HEIGHT_VAR } from '../../constants/siteHeader';
import { PROJECT_SURFACE_TIMING } from '../../constants/projectSurface';
import { MetaBlock, SectionLabel } from '../JobPage/styles';
import { fadeIn } from '../../styles/animations';

const stackBp = '@media (max-width: 52rem)';

export const PROJECT_PAGE_PAD_INLINE = 'clamp(0.75rem, 0.4rem + 2.2vw, 2.5rem)';
export const PROJECT_PAGE_PAD_BLOCK = 'clamp(1rem, 2vw + 0.5rem, 2rem)';

export const ProjectRoot = styled.article<{
  $surfaceActive: boolean;
  $layoutV2?: boolean;
}>`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding-inline: ${({ $layoutV2 }) =>
    $layoutV2 ? '0' : PROJECT_PAGE_PAD_INLINE};
  padding-block: ${({ $layoutV2 }) =>
    $layoutV2 ? '0' : PROJECT_PAGE_PAD_BLOCK};

  background-color: transparent;
  color: ${({ $surfaceActive }) => ($surfaceActive ? '#ffffff' : '#000000')};
  transition: color ${PROJECT_SURFACE_TIMING};

  p {
    margin: 0;
  }

  ${stackBp} {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
`;

export const ProjectVersionToggle = styled.div`
  position: absolute;
  bottom: clamp(0.5rem, 1.25vw, 1rem);
  left: ${PROJECT_PAGE_PAD_INLINE};
  z-index: 20;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
`;

export const ProjectVersionToggleButton = styled.button<{ $active: boolean }>`
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

export const ProjectVersion2Shell = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: calc(
    -1 * var(${SITE_HEADER_HEIGHT_VAR}, 8rem) - env(safe-area-inset-top, 0px)
  );
  display: flex;
  flex-direction: column;
  min-height: 0;
  z-index: 0;
`;

export const ProjectVersion2Scroll = styled.div`
  flex: 1;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  display: flex;
  flex-direction: column;

  ${stackBp} {
    flex: 0 1 auto;
    overflow-y: visible;
    min-height: min-content;
  }
`;

export const ProjectVersion2Slide = styled.div`
  position: relative;
  width: 100%;
  height: 100svh;
  min-height: 100svh;
  flex-shrink: 0;
`;

export const ProjectVersion2CaseStudiesDock = styled.div`
  position: absolute;
  bottom: clamp(0.5rem, 1vw, 1rem);
  right: ${PROJECT_PAGE_PAD_INLINE};
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  max-width: min(92vw, 28ch);
  font-size: clamp(0.8125rem, 0.72rem + 0.45vw, 1.125rem);
  pointer-events: none;

  & > * {
    pointer-events: auto;
  }

  ${stackBp} {
    display: none;
  }
`;

export const ProjectVersion2Title = styled.h1`
  margin: 0;
  font-size: clamp(1.35rem, 2.4vw + 0.8rem, 2.85rem);
  font-weight: bold;
  line-height: 1.1;
  max-width: 100%;
  min-width: 0;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.65), 0 0 36px rgba(0, 0, 0, 0.45);
`;

export const ProjectVersion2CopySection = styled.div`
  flex: 0 0 auto;
  width: 100%;
  box-sizing: border-box;
  padding-inline: ${PROJECT_PAGE_PAD_INLINE};
  padding-block-start: clamp(1.25rem, 3vw, 2rem);
  padding-block-end: clamp(0.25rem, 1vw, 0.75rem);
`;

export const ProjectGrid = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 2fr) minmax(0, 1fr);
  gap: clamp(0.75rem, 2vw, 1.5rem);
  min-height: 0;
  min-width: 0;
  width: 100%;
  align-items: stretch;

  ${stackBp} {
    display: flex;
    flex-direction: column;
    flex: 0 1 auto;
    min-height: min-content;
    gap: clamp(1.25rem, 4vw, 2rem);
  }
`;

export const TitleColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  min-height: 0;
  min-width: 0;
  padding-inline: clamp(0.125rem, 0.5vw, 0.5rem);

  ${stackBp} {
    flex: 0 0 auto;
    justify-content: flex-start;
    min-height: auto;
    padding-inline: 0;
    padding-block: 0;
  }
`;

export const ProjectTitleFade = styled.div`
  animation: ${fadeIn} ${PROJECT_CONTENT_FADE_DURATION_S}s ease-out both;
  animation-delay: ${PROJECT_TITLE_FADE_DELAY_S}s;
`;

export const ProjectVersion2TitleOverlay = styled(ProjectTitleFade)`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  z-index: 2;
  pointer-events: none;
  padding-inline: ${PROJECT_PAGE_PAD_INLINE};
  box-sizing: border-box;
`;

export const ProjectTitle = styled.h1`
  margin: 0;
  font-size: clamp(0.9375rem, 1vw + 0.5rem, 1.375rem);
  font-weight: bold;
  line-height: 1.15;
  max-width: 22ch;

  ${stackBp} {
    max-width: none;
  }
`;

export const ProjectCopyFade = styled.div<{ $delay: number }>`
  animation: ${fadeIn} ${PROJECT_CONTENT_FADE_DURATION_S}s ease-out both;
  animation-delay: ${({ $delay }) => $delay}s;
`;

export const ImagesColumn = styled.div`
  min-height: 0;
  min-width: 0;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  display: flex;
  flex-direction: column;
  gap: 0;

  ${stackBp} {
    flex: 0 1 auto;
    min-height: 0;
    overflow-x: hidden;
    overflow-y: visible;
    max-height: none;
  }
`;

export const AsideColumn = styled.div`
  min-height: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  padding-block-end: clamp(0.5rem, 1vw, 1rem);
  font-size: clamp(0.8125rem, 0.72rem + 0.45vw, 1.125rem);

  ${stackBp} {
    display: none;
  }
`;

export const ProjectCopyRow = styled.div`
  flex: 0 0 auto;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: clamp(0.75rem, 2.25vw, 1.5rem);
  row-gap: clamp(1.25rem, 3vw, 2rem);
  width: 100%;
  padding-top: clamp(1.25rem, 3vw, 2rem);
  align-items: start;

  ${stackBp} {
    display: flex;
    flex-direction: column;
    gap: clamp(1.25rem, 3vw, 2rem);
    padding-top: clamp(0.75rem, 2vw, 1.25rem);
  }
`;

/** V2 copy sits in {@link ProjectVersion2CopySection} which supplies top spacing */
export const ProjectVersion2CopyRow = styled(ProjectCopyRow)`
  padding-top: 0;

  ${stackBp} {
    padding-top: 0;
  }
`;

export const ProjectMetaBlock = styled(MetaBlock)`
  gap: clamp(0.45rem, 1.15vw, 0.85rem);
  max-width: min(100%, 28ch);

  ${stackBp} {
    max-width: none;
  }
`;

export const ProjectVersion2SectionLabel = styled(SectionLabel)`
  font-size: clamp(0.76rem, 0.68rem + 0.28vw, 0.88rem);
  text-align: left;
  width: 100%;
`;

export const ProjectVersion2MetaBlock = styled(ProjectMetaBlock)`
  align-items: flex-start;
  text-align: left;
  width: 100%;
  max-width: min(100%, 28ch);
  gap: clamp(0.45rem, 1.15vw, 0.85rem);

  ${stackBp} {
    max-width: none;
    align-items: flex-start;
  }
`;

export const ProjectVersion2BlockWrap = styled.div`
  width: 100%;

  & p {
    font-size: clamp(0.78rem, 0.7rem + 0.32vw, 0.92rem);
    line-height: 1.5;
  }
`;

export const StaggerImage = styled.img<{ $index: number }>`
  display: block;
  width: 100%;
  height: auto;
  animation: ${fadeIn} ${PROJECT_CONTENT_FADE_DURATION_S}s ease-out both;
  animation-delay: ${({ $index }) =>
    PROJECT_IMAGE_BASE_DELAY_S + $index * PROJECT_CONTENT_STAGGER_STEP_S}s;
`;

/** Full-viewport slide image — extends {@link StaggerImage} (must follow its declaration). */
export const ProjectVersion2SlideImage = styled(StaggerImage)`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
