import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { StaggerRow } from '../components/StaggerRow';
import { fadeIn } from '../styles/animations';
import { useGetJobs } from '../queries/useGetJobs';

const narrowScreen = '@media (max-width: 42rem)';

const hideScrollbar = css`
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const JobsRoot = styled.div`
  --jobs-stack-hero: clamp(17rem, 56vh, 34rem);
  --jobs-header-clearance: clamp(4.25rem, 3.25rem + 3.5vw, 7rem);

  flex: 1;
  display: flex;
  flex-direction: row;
  min-height: 0;
  width: 100%;
  position: relative;

  ${narrowScreen} {
    flex-direction: column;
  }
`;

/** Fixed under header (z-index 0) so it reads full-bleed behind the bar */
const LeftPanel = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 50vw;
  height: 100vh;
  height: 100dvh;
  z-index: 0;
  background: #2a2a2a;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1rem, 3vw, 2rem);
  box-sizing: border-box;

  ${narrowScreen} {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: var(--jobs-stack-hero);
    z-index: 0;
  }
`;

const HeroTitle = styled.h1`
  margin: 0;
  max-width: 13ch;
  font-size: clamp(2.5rem, 5.5vw + 1.5rem, 6.75rem);
  font-weight: bold;
  line-height: 1.05;
  text-align: center;
  text-transform: lowercase;
  color: #f5f5f5;
  animation: ${fadeIn} 0.6s ease-out both;
`;

/** Shrink to title text so hit area / cursor match the words */
const JobStagger = styled(StaggerRow).attrs({ $align: 'start' })`
  display: block;
  width: fit-content;
  max-width: 100%;
`;

const RightPanel = styled.div`
  flex: 1 1 0;
  min-width: 0;
  min-height: 0;
  margin-left: 50vw;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  ${hideScrollbar}

  ${narrowScreen} {
    margin-left: 0;
    flex: 1;
    padding-top: max(
      0px,
      calc(var(--jobs-stack-hero) - var(--jobs-header-clearance))
    );
  }
`;

const JobList = styled.ul`
  list-style: none;
  margin: 0;
  padding-block: clamp(1.25rem, 2vw + 0.5rem, 2.75rem);
  padding-inline: clamp(2rem, 5vw + 1.25rem, 5rem);
  display: flex;
  flex-direction: column;
  gap: clamp(1.5rem, 3vw + 0.5rem, 3rem);
`;

const jobLinkStyles = css`
  display: inline-block;
  width: fit-content;
  max-width: 100%;
  color: inherit;
  text-decoration: none;
  font-size: clamp(1.5rem, 2.75vw + 1rem, 3rem);
  font-weight: bold;
  transition: opacity 0.3s ease-in-out;

  &:hover {
    opacity: 0.5;
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
`;

const JobLink = styled(Link)`
  ${jobLinkStyles}
`;

function JobsLayout({
  right,
}: {
  right: ReactNode;
}) {
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
    return (
      <JobsLayout right={<p>Loading…</p>} />
    );
  }

  if (isError || !data) {
    return (
      <JobsLayout right={<p>Could not load jobs.</p>} />
    );
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
