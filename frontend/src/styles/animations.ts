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
