import { useParams } from 'react-router-dom';
import { useGetCaseStudy } from '../../queries/useGetCaseStudy';

function ProjectPage() {
  const { slug } = useParams();
  const { data, isLoading, isError } = useGetCaseStudy(slug);

  if (!slug) {
    return <p>Missing project.</p>;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError || !data) {
    return <p>Project not found.</p>;
  }

  return (
    <article>
      <h1>{data.title}</h1>
      <p>{data.client}</p>
    </article>
  );
}

export default ProjectPage;
