/**
 * Full case study document shape (detail page). Prefer {@link useGetCaseStudySummaries}
 * for home / listings — it only fetches slug, client, title, and first image.
 */
import type { CaseStudyCoverImage } from './useGetCaseStudySummaries';

export type CaseStudyImage = CaseStudyCoverImage;

export type CaseStudyType = {
  _id: string;
  slug: string;
  client: string;
  title: string;
  brief: unknown[];
  approach: unknown[];
  results: unknown[];
  images: CaseStudyImage[];
  videoPlaybackId: string | null;
  videoAspectRatio: string | null;
};
