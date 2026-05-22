import { AnimatePresence } from 'motion/react';
import { useParams } from 'react-router-dom';
import CaseStudiesList from '../../components/CaseStudiesList';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { BlockParagraphs } from '../../sanity/BlockParagraphs';
import {
  PROJECT_COPY_FADE_DELAYS_S,
  PROJECT_PAGE_ROUTE_TRANSITION_S,
} from '../../constants/projectPage';
import { useSurfaceRevealTransition } from '../../hooks/useSurfaceRevealTransition';
import { useGetCaseStudy } from '../../queries/useGetCaseStudy';
import { useGetCaseStudySummaries } from '../../queries/useGetCaseStudySummaries';
import { SectionLabel } from '../JobPage/styles';
import {
  AsideColumn,
  ImagesColumn,
  ProjectCopyFade,
  ProjectCopyRow,
  ProjectGrid,
  ProjectMainMessage,
  ProjectMainSlot,
  ProjectMetaBlock,
  ProjectPageTransition,
  ProjectRoot,
  ProjectTitle,
  ProjectTitleFade,
  StaggerImage,
  TitleColumn,
} from './styles';

function ProjectPage() {
  const { slug } = useParams();
  const { data, isLoading, isError } = useGetCaseStudy(slug);
  const {
    data: caseStudies,
    isLoading: caseStudiesLoading,
    isError: caseStudiesError,
  } = useGetCaseStudySummaries();
  const surfaceActive = useSurfaceRevealTransition(true, slug ?? '');
  const routeKey = slug ?? '__missing__';

  if (!slug) {
    return (
      <ProjectRoot $surfaceActive={surfaceActive}>
        <ProjectGrid>
          <ProjectMainSlot>
            <AnimatePresence mode="wait">
              <ProjectPageTransition
                key={routeKey}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{
                  duration: PROJECT_PAGE_ROUTE_TRANSITION_S,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <ProjectMainMessage>
                  <p>Missing project.</p>
                </ProjectMainMessage>
              </ProjectPageTransition>
            </AnimatePresence>
          </ProjectMainSlot>
          <AsideColumn>
            <CaseStudiesList
              summaries={caseStudies}
              isLoading={caseStudiesLoading}
              isError={caseStudiesError}
              currentSlug={slug}
            />
          </AsideColumn>
        </ProjectGrid>
      </ProjectRoot>
    );
  }

  if (isLoading) {
    return (
      <ProjectRoot $surfaceActive={surfaceActive}>
        <ProjectGrid>
          <ProjectMainSlot>
            <AnimatePresence mode="wait">
              <ProjectPageTransition
                key={routeKey}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{
                  duration: PROJECT_PAGE_ROUTE_TRANSITION_S,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <ProjectMainMessage $absoluteCenter>
                  <LoadingSpinner />
                </ProjectMainMessage>
              </ProjectPageTransition>
            </AnimatePresence>
          </ProjectMainSlot>
        </ProjectGrid>
      </ProjectRoot>
    );
  }

  if (isError || !data) {
    return (
      <ProjectRoot $surfaceActive={surfaceActive}>
        <ProjectGrid>
          <ProjectMainSlot>
            <AnimatePresence mode="wait">
              <ProjectPageTransition
                key={routeKey}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{
                  duration: PROJECT_PAGE_ROUTE_TRANSITION_S,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <ProjectMainMessage>
                  <p>Project not found.</p>
                </ProjectMainMessage>
              </ProjectPageTransition>
            </AnimatePresence>
          </ProjectMainSlot>
          <AsideColumn>
            <CaseStudiesList
              summaries={caseStudies}
              isLoading={caseStudiesLoading}
              isError={caseStudiesError}
              currentSlug={slug}
            />
          </AsideColumn>
        </ProjectGrid>
      </ProjectRoot>
    );
  }

  return (
    <ProjectRoot $surfaceActive={surfaceActive}>
      <ProjectGrid>
        <ProjectMainSlot>
          <AnimatePresence mode="wait">
            <ProjectPageTransition
              key={routeKey}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{
                duration: PROJECT_PAGE_ROUTE_TRANSITION_S,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <TitleColumn>
                <ProjectTitleFade>
                  <ProjectTitle>
                    {data.client} — {data.title}
                  </ProjectTitle>
                </ProjectTitleFade>
              </TitleColumn>
              <ImagesColumn>
                {data.images.map((image, index) => (
                  <StaggerImage
                    key={`${image.url}-${index}`}
                    src={image.url}
                    alt={image.alt}
                    $index={index}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                ))}
                <ProjectCopyRow>
                  <ProjectCopyFade $delay={PROJECT_COPY_FADE_DELAYS_S[0]}>
                    <ProjectMetaBlock>
                      <SectionLabel>Brief</SectionLabel>
                      <BlockParagraphs blocks={data.brief} />
                    </ProjectMetaBlock>
                  </ProjectCopyFade>
                  <ProjectCopyFade $delay={PROJECT_COPY_FADE_DELAYS_S[1]}>
                    <ProjectMetaBlock>
                      <SectionLabel>Approach</SectionLabel>
                      <BlockParagraphs blocks={data.approach} />
                    </ProjectMetaBlock>
                  </ProjectCopyFade>
                  <ProjectCopyFade $delay={PROJECT_COPY_FADE_DELAYS_S[2]}>
                    <ProjectMetaBlock>
                      <SectionLabel>Results</SectionLabel>
                      <BlockParagraphs blocks={data.results} />
                    </ProjectMetaBlock>
                  </ProjectCopyFade>
                </ProjectCopyRow>
              </ImagesColumn>
            </ProjectPageTransition>
          </AnimatePresence>
        </ProjectMainSlot>
        <AsideColumn>
          <CaseStudiesList
            summaries={caseStudies}
            isLoading={caseStudiesLoading}
            isError={caseStudiesError}
            currentSlug={slug}
          />
        </AsideColumn>
      </ProjectGrid>
    </ProjectRoot>
  );
}

export default ProjectPage;
