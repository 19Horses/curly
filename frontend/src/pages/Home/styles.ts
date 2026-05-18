import { motion } from 'motion/react';
import { styled } from 'styled-components';
import { StaggerRow } from '../../components/StaggerRow';

export const HOME_MOBILE_MQ = '(max-width: 48rem)';

export const HomeRoot = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
`;

export const HomeUiStack = styled.div`
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  pointer-events: none;

  & > * {
    pointer-events: auto;
  }
`;

export const SplashChrome = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  pointer-events: none;
`;

export const EnterButton = styled.button`
  margin-top: auto;
  align-self: center;
  margin-bottom: clamp(1rem, 3.5vh, 1.75rem);
  padding: 0;
  font: inherit;
  font-size: clamp(0.8125rem, 1.75vw, 0.9375rem);
  font-weight: 400;
  letter-spacing: 0.03em;
  color: #111111;
  background: none;
  border: none;
  border-radius: 0;
  box-shadow: none;
  appearance: none;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 0.3em;
  pointer-events: auto;

  &:hover {
    color: #000000;
  }

  &:focus-visible {
    outline: 2px solid #ec4899;
    outline-offset: 4px;
  }
`;

export const HomeFooter = styled(motion.footer)`
  margin-top: auto;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: flex-end;
  gap: clamp(0.75rem, 2vw + 0.25rem, 2rem);
  padding: clamp(0.75rem, 0.4rem + 2.2vw, 2.5rem);
  font-size: clamp(0.8125rem, 0.72rem + 0.45vw, 1.125rem);

  @media ${HOME_MOBILE_MQ} {
    width: 100%;
    align-items: flex-start;
  }
`;

export const FooterLeft = styled.div`
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: clamp(0.25em, 0.15em + 0.6vw, 0.35em);

  @media ${HOME_MOBILE_MQ} {
    width: 100%;
    flex: 1 1 100%;
  }
`;

export const FooterLeftStagger = styled(StaggerRow)`
  width: 100%;
`;

export const FooterLine = styled.span`
  display: block;
  margin: 0;
  line-height: 1.38;
  overflow-wrap: break-word;
`;

export const FooterRight = styled.div`
  flex: 0 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: clamp(0.25em, 0.15em + 0.6vw, 0.35em);
  text-align: right;

  @media ${HOME_MOBILE_MQ} {
    display: none;
  }
`;

export const MobileCarouselWrap = styled.section`
  display: none;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  margin-top: auto;
  padding: 0;
  overflow-x: hidden;

  @media ${HOME_MOBILE_MQ} {
    display: block;
    padding: clamp(0.75rem, 3vw, 1rem) clamp(0.75rem, 0.4rem + 2.2vw, 2.5rem)
      clamp(0.5rem, 2vh, 1rem);
  }
`;

export const MobileCarouselStatus = styled.p`
  margin: 0;
  font-size: 0.875rem;
`;

export const MobileCarouselEmpty = styled.p`
  margin: 0;
  font-size: 0.875rem;
`;

export const MobileCarouselViewport = styled.div`
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;

  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const MobileCarouselTrack = styled.div`
  display: flex;
  width: calc(var(--mobile-carousel-count, 1) * 100%);
`;

export const MobileCarouselSlide = styled.article`
  flex: 0 0 calc(100% / var(--mobile-carousel-count, 1));
  box-sizing: border-box;
  min-width: 0;
  scroll-snap-align: start;
  scroll-snap-stop: always;

  &:not(:last-child) {
    padding-right: clamp(0.55rem, 2vw, 0.9rem);
  }
`;

export const MobileCarouselFrame = styled.div`
  width: 100%;
  border-radius: 0.375rem;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.86);
`;

export const MobileCarouselImage = styled.img`
  display: block;
  width: 100%;
  height: min(63vh, 34rem);
  object-fit: cover;
`;

export const MobileCarouselMeta = styled.div`
  padding-top: 0.55rem;
`;

export const MobileCarouselClient = styled.p`
  margin: 0;
  font-size: 0.76rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.84;
`;

export const MobileCarouselProject = styled.p`
  margin: 0.15rem 0 0;
  font-size: 1rem;
  line-height: 1.3;
`;
