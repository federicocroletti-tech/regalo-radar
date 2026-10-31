import { signal } from '@angular/core';

import type {
  DashboardListing,
  ListingSource,
  ListingStatus,
} from '../../features/dashboard/dashboard.model';
import { normalizeListingUrl } from '../../features/dashboard/dashboard.model';
import { listingsDatabase } from './listings.database';

export interface NewListing {
  readonly title: string;
  readonly category: string;
  readonly location: string;
  readonly excerpt: string;
  readonly url: string;
  readonly source: ListingSource;
}

export class ListingsRepository {
  readonly listings = signal<readonly DashboardListing[]>([]);
  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);
  readonly lastUpdatedAt = signal(new Date());

  private readonly changes =
    typeof window === 'undefined' || typeof BroadcastChannel === 'undefined'
      ? null
      : new BroadcastChannel('regalo-radar-listings');

  constructor() {
    this.changes?.addEventListener('message', () => void this.refresh());
    void this.refresh();
  }

  async refresh(): Promise<void> {
    this.isLoading.set(true);
    try {
      const listings = await listingsDatabase.listings.toArray();
      listings.sort((first, second) => second.receivedAt.getTime() - first.receivedAt.getTime());
      this.listings.set(listings.map(toDashboardListing));
      this.error.set(null);
      this.lastUpdatedAt.set(new Date());
    } catch (error) {
      this.error.set('Non riesco a leggere gli annunci salvati su questo dispositivo.');
      console.error('Unable to load saved listings.', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  async add(input: NewListing): Promise<'created' | 'merged'> {
    const title = input.title.trim();
    if (!title) {
      throw new Error('Inserisci un titolo per la segnalazione.');
    }
    const url = normalizeListingUrl(input.url);
    const receivedAt = new Date();
    const source = {
      source: input.source,
      capturedAt: receivedAt,
      url,
    } as const;
    const urlKey = url;

    const result = await listingsDatabase.transaction('rw', listingsDatabase.listings, async () => {
      if (urlKey) {
        const existing = await listingsDatabase.listings.where('urlKey').equals(urlKey).first();
        if (existing?.id !== undefined) {
          await listingsDatabase.listings.update(existing.id, {
            sources: [...existing.sources, source],
            updatedAt: receivedAt,
          });
          return 'merged' as const;
        }
      }

      await listingsDatabase.listings.add({
        title,
        category: input.category.trim() || 'Altro',
        location: input.location.trim(),
        excerpt: input.excerpt.trim(),
        url,
        urlKey,
        sources: [source],
        receivedAt,
        updatedAt: receivedAt,
        status: 'NEW',
      });
      return 'created' as const;
    });

    await this.changed();
    return result;
  }

  async updateStatus(id: number, status: ListingStatus): Promise<void> {
    const updated = await listingsDatabase.listings.update(id, {
      status,
      updatedAt: new Date(),
    });
    if (!updated) {
      throw new Error('La segnalazione non esiste più.');
    }
    await this.changed();
  }

  async remove(id: number): Promise<void> {
    await listingsDatabase.listings.delete(id);
    await this.changed();
  }

  async exportAll(): Promise<readonly DashboardListing[]> {
    const records = await listingsDatabase.listings.toArray();
    return records
      .map(toDashboardListing)
      .sort((first, second) => second.receivedAt.getTime() - first.receivedAt.getTime());
  }

  private async changed(): Promise<void> {
    await this.refresh();
    this.changes?.postMessage({ type: 'listings-updated' });
  }
}

function toDashboardListing(
  record: Omit<DashboardListing, 'id'> & { readonly id?: number },
): DashboardListing {
  if (record.id === undefined) {
    throw new Error('Una segnalazione salvata non ha un identificativo valido.');
  }
  return { ...record, id: record.id };
}
