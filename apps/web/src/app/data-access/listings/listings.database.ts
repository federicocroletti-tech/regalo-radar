import Dexie, { type Table } from 'dexie';

import type { DashboardListing } from '../../features/dashboard/dashboard.model';

export type ListingRecord = Omit<DashboardListing, 'id'> & { id?: number };

export class ListingsDatabase extends Dexie {
  listings!: Table<ListingRecord, number>;

  constructor() {
    super('RegaloRadar');
    this.version(1).stores({
      listings: '++id, status, category, receivedAt, urlKey',
    });
  }
}

export const listingsDatabase = new ListingsDatabase();
