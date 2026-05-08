import type { MouseEvent } from 'react';
import { StaggerRow } from '../StaggerRow';
import type { CaseStudySummary } from '../../queries/useGetCaseStudySummaries';
import {
  CaseLink,
  CaseList,
  CaseListDot,
  CaseListItem,
  ListHeading,
  ListStatusLine,
} from './styles';

export type CaseStudiesListProps = {
  summaries: CaseStudySummary[] | undefined;
  isLoading: boolean;
  isError: boolean;
  currentSlug?: string;
  highlightedId?: string | null;
  getDotRefCallback?: (id: string) => (el: HTMLSpanElement | null) => void;
  onItemEnter?: (id: string) => void;
  onItemLeave?: () => void;
  onItemClick?: (
    e: MouseEvent<HTMLAnchorElement>,
    slug: string,
    id: string
  ) => void;
};

function CaseStudiesList({
  summaries,
  isLoading,
  isError,
  currentSlug,
  highlightedId,
  getDotRefCallback,
  onItemEnter,
  onItemLeave,
  onItemClick,
}: CaseStudiesListProps) {
  return (
    <>
      <StaggerRow $staggerIndex={0} $align="end">
        <ListHeading>worlds we&apos;ve built</ListHeading>
      </StaggerRow>
      {isLoading && <ListStatusLine>Loading projects…</ListStatusLine>}
      {isError && <ListStatusLine>Could not load projects.</ListStatusLine>}
      {!isLoading &&
        !isError &&
        summaries &&
        summaries.length > 0 && (
          <CaseList>
            {summaries.map((study, index) => {
              const rowHighlighted = highlightedId === study._id;
              const isCurrent = currentSlug === study.slug;
              return (
                <CaseListItem
                  key={study._id}
                  $highlighted={rowHighlighted}
                  $current={isCurrent}
                >
                  <CaseListDot
                    ref={getDotRefCallback?.(study._id)}
                  />
                  <StaggerRow $staggerIndex={index + 1} $align="end">
                    <CaseLink
                      to={`/projects/${study.slug}`}
                      $syncHover={rowHighlighted}
                      $current={isCurrent}
                      onMouseEnter={
                        onItemEnter
                          ? () => onItemEnter(study._id)
                          : undefined
                      }
                      onMouseLeave={onItemLeave}
                      onClick={
                        onItemClick
                          ? (e) => onItemClick(e, study.slug, study._id)
                          : undefined
                      }
                    >
                      {study.client} – {study.title}
                    </CaseLink>
                  </StaggerRow>
                </CaseListItem>
              );
            })}
          </CaseList>
        )}
      {!isLoading && !isError && summaries?.length === 0 && (
        <ListStatusLine>No projects yet.</ListStatusLine>
      )}
    </>
  );
}

export default CaseStudiesList;
