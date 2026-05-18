import type { CSSProperties, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import type { CaseStudySummary } from '../queries/useGetCaseStudySummaries';
import {
  MobileCarouselClient,
  MobileCarouselEmpty,
  MobileCarouselFrame,
  MobileCarouselImage,
  MobileCarouselMeta,
  MobileCarouselProject,
  MobileCarouselSlide,
  MobileCarouselStatus,
  MobileCarouselTrack,
  MobileCarouselViewport,
  MobileCarouselWrap,
} from '../pages/Home/styles';

type HomeMobileProjectCarouselProps = {
  caseStudySummaries: CaseStudySummary[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onProjectClick?: (
    e: MouseEvent<HTMLAnchorElement>,
    slug: string,
    caseStudyId: string
  ) => void;
  className?: string;
};

function HomeMobileProjectCarousel({
  caseStudySummaries,
  isLoading,
  isError,
  onProjectClick,
  className,
}: HomeMobileProjectCarouselProps) {
  if (isLoading) {
    return (
      <MobileCarouselWrap className={className}>
        <MobileCarouselStatus>Loading projects…</MobileCarouselStatus>
      </MobileCarouselWrap>
    );
  }

  if (isError) {
    return (
      <MobileCarouselWrap className={className}>
        <MobileCarouselStatus>Could not load projects.</MobileCarouselStatus>
      </MobileCarouselWrap>
    );
  }

  if (!caseStudySummaries || caseStudySummaries.length === 0) {
    return (
      <MobileCarouselWrap className={className}>
        <MobileCarouselEmpty>No projects yet.</MobileCarouselEmpty>
      </MobileCarouselWrap>
    );
  }

  const trackStyle = {
    '--mobile-carousel-count': caseStudySummaries.length,
  } as CSSProperties;

  return (
    <MobileCarouselWrap className={className}>
      <MobileCarouselViewport>
        <MobileCarouselTrack style={trackStyle}>
          {caseStudySummaries.map((study) => (
            <MobileCarouselSlide key={study._id}>
              <MobileCarouselFrame>
                <Link
                  to={`/projects/${study.slug}`}
                  onClick={
                    onProjectClick
                      ? (e) => onProjectClick(e, study.slug, study._id)
                      : undefined
                  }
                >
                  {study.coverImage?.url ? (
                    <MobileCarouselImage
                      src={
                        study.coverImage.mobileCarouselUrl ??
                        study.coverImage.url
                      }
                      alt={
                        study.coverImage.alt ||
                        `${study.client} ${study.title}`.trim()
                      }
                      loading="lazy"
                    />
                  ) : null}
                </Link>
              </MobileCarouselFrame>
              <MobileCarouselMeta>
                <MobileCarouselClient>{study.client}</MobileCarouselClient>
                <MobileCarouselProject>{study.title}</MobileCarouselProject>
              </MobileCarouselMeta>
            </MobileCarouselSlide>
          ))}
        </MobileCarouselTrack>
      </MobileCarouselViewport>
    </MobileCarouselWrap>
  );
}

export default HomeMobileProjectCarousel;
