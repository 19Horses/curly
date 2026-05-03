import { useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { StaggerRow } from '../components/StaggerRow';
import { BlockParagraphs } from '../sanity/BlockParagraphs';
import { fadeIn } from '../styles/animations';
import { useGetJobBySlug } from '../queries/useGetJobs';
import { formatLongDateWithOrdinal } from '../utils/formatLongDateWithOrdinal';

const APPLY_EMAIL = 'hello@curlymedialtd.com';

const accentPink = '#ec4899';

const stackBp = '@media (max-width: 52rem)';

const hideScrollbar = css`
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const JobRoot = styled.article`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  width: 100%;
  box-sizing: border-box;
  /* Match Header Shell horizontal padding */
  padding-inline: clamp(0.75rem, 0.4rem + 2.2vw, 2.5rem);
  padding-top: 0;
  padding-bottom: clamp(0.85rem, 1.5vw + 0.35rem, 1.65rem);
  overflow: hidden;
`;

const TitleRow = styled.div`
  flex: 0 0 auto;
  width: 100%;
  padding-bottom: clamp(1.1rem, 2.5vw, 2rem);
`;

/** Fills viewport below title; does not scroll — middle/right columns scroll inside */
const ColumnsRow = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
  /* Single row fills space below title so middle/right scroll inside, not the page */
  grid-template-rows: minmax(0, 1fr);
  column-gap: clamp(3rem, 9vw, 7.5rem);
  min-height: 0;
  min-width: 0;
  align-items: stretch;

  ${stackBp} {
    grid-template-columns: 1fr;
    grid-template-rows: none;
    row-gap: clamp(1.5rem, 3.5vw, 2.5rem);
  }
`;

const ColLeft = styled.div`
  min-width: 0;
  min-height: 0;
  overflow: hidden;

  ${stackBp} {
    overflow: visible;
  }
`;

const ColMiddle = styled.div`
  min-width: 0;
  min-height: 0;
  max-height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  ${hideScrollbar}

  ${stackBp} {
    max-height: min(45vh, 520px);
  }
`;

const ColRight = styled.div`
  min-width: 0;
  min-height: 0;
  max-height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  ${hideScrollbar}

  ${stackBp} {
    max-height: min(45vh, 520px);
  }
`;

const MiddleInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  text-align: left;
  gap: clamp(1.75rem, 4vw, 3rem);
  width: 100%;
`;

const RightInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(1.35rem, 3vw, 2.25rem);
  width: 100%;
`;

const SectionChunk = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(0.12rem, 0.35vw, 0.28rem);
  width: 100%;
`;

const FadeBox = styled.div<{ $delay?: number }>`
  animation: ${fadeIn} 0.55s ease-out both;
  animation-delay: ${({ $delay = 0 }) => $delay}s;
`;

const JobTitle = styled.h1`
  margin: 0;
  width: 100%;
  font-size: clamp(1.45rem, 3vw + 0.85rem, 2.75rem);
  font-weight: bold;
  line-height: 1.12;
`;

const SectionLabel = styled.h2`
  margin: 0;
  font-size: clamp(0.72rem, 0.65rem + 0.22vw, 0.88rem);
  font-weight: bold;
  line-height: 1.3;
`;

const MetaText = styled.p`
  margin: 0;
  font-size: clamp(0.6875rem, 0.62rem + 0.28vw, 0.9rem);
  line-height: 1.5;
`;

const MetaBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(0.12rem, 0.35vw, 0.28rem);
`;

const RespStack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.38em;
  width: 100%;
`;

const RespStagger = styled(StaggerRow)`
  display: block;
  width: fit-content;
  max-width: 100%;
  align-self: flex-start;
`;

const RespLine = styled.span`
  font-size: clamp(0.6875rem, 0.62rem + 0.28vw, 0.9rem);
  line-height: 1.5;
  text-align: left;
`;

const ApplyCopy = styled.p`
  margin: 0;
  font-size: clamp(0.6875rem, 0.62rem + 0.28vw, 0.9rem);
  line-height: 1.5;
`;

const ApplyEmailLink = styled.a`
  color: ${accentPink};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  &::selection {
    background-color: #000;
    color: ${accentPink};
  }

  &::-moz-selection {
    background-color: #000;
    color: ${accentPink};
  }
`;

const Message = styled.p`
  margin: 0;
  font-weight: bold;
  font-size: clamp(0.75rem, 0.68rem + 0.25vw, 0.95rem);
`;

function JobPage() {
  const { slug } = useParams();
  const { data, isLoading, isError } = useGetJobBySlug(slug);

  if (!slug) {
    return (
      <JobRoot>
        <Message>Missing job.</Message>
      </JobRoot>
    );
  }

  if (isLoading) {
    return (
      <JobRoot>
        <Message>Loading…</Message>
      </JobRoot>
    );
  }

  if (isError || !data) {
    return (
      <JobRoot>
        <Message>Job not found.</Message>
      </JobRoot>
    );
  }

  const deadlineFormatted = formatLongDateWithOrdinal(data.applicationDeadline);

  return (
    <JobRoot>
      <TitleRow>
        <FadeBox $delay={0}>
          <JobTitle>{data.title}</JobTitle>
        </FadeBox>
      </TitleRow>

      <ColumnsRow>
        <ColLeft>
          <SectionChunk>
            <FadeBox $delay={0.06}>
              <SectionLabel>Overview</SectionLabel>
            </FadeBox>
            <FadeBox $delay={0.12}>
              <BlockParagraphs blocks={data.overview} />
            </FadeBox>
          </SectionChunk>
        </ColLeft>

        <ColMiddle>
          <MiddleInner>
            <SectionChunk>
              <FadeBox $delay={0.05}>
                <SectionLabel>Task + Responsibilities</SectionLabel>
              </FadeBox>
              <RespStack>
                {data.responsibilities.map((line, i) => (
                  <RespStagger
                    key={i}
                    $staggerIndex={i}
                    $delayOffset={5}
                    $step={0.06}
                    $align="start"
                  >
                    <RespLine>- {line}</RespLine>
                  </RespStagger>
                ))}
              </RespStack>
            </SectionChunk>

            <FadeBox $delay={0.22}>
              <MetaBlock>
                <SectionLabel>Annual Leave</SectionLabel>
                <MetaText>{data.annualLeave}</MetaText>
              </MetaBlock>
            </FadeBox>

            <FadeBox $delay={0.28}>
              <MetaBlock>
                <SectionLabel>Salary</SectionLabel>
                <MetaText>{data.salary}</MetaText>
              </MetaBlock>
            </FadeBox>
          </MiddleInner>
        </ColMiddle>

        <ColRight>
          <RightInner>
            <SectionChunk>
              <FadeBox $delay={0.06}>
                <SectionLabel>How to Apply</SectionLabel>
              </FadeBox>
              <FadeBox $delay={0.12}>
                <ApplyCopy>
                  Email a cover note and CV to{' '}
                  <ApplyEmailLink href={`mailto:${APPLY_EMAIL}`}>
                    {APPLY_EMAIL}
                  </ApplyEmailLink>{' '}
                  by {deadlineFormatted}.
                </ApplyCopy>
              </FadeBox>
            </SectionChunk>

            <FadeBox $delay={0.22}>
              <MetaBlock>
                <SectionLabel>Details</SectionLabel>
                <BlockParagraphs blocks={data.details} />
              </MetaBlock>
            </FadeBox>
          </RightInner>
        </ColRight>
      </ColumnsRow>
    </JobRoot>
  );
}

export default JobPage;
