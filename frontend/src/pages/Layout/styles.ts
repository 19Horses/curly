import styled from 'styled-components';

export const Root = styled.div<{ $projectBleed?: boolean }>`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: ${({ $projectBleed }) => ($projectBleed ? 'visible' : 'hidden')};
`;

export const Main = styled.main<{ $projectBleed?: boolean }>`
  position: relative;
  z-index: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: ${({ $projectBleed }) => ($projectBleed ? 'visible' : 'hidden')};
`;
