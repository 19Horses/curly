import { useQuery } from '@tanstack/react-query';
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
  return useQuery({
    queryKey: ['caseStudy', slug],
    queryFn: () => getCaseStudyBySlug(slug as string),
    enabled: Boolean(slug),
    select: (res) => res.result,
  });
};
