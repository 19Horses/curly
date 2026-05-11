import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getCaseStudyBySlug } from '../queries/useGetCaseStudy';
import type { CaseStudySummary } from '../queries/useGetCaseStudySummaries';
import { getContact } from '../queries/useGetContact';
import { getJobs } from '../queries/useGetJobs';
import { getJobsImage } from '../queries/useGetJobsImage';
import { getSong } from '../queries/useGetSong';

export function usePrefetchData(
  caseStudySummaries: CaseStudySummary[] | undefined
): void {
  const queryClient = useQueryClient();

  useEffect(() => {
    void queryClient.prefetchQuery({
      queryKey: ['jobs'],
      queryFn: getJobs,
    });
    void queryClient.prefetchQuery({
      queryKey: ['jobsImage'],
      queryFn: getJobsImage,
    });
    void queryClient.prefetchQuery({
      queryKey: ['contact'],
      queryFn: getContact,
    });
    void queryClient.prefetchQuery({
      queryKey: ['song'],
      queryFn: getSong,
    });
  }, [queryClient]);

  useEffect(() => {
    if (!caseStudySummaries?.length) return;
    for (const study of caseStudySummaries) {
      if (!study.slug) continue;
      void queryClient.prefetchQuery({
        queryKey: ['caseStudy', study.slug],
        queryFn: () => getCaseStudyBySlug(study.slug),
      });
    }
  }, [queryClient, caseStudySummaries]);
}
