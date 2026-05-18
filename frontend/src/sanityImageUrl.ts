import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url';
import { SANITY_DATASET, SANITY_PROJECT_ID } from './sanityIntegration';

const builder = imageUrlBuilder({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
});

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export function sanityImageUrl(
  source: SanityImageSource | null | undefined,
  options?: { width?: number; height?: number; quality?: number }
): string | undefined {
  if (source == null) return undefined;
  try {
    let chain = urlFor(source);
    if (options?.width != null) chain = chain.width(options.width);
    if (options?.height != null) chain = chain.height(options.height);
    if (options?.quality != null) chain = chain.quality(options.quality);
    return chain.auto('format').url();
  } catch {
    return undefined;
  }
}

const LIST_COVER_WIDTH = 800;
export const CASE_STUDY_MOBILE_CAROUSEL_IMAGE_WIDTH = 1200;

/** Same max width as {@link toCaseStudyImageList} defaults — detail gallery / large in-layout photos. */
export const CASE_STUDY_DETAIL_IMAGE_WIDTH = 1600;

export type CoverImageFields = { alt: string; url: string };

export function toCoverImageFields(
  image: SanityImageSource | null | undefined,
  width: number = LIST_COVER_WIDTH
): CoverImageFields | null {
  const url = sanityImageUrl(image, { width, quality: 85 });
  if (!url) return null;
  const alt =
    image &&
    typeof image === 'object' &&
    'alt' in image &&
    typeof (image as { alt?: string }).alt === 'string'
      ? (image as { alt: string }).alt
      : '';
  return { alt, url };
}

export function toCaseStudyImageList(
  images: SanityImageSource[] | null | undefined,
  width: number = CASE_STUDY_DETAIL_IMAGE_WIDTH
): CoverImageFields[] {
  if (!images?.length) return [];
  const out: CoverImageFields[] = [];
  for (const image of images) {
    const mapped = toCoverImageFields(image, width);
    if (mapped) out.push(mapped);
  }
  return out;
}
