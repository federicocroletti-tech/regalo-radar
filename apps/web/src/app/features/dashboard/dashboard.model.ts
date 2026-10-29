export type ListingStatus = 'NEW' | 'NOTIFIED' | 'OPENED' | 'INTERESTED' | 'IGNORED';

export interface DashboardListing {
  readonly id: string;
  readonly title: string;
  readonly category: string;
  readonly location: string;
  readonly receivedLabel: string;
  readonly priorityScore: number;
  readonly status: ListingStatus;
}

export interface DashboardMetrics {
  readonly newCount: number;
  readonly highPriorityCount: number;
  readonly openedCount: number;
  readonly ignoredCount: number;
}

export type DashboardFilter = 'ALL' | 'NEW' | 'OPENED' | 'IGNORED';

export function getDashboardMetrics(
  listings: readonly DashboardListing[],
  priorityThreshold = 75,
): DashboardMetrics {
  return {
    newCount: listings.filter((listing) => listing.status === 'NEW').length,
    highPriorityCount: listings.filter((listing) => listing.priorityScore >= priorityThreshold)
      .length,
    openedCount: listings.filter((listing) => listing.status === 'OPENED').length,
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
