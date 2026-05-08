import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getApiUrl } from '../sanityIntegration';

/** First gallery image only — enough for list / 3D ring without brief, approach, results, video. */
export type CaseStudyCoverImage = {
  alt: string;
  url: string;
};

export type CaseStudySummary = {
  _id: string;
  slug: string;
  client: string;
  title: string;
  coverImage: CaseStudyCoverImage | null;
};

const query = `
  *[_type == 'caseStudy'] | order(_createdAt desc){
    _id,
    "slug": slug.current,
    client,
    title,
    "coverImage": images[0]{
      alt,
      "url": asset->url
    }
  }
`;

const getCaseStudySummaries = async (): Promise<{
  result: CaseStudySummary[];
}> => {
  const response = await axios.get(getApiUrl(query));
  return response.data;
};

export const useGetCaseStudySummaries = () => {
  return useQuery({
    queryKey: ['caseStudySummaries'],
    queryFn: getCaseStudySummaries,
    select: (res) => res.result,
  });
};
