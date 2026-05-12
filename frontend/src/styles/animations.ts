import { keyframes } from 'styled-components';

export const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const fadeInAbsoluteCenter = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, 5px);
  }

  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
`;

export const muxDockRevealFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-1.25rem);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const fadeInOpacity = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;
