import { useParams } from 'react-router-dom';
import { BlockParagraphs } from '../../sanity/BlockParagraphs';
import { useGetJobBySlug } from '../../queries/useGetJobs';
import { formatLongDateWithOrdinal } from '../../utils/formatLongDateWithOrdinal';
import {
  APPLY_EMAIL,
  ApplyCopy,
  ApplyEmailLink,
  ColLeft,
  ColumnsRow,
  FadeBox,
  JobRoot,
  JobTitle,
  Message,
  MetaBlock,
  MetaText,
  MiddleInner,
  MidRightGrid,
  MidRightScroll,
  RespLine,
  RespStack,
  RespStagger,
  RightInner,
  SectionChunk,
  SectionLabel,
  TitleRow,
} from './styles';

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

        <MidRightScroll>
          <MidRightGrid>
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
          </MidRightGrid>
        </MidRightScroll>
      </ColumnsRow>
    </JobRoot>
  );
}

export default JobPage;
