import type { SanityImageSource } from '@sanity/image-url';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  CASE_STUDY_DETAIL_IMAGE_WIDTH,
  toCoverImageFields,
} from '../sanityImageUrl';
import { getApiUrl } from '../sanityIntegration';

/** Matches the Jobs image singleton id in Studio (`documentId('jobsImage')`). */
export const JOBS_IMAGE_SINGLETON_ID = 'jobsImage';

export type JobsImageType = {
  _id: string;
  url: string;
  alt: string;
};

const query = `
  *[_type == "jobsImage" && _id == ${JSON.stringify(
    JOBS_IMAGE_SINGLETON_ID
  )}][0]{
    _id,
    image
  }
`;

export const getJobsImage = async (): Promise<{
  result: { _id: string; image?: SanityImageSource } | null;
}> => {
  const response = await axios.get(getApiUrl(query));
  return response.data;
};

export const useGetJobsImage = () => {
  return useQuery({
    queryKey: ['jobsImage'],
    queryFn: getJobsImage,
    select: (res) => {
      const doc = res.result;
      if (!doc?.image) return null;
      const cover = toCoverImageFields(
        doc.image,
        CASE_STUDY_DETAIL_IMAGE_WIDTH
      );
      if (!cover) return null;
      return {
        _id: doc._id,
        url: cover.url,
        alt: cover.alt,
      } satisfies JobsImageType;
    },
  });
};
