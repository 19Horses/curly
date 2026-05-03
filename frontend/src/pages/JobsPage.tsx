import { Link } from 'react-router-dom';
import { useGetJobs } from '../queries/useGetJobs';

function JobsPage() {
  const { data, isLoading, isError } = useGetJobs();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError || !data) {
    return <p>Could not load jobs.</p>;
  }

  return (
    <section>
      <h1>Jobs</h1>
      <ul>
        {data
          .filter((job) => job.slug)
          .map((job) => (
            <li key={job._id}>
              <Link to={`/jobs/${job.slug}`}>{job.title}</Link>
            </li>
          ))}
      </ul>
    </section>
  );
}

export default JobsPage;
