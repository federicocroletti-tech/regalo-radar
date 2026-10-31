import 'fake-indexeddb/auto';

import { beforeEach, describe, expect, it } from 'vitest';

import { listingsDatabase } from './listings.database';
import { ListingsRepository } from './listings.repository';

describe('ListingsRepository', () => {
  let repository: ListingsRepository;

  beforeEach(async () => {
    await listingsDatabase.listings.clear();
    repository = new ListingsRepository();
    await repository.refresh();
  });

  it('persists user-submitted listings and records their source and capture time', async () => {
    const result = await repository.add({
      title: 'Tavolo da ritirare',
      category: 'Casa',
      location: 'Milano',
      excerpt: 'Ritiro entro sera',
      url: 'https://www.example.it/post/1?utm_source=share',
      source: 'shared',
    });

    expect(result).toBe('created');
    expect(repository.listings()).toHaveLength(1);
    expect(repository.listings()[0]).toMatchObject({
      title: 'Tavolo da ritirare',
      url: 'https://example.it/post/1',
      status: 'NEW',
      sources: [{ source: 'shared', url: 'https://example.it/post/1' }],
    });
    expect(repository.listings()[0].receivedAt).toBeInstanceOf(Date);
  });

  it('merges duplicate links while preserving each capture source', async () => {
    const first = await repository.add({
      title: 'Tavolo',
      category: 'Casa',
      location: '',
      excerpt: '',
      url: 'https://example.it/post/1',
      source: 'manual',
    });
    const second = await repository.add({
      title: 'Tavolo visto di nuovo',
      category: 'Altro',
      location: '',
      excerpt: '',
      url: 'https://www.example.it/post/1?fbclid=tracking',
      source: 'shared',
    });

    expect(first).toBe('created');
    expect(second).toBe('merged');
    expect(repository.listings()).toHaveLength(1);
    expect(repository.listings()[0].sources.map((source) => source.source)).toEqual([
      'manual',
      'shared',
    ]);
  });

  it('updates status, exports data, and deletes an item', async () => {
    await repository.add({
      title: 'Lampada',
      category: 'Casa',
      location: '',
      excerpt: '',
      url: '',
      source: 'manual',
    });
    const id = repository.listings()[0].id;

    await repository.updateStatus(id, 'INTERESTED');
    expect((await repository.exportAll())[0].status).toBe('INTERESTED');

    await repository.remove(id);
    expect(repository.listings()).toHaveLength(0);
  });
});
