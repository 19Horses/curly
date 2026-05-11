import { motion } from 'motion/react';
import styled from 'styled-components';
import {
  PROJECT_CONTENT_FADE_DURATION_S,
  PROJECT_CONTENT_STAGGER_STEP_S,
  PROJECT_IMAGE_BASE_DELAY_S,
  PROJECT_TITLE_FADE_DELAY_S,
} from '../../constants/projectPage';
import { PROJECT_SURFACE_TIMING } from '../../constants/projectSurface';
import { MetaBlock } from '../JobPage/styles';
import { fadeIn } from '../../styles/animations';

const stackBp = '@media (max-width: 52rem)';

/** Occupies grid cols 1–2; wraps AnimatePresence so exit/enter nodes stay in one cell */
export const ProjectMainSlot = styled.div`
  grid-column: 1 / 3;
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;

  ${stackBp} {
    grid-column: auto;
    flex: 0 1 auto;
    width: 100%;
    min-height: min-content;
  }
`;

/** Title + images column pair for each route key */
export const ProjectPageTransition = styled(motion.div)`
  flex: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
  gap: clamp(0.75rem, 2vw, 1.5rem);
  min-height: 0;
  min-width: 0;
  align-items: stretch;

  ${stackBp} {
    display: flex;
    flex-direction: column;
    flex: 0 1 auto;
    width: 100%;
    min-height: min-content;
    gap: clamp(1.25rem, 4vw, 2rem);
  }
`;

/** Loading / error / missing copy spans both main columns */
export const ProjectMainMessage = styled.div`
  grid-column: 1 / -1;
`;

export const ProjectRoot = styled.article<{ $surfaceActive: boolean }>`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding-inline: clamp(0.75rem, 0.4rem + 2.2vw, 2.5rem);
  padding-block: clamp(1rem, 2vw + 0.5rem, 2rem);

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

/** Same easing as Job {@link FadeBox}, longer duration for project copy blocks */
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
  grid-column: 3;
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

export const ProjectMetaBlock = styled(MetaBlock)`
  gap: clamp(0.45rem, 1.15vw, 0.85rem);
  max-width: min(100%, 28ch);

  ${stackBp} {
    max-width: none;
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
