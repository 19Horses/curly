import type { ReactNode } from 'react';
import { useGetJobs } from '../../queries/useGetJobs';
import { useGetJobsImage } from '../../queries/useGetJobsImage';
import type { JobsImageType } from '../../queries/useGetJobsImage';
import {
  HeroTitle,
  JobLink,
  JobList,
  JobStagger,
  JobsHeroImage,
  JobsHeroMedia,
  JobsHeroScrim,
  JobsHeroVisual,
  JobsRoot,
  LeftPanel,
  LeftPanelSurface,
  RightPanel,
} from './styles';

function JobsLayout({
  right,
  heroImage,
}: {
  right: ReactNode;
  heroImage?: JobsImageType | null;
}) {
  const showPlaceholder = !heroImage?.url;

  return (
    <JobsRoot>
      <LeftPanel $showPlaceholder={showPlaceholder}>
        {heroImage?.url ? (
          <JobsHeroVisual>
            <JobsHeroMedia>
              <JobsHeroImage
                src={heroImage.url}
                alt={heroImage.alt}
                decoding="async"
                fetchPriority="high"
              />
            </JobsHeroMedia>
            <JobsHeroScrim />
          </JobsHeroVisual>
        ) : null}
        <LeftPanelSurface>
          <HeroTitle>work with us</HeroTitle>
        </LeftPanelSurface>
      </LeftPanel>
      <RightPanel>{right}</RightPanel>
    </JobsRoot>
  );
}

function JobsPage() {
  const { data: jobsImage } = useGetJobsImage();
  const { data, isLoading, isError } = useGetJobs();

  if (isLoading) {
    return <JobsLayout heroImage={jobsImage} right={<p>Loading…</p>} />;
  }

  if (isError || !data) {
    return (
      <JobsLayout heroImage={jobsImage} right={<p>Could not load jobs.</p>} />
    );
  }

  const jobs = data.filter((job) => job.slug);

  return (
    <JobsLayout
      heroImage={jobsImage}
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
