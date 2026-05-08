import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { SanityImageSource } from '@sanity/image-url';
import { getApiUrl } from '../sanityIntegration';
import { toCaseStudyImageList } from '../sanityImageUrl';
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
      images[],
      videoLink
    }
  `;
  const response = await axios.get(getApiUrl(query));
  const raw = response.data.result as
    | (Omit<CaseStudyType, 'images'> & { images: SanityImageSource[] })
    | null;
  if (raw == null) return response.data;
  return {
    result: {
      ...raw,
      images: toCaseStudyImageList(raw.images),
    },
  };
};

export const useGetCaseStudy = (slug: string | undefined) => {
  return useQuery({
    queryKey: ['caseStudy', slug],
    queryFn: () => getCaseStudyBySlug(slug as string),
    enabled: Boolean(slug),
    select: (res) => res.result,
  });
};
