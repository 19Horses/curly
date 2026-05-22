import { keyframes, styled } from 'styled-components';

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const SpinnerFrame = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 16rem;
`;

const SpinnerRing = styled.div`
  width: clamp(2.5rem, 5vw, 4rem);
  height: clamp(2.5rem, 5vw, 4rem);
  border: 0.35rem solid rgba(255, 105, 180, 0.22);
  border-top-color: #ff69b4;
  border-radius: 50%;
  animation: ${spin} 1.4s linear infinite;
`;

type LoadingSpinnerProps = {
  label?: string;
};

export function LoadingSpinner({ label = 'Loading' }: LoadingSpinnerProps) {
  return (
    <SpinnerFrame role="status" aria-label={label}>
      <SpinnerRing aria-hidden="true" />
    </SpinnerFrame>
  );
}
