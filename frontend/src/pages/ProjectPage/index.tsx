import { useState } from 'react';
import { useParams } from 'react-router-dom';
import CaseStudiesList from '../../components/CaseStudiesList';
import { BlockParagraphs } from '../../sanity/BlockParagraphs';
import { PROJECT_COPY_FADE_DELAYS_S } from '../../constants/projectPage';
import { useSurfaceRevealTransition } from '../../hooks/useSurfaceRevealTransition';
import { useGetCaseStudy } from '../../queries/useGetCaseStudy';
import { useGetCaseStudySummaries } from '../../queries/useGetCaseStudySummaries';
import type { CaseStudyType } from '../../queries/useGetCaseStudies';
import { SectionLabel } from '../JobPage/styles';
import {
  AsideColumn,
  ImagesColumn,
  ProjectCopyFade,
  ProjectCopyRow,
  ProjectGrid,
  ProjectMetaBlock,
  ProjectRoot,
  ProjectTitle,
  ProjectTitleFade,
  ProjectVersion2Placeholder,
  ProjectVersionToggle,
  ProjectVersionToggleButton,
  StaggerImage,
  TitleColumn,
} from './styles';

type ProjectLayoutVersion = 'v1' | 'v2';

function ProjectPageVersion1({
  data,
  slug,
  caseStudies,
  caseStudiesLoading,
  caseStudiesError,
}: {
  data: CaseStudyType;
  slug: string;
  caseStudies: ReturnType<typeof useGetCaseStudySummaries>['data'];
  caseStudiesLoading: boolean;
  caseStudiesError: boolean;
}) {
  return (
    <ProjectGrid>
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
      <AsideColumn>
        <CaseStudiesList
          summaries={caseStudies}
          isLoading={caseStudiesLoading}
          isError={caseStudiesError}
          currentSlug={slug}
        />
      </AsideColumn>
    </ProjectGrid>
  );
}

function ProjectPage() {
  const { slug } = useParams();
  const [layoutVersion, setLayoutVersion] =
    useState<ProjectLayoutVersion>('v1');
  const { data, isLoading, isError } = useGetCaseStudy(slug);
  const {
    data: caseStudies,
    isLoading: caseStudiesLoading,
    isError: caseStudiesError,
  } = useGetCaseStudySummaries();
  const surfaceActive = useSurfaceRevealTransition(true, slug ?? '');

  if (!slug) {
    return (
      <ProjectRoot $surfaceActive={surfaceActive}>
        <p>Missing project.</p>
      </ProjectRoot>
    );
  }

  if (isLoading) {
    return (
      <ProjectRoot $surfaceActive={surfaceActive}>
        <p>Loading...</p>
      </ProjectRoot>
    );
  }

  if (isError || !data) {
    return (
      <ProjectRoot $surfaceActive={surfaceActive}>
        <p>Project not found.</p>
      </ProjectRoot>
    );
  }

  return (
    <ProjectRoot $surfaceActive={surfaceActive}>
      <ProjectVersionToggle role="group" aria-label="Project layout version">
        <ProjectVersionToggleButton
          type="button"
          aria-pressed={layoutVersion === 'v1'}
          $active={layoutVersion === 'v1'}
          onClick={() => setLayoutVersion('v1')}
        >
          Version 1
        </ProjectVersionToggleButton>
        <ProjectVersionToggleButton
          type="button"
          aria-pressed={layoutVersion === 'v2'}
          $active={layoutVersion === 'v2'}
          onClick={() => setLayoutVersion('v2')}
        >
          Version 2
        </ProjectVersionToggleButton>
      </ProjectVersionToggle>
      {layoutVersion === 'v1' ? (
        <ProjectPageVersion1
          data={data}
          slug={slug}
          caseStudies={caseStudies}
          caseStudiesLoading={caseStudiesLoading}
          caseStudiesError={caseStudiesError}
        />
      ) : (
        <ProjectVersion2Placeholder>
          <p>Version 2 — alternate layout (preview placeholder).</p>
        </ProjectVersion2Placeholder>
      )}
    </ProjectRoot>
  );
}

export default ProjectPage;
