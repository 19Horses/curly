import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { getApiUrl } from '../sanityIntegration';
import type { JobType } from './useGetJobs';

const getJobBySlug = async (
  slug: string
): Promise<{ result: JobType | null }> => {
  const query = `
    *[_type == 'job' && slug.current == ${JSON.stringify(slug)}][0]{
      _id,
      "slug": slug.current,
      title,
      overview,
      responsibilities,
      annualLeave,
      salary,
      details,
      applicationDeadline
    }
  `;
  const response = await axios.get(getApiUrl(query));
  return response.data;
};

export const useGetJob = (slug: string | undefined) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['job', slug],
    queryFn: () => getJobBySlug(slug as string),
    enabled: Boolean(slug),
    initialData: () => {
      if (!slug) return undefined;
      const list = queryClient.getQueryData<JobType[]>(['jobs']);
      if (!list) return undefined;
      const hit = list.find((job) => job.slug === slug);
      return hit ? { result: hit } : undefined;
    },
    initialDataUpdatedAt: () =>
      queryClient.getQueryState(['jobs'])?.dataUpdatedAt,
    select: (res) => res.result,
  });
};
