export type ListingStatus = 'NEW' | 'OPENED' | 'INTERESTED' | 'IGNORED';
export type ListingSource = 'manual' | 'shared';

export interface DashboardListing {
  readonly id: number;
  readonly title: string;
  readonly category: string;
  readonly location: string;
  readonly excerpt: string;
  readonly url: string;
  readonly urlKey: string;
  readonly sources: readonly {
    readonly source: ListingSource;
    readonly capturedAt: Date;
    readonly url: string;
  }[];
  readonly receivedAt: Date;
  readonly updatedAt: Date;
  readonly status: ListingStatus;
}

export interface DashboardMetrics {
  readonly totalCount: number;
  readonly activeCount: number;
  readonly newCount: number;
  readonly interestedCount: number;
  readonly ignoredCount: number;
}

export type DashboardFilter = 'ALL' | ListingStatus;

export function getDashboardMetrics(listings: readonly DashboardListing[]): DashboardMetrics {
  return {
    totalCount: listings.length,
    activeCount: listings.filter((listing) => listing.status !== 'IGNORED').length,
    newCount: listings.filter((listing) => listing.status === 'NEW').length,
    interestedCount: listings.filter((listing) => listing.status === 'INTERESTED').length,
    ignoredCount: listings.filter((listing) => listing.status === 'IGNORED').length,
  };
}

export function filterDashboardListings(
  listings: readonly DashboardListing[],
  filter: DashboardFilter,
): readonly DashboardListing[] {
  if (filter === 'ALL') {
    return listings;
  }
  return listings.filter((listing) => listing.status === filter);
}

export function searchDashboardListings(
  listings: readonly DashboardListing[],
  query: string,
): readonly DashboardListing[] {
  const normalizedQuery = query.trim().toLocaleLowerCase('it');
  if (!normalizedQuery) {
    return listings;
  }

  return listings.filter((listing) =>
    [listing.title, listing.category, listing.location, listing.excerpt, listing.url]
      .join(' ')
      .toLocaleLowerCase('it')
      .includes(normalizedQuery),
  );
}

export function normalizeListingUrl(value: string): string {
  const input = value.trim();
  if (!input) {
    return '';
  }
  if (input.length > 2048) {
    throw new Error('Il link non può superare 2048 caratteri.');
  }

  const withProtocol = /^[a-z][a-z\d+.-]*:\/\//i.test(input) ? input : `https://${input}`;
  let url: URL;
  try {
    url = new URL(withProtocol);
  } catch {
    throw new Error('Inserisci un link valido, ad esempio https://esempio.it/annuncio.');
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('Il link deve iniziare con http:// o https://.');
  }

  url.hostname = url.hostname.toLocaleLowerCase('en-US').replace(/^www\./, '');
  url.hash = '';
  for (const key of [...url.searchParams.keys()]) {
    if (/^(utm_.+|fbclid|gclid|dclid|mc_cid|mc_eid)$/i.test(key)) {
      url.searchParams.delete(key);
    }
  }
  if (url.pathname !== '/') {
    url.pathname = url.pathname.replace(/\/+$/, '');
  }
  return url.toString();
}

export function isListingStatus(value: string): value is ListingStatus {
  return ['NEW', 'OPENED', 'INTERESTED', 'IGNORED'].includes(value);
}
