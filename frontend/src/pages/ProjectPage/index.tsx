import { useParams } from 'react-router-dom';
import { BlockParagraphs } from '../../sanity/BlockParagraphs';
import { PROJECT_COPY_FADE_DELAYS_S } from '../../constants/projectPage';
import { useSurfaceRevealTransition } from '../../hooks/useSurfaceRevealTransition';
import { useGetCaseStudy } from '../../queries/useGetCaseStudy';
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
  StaggerImage,
  TitleColumn,
} from './styles';

function ProjectPage() {
  const { slug } = useParams();
  const { data, isLoading, isError } = useGetCaseStudy(slug);
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
        <AsideColumn />
      </ProjectGrid>
    </ProjectRoot>
  );
}

export default ProjectPage;
