import { describe, expect, it } from 'vitest';

import {
  filterDashboardListings,
  getDashboardMetrics,
  normalizeListingUrl,
  searchDashboardListings,
} from './dashboard.model';
import type { DashboardListing, ListingStatus } from './dashboard.model';

function listing(id: number, status: ListingStatus, title = `Annuncio ${id}`): DashboardListing {
  const timestamp = new Date('2026-10-29T12:00:00.000Z');
  return {
    id,
    title,
    category: 'Casa',
    location: 'Milano',
    excerpt: 'Tavolo in legno',
    url: '',
    urlKey: '',
    sources: [],
    receivedAt: timestamp,
    updatedAt: timestamp,
    status,
  };
}

describe('dashboard listing models', () => {
  const listings = [
    listing(1, 'NEW', 'Tavolo gratuito'),
    listing(2, 'INTERESTED'),
    listing(3, 'OPENED'),
    listing(4, 'IGNORED'),
  ];

  it('derives counters from persisted listing states', () => {
    expect(getDashboardMetrics(listings)).toEqual({
      totalCount: 4,
      activeCount: 3,
      newCount: 1,
      interestedCount: 1,
      ignoredCount: 1,
    });
  });

  it('filters by state without changing the source collection', () => {
    expect(filterDashboardListings(listings, 'NEW').map((item) => item.id)).toEqual([1]);
    expect(filterDashboardListings(listings, 'ALL')).toBe(listings);
    expect(listings).toHaveLength(4);
  });

  it('searches user-provided listing fields without case sensitivity', () => {
    expect(searchDashboardListings(listings, '  MILANO ').map((item) => item.id)).toEqual([
      1, 2, 3, 4,
    ]);
    expect(searchDashboardListings(listings, 'gratuito').map((item) => item.id)).toEqual([1]);
  });

  it('normalizes links for duplicate detection and preserves meaningful query parameters', () => {
    expect(
      normalizeListingUrl('HTTPS://WWW.Esempio.it/annuncio/?utm_source=feed&id=8#details'),
    ).toBe('https://esempio.it/annuncio?id=8');
    expect(normalizeListingUrl('')).toBe('');
  });

  it('rejects malformed or non-web links', () => {
    expect(() => normalizeListingUrl('http://')).toThrow('Inserisci un link valido');
    expect(() => normalizeListingUrl('ftp://esempio.it/annuncio')).toThrow(
      'Il link deve iniziare con http:// o https://',
    );
  });
});
