import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { getApiUrl } from '../sanityIntegration';
import type { CaseStudyType } from './useGetCaseStudies';

const getCaseStudyBySlug = async (
  slug: string
): Promise<{ result: CaseStudyType | null }> => {
  const query = `
    *[_type == 'caseStudy' && slug.current == ${JSON.stringify(slug)}][0]{
      _id,
      "slug": slug.current,
      client,
      title,
      brief,
      approach,
      results,
      images[]{
        alt,
        "url": asset->url
      },
      videoLink
    }
  `;
  const response = await axios.get(getApiUrl(query));
  return response.data;
};

export const useGetCaseStudy = (slug: string | undefined) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['caseStudy', slug],
    queryFn: () => getCaseStudyBySlug(slug as string),
    enabled: Boolean(slug),
    initialData: () => {
      if (!slug) return undefined;
      const list = queryClient.getQueryData<CaseStudyType[]>(['caseStudies']);
      if (!list) return undefined;
      const hit = list.find((cs) => cs.slug === slug);
      return hit ? { result: hit } : undefined;
    },
    initialDataUpdatedAt: () =>
      queryClient.getQueryState(['caseStudies'])?.dataUpdatedAt,
    select: (res) => res.result,
  });
};
