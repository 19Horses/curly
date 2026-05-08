export const SANITY_PROJECT_ID = '7wckvdr0';
export const SANITY_DATASET = 'production';

export const SANITY_URL = `https://${SANITY_PROJECT_ID}.apicdn.sanity.io/v2025-06-01`;

export const getApiUrl = (query: string) =>
  `${SANITY_URL}/data/query/production?query=${encodeURI(query)}`;
