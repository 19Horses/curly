import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getApiUrl } from '../sanityIntegration';

export type CaseStudyImage = {
  alt: string;
  url: string;
};

export type CaseStudyType = {
  _id: string;
  slug: string;
  client: string;
  title: string;
  brief: unknown[];
  approach: unknown[];
  results: unknown[];
  images: CaseStudyImage[];
  videoLink: string;
};

const query = `
  *[_type == 'caseStudy'] | order(_createdAt desc){
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

const getCaseStudies = async (): Promise<{ result: CaseStudyType[] }> => {
  const response = await axios.get(getApiUrl(query));
  return response.data;
};

export const useGetCaseStudies = () => {
  return useQuery({
    queryKey: ['caseStudies'],
    queryFn: getCaseStudies,
    select: (res) => res.result,
  });
};
