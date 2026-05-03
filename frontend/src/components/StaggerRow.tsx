import { styled } from 'styled-components';
import { fadeIn } from '../styles/animations';

export type StaggerAlign = 'start' | 'end';

export const StaggerRow = styled.span<{
  $staggerIndex: number;
  $delayOffset?: number;
  $step?: number;
  $align?: StaggerAlign;
}>`
  display: block;
  width: fit-content;
  ${({ $align = 'start' }) =>
    $align === 'end' ? 'align-self: flex-end;' : 'align-self: flex-start;'}
  animation: ${fadeIn} 0.5s ease-out both;
  animation-delay: ${({ $staggerIndex, $delayOffset = 0, $step = 0.1 }) =>
    ($delayOffset + $staggerIndex) * $step}s;
`;
