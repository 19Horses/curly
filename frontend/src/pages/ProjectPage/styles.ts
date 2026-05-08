import styled from 'styled-components';
import { PROJECT_SURFACE_TIMING } from '../../constants/projectSurface';

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
  color: ${({ $surfaceActive }) =>
    $surfaceActive ? '#ffffff' : '#000000'};
  transition:
    background-color ${PROJECT_SURFACE_TIMING},
    color ${PROJECT_SURFACE_TIMING};

  h1,
  p {
    margin: 0;
  }

  h1:not(:last-child),
  p:not(:last-child) {
    margin-bottom: 0.75rem;
  }
`;
