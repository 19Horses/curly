import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { SanityImageSource } from '@sanity/image-url';
import { getApiUrl } from '../sanityIntegration';
import {
  CASE_STUDY_MOBILE_CAROUSEL_IMAGE_WIDTH,
  toCoverImageFields,
} from '../sanityImageUrl';

/** First gallery image only — enough for list / 3D ring without brief, approach, results, video. */
export type CaseStudyCoverImage = {
  alt: string;
  url: string;
  mobileCarouselUrl?: string;
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
    "coverImage": images[0]
  }
`;

const getCaseStudySummaries = async (): Promise<{
  result: CaseStudySummary[];
}> => {
  const response = await axios.get(getApiUrl(query));
  const rows = response.data.result as Array<
    Omit<CaseStudySummary, 'coverImage'> & {
      coverImage: SanityImageSource | null;
    }
  >;
  return {
    result: rows.map((row) => {
      const coverImage = toCoverImageFields(row.coverImage);
      const mobileCarouselImage = toCoverImageFields(
        row.coverImage,
        CASE_STUDY_MOBILE_CAROUSEL_IMAGE_WIDTH
      );
      return {
        ...row,
        coverImage: coverImage
          ? {
              ...coverImage,
              mobileCarouselUrl: mobileCarouselImage?.url ?? coverImage.url,
            }
          : null,
      };
    }),
  };
};

export const useGetCaseStudySummaries = () => {
  return useQuery({
    queryKey: ['caseStudySummaries'],
    queryFn: getCaseStudySummaries,
    select: (res) => res.result,
  });
};
