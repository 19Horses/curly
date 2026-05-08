import styled from 'styled-components';
import { PROJECT_SURFACE_TIMING } from '../../constants/projectSurface';
import { MetaBlock } from '../JobPage/styles';
import { fadeIn } from '../../styles/animations';

const stackBp = '@media (max-width: 52rem)';

export const ProjectRoot = styled.article<{ $surfaceActive: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding-inline: clamp(0.75rem, 0.4rem + 2.2vw, 2.5rem);
  padding-block: clamp(1rem, 2vw + 0.5rem, 2rem);

  background-color: ${({ $surfaceActive }) =>
    $surfaceActive ? '#000000' : '#ffffff'};
  color: ${({ $surfaceActive }) => ($surfaceActive ? '#ffffff' : '#000000')};
  transition: background-color ${PROJECT_SURFACE_TIMING},
    color ${PROJECT_SURFACE_TIMING};

  p {
    margin: 0;
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
    grid-template-columns: 1fr;
    grid-auto-rows: auto;
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
    justify-content: flex-start;
    min-height: auto;
    padding-block: 0 0.5rem;
  }
`;

export const ProjectTitle = styled.h1`
  margin: 0;
  font-size: clamp(0.9375rem, 1vw + 0.5rem, 1.375rem);
  font-weight: bold;
  line-height: 1.15;
  max-width: 22ch;
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
    max-height: min(70vh, 32rem);
  }
`;

export const AsideColumn = styled.div`
  min-height: 0;
  min-width: 0;
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
    grid-template-columns: 1fr;
  }
`;

export const ProjectMetaBlock = styled(MetaBlock)`
  gap: clamp(0.45rem, 1.15vw, 0.85rem);
  max-width: min(100%, 28ch);
`;

export const StaggerImage = styled.img<{ $index: number }>`
  display: block;
  width: 100%;
  height: auto;
  animation: ${fadeIn} 0.55s ease-out both;
  animation-delay: ${({ $index }) => $index * 0.12}s;
`;
