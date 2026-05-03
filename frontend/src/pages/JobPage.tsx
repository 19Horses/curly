import { useParams } from 'react-router-dom';
import { useGetJob } from '../queries/useGetJob';

function JobPage() {
  const { slug } = useParams();
  const { data, isLoading, isError } = useGetJob(slug);

  if (!slug) {
    return <p>Missing job.</p>;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError || !data) {
    return <p>Job not found.</p>;
  }

  return (
    <article>
      <h1>{data.title}</h1>
      <p>Salary: {data.salary}</p>
      <p>Annual leave: {data.annualLeave}</p>
    </article>
  );
}

export default JobPage;
