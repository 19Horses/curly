import type { ReactNode } from 'react';
import { useGetJobs } from '../../queries/useGetJobs';
import {
  HeroTitle,
  JobLink,
  JobList,
  JobStagger,
  JobsRoot,
  LeftPanel,
  RightPanel,
} from './styles';

function JobsLayout({ right }: { right: ReactNode }) {
  return (
    <JobsRoot>
      <LeftPanel>
        <HeroTitle>work with us</HeroTitle>
      </LeftPanel>
      <RightPanel>{right}</RightPanel>
    </JobsRoot>
  );
}

function JobsPage() {
  const { data, isLoading, isError } = useGetJobs();

  if (isLoading) {
    return <JobsLayout right={<p>Loading…</p>} />;
  }

  if (isError || !data) {
    return <JobsLayout right={<p>Could not load jobs.</p>} />;
  }

  const jobs = data.filter((job) => job.slug);

  return (
    <JobsLayout
      right={
        <JobList>
          {jobs.map((job, staggerIndex) => (
            <li key={job._id}>
              <JobStagger
                $staggerIndex={staggerIndex}
                $delayOffset={2}
                $step={0.1}
              >
                <JobLink to={`/jobs/${job.slug}`}>{job.title}</JobLink>
              </JobStagger>
            </li>
          ))}
        </JobList>
      }
    />
  );
}

export default JobsPage;
