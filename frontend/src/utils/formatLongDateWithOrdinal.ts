/** Matches Sanity `jobs.ts` preview formatting for application deadlines. */
export function formatLongDateWithOrdinal(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map((v) => Number(v));
  if (!y || !m || !d) return isoDate;

  const date = new Date(Date.UTC(y, m - 1, d));

  const suffix =
    d % 100 >= 11 && d % 100 <= 13
      ? 'th'
      : d % 10 === 1
        ? 'st'
        : d % 10 === 2
          ? 'nd'
          : d % 10 === 3
            ? 'rd'
            : 'th';

  const monthYear = new Intl.DateTimeFormat('en-GB', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);

  return `${d}${suffix} ${monthYear}`;
}
