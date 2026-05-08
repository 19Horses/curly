import { useParams } from 'react-router-dom';
import { useSurfaceRevealTransition } from '../../hooks/useSurfaceRevealTransition';
import { useGetCaseStudy } from '../../queries/useGetCaseStudy';
import { ProjectRoot } from './styles';

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
      <h1>{data.client} -{data.title}</h1>
    </ProjectRoot>
  );
}

export default ProjectPage;
