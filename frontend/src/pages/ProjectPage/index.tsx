import { useParams } from 'react-router-dom';
import { BlockParagraphs } from '../../sanity/BlockParagraphs';
import { useSurfaceRevealTransition } from '../../hooks/useSurfaceRevealTransition';
import { useGetCaseStudy } from '../../queries/useGetCaseStudy';
import { FadeBox, SectionLabel } from '../JobPage/styles';
import {
  AsideColumn,
  ImagesColumn,
  ProjectCopyRow,
  ProjectGrid,
  ProjectMetaBlock,
  ProjectRoot,
  ProjectTitle,
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
          <ProjectTitle>
            {data.client} — {data.title}
          </ProjectTitle>
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
            <FadeBox $delay={0.08}>
              <ProjectMetaBlock>
                <SectionLabel>Brief</SectionLabel>
                <BlockParagraphs blocks={data.brief} />
              </ProjectMetaBlock>
            </FadeBox>
            <FadeBox $delay={0.14}>
              <ProjectMetaBlock>
                <SectionLabel>Approach</SectionLabel>
                <BlockParagraphs blocks={data.approach} />
              </ProjectMetaBlock>
            </FadeBox>
            <FadeBox $delay={0.2}>
              <ProjectMetaBlock>
                <SectionLabel>Results</SectionLabel>
                <BlockParagraphs blocks={data.results} />
              </ProjectMetaBlock>
            </FadeBox>
          </ProjectCopyRow>
        </ImagesColumn>
        <AsideColumn />
      </ProjectGrid>
    </ProjectRoot>
  );
}

export default ProjectPage;
