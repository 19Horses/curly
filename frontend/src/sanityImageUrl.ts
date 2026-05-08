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

/** Builds a CDN URL with optional Image API transforms. Returns undefined if the source is missing or invalid. */
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
const DETAIL_GALLERY_WIDTH = 1600;

export type CoverImageFields = { alt: string; url: string };

/** Maps a Sanity image field from GROQ to alt + optimized CDN URL for list / home hero. */
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

/** Maps an array of Sanity image fields for case study detail pages. */
export function toCaseStudyImageList(
  images: SanityImageSource[] | null | undefined,
  width: number = DETAIL_GALLERY_WIDTH
): CoverImageFields[] {
  if (!images?.length) return [];
  const out: CoverImageFields[] = [];
  for (const image of images) {
    const mapped = toCoverImageFields(image, width);
    if (mapped) out.push(mapped);
  }
  return out;
}
