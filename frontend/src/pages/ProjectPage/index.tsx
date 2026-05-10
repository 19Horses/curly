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
  ProjectVersion2BlockWrap,
  ProjectVersion2MetaBlock,
  ProjectRoot,
  ProjectTitle,
  ProjectTitleFade,
  ProjectVersion2CaseStudiesDock,
  ProjectVersion2CopyRow,
  ProjectVersion2CopySection,
  ProjectVersion2Scroll,
  ProjectVersion2Shell,
  ProjectVersion2Slide,
  ProjectVersion2SlideImage,
  ProjectVersion2Title,
  ProjectVersion2TitleOverlay,
  ProjectVersion2SectionLabel,
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

function ProjectPageVersion2({
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
    <ProjectVersion2Shell>
      <ProjectVersion2Scroll>
        {data.images.map((image, index) => (
          <ProjectVersion2Slide key={`${image.url}-${index}`}>
            <ProjectVersion2SlideImage
              src={image.url}
              alt={image.alt}
              $index={index}
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
            {index === 0 ? (
              <ProjectVersion2TitleOverlay>
                <ProjectVersion2Title>
                  {data.client} — {data.title}
                </ProjectVersion2Title>
              </ProjectVersion2TitleOverlay>
            ) : null}
          </ProjectVersion2Slide>
        ))}
        <ProjectVersion2CopySection>
          <ProjectVersion2CopyRow>
            <ProjectCopyFade $delay={PROJECT_COPY_FADE_DELAYS_S[0]}>
              <ProjectVersion2MetaBlock>
                <ProjectVersion2SectionLabel>Brief</ProjectVersion2SectionLabel>
                <ProjectVersion2BlockWrap>
                  <BlockParagraphs blocks={data.brief} />
                </ProjectVersion2BlockWrap>
              </ProjectVersion2MetaBlock>
            </ProjectCopyFade>
            <ProjectCopyFade $delay={PROJECT_COPY_FADE_DELAYS_S[1]}>
              <ProjectVersion2MetaBlock>
                <ProjectVersion2SectionLabel>
                  Approach
                </ProjectVersion2SectionLabel>
                <ProjectVersion2BlockWrap>
                  <BlockParagraphs blocks={data.approach} />
                </ProjectVersion2BlockWrap>
              </ProjectVersion2MetaBlock>
            </ProjectCopyFade>
            <ProjectCopyFade $delay={PROJECT_COPY_FADE_DELAYS_S[2]}>
              <ProjectVersion2MetaBlock>
                <ProjectVersion2SectionLabel>
                  Results
                </ProjectVersion2SectionLabel>
                <ProjectVersion2BlockWrap>
                  <BlockParagraphs blocks={data.results} />
                </ProjectVersion2BlockWrap>
              </ProjectVersion2MetaBlock>
            </ProjectCopyFade>
          </ProjectVersion2CopyRow>
        </ProjectVersion2CopySection>
      </ProjectVersion2Scroll>
      <ProjectVersion2CaseStudiesDock>
        <CaseStudiesList
          summaries={caseStudies}
          isLoading={caseStudiesLoading}
          isError={caseStudiesError}
          currentSlug={slug}
        />
      </ProjectVersion2CaseStudiesDock>
    </ProjectVersion2Shell>
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
    <ProjectRoot
      $surfaceActive={surfaceActive}
      $layoutV2={layoutVersion === 'v2'}
    >
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
        <ProjectPageVersion2
          data={data}
          slug={slug}
          caseStudies={caseStudies}
          caseStudiesLoading={caseStudiesLoading}
          caseStudiesError={caseStudiesError}
        />
      )}
    </ProjectRoot>
  );
}

export default ProjectPage;
