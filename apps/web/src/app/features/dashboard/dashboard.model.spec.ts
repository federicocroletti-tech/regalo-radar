import { describe, expect, it } from 'vitest';

import { DEMO_LISTINGS } from './dashboard.data';
import { filterDashboardListings, getDashboardMetrics } from './dashboard.model';

describe('dashboard demo data', () => {
  it('derives the dashboard counters from listing states and priority', () => {
    expect(getDashboardMetrics(DEMO_LISTINGS)).toEqual({
      newCount: 2,
      highPriorityCount: 2,
      openedCount: 1,
      ignoredCount: 1,
    });
  });

  it('filters examples by state without changing the source collection', () => {
    expect(filterDashboardListings(DEMO_LISTINGS, 'NEW').map((item) => item.id)).toEqual([
      'demo-1',
      'demo-2',
    ]);
    expect(filterDashboardListings(DEMO_LISTINGS, 'ALL')).toBe(DEMO_LISTINGS);
    expect(DEMO_LISTINGS).toHaveLength(4);
  });
});
